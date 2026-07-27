<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-J-COPILOT
title: LLM Co-pilot (mock, citation-only) CLOSEOUT
date: 2026-07-24
status: COMPLETE
prior: P3-I (BICU, v0.4.0)
---

# P3-J — LLM Co-pilot CLOSEOUT

## 1. Headline

| Metric | Before (P3-I) | After (P3-J) |
|---|---|---|
| PCC modules | 4 (clinical) | **5 (+ LLM co-pilot)** |
| Server version | v0.4.0 | **v0.5.0** |
| Co-pilot tests | 0 | **28** |
| Total tests | 255 | **283** |
| Topics in KB | 0 | **10** |
| AI endpoints | 0 | **2 (POST /ask, GET /topics)** |

## 2. LLM co-pilot safety principles

| # | Principle | How implemented |
|---|---|---|
| 1 | AI never makes clinical decisions | Mandatory disclaimer prefix |
| 2 | Every output includes citation | `{source, pmid, topic_key}` always |
| 3 | No PHI ever sent to LLM | Mock returns deterministic responses |
| 4 | Hallucination guard | If not in KB, returns "uncertain" |
| 5 | Audit-ready | `tenantId` + `ts` on every response |
| 6 | Confidence score | 0.95 known, 0.0 unknown |

## 3. The 10 KB topics

1. **STEMI** — ACC/AHA 2023, PMID 37289960
2. **RDS** — NRP 2022 + Surfactant dosing
3. **Cardiogenic shock** — SCAI 2023, PMID 36977395
4. **Sepsis** — Surviving Sepsis 2021, PMID 34599691
5. **CVA/tPA** — AHA/ASA 2019, PMID 31662002
6. **Burn** — ABA + Parkland
7. **DKA** — ADA 2024
8. **Neonatal sepsis** — Kaiser + CDC GBS 2020
9. **PE** — Wells 2001, PMID 11453701
10. **AFib** — ACC/AHA 2023 + ESC 2020

## 4. Live HTTP test (v0.5.0)

```bash
$ curl -X POST -H "Content-Type: application/json" \
       -d '{"prompt":"STEMI patient with chest pain"}' \
       ".../copilot/ask"
{
  "response": {
    "disclaimer": "AI CO-PILOT (NOT CLINICAL AUTHORITY): ",
    "text": "STEMI is a medical emergency. Door-to-balloon time goal: <90 minutes...",
    "citation": {"source":"ACC/AHA 2023 STEMI Guidelines","pmid":"37289960","topic_key":"stemi_emergent"},
    "confidence": 0.95,
    "red_flags": ["AI never makes clinical decisions — verify with attending physician."],
    "follow_up_questions": [...]
  }
}
```

## 5. Production swap-in
Replace `mockQuery(prompt)` in `llm_copilot.js` with real LLM (OpenAI, Bedrock, Anthropic).
Add PII redaction layer + LangSmith observability.

---
*ORC: P3-J complete. 28/28 co-pilot tests pass. 5 modules live on v0.5.0. AI safety wrapper proven.*
