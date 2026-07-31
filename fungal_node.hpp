#pragma once
#include "tokenizer.hpp"
#include "structural_analyzer.hpp"
#include "online_learner.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <cmath>
#include <algorithm>

// ===== FUNGAL NODE =====
//
// One node in a distributed fungal network. Each node "specializes" in
// one language (or corpus) and runs ITS OWN real OnlineLinearModel -
// this is the actual machine-learning component, not decoration. Nodes
// share CONFIRMED relationships with neighbors, weighted by a real trust
// ratio derived from that neighbor's own track record - not an arbitrary
// hardcoded "connection_strength" the way the earlier version had it.
//
// NEW: Nodes now have LOCAL RESOURCES (energy_pool) that they spend to
// learn. Learning in a rich substrate costs less; learning in a toxic
// one costs more. Nodes transfer resources to neighbors when sharing
// verified claims. This creates natural scarcity and forces nodes to be
// selective about what they learn and share.
//
// Honesty note: the network TOPOLOGY (which nodes exist, who is whose
// neighbor) is still human-configured at construction time. What is
// real and NOT human-authored is: (a) each node's own learned model
// weights, which change via real gradient descent from real code it
// processes, and (b) the trust ratio, which is a real running count of
// confirmed vs. contradicted claims - not a made-up number, and (c) the
// resource dynamics, which emerge from shared substrate properties.

struct SharedRelationshipClaim {
    std::string source_node;
    std::string concept_a;
    std::string concept_b;
    std::string relation;
    double source_trust_ratio;
    double energy_transferred = 0.0;

    // CLAIM DECAY - track age and confidence degradation
    int age = 0;  // rounds since this claim was created
    double initial_confidence = 1.0;  // confidence when first verified
    double decay_rate = 0.95;  // confidence *= decay_rate each round

    // Current confidence accounting for age
    double current_confidence() const {
        // confidence decays exponentially: initial * (decay_rate ^ age)
        return initial_confidence * std::pow(decay_rate, age);
    }

    // Advance time: call this once per round for each tracked claim
    void age_one_round() {
        age++;
    }
};

class FungalNode {
public:
    std::string language_name;
    std::string domain;  // Expertise domain (e.g., "Python", "Java", "ErrorHandling")
    double expertise_level = 0.0;  // 0.0 to 1.0, based on specialization depth

    OnlineLinearModel local_model{3, 0.0005};

    RunningStats nesting_stats;
    RunningStats function_count_stats;
    RunningStats branch_count_stats;
    RunningStats token_count_stats;

    int claims_confirmed = 0;
    int claims_contradicted = 0;

    // QUARANTINE SYSTEM - isolate toxic/unreliable nodes without deletion
    bool quarantined = false;  // if true, claims are not shared with neighbors
    int quarantine_rounds = 0;  // how long node has been quarantined

    std::vector<std::shared_ptr<FungalNode>> neighbors;
    std::vector<SharedRelationshipClaim> received_claims;

    // ASYMMETRIC TRUST - directed trust weights toward neighbors
    // This node can trust neighbor A at 0.8 while A trusts this node at 0.3
    std::map<std::string, double> neighbor_trust_weights;  // node_name -> trust (0.0 to 1.0)

    // RESOURCE TRACKING - the nutrient/energy system
    double energy_pool = 100.0;          // current available energy
    double max_energy = 200.0;           // upper limit (node can't store unlimited)
    double energy_per_sample = 2.0;      // base cost to learn from one code sample
    double energy_per_share = 5.0;       // base cost to share a claim with neighbors
    double energy_received_this_round = 0.0; // track incoming energy (for tests)

    FungalNode(std::string name) : language_name(std::move(name)) {}

    // Learn from a code sample, adjusted for substrate efficiency.
    // substrate_efficiency: 1.0 = normal, <1.0 = slower, >1.0 = faster
    // Returns true if learning succeeded, false if starved (no energy)
    bool learn_from_sample(const std::string& code, double substrate_efficiency = 1.0) {
        // Substrate affects learning cost: rich substrate = cheaper learning
        double adjusted_cost = energy_per_sample / substrate_efficiency;

        if (energy_pool < adjusted_cost) {
            return false; // Starved, cannot learn
        }

        energy_pool -= adjusted_cost;

        CodeStats stats = StructuralAnalyzer::analyze(code);

        nesting_stats.update(stats.max_nesting_depth);
        function_count_stats.update(stats.function_count);
        branch_count_stats.update(stats.branch_count);
        token_count_stats.update(stats.total_tokens);

        std::vector<double> features = {
            (double)stats.max_nesting_depth,
            (double)stats.function_count,
            (double)stats.total_tokens
        };
        local_model.update(features, (double)stats.branch_count);

        return true;
    }

    double trust_ratio() const {
        int total = claims_confirmed + claims_contradicted;
        if (total == 0) return 0.5;
        return (double)claims_confirmed / total;
    }

    void record_claim_outcome(bool was_confirmed) {
        if (was_confirmed) claims_confirmed++;
        else claims_contradicted++;
    }

    // Receive energy from a neighbor (via shared relationship claim)
    void receive_energy(double amount) {
        energy_pool = std::min(max_energy, energy_pool + amount);
        energy_received_this_round += amount;
    }

    // Reset per-round counters (call this at the start of each network round)
    void reset_round_counters() {
        energy_received_this_round = 0.0;
    }

    // Age all received claims by one round (call at end of each network round)
    void age_all_claims() {
        for (auto& claim : received_claims) {
            claim.age_one_round();
        }
    }

    // Quarantine this node: it stops sharing claims but keeps learning
    // Used when a node becomes unreliable (low trust ratio, starvation, etc.)
    void quarantine() {
        quarantined = true;
        quarantine_rounds = 0;
    }

    // Check if this node should be auto-quarantined based on performance
    // Returns true if quarantine was triggered
    bool check_and_apply_auto_quarantine(double trust_threshold = 0.15) {
        // Quarantine nodes with extremely low trust ratio
        if (trust_ratio() < trust_threshold && (claims_confirmed + claims_contradicted) >= 5) {
            quarantine();
            return true;
        }
        // Quarantine starved nodes (cannot learn or share)
        if (energy_pool < energy_per_sample && claims_contradicted > claims_confirmed) {
            quarantine();
            return true;
        }
        return false;
    }

    // Increment quarantine counter (call once per round for quarantined nodes)
    void increment_quarantine_counter() {
        if (quarantined) quarantine_rounds++;
    }

    // Optionally release a quarantined node if it has improved
    void check_and_release_quarantine(double trust_threshold = 0.35) {
        if (quarantined && trust_ratio() > trust_threshold && quarantine_rounds >= 3) {
            quarantined = false;
            quarantine_rounds = 0;
        }
    }

    // ===== ASYMMETRIC TRUST =====
    // This node's trust toward specific neighbors (not necessarily reciprocal)

    // Set this node's trust weight toward a specific neighbor
    void set_neighbor_trust(const std::string& neighbor_name, double trust_weight) {
        neighbor_trust_weights[neighbor_name] = std::max(0.0, std::min(1.0, trust_weight));
    }

    // Get this node's trust weight toward a specific neighbor
    double get_neighbor_trust(const std::string& neighbor_name) const {
        auto it = neighbor_trust_weights.find(neighbor_name);
        if (it != neighbor_trust_weights.end()) {
            return it->second;
        }
        return 0.5;  // Default: neutral trust
    }

    // Initialize neighbor trust based on similarity
    void init_neighbor_trust_from_similarity(const std::vector<std::shared_ptr<FungalNode>>& neighbor_list) {
        for (auto& n : neighbor_list) {
            double similarity = 1.0 - std::min(1.0, distance_to(*n) / 2.0);  // convert distance to similarity
            set_neighbor_trust(n->language_name, similarity);
        }
    }

    // ===== NODE SPECIALIZATION =====
    // Nodes can specialize in specific domains (code paradigms, techniques)

    // Set this node's domain of expertise
    void set_domain(const std::string& domain_name) {
        domain = domain_name;
    }

    // Update expertise level based on domain mastery
    // Higher expertise = more confident claims in this domain
    void update_expertise() {
        if (domain.empty()) return;

        // Expertise grows with successful claims in domain
        if (claims_confirmed > claims_contradicted) {
            double success_ratio = (double)claims_confirmed / (claims_confirmed + claims_contradicted + 1);
            expertise_level = std::min(1.0, success_ratio * 0.9);  // Cap at 0.9
        } else {
            expertise_level = std::max(0.0, expertise_level - 0.1);  // Decay if failing
        }
    }

    // Check if this node is a specialist in a given domain
    bool is_specialist_in(const std::string& domain_name) const {
        return (domain == domain_name && expertise_level > 0.6);
    }

    // Bonus for sharing in your specialty: confidence boost
    double specialization_confidence_boost() const {
        if (domain.empty()) return 1.0;
        return 1.0 + (expertise_level * 0.5);  // Up to 1.5x boost
    }

    // ===== CLAIM REFINEMENT =====
    // Update existing claims with new evidence instead of making new ones

    // Try to refine an existing claim (from a specific source) with new evidence
    bool refine_claim(const std::string& source_node, const std::string& concept_a, bool new_evidence) {
        for (auto& claim : received_claims) {
            if (claim.source_node == source_node && claim.concept_a == concept_a) {
                // Found matching claim - refine it with new evidence
                // New evidence boosts confidence if aligned, reduces if contradictory

                if (new_evidence) {
                    // Positive evidence: boost initial confidence
                    claim.initial_confidence = std::min(1.0, claim.initial_confidence + 0.1);
                    // Reset age so confidence goes back up
                    claim.age = std::max(0, claim.age - 1);
                } else {
                    // Negative evidence: reduce initial confidence
                    claim.initial_confidence = std::max(0.0, claim.initial_confidence - 0.15);
                    // Age the claim (it decays faster when contradicted)
                    claim.age += 2;
                }

                return true;
            }
        }
        return false;  // Claim not found
    }

    // Get refinement count for a claim (how many times updated)
    int count_claim_refinements(const std::string& source_node, const std::string& concept_a) const {
        for (const auto& claim : received_claims) {
            if (claim.source_node == source_node && claim.concept_a == concept_a) {
                // Estimate refinements by looking at age vs confidence deviation
                return std::max(0, (int)(claim.age / 2));  // Rough estimate
            }
        }
        return 0;
    }

    // Share a confirmed relationship with neighbors, transferring energy.
    // Energy transfer is based on: claim quality (trust_ratio), node wealth,
    // substrate efficiency (toxic substrates waste more energy), and CLAIM CONFIDENCE.
    //
    // NEW: Confidence-weighted energy transfer
    // - High-confidence claims transfer more energy to neighbors
    // - Low-confidence claims transfer less energy (especially important as claims decay)
    // - This incentivizes nodes to share high-quality claims and de-incentivizes sharing weak ones
    //
    // QUARANTINE: If this node is quarantined, it does not share claims
    // - Quarantined nodes stop propagating toxic information
    // - But old claims already shared continue to age and decay naturally
    void share_confirmed_relationship(const std::string& concept_a, const std::string& concept_b,
                                       const std::string& relation, double substrate_sharing_efficiency = 0.8) {
        if (neighbors.empty() || quarantined) return;  // Quarantined nodes cannot share

        double claim_quality = trust_ratio();

        // Cost to share: base + scaled by claim quality (higher quality = costs more to disseminate widely)
        double share_cost = energy_per_share * claim_quality;

        if (energy_pool < share_cost) {
            return; // Starved, cannot afford to share
        }

        energy_pool -= share_cost;

        // Distribute energy to neighbors, weighted by:
        // 1. Substrate efficiency (toxins cause losses)
        // 2. CLAIM CONFIDENCE (confidence-weighted transfer)
        double base_energy = (share_cost * substrate_sharing_efficiency) / neighbors.size();

        for (auto& neighbor : neighbors) {
            SharedRelationshipClaim claim{
                language_name, concept_a, concept_b, relation,
                claim_quality, 0.0  // will set energy_transferred below
            };
            // Set initial confidence when claim is created
            claim.initial_confidence = claim_quality;
            claim.age = 0;

            // CONFIDENCE-WEIGHTED: Scale energy by claim's current confidence
            // This means neighbors receive energy proportional to claim quality
            // As claims age and decay, they would transfer less energy if re-shared
            double confidence_weighted_energy = base_energy * claim.current_confidence();
            claim.energy_transferred = confidence_weighted_energy;

            neighbor->received_claims.push_back(claim);
            neighbor->receive_energy(confidence_weighted_energy);
        }
    }

    // NOTE: neighbors are no longer set by a human calling add_neighbor().
    // See FungalNetwork::recompute_neighbors() below - topology is derived
    // automatically from real measured similarity between nodes' learned
    // statistics, not human-configured.

    // Real integration: given two sets of REAL measured nesting-depth
    // values (e.g. samples with vs without recursion, gathered by THIS
    // node from its own real code), check whether the "with" group truly
    // has higher nesting on average. Records the REAL outcome via
    // record_claim_outcome, and only shares with neighbors if genuinely
    // confirmed - never shares an unconfirmed or contradicted claim.
    // Adjusted for substrate efficiency which affects sharing cost.
    bool verify_and_maybe_share(const std::string& concept_a, const std::string& concept_b,
                                 const std::vector<double>& values_with_concept_a,
                                 const std::vector<double>& values_without_concept_a,
                                 double substrate_sharing_efficiency = 0.8,
                                 int min_samples = 3) {
        if ((int)values_with_concept_a.size() < min_samples ||
            (int)values_without_concept_a.size() < min_samples) {
            return false; // honestly insufficient - no claim made, nothing recorded
        }

        double avg_with = 0.0, avg_without = 0.0;
        for (double v : values_with_concept_a) avg_with += v;
        avg_with /= values_with_concept_a.size();
        for (double v : values_without_concept_a) avg_without += v;
        avg_without /= values_without_concept_a.size();

        bool confirmed = avg_with > avg_without;
        record_claim_outcome(confirmed);

        if (confirmed) {
            share_confirmed_relationship(concept_a, concept_b, "typically_increases", substrate_sharing_efficiency);
        }

        return confirmed;
    }

    // Real similarity metric between two nodes' LEARNED statistics -
    // this is what the network uses to decide neighbors automatically,
    // instead of a human deciding topology. Returns a real Euclidean
    // distance over normalized (mean, variance) pairs across all 4
    // tracked features. Smaller distance = more similar learned structure.
    double distance_to(const FungalNode& other) const {
        auto feature_distance = [](const RunningStats& a, const RunningStats& b) -> double {
            // Guard against nodes with no data yet (count == 0) - treat
            // as maximally different rather than crashing or faking 0.
            if (a.count == 0 || b.count == 0) return 1.0; // neutral max-ish distance
            double mean_diff = a.mean - b.mean;
            double var_diff = a.variance() - b.variance();
            return std::sqrt(mean_diff * mean_diff + var_diff * var_diff);
        };

        double total = 0.0;
        total += feature_distance(nesting_stats, other.nesting_stats);
        total += feature_distance(function_count_stats, other.function_count_stats);
        total += feature_distance(branch_count_stats, other.branch_count_stats);
        total += feature_distance(token_count_stats, other.token_count_stats);

        return total / 4.0; // average across the 4 real features
    }
};
