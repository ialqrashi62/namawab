# nm-multi-agent-orchestrator-v2 — 7-Expert Panel Parallel Orchestrator v2

> Runs 7 experts concurrently per department blueprint.
> 7× speedup, ~60% fewer tokens vs sequential.

---

## 1. The 7 Experts Panel (Per Department)

### 1.1 CMO — Chief Medical Officer (Dr. Sarah Chen)
**Input:** dept name, subspecialties, conditions list
**Output:** `02_clinical_spec.md`
**Token budget:** ~600
**Focus:** Top 10 conditions, top 20 procedures, red flags, drug interactions, evidence citations (Uptodate/NCBI)

### 1.2 AIE — Chief AI Engineer (Eng. Marcus Patel)
**Input:** dept name, RAG collections list
**Output:** `03_ai_orchestration.md` + `10_langchain_chains.md` + `11_vector_mine.md`
**Token budget:** ~700
**Focus:** RAG chains (diagnosis/triage/drug-interactions), LangGraph agents, vector collections, embedding strategy

### 1.3 PSA — Principal Software Architect (Mr. David Kim)
**Input:** dept name, entity count
**Output:** `04_technical_architecture.md` + `12_api_openapi.yaml` + `13_data_erd.sql` + `14_*.sql` + `15_*.sql`
**Token budget:** ~1000
**Focus:** API surface, ERD, migrations, RBAC roles, tenant scoping

### 1.4 UXL — Product/UX Lead (Ms. Layla Hassan)
**Input:** dept name, screens list
**Output:** `05_ux_ui_stitch.md` + `22_*.tsx` + `23_*.tsx` + `24_*.ts` + `25_*.json` + `26_*.json` + `27_*.json`
**Token budget:** ~900
**Focus:** Stitch design system, wireframes, components, i18n AR/EN, RTL/LTR

### 1.5 CO — Compliance Officer (Mr. Turki Al-Otaibi)
**Input:** dept name, PHI categories
**Output:** `06_compliance_security.md` + `34_legal_compliance.md`
**Token budget:** ~600
**Focus:** JCI/CBAHI/NPHIES/PDPL/SFDA mappings, DPIA, threat model

### 1.6 DOL — DevOps Lead (Ms. Rania Farouk)
**Input:** dept name, deploy target
**Output:** `07_implementation_plan.md` + `09_workflow_orchestration.md` + `33_training_video_script.md`
**Token budget:** ~700
**Focus:** CI/CD, BPMN workflows, training materials

### 1.7 MO — Master Orchestrator (synthesizer)
**Input:** outputs of 6 experts
**Output:** `01_brain.md` (summary) + `35_pmo_budget.md` + index updates
**Token budget:** ~800

---

## 2. Parallel Run Pattern

```
For each dept in [DEP-001 ... DEP-060]:
  parallel([
    CMO.run(),
    AIE.run(),
    PSA.run(),
    UXL.run(),
    CO.run(),
    DOL.run(),
  ])
  → MO.synthesize()
  → 35 files written
```

**Wall-clock:** ~6 expert runs sequential = 6×T → parallel = ~1×T (6× speedup)
**Tokens:** Same total (parallel ≠ token saving), but **MO synthesis saves by referencing all experts concisely**

---

## 3. Expert Prompt Template

```markdown
You are <EXPERT_NAME>, a senior <ROLE> with <YEARS> years at <BACKGROUND>.
Your task: produce <OUTPUT_FILES> for department <DEPT_NAME> (<DEPT_CODE>).
Style: concise, table-first, evidence-based. Use snippet IDs (S-NN) from nm-token-saver-pack-v2.
Constraints: ≤<TOKEN_BUDGET> tokens. No prose padding. Cite sources.

Department config:
<YAML CONFIG>

Existing context:
- parent group: <PARENT_GROUP>
- related depts: <RELATED_DEPT_CODES>
- shared snippets: S-01, S-02, S-03, S-04, S-05, S-06, S-09, S-12

Output ONLY the file content, no preamble.
```

---

## 4. Synthesis (MO)

After 6 experts complete:
1. Read all 6 outputs (~5k tokens)
2. Generate `01_brain.md`:
   - Summary (3 paragraphs)
   - Table: 35 files × purpose × status
   - Dependencies to other depts
3. Generate `35_pmo_budget.md`:
   - Story points: backend (8) + frontend (5) + RAG (3) + tests (5) = 21 SP
   - Token budget: 15k (this dept)
   - Timeline: 1 sprint
   - Risks

---

## 5. Concurrency Limits

- **Max concurrent experts per dept:** 7
- **Max concurrent depts:** 5 (to keep total context manageable)
- **Recommended:** 3 depts × 7 experts = 21 parallel tasks (token-saver sweet spot)

---

## 6. Error Handling

| Expert Failure | Recovery |
|---|---|
| Token budget exceeded | Truncate + add "see appendix" |
| Schema invalid | Re-run with constraint reminder |
| Conflicting outputs | MO resolves with priority: clinical > technical > UX > compliance |
| Missing snippet | Inject fallback (longer template) |

---

## 7. Integration
- **Drives:** `nm-ultimate-blueprint-factory`
- **Uses:** `nm-token-saver-pack-v2` (S-NN library)
- **Loops:** `nm-loop-engineering-v2` (per-expert retry)
- **Run via:** `nm-autopilot-dept-generator` or `.ai-brain/03_AUTOPILOT/generate_all_depts.py`
