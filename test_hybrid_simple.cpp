#include "fungal_llm_simple.hpp"
#include <iomanip>

int main() {
    std::cout << "\n╔════════════════════════════════════════════════════════════════╗\n";
    std::cout << "║   SIMPLE HYBRID FUNGAL NETWORK + LLM DEMONSTRATION            ║\n";
    std::cout << "║                                                                ║\n";
    std::cout << "║  Distributed code generation across specialized nodes         ║\n";
    std::cout << "╚════════════════════════════════════════════════════════════════╝\n\n";

    // ===== TEST 1: Basic Generation =====
    {
        std::cout << "[TEST 1] SINGLE NODE CODE GENERATION\n";
        std::cout << "───────────────────────────────────────\n\n";

        SimpleLLMNode node("Python_Specialist");
        node.set_domain("Python");
        node.expertise = 0.9;

        node.generate_pattern("parse JSON data");
        std::cout << "Generated pattern:\n" << node.get_best_pattern() << "\n";
        std::cout << "Pattern count: " << node.patterns.size() << "\n";
        std::cout << "Expertise: " << node.expertise << "\n\n";
    }

    // ===== TEST 2: Network with Multiple Specialists =====
    {
        std::cout << "[TEST 2] MULTI-SPECIALIST NETWORK\n";
        std::cout << "──────────────────────────────────\n\n";

        SimpleFungalLLM network;

        auto python = network.add_node("Python");
        auto java = network.add_node("Java");
        auto rust = network.add_node("Rust");

        python->set_domain("Python");
        java->set_domain("Java");
        rust->set_domain("Rust");

        python->expertise = 0.85;
        java->expertise = 0.80;
        rust->expertise = 0.75;

        std::cout << "Specialists created:\n";
        for (auto& node : network.nodes) {
            std::cout << "  " << node->name << " (domain: " << node->domain
                      << ", expertise: " << node->expertise << ")\n";
        }
        std::cout << "\n";

        // Each generates
        python->generate_pattern("validate input");
        java->generate_pattern("serialize object");
        rust->generate_pattern("allocate memory safely");

        std::cout << "Generated patterns:\n";
        for (auto& node : network.nodes) {
            std::cout << "  " << node->name << ": " << node->patterns.size() << " patterns\n";
        }
        std::cout << "\n";
    }

    // ===== TEST 3: Collaborative Generation =====
    {
        std::cout << "[TEST 3] COLLABORATIVE GENERATION\n";
        std::cout << "──────────────────────────────────\n\n";

        SimpleFungalLLM network;

        auto py1 = network.add_node("Python_1");
        auto py2 = network.add_node("Python_2");
        auto py3 = network.add_node("Python_3");

        for (auto& node : {py1, py2, py3}) {
            node->set_domain("Python");
            node->expertise = 0.7;
        }

        std::string prompt = "validate email addresses";
        std::cout << "Prompt: \"" << prompt << "\"\n\n";

        // Generate collaboratively
        std::string code = network.collaborative_generate(prompt, "Python");
        std::cout << "Collaborative result:\n" << code << "\n\n";
    }

    // ===== TEST 4: Pattern Decay =====
    {
        std::cout << "[TEST 4] PATTERN DECAY OVER TIME\n";
        std::cout << "─────────────────────────────────\n\n";

        SimpleLLMNode node("Learner");
        node.set_domain("Python");

        // Generate patterns
        for (int i = 0; i < 3; i++) {
            node.generate_pattern("example");
        }

        std::cout << "Round | Patterns | Avg Confidence\n";
        std::cout << "------|----------|---------------\n";

        for (int round = 0; round <= 15; round += 3) {
            double avg = 0;
            for (const auto& p : node.patterns) {
                avg += p.current_confidence();
            }
            if (!node.patterns.empty()) avg /= node.patterns.size();

            std::cout << std::setw(5) << round << " | "
                      << std::setw(8) << node.patterns.size() << " | "
                      << std::setw(13) << std::fixed << std::setprecision(3) << avg << "\n";

            // Age patterns 3 rounds
            for (int i = 0; i < 3; i++) {
                node.age_patterns();
            }
        }
        std::cout << "\nDecay factor: " << std::pow(0.95, 15) << "\n\n";
    }

    // ===== TEST 5: Refinement =====
    {
        std::cout << "[TEST 5] PATTERN REFINEMENT\n";
        std::cout << "───────────────────────────\n\n";

        SimpleLLMNode node("Developer");
        node.set_domain("Python");
        node.expertise = 0.5;

        node.generate_pattern("calculate sum");

        std::cout << "Initial state:\n";
        std::cout << "  Expertise: " << node.expertise << "\n";
        std::cout << "  Pattern confidence: " << node.patterns[0].confidence << "\n\n";

        // Refine with successful outcomes
        for (int i = 0; i < 5; i++) {
            node.refine_pattern("calculate", true);
        }

        std::cout << "After 5 successful refinements:\n";
        std::cout << "  Expertise: " << node.expertise << "\n";
        std::cout << "  Pattern confidence: " << node.patterns[0].confidence << "\n\n";

        // Then fail
        for (int i = 0; i < 3; i++) {
            node.refine_pattern("calculate", false);
        }

        std::cout << "After 3 failed refinements:\n";
        std::cout << "  Expertise: " << node.expertise << "\n";
        std::cout << "  Pattern confidence: " << node.patterns[0].confidence << "\n\n";
    }

    // ===== TEST 6: Full Network Simulation =====
    {
        std::cout << "[TEST 6] 10-ROUND NETWORK SIMULATION\n";
        std::cout << "────────────────────────────────────\n\n";

        SimpleFungalLLM network;

        auto py = network.add_node("Python");
        auto java = network.add_node("Java");
        auto go = network.add_node("Go");

        py->set_domain("Python");
        java->set_domain("Java");
        go->set_domain("Go");

        std::cout << "Round | Patterns | Energy | Trust | Health\n";
        std::cout << "------|----------|--------|-------|--------\n";

        for (int round = 0; round < 10; round++) {
            network.round();

            int total_patterns = 0;
            for (auto& n : network.nodes) total_patterns += n->patterns.size();

            double avg_trust = 0;
            for (auto& n : network.nodes) avg_trust += n->trust;
            avg_trust /= network.nodes.size();

            std::cout << std::setw(5) << round << " | "
                      << std::setw(8) << total_patterns << " | "
                      << std::setw(6) << (int)network.nodes[0]->energy << " | "
                      << std::setw(5) << std::fixed << std::setprecision(2) << avg_trust << " | "
                      << std::setw(6) << std::fixed << std::setprecision(2) << network.substrate_health << "\n";
        }
        std::cout << "\n";
    }

    // ===== TEST 7: Consensus Voting =====
    {
        std::cout << "[TEST 7] CONSENSUS CODE SELECTION\n";
        std::cout << "──────────────────────────────────\n\n";

        SimpleFungalLLM network;

        for (int i = 0; i < 4; i++) {
            auto node = network.add_node("Node_" + std::to_string(i));
            node->set_domain("Python");
            node->expertise = 0.7;
            node->generate_pattern("process list");
        }

        std::string consensus = network.consensus_code("process list");
        std::cout << "Consensus among 4 Python nodes:\n";
        std::cout << consensus << "\n\n";
    }

    std::cout << "╔════════════════════════════════════════════════════════════════╗\n";
    std::cout << "║                    HYBRID SYSTEM INSIGHTS                      ║\n";
    std::cout << "╚════════════════════════════════════════════════════════════════╝\n\n";

    std::cout << "Key Properties of Hybrid Architecture:\n\n";

    std::cout << "1. DISTRIBUTED + SPECIALIZED\n";
    std::cout << "   Instead of: One large LLM generating all code\n";
    std::cout << "   We have:    Multiple small models, each expert in their domain\n";
    std::cout << "   Result:     Better quality, faster, more interpretable\n\n";

    std::cout << "2. SELF-REGULATING QUALITY\n";
    std::cout << "   • Patterns decay over time (like neural network plasticity)\n";
    std::cout << "   • Refinement sharpens good patterns, removes bad ones\n";
    std::cout << "   • Expertise grows with successful generations\n\n";

    std::cout << "3. COLLABORATIVE CONSENSUS\n";
    std::cout << "   • Multiple specialists vote on best solution\n";
    std::cout << "   • No single point of failure\n";
    std::cout << "   • Transparency: know who generated what\n\n";

    std::cout << "4. RESOURCE-AWARE\n";
    std::cout << "   • Energy budget prevents resource exhaustion\n";
    std::cout << "   • Substrate health drives generation quality\n";
    std::cout << "   • Self-healing through recovery mechanisms\n\n";

    std::cout << "Comparison: Traditional LLM vs Fungal Hybrid\n\n";
    std::cout << "Traditional LLM:\n";
    std::cout << "  ✓ Unified knowledge across domains\n";
    std::cout << "  ✓ Single training pipeline\n";
    std::cout << "  ✗ Black box (hard to debug)\n";
    std::cout << "  ✗ High resource requirements\n";
    std::cout << "  ✗ All-or-nothing failure modes\n\n";

    std::cout << "Fungal Hybrid:\n";
    std::cout << "  ✓ Transparent reasoning (know which node generated what)\n";
    std::cout << "  ✓ Specialization (expert nodes > generalist)\n";
    std::cout << "  ✓ Resilient (lose one node ≠ system failure)\n";
    std::cout << "  ✓ Resource efficient (parallel, local processing)\n";
    std::cout << "  ✗ Coordination overhead\n";
    std::cout << "  ✗ Harder for complex cross-domain tasks\n\n";

    std::cout << "Practical Applications:\n";
    std::cout << "• Code completion (multiple language specialists)\n";
    std::cout << "• Distributed AI on edge devices\n";
    std::cout << "• Interpretable decision-making (audit which node decided)\n";
    std::cout << "• Specialized domain experts (medical, legal, technical)\n";

    return 0;
}
