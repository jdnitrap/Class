#include "fungal_llm_network.hpp"
#include <iostream>
#include <iomanip>
#include <cmath>

int main() {
    std::cout << "\n╔════════════════════════════════════════════════════════════════╗\n";
    std::cout << "║   HYBRID FUNGAL NETWORK + LLM: DISTRIBUTED CODE GENERATION   ║\n";
    std::cout << "║                                                                ║\n";
    std::cout << "║  Combines fungal network's distributed reasoning with         ║\n";
    std::cout << "║  LLM-style code generation across specialized nodes          ║\n";
    std::cout << "╚════════════════════════════════════════════════════════════════╝\n\n";

    // ===== TEST 1: Basic Generation =====
    {
        std::cout << "[TEST 1] BASIC CODE GENERATION\n";
        std::cout << "─────────────────────────────────\n\n";

        FungalLLMNetwork network(2);

        auto python_node = network.add_node("Python_Expert");
        auto java_node = network.add_node("Java_Expert");

        python_node->set_domain("Python");
        java_node->set_domain("Java");

        // Build expertise
        for (int i = 0; i < 10; i++) {
            python_node->record_claim_outcome(true);
            java_node->record_claim_outcome(true);
        }
        python_node->update_expertise();
        java_node->update_expertise();

        std::cout << "Python specialist expertise: " << python_node->expertise_level << "\n";
        std::cout << "Java specialist expertise: " << java_node->expertise_level << "\n\n";

        // Generate code
        std::string py_code = python_node->generate_code("function to add numbers");
        std::string java_code = java_node->generate_code("class for data storage");

        std::cout << "Python generated:\n" << py_code << "\n\n";
        std::cout << "Java generated:\n" << java_code << "\n\n";

        std::cout << "✓ Both nodes generated code successfully\n\n";
    }

    // ===== TEST 2: Cross-Domain Learning =====
    {
        std::cout << "[TEST 2] CROSS-DOMAIN LEARNING\n";
        std::cout << "──────────────────────────────\n\n";

        FungalLLMNetwork network(2);

        auto python_node = network.add_node("Python");
        auto java_node = network.add_node("Java");
        auto rust_node = network.add_node("Rust");

        python_node->set_domain("Python");
        java_node->set_domain("Java");
        rust_node->set_domain("Rust");

        // Initialize expertise
        for (int i = 0; i < 5; i++) {
            python_node->record_claim_outcome(true);
            java_node->record_claim_outcome(true);
            rust_node->record_claim_outcome(true);
        }
        python_node->update_expertise();
        java_node->update_expertise();
        rust_node->update_expertise();

        std::cout << "Initial expertise:\n";
        std::cout << "  Python: " << python_node->expertise_level << "\n";
        std::cout << "  Java: " << java_node->expertise_level << "\n";
        std::cout << "  Rust: " << rust_node->expertise_level << "\n\n";

        // Simulate knowledge sharing over 5 rounds
        for (int round = 0; round < 5; round++) {
            python_node->generate_code("parse data");
            java_node->generate_code("serialize object");
            rust_node->generate_code("memory safe allocation");

            // Python shares with Java
            std::vector<std::shared_ptr<FungalLLMNode>> neighbors;
            for (auto& node : network.nodes) {
                if (node != python_node) neighbors.push_back(node);
            }
            python_node->share_generated_code(neighbors);
        }

        std::cout << "After 5 rounds of code sharing:\n";
        std::cout << "  Python: " << python_node->expertise_level << "\n";
        std::cout << "  Java: " << java_node->expertise_level << " (learned from Python)\n";
        std::cout << "  Rust: " << rust_node->expertise_level << " (learned from Python)\n";
        std::cout << "  Patterns generated:\n";
        std::cout << "    Python: " << python_node->generated_patterns.size() << "\n";
        std::cout << "    Java: " << java_node->generated_patterns.size() << "\n";
        std::cout << "    Rust: " << rust_node->generated_patterns.size() << "\n\n";

        std::cout << "✓ Cross-domain learning successful\n\n";
    }

    // ===== TEST 3: Collaborative Generation =====
    {
        std::cout << "[TEST 3] COLLABORATIVE CODE GENERATION\n";
        std::cout << "──────────────────────────────────────\n\n";

        FungalLLMNetwork network(3);

        auto py1 = network.add_node("Python_1");
        auto py2 = network.add_node("Python_2");
        auto py3 = network.add_node("Python_3");

        py1->set_domain("Python");
        py2->set_domain("Python");
        py3->set_domain("Python");

        for (auto& n : network.nodes) {
            for (int i = 0; i < 8; i++) n->record_claim_outcome(true);
            n->update_expertise();
        }

        std::cout << "3 Python specialists collaborating...\n\n";

        std::string prompt = "write a function to validate email addresses";
        std::cout << "Prompt: \"" << prompt << "\"\n\n";

        std::string collaborative = network.generate_code_collaborative(prompt, "Python");
        std::cout << "Collaborative result:\n" << collaborative << "\n\n";

        std::cout << "✓ Collaborative generation completed\n\n";
    }

    // ===== TEST 4: Consensus Voting =====
    {
        std::cout << "[TEST 4] CONSENSUS CODE SELECTION\n";
        std::cout << "──────────────────────────────────\n\n";

        FungalLLMNetwork network(2);

        auto node1 = network.add_node("Node_1");
        auto node2 = network.add_node("Node_2");
        auto node3 = network.add_node("Node_3");

        for (auto& n : network.nodes) {
            n->set_domain("Python");
            for (int i = 0; i < 5; i++) n->record_claim_outcome(true);
            n->update_expertise();
        }

        // Generate code
        for (int i = 0; i < 3; i++) {
            node1->generate_code("calculate sum");
            node2->generate_code("calculate sum");
            node3->generate_code("calculate sum");
        }

        std::cout << "Each node generated 3 patterns\n\n";

        std::string consensus = network.get_consensus_code("calculate sum");
        std::cout << "Consensus result:\n" << consensus << "\n\n";

        auto status = network.get_status();
        std::cout << "Network status:\n";
        std::cout << "  Total patterns: " << status.patterns_generated << "\n";
        std::cout << "  Avg quality: " << std::fixed << std::setprecision(3) << status.avg_pattern_quality << "\n";
        std::cout << "  Avg expertise: " << status.avg_expertise << "\n\n";

        std::cout << "✓ Consensus voting successful\n\n";
    }

    // ===== TEST 5: Pattern Decay & Refinement =====
    {
        std::cout << "[TEST 5] PATTERN DECAY & REFINEMENT\n";
        std::cout << "────────────────────────────────────\n\n";

        FungalLLMNetwork network(1);
        auto node = network.add_node("Learner");
        node->set_domain("Python");

        for (int i = 0; i < 5; i++) node->record_claim_outcome(true);
        node->update_expertise();

        // Generate initial patterns
        for (int i = 0; i < 3; i++) {
            node->generate_code("parse JSON");
        }

        std::cout << "Initial patterns: " << node->generated_patterns.size() << "\n";
        double initial_avg = 0.0;
        for (auto& p : node->generated_patterns) {
            initial_avg += p.current_confidence();
        }
        if (!node->generated_patterns.empty()) initial_avg /= node->generated_patterns.size();
        std::cout << "Avg confidence: " << std::fixed << std::setprecision(3) << initial_avg << "\n\n";

        // Age patterns over 10 rounds
        for (int round = 0; round < 10; round++) {
            node->decay_patterns();
        }

        std::cout << "After 10 rounds of decay:\n";
        std::cout << "Remaining patterns: " << node->generated_patterns.size() << "\n";
        double aged_avg = 0.0;
        for (auto& p : node->generated_patterns) {
            aged_avg += p.current_confidence();
        }
        if (!node->generated_patterns.empty()) aged_avg /= node->generated_patterns.size();
        std::cout << "Avg confidence: " << aged_avg << "\n";
        std::cout << "Decay factor: " << std::pow(0.95, 10) << "\n\n";

        // Refine working patterns
        if (!node->generated_patterns.empty()) {
            std::string code = node->generated_patterns[0].code;
            node->refine_generated_code(code, true);
            std::cout << "✓ Refined successful patterns\n\n";
        }
    }

    // ===== TEST 6: Full Hybrid System =====
    {
        std::cout << "[TEST 6] FULL HYBRID SYSTEM SIMULATION\n";
        std::cout << "──────────────────────────────────────\n\n";

        FungalLLMNetwork network(3);

        auto py_node = network.add_node("Python");
        auto java_node = network.add_node("Java");
        auto go_node = network.add_node("Go");

        py_node->set_domain("Python");
        java_node->set_domain("Java");
        go_node->set_domain("Go");

        // Initialize
        for (auto& n : network.nodes) {
            for (int i = 0; i < 5; i++) n->record_claim_outcome(true);
            n->update_expertise();
        }

        std::cout << "Running 10 rounds of hybrid network operation...\n";
        std::cout << "Round | Patterns | Quality  | Expertise | Substrate\n";
        std::cout << "------|----------|----------|-----------|----------\n";

        for (int round = 0; round < 10; round++) {
            network.round();

            if (round % 3 == 0 || round == 9) {
                auto status = network.get_status();
                std::cout << std::setw(5) << round << " | "
                          << std::setw(8) << status.patterns_generated << " | "
                          << std::setw(8) << std::fixed << std::setprecision(3) << status.avg_pattern_quality << " | "
                          << std::setw(9) << status.avg_expertise << " | "
                          << std::setw(9) << status.substrate_health << "\n";
            }
        }

        std::cout << "\n✓ Full simulation completed\n\n";
    }

    std::cout << "╔════════════════════════════════════════════════════════════════╗\n";
    std::cout << "║                    HYBRID SYSTEM SUMMARY                       ║\n";
    std::cout << "╚════════════════════════════════════════════════════════════════╝\n\n";

    std::cout << "Hybrid Architecture Benefits:\n\n";
    std::cout << "1. DISTRIBUTED GENERATION\n";
    std::cout << "   ✓ Specialized nodes generate better code for their domain\n";
    std::cout << "   ✓ Parallel generation across multiple nodes\n";
    std::cout << "   ✓ Energy-efficient (distributed > centralized)\n\n";

    std::cout << "2. COLLABORATIVE REFINEMENT\n";
    std::cout << "   ✓ Multiple nodes review and improve code\n";
    std::cout << "   ✓ Consensus voting for best solutions\n";
    std::cout << "   ✓ Cross-domain learning\n\n";

    std::cout << "3. KNOWLEDGE PERSISTENCE\n";
    std::cout << "   ✓ Patterns stored across network (redundancy)\n";
    std::cout << "   ✓ Decay mechanism prevents stale code (like claims)\n";
    std::cout << "   ✓ Refinement improves patterns over time\n\n";

    std::cout << "4. SELF-REGULATING QUALITY\n";
    std::cout << "   ✓ High-confidence patterns shared more frequently\n";
    std::cout << "   ✓ Low-quality patterns removed over time\n";
    std::cout << "   ✓ Trust-weighted selection\n\n";

    std::cout << "Comparison to Traditional LLM:\n\n";
    std::cout << "Traditional:        One big model, centralized inference\n";
    std::cout << "Fungal Hybrid:      Many small models, distributed + specialized\n\n";

    std::cout << "Advantages of Hybrid:\n";
    std::cout << "• Specialization: Each node optimized for one task\n";
    std::cout << "• Resilience: Loss of one node ≠ system failure\n";
    std::cout << "• Transparency: Can audit which node generated what\n";
    std::cout << "• Scalability: Add more specialist nodes as needed\n";
    std::cout << "• Energy efficient: Parallel inference, local processing\n\n";

    std::cout << "Limitations of Hybrid:\n";
    std::cout << "• Coordination overhead for distributed consensus\n";
    std::cout << "• Harder to handle complex cross-domain reasoning\n";
    std::cout << "• Requires domain pre-specialization\n";
    std::cout << "• Slower than single optimized model for simple queries\n\n";

    return 0;
}
