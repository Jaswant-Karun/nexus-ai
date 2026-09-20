# NEXUS AI — Multi-Model LLM Routing Guide

## Overview
Nexus Auto utilizes heuristic and semantic classification to dispatch prompts to the optimal model:

1. **Analytical & Reasoning Tasks**: Routed to `gpt-4o` or `claude-3-5-sonnet`.
2. **High-Speed & Summarization Tasks**: Routed to `gemini-2.5-flash` for sub-second latency.
3. **Coding & Technical Audits**: Routed to `gpt-4o` or `claude-3-5-sonnet`.
4. **Fallback Handling**: If a provider experiences rate limits or HTTP 5xx errors, requests automatically fall back to the next available tier without disrupting the user session.
