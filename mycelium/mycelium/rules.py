"""Rule learning - extract patterns from successful generations"""

from __future__ import annotations

from collections import defaultdict


class Rule:
    """A learned generative rule"""

    def __init__(self, conditions: dict, action: str, confidence: float = 0.5):
        self.conditions = conditions  # {field: value} to match
        self.action = action  # What to do when conditions match
        self.confidence = confidence
        self.success_count = 0
        self.failure_count = 0
        self.uses = 0

    def matches(self, facts: dict) -> bool:
        """Check if this rule matches given facts"""
        for key, value in self.conditions.items():
            if key not in facts:
                return False
            if isinstance(value, list):
                if facts[key] not in value:
                    return False
            else:
                if facts[key] != value:
                    return False
        return True

    def update_confidence(self, success: bool) -> None:
        """Update rule confidence based on outcome"""
        self.uses += 1
        if success:
            self.success_count += 1
        else:
            self.failure_count += 1

        # Update confidence: successes / total uses
        total = self.success_count + self.failure_count
        self.confidence = self.success_count / total if total > 0 else 0.5

    def __repr__(self) -> str:
        conditions_str = " AND ".join([f"{k}={v}" for k, v in self.conditions.items()])
        return f"IF {conditions_str} THEN {self.action} (confidence: {self.confidence:.2f})"


class RuleLearner:
    """Learn generative rules from successful outputs"""

    def __init__(self):
        self.rules: list[Rule] = []
        self.rule_history: list[tuple[Rule, bool]] = []  # (rule, was_successful)
        self.pattern_counts = defaultdict(int)

    def extract_patterns(self, facts: dict, output: str, success: bool) -> list[Rule]:
        """Extract patterns from a successful generation"""
        extracted = []

        # Pattern 1: Single fact → output type
        for key, value in facts.items():
            rule = Rule({key: value}, f"output_type:{self._classify_output(output)}")
            extracted.append(rule)

        # Pattern 2: Fact combinations
        fact_keys = list(facts.keys())
        if len(fact_keys) >= 2:
            for i in range(len(fact_keys)):
                for j in range(i + 1, min(i + 3, len(fact_keys))):
                    rule = Rule(
                        {fact_keys[i]: facts[fact_keys[i]], fact_keys[j]: facts[fact_keys[j]]},
                        f"combine:{fact_keys[i]}_{fact_keys[j]}",
                    )
                    extracted.append(rule)

        return extracted

    def _classify_output(self, output: str) -> str:
        """Classify output type"""
        length = len(output.split())
        if length < 3:
            return "short"
        elif length < 10:
            return "medium"
        else:
            return "long"

    def learn_from_generation(self, facts: dict, output: str, success: bool) -> None:
        """Learn from a generation outcome"""
        # Extract patterns
        extracted = self.extract_patterns(facts, output, success)

        for new_rule in extracted:
            # Check if similar rule exists
            matching_rule = None
            for rule in self.rules:
                if rule.conditions == new_rule.conditions and rule.action == new_rule.action:
                    matching_rule = rule
                    break

            if matching_rule:
                # Update existing rule
                matching_rule.update_confidence(success)
            else:
                # Add new rule
                new_rule.update_confidence(success)
                self.rules.append(new_rule)

            self.rule_history.append((matching_rule or new_rule, success))
            self.pattern_counts[str(new_rule.conditions)] += 1

    def get_applicable_rules(self, facts: dict) -> list[Rule]:
        """Get rules that match given facts, sorted by confidence"""
        applicable = [rule for rule in self.rules if rule.matches(facts)]
        return sorted(applicable, key=lambda r: r.confidence, reverse=True)

    def get_top_rules(self, limit: int = 10) -> list[Rule]:
        """Get highest confidence rules"""
        return sorted(self.rules, key=lambda r: r.confidence, reverse=True)[:limit]

    def get_problematic_rules(self, limit: int = 5) -> list[Rule]:
        """Get low-confidence rules that should be improved or removed"""
        problematic = [r for r in self.rules if r.confidence < 0.5 and r.uses > 2]
        return sorted(problematic, key=lambda r: r.confidence)[:limit]

    def prune_rules(self, min_confidence: float = 0.3, min_uses: int = 1) -> int:
        """Remove low-confidence or unused rules"""
        original_count = len(self.rules)
        self.rules = [
            r for r in self.rules if r.confidence >= min_confidence or r.uses < min_uses
        ]
        return original_count - len(self.rules)

    def get_learning_stats(self) -> dict:
        """Statistics about rule learning"""
        if not self.rules:
            return {
                "total_rules": 0,
                "avg_confidence": 0.0,
                "high_confidence_rules": 0,
            }

        confidences = [r.confidence for r in self.rules]
        high_conf = len([r for r in self.rules if r.confidence > 0.7])

        return {
            "total_rules": len(self.rules),
            "avg_confidence": sum(confidences) / len(confidences),
            "high_confidence_rules": high_conf,
            "successful_rules": len([r for r in self.rules if r.success_count > 0]),
        }

    def export_rules(self) -> list[dict]:
        """Export rules as dictionaries"""
        return [
            {
                "conditions": rule.conditions,
                "action": rule.action,
                "confidence": rule.confidence,
                "uses": rule.uses,
                "successes": rule.success_count,
            }
            for rule in self.rules
        ]
