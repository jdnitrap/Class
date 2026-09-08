"""Memory decay and reinforcement for Mycelium v1 - temporal memory"""

from __future__ import annotations

import time
from math import exp


class TemporalMemory:
    """Memory system with decay and reinforcement over time"""

    def __init__(self, graph, decay_rate: float = 0.95):
        self.graph = graph
        self.decay_rate = decay_rate  # Energy decay per time period
        self.last_update = {}  # Track update times per node

    def initialize_timestamps(self) -> None:
        """Set current timestamp for all nodes"""
        current_time = time.time()
        for nid in self.graph.nodes:
            if nid not in self.last_update:
                self.last_update[nid] = current_time

    def decay_energy(self, energy: float, time_elapsed: float, half_life: float = 86400.0) -> float:
        """
        Calculate decayed energy using exponential decay.

        Args:
            energy: Current energy level
            time_elapsed: Seconds since last update
            half_life: Time for energy to halve (default: 1 day)

        Returns:
            Decayed energy value
        """
        # Exponential decay: E(t) = E0 * (0.5)^(t/half_life)
        decay_factor = 0.5 ** (time_elapsed / half_life)
        return energy * decay_factor

    def update_node_energy(self, nid: str, reinforcement: float = 0.0) -> float:
        """
        Update a node's energy with decay and optional reinforcement.

        Args:
            nid: Node ID
            reinforcement: Energy to add (positive for boost, negative for penalize)

        Returns:
            New energy value
        """
        if nid not in self.graph.nodes:
            return 0.0

        current_time = time.time()
        last_time = self.last_update.get(nid, current_time)
        time_elapsed = current_time - last_time

        node = self.graph.nodes[nid]
        current_energy = node.get("energy", 1.0)

        # Apply decay
        decayed = self.decay_energy(current_energy, time_elapsed)

        # Apply reinforcement
        new_energy = decayed + reinforcement
        new_energy = max(0.1, min(8.0, new_energy))  # Clamp between 0.1 and 8.0

        node["energy"] = new_energy
        self.last_update[nid] = current_time

        return new_energy

    def reinforce_path(self, path: list[str], reinforcement: float = 0.5) -> None:
        """Reinforce a successful path through the graph"""
        for nid in path:
            self.update_node_energy(nid, reinforcement=reinforcement)

    def penalize_path(self, path: list[str], penalty: float = -0.2) -> None:
        """Penalize a failed or incorrect path"""
        for nid in path:
            self.update_node_energy(nid, reinforcement=penalty)

    def decay_all_nodes(self) -> dict:
        """Apply decay to all nodes in the graph"""
        current_time = time.time()
        results = {"decayed": 0, "removed": 0}

        nodes_to_remove = []

        for nid, node in self.graph.nodes.items():
            last_time = self.last_update.get(nid, current_time)
            time_elapsed = current_time - last_time

            current_energy = node.get("energy", 1.0)
            decayed = self.decay_energy(current_energy, time_elapsed)

            if decayed < 0.05:  # Remove very weak nodes
                nodes_to_remove.append(nid)
                results["removed"] += 1
            else:
                node["energy"] = decayed
                results["decayed"] += 1

        # Remove weak nodes
        for nid in nodes_to_remove:
            del self.graph.nodes[nid]
            if nid in self.graph.edges:
                del self.graph.edges[nid]

        return results

    def get_node_age(self, nid: str) -> float:
        """Get age of node in seconds"""
        current_time = time.time()
        last_time = self.last_update.get(nid, current_time)
        return current_time - last_time

    def get_memory_health(self) -> dict:
        """Get overall memory system health statistics"""
        current_time = time.time()
        ages = []
        energies = []

        for nid, node in self.graph.nodes.items():
            age = current_time - self.last_update.get(nid, current_time)
            energy = node.get("energy", 1.0)
            ages.append(age)
            energies.append(energy)

        return {
            "total_nodes": len(self.graph.nodes),
            "avg_age_hours": sum(ages) / max(1, len(ages)) / 3600,
            "avg_energy": sum(energies) / max(1, len(energies)),
            "min_energy": min(energies) if energies else 0,
            "max_energy": max(energies) if energies else 0,
        }
