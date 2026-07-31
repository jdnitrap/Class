#pragma once
#include <cmath>
#include <algorithm>

// ===== SUBSTRATE =====
//
// The medium in which the fungal network lives. All nodes draw from and
// contribute to a shared substrate that affects their learning capacity.
//
// Real biology: mycelium lives in soil with properties like nutrient
// availability, toxin levels, pH. The network's activity changes the
// substrate (mycelium enriches soil by decomposing matter, can pollute
// if organisms die). The substrate then affects the network.
//
// Here: substrate has three real, measured properties:
//   - nutrient_level: higher = faster learning, easier sharing
//   - toxin_level: higher = slower learning, claims degrade faster
//   - pH: affects how efficiently nodes can process information (future)
//
// Substrate changes only when nodes act: learning success enriches it,
// learning failure poisons it. This creates positive/negative feedback loops.

class Substrate {
public:
    double nutrient_level = 50.0;  // 0 = starved, 100 = optimal
    double toxin_level = 0.0;      // 0 = clean, 100 = poisoned
    double pH = 7.0;               // neutral is 7.0

    // Historical tracking for tests
    int rounds_elapsed = 0;

    // Learning efficiency combines nutrient availability and toxin impact
    // Returns a multiplier: 1.0 = normal, <1.0 = slower, >1.0 = faster
    double learning_efficiency() const {
        double nutrient_factor = nutrient_level / 100.0;     // 0 to 1
        double toxin_factor = 1.0 - (toxin_level / 100.0);   // 1 to 0

        // Both must be present for good learning
        double combined = nutrient_factor * toxin_factor;

        // Clamp to reasonable range (can't learn faster than 2x normal)
        return std::min(2.0, std::max(0.1, combined));
    }

    // Sharing efficiency: how much of a transferred nutrient reaches the recipient
    // In a clean substrate, transfer is efficient. In toxic substrate, losses increase.
    double sharing_efficiency() const {
        double base_efficiency = 0.8; // 80% baseline
        double toxin_loss = (toxin_level / 100.0) * 0.3; // toxins can reduce to 50%
        return std::max(0.3, base_efficiency - toxin_loss);
    }

    // Nodes that learn successfully enrich the substrate
    void absorb_success(int confirmed_claims, int contradicted_claims) {
        if (confirmed_claims == 0) return;

        double success_ratio = (double)confirmed_claims / (confirmed_claims + contradicted_claims + 1);

        // Success enriches: add nutrients proportional to success
        nutrient_level += confirmed_claims * 0.5;

        // Success also detoxifies: removing some toxins
        toxin_level = std::max(0.0, toxin_level - (success_ratio * 2.0));

        // Clamp nutrient to reasonable range
        nutrient_level = std::min(100.0, nutrient_level);
    }

    // Nodes that fail pollute the substrate
    void absorb_failure(int confirmed_claims, int contradicted_claims) {
        if (contradicted_claims == 0) return;

        // Failures add toxins and deplete nutrients
        toxin_level += contradicted_claims * 1.0;
        nutrient_level = std::max(0.0, nutrient_level - (contradicted_claims * 0.3));

        // Clamp toxin to reasonable range
        toxin_level = std::min(100.0, toxin_level);
    }

    // Natural degradation over time: substrate slowly recovers or decays
    // This prevents the system from getting stuck in extreme states
    void natural_decay() {
        // Slight nutrient loss (substrate gets depleted over time)
        nutrient_level *= 0.98;

        // Slight toxin loss (environment naturally cleans toxins)
        toxin_level *= 0.95;

        rounds_elapsed++;
    }

    // ===== ENVIRONMENTAL SHOCKS =====
    // Sudden changes to test network resilience

    // Poison shock: sudden toxin spike (e.g., contamination event)
    void toxin_shock(double amount = 50.0) {
        toxin_level = std::min(100.0, toxin_level + amount);
    }

    // Nutrient depletion: sudden resource loss
    void nutrient_shock(double amount = 30.0) {
        nutrient_level = std::max(0.0, nutrient_level - amount);
    }

    // Recovery event: external aid restores substrate
    void recovery_event(double nutrient_restore = 40.0, double toxin_reduce = 30.0) {
        nutrient_level = std::min(100.0, nutrient_level + nutrient_restore);
        toxin_level = std::max(0.0, toxin_level - toxin_reduce);
    }

    // Catastrophic failure: everything crashes
    void catastrophic_failure() {
        nutrient_level = 10.0;
        toxin_level = 80.0;
    }

    // ===== SUBSTRATE LEARNING =====
    // The substrate learns optimal parameters over time

    double learning_rate = 0.01;  // How fast substrate adapts
    double optimal_nutrient = 60.0;  // Target nutrient level
    double optimal_toxin = 20.0;  // Target toxin level

    // Substrate learns to move toward optimal conditions
    void learn_optimal_parameters() {
        // Move nutrient toward target
        nutrient_level += (optimal_nutrient - nutrient_level) * learning_rate;

        // Move toxin toward target (but slower recovery)
        toxin_level += (optimal_toxin - toxin_level) * learning_rate * 0.5;

        // Clamp to ranges
        nutrient_level = std::min(100.0, std::max(0.0, nutrient_level));
        toxin_level = std::min(100.0, std::max(0.0, toxin_level));
    }

    // Substrate can adjust its learning rate based on network performance
    void adjust_learning_rate(double avg_network_trust) {
        if (avg_network_trust > 0.7) {
            learning_rate *= 1.05;  // Learn faster if network is healthy
        } else if (avg_network_trust < 0.3) {
            learning_rate *= 0.95;  // Learn slower if network is struggling
        }
        learning_rate = std::min(0.05, std::max(0.005, learning_rate));  // Clamp
    }
};
