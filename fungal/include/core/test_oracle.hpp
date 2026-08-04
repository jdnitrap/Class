#pragma once

#include "core/control_loop.hpp"
#include <map>
#include <string>

namespace fungal::core {

// Test-based oracle: uses code compilation/execution to determine if code has bugs
class TestOracle : public Oracle {
public:
    // Initialize with a set of code snippets and their known outcomes
    // For v1: manually curated test set with known bugs
    TestOracle();

    bool has_bug(const std::string& code_snippet) override;

private:
    // Knowledge base: code snippet -> does it have a bug?
    std::map<std::string, bool> test_cases_;

    // Add a test case
    void add_test_case(const std::string& code, bool has_bug);

    // Simple similarity matching to handle variations
    bool fuzzy_match(const std::string& code, const std::string& test_code) const;
};

}  // namespace fungal::core
