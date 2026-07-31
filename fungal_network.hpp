#pragma once
#include "fungal_node.hpp"
#include "substrate.hpp"
#include <vector>
#include <memory>
#include <algorithm>
#include <iostream>

// ===== FUNGAL NETWORK =====
//
// Owns a collection of FungalNodes and the shared Substrate they inhabit.
// Derives WHO IS NEIGHBORS WITH WHOM automatically from real measured
// similarity between nodes' learned statistics.
//
// NEW: The network manages a shared Substrate that affects all nodes' learning
// capacity. Substrate is enriched by successful nodes, poisoned by failed ones.
// This creates positive/negative feedback loops and self-regulation.
//
// Honesty notes:
//   - K (how many neighbors each node gets) IS a human-set parameter.
//   - Substrate initial state (nutrient_level, toxin_level) IS human-set.
//   - Everything ABOVE those (which nodes connect, how substrate evolves,
//     how nodes learn from it) is derived from real data and measured outcomes.
//   - Nodes with no data yet (count == 0 on all stats) are correctly
//     treated as maximally distant from everything.

// Removal strategy options for the network
enum class RemovalStrategy {
    THRESHOLD_BASED,      // Remove when trust_ratio < threshold
    STARVATION_BASED,     // Remove when energy = 0 and can't recover
    CONSENSUS_BASED,      // Neighbors vote on removal
    TWO_STAGE,            // Quarantine first, then remove if unimproved
    HYBRID                // Combine multiple strategies
};

class FungalNetwork {
public:
    std::vector<std::shared_ptr<FungalNode>> nodes;
    int k_neighbors;
    Substrate substrate;
    RemovalStrategy removal_strategy = RemovalStrategy::TWO_STAGE;

    // ===== HARDWARE CONSTRAINTS =====
    // Network is aware of hardware limits and adapts accordingly
    int max_nodes = 100;              // Hardware limit: max nodes before system degrades
    int computational_cost_per_node = 1;  // Relative CPU cost per node
    int memory_per_node = 1;          // Relative memory per node (KB units)

    int total_computational_budget = 100;  // Max total computation units available
    int total_memory_budget = 100;    // Max total memory units available

    // Monitor current resource usage
    int current_computation_cost = 0;
    int current_memory_usage = 0;
    double hardware_pressure = 0.0;   // 0.0 = no pressure, 1.0 = maxed out

    // Removal thresholds (configurable)
    double removal_trust_threshold = 0.05;      // Permanent removal if trust < this
    double quarantine_trust_threshold = 0.15;   // Quarantine if trust < this
    double release_trust_threshold = 0.35;      // Release from quarantine if > this
    int quarantine_max_rounds = 10;             // Max rounds in quarantine before forced removal
    int starvation_recovery_rounds = 5;         // Rounds to try recovering before starvation removal
    double consensus_removal_threshold = 0.6;   // % of neighbors that must vote removal

    FungalNetwork(int k = 2) : k_neighbors(k) {}

    std::shared_ptr<FungalNode> add_node(const std::string& name) {
        auto node = std::make_shared<FungalNode>(name);
        nodes.push_back(node);
        return node;
    }

    void recompute_neighbors() {
        for (auto& node : nodes) {
            std::vector<std::pair<double, std::shared_ptr<FungalNode>>> distances;

            for (auto& other : nodes) {
                if (other.get() == node.get()) continue;
                distances.push_back({node->distance_to(*other), other});
            }

            std::sort(distances.begin(), distances.end(),
                      [](const auto& a, const auto& b) { return a.first < b.first; });

            node->neighbors.clear();
            int count = std::min((int)distances.size(), k_neighbors);
            for (int i = 0; i < count; i++) {
                node->neighbors.push_back(distances[i].second);
            }
        }
    }

    // CASCADE-SAFE REMOVAL: Remove a node without breaking the network
    // - Removes node from the nodes list
    // - Removes it from all other nodes' neighbor lists
    // - Recomputes neighbors for affected nodes
    // - Preserves received claims (they age and decay naturally)
    bool remove_node_safe(const std::string& node_name) {
        auto it = std::find_if(nodes.begin(), nodes.end(),
                              [&](const auto& n) { return n->language_name == node_name; });

        if (it == nodes.end()) return false;  // Node not found

        // Remove from all neighbors lists
        for (auto& node : nodes) {
            auto neighbor_it = std::find(node->neighbors.begin(), node->neighbors.end(), *it);
            if (neighbor_it != node->neighbors.end()) {
                node->neighbors.erase(neighbor_it);
            }
        }

        // Remove the node from the network
        nodes.erase(it);

        // Recompute neighbors for all remaining nodes so they find replacements
        if (!nodes.empty()) {
            recompute_neighbors();
        }

        return true;
    }

    // Auto-quarantine check: quarantine any nodes that have become toxic
    // Returns count of nodes quarantined
    int apply_quarantine_checks(double trust_threshold = 0.15) {
        int quarantined_count = 0;
        for (auto& node : nodes) {
            if (node->check_and_apply_auto_quarantine(trust_threshold)) {
                quarantined_count++;
            }
        }
        return quarantined_count;
    }

    // Update quarantine status: increment counters and check for releases
    void update_quarantine_status(double release_threshold = 0.35) {
        for (auto& node : nodes) {
            node->increment_quarantine_counter();
            node->check_and_release_quarantine(release_threshold);
        }
    }

    // ===== REMOVAL STRATEGIES =====

    // Strategy 1: THRESHOLD-BASED REMOVAL
    // Permanently remove nodes that fall below trust threshold
    int apply_threshold_based_removal() {
        int removed_count = 0;
        std::vector<std::string> to_remove;

        for (auto& node : nodes) {
            if (node->trust_ratio() < removal_trust_threshold &&
                (node->claims_confirmed + node->claims_contradicted) >= 3) {
                to_remove.push_back(node->language_name);
            }
        }

        for (const auto& name : to_remove) {
            if (remove_node_safe(name)) {
                removed_count++;
            }
        }

        return removed_count;
    }

    // Strategy 2: STARVATION-BASED REMOVAL
    // Nodes with zero energy that can't recover are removed
    int apply_starvation_based_removal() {
        int removed_count = 0;
        std::vector<std::string> to_remove;

        for (auto& node : nodes) {
            bool starved = (node->energy_pool < node->energy_per_sample);
            bool low_trust = (node->trust_ratio() < 0.3);
            bool many_failures = (node->claims_contradicted > node->claims_confirmed);

            if (starved && low_trust && many_failures) {
                to_remove.push_back(node->language_name);
            }
        }

        for (const auto& name : to_remove) {
            if (remove_node_safe(name)) {
                removed_count++;
            }
        }

        return removed_count;
    }

    // Strategy 3: CONSENSUS-BASED REMOVAL
    // Neighbors vote on whether to remove a node
    int apply_consensus_based_removal() {
        int removed_count = 0;
        std::vector<std::string> to_remove;

        for (auto& node : nodes) {
            if (node->neighbors.empty()) continue;

            // Neighbors vote: is this node bad?
            int vote_removal = 0;
            for (auto& neighbor : node->neighbors) {
                // Vote YES for removal if neighbor sees this node as unreliable
                if (node->trust_ratio() < 0.2 && node->claims_contradicted > 0) {
                    vote_removal++;
                }
            }

            // Check if removal threshold met
            double removal_ratio = (double)vote_removal / node->neighbors.size();
            if (removal_ratio >= consensus_removal_threshold && node->trust_ratio() < 0.2) {
                to_remove.push_back(node->language_name);
            }
        }

        for (const auto& name : to_remove) {
            if (remove_node_safe(name)) {
                removed_count++;
            }
        }

        return removed_count;
    }

    // Strategy 4: TWO-STAGE REMOVAL (Quarantine → Removal)
    // Stage 1: Quarantine bad nodes
    // Stage 2: Permanently remove if they don't improve after N rounds
    int apply_two_stage_removal() {
        int removed_count = 0;
        std::vector<std::string> to_remove;

        for (auto& node : nodes) {
            if (node->quarantined) {
                // Check if quarantine has lasted too long without improvement
                if (node->quarantine_rounds >= quarantine_max_rounds) {
                    to_remove.push_back(node->language_name);
                }
            }
        }

        for (const auto& name : to_remove) {
            if (remove_node_safe(name)) {
                removed_count++;
            }
        }

        return removed_count;
    }

    // Strategy 5: HYBRID REMOVAL
    // Combine multiple strategies for robust decision-making
    int apply_hybrid_removal() {
        int removed_count = 0;

        // Apply multiple criteria
        removed_count += apply_threshold_based_removal();
        removed_count += apply_starvation_based_removal();
        removed_count += apply_two_stage_removal();

        return removed_count;
    }

    // Main removal dispatch: apply selected strategy
    int apply_removal_strategy() {
        switch (removal_strategy) {
            case RemovalStrategy::THRESHOLD_BASED:
                return apply_threshold_based_removal();
            case RemovalStrategy::STARVATION_BASED:
                return apply_starvation_based_removal();
            case RemovalStrategy::CONSENSUS_BASED:
                return apply_consensus_based_removal();
            case RemovalStrategy::TWO_STAGE:
                return apply_two_stage_removal();
            case RemovalStrategy::HYBRID:
                return apply_hybrid_removal();
            default:
                return 0;
        }
    }

    void print_topology() const {
        for (auto& node : nodes) {
            std::cout << "  " << node->language_name << " -> neighbors: ";
            for (auto& n : node->neighbors) std::cout << n->language_name << " ";
            std::cout << "\n";
        }
    }

    // Update substrate based on node performance from this round
    void update_substrate_from_nodes() {
        for (auto& node : nodes) {
            if (node->claims_confirmed > node->claims_contradicted) {
                substrate.absorb_success(node->claims_confirmed, node->claims_contradicted);
            } else if (node->claims_contradicted > 0) {
                substrate.absorb_failure(node->claims_confirmed, node->claims_contradicted);
            }
        }

        // Natural decay (substrate recovers or decays on its own over time)
        substrate.natural_decay();
    }

    // Allow nodes to learn from a code sample, aware of current substrate efficiency
    // Returns count of nodes that successfully learned (not starved)
    int teach_all_nodes(const std::vector<std::string>& samples) {
        int successful_learners = 0;
        double efficiency = substrate.learning_efficiency();

        for (auto& node : nodes) {
            for (auto& sample : samples) {
                if (node->learn_from_sample(sample, efficiency)) {
                    successful_learners++;
                }
            }
        }

        return successful_learners;
    }

    // Run a complete learning round:
    // 1. Nodes learn from samples (substrate-aware)
    // 2. Nodes verify claims and share with neighbors (substrate-aware)
    // 3. Substrate updates based on outcomes
    // 4. Age all claims (claim decay)
    // 5. Check quarantine status (auto-quarantine bad nodes, check for releases)
    // 6. Reset per-round counters
    void run_round(const std::vector<std::string>& samples) {
        // Reset per-round tracking
        for (auto& node : nodes) {
            node->reset_round_counters();
        }

        // Nodes learn from code samples (substrate affects cost)
        teach_all_nodes(samples);

        // Substrate updates based on what happened this round
        update_substrate_from_nodes();

        // Age all received claims (they lose confidence over time)
        for (auto& node : nodes) {
            node->age_all_claims();
        }

        // Check and apply quarantine: isolate bad nodes before next round
        apply_quarantine_checks();

        // Update quarantine status: increment counters, check for releases
        update_quarantine_status();

        // Apply removal strategy (remove permanently bad nodes)
        apply_removal_strategy();
    }

    // Print detailed substrate and node state for diagnostics
    void print_state() const {
        std::cout << "\n=== SUBSTRATE STATE ===\n";
        std::cout << "  Nutrient Level: " << substrate.nutrient_level << " / 100\n";
        std::cout << "  Toxin Level: " << substrate.toxin_level << " / 100\n";
        std::cout << "  Learning Efficiency: " << substrate.learning_efficiency() << "x\n";
        std::cout << "  Sharing Efficiency: " << substrate.sharing_efficiency() << "\n";
        std::cout << "  Rounds Elapsed: " << substrate.rounds_elapsed << "\n";

        std::cout << "\n=== NODE STATE ===\n";
        for (auto& node : nodes) {
            std::cout << "  " << node->language_name << ":\n";
            std::cout << "    Energy: " << node->energy_pool << " / " << node->max_energy << "\n";
            std::cout << "    Claims: " << node->claims_confirmed << " confirmed, "
                      << node->claims_contradicted << " contradicted\n";
            std::cout << "    Trust Ratio: " << node->trust_ratio() << "\n";
        }
    }

    // ===== MULTI-NETWORK LEARNING =====
    // Networks can exchange high-confidence claims across a bridge

    // Exchange high-confidence claims with another network
    // Only claims with confidence > threshold are shared
    void exchange_with_network(FungalNetwork& other_network, double confidence_threshold = 0.7) {
        // Find high-confidence claims in this network
        std::vector<SharedRelationshipClaim> high_conf_claims;

        for (auto& node : nodes) {
            for (const auto& claim : node->received_claims) {
                if (claim.current_confidence() > confidence_threshold) {
                    high_conf_claims.push_back(claim);
                }
            }
        }

        // Share with other network's nodes
        for (auto& claim : high_conf_claims) {
            if (!other_network.nodes.empty()) {
                // Give to a random node in the other network
                int idx = claim.source_node.length() % other_network.nodes.size();
                other_network.nodes[idx]->received_claims.push_back(claim);
            }
        }
    }

    // ===== MEASUREMENT UNCERTAINTY =====
    // Add noise to code analysis to simulate imperfect measurements

    double measurement_noise = 0.0;  // 0.0 = perfect, 1.0 = very noisy

    // Set measurement noise level (0.0 to 1.0)
    void set_measurement_noise(double noise_level) {
        measurement_noise = std::max(0.0, std::min(1.0, noise_level));
    }

    // Apply measurement uncertainty to a statistic value
    double apply_measurement_noise(double true_value) const {
        if (measurement_noise <= 0.0) return true_value;

        // Add random error proportional to noise level
        double error_magnitude = true_value * measurement_noise * 0.3;  // Up to 30% error
        double random_offset = ((double)rand() / RAND_MAX - 0.5) * 2.0 * error_magnitude;

        return std::max(0.0, true_value + random_offset);
    }

    // Count nodes with measurement disagreement (conflicting observations)
    int count_measurement_disagreements() const {
        if (measurement_noise <= 0.0) return 0;

        int disagreements = 0;
        for (int i = 0; i < (int)nodes.size(); i++) {
            for (int j = i + 1; j < (int)nodes.size(); j++) {
                // Check if similar node pairs see different statistics due to noise
                double dist = nodes[i]->distance_to(*nodes[j]);
                if (dist < 0.5 && measurement_noise > 0.3) {
                    disagreements++;
                }
            }
        }
        return disagreements;
    }

    // ===== PHASE 12: DYNAMIC NODE GROWTH WITH HARDWARE CONSTRAINTS =====

    // Update resource usage based on current node count
    void update_hardware_pressure() {
        current_computation_cost = (int)nodes.size() * computational_cost_per_node;
        current_memory_usage = (int)nodes.size() * memory_per_node;

        // Calculate hardware pressure (0.0 to 1.0)
        double cpu_pressure = (double)current_computation_cost / total_computational_budget;
        double mem_pressure = (double)current_memory_usage / total_memory_budget;
        hardware_pressure = std::max(cpu_pressure, mem_pressure);

        // Clamp to valid range
        hardware_pressure = std::min(1.0, std::max(0.0, hardware_pressure));
    }

    // Can we create a new node given hardware constraints?
    bool can_create_node() const {
        if ((int)nodes.size() >= max_nodes) return false;
        if (current_computation_cost + computational_cost_per_node > total_computational_budget) return false;
        if (current_memory_usage + memory_per_node > total_memory_budget) return false;
        return true;
    }

    // Node reproduction: healthy node creates offspring
    // Returns true if offspring was created
    bool reproduce_node(const std::string& parent_name) {
        // Find parent
        std::shared_ptr<FungalNode> parent = nullptr;
        for (auto& n : nodes) {
            if (n->language_name == parent_name) {
                parent = n;
                break;
            }
        }
        if (!parent) return false;

        // Parent must be healthy and have excess energy
        double energy_threshold = parent->max_energy * 0.6;  // 60% full
        if (parent->energy_pool < energy_threshold) return false;
        if (parent->trust_ratio() < 0.5) return false;

        // Check hardware constraints
        if (!can_create_node()) return false;

        // Create offspring
        std::string offspring_name = parent->language_name + "_Gen" + std::to_string(nodes.size());
        auto offspring = std::make_shared<FungalNode>(offspring_name);

        // Inherit parent's specialization
        offspring->set_domain(parent->domain);
        offspring->expertise_level = parent->expertise_level * 0.8;  // Slightly reduced

        // Inherit some energy from parent
        double energy_transfer = parent->energy_pool * 0.3;
        parent->energy_pool -= energy_transfer;
        offspring->energy_pool = energy_transfer;

        // Inherit some trust from parent (but reduced due to lack of proven track record)
        for (int i = 0; i < (int)(parent->claims_confirmed * 0.1); i++) {
            offspring->record_claim_outcome(true);
        }

        nodes.push_back(offspring);
        update_hardware_pressure();

        return true;
    }

    // Network growth rate modulation based on hardware pressure
    double get_growth_rate_multiplier() const {
        // At 0 pressure: 1.0x (can grow freely)
        // At 0.5 pressure: 0.5x (half speed)
        // At 1.0 pressure: 0.0x (no growth)
        return std::max(0.0, 1.0 - hardware_pressure);
    }

    // Attempt growth for all eligible nodes
    int attempt_network_growth() {
        update_hardware_pressure();

        int births = 0;
        double growth_chance = get_growth_rate_multiplier();

        for (auto& node : nodes) {
            // Nodes with high energy and good reputation reproduce
            if (node->energy_pool > node->max_energy * 0.6 && node->trust_ratio() > 0.6) {
                // Probability of reproduction decreases as hardware pressure increases
                double reproduce_prob = growth_chance * node->expertise_level;

                if (((double)rand() / RAND_MAX) < reproduce_prob) {
                    if (reproduce_node(node->language_name)) {
                        births++;
                    }
                }
            }
        }

        return births;
    }

    // Get hardware status for monitoring
    struct HardwareStatus {
        int node_count;
        int computation_usage;
        int computation_budget;
        int memory_usage;
        int memory_budget;
        double pressure;
        bool at_limit;
    };

    HardwareStatus get_hardware_status() const {
        return {
            (int)nodes.size(),
            current_computation_cost,
            total_computational_budget,
            current_memory_usage,
            total_memory_budget,
            hardware_pressure,
            (int)nodes.size() >= max_nodes
        };
    }
};
