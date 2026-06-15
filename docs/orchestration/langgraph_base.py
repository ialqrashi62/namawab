"""
NamaMedical — LangGraph base orchestrator.
Drop-in foundation for any department's AI co-pilot.

Departments inherit by:
  1) Subclassing DeptOrchestrator.
  2) Providing dept-specific tools (function-calling).
  3) Providing dept-specific RAG collections.
  4) Optionally overriding compose() / critique() for stricter rules.

Designed for KSA PDPL + CBAHI + IPSG safety:
- PHI redaction before LLM calls.
- Self-critique gate for safety-critical answers.
- Hash-chained audit logging.
"""

from __future__ import annotations

import os
import hashlib
import json
import time
from dataclasses import dataclass, field
from typing import TypedDict, Literal, Callable, Any

from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import StructuredTool
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from pydantic import BaseModel

# ────────────────────────────────────────────────────────────────────
# Models
# ────────────────────────────────────────────────────────────────────

LLM_MODEL = os.getenv("NAMA_LLM_MODEL", "claude-opus-4-7")
LLM_FAST = os.getenv("NAMA_LLM_FAST", "claude-haiku-4-5-20251001")

llm_main = ChatAnthropic(model=LLM_MODEL, temperature=0.0, max_tokens=2048)
llm_fast = ChatAnthropic(model=LLM_FAST, temperature=0.0, max_tokens=512)


# ────────────────────────────────────────────────────────────────────
# State
# ────────────────────────────────────────────────────────────────────

Intent = Literal[
    "triage", "order", "interpret", "prescribe", "handover",
    "question", "summarize", "discharge", "escalate"
]


class DeptState(TypedDict, total=False):
    dept_key: str
    user_id: str
    user_role: str
    user_lang: Literal["ar", "en"]
    question: str
    intent: Intent
    patient_id: str | None
    visit_id: str | None
    context_yaml: str
    rag_chunks: list[dict]
    tool_results: dict
    answer: str
    citations: list[str]
    confidence: float
    requires_human_confirm: bool
    safety_critical: bool
    audit_hash: str


# ────────────────────────────────────────────────────────────────────
# PHI redaction (lightweight; production uses a DLP gateway)
# ────────────────────────────────────────────────────────────────────

import re

PHI_PATTERNS = [
    (re.compile(r"\b\d{10}\b"), "[NID]"),
    (re.compile(r"\b\+?966\d{8,9}\b"), "[PHONE]"),
    (re.compile(r"\bP-\d{4,}\b"), "[MRN]"),
    (re.compile(r"\b\d{4}-\d{4}-\d{4}-\d{4}\b"), "[CARD]"),
]


def redact_phi(text: str) -> str:
    redacted = text
    for pattern, repl in PHI_PATTERNS:
        redacted = pattern.sub(repl, redacted)
    return redacted


# ────────────────────────────────────────────────────────────────────
# Audit (hash-chained)
# ────────────────────────────────────────────────────────────────────

_LAST_HASH = "0" * 64


def audit_log(event: dict) -> str:
    global _LAST_HASH
    serialized = json.dumps(event, sort_keys=True, ensure_ascii=False)
    payload = f"{_LAST_HASH}:{serialized}"
    new_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    # In production: persist to it_audit_logs table with prev_hash + this_hash.
    _LAST_HASH = new_hash
    return new_hash


# ────────────────────────────────────────────────────────────────────
# Base orchestrator
# ────────────────────────────────────────────────────────────────────

@dataclass
class DeptOrchestrator:
    dept_key: str
    system_prompt: str
    tools: list[StructuredTool] = field(default_factory=list)
    rag_collections: list[str] = field(default_factory=list)
    safety_topics: list[str] = field(default_factory=list)
    confidence_threshold: float = 0.7

    # ── Nodes ──────────────────────────────────────────────────────
    def classify_intent(self, state: DeptState) -> DeptState:
        prompt = (
            f"Classify the user's intent into one of: triage, order, interpret, "
            f"prescribe, handover, question, summarize, discharge, escalate.\n"
            f"Reply with JSON only: {{\"intent\": \"<x>\"}}.\n\n"
            f"User: {redact_phi(state['question'])}"
        )
        res = llm_fast.invoke([SystemMessage(content=self.system_prompt),
                               HumanMessage(content=prompt)])
        try:
            state["intent"] = json.loads(res.content).get("intent", "question")
        except Exception:
            state["intent"] = "question"
        return state

    def load_patient_context(self, state: DeptState) -> DeptState:
        # Hook: sub-classes integrate with ERP REST.
        # Default: passthrough.
        state.setdefault("context_yaml", "")
        return state

    def retrieve_rag(self, state: DeptState) -> DeptState:
        # Hook: integrate Qdrant client.
        state.setdefault("rag_chunks", [])
        # Example skeleton:
        # client = QdrantClient(url=os.getenv("QDRANT_URL"))
        # for col in self.rag_collections:
        #     hits = client.search(collection_name=col, query_vector=embed(state["question"]), limit=5)
        #     state["rag_chunks"].extend([{"source": col, "text": h.payload["text"]} for h in hits])
        return state

    def execute_tools(self, state: DeptState) -> DeptState:
        # In production: bind tools to llm_main with structured calls.
        state.setdefault("tool_results", {})
        return state

    def compose(self, state: DeptState) -> DeptState:
        rag_block = "\n\n".join(
            f"[{c['source']}] {c['text']}" for c in state.get("rag_chunks", [])
        )
        ctx = state.get("context_yaml", "")
        user_msg = (
            f"[CONTEXT]\n{ctx}\n\n[RAG]\n{rag_block}\n\n[USER]\n{state['question']}\n\n"
            f"Output: respond in {state.get('user_lang', 'ar')}. End with "
            f"'Next-best-action:' and 'Time-critical: yes|no'."
        )
        res = llm_main.invoke([SystemMessage(content=self.system_prompt),
                               HumanMessage(content=redact_phi(user_msg))])
        state["answer"] = res.content
        state["citations"] = [c["source"] for c in state.get("rag_chunks", [])]
        state["confidence"] = self._score_confidence(res.content)
        return state

    def critique(self, state: DeptState) -> DeptState:
        is_safety = self._is_safety_critical(state)
        state["safety_critical"] = is_safety
        if is_safety or state.get("confidence", 0) < self.confidence_threshold:
            state["requires_human_confirm"] = True
        else:
            state["requires_human_confirm"] = False
        state["audit_hash"] = audit_log({
            "ts": time.time(),
            "dept": self.dept_key,
            "user": state.get("user_id"),
            "intent": state.get("intent"),
            "patient_id": state.get("patient_id"),
            "answer_hash": hashlib.sha256(state["answer"].encode()).hexdigest()[:16],
            "confidence": state.get("confidence"),
            "safety_critical": is_safety,
        })
        return state

    # ── Helpers ────────────────────────────────────────────────────
    def _score_confidence(self, answer: str) -> float:
        # Lightweight heuristic; production uses a calibrated classifier.
        signals = ["I am not sure", "uncertain", "consult", "could be", "may be"]
        if any(s in answer.lower() for s in signals):
            return 0.6
        return 0.85

    def _is_safety_critical(self, state: DeptState) -> bool:
        text = (state.get("answer", "") + " " + state.get("question", "")).lower()
        topics = self.safety_topics + [
            "stemi", "stroke", "sepsis", "anaphylaxis", "code blue",
            "intubation", "anticoag init", "chemo", "pediatric dose",
            "consent", "surgery", "transfusion",
        ]
        return any(t in text for t in topics)

    # ── Build graph ────────────────────────────────────────────────
    def build(self):
        g = StateGraph(DeptState)
        g.add_node("classify", self.classify_intent)
        g.add_node("load_context", self.load_patient_context)
        g.add_node("rag", self.retrieve_rag)
        g.add_node("tools", self.execute_tools)
        g.add_node("compose", self.compose)
        g.add_node("critique", self.critique)
        g.set_entry_point("classify")
        g.add_edge("classify", "load_context")
        g.add_edge("load_context", "rag")
        g.add_edge("rag", "tools")
        g.add_edge("tools", "compose")
        g.add_edge("compose", "critique")
        g.add_edge("critique", END)
        return g.compile()


# ────────────────────────────────────────────────────────────────────
# Example: department subclass
# ────────────────────────────────────────────────────────────────────

CARDIO_SYSTEM = """You are NamaMedical-Cardiology Assistant.
ROLE: Help cardiologists, fellows, residents, cath-lab nurses, ICU nurses.
GUARDRAILS: ESC 2024+, AHA 2023+, local cardiology SOP.
- Anticoagulation: check CHA2DS2-VASc, HAS-BLED, CrCl.
- ACS/STEMI: triage with HEART; STEMI bypass within 10 min.
TOOLS: search_patient, get_ecg, get_echo, get_labs, compute_risk, pull_protocol, escalate.
STYLE: SOAP for notes, SBAR for handover, end with Next-best-action + Time-critical."""

CARDIO_SAFETY = ["stemi", "anticoag", "vt", "vf", "cardiogenic shock", "heart block"]


def build_cardio():
    orch = DeptOrchestrator(
        dept_key="cardiology",
        system_prompt=CARDIO_SYSTEM,
        tools=[],  # TODO: bind real tools
        rag_collections=["kb_guidelines_cardiology", "kb_local_sop_cardiology"],
        safety_topics=CARDIO_SAFETY,
    )
    return orch.build()


# ────────────────────────────────────────────────────────────────────
# Smoke test
# ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    graph = build_cardio()
    out = graph.invoke({
        "dept_key": "cardiology",
        "user_id": "U-DR-014",
        "user_role": "cardio_doctor",
        "user_lang": "ar",
        "question": "مريض atrial fib جديد، CHA2DS2-VASc=4، HAS-BLED=2، CrCl=48. ماذا تختار؟",
        "patient_id": "P-123456",
        "visit_id": "V-7788",
    })
    print(out["answer"])
    print(f"\nconfidence={out['confidence']}  needs_human={out['requires_human_confirm']}")
    print(f"audit_hash={out['audit_hash']}")
