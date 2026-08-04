#include "hardware.hpp"
#include "substrate.hpp"
#include "autonomous_node.hpp"
#include "self_model.hpp"
#include "constraints.hpp"
#include "alignment.hpp"
#include "monitor.hpp"
#include "learning.hpp"
#include "neural_integration.hpp"
#include <iostream>
#include <memory>
#include <vector>
#include <map>
#include <sstream>
#include <thread>
#include <chrono>

using namespace fungal;

class FungalTUI {
private:
    HardwareInfo hardware_;
    std::shared_ptr<Substrate> substrate_;
    std::map<std::string, std::unique_ptr<AutonomousNode>> nodes_;
    std::map<std::string, std::unique_ptr<SelfAwareness>> awareness_;
    std::unique_ptr<ConstraintEngine> constraints_;
    std::unique_ptr<ValueAlignment> alignment_;
    std::unique_ptr<AdaptiveLearning> learning_;
    std::unique_ptr<ReinforcementLoop> rl_;

    int current_view_ = 0;  // 0=main, 1=nodes, 2=signals, 3=learning, 4=audit
    std::string selected_node_ = "";
    std::vector<std::string> node_list_;
    std::string status_message_ = "Ready";
    int cycle_count_ = 0;

public:
    FungalTUI() {
        hardware_ = HardwareDetector::detect();
        substrate_ = std::make_shared<Substrate>();
        constraints_ = std::make_unique<ConstraintEngine>();
        alignment_ = std::make_unique<ValueAlignment>();
        learning_ = std::make_unique<AdaptiveLearning>();
        rl_ = std::make_unique<ReinforcementLoop>();

        constraints_->enforce_energy_limit(100.0);
        constraints_->set_strategy_whitelist({"verify", "analyze", "learn"});

        status_message_ = "Fungal System initialized. Ready for interaction.";
    }

    void create_node(const std::string& node_id, const std::string& goal) {
        substrate_->register_node(node_id);
        auto node = std::make_unique<AutonomousNode>(node_id, substrate_);
        node->initialize();
        node->set_goal(goal);

        auto aware = std::make_unique<SelfAwareness>(node_id, hardware_);
        aware->set_primary_goal(goal);
        aware->add_strategy("verify");
        aware->add_strategy("analyze");
        aware->set_energy_state(90.0, 100.0);

        nodes_[node_id] = std::move(node);
        awareness_[node_id] = std::move(aware);
        node_list_.push_back(node_id);
        selected_node_ = node_id;

        status_message_ = "Created node: " + node_id + " with goal: " + goal;
    }

    void run_cycle(const std::string& node_id) {
        if (nodes_.find(node_id) == nodes_.end()) {
            status_message_ = "Node not found: " + node_id;
            return;
        }

        nodes_[node_id]->process_cycle();
        awareness_[node_id]->record_decision("cycle", true);
        cycle_count_++;
        status_message_ = "Completed cycle for: " + node_id;
    }

    void send_signal(const std::string& from_node, const std::string& content) {
        Signal sig{
            "test_signal",
            from_node,
            content,
            0.0,
            0.8
        };
        substrate_->broadcast_signal(sig);
        status_message_ = "Signal sent from " + from_node + ": " + content;
    }

    void record_learning(const std::string& source, bool correct) {
        learning_->record_source_outcome(source, correct);
        if (correct) {
            rl_->observe_reward("verify", 10.0);
        } else {
            rl_->observe_penalty("verify", 5.0);
        }
        status_message_ = "Recorded learning: " + source + " -> " + (correct ? "correct" : "incorrect");
    }

    std::string get_node_status(const std::string& node_id) {
        if (awareness_.find(node_id) == awareness_.end()) {
            return "Node not found";
        }

        std::stringstream ss;
        auto& aware = awareness_[node_id];
        ss << "=== Node: " << node_id << " ===\n";
        ss << "Goal: " << aware->get_primary_goal() << "\n";
        ss << "Energy: " << aware->get_energy_status() << "\n";
        ss << "Strategies: " << aware->get_active_strategies().size() << "\n";
        ss << "Success Rate: " << (aware->get_success_rate() * 100.0) << "%\n";
        ss << "Best Strategy: " << aware->get_best_performing_strategy() << "\n";

        return ss.str();
    }

    std::string get_system_status() {
        std::stringstream ss;
        ss << "=== Fungal System Status ===\n";
        ss << "Hardware: " << hardware_.cpu_cores << " cores, "
           << hardware_.total_memory_bytes / (1024*1024*1024) << "GB RAM\n";
        ss << "Nodes: " << nodes_.size() << "\n";
        ss << "Total Cycles: " << cycle_count_ << "\n";
        ss << "Status: " << status_message_ << "\n";
        return ss.str();
    }

    std::string get_learning_status() {
        std::stringstream ss;
        ss << learning_->describe_learned_trusts();
        ss << rl_->describe_learned_strategies();
        return ss.str();
    }

    std::vector<std::string> get_node_list() const {
        return node_list_;
    }

    void set_selected_node(const std::string& node_id) {
        selected_node_ = node_id;
    }

    std::string get_selected_node() const {
        return selected_node_;
    }

    void set_view(int view) {
        current_view_ = view;
    }

    int get_view() const {
        return current_view_;
    }
};

// Simple terminal UI implementation
class TerminalUI {
private:
    FungalTUI& system_;
    bool running_ = true;

public:
    TerminalUI(FungalTUI& system) : system_(system) {}

    void display_header() {
        system("clear");
        std::cout << "\n╔════════════════════════════════════════════════════════════════╗\n";
        std::cout << "║          FUNGAL SYSTEM - INTERACTIVE TERMINAL UI                 ║\n";
        std::cout << "║     Self-Aware Autonomous AI - Truth Seeking Network              ║\n";
        std::cout << "╚════════════════════════════════════════════════════════════════╝\n\n";
    }

    void display_main_menu() {
        display_header();
        std::cout << "Main Menu:\n";
        std::cout << "  [1] Create Node\n";
        std::cout << "  [2] Node Management\n";
        std::cout << "  [3] Send Signals\n";
        std::cout << "  [4] Learning & Strategies\n";
        std::cout << "  [5] System Status\n";
        std::cout << "  [6] Run Cycle\n";
        std::cout << "  [0] Exit\n\n";
        std::cout << "Enter choice: ";
    }

    void create_node_dialog() {
        display_header();
        std::string node_id, goal;

        std::cout << "Create New Node\n";
        std::cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        std::cout << "Node ID (e.g., node_1): ";
        std::getline(std::cin, node_id);

        std::cout << "Goal (e.g., verify_claims, analyze_code): ";
        std::getline(std::cin, goal);

        system_.create_node(node_id, goal);
        std::cout << "\n✓ Node created successfully!\n";
        std::cout << "Press Enter to continue...";
        std::cin.get();
    }

    void node_management_menu() {
        while (true) {
            display_header();
            auto nodes = system_.get_node_list();

            if (nodes.empty()) {
                std::cout << "No nodes created yet. Create one from the main menu.\n";
                std::cout << "Press Enter to return...";
                std::cin.get();
                return;
            }

            std::cout << "Node Management\n";
            std::cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            std::cout << "Available Nodes:\n";
            for (size_t i = 0; i < nodes.size(); ++i) {
                std::cout << "  [" << (i+1) << "] " << nodes[i] << "\n";
            }
            std::cout << "  [0] Back\n\n";
            std::cout << "Select node: ";

            int choice;
            std::cin >> choice;
            std::cin.ignore();

            if (choice == 0) return;
            if (choice > 0 && choice <= static_cast<int>(nodes.size())) {
                system_.set_selected_node(nodes[choice-1]);
                show_node_details(nodes[choice-1]);
            }
        }
    }

    void show_node_details(const std::string& node_id) {
        while (true) {
            display_header();
            std::cout << system_.get_node_status(node_id);
            std::cout << "\nOptions:\n";
            std::cout << "  [1] Run Cycle\n";
            std::cout << "  [2] Send Signal\n";
            std::cout << "  [3] Record Learning\n";
            std::cout << "  [0] Back\n\n";
            std::cout << "Choice: ";

            int choice;
            std::cin >> choice;
            std::cin.ignore();

            if (choice == 0) return;

            switch (choice) {
                case 1:
                    system_.run_cycle(node_id);
                    break;
                case 2: {
                    std::cout << "\nSignal content: ";
                    std::string content;
                    std::getline(std::cin, content);
                    system_.send_signal(node_id, content);
                    break;
                }
                case 3: {
                    std::cout << "\nOutcome (1=correct, 0=incorrect): ";
                    int outcome;
                    std::cin >> outcome;
                    std::cin.ignore();
                    system_.record_learning(node_id, outcome == 1);
                    break;
                }
            }

            std::cout << "\nPress Enter to continue...";
            std::cin.get();
        }
    }

    void signals_menu() {
        display_header();
        auto nodes = system_.get_node_list();

        if (nodes.empty()) {
            std::cout << "No nodes created yet.\n";
            std::cout << "Press Enter to return...";
            std::cin.get();
            return;
        }

        std::cout << "Send Signal\n";
        std::cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        std::cout << "From Node:\n";
        for (size_t i = 0; i < nodes.size(); ++i) {
            std::cout << "  [" << (i+1) << "] " << nodes[i] << "\n";
        }
        std::cout << "\nSelect: ";

        int choice;
        std::cin >> choice;
        std::cin.ignore();

        if (choice > 0 && choice <= static_cast<int>(nodes.size())) {
            std::string from_node = nodes[choice-1];
            std::cout << "\nSignal content: ";
            std::string content;
            std::getline(std::cin, content);

            system_.send_signal(from_node, content);
            std::cout << "\n✓ Signal sent!\n";
        }

        std::cout << "Press Enter to return...";
        std::cin.get();
    }

    void learning_menu() {
        display_header();
        std::cout << "Learning & Strategy Performance\n";
        std::cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        std::cout << system_.get_learning_status();

        std::cout << "\n\nOptions:\n";
        std::cout << "  [1] Record Success\n";
        std::cout << "  [2] Record Failure\n";
        std::cout << "  [0] Back\n\n";
        std::cout << "Choice: ";

        int choice;
        std::cin >> choice;
        std::cin.ignore();

        if (choice == 1 || choice == 2) {
            std::cout << "Source name: ";
            std::string source;
            std::getline(std::cin, source);
            system_.record_learning(source, choice == 1);
            std::cout << "\n✓ Learning recorded!\n";
            std::cout << "Press Enter to continue...";
            std::cin.get();
        }
    }

    void system_status_menu() {
        display_header();
        std::cout << system_.get_system_status();
        std::cout << "\nPress Enter to return...";
        std::cin.get();
    }

    void run() {
        while (running_) {
            display_main_menu();

            int choice;
            std::cin >> choice;
            std::cin.ignore();

            switch (choice) {
                case 1:
                    create_node_dialog();
                    break;
                case 2:
                    node_management_menu();
                    break;
                case 3:
                    signals_menu();
                    break;
                case 4:
                    learning_menu();
                    break;
                case 5:
                    system_status_menu();
                    break;
                case 6: {
                    std::string node_id = system_.get_selected_node();
                    if (!node_id.empty()) {
                        system_.run_cycle(node_id);
                        std::cout << "\n✓ Cycle completed!\n";
                    } else {
                        std::cout << "\nPlease select a node first.\n";
                    }
                    std::cout << "Press Enter to continue...";
                    std::cin.get();
                    break;
                }
                case 0:
                    running_ = false;
                    break;
                default:
                    std::cout << "Invalid choice.\n";
                    std::cout << "Press Enter to continue...";
                    std::cin.get();
            }
        }

        display_header();
        std::cout << "Fungal System TUI - Shutting down...\n";
        std::cout << "Thank you for using the Fungal System!\n\n";
    }
};

int main() {
    FungalTUI system;
    TerminalUI ui(system);
    ui.run();

    return 0;
}
