"""
NEXUS AI — Knowledge Graph Builder
Extracts entities and relationships from text to build a
structured knowledge graph for semantic reasoning.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Any

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

EXTRACT_PROMPT = """Extract entities and relationships from the text.
Return JSON:
{
  "entities": [{"id": "e1", "label": "...", "type": "PERSON|ORG|PLACE|CONCEPT|EVENT|DATE"}],
  "relationships": [{"source": "e1", "relation": "WORKS_AT", "target": "e2"}]
}"""


@dataclass
class Entity:
    id:    str
    label: str
    type:  str   # PERSON | ORG | PLACE | CONCEPT | EVENT | DATE


@dataclass
class Relationship:
    source:   str    # entity id
    relation: str
    target:   str    # entity id
    weight:   float = 1.0


@dataclass
class KnowledgeGraph:
    entities:      dict[str, Entity]       = field(default_factory=dict)
    relationships: list[Relationship]      = field(default_factory=list)

    def add_entity(self, entity: Entity) -> None:
        self.entities[entity.id] = entity

    def add_relationship(self, rel: Relationship) -> None:
        self.relationships.append(rel)

    def get_neighbours(self, entity_id: str) -> list[str]:
        return list({
            r.target if r.source == entity_id else r.source
            for r in self.relationships
            if entity_id in (r.source, r.target)
        })

    def stats(self) -> dict:
        return {
            "entities":      len(self.entities),
            "relationships": len(self.relationships),
            "entity_types":  list({e.type for e in self.entities.values()}),
        }


class KnowledgeGraphBuilder:
    def __init__(self, model: str = "gpt-4o"):
        self.model = model
        self.graph = KnowledgeGraph()

    def extract(self, text: str) -> dict:
        """Extract entities and relationships from text."""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": EXTRACT_PROMPT},
                {"role": "user",   "content": f"Text:\n{text[:3000]}"},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        data   = json.loads(resp.choices[0].message.content or "{}")
        tokens = resp.usage.total_tokens if resp.usage else 0

        for e in data.get("entities", []):
            self.graph.add_entity(Entity(id=e["id"], label=e["label"], type=e.get("type", "CONCEPT")))

        for r in data.get("relationships", []):
            self.graph.add_relationship(Relationship(
                source=r["source"], relation=r["relation"], target=r["target"]
            ))

        return {"extracted": data, "graph_stats": self.graph.stats(), "tokens_used": tokens}

    def query(self, entity_label: str) -> dict:
        """Find an entity and its connections."""
        found = next((e for e in self.graph.entities.values()
                      if entity_label.lower() in e.label.lower()), None)
        if not found:
            return {"found": False, "entity": entity_label}
        neighbours_ids  = self.graph.get_neighbours(found.id)
        neighbours      = [self.graph.entities[nid].label for nid in neighbours_ids
                           if nid in self.graph.entities]
        rels            = [r for r in self.graph.relationships
                           if r.source == found.id or r.target == found.id]
        return {
            "found":         True,
            "entity":        {"id": found.id, "label": found.label, "type": found.type},
            "neighbours":    neighbours,
            "relationships": [{"relation": r.relation,
                                "other": self.graph.entities.get(
                                    r.target if r.source == found.id else r.source,
                                    Entity("?","?","?")
                                ).label} for r in rels[:10]],
        }
