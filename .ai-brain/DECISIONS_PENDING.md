# DECISIONS_PENDING — Master Prompt v1.0 vs Live System

> **Status:** � PARTIALLY RESOLVED 2026-07-24 — owner issued "go" on option (A)
> from PHASE_0_CLOSEOUT.md §6. §1, §2, §3 marked resolved with the
> constraints captured below. §4 (layout), §5 (sequencing), §6 (default
> fallback) are already in force. §7 is reference only. §8 is the new
> sign-off block.
> **Created:** 2026-07-24
> **Scope:** Decisions that arise from a brand-new master prompt (provided by owner
> 2026-07-24, "البناء الرئيسي" v1.0) being compared with the existing `.ai-brain/`
> state (built 2026-07-22/23) and the live `namaweb/` deployment.

---

## 0. The contradiction in one paragraph

The new master prompt asks for a **greenfield** system on **Python/FastAPI +
Next.js 14 + LangChain + ChromaDB + Terraform + JCI/HIPAA**, covering
**38 departments**. The existing `.ai-brain/` is a **2,228-file, 62-module
blueprint** built on **Node/Express + Vanilla JS + NPHIES/SFDA/CBAHI/PDPL**,
covering **46 specialties × 16 facility types**, with a 7-expert panel +
4-LOOP engine already shipped. The live application is the same Node/Express
stack, **already deployed** at `jumanasoft.com` (Hetzner 204.168.144.74,
`integration/all-epics @ 4ba005e`). Writing Phase 1+ files to the new
prompt's paths and stack will **not integrate** with the live system and
will **collide** with the existing blueprints.

This file enumerates every decision the owner must make before Phase 1.

---

## 1. Stack decision (BLOCKING)

| # | Layer | New master prompt | Existing `.ai-brain/` + live `namaweb/` | Owner pick |
|---|---|---|---|---|
| 1.1 | Backend language | Python 3.11+ | Node.js (Express) | ☐ Python (new) ☐ Node (existing) ☐ Both — Python as reference only |
| 1.2 | Backend framework | FastAPI | Express + helmet + express-rate-limit | ☐ FastAPI ☐ Express ☐ Reference only |
| 1.3 | ORM | SQLAlchemy 2.0 | `pg` (raw pool) + hand-written SQL migrations | ☐ SQLAlchemy ☐ `pg` ☐ N/A (reference) |
| 1.4 | Frontend | Next.js 14 (App Router) | Vanilla JS SPA (3 HTML + 17 JS modules) | ☐ Next.js ☐ Vanilla JS ☐ Reference only |
| 1.5 | Styling | "Google Stitch aesthetic" | Tailwind (compiled, 66,553 bytes, stale 2026-06-13) | ☐ Stitch ☐ Tailwind ☐ Reference only |
| 1.6 | i18n / RTL | Arabic RTL + English LTR | Arabic-first + English, RTL-first (`tr()` helper, 70 references) | ☐ Both ☐ Arabic-first ☐ Reference only |
| 1.7 | Vector store | ChromaDB | PGVector / `nm_ai_rag_vector` skill (per skills index) | ☐ ChromaDB ☐ PGVector ☐ Reference only |
| 1.8 | LLM framework | LangChain 0.1+ (text-embedding-3-large) | `ai_langchain_shim.js` (drop-in shim, gpt-4-turbo via `LLMClient`; deterministic fallback) | ☐ LangChain ☐ shim ☐ Reference only |
| 1.9 | IaC | Terraform | PM2 + Hetzner + `.env` + `ops/live_deploy/` | ☐ Terraform ☐ PM2 ☐ Reference only |
| 1.10 | Orchestration | Kubernetes | Single Hetzner VM (PM2) | ☐ k8s ☐ PM2 ☐ Reference only |

**Default if no decision:** write new-prompt files as **"BLUEPRINT v2 — informational, not yet live"** in the new layout, leave the existing system and `namaweb/` untouched.

**Owner decision 2026-07-24 (option A):** ✅ Adopt the default. Every new file gets the "BLUEPRINT v2 — informational, not yet live" banner. Existing system and `namaweb/` remain untouched.

---

## 2. Compliance decision (BLOCKING)

| # | Concern | New master prompt | Existing `.ai-brain/` + live `namaweb/` | Owner pick |
|---|---|---|---|---|
| 2.1 | Primary regulator | JCI (international) | CBAHI (Saudi) + NPHIES (claims) + ZATCA (invoicing) + PDPL (privacy) + SFDA (drugs) | ☐ JCI ☐ CBAHI ☐ JCI + CBAHI (dual track) ☐ Reference only |
| 2.2 | Privacy | HIPAA | PDPL (Saudi Personal Data Protection Law) | ☐ HIPAA ☐ PDPL ☐ Both ☐ Reference only |
| 2.3 | Interop | HL7-FHIR R4 | HL7-FHIR R4 (FHIR sandbox live: `tools/fhir-sandbox/`, HAPI FHIR transaction ingest) | ✅ Both agree — keep as-is |
| 2.4 | Coding systems | ICD-10 + SNOMED-CT | ICD-10 + SNOMED-CT (live) | ✅ Both agree — keep as-is |

> JCI is **not** a Saudi regulatory requirement. CBAHI is. The new prompt
> listing JCI without CBAHI is a misrepresentation of the live platform.
> If JCI is desired, it is an **add-on** (international hospital
> accreditation), not a substitute.

---

## 3. Scope decision (BLOCKING)

| # | Item | New master prompt | Existing `.ai-brain/` | Live `namaweb/` | Owner pick |
|---|---|---|---|---|---|
| 3.1 | Department count | 38 (DEP-001..DEP-038) | 62 modules × ~36 files | 44 clinical + 16 facility types | ☐ 38 ☐ 44 ☐ 46 ☐ 62 ☐ All (union) |
| 3.2 | Department IDs | New scheme `DEP-XXX` | Existing scheme `ER-001`, `MICU`, `OBG-001`, `SURG-001` ... | Mixed (route + station per spec) | ☐ New DEP-XXX ☐ Existing scheme ☐ Both (alias map) |
| 3.3 | Facility types | Not mentioned | 16 (medical_city, general_hospital, …) | 16 (entitlement matrix) | ✅ Existing — keep |

> Without an ID-alias map, the new `DEP-001..DEP-038` will not match the
> existing `ER-001..SURG-012` modules and the `namaweb/public/js/app.js`
> routes. This will produce two parallel taxonomies that drift.

---

## 4. Layout decision (NON-BLOCKING, already taken)

**Taken 2026-07-24 in session with owner (Q2 = "Reconcile — add your layout alongside"):**

- New layout created **alongside** the existing `00_SYSTEM/...14_OBSERVABILITY/`.
- New paths: `99-state/`, `00-orchestrator/`, `01-requirements/`,
  `03-database/schemas/`, `04-backend/`, `05-frontend/`, `06-vector-rag/`,
  `07-devops/`, `08-testing/`, `09-docs/`, `10-compliance/`, `11-security/`,
  `12-project-mgmt/`, `13-business/`.
- Cross-links added in `.ai-brain/INDEX.md`.
- **No files migrated out of the existing layout.** Any tool that
  references `00_SYSTEM/MASTER_PROMPT_v3.md`, `02_MODULES/ER-001/`, etc.
  continues to work.

---

## 5. Phase sequencing decision (NON-BLOCKING, already taken)

**Taken 2026-07-24 in session with owner (Q4 = "Phase 0 only, then stop and wait"):**

- This session delivered **Phase 0 only** (T-001..T-006 + DECISIONS file).
- Phase 1 (PostgreSQL DDL × 38) is **deferred** until owner answers §1, §2, §3
  above and explicitly issues "go" for Phase 1.
- Rationale: writing 38 SQL DDL files into a parallel layout with the wrong
  ORM / wrong stack will create **600+ lines of dead blueprint per dept**
  that future agents must reconcile.

---

## 6. What will happen if §1/§2/§3 remain unanswered at Phase 1

The default fallback is:

1. **Layout:** alongside (already done).
2. **Scope:** deliver 38 `DEP-001..DEP-038` **identifier stubs** in
   `01-requirements/medical-departments-tree.yaml` with `aliases:` lists
   pointing to existing modules where they overlap. No SQL written.
3. **Stack:** "BLUEPRINT v2 — informational" banner on every new file.
4. **Compliance:** cite both stacks explicitly in every compliance doc
   (JCI + CBAHI; HIPAA + PDPL) so the document is not lying.
**Owner decision 2026-07-24 (option A):** ✅ Dual-track. JCI is an add-on (international accreditation), CBAHI is the Saudi live authority. PDPL is the live privacy law; HIPAA is the US equivalent. Both will be cited.
This keeps the work reversible.

---

## 7. Reference: where the live system actually stands

From `/memories/repo/remediation_state.md` (2026-07-23):

- Live HEAD: `4ba005e` on `integration/all-epics` — pushed + deployed
- 47 v2 calculator endpoints live at `/api/phase3/v2/*`
- 21 AI orchestrator routes live at `/api/ai/*` (13 orchestrators)
- `stitch-globals-bridge.js` + 2 modules live
- Tailwind compiled CSS: 66,553 bytes (stale 2026-06-13)
- Local tests: 175/175 passed, 67 skipped (need DB)
- Live tests: 170/175 passed (5 fails = pre-existing infra tests, not Phase 3)
- PM2: PID 850915, uptime 45s+ after reload
- `stash@{0}` on server (213K lines, production customizations) — **not yet
  applied**, owner decision pending on `pop` vs `discard`
- 78 SQL migrations ready to apply to live DB — **not yet applied**, owner
  authorization pending

The system is **mid-flight on Phase 3**, not at greenfield Phase 0. Any
new master prompt must acknowledge this.

---

## 8. Sign-off

Owner: ______________________   Date: ____________

Decisions taken: §1 ☐ §2 ☐ §3 ☐   (initial each)

Next action on "go": ______________________ (e.g. "proceed to Phase 1 with stack=Express, scope=44, compliance=CBAHI+PDPL+JCI add-on")
