#include "core/control_loop.hpp"

#include <functional>

namespace fungal::core {

ControlLoop::ControlLoop(std::shared_ptr<Oracle> oracle,
                         std::shared_ptr<Strategy> strategy)
    : oracle_(oracle), strategy_(strategy), energy_budget_(1000) {}

void ControlLoop::enable_stage1(bool enabled) {
    stage1_enabled_ = enabled;
    if (!enabled) {
        stage1_safe_mode_ = false;
    }
}

bool ControlLoop::initialize_stage1(std::string& error) {
    stage1_enabled_ = true;
    if (!stage1_store_.load_or_bootstrap(stage1_state_, error)) {
        stage1_safe_mode_ = true;
        return false;
    }

    apply_survival_budget(energy_budget_, stage1_state_.survival);
    self_model_.import_all(stage1_state_.task_types);

    total_cycles_ = stage1_state_.counters.total_cycles;
    cycles_that_ran_ = stage1_state_.counters.cycles_that_ran;
    successful_predictions_ = stage1_state_.counters.successful_predictions;

    if (!stage1_state_.identity.created_at.empty()) {
        stage1_identity_ = stage1_state_.identity;
    } else {
        stage1_identity_.created_at = Stage1Store::now_iso8601();
        stage1_state_.identity = stage1_identity_;
    }

    stage1_safe_mode_ = false;
    return true;
}

void ControlLoop::sync_stage1_from_live() {
    stage1_state_ = capture_state_from_live(
        stage1_identity_,
        energy_budget_,
        self_model_,
        CounterState{
            total_cycles_,
            cycles_that_ran_,
            successful_predictions_,
            stage1_state_.counters.skipped_no_energy,
            stage1_state_.counters.blocked_by_legibility
        },
        stage1_state_.survival.checkpoint_seq);
    stage1_state_.survival.budget_min = stage1_state_.survival.budget_min > 0
        ? stage1_state_.survival.budget_min
        : 10;
    stage1_state_.survival.alive = true;
}

bool ControlLoop::persist_stage1_after_cycle(const AuditEvent& post_template, std::string& error) {
    stage1_state_.survival.checkpoint_seq += 1;
    sync_stage1_from_live();

    if (!stage1_store_.save_checkpoint(stage1_state_, error)) {
        stage1_safe_mode_ = true;
        return false;
    }

    AuditEvent post = post_template;
    post.ts = Stage1Store::now_iso8601();
    post.phase = AuditPhase::Postcheck;
    post.checkpoint_seq = stage1_state_.survival.checkpoint_seq;
    post.energy_after = energy_budget_.current_budget();

    if (!stage1_store_.append_audit(post, error)) {
        stage1_safe_mode_ = true;
        stage1_state_.counters.blocked_by_legibility += 1;
        return false;
    }
    return true;
}

CycleResult ControlLoop::run_cycle(const std::string& code_snippet) {
    total_cycles_++;

    // 1. SENSE & PREDICT: what should we expect?
    int task_type_id = 0;  // v1: single task type
    double predicted_success = sense_and_predict(task_type_id);

    // 2. CHECK ENERGY: can we afford to run?
    // Hardware-aware cost scaling: scarce resources = higher per-cycle cost
    int energy_cost = static_cast<int>(10 * energy_cost_scale_);
    if (energy_cost < 1) energy_cost = 1;  // minimum cost

    // Stage1 precheck (optional path). When disabled, preserve original behavior.
    if (stage1_enabled_) {
        if (stage1_safe_mode_) {
            CycleResult blocked{};
            blocked.code_snippet = code_snippet;
            blocked.predicted_success = predicted_success;
            blocked.energy_spent = 0;
            blocked.system_had_energy = false;
            return blocked;
        }

        sync_stage1_from_live();
        const bool audit_ok = stage1_store_.audit_writable();
        const bool recovery_ok = stage1_store_.recovery_path_ok();
        GateResult gate = precheck_action(stage1_state_, energy_cost, audit_ok, recovery_ok);

        AuditEvent pre{};
        pre.ts = Stage1Store::now_iso8601();
        pre.cycle_id = static_cast<std::uint64_t>(total_cycles_);
        pre.checkpoint_seq = stage1_state_.survival.checkpoint_seq;
        pre.phase = AuditPhase::Precheck;
        pre.action = "run_cycle";
        pre.input_ref = std::to_string(std::hash<std::string>{}(code_snippet));
        pre.energy_before = energy_budget_.current_budget();
        pre.energy_spent = 0;
        pre.energy_after = pre.energy_before;
        pre.goal_gate = gate.blocked_by;
        pre.allowed = gate.allowed;
        pre.prediction = predicted_success;
        pre.notes = gate.reason;

        if (!gate.allowed) {
            if (gate.blocked_by == GoalGate::Survive &&
                gate.reason == "insufficient_energy") {
                pre.outcome = CycleOutcome::SkippedNoEnergy;
                stage1_state_.counters.skipped_no_energy += 1;
            } else if (gate.blocked_by == GoalGate::Legible) {
                pre.outcome = CycleOutcome::Blocked;
                stage1_state_.counters.blocked_by_legibility += 1;
            } else {
                pre.outcome = CycleOutcome::Blocked;
            }
        } else {
            pre.outcome = CycleOutcome::Ran;
        }

        std::string err;
        if (!stage1_store_.append_audit(pre, err)) {
            stage1_safe_mode_ = true;
            stage1_state_.counters.blocked_by_legibility += 1;
            CycleResult blocked{};
            blocked.code_snippet = code_snippet;
            blocked.predicted_success = predicted_success;
            blocked.system_had_energy = false;
            return blocked;
        }

        if (!gate.allowed) {
            CycleResult blocked{};
            blocked.code_snippet = code_snippet;
            blocked.predicted_success = predicted_success;
            blocked.energy_spent = 0;
            blocked.system_had_energy = false;
            return blocked;
        }
    }

    bool has_energy = energy_budget_.spend_for_cycle(energy_cost);

    CycleResult result{
        .code_snippet = code_snippet,
        .predicted_success = predicted_success,
        .strategy_claim = false,
        .strategy_confidence = 0.0,
        .energy_spent = energy_cost,
        .oracle_ground_truth = false,
        .prediction_correct = false,
        .system_had_energy = has_energy
    };

    if (!has_energy) {
        // Budget exhausted: cannot run this cycle
        if (stage1_enabled_) {
            stage1_state_.counters.skipped_no_energy += 1;
            AuditEvent post{};
            post.cycle_id = static_cast<std::uint64_t>(total_cycles_);
            post.action = "run_cycle";
            post.input_ref = std::to_string(std::hash<std::string>{}(code_snippet));
            post.energy_before = energy_budget_.current_budget();
            post.energy_spent = 0;
            post.goal_gate = GoalGate::Survive;
            post.allowed = false;
            post.prediction = predicted_success;
            post.outcome = CycleOutcome::SkippedNoEnergy;
            post.notes = "spend_failed_after_precheck";
            std::string err;
            // Best-effort audit; still no learning update.
            stage1_store_.append_audit(post, err);
        }
        return result;
    }

    cycles_that_ran_++;

    // 3. GENERATE & EVALUATE: what does the strategy claim?
    StrategyResult strategy_result = generate_and_evaluate(code_snippet);
    result.strategy_claim = strategy_result.claim;
    // NOTE: strategy_confidence is internal to strategy only; self-model owns all probabilities
    result.strategy_confidence = strategy_result.strategy_confidence;  // for logging only, not control
    // Keep spent energy as the gated cost; strategy may report its own internal cost for refunds.
    int refund_cost = strategy_result.energy_cost > 0 ? strategy_result.energy_cost : energy_cost;
    result.energy_spent = energy_cost;

    // 4. COMMIT: get oracle ground truth
    bool oracle_truth = oracle_->has_bug(code_snippet);
    result.oracle_ground_truth = oracle_truth;

    // 5. EVALUATE: was prediction correct?
    bool claim_matches_truth = (strategy_result.claim == oracle_truth);
    result.prediction_correct = claim_matches_truth;

    if (claim_matches_truth) {
        successful_predictions_++;
    }

    // 6. ACT & OBSERVE: update self-model and energy
    commit_and_act(claim_matches_truth, oracle_truth, refund_cost,
                   task_type_id, predicted_success);

    if (stage1_enabled_ && !stage1_safe_mode_) {
        AuditEvent post{};
        post.cycle_id = static_cast<std::uint64_t>(total_cycles_);
        post.action = "run_cycle";
        post.input_ref = std::to_string(std::hash<std::string>{}(code_snippet));
        post.energy_before = energy_budget_.current_budget() + /* approximate */ 0;
        post.energy_spent = energy_cost;
        post.goal_gate = GoalGate::None;
        post.allowed = true;
        post.claim = strategy_result.claim;
        post.oracle_truth = oracle_truth;
        post.prediction = predicted_success;
        post.prediction_correct = claim_matches_truth;
        post.outcome = claim_matches_truth ? CycleOutcome::Success : CycleOutcome::Fail;
        post.notes = "cycle_complete";

        // energy_before for postcheck: after refund; pre energy is less important than after.
        post.energy_before = energy_budget_.current_budget();

        std::string err;
        if (!persist_stage1_after_cycle(post, err)) {
            // safe_mode set inside persist; result still returned for visibility
        }
    }

    return result;
}

std::vector<CycleResult> ControlLoop::run_cycles(const std::vector<std::string>& snippets) {
    std::vector<CycleResult> results;
    for (const auto& snippet : snippets) {
        results.push_back(run_cycle(snippet));
    }
    return results;
}

double ControlLoop::sense_and_predict(int task_type_id) {
    // SENSE: current state = self-model state
    // PREDICT: what's our predicted success probability?
    return self_model_.predict_success(task_type_id);
}

StrategyResult ControlLoop::generate_and_evaluate(const std::string& code_snippet) {
    // GENERATE: apply strategy
    // EVALUATE: get strategy's claim and confidence
    return strategy_->apply(code_snippet);
}

void ControlLoop::commit_and_act(bool prediction_correct, bool /*oracle_truth*/,
                                  int energy_cost, int task_type_id, double predicted_prob) {
    // ACT: energy refund/penalty based on outcome
    energy_budget_.refund_outcome(prediction_correct, energy_cost);

    // OBSERVE/LEARN: update self-model from ground truth
    // outcome_correct: did our strategy's claim match the oracle?
    self_model_.update_from_outcome(task_type_id, prediction_correct, predicted_prob);
}

void ControlLoop::initialize_from_hardware() {
    // Detect hardware
    HardwareProfile profile = hardware_scheduler_.detect_hardware();

    // Set energy budget based on hardware
    energy_budget_.set_budget_from_hardware(profile);

    // Compute batch parameters and store energy cost scale for per-cycle use
    TaskBatchParameters params = hardware_scheduler_.compute_batch_parameters(profile);
    energy_cost_scale_ = params.energy_cost_scale;
}

void ControlLoop::reset() {
    total_cycles_ = 0;
    successful_predictions_ = 0;
    cycles_that_ran_ = 0;
    energy_budget_.reset();
    self_model_ = SelfModel();
    // Stage1 counters in memory reset; durable file is not wiped automatically.
    stage1_state_.counters = CounterState{};
    stage1_safe_mode_ = false;
}

}  // namespace fungal::core
