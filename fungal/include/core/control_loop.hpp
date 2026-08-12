#pragma once

#include "core/self_model.hpp"
#include "core/strategy.hpp"
#include "core/energy_budget.hpp"
#include "core/hardware_aware_scheduler.hpp"
#include "core/stage1_state.hpp"
#include <memory>
#include <vector>
#include <string>

namespace fungal::core {

// Oracle: provides ground truth for outcomes
// Can be real test suite or mock for spike
class Oracle {
public:
    virtual ~Oracle() = default;
    // Check if code snippet contains a bug (ground truth)
    virtual bool has_bug(const std::string& code_snippet) = 0;
};

// Result of one control loop cycle
struct CycleResult {
    std::string code_snippet;
    double predicted_success;
    bool strategy_claim;
    double strategy_confidence;
    int energy_spent;
    bool oracle_ground_truth;
    bool prediction_correct;
    bool system_had_energy;
};

// Main control loop: Sense → Predict → Generate → Evaluate → Commit → Act → Observe/Learn
class ControlLoop {
public:
    ControlLoop(std::shared_ptr<Oracle> oracle,
                std::shared_ptr<Strategy> strategy);

    // Run one cycle on a code snippet
    CycleResult run_cycle(const std::string& code_snippet);

    // Run multiple cycles
    std::vector<CycleResult> run_cycles(const std::vector<std::string>& snippets);

    // Get reference to self-model for introspection
    SelfModel& self_model() { return self_model_; }

    // Get reference to energy budget
    EnergyBudget& energy_budget() { return energy_budget_; }

    // Get reference to hardware scheduler
    HardwareAwareScheduler& hardware_scheduler() { return hardware_scheduler_; }

    // Stage1 (opt-in): durable survival state + audit log
    // Default is OFF so existing demos/tests keep prior behavior.
    void enable_stage1(bool enabled);
    bool stage1_enabled() const { return stage1_enabled_; }
    bool stage1_safe_mode() const { return stage1_safe_mode_; }
    // Load or bootstrap checkpoint; sets safe_mode on integrity failure.
    bool initialize_stage1(std::string& error);
    const Stage1State& stage1_state() const { return stage1_state_; }

    // Detect hardware and initialize
    void initialize_from_hardware();

    // Reset state
    void reset();

    // Get statistics
    int total_cycles_run() const { return total_cycles_; }
    int successful_predictions() const { return successful_predictions_; }
    int cycles_that_ran() const { return cycles_that_ran_; }

private:
    std::shared_ptr<Oracle> oracle_;
    std::shared_ptr<Strategy> strategy_;
    SelfModel self_model_;
    EnergyBudget energy_budget_;
    HardwareAwareScheduler hardware_scheduler_;

    int total_cycles_ = 0;
    int successful_predictions_ = 0;
    int cycles_that_ran_ = 0;

    // Hardware-aware scaling
    double energy_cost_scale_ = 1.0;  // multiplier for per-cycle energy cost

    // Stage1 persistence (opt-in)
    bool stage1_enabled_ = false;
    bool stage1_safe_mode_ = false;
    Stage1Store stage1_store_{};
    Stage1State stage1_state_{};
    IdentityCore stage1_identity_{};

    void sync_stage1_from_live();
    bool persist_stage1_after_cycle(const AuditEvent& post_template, std::string& error);

    // The main cycle steps
    double sense_and_predict(int task_type_id);
    StrategyResult generate_and_evaluate(const std::string& code_snippet);
    void commit_and_act(bool prediction_correct, bool oracle_truth, int energy_cost, int task_type_id, double predicted_prob);
};

}  // namespace fungal::core
