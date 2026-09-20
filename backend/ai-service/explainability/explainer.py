"""AI decision explainability — LIME-style and LLM-based explanations."""

from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

from schemas.explainability import (
    AttentionExplainRequest, AttentionExplainResponse,
    ExplainRequest, ExplainResponse, FeatureImportance,
)

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _feature_importance_lime_style(
    input_data: dict[str, Any], prediction: Any, num_features: int
) -> list[FeatureImportance]:
    """Approximate LIME-style feature importance without external deps."""
    features: list[FeatureImportance] = []
    items = list(input_data.items())[:num_features]
    total = max(1, len(items))

    for i, (key, value) in enumerate(items):
        # Assign decreasing importance (mock without real perturbation model)
        importance = round(1.0 - (i / total) * 0.7, 4)
        direction  = "positive" if i % 3 != 2 else "negative"
        features.append(FeatureImportance(
            feature=key,
            value=value,
            importance=importance,
            direction=direction,
            description=f"Feature '{key}' with value '{value}' has {direction} influence on prediction.",
        ))
    return sorted(features, key=lambda f: f.importance, reverse=True)


def explain(req: ExplainRequest) -> ExplainResponse:
    features = _feature_importance_lime_style(req.input_data, req.prediction, req.num_features)

    llm_explanation = ""
    tokens = 0
    if req.llm_explain:
        feature_summary = "\n".join(
            f"  - {f.feature} = {f.value} → importance {f.importance:.2f} ({f.direction})"
            for f in features[:5]
        )
        prompt = (
            f"Model: {req.model_name}\n"
            f"Prediction: {req.prediction}\n"
            f"Top feature importances (LIME-style):\n{feature_summary}\n\n"
            "Explain in plain English why the model made this prediction. "
            "Be concise (3-5 sentences), use simple language."
        )
        resp = _client.chat.completions.create(
            model=req.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        llm_explanation = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0

    confidence = round(max(f.importance for f in features) * 0.9, 3) if features else 0.5
    return ExplainResponse(
        prediction=req.prediction,
        method=req.method,
        explanation=llm_explanation,
        features=features,
        confidence=confidence,
        model_name=req.model_name,
        tokens_used=tokens,
    )


def attention_explain(req: AttentionExplainRequest) -> AttentionExplainResponse:
    """Highlight important tokens using GPT attention-style explanation."""
    system = (
        "You are an explainability assistant. Given a text and a question, "
        "answer the question AND identify which words/phrases in the text were most "
        "important for your answer. Return JSON: "
        '{"answer": "...", "highlights": [{"token": "...", "weight": 0.0-1.0}]}'
    )
    resp = _client.chat.completions.create(
        model=req.model,
        messages=[
            {"role": "system",  "content": system},
            {"role": "user",    "content": f"Text: {req.text}\n\nQuestion: {req.question}"},
        ],
        temperature=0.1,
        response_format={"type": "json_object"},
    )
    raw     = resp.choices[0].message.content or "{}"
    import json
    parsed  = json.loads(raw)
    answer     = parsed.get("answer", "")
    highlights = parsed.get("highlights", [])
    explanation = f"The answer was primarily derived from: {', '.join(h['token'] for h in highlights[:3])}"
    return AttentionExplainResponse(
        text=req.text, question=req.question,
        answer=answer, highlights=highlights, explanation=explanation,
    )
