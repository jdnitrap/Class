"""Reinforcement Learning agent for graph exploration and edge preference learning"""

from __future__ import annotations

import random
import math
from collections import defaultdict


class ReinforcementLearner:
    """RL agent that learns which edges lead to good outcomes"""

    def __init__(self, graph, exploration_rate: float = 0.2, learning_rate: float = 0.1):
        self.graph = graph
        self.exploration_rate = exploration_rate  # epsilon for epsilon-greedy
        self.learning_rate = learning_rate

        # Q-values: state (node) -> action (next node) -> value
        self.q_values: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))

        # Visit counts for exploration bonus
        self.visit_counts: dict[tuple[str, str], int] = defaultdict(int)

        # Cumulative rewards per edge
        self.edge_rewards: dict[tuple[str, str], list[float]] = defaultdict(list)

        self.episodes = 0
        self.total_reward = 0.0

    def get_q_value(self, state: str, action: str) -> float:
        """Get Q-value for state-action pair"""
        return self.q_values[state].get(action, 0.0)

    def set_q_value(self, state: str, action: str, value: float) -> None:
        """Set Q-value for state-action pair"""
        self.q_values[state][action] = value

    def select_action(self, node: str, use_exploration: bool = True) -> str | None:
        """Select next node using epsilon-greedy policy"""
        if node not in self.graph.edges or not self.graph.edges[node]:
            return None

        neighbors = list(self.graph.edges[node].keys())

        if use_exploration and random.random() < self.exploration_rate:
            # Explore: pick random action
            return random.choice(neighbors)
        else:
            # Exploit: pick best Q-value
            best_action = max(neighbors, key=lambda a: self.get_q_value(node, a))
            return best_action

    def update_q_value(self, state: str, action: str, reward: float, next_state: str) -> None:
        """Update Q-value using Q-learning update rule"""
        if next_state not in self.graph.edges or not self.graph.edges[next_state]:
            max_next_q = 0.0
        else:
            neighbors = list(self.graph.edges[next_state].keys())
            max_next_q = max(
                (self.get_q_value(next_state, a) for a in neighbors), default=0.0
            )

        current_q = self.get_q_value(state, action)
        new_q = current_q + self.learning_rate * (reward + 0.99 * max_next_q - current_q)
        self.set_q_value(state, action, new_q)

    def learn_from_feedback(self, path: list[str], feedback: bool, reward: float = 1.0) -> None:
        """Learn from a trajectory and feedback"""
        if not path or len(path) < 2:
            return

        # Calculate reward
        actual_reward = reward if feedback else -reward

        # Update Q-values for each transition in the path
        for i in range(len(path) - 1):
            state = path[i]
            action = path[i + 1]
            next_state = path[i + 1]

            # Update Q-value
            self.update_q_value(state, action, actual_reward, next_state)

            # Track edge reward
            edge = (state, action)
            self.edge_rewards[edge].append(actual_reward)
            self.visit_counts[edge] += 1

        self.episodes += 1
        self.total_reward += actual_reward

    def get_policy(self, node: str) -> dict[str, float]:
        """Get learned policy (action probabilities) for a node"""
        if node not in self.graph.edges or not self.graph.edges[node]:
            return {}

        neighbors = list(self.graph.edges[node].keys())
        q_values = [self.get_q_value(node, a) for a in neighbors]

        # Softmax to convert Q-values to probabilities
        max_q = max(q_values) if q_values else 0
        exp_q = [math.exp(q - max_q) for q in q_values]
        total = sum(exp_q)

        return {neighbors[i]: exp_q[i] / total for i in range(len(neighbors))}

    def get_best_path(self, start: str, max_length: int = 5) -> list[str]:
        """Get best path from start using learned policy"""
        path = [start]
        current = start

        for _ in range(max_length - 1):
            policy = self.get_policy(current)
            if not policy:
                break

            # Pick action with highest probability
            next_node = max(policy, key=policy.get)
            path.append(next_node)
            current = next_node

        return path

    def get_edge_value(self, src: str, dst: str) -> float:
        """Get learned value of an edge"""
        edge = (src, dst)
        if edge not in self.edge_rewards:
            return 0.0

        rewards = self.edge_rewards[edge]
        return sum(rewards) / len(rewards) if rewards else 0.0

    def get_learning_stats(self) -> dict:
        """Get statistics about learning progress"""
        if self.episodes == 0:
            return {
                "episodes": 0,
                "total_reward": 0.0,
                "avg_reward": 0.0,
                "edges_learned": 0,
            }

        avg_reward = self.total_reward / self.episodes
        edges_learned = len([e for e in self.edge_rewards if self.edge_rewards[e]])

        return {
            "episodes": self.episodes,
            "total_reward": self.total_reward,
            "avg_reward": avg_reward,
            "edges_learned": edges_learned,
            "avg_visits_per_edge": (
                sum(self.visit_counts.values()) / max(1, len(self.visit_counts))
            ),
        }

    def get_top_edges(self, limit: int = 10) -> list[tuple[tuple[str, str], float]]:
        """Get highest value edges"""
        edges = []
        for edge in self.edge_rewards:
            value = self.get_edge_value(edge[0], edge[1])
            edges.append((edge, value))

        return sorted(edges, key=lambda x: x[1], reverse=True)[:limit]

    def export_policy(self) -> dict:
        """Export learned policy as dictionary"""
        policy = {}
        for state in self.q_values:
            policy[state] = self.get_policy(state)
        return policy

    def decay_exploration(self, factor: float = 0.995) -> None:
        """Reduce exploration rate over time"""
        self.exploration_rate *= factor
        self.exploration_rate = max(0.01, self.exploration_rate)  # Don't go too low
