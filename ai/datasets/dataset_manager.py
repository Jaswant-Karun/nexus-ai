"""
NEXUS AI — Dataset Manager
Utilities for loading, splitting, augmenting, and managing AI datasets.
"""

from __future__ import annotations

import json
import random
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class Dataset:
    name:    str
    records: list[dict[str, Any]] = field(default_factory=list)

    def __len__(self) -> int:
        return len(self.records)

    def add(self, record: dict[str, Any]) -> None:
        self.records.append(record)

    def sample(self, n: int, seed: int = 42) -> "Dataset":
        rng  = random.Random(seed)
        samp = rng.sample(self.records, min(n, len(self.records)))
        return Dataset(name=f"{self.name}_sample", records=samp)

    def split(self, ratio: float = 0.8, seed: int = 42) -> tuple["Dataset", "Dataset"]:
        shuffled = list(self.records)
        random.Random(seed).shuffle(shuffled)
        split = int(len(shuffled) * ratio)
        train = Dataset(f"{self.name}_train", shuffled[:split])
        test  = Dataset(f"{self.name}_test",  shuffled[split:])
        return train, test

    def filter(self, predicate) -> "Dataset":
        return Dataset(self.name, [r for r in self.records if predicate(r)])

    def save_jsonl(self, path: str) -> Path:
        p = Path(path)
        with open(p, "w", encoding="utf-8") as f:
            for r in self.records:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        return p

    @classmethod
    def from_jsonl(cls, path: str, name: str = "") -> "Dataset":
        records = []
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    records.append(json.loads(line))
        return cls(name=name or Path(path).stem, records=records)

    @classmethod
    def from_list(cls, name: str, items: list[dict]) -> "Dataset":
        return cls(name=name, records=items)

    def stats(self) -> dict:
        return {
            "name":    self.name,
            "count":   len(self.records),
            "columns": list(self.records[0].keys()) if self.records else [],
        }
