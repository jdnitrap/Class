#include "core/control_loop.hpp"
#include "core/real_oracle.hpp"
#include <iostream>
#include <vector>
#include <iomanip>

using namespace fungal::core;

int main() {
    std::cout << "=== Fungal v1 Control Loop with REAL Oracle ===" << std::endl << std::endl;

    // Create REAL oracle (actual semantic checking, not lookup table)
    auto oracle = std::make_shared<RealOracle>();

    // Create strategy
    auto strategy = std::make_shared<PatternMatcherStrategy>();

    // Create control loop
    ControlLoop loop(oracle, strategy);
    loop.initialize_from_hardware();

    HardwareProfile profile = loop.hardware_scheduler().get_current_profile();
    std::cout << "Hardware detected:" << std::endl;
    std::cout << "  CPU cores: " << profile.cpu_cores << std::endl;
    std::cout << "  Memory: " << profile.memory_mb << " MB" << std::endl;
    std::cout << "  Architecture: " << profile.architecture << std::endl << std::endl;

    std::cout << "Oracle: REAL (semantic analysis + deterministic checks)" << std::endl;
    std::cout << "Strategy: PatternMatcher (weak heuristics for comparison)" << std::endl << std::endl;

    // Test code snippets with REAL bugs
    std::vector<std::string> test_snippets = {
        "int* p = nullptr; int x = *p;",           // REAL BUG: undefined dereference
        "int* p = nullptr; if (p) { int x = *p; }", // OK: guarded
        "int x; int y = x + 5;",                    // REAL BUG: uninitialized use
        "int x = 0; int y = x + 5;",               // OK: initialized
        "char buf[10]; strcpy(buf, very_long_string);", // REAL BUG: strcpy is unsafe
        "char buf[10]; strncpy(buf, string, 9);",  // OK: bounds checked
        "int* p = new int(5); delete p; int z = *p;", // REAL BUG: use after free
        "int* p = new int(5); int z = *p; delete p;", // OK: use before delete
        "int* p = new int(5);",                    // REAL BUG: memory leak (no delete)
        "int x = INT_MAX; int y = x + 1;",         // REAL BUG: integer overflow
    };

    std::cout << "Running " << test_snippets.size() << " test cycles with REAL oracle..." << std::endl << std::endl;

    std::cout << std::left << std::setw(50) << "Code Snippet"
              << std::setw(15) << "Real Verdict"
              << std::setw(15) << "Strategy Says"
              << std::setw(12) << "Correct"
              << std::setw(10) << "Budget" << std::endl;
    std::cout << std::string(102, '-') << std::endl;

    auto results = loop.run_cycles(test_snippets);

    int real_bugs = 0;
    int strategy_bugs = 0;
    int correct = 0;

    for (size_t i = 0; i < results.size(); ++i) {
        const auto& result = results[i];

        std::string oracle_says = result.oracle_ground_truth ? "BUG" : "OK";
        std::string strategy_says = result.strategy_claim ? "BUG" : "OK";
        std::string match = (result.prediction_correct && result.system_had_energy) ? "✓" : "✗";

        if (result.oracle_ground_truth) real_bugs++;
        if (result.strategy_claim) strategy_bugs++;
        if (result.prediction_correct && result.system_had_energy) correct++;

        std::cout << std::left << std::setw(50) << test_snippets[i].substr(0, 49)
                  << std::setw(15) << oracle_says
                  << std::setw(15) << strategy_says
                  << std::setw(12) << match
                  << std::setw(10) << loop.energy_budget().current_budget() << std::endl;
    }

    std::cout << std::string(102, '-') << std::endl << std::endl;

    std::cout << "Results with REAL Oracle:" << std::endl;
    std::cout << "  Total cycles: " << loop.total_cycles_run() << std::endl;
    std::cout << "  Cycles ran: " << loop.cycles_that_ran() << " (had energy)" << std::endl;
    std::cout << "  Correct predictions: " << correct << "/" << loop.cycles_that_ran() << " = "
              << std::fixed << std::setprecision(1)
              << (loop.cycles_that_ran() > 0 ? (100.0 * correct / loop.cycles_that_ran()) : 0)
              << "%" << std::endl;
    std::cout << "  Real bugs detected by oracle: " << real_bugs << std::endl;
    std::cout << "  Bugs claimed by strategy: " << strategy_bugs << std::endl;
    std::cout << "  Final energy budget: " << loop.energy_budget().current_budget() << " units" << std::endl;

    SelfModel& self_model = loop.self_model();
    std::cout << "  Self-model prediction: " << std::fixed << std::setprecision(2)
              << self_model.predict_success(0) * 100 << "%" << std::endl;
    std::cout << "  Empirical success rate: " << std::fixed << std::setprecision(2)
              << self_model.get_empirical_success_rate(0) * 100 << "%" << std::endl;
    std::cout << "  Calibration error: " << std::fixed << std::setprecision(2)
              << self_model.get_calibration_error(0) << std::endl;

    std::cout << std::endl << "Oracle Type: REAL (semantic analysis)" << std::endl;
    std::cout << "Checks: undefined dereference, use-after-free, uninitialized, "
              << "buffer overflow, memory leak, type errors" << std::endl;

    return 0;
}
