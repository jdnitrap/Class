#include "core/external_oracle.hpp"
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <iostream>

namespace fungal::core {

ExternalOracle::ExternalOracle() = default;

std::string ExternalOracle::wrap_in_cpp(const std::string& code_snippet) const {
    std::ostringstream cpp;
    cpp << "#include <iostream>\n";
    cpp << "#include <cstring>\n";
    cpp << "#include <climits>\n";
    cpp << "#include <new>\n";
    cpp << "\n";
    cpp << "int main() {\n";
    cpp << "    " << code_snippet << "\n";
    cpp << "    return 0;\n";
    cpp << "}\n";
    return cpp.str();
}

bool ExternalOracle::compile_and_check(const std::string& code_snippet, std::string& compiler_output) {
    // Wrap code in valid C++
    std::string cpp_code = wrap_in_cpp(code_snippet);

    // Write to temp file
    std::ofstream temp_file("/tmp/external_oracle_test.cpp");
    if (!temp_file) {
        compiler_output = "Error: could not open temp file";
        return false;
    }
    temp_file << cpp_code;
    temp_file.close();

    // Compile with clang++ and capture output
    // Use -fsanitize=undefined to catch UB at compile time
    int result = system("clang++ -Wall -Wextra -std=c++17 -fsanitize=undefined /tmp/external_oracle_test.cpp -o /tmp/external_oracle_test 2>&1 > /tmp/oracle_compile.log 2>&1");

    // Read compilation output
    std::ifstream log_file("/tmp/oracle_compile.log");
    if (!log_file) {
        compiler_output = "Error: could not read compiler output";
        return (result != 0);
    }

    std::stringstream buffer;
    buffer << log_file.rdbuf();
    compiler_output = buffer.str();
    log_file.close();

    // Compilation succeeded (exit code 0) means no errors
    // Non-zero exit means errors detected
    // Also check for warnings which indicate potential bugs
    bool has_issues = (result != 0) ||
                      compiler_output.find("warning:") != std::string::npos ||
                      compiler_output.find("error:") != std::string::npos;

    return has_issues;
}

bool ExternalOracle::has_bug(const std::string& code_snippet) {
    std::string compiler_output;
    return compile_and_check(code_snippet, compiler_output);
}

}  // namespace fungal::core
