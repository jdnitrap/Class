#include "core/self_model.hpp"
#include <cmath>
#include <algorithm>

namespace fungal::core {

SelfModel::SelfModel() {
    // Initialize with one task type (v1: single type only)
    models_.resize(1, TaskTypeStats{});
}

double SelfModel::predict_success(int task_type_id) {
    auto& stats = get_or_create(task_type_id);
    // Return μ as the prediction
    return stats.success_mean;
}

double SelfModel::get_uncertainty(int task_type_id) const {
    if (task_type_id >= static_cast<int>(models_.size())) {
        return 0.3;  // default if not found
    }
    return models_[task_type_id].success_stddev;
}

void SelfModel::update_from_outcome(int task_type_id, bool ground_truth, double predicted_prob) {
    auto& stats = get_or_create(task_type_id);

    // Update belief: Bayesian adjustment of μ and σ
    update_belief(stats, ground_truth);

    // Calibration tracking: does predicted prob match empirical outcome?
    stats.total_predictions++;
    if (ground_truth && predicted_prob > 0.5) {
        // Predicted success and got success
        stats.accurate_predictions++;
    } else if (!ground_truth && predicted_prob <= 0.5) {
        // Predicted failure and got failure
        stats.accurate_predictions++;
    }

    // Update empirical success rate (rolling exponential smoothing)
    double alpha = 0.1;  // smoothing factor
    stats.empirical_success_rate = alpha * (ground_truth ? 1.0 : 0.0) +
                                   (1.0 - alpha) * stats.empirical_success_rate;

    // Calibration error: divergence between predicted and empirical
    // E.g., if we predict 70% success but see 40%, error = 0.3
    if (predicted_prob > 0.5) {
        stats.calibration_error = std::abs(predicted_prob - stats.empirical_success_rate);
    } else {
        stats.calibration_error = std::abs((1.0 - predicted_prob) - (1.0 - stats.empirical_success_rate));
    }
}

double SelfModel::get_calibration_error(int task_type_id) const {
    if (task_type_id >= static_cast<int>(models_.size())) {
        return 0.0;
    }
    return models_[task_type_id].calibration_error;
}

double SelfModel::get_accuracy(int task_type_id) const {
    if (task_type_id >= static_cast<int>(models_.size())) {
        return 0.5;
    }
    const auto& stats = models_[task_type_id];
    if (stats.total_predictions == 0) {
        return 0.5;
    }
    return static_cast<double>(stats.accurate_predictions) / stats.total_predictions;
}

double SelfModel::get_empirical_success_rate(int task_type_id) const {
    if (task_type_id >= static_cast<int>(models_.size())) {
        return 0.5;
    }
    return models_[task_type_id].empirical_success_rate;
}

TaskTypeStats& SelfModel::get_or_create(int task_type_id) {
    if (task_type_id >= static_cast<int>(models_.size())) {
        models_.resize(task_type_id + 1, TaskTypeStats{});
    }
    return models_[task_type_id];
}

TaskTypeStats SelfModel::get_stats(int task_type_id) const {
    if (task_type_id >= static_cast<int>(models_.size())) {
        return TaskTypeStats{};
    }
    return models_[task_type_id];
}

void SelfModel::update_belief(TaskTypeStats& stats, bool ground_truth) {
    // Bayesian update: outcome informs μ and σ
    // If prediction matched reality, increase confidence (lower σ)
    // If prediction missed, increase uncertainty (higher σ)

    double outcome_value = ground_truth ? 1.0 : 0.0;

    // Update mean: move toward observed outcome
    double learning_rate = 0.15;
    stats.success_mean = (1.0 - learning_rate) * stats.success_mean +
                         learning_rate * outcome_value;

    // Update uncertainty: prediction error reduces confidence
    double prediction_error = std::abs(outcome_value - stats.success_mean);

    // If close prediction, reduce σ (we were right); if far prediction, increase σ
    if (prediction_error < 0.2) {
        // Good prediction: tighten confidence
        stats.success_stddev *= 0.95;
    } else {
        // Bad prediction: increase uncertainty
        stats.success_stddev *= 1.05;
    }

    // Clamp σ to reasonable range
    stats.success_stddev = std::max(0.05, std::min(0.5, stats.success_stddev));
}

}  // namespace fungal::core
