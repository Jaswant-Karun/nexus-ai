"""
NEXUS AI Service — Fine-Tuning Data Preparation
Utilities for preparing, formatting, and validating training datasets
for LLM fine-tuning (OpenAI fine-tune format, Alpaca, ShareGPT).
"""

from __future__ import annotations

import json
import random
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass
class TrainingExample:
    system:    str
    user:      str
    assistant: str
    metadata:  dict[str, Any] | None = None


class FineTuneDataset:
    """Manage a fine-tuning dataset with validation and format conversion."""

    def __init__(self, name: str = "nexus_dataset"):
        self.name     = name
        self.examples: list[TrainingExample] = []

    def add(self, system: str, user: str, assistant: str,
            metadata: dict | None = None) -> None:
        self.examples.append(TrainingExample(
            system=system, user=user, assistant=assistant, metadata=metadata
        ))

    def add_batch(self, pairs: list[dict]) -> None:
        for p in pairs:
            self.add(
                system=p.get("system", "You are a helpful AI assistant."),
                user=p.get("user", p.get("prompt", "")),
                assistant=p.get("assistant", p.get("completion", "")),
                metadata=p.get("metadata"),
            )

    def to_openai_format(self) -> list[dict]:
        """Convert to OpenAI fine-tuning JSONL format."""
        records = []
        for ex in self.examples:
            messages = [{"role": "system",    "content": ex.system},
                        {"role": "user",      "content": ex.user},
                        {"role": "assistant", "content": ex.assistant}]
            records.append({"messages": messages})
        return records

    def to_alpaca_format(self) -> list[dict]:
        return [{"instruction": ex.user, "input": "", "output": ex.assistant}
                for ex in self.examples]

    def save_jsonl(self, path: str, format: str = "openai") -> Path:
        output_path = Path(path)
        records = self.to_openai_format() if format == "openai" else self.to_alpaca_format()
        with open(output_path, "w", encoding="utf-8") as f:
            for r in records:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        return output_path

    def split(self, train_ratio: float = 0.9) -> tuple["FineTuneDataset", "FineTuneDataset"]:
        """Split into train and validation sets."""
        shuffled = list(self.examples)
        random.shuffle(shuffled)
        split_at = int(len(shuffled) * train_ratio)

        train_ds = FineTuneDataset(f"{self.name}_train")
        val_ds   = FineTuneDataset(f"{self.name}_val")
        train_ds.examples = shuffled[:split_at]
        val_ds.examples   = shuffled[split_at:]
        return train_ds, val_ds

    def validate(self) -> dict:
        issues = []
        for i, ex in enumerate(self.examples):
            if not ex.user.strip():
                issues.append(f"Example {i}: empty user message")
            if not ex.assistant.strip():
                issues.append(f"Example {i}: empty assistant message")
        return {
            "count":     len(self.examples),
            "valid":     len(issues) == 0,
            "issues":    issues,
            "avg_length": (
                sum(len(e.user) + len(e.assistant) for e in self.examples)
                // max(len(self.examples), 1)
            ),
        }

    def stats(self) -> dict:
        return {
            "name":     self.name,
            "count":    len(self.examples),
            "validate": self.validate(),
        }
