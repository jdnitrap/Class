#pragma once
#include <string>
#include <vector>
#include <utility>
#include <map>
#include <cmath>
#include <algorithm>

// ===== REAL ONLINE LEARNING MODEL =====
//
// This replaces hardcoded "if entropy > 2.5, sensitivity = 8" thresholds with
// an actual incremental learning algorithm: Welford's online algorithm for
// running mean/variance (numerically stable, real statistics, one pass, no
// need to store all historical data), feeding a simple linear model whose
// weights are updated via gradient descent on real observed outcomes.
//
// What makes this "real learning" rather than decoration:
//   1. It maintains actual sufficient statistics (mean, variance) that are
//      mathematically exact online estimators, not string-matched heuristics.
//   2. It has real weights that change via gradient updates based on
//      observed error, not fixed if/else branches a human wrote in advance.
//   3. Predictions genuinely improve as more (feature, outcome) pairs are
//      seen — this is verifiable by feeding it a known relationship and
//      checking the learned weight converges toward the true value.

// Welford's algorithm: numerically stable running mean and variance
// computed in a single pass, without storing the full history.
class RunningStats {
public:
    long long count = 0;
    double mean = 0.0;
    double m2 = 0.0; // sum of squared differences from the mean

    void update(double x) {
        count++;
        double delta = x - mean;
        mean += delta / count;
        double delta2 = x - mean;
        m2 += delta * delta2;
    }

    double variance() const {
        return count > 1 ? m2 / (count - 1) : 0.0;
    }

    double stddev() const {
        return std::sqrt(std::max(0.0, variance()));
    }

    // z-score: how many standard deviations x is from the running mean.
    // This is the real basis for anomaly detection later — not a guess.
    double z_score(double x) const {
        double sd = stddev();
        if (sd < 1e-9) return 0.0; // avoid divide-by-zero when there's no variance yet
        return (x - mean) / sd;
    }
};

// A minimal real linear model updated via online (stochastic) gradient descent.
// Predicts a single scalar output from a small feature vector. Weights start
// at zero and are nudged toward reducing prediction error after every
// observation — this is the actual learning mechanism, not a lookup table.
class OnlineLinearModel {
public:
    std::vector<double> weights;
    double bias = 0.0;
    double learning_rate;
    long long updates_seen = 0;

    OnlineLinearModel(size_t num_features, double lr = 0.01)
        : weights(num_features, 0.0), learning_rate(lr) {}

    double predict(const std::vector<double>& features) const {
        double result = bias;
        for (size_t i = 0; i < features.size() && i < weights.size(); i++) {
            result += weights[i] * features[i];
        }
        return result;
    }

    // Real gradient descent step: nudge weights in the direction that
    // reduces squared error between prediction and the true observed outcome.
    void update(const std::vector<double>& features, double true_outcome) {
        double prediction = predict(features);
        double error = true_outcome - prediction;

        for (size_t i = 0; i < features.size() && i < weights.size(); i++) {
            weights[i] += learning_rate * error * features[i];
        }
        bias += learning_rate * error;
        updates_seen++;
    }

    double mean_squared_error(const std::vector<std::pair<std::vector<double>, double>>& test_set) const {
        if (test_set.empty()) return 0.0;
        double total = 0.0;
        for (auto& [features, outcome] : test_set) {
            double diff = predict(features) - outcome;
            total += diff * diff;
        }
        return total / test_set.size();
    }
};
