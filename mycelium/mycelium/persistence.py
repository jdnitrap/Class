"""Persist learned weights and feedback across sessions"""

from __future__ import annotations

import json
from pathlib import Path
from collections import defaultdict


class LearnerPersistence:
    """Save and load learner state to disk"""

    def __init__(self, state_dir: Path = Path("mycelium/state")):
        self.state_dir = state_dir
        self.state_dir.mkdir(exist_ok=True)
        self.learner_file = self.state_dir / "learner.json"
        self.feedback_file = self.state_dir / "feedback.json"

    def save_learner(self, learner) -> None:
        """Save learner state to disk"""
        data = {
            "edge_success_count": dict(learner.edge_success_count),
            "edge_failure_count": dict(learner.edge_failure_count),
            "traversal_count": dict(learner.traversal_count),
        }

        # Convert tuple keys to strings for JSON serialization
        serialized = {}
        for key, value in data.items():
            serialized[key] = {"|".join(k): v for k, v in value.items()}

        with open(self.learner_file, "w") as f:
            json.dump(serialized, f, indent=2)

    def load_learner(self, learner) -> None:
        """Load learner state from disk"""
        if not self.learner_file.exists():
            return

        with open(self.learner_file, "r") as f:
            data = json.load(f)

        # Reconstruct tuple keys from string representation
        learner.edge_success_count = defaultdict(
            int,
            {tuple(k.split("|")): v for k, v in data.get("edge_success_count", {}).items()},
        )
        learner.edge_failure_count = defaultdict(
            int,
            {tuple(k.split("|")): v for k, v in data.get("edge_failure_count", {}).items()},
        )
        learner.traversal_count = defaultdict(
            int,
            {tuple(k.split("|")): v for k, v in data.get("traversal_count", {}).items()},
        )

    def log_feedback(self, query: str, path: list[str], feedback: bool, response: str) -> None:
        """Log user feedback for analysis"""
        feedback_entry = {
            "query": query,
            "path": path,
            "feedback": feedback,
            "response": response,
        }

        feedback_log = []
        if self.feedback_file.exists():
            with open(self.feedback_file, "r") as f:
                feedback_log = json.load(f)

        feedback_log.append(feedback_entry)

        with open(self.feedback_file, "w") as f:
            json.dump(feedback_log, f, indent=2)

    def get_feedback_stats(self) -> dict:
        """Get statistics about collected feedback"""
        if not self.feedback_file.exists():
            return {
                "total_feedback": 0,
                "positive": 0,
                "negative": 0,
                "success_rate": 0.0,
            }

        with open(self.feedback_file, "r") as f:
            feedback_log = json.load(f)

        positive = sum(1 for entry in feedback_log if entry["feedback"])
        negative = len(feedback_log) - positive

        return {
            "total_feedback": len(feedback_log),
            "positive": positive,
            "negative": negative,
            "success_rate": positive / max(1, len(feedback_log)),
        }

    def clear_learner(self) -> None:
        """Reset learned weights"""
        if self.learner_file.exists():
            self.learner_file.unlink()
