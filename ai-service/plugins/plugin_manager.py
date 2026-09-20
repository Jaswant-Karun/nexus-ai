"""
NEXUS AI Service — Plugin Manager
Extensible plugin system for adding custom tools, models, and integrations
to the NEXUS AI platform without modifying core code.
"""

from __future__ import annotations

import importlib
import importlib.util
import os
import sys
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Plugin:
    name:        str
    version:     str
    description: str
    author:      str = ""
    category:    str = "general"   # tool | model | integration | processor
    enabled:     bool = True
    hooks:       dict[str, Callable] = field(default_factory=dict)
    metadata:    dict[str, Any]      = field(default_factory=dict)


class PluginManager:
    """Registry and lifecycle manager for NEXUS AI plugins."""

    def __init__(self):
        self._plugins: dict[str, Plugin] = {}
        self._hooks: dict[str, list[Callable]] = {}   # event → [handlers]

    def register(self, plugin: Plugin) -> None:
        self._plugins[plugin.name] = plugin
        for event, handler in plugin.hooks.items():
            self._hooks.setdefault(event, []).append(handler)

    def unregister(self, name: str) -> bool:
        plugin = self._plugins.pop(name, None)
        if plugin:
            for event, handler in plugin.hooks.items():
                if event in self._hooks and handler in self._hooks[event]:
                    self._hooks[event].remove(handler)
        return bool(plugin)

    def enable(self, name: str) -> bool:
        if name in self._plugins:
            self._plugins[name].enabled = True
            return True
        return False

    def disable(self, name: str) -> bool:
        if name in self._plugins:
            self._plugins[name].enabled = False
            return True
        return False

    def trigger(self, event: str, *args, **kwargs) -> list[Any]:
        """Fire all handlers registered for an event."""
        results = []
        for handler in self._hooks.get(event, []):
            try:
                results.append(handler(*args, **kwargs))
            except Exception as exc:
                results.append({"error": str(exc)})
        return results

    def list_plugins(self, category: str | None = None) -> list[dict]:
        plugins = self._plugins.values()
        if category:
            plugins = [p for p in plugins if p.category == category]  # type: ignore[assignment]
        return [{"name": p.name, "version": p.version, "description": p.description,
                 "category": p.category, "enabled": p.enabled} for p in plugins]

    def get(self, name: str) -> Plugin | None:
        return self._plugins.get(name)


# ── Global plugin manager instance ────────────────────────────────────────────
manager = PluginManager()

# ── Example built-in plugins ──────────────────────────────────────────────────
manager.register(Plugin(
    name="nexus-core",
    version="1.0.0",
    description="Core NEXUS AI platform plugin providing base tools and integrations",
    author="NEXUS AI",
    category="integration",
    enabled=True,
))
