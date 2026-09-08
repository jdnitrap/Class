"""Decision trees for learning output formatting and structure"""

from __future__ import annotations

from collections import defaultdict


class DecisionNode:
    """Node in a decision tree"""

    def __init__(self, feature: str = None, threshold: float = None, value: str = None):
        self.feature = feature  # What to test
        self.threshold = threshold  # Threshold value
        self.value = value  # Leaf node value
        self.left = None  # Branch if condition true
        self.right = None  # Branch if condition false
        self.samples = 0
        self.success_rate = 0.5

    def is_leaf(self) -> bool:
        return self.value is not None

    def __repr__(self) -> str:
        if self.is_leaf():
            return f"Leaf({self.value}, success:{self.success_rate:.1%})"
        return f"Node({self.feature} > {self.threshold}?)"


class DecisionTreeFormatter:
    """Learn output formatting using decision trees"""

    def __init__(self):
        self.root = None
        self.training_data: list[tuple[dict, str, bool]] = []  # (features, output, success)
        self.feature_importance = defaultdict(float)

    def add_training_example(self, features: dict, output: str, success: bool) -> None:
        """Add a training example"""
        self.training_data.append((features, output, success))

    def learn_tree(self, max_depth: int = 5) -> None:
        """Build decision tree from training data"""
        if not self.training_data:
            return

        self.root = self._build_tree(self.training_data, depth=0, max_depth=max_depth)

    def _build_tree(self, data: list, depth: int, max_depth: int) -> DecisionNode:
        """Recursively build tree"""
        if not data or depth >= max_depth:
            return self._create_leaf(data)

        # Find best split
        best_split = self._find_best_split(data)
        if not best_split:
            return self._create_leaf(data)

        feature, threshold, left_data, right_data = best_split

        # Create node
        node = DecisionNode(feature=feature, threshold=threshold)
        node.samples = len(data)
        node.success_rate = sum(1 for _, _, s in data if s) / len(data) if data else 0.5

        # Recursively build children
        node.left = self._build_tree(left_data, depth + 1, max_depth)
        node.right = self._build_tree(right_data, depth + 1, max_depth)

        # Track feature importance
        if len(data) > 0:
            left_success = sum(1 for _, _, s in left_data if s) / max(1, len(left_data))
            right_success = sum(1 for _, _, s in right_data if s) / max(1, len(right_data))
            self.feature_importance[feature] += abs(left_success - right_success)

        return node

    def _create_leaf(self, data: list) -> DecisionNode:
        """Create leaf node"""
        if not data:
            return DecisionNode(value="default")

        # Use most common output format
        success_count = sum(1 for _, _, s in data if s)
        value = "long_form" if success_count > len(data) / 2 else "short_form"

        leaf = DecisionNode(value=value)
        leaf.samples = len(data)
        leaf.success_rate = success_count / len(data)

        return leaf

    def _find_best_split(self, data: list) -> tuple:
        """Find best split for this node"""
        if len(data) < 2:
            return None

        best_gain = 0
        best_split = None

        # Get all features
        all_features = set()
        for features, _, _ in data:
            all_features.update(features.keys())

        for feature in all_features:
            # Get all values for this feature
            values = []
            for features, _, _ in data:
                if feature in features:
                    val = features[feature]
                    values.append(val if isinstance(val, (int, float)) else 1.0)

            if not values:
                continue

            # Try different thresholds
            sorted_vals = sorted(set(values))
            for threshold in sorted_vals:
                left_data = [d for d in data if d[0].get(feature, 0) <= threshold]
                right_data = [d for d in data if d[0].get(feature, 0) > threshold]

                if not left_data or not right_data:
                    continue

                # Calculate information gain
                gain = self._information_gain(data, left_data, right_data)

                if gain > best_gain:
                    best_gain = gain
                    best_split = (feature, threshold, left_data, right_data)

        return best_split

    def _information_gain(self, parent: list, left: list, right: list) -> float:
        """Calculate information gain from a split"""
        def entropy(data):
            if not data:
                return 0
            success = sum(1 for _, _, s in data if s)
            p = success / len(data)
            if p == 0 or p == 1:
                return 0
            return -p * math.log2(p) - (1 - p) * math.log2(1 - p)

        parent_entropy = entropy(parent)
        left_weight = len(left) / len(parent) if parent else 0
        right_weight = len(right) / len(parent) if parent else 0

        weighted_child_entropy = left_weight * entropy(left) + right_weight * entropy(right)

        return parent_entropy - weighted_child_entropy

    def predict(self, features: dict) -> str:
        """Predict output format for features"""
        if not self.root:
            return "default"

        node = self.root
        while not node.is_leaf():
            feature_value = features.get(node.feature, 0)
            if isinstance(feature_value, str):
                feature_value = 1.0 if feature_value else 0

            if feature_value <= node.threshold:
                node = node.left or node
            else:
                node = node.right or node

        return node.value

    def get_prediction_confidence(self, features: dict) -> float:
        """Get confidence of prediction"""
        if not self.root:
            return 0.5

        node = self.root
        while not node.is_leaf():
            feature_value = features.get(node.feature, 0)
            if isinstance(feature_value, str):
                feature_value = 1.0 if feature_value else 0

            if feature_value <= node.threshold:
                node = node.left or node
            else:
                node = node.right or node

        return node.success_rate

    def get_feature_importance(self) -> dict:
        """Get importance ranking of features"""
        total = sum(self.feature_importance.values())
        if total == 0:
            return {}

        return {
            feature: importance / total
            for feature, importance in sorted(
                self.feature_importance.items(), key=lambda x: x[1], reverse=True
            )
        }

    def get_tree_structure(self, node: DecisionNode = None, depth: int = 0) -> list[str]:
        """Get tree structure as strings"""
        if node is None:
            if not self.root:
                return ["Empty tree"]
            node = self.root

        indent = "  " * depth
        lines = []

        if node.is_leaf():
            lines.append(f"{indent}├─ PREDICT: {node.value} (confidence: {node.success_rate:.1%})")
        else:
            lines.append(f"{indent}├─ IF {node.feature} <= {node.threshold}?")
            if node.left:
                lines.extend(self.get_tree_structure(node.left, depth + 1))
            if node.right:
                lines.extend(self.get_tree_structure(node.right, depth + 1))

        return lines

    def export_tree(self) -> dict:
        """Export tree as dictionary"""

        def export_node(node):
            if not node:
                return None
            if node.is_leaf():
                return {"type": "leaf", "value": node.value, "confidence": node.success_rate}
            return {
                "type": "split",
                "feature": node.feature,
                "threshold": node.threshold,
                "left": export_node(node.left),
                "right": export_node(node.right),
            }

        return export_node(self.root)


import math
