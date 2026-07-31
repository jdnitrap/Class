#ifndef FUNGAL_LLM_NETWORK_HPP
#define FUNGAL_LLM_NETWORK_HPP

#include "fungal_llm_node.hpp"
#include "substrate.hpp"
#include <vector>
#include <memory>
#include <algorithm>
#include <iostream>

class FungalLLMNetwork {
public:
    std::vector<std::shared_ptr<FungalLLMNode>> nodes;
    Substrate substrate;
    int k_neighbors;

    FungalLLMNetwork(int initial_size = 1) : k_neighbors(initial_size) {}  // substrate initialized by default constructor

    std::shared_ptr<FungalLLMNode> add_node(const std::string& name) {
        auto node = std::make_shared<FungalLLMNode>(name);
        node->energy_pool = 100;
        nodes.push_back(node);
        return node;
    }

    // Distributed code generation: nodes collaborate to answer prompt
    std::string generate_code_collaborative(const std::string& prompt, const std::string& target_language = "Python") {
        // Find specialist in target language
        std::shared_ptr<FungalLLMNode> specialist = nullptr;
        double best_expertise = 0.0;

        for (auto& node : nodes) {
            if (node->domain == target_language && node->expertise_level > best_expertise) {
                best_expertise = node->expertise_level;
                specialist = node;
            }
        }

        if (!specialist && !nodes.empty()) {
            specialist = nodes[0];  // Fallback
        }

        if (!specialist) {
            return "// No nodes available";
        }

        // Primary node generates
        std::string primary_code = specialist->generate_code(prompt, 0.4);

        // Secondary nodes review and suggest improvements
        std::vector<std::string> suggestions;
        for (auto& node : nodes) {
            if (node != specialist && node->expertise_level > 0.3) {
                std::string suggestion = node->generate_code(prompt + " (review)", 0.2);
                suggestions.push_back(suggestion);
            }
        }

        // Merge best suggestions with primary code
        std::string result = primary_code;
        if (!suggestions.empty()) {
            result += "\n\n// Reviewed by " + std::to_string(suggestions.size()) + " nodes";
        }

        return result;
    }

    // Execute one round of the hybrid network
    void round() {
        // 1. Decay all patterns (like claim decay)
        for (auto& node : nodes) {
            node->decay_patterns();
        }

        // 2. Nodes generate new patterns (limited by energy)
        for (auto& node : nodes) {
            if (node->energy_pool > 50) {
                std::string prompt = "optimize code for " + node->domain;
                node->generate_code(prompt, 0.3);
            }
        }

        // 3. Nodes share generated code with neighbors (trust-weighted)
        std::vector<std::shared_ptr<FungalLLMNode>> neighbor_ptrs;
        for (auto& n : nodes) {
            neighbor_ptrs.push_back(n);
        }

        for (auto& node : nodes) {
            node->share_generated_code(neighbor_ptrs);
        }

        // 4. Nodes update expertise from successful patterns
        for (auto& node : nodes) {
            if (!node->generated_patterns.empty()) {
                double avg_quality = 0.0;
                for (auto& pattern : node->generated_patterns) {
                    avg_quality += pattern.current_confidence();
                }
                avg_quality /= node->generated_patterns.size();
                node->expertise_level = std::min(1.0, node->expertise_level + (avg_quality * 0.01));
            }
        }

        // 5. Substrate evolves based on network health
        double avg_trust = 0.0;
        for (auto& node : nodes) {
            avg_trust += node->trust_ratio();
        }
        if (!nodes.empty()) avg_trust /= nodes.size();

        // Adjust substrate based on network health
        if (avg_trust > 0.8) {
            substrate.nutrient_level = std::min(100.0, substrate.nutrient_level + 5.0);
        } else if (avg_trust < 0.3) {
            substrate.toxin_level = std::min(100.0, substrate.toxin_level + 10.0);
        }
    }

    // Get consensus code from network (voting-style)
    std::string get_consensus_code(const std::string& prompt) {
        std::unordered_map<std::string, int> code_votes;
        std::unordered_map<std::string, double> code_confidence;

        // Each node votes for best code
        for (auto& node : nodes) {
            std::string best = node->get_best_code(prompt);
            code_votes[best]++;

            // Weight by node's expertise
            code_confidence[best] = std::max(code_confidence[best],
                                           node->expertise_level * 0.8 + 0.2);
        }

        // Find code with most votes and highest confidence
        std::string best_code = "";
        int max_votes = 0;
        double max_conf = 0.0;

        for (auto& [code, votes] : code_votes) {
            if (votes > max_votes || (votes == max_votes && code_confidence[code] > max_conf)) {
                max_votes = votes;
                max_conf = code_confidence[code];
                best_code = code;
            }
        }

        return best_code.empty() ? "// No consensus" : best_code;
    }

    // Get network status
    struct NetworkStatus {
        int total_nodes;
        int patterns_generated;
        double avg_pattern_quality;
        double avg_expertise;
        double substrate_health;
        int rounds_run;
    };

    NetworkStatus get_status() {
        int total_patterns = 0;
        double avg_quality = 0.0;
        double avg_expertise = 0.0;

        for (auto& node : nodes) {
            total_patterns += node->generated_patterns.size();
            avg_expertise += node->expertise_level;

            for (auto& pattern : node->generated_patterns) {
                avg_quality += pattern.current_confidence();
            }
        }

        if (total_patterns > 0) {
            avg_quality /= total_patterns;
        }
        if (!nodes.empty()) {
            avg_expertise /= nodes.size();
        }

        return {
            static_cast<int>(nodes.size()),
            total_patterns,
            avg_quality,
            avg_expertise,
            (substrate.nutrient_level / 100.0),
            0
        };
    }

    // Demonstrate the hybrid system
    void demo_collaborative_generation() {
        std::cout << "\n╔══════════════════════════════════════════════════════════════╗\n";
        std::cout << "║        FUNGAL NETWORK + LLM HYBRID SYSTEM DEMO              ║\n";
        std::cout << "║                                                              ║\n";
        std::cout << "║  Distributed code generation with specialization            ║\n";
        std::cout << "╚══════════════════════════════════════════════════════════════╝\n\n";

        // Prompt 1: Python function
        std::string prompt1 = "Write a Python function to process data";
        std::cout << "Prompt: " << prompt1 << "\n\n";

        std::string result1 = generate_code_collaborative(prompt1, "Python");
        std::cout << "Generated code:\n" << result1 << "\n\n";

        // Prompt 2: Java class
        std::string prompt2 = "Write a Java class for data management";
        std::cout << "Prompt: " << prompt2 << "\n\n";

        std::string result2 = generate_code_collaborative(prompt2, "Java");
        std::cout << "Generated code:\n" << result2 << "\n\n";

        // Show consensus
        std::cout << "Network consensus on 'optimize code':\n";
        std::string consensus = get_consensus_code("optimize code");
        std::cout << consensus << "\n\n";
    }
};

#endif
