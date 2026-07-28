# MASTER_RUNBOOK — كيف تشغّل حزمة مهارات NamaMedical v2

> **الإصدار:** 2.0 · **التاريخ:** 2026-07-27
> **الحزمة:** 8 skills + MASTER_CATALOG_v3 + snippets_v2 + 60-file template
> **الهدف:** تشغيل 7-Expert Panel + 5-Loop Engineering + AUTOPILOT + Token-Saver على 100+ قسم

---

## TL;DR

```
1) اقرأ AGENTS.md (1 read, once)
2) اقرأ MASTER_CATALOG_v3.yaml (1 read, once)
3) اقرأ snippets_v2.md (1 read, once)
4) فعّل الـ 8 skills عبر nm-7-expert-panel-orchestrator
5) شغّل nm-autopilot-dept-generator على tier
6) لكل قسم: 5 loops (Discover→Plan→Build→Test→Verify)
7) nm-comprehensive-deliverables-checklist يتحقق L5
8) حدّث INDEX.md و current-phase.json و CHANGELOG.md
```

---

## 1) الـ 8 skills (الحزمة)

| # | Skill | Purpose | Path |
|---|-------|---------|------|
| 1 | `nm-7-expert-panel-orchestrator` | 7 خبيراء + ORC، صيغة موحدة | `.ai-brain/skills/nm-7-expert-panel-orchestrator/SKILL.md` |
| 2 | `nm-loop-engineering-v2` | 5 loops: Discover→Plan→Build→Test→Verify | `.ai-brain/skills/nm-loop-engineering-v2/SKILL.md` |
| 3 | `nm-autopilot-dept-generator` | Batch runner، 60 ملف/قسم | `.ai-brain/skills/nm-autopilot-dept-generator/SKILL.md` |
| 4 | `nm-token-saver-pack` | 8 تقنيات توفير توكنز (S1-S8) | `.ai-brain/skills/nm-token-saver-pack/SKILL.md` |
| 5 | `nm-stitch-medical-ui` | Google Stitch للـ UI/UX | `.ai-brain/skills/nm-stitch-medical-ui/SKILL.md` |
| 6 | `nm-dept-blueprint-template-v2` | قالب الـ 60 ملف | `.ai-brain/skills/nm-dept-blueprint-template-v2/SKILL.md` |
| 7 | `nm-rag-vector-mine` | LangChain + RAG + Vector DB | `.ai-brain/skills/nm-rag-vector-mine/SKILL.md` |
| 8 | `nm-comprehensive-deliverables-checklist` | تحقق 60+ deliverable | `.ai-brain/skills/nm-comprehensive-deliverables-checklist/SKILL.md` |

---

## 2) الـ reference files (load once per session)

```
.ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml       # 100+ dept catalog
.ai-brain/00_SYSTEM/MASTER_PROMPT_v3.md          # master system prompt
.ai-brain/LOOP_ENGINEERING_PLAYBOOK.md           # loop reference
.ai-brain/00_SYSTEM/DEPT_TEMPLATE.yaml           # YAML template
.ai-brain/skills/shared/snippets.md              # v1 snippets
.ai-brain/skills/shared/snippets_v2.md           # v2 canonical snippets
AGENTS.md                                        # safety rails
```

**حمّل كل اللي فوق مرة واحدة في بداية الـ session. لا تعيد قراءتها في كل turn.**

---

## 3) الـ 7-Expert Panel (لـ 7 خبيراء + ORC)

```
CMO  → clinical workflows, red flags, drug safety, guidelines
AIE  → LangChain, RAG, vector DB, LLM observability
SA   → backend/frontend, API, ERD, microservices
DSL  → CI/CD, security, infra, monitoring, secrets
PM/UX → user stories, wireframes, business flows, RTL/AR
CQO  → JCI, ISO, NPHIES, ZATCA, SFDA, PDPL, audit
ORC  → synthesis, token discipline, closeout
```

**أولوية القرار (تعارض):**
1. Patient safety (CMO) — veto
2. Compliance (CQO)
3. Security (DSL)
4. Clinical correctness (CMO)
5. AI feasibility (AIE)
6. Architecture feasibility (SA)
7. UX/DX (PM)

---

## 4) الـ 5-Loop Engineering (لكل قسم)

```
L1 DISCOVER  → facts only, no opinions
L2 PLAN      → approach + risks + rollback
L3 BUILD     → code + data + UI (no abbreviations)
L4 TEST      → unit + integration + e2e + cross-tenant + security
L5 VERIFY    → compliance + signoff
```

**Max 4 iterations per loop. بعد 4 → escalate to owner.**

---

## 5) AUTOPILOT (batch)

### Tier-1 batch (high-traffic, revenue-critical)
```
20 dept × 60 file = 1,200 files
~180,000 output tokens
1-2 sessions
Priority: Cardiology, ER, OBG, ICU, Surgery, Peds, Internal Med
```

### Tier-2 batch (specialties + diagnostics)
```
40 dept × 60 file = 2,400 files
~360,000 output tokens
2-3 sessions
```

### Tier-3 batch (support, admin, academic)
```
40 dept × 25 file = 1,000 files
~140,000 output tokens
2-3 sessions
```

### Tier-4 batch (rare + CoE composites)
```
20 dept × 15 file = 300 files
~40,000 output tokens
1-2 sessions
```

### Mode 1 — dry-run
فقط L1 + L2. لا ملفات تُكتب.

### Mode 2 — plan (default)
L1 + L2 + L3 (no test). 60 ملف/قسم.

### Mode 3 — plan + UI
Mode 2 + emphasis على Stitch artifacts.

### Mode 4 — plan + UI + backend (يتطلب موافقة المالك)
Mode 3 + L4 + L5 + code-level stubs.

---

## 6) Token-Saver (S1-S8)

| # | Technique | Saving |
|---|-----------|--------|
| S1 | schema_first | 25% |
| S2 | chunked_reasoning | 5% |
| S3 | id_reference | 5% |
| S4 | templated_output | 10% |
| S5 | cached_context | 10% |
| S6 | compressed_prompts | 10% |
| S7 | selective_depth (per tier) | 20% |
| S8 | parallel_gen (per dept) | wall-time |

**+ snippet reuse:** ~30% on common paragraphs.

**Effective Tier-2 dept:** ~3,000-4,000 output tokens.

---

## 7) Stitch (UI source)

```
Project: https://stitch.withgoogle.com/projects/17612445146025313712
Layouts: A-H
Tokens: 50+ in nm-stitch-medical-ui/SKILL.md
i18n: snippet:ar-rtl
```

**For any new screen:**
1. Start from Stitch
2. Map to `wireframe_v1` template
3. Apply design tokens (no hardcoded values)
4. Add AR + EN i18n keys
5. Use safe-HTML wrappers (`escapeHTML`, `SafeHtml`)

---

## 8) VectorMine (RAG / Vector DB)

```
Index naming: <tenant>.<group>.<topic>.<version>
Embedding: multilingual-e5-large (1024d, AR+EN)
Chunking: 512/64 default (varies by content type)
Retriever: MMR k=5, fetch_k=20, filter: {tenant_id, lang}
LLM observability: Langfuse (default)
Cost guard: per-tenant monthly cap
```

**Per-dept RAG:** files `09_langchain_chains.md` + `10_rag_chains.md` + `11_vector_store_schema.md`.

---

## 9) الـ 60-File Template (per dept)

| Range | Owner | Count | Tier applicability |
|-------|-------|-------|---------------------|
| 00-04 | CMO | 5 | all / 1,2 |
| 05-13 | AIE | 9 | 1,2 / 2,3 |
| 14-25 | SA | 12 | varies |
| 26-32 | PM | 7 | all / 1,2 |
| 33-41 | DSL | 9 | varies |
| 42-48 | CQO | 7 | varies |
| 49-52 | ORC+SA | 4 | 1,2,3 |
| 53-55 | PM+DSL | 3 | 2,3 |
| 56-60 | ORC | 5 | all |

**See `nm-dept-blueprint-template-v2/SKILL.md` for full file map + per-file templates.**

---

## 10) Safety Rails (NON-NEGOTIABLE)

| # | Rail | Why |
|---|------|-----|
| 1 | No hardcoded secrets | `.env` ignored, `.env.example` placeholders only |
| 2 | No PHI in commits/fixtures/sandbox | sandboxes use dummy data |
| 3 | No force-push to main/integration/audit | linear history |
| 4 | No DROP without backup | restore_db.sh required |
| 5 | Tenant isolation always on | RLS + requireTenantScope |
| 6 | Money routes idempotent + opt-in + fail-open | idempotency guard |
| 7 | PHI at rest encrypted | crypto_envelope (DPAPI KEK) |
| 8 | CSP report-only by default | no unsafe-eval/unsafe-inline |
| 9 | Money/VAT server-side only | parseMoney + finance_engine |
| 10 | Audit log hash-chained 7+ years | audit_middleware opt-in |
| 11 | Fail-closed on missing tenant | defense-in-depth |
| 12 | No print secrets/tokens/PHI | console.log req.body is a finding |
| 13 | Golden Access Rule | Owner-Admin absolute; Doctor specialty-scoped |

---

## 11) أوامر سريعة (الـ recipes)

### Recipe A: "ولّد قسم واحد (Tier-1)"
```
1. اقرأ MASTER_CATALOG_v3.yaml#<group>
2. فعّل nm-7-expert-panel-orchestrator + nm-loop-engineering-v2
3. شغّل 5 loops:
   L1: discovery.md (300-600 tokens)
   L2: plan.md (400-800)
   L3: 60 files (~9,000 tokens)
   L4: test_report.md (400-800)
   L5: closeout.md (200-400)
4. فعّل nm-comprehensive-deliverables-checklist → closeout signed
5. حدّث INDEX.md + current-phase.json
```

### Recipe B: "ولّد batch Tier-1 كامل (20 قسم)"
```
1. اقرأ MASTER_CATALOG_v3.yaml
2. فعّل nm-autopilot-dept-generator mode=plan
3. لكل قسم: Recipe A
4. بعد كل قسم: nm-comprehensive-deliverables-checklist
5. بعد الـ batch: حدّث INDEX.md + current-phase.json + CHANGELOG.md
6. أبلغ المالك للـ sign-off
```

### Recipe C: "حدّث قسم موجود"
```
1. L1 DISCOVER على القسم الحالي
2. L2 PLAN: ما الجديد؟ ما المحذوف؟ ما المخاطر؟
3. L3 BUILD: عدّل فقط الملفات المتأثرة
4. L4 TEST: regression
5. L5 VERIFY: closeout
```

### Recipe D: "أضف UI جديد (Stitch)"
```
1. فعّل nm-stitch-medical-ui
2. اختر layout A-H
3. ولد wireframe_v1
4. ولد i18n keys (snippet:ar-rtl)
5. ولد design tokens
6. هاتيب لـ nm-ai-brain-frontend-bridge للـ station.js
```

### Recipe E: "أضف RAG chain جديد"
```
1. فعّل nm-rag-vector-mine
2. حدد index: <tenant>.<group>.<topic>.<version>
3. اختر embedding model
4. حدد chunking strategy
5. ولد chain: retriever → reranker → LLM → parser
6. أضف LLMOps: Langfuse trace + cost guard
```

### Recipe F: "أضف section كامل من الـ catalog (مثلاً كل الباطنية)"
```
1. كل قسم من catalog: 8 subs للقلب، 6 للصدر، 7 للجهاز الهضمي...
2. nm-autopilot-dept-generator mode=plan+ui
3. لكل قسم 60 ملف (Tier-1) أو 40 (Tier-2) أو 25 (Tier-3)
4. batch-wise مع halt at each L5 signoff
```

---

## 12) حالات الإيقاف (halt & escalate)

- Loop exceeded 4 iterations → escalate to owner
- Safety rail violation detected → halt batch
- Token budget exceeded > 50% for a dept → halt, re-plan
- Cross-tenant test failure on Tier-1 → halt, fix, resume
- Compliance (JCI/CBAHI) fail on red-flag dept (ER/ICU/OBG) → halt

---

## 13) Post-batch housekeeping

```yaml
after_every_dept:
  - update .ai-brain/INDEX.md
  - update .ai-brain/DEPARTMENT_COVERAGE_MAP.md
  - update .ai-brain/99-state/current-phase.json
  - append to .ai-brain/AI_PROJECT_MEMORY.md

after_every_batch:
  - commit: docs(ai-brain): tier-N batch-N <group> complete
  - update CHANGELOG.md (top-level)
  - notify owner for sign-off
```

---

## 14) Sample command (Recipe B in one prompt)

```
# Generate Tier-1 batch for the 8 internal_medicine subspecialties

Use:
  - nm-7-expert-panel-orchestrator
  - nm-loop-engineering-v2
  - nm-autopilot-dept-generator mode=plan
  - nm-token-saver-pack
  - nm-dept-blueprint-template-v2
  - nm-stitch-medical-ui
  - nm-rag-vector-mine
  - nm-comprehensive-deliverables-checklist

Catalog: .ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml#internal_medicine
Snippets: .ai-brain/skills/shared/snippets_v2.md
Stitch: https://stitch.withgoogle.com/projects/17612445146025313712

For each of:
  - CARD-001 (Cardiology)
  - PULM-001 (Pulmonology)
  - GI-001 (Gastroenterology)
  - NEPH-001 (Nephrology)
  - ONC-001 (Hematology-Oncology)
  - ENDO-001 (Endocrinology)
  - RHEUM-001 (Rheumatology)
  - ID-001 (Infectious Diseases)
  - DERM-001 (Dermatology)

Apply: 5 loops, Tier-1 depth, 60 files each, 4-iteration cap, owner-escalation on conflict.

Output: ~9,000 tokens per dept × 9 depts = ~81,000 tokens.
```

---

## 15) Status (لحظة كتابة هذا الـ runbook)

| Tier | Group | Depts | Status |
|------|-------|-------|--------|
| 1 | Internal Medicine | 9 | ⏳ P3-B halted, awaiting owner signal |
| 1 | Surgical | 13 | ⏳ |
| 1 | OBGYN/Peds | 18 | ⏳ |
| 1 | Diagnostics | 12 | ⏳ |
| 1 | Critical Care | 19 | ⏳ |
| 2 | Surgical subspecs | 27 | ⏳ |
| 2 | OBGYN/Peds subspecs | 12 | ⏳ |
| 2 | Diagnostics subspecs | 14 | ⏳ |
| 2 | Rehab/Therapeutic | 19 | ⏳ |
| 3 | Support services | 35 | ⏳ |
| 3 | Admin/Academic | 18 | ⏳ |
| 4 | Rare + CoE | 24 | ⏳ |
| **Total** | | **220+** | ⏳ |

---

## 16) References

- AGENTS.md (charter + safety rails)
- `.ai-brain/INDEX.md` (master index)
- `.ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml` (canonical catalog)
- `.ai-brain/skills/shared/snippets_v2.md` (canonical snippets)
- `.ai-brain/skills/nm-*/SKILL.md` (8 skills)
- `.ai-brain/LOOP_ENGINEERING_PLAYBOOK.md` (loop reference)
- `namaweb/` (live code, source of truth for production)
- `docs/CHANGELOG.md` (release notes)
- `docs/PHASE_*_AR.md` (phase closeouts)

---

*حزمة v2 — 2026-07-27 — Mavis*
