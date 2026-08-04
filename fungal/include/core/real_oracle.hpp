#pragma once

#include "core/control_loop.hpp"
#include <string>
#include <vector>

namespace fungal::core {

// REAL ORACLE: Uses deterministic code analysis and compilation checking
// Instead of hardcoded lookup tables, performs actual semantic analysis
//
// Purpose: Provide ground truth by actually compiling and checking code
// for real C++ bugs, not pattern matching.

class RealOracle : public Oracle {
public:
    RealOracle();

    // Check if code snippet contains a real bug
    // Uses: compilation errors, undefined behavior patterns, semantic issues
    bool has_bug(const std::string& code_snippet) override;

private:
    // Semantic checkers for real C++ bugs (deterministic, not heuristic)
    bool has_undefined_dereference(const std::string& code);
    bool has_use_after_free(const std::string& code);
    bool has_uninitialized_use(const std::string& code);
    bool has_buffer_overflow(const std::string& code);
    bool has_memory_leak(const std::string& code);
    bool has_type_error(const std::string& code);

    // Helper: parse code structure
    std::vector<std::string> tokenize(const std::string& code) const;
    bool has_pattern(const std::vector<std::string>& tokens,
                     const std::vector<std::string>& pattern) const;
};

}  // namespace fungal::core
