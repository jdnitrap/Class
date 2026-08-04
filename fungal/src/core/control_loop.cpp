#include "core/control_loop.hpp"

namespace fungal::core {

ControlLoop::ControlLoop(std::shared_ptr<Oracle> oracle,
                         std::shared_ptr<Strategy> strategy)
    : oracle_(oracle), strategy_(strategy), energy_budget_(1000) {}

CycleResult ControlLoop::run_cycle(const std::string& code_snippet) {
    total_cycles_++;

    // 1. SENSE & PREDICT: what should we expect?
    int task_type_id = 0;  // v1: single task type
    double predicted_success = sense_and_predict(task_type_id);

    // 2. CHECK ENERGY: can we afford to run?
    // Hardware-aware cost scaling: scarce resources = higher per-cycle cost
    int energy_cost = static_cast<int>(10 * energy_cost_scale_);
    if (energy_cost < 1) energy_cost = 1;  // minimum cost
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
        // Still consult oracle for metrics, but don't let it affect learning
        return result;
    }

    cycles_that_ran_++;

    // 3. GENERATE & EVALUATE: what does the strategy claim?
    StrategyResult strategy_result = generate_and_evaluate(code_snippet);
    result.strategy_claim = strategy_result.claim;
    // NOTE: strategy_confidence is internal to strategy only; self-model owns all probabilities
    result.strategy_confidence = strategy_result.strategy_confidence;  // for logging only, not control
    result.energy_spent = strategy_result.energy_cost;

    // 4. COMMIT: get oracle ground truth
    bool oracle_truth = oracle_->has_bug(code_snippet);
    result.oracle_ground_truth = oracle_truth;

    // 5. EVALUATE: was prediction correct?
    // Prediction: "I will predict success with probability P"
    // Claim: "there is/isn't a bug" (strategy claim maps to opposite of success)
    // Ground truth: oracle says bug/no bug
    bool claim_matches_truth = (strategy_result.claim == oracle_truth);
    result.prediction_correct = claim_matches_truth;

    if (claim_matches_truth) {
        successful_predictions_++;
    }

    // 6. ACT & OBSERVE: update self-model and energy
    commit_and_act(claim_matches_truth, oracle_truth, strategy_result.energy_cost,
                   task_type_id, predicted_success);

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

void ControlLoop::commit_and_act(bool prediction_correct, bool oracle_truth,
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
}

}  // namespace fungal::core
