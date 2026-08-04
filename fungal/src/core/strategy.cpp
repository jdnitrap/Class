#include "core/strategy.hpp"
#include <algorithm>
#include <cmath>

namespace fungal::core {

PatternMatcherStrategy::PatternMatcherStrategy() = default;

StrategyResult PatternMatcherStrategy::apply(const std::string& code_snippet) {
    // Base energy cost for running this strategy
    int energy_cost = 10;

    // Count detected patterns
    int pattern_count = 0;

    if (has_null_dereference_pattern(code_snippet)) {
        pattern_count++;
    }
    if (has_uninitialized_var_pattern(code_snippet)) {
        pattern_count++;
    }
    if (has_off_by_one_pattern(code_snippet)) {
        pattern_count++;
    }

    // Claim: if patterns detected, likely a bug
    bool claim = pattern_count > 0;
    double confidence = compute_confidence(pattern_count, code_snippet.length());

    std::string reasoning = claim ?
        "Found " + std::to_string(pattern_count) + " bug pattern(s) in code" :
        "No obvious bug patterns detected";

    return StrategyResult{
        .claim = claim,
        .strategy_confidence = confidence,
        .reasoning = reasoning,
        .energy_cost = energy_cost
    };
}

bool PatternMatcherStrategy::has_null_dereference_pattern(const std::string& code) {
    // Simple heuristic: look for pointer dereference without null check
    // Pattern: "->" or "*" followed by variable access without nearby if/check
    return code.find("->") != std::string::npos ||
           (code.find("*") != std::string::npos && code.find("if") == std::string::npos);
}

bool PatternMatcherStrategy::has_uninitialized_var_pattern(const std::string& code) {
    // Simple heuristic: variable used before assignment
    // Pattern: declaration of pointer/ref without initialization
    return (code.find("int* ") != std::string::npos && code.find("= nullptr") == std::string::npos) ||
           (code.find("char* ") != std::string::npos && code.find("= nullptr") == std::string::npos);
}

bool PatternMatcherStrategy::has_off_by_one_pattern(const std::string& code) {
    // Simple heuristic: loop bounds that might be off
    // Pattern: for loop with < or <= and array access with same bound
    return code.find("for") != std::string::npos &&
           (code.find("[i]") != std::string::npos || code.find("[i+1]") != std::string::npos) &&
           (code.find("size") != std::string::npos || code.find("length") != std::string::npos);
}

double PatternMatcherStrategy::compute_confidence(int pattern_count, int code_length) {
    // Confidence scales with pattern count, scales down with code length
    // (fewer patterns in larger code = less confidence)
    if (pattern_count == 0) {
        return 0.2;  // even if no patterns, can't be 100% sure there's no bug
    }

    // Base confidence from pattern count
    double base_confidence = std::min(0.9, 0.3 + (pattern_count * 0.25));

    // Adjust for code length
    // Short code with patterns = high confidence
    // Long code with patterns = more room for false negatives, lower confidence
    double length_factor = 1.0 / (1.0 + (code_length / 100.0));
    double confidence = base_confidence * (0.7 + 0.3 * length_factor);

    return std::min(0.95, std::max(0.05, confidence));
}

}  // namespace fungal::core
