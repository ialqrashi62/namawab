# 07 — Context Window Strategy (CARD-001)

> Owner: AIE · Tier 1

## Composition (target ≤ 8K tokens per call)

| Component | Tokens (est) | Strategy |
|-----------|--------------|----------|
| ROOT_SYSTEM_POLICY | 400 | cached (Anthropic prompt caching / OpenAI cache) |
| DEPARTMENT_PERSONA | 500 | cached per dept |
| Retrieved guidelines (top 5 chunks) | 2,500 | dynamic, MMR k=5 |
| Patient context (PHI-redacted) | 300 | dynamic |
| Encounter summary | 200 | dynamic |
| User question + history | 100-500 | dynamic |
| Response buffer | 1,000 | reserved |
| Tool/function schema | 300 | cached |
| **Total** | **~5,300** | leaves headroom |

## Caching strategy

- **Static prefix** (ROOT + DEPT_PERSONA + tool schema): cache for 1h
- **Per-patient prefix** (ctx + encounter): cache for 5min or invalidate on update
- **Dynamic suffix** (retrieval + question): always fresh

## Token budget alerts

- p50: 4,200 tokens
- p95: 6,800 tokens
- p99: 7,900 tokens
- Alert at > 8,000 (truncate retrieval to top 3, log)

## Truncation rules

1. Retrieved docs: keep top 3 if over budget
2. Patient history: keep last 3 visits
3. Lab results: keep last 7 days
4. Imaging: keep text report only (no DICOM in context)

## Refusal triggers

- Patient context from another tenant → refuse
- Encounter_id not in user's tenant → refuse
- Bulk export request → refuse
- PHI detected in user input → warn + sanitize
