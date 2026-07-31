#ifndef FUNGAL_LLM_NODE_HPP
#define FUNGAL_LLM_NODE_HPP

#include "fungal_node.hpp"
#include <unordered_map>
#include <algorithm>

struct GeneratedCode {
    std::string code;
    double confidence;
    std::string source_node;
    int generation_round;

    double current_confidence() const {
        return confidence * std::pow(0.95, generation_round);
    }
};

class FungalLLMNode : public FungalNode {
public:
    // Code generation state
    std::vector<GeneratedCode> generated_patterns;
    std::unordered_map<std::string, double> pattern_quality;
    double generation_temperature = 0.7;  // Controls diversity (0.0 = deterministic, 1.0 = random)

    FungalLLMNode(const std::string& name) : FungalNode(name) {}

    // Generate code based on learned patterns and specialization
    std::string generate_code(const std::string& prompt, double creativity = 0.5) {
        if (domain.empty()) {
            return "// Error: node not specialized";
        }

        // Specialization boost: specialist nodes generate better code
        double quality_multiplier = 1.0 + (expertise_level * 0.5);

        // Generate from domain patterns
        std::string generated = generate_domain_code(prompt, domain);

        // Apply temperature (creativity vs determinism)
        double confidence = std::min(1.0, quality_multiplier * (1.0 - creativity + generation_temperature));

        // Record the generated pattern
        GeneratedCode pattern{generated, confidence, language_name, 0};
        generated_patterns.push_back(pattern);
        pattern_quality[generated] = confidence;

        return generated;
    }

    // Share high-confidence generated code with neighbors
    void share_generated_code(const std::vector<std::shared_ptr<FungalLLMNode>>& neighbors) {
        if (generated_patterns.empty() || energy_pool < energy_per_share) {
            return;
        }

        // Find best patterns
        std::vector<GeneratedCode*> sorted_patterns;
        for (auto& p : generated_patterns) {
            sorted_patterns.push_back(&p);
        }
        std::sort(sorted_patterns.begin(), sorted_patterns.end(),
                  [](GeneratedCode* a, GeneratedCode* b) {
                      return a->current_confidence() > b->current_confidence();
                  });

        // Share top patterns with neighbors based on trust
        int shared = 0;
        for (size_t i = 0; i < sorted_patterns.size() && shared < 3; i++) {
            auto& pattern = *sorted_patterns[i];
            double pattern_conf = pattern.current_confidence();

            if (pattern_conf < 0.3) break;  // Don't share low confidence

            for (auto& neighbor : neighbors) {
                double trust_to_neighbor = get_neighbor_trust(neighbor->language_name);
                double transfer_energy = energy_per_share * pattern_conf * trust_to_neighbor;

                if (energy_pool >= transfer_energy) {
                    neighbor->receive_generated_code(pattern, transfer_energy);
                    energy_pool -= transfer_energy;
                    shared++;
                }
            }
        }
    }

    // Receive generated code from another node
    void receive_generated_code(const GeneratedCode& code, double energy_received) {
        energy_pool += energy_received;

        // Store the code
        GeneratedCode received = code;
        received.generation_round++;  // Increment age
        generated_patterns.push_back(received);

        // Cross-domain learning: if we learned something useful, boost expertise
        if (code.confidence > 0.7) {
            expertise_level = std::min(1.0, expertise_level + 0.02);
        }
    }

    // Refine generated code with new evidence
    void refine_generated_code(const std::string& code_snippet, bool worked) {
        auto it = pattern_quality.find(code_snippet);
        if (it != pattern_quality.end()) {
            if (worked) {
                it->second = std::min(1.0, it->second + 0.1);
            } else {
                it->second = std::max(0.0, it->second - 0.2);
            }
        }
    }

    // Get the best generated code matching a prompt
    std::string get_best_code(const std::string& prompt) {
        if (generated_patterns.empty()) {
            return generate_code(prompt, 0.3);  // Generate if nothing cached
        }

        // Return highest confidence pattern
        GeneratedCode* best = nullptr;
        double best_conf = 0.0;

        for (auto& pattern : generated_patterns) {
            double conf = pattern.current_confidence();
            if (conf > best_conf && pattern.code.find(domain) != std::string::npos) {
                best_conf = conf;
                best = &pattern;
            }
        }

        return best ? best->code : generate_code(prompt, 0.3);
    }

    // Decay old patterns (like claim decay)
    void decay_patterns() {
        for (auto& pattern : generated_patterns) {
            pattern.generation_round++;
        }

        // Remove very old patterns
        auto it = generated_patterns.begin();
        while (it != generated_patterns.end()) {
            if (it->current_confidence() < 0.1) {
                pattern_quality.erase(it->code);
                it = generated_patterns.erase(it);
            } else {
                ++it;
            }
        }
    }

private:
    // Domain-specific code generation templates
    std::string generate_domain_code(const std::string& prompt, const std::string& lang) {
        if (lang == "Python") {
            if (prompt.find("function") != std::string::npos) {
                return "def " + language_name + "_func():\n    # Generated by " + language_name + "\n    return None";
            }
            if (prompt.find("class") != std::string::npos) {
                return "class " + language_name + ":\n    def __init__(self):\n        pass";
            }
            return "# Python code generated by " + language_name;
        } else if (lang == "Java") {
            if (prompt.find("function") != std::string::npos) {
                return "public static void " + language_name + "Method() {\n    // Generated by " + language_name + "\n}";
            }
            if (prompt.find("class") != std::string::npos) {
                return "public class " + language_name + " {\n    public " + language_name + "() {}\n}";
            }
            return "// Java code generated by " + language_name;
        } else if (lang == "Rust") {
            return "fn " + language_name + "_fn() {\n    // Generated by " + language_name + "\n}";
        } else if (lang == "Go") {
            return "func " + language_name + "() {\n    // Generated by " + language_name + "\n}";
        }
        return "// Generated by " + language_name;
    }
};

#endif
