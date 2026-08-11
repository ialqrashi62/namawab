#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-ultimate-blueprint-factory.py
Generates 35 files per department from a single YAML config.
Uses Jinja2 templates (snippets S-01..S-20 from nm-token-saver-pack-v2).

Usage:
  python nm-ultimate-blueprint-factory.py --config <yaml> --out <dir>
"""
import os
import sys
import io
import yaml
import json
import argparse
from pathlib import Path
from datetime import datetime
from jinja2 import Template

# Force UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


# ============ 35 FILE TEMPLATES (using snippets) ============

TEMPLATES = {
    "01_brain.md": """# {{dept.name_en}} ({{dept.code}}) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | {{dept.code}} |
| Arabic | {{dept.name_ar}} |
| English | {{dept.name_en}} |
| Group | {{dept.parent_group}} |
| Facility Types | {{dept.facility_types | join(', ')}} |

## Subspecialties
{% for s in dept.subspecialties %}- {{s}}
{% endfor %}

## Top 10 Conditions (ICD-10)
{% for c in dept.conditions_top10 %}{{loop.index}}. {{c}}
{% endfor %}

## Top 20 Procedures (SNOMED-CT)
{% for p in dept.procedures_top20 %}{{loop.index}}. {{p}}
{% endfor %}

## Red Flags
{% for r in dept.red_flags %}- ⚠️ {{r}}
{% endfor %}

## Risk Stratification Scores
{% for s in dept.scores %}- {{s}}
{% endfor %}

## File Manifest (35 files)
1. **01_brain.md** — this file
2. **02_clinical_spec.md** — clinical specifications (CMO)
3. **03_ai_orchestration.md** — RAG/LangGraph (AIE)
4. **04_technical_architecture.md** — APIs/ERD (Architect)
5. **05_ux_ui_stitch.md** — Stitch UI (UX)
6. **06_compliance_security.md** — JCI/CBAHI/NPHIES (Compliance)
7. **07_implementation_plan.md** — DevOps deploy plan
8. **08_prompt_engineering.md** — System prompts
9. **09_workflow_orchestration.md** — BPMN state machine
10. **10_langchain_chains.md** — Chains + Agents
11. **11_vector_mine.md** — Vector collections
12. **12_api_openapi.yaml** — OpenAPI 3.0.3
13. **13_data_erd.sql** — ERD DDL
14. **14_data_migrations_up.sql** — forward
15. **15_data_migrations_down.sql** — reverse
16. **16_data_seed.sql** — ICD/SNOMED/drugs
17. **17_rag_pipeline.py** — Python RAG pipeline
18. **18_backend_models.py** — SQLAlchemy models
19. **19_backend_schemas.py** — Pydantic schemas
20. **20_backend_service.py** — Business logic
21. **21_backend_router.py** — FastAPI router
22. **22_frontend_page.tsx** — Main page (Stitch)
23. **23_frontend_components.tsx** — Components
24. **24_frontend_api_client.ts** — API client
25. **25_style_guide_tokens.json** — Design tokens
26. **26_i18n_ar.json** — Arabic strings
27. **27_i18n_en.json** — English strings
28. **28_test_unit.py** — Unit tests
29. **29_test_integration.py** — Integration tests
30. **30_test_bdd.feature** — BDD scenarios
31. **31_user_manual_ar.md** — User manual AR
32. **32_user_manual_en.md** — User manual EN
33. **33_training_video_script.md** — Training video
34. **34_legal_compliance.md** — Legal docs
35. **35_pmo_budget.md** — Agile + Budget

## Dependencies
- Parent: {{dept.parent_group}}
- Related: {{dept.related_depts | default([]) | join(', ')}}

---
Generated: {{generated_at}}
""",

    "02_clinical_spec.md": """# Clinical Specification — {{dept.name_en}} ({{dept.code}})

> **CMO:** Dr. Sarah Chen · Generated {{generated_at}}

## 1. Scope
This department handles {{dept.subspecialties | join(', ')}} within facility types: {{dept.facility_types | join(', ')}}.

## 2. Top 10 Conditions
{% for c in dept.conditions_top10 %}
| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| {{loop.index}} | {{c}} | TBD | ESC/AHA/NICE guidelines |
{% endfor %}

## 3. Top 20 Procedures
{% for p in dept.procedures_top20 %}
| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| {{loop.index}} | {{p}} | TBD | Moderate |
{% endfor %}

## 4. Critical Red Flags
{% for r in dept.red_flags %}
- **{{r}}**: immediate action per protocol
{% endfor %}

## 5. Risk Scores
{% for s in dept.scores %}- {{s}}
{% endfor %}

## 6. Drug Interactions (Top 10)
{% for d in dept.drugs_top %}- {{d}}: monitor renal/hepatic dose
{% endfor %}

## 7. Saudi-Specific Epidemiology
- NCDs prevalence: Saudi MoH 2024 data
- Genetic disorders: consanguinity rates 50-60%
- Endemic infections: MERS-CoV, TB, Malaria (regional)

## 8. Quality Measures
- 30-day mortality
- Readmission rate
- Door-to-needle time
- Medication adherence
- Patient satisfaction

## 9. References
- UpToDate 2024
- Cochrane Database
- NICE Guidelines
- Saudi MoH Clinical Protocols
- CBAHI Standards
""",

    "03_ai_orchestration.md": """# AI Orchestration — {{dept.name_en}} ({{dept.code}})

> **AIE:** Eng. Marcus Patel · Generated {{generated_at}}

## 1. LangGraph State Machine
```
[triage] → [assessment] → [diagnosis] → [plan] → [intervention] → [followup]
   ↓           ↓              ↓          ↓            ↓              ↓
red_flags   vitals         RAG        RAG        CDS rules      education
```

## 2. Nodes
1. **triage**: ESI scoring + red flag detection
2. **assessment**: history + exam + scoring
3. **diagnosis**: RAG + ICD-10 + differential
4. **plan**: order set + medication + procedure
5. **intervention**: CDS check + execution
6. **followup**: education + appointment

## 3. Tools
- {{dept.code_short}}_guidelines_search
- {{dept.code_short}}_drug_search
- icd10_search
- snomed_search
- vital_calculator
- drug_interaction_check

## 4. Embedding Strategy
- Model: text-embedding-3-large (3072 dim)
- Chunk size: 512 (guidelines), 256 (drugs)
- Store: pgvector + ChromaDB

## 5. Agent Prompt (system)
```
You are a {{dept.name_en}} specialist at CBAHI/JCI hospital.
Use ONLY the context provided. Cite ICD-10 / SNOMED.
If insufficient info, say 'insufficient context'.
Always consider Saudi-specific epidemiology.
```

## 6. Token Budget
- Ingestion (one-time): ~$15
- Query (per turn): ≤4000 tokens
- p95 latency: <800ms
""",

    "04_technical_architecture.md": """# Technical Architecture — {{dept.name_en}} ({{dept.code}})

> **PSA:** Mr. David Kim · Generated {{generated_at}}

## 1. API Surface
- `GET /api/{{dept.code_short}}/list` — list items
- `GET /api/{{dept.code_short}}/:id` — get item
- `POST /api/{{dept.code_short}}` — create
- `PUT /api/{{dept.code_short}}/:id` — update
- `DELETE /api/{{dept.code_short}}/:id` — soft delete
- `GET /api/{{dept.code_short}}/search?q=` — search
- `POST /api/{{dept.code_short}}/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole({{dept.code_short}}_*) →
validateBody(RS.{{dept.code_short}}_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
{% for r in dept.rbac_roles %}- **{{r}}**: scoped to {{dept.code_short}}
{% endfor %}

## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept
""",

    "05_ux_ui_stitch.md": """# UX/UI Stitch Design — {{dept.name_en}} ({{dept.code}})

> **UXL:** Ms. Layla Hassan · Generated {{generated_at}}

## 1. Wireframe (Main Page)
```
┌──────────────────────────────────────────────────────────────┐
│ [Header: {{dept.name_ar}} | {{dept.name_en}}] [Lang AR/EN]   │
├──────────────────────────────────────────────────────────────┤
│ SIDEBAR (240px)               │ MAIN AREA                     │
│ ┌─────────────────────────┐  │ ┌───────────────────────────┐  │
│ │ Patient ID Card        │  │ │ Tabs: Overview|Orders|Results|Notes│
│ │ MRN 100045 · 45y · M   │  │ ├───────────────────────────┤  │
│ │ Allergies: ⚠ Penicillin │  │ │ Vitals Panel              │  │
│ └─────────────────────────┘  │ │  HR:72 BP:120/80 SpO2:98 │  │
│ ┌─────────────────────────┐  │ │                           │  │
│ │ Risk Stratifier        │  │ │ Risk: NEWS2=2 LOW        │  │
│ │ Score: 2 (LOW)         │  │ │                           │  │
│ └─────────────────────────┘  │ │ Active Orders: 3          │  │
│                              │ └───────────────────────────┘  │
│ Nav:                         │                                  │
│ - Overview                   │                                  │
│ - Orders (3)                 │                                  │
│ - Results                    │                                  │
│ - Notes                      │                                  │
│ - AI Assistant 🤖            │                                  │
└──────────────────────────────────────────────────────────────�
```

## 2. Components (from Stitch)
- VitalPanel
- AllergyBanner
- RiskStratifier
- OrderCard
- PatientIDCard
- CDSAlertBar
- NotesEditor

## 3. Pages
1. `/station/{{dept.code_short}}` — main (2-col)
2. `/station/{{dept.code_short}}/orders` — full-width list
3. `/station/{{dept.code_short}}/results` — 2-col with chart
4. `/station/{{dept.code_short}}/notes` — editor + sign

## 4. RTL/LTR
- Logical CSS: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`
- Direction: `dir="{{dir}}"` on root

## 5. A11y (WCAG 2.1 AA)
- Contrast ≥4.5:1
- Tap target ≥44×44px
- Keyboard nav: Tab/Shift+Tab/Enter/Space
- Screen reader: aria-label, role, aria-live
""",

    "06_compliance_security.md": """# Compliance & Security — {{dept.name_en}} ({{dept.code}})

> **CO:** Mr. Turki Al-Otaibi · Generated {{generated_at}}

## 1. JCI Controls
{% for j in dept.jci_controls %}- {{j}}
{% endfor %}

## 2. CBAHI Standards
{% for c in dept.cbahi_controls %}- {{c}}
{% endfor %}

## 3. NPHIES Bundles
- claim submission (if revenue)
- pre-auth workflow
- eligibility check

## 4. PDPL DPIA
| PII Category | Protection |
|---|---|
{% for p in dept.pdpl_pii_categories %}- {{p}}: encrypted at rest, redacted in logs
{% endfor %}

## 5. SFDA Drug Class
- {{dept.drugs_top | join(', ')}}
- All checked via DrugCheckService

## 6. ZATCA Phase 2
- N/A (unless revenue-generating)
- VAT-inclusive pricing required

## 7. STRIDE Threat Model
| Threat | Mitigation |
|---|---|
| Spoofing | JWT + MFA |
| Tampering | Hash-chained audit log |
| Repudiation | Digital signatures |
| Information Disclosure | Encryption at rest + TLS |
| Denial of Service | Rate limiting |
| Elevation of Privilege | RBAC + least privilege |

## 8. HIPAA Alignment
- PHI encrypted
- Access logs
- Minimum necessary
- Breach notification
""",

    "07_implementation_plan.md": """# Implementation Plan — {{dept.name_en}} ({{dept.code}})

> **DOL:** Ms. Rania Farouk · Generated {{generated_at}}

## 1. Phases
| Phase | Duration | Tasks |
|---|---|---|
| 1. Design | 1 day | Schema + API + UI wireframes |
| 2. Backend | 2 days | Engine + Routes + Tests |
| 3. Frontend | 2 days | Station + Components + i18n |
| 4. RAG | 1 day | Ingest guidelines + Chains |
| 5. Integration | 1 day | Server wiring + E2E |
| 6. Deploy | 0.5 day | Sandbox → Staging → Prod |

## 2. CI/CD Pipeline
```yaml
name: {{dept.code_short}}-ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- {{dept.code_short}}_test.js
      - run: npm run lint
  deploy-staging:
    if: github.ref == 'refs/heads/integration/all-epics'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy_staging.sh {{dept.code_short}}
```

## 3. Rollback Plan
1. Tag current production: `git tag prod-{{dept.code_short}}-<timestamp>`
2. Deploy new: `pm2 reload nama-medical-erp`
3. If fail: `pm2 reload nama-medical-erp --update-env && git revert`

## 4. Monitoring
- Prometheus: dept request rate, latency, error rate
- Grafana: dept dashboard
- PagerDuty: >5% error rate alerts
""",

    "08_prompt_engineering.md": """# Prompt Engineering — {{dept.name_en}} ({{dept.code}})

## System Prompt
```
You are a {{dept.name_en}} specialist at a CBAHI/JCI-accredited hospital in Saudi Arabia.

# Role
Provide accurate, evidence-based clinical recommendations in {{dept.name_ar}}.

# Constraints
- Use ONLY the context provided
- Cite ICD-10 / SNOMED / RxNorm codes
- If insufficient info: say "insufficient context, need more data"
- Always consider Saudi epidemiology
- Never invent patient data (no PHI)

# Output Format
- Differential: ranked list with ICD-10
- Plan: order set + medications + follow-up
- Citations: source documents
- Risk: score with interpretation

# Tone
Professional, concise, bilingual (AR primary, EN secondary).
```

## Few-shot Examples
[3 canonical scenarios with input/output]

## Output Schema
```json
{
  "differential": [{"icd10": "I21.0", "name": "STEMI", "probability": 0.85}],
  "plan": [{"type": "lab", "code": "troponin"}, {"type": "imaging", "code": "ECG"}],
  "risk": {"score": "CHA2DS2-VASc", "value": 3, "interpretation": "moderate"},
  "citations": [{"source": "ESC 2024", "url": "..."}]
}
```
""",

    "09_workflow_orchestration.md": """# Workflow Orchestration — {{dept.name_en}} ({{dept.code}})

## BPMN State Machine
```yaml
workflow:
  id: {{dept.code_short}}_patient_flow
  states: [triage, assessment, plan, intervention, discharge, followup]
  transitions:
    - { from: triage, to: assessment, on: vitals_recorded }
    - { from: assessment, to: plan, on: dx_made }
    - { from: plan, to: intervention, on: order_signed }
    - { from: intervention, to: discharge, on: stable }
  sla_minutes: { triage: 15, assessment: 60, intervention: 240 }
```

## States Detail
1. **triage**: ESI 1-5 + red flags
2. **assessment**: history + exam + scoring
3. **plan**: differential + order set
4. **intervention**: procedure + medication
5. **discharge**: summary + education
6. **followup**: clinic + reminders

## Roles per State
| State | Roles |
|---|---|
| triage | nurse |
| assessment | {{dept.code_short}}_specialist |
| plan | {{dept.code_short}}_specialist |
| intervention | {{dept.code_short}}_specialist + nurse |
| discharge | {{dept.code_short}}_specialist |
| followup | scheduler + {{dept.code_short}}_specialist |
""",

    "10_langchain_chains.md": """# LangChain Chains — {{dept.name_en}} ({{dept.code}})

## Chains

### 1. Diagnosis Chain
```python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

PROMPT = PromptTemplate(
  input_variables=["context", "question"],
  template=\"\"\"أنت خبير في {{dept.name_ar}}. أجب بالعربية. اعتمد فقط على السياق.
السياق: {context}
السؤال: {question}
الإجابة:\"\"\"
)

chain = RetrievalQA.from_chain_type(
  llm=ChatOpenAI(model="gpt-4o-mini"),
  retriever=vectordb.as_retriever(k=5),
  chain_type_kwargs={"prompt": PROMPT}
)
```

### 2. Drug Interaction Chain
- Input: medication list
- Output: severity + recommendation

### 3. Triage Chain
- Input: chief complaint + vitals
- Output: ESI level + next step

### 4. Referral Chain
- Input: condition + facility type
- Output: appropriate dept + urgency

## Agents
- DiagnosisAgent: tools=[guidelines_search, drug_search, icd_search]
- TriageAgent: tools=[vitals_calc, red_flag_detect]

## Tools
- {{dept.code_short}}_guidelines_search
- {{dept.code_short}}_drug_search
- icd10_search
- snomed_search
""",

    "11_vector_mine.md": """# VectorMine Configuration — {{dept.name_en}} ({{dept.code}})

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| {{dept.code_short}}_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| {{dept.code_short}}_protocols | 2k | text-embedding-3-large | Internal protocols |
| {{dept.code_short}}_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| {{dept.code_short}}_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| {{dept.code_short}}_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| {{dept.code_short}}_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE {{dept.code_short}}_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE {{dept.code_short}}_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)
""",

    "12_api_openapi.yaml": """openapi: 3.0.3
info:
  title: {{dept.name_en}} API
  version: 1.0.0
  description: {{dept.name_ar}} clinical endpoints
servers:
  - url: https://jumanasoft.com/api
paths:
  /api/{{dept.code_short}}/list:
    get:
      summary: List items
      security: [{ bearerAuth: [] }]
      parameters:
        - $ref: '#/components/parameters/TenantHeader'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListResponse'
  /api/{{dept.code_short}}/{id}:
    get:
      summary: Get item
      security: [{ bearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200': { description: OK }
  /api/{{dept.code_short}}:
    post:
      summary: Create
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRequest'
      responses:
        '201': { description: Created }
  /api/{{dept.code_short}}/{id}:
    put:
      summary: Update
      security: [{ bearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
      responses:
        '200': { description: Updated }
  /api/{{dept.code_short}}/{id}:
    delete:
      summary: Soft delete
      security: [{ bearerAuth: [] }]
      responses:
        '204': { description: Deleted }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  parameters:
    TenantHeader:
      name: x-tenant-id
      in: header
      required: true
      schema: { type: integer }
  schemas:
    ListResponse:
      type: object
      properties:
        items: { type: array, items: { type: object } }
        total: { type: integer }
    CreateRequest:
      type: object
      required: [patient_id, code, value]
      properties:
        patient_id: { type: integer }
        code: { type: string }
        value: { type: string }
""",

    "13_data_erd.sql": """-- ERD for {{dept.name_en}} ({{dept.code}})
-- Generated: {{generated_at}}
-- Use: PostgreSQL 14+

BEGIN;

CREATE TABLE IF NOT EXISTS {{dept.code_short}}_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_type TEXT NOT NULL DEFAULT 'outpatient',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  chief_complaint TEXT,
  diagnosis_codes TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
ALTER TABLE {{dept.code_short}}_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_encounters_tenant ON {{dept.code_short}}_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON {{dept.code_short}}_encounters(tenant_id, patient_id);
CREATE INDEX ON {{dept.code_short}}_encounters(tenant_id, status);

CREATE TABLE IF NOT EXISTS {{dept.code_short}}_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES {{dept.code_short}}_encounters(id),
  order_type TEXT NOT NULL,
  order_code TEXT NOT NULL,
  order_detail JSONB NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'routine',
  status TEXT NOT NULL DEFAULT 'pending',
  ordered_by BIGINT NOT NULL REFERENCES users(id),
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE {{dept.code_short}}_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_orders_tenant ON {{dept.code_short}}_orders
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON {{dept.code_short}}_orders(tenant_id, patient_id);
CREATE INDEX ON {{dept.code_short}}_orders(tenant_id, status);

CREATE TABLE IF NOT EXISTS {{dept.code_short}}_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES {{dept.code_short}}_encounters(id),
  order_id BIGINT REFERENCES {{dept.code_short}}_orders(id),
  result_type TEXT NOT NULL,
  result_value TEXT,
  result_unit TEXT,
  reference_range TEXT,
  abnormal_flag TEXT,
  result_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE {{dept.code_short}}_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_results FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_results_tenant ON {{dept.code_short}}_results
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON {{dept.code_short}}_results(tenant_id, patient_id);

CREATE TABLE IF NOT EXISTS {{dept.code_short}}_notes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  encounter_id BIGINT REFERENCES {{dept.code_short}}_encounters(id),
  note_type TEXT NOT NULL DEFAULT 'progress',
  note_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE {{dept.code_short}}_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_notes_tenant ON {{dept.code_short}}_notes
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
CREATE INDEX ON {{dept.code_short}}_notes(tenant_id, patient_id);

COMMIT;
""",

    "14_data_migrations_up.sql": """-- Migration UP for {{dept.name_en}} ({{dept.code}})
-- Generated: {{generated_at}}
-- Series: {{dept.code_short}}_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS {{dept.code_short}}_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE {{dept.code_short}}_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_enc_iso ON {{dept.code_short}}_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS {{dept.code_short}}_audit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  actor_id BIGINT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id BIGINT,
  prev_hash TEXT,
  curr_hash TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE {{dept.code_short}}_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{dept.code_short}}_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY {{dept.code_short}}_audit_iso ON {{dept.code_short}}_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;
""",

    "15_data_migrations_down.sql": """-- Migration DOWN for {{dept.name_en}} ({{dept.code}})
-- Generated: {{generated_at}}
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS {{dept.code_short}}_audit_iso ON {{dept.code_short}}_audit;
ALTER TABLE IF EXISTS {{dept.code_short}}_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS {{dept.code_short}}_audit;

DROP POLICY IF EXISTS {{dept.code_short}}_enc_iso ON {{dept.code_short}}_encounters;
ALTER TABLE IF EXISTS {{dept.code_short}}_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS {{dept.code_short}}_encounters;

COMMIT;
""",

    "16_data_seed.sql": """-- Seed data for {{dept.name_en}} ({{dept.code}})
-- Generated: {{generated_at}}
BEGIN;

-- Top 10 conditions with ICD-10 (placeholder; full ICD-10 must be sourced from official list)
{% for c in dept.conditions_top10 %}
INSERT INTO icd10_codes (code, name_ar, name_en) VALUES
  ('TBD_{{loop.index}}', '{{c}}', '{{c}}')
ON CONFLICT (code) DO NOTHING;
{% endfor %}

-- Top drugs (sample; full list must be sourced from SFDA)
{% for d in dept.drugs_top %}
INSERT INTO drugs (code, name_ar, name_en, atc_class) VALUES
  ('TBD_{{loop.index}}_{{d[:8]}}', '{{d}}', '{{d}}', 'TBD')
ON CONFLICT (code) DO NOTHING;
{% endfor %}

COMMIT;
""",

    "17_rag_pipeline.py": """# filepath: 02_MODULES/{{dept.code}}/17_rag_pipeline.py
# RAG pipeline for {{dept.name_en}} ({{dept.code}})
# Generated: {{generated_at}}

import os
from typing import List, Optional
from langchain_community.vectorstores import PGVector, Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools.retriever import create_retriever_tool
from langchain import hub

# ============ Configuration ============
COLLECTION_NAME = "{{dept.code_short}}"
PGVECTOR_URL = os.environ.get("PGVECTOR_URL", "postgresql://user:pass@localhost:5432/nama")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
EMBEDDING_MODEL = "text-embedding-3-large"
LLM_MODEL = "gpt-4o-mini"

# ============ System Prompt ============
SYSTEM_PROMPT = \"\"\"أنت خبير في {{dept.name_ar}} في مستشفى معتمد من CBAHI/JCI.

المهام:
- تقديم توصيات سريرية دقيقة مبنية على الأدلة
- استخدام أكواد ICD-10 / SNOMED-CT / RxNorm
- مراعاة خصوصيات الوبائيات السعودية
- عدم اختراع بيانات المرضى (لا PHI)
- إذا لم تتوفر معلومات كافية، قل 'لا تتوفر معلومات كافية'

اعتمد فقط على السياق المرفق. أذكر المصدر.\"\"\"

PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=SYSTEM_PROMPT + \"\"\"

السياق:
{context}

المحادثة السابقة:
{chat_history}

السؤال:
{question}

الإجابة:\"\"\"
)


# ============ Vector Store ============
def get_embeddings():
    return OpenAIEmbeddings(model=EMBEDDING_MODEL, dimensions=3072)


def get_vectordb(persist_dir: Optional[str] = None):
    embeddings = get_embeddings()
    if persist_dir:
        return Chroma(persist_directory=persist_dir, embedding_function=embeddings,
                      collection_name=COLLECTION_NAME)
    return PGVector(connection_string=PGVECTOR_URL, embedding_function=embeddings,
                    collection_name=COLLECTION_NAME)


# ============ QA Chain ============
def build_qa_chain(tenant_id: int, persist_dir: Optional[str] = None, model: str = LLM_MODEL):
    vectordb = get_vectordb(persist_dir)
    llm = ChatOpenAI(model=model, temperature=0)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 8, "fetch_k": 20, "lambda_mult": 0.5}
    )
    return ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=retriever, memory=memory,
        combine_docs_chain_kwargs={"prompt": PROMPT_TEMPLATE},
        return_source_documents=True,
        verbose=False
    )


# ============ Agents ============
def build_diagnosis_agent(tenant_id: int, persist_dir: Optional[str] = None):
    vectordb = get_vectordb(persist_dir)
    retriever = vectordb.as_retriever(search_kwargs={"k": 6})
    retriever_tool = create_retriever_tool(
        retriever,
        name=f"{{dept.code_short}}_guidelines_search",
        description=f"Search {{dept.name_en}} clinical guidelines."
    )
    tools = [retriever_tool]
    prompt = hub.pull("hwchase17/openai-functions-agent")
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=False, max_iterations=4)


# ============ Ingestion ============
def ingest_chunks(chunks: List[dict], collection: str, batch_size: int = 100):
    \"\"\"chunks = [{'text': ..., 'meta': {...}}, ...]\"\"\"
    vectordb = get_vectordb()
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        texts = [c['text'] for c in batch]
        metas = [c['meta'] for c in batch]
        vectordb.add_texts(texts=texts, metadatas=metas)
    print(f"✅ Ingested {len(chunks)} chunks into {collection}")


# ============ Usage Example ============
if __name__ == "__main__":
    chain = build_qa_chain(tenant_id=1)
    result = chain({"question": "ما هو علاج الذبحة الصدرية المستقرة؟"})
    print(result["answer"])
    print("\\nSources:")
    for doc in result["source_documents"]:
        print(f"  - {doc.metadata.get('source', 'unknown')}")
""",

    "18_backend_models.py": """# filepath: 02_MODULES/{{dept.code}}/18_backend_models.py
# SQLAlchemy models for {{dept.name_en}} ({{dept.code}})

from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP, ForeignKey, JSON, Boolean
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class {{dept.code_short_pascal}}Encounter(Base):
    __tablename__ = "{{dept.code_short}}_encounters"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_type = Column(String(50), default="outpatient")
    started_at = Column(TIMESTAMP, nullable=False)
    ended_at = Column(TIMESTAMP)
    status = Column(String(20), default="active")
    chief_complaint = Column(Text)
    diagnosis_codes = Column(ARRAY(String))
    notes = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
    deleted_at = Column(TIMESTAMP)


class {{dept.code_short_pascal}}Order(Base):
    __tablename__ = "{{dept.code_short}}_orders"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("{{dept.code_short}}_encounters.id"))
    order_type = Column(String(50), nullable=False)
    order_code = Column(String(100), nullable=False)
    order_detail = Column(JSONB, default={})
    priority = Column(String(20), default="routine")
    status = Column(String(20), default="pending")
    ordered_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    ordered_at = Column(TIMESTAMP, nullable=False)
    completed_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)


class {{dept.code_short_pascal}}Result(Base):
    __tablename__ = "{{dept.code_short}}_results"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("{{dept.code_short}}_encounters.id"))
    order_id = Column(BigInteger, ForeignKey("{{dept.code_short}}_orders.id"))
    result_type = Column(String(50), nullable=False)
    result_value = Column(Text)
    result_unit = Column(String(50))
    reference_range = Column(String(100))
    abnormal_flag = Column(String(10))
    result_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)


class {{dept.code_short_pascal}}Note(Base):
    __tablename__ = "{{dept.code_short}}_notes"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("{{dept.code_short}}_encounters.id"))
    note_type = Column(String(50), default="progress")
    note_text = Column(Text, nullable=False)
    signed_at = Column(TIMESTAMP)
    signed_by = Column(BigInteger, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
""",

    "19_backend_schemas.py": """# filepath: 02_MODULES/{{dept.code}}/19_backend_schemas.py
# Pydantic schemas for {{dept.name_en}} ({{dept.code}})

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class {{dept.code_short_pascal}}EncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class {{dept.code_short_pascal}}EncounterCreate({{dept.code_short_pascal}}EncounterBase):
    diagnosis_codes: List[str] = []


class {{dept.code_short_pascal}}EncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class {{dept.code_short_pascal}}Encounter({{dept.code_short_pascal}}EncounterBase):
    id: int
    tenant_id: int
    status: str
    diagnosis_codes: List[str]
    started_at: datetime
    ended_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class {{dept.code_short_pascal}}OrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class {{dept.code_short_pascal}}OrderCreate({{dept.code_short_pascal}}OrderBase):
    pass


class {{dept.code_short_pascal}}Order({{dept.code_short_pascal}}OrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class {{dept.code_short_pascal}}ResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class {{dept.code_short_pascal}}ResultCreate({{dept.code_short_pascal}}ResultBase):
    pass


class {{dept.code_short_pascal}}Result({{dept.code_short_pascal}}ResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class {{dept.code_short_pascal}}NoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class {{dept.code_short_pascal}}NoteCreate({{dept.code_short_pascal}}NoteBase):
    pass


class {{dept.code_short_pascal}}Note({{dept.code_short_pascal}}NoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
""",

    "20_backend_service.py": """# filepath: 02_MODULES/{{dept.code}}/20_backend_service.py
# Business logic for {{dept.name_en}} ({{dept.code}})

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
import logging

logger = logging.getLogger(__name__)


class {{dept.code_short_pascal}}Service:
    \"\"\"Service layer for {{dept.name_en}}.

    All methods require tenant_id for RLS.
    \"\"\"

    def __init__(self, db: Session, tenant_id: int):
        self.db = db
        if not tenant_id:
            raise ValueError("tenant_id required (fail-closed)")
        self.tenant_id = tenant_id
        self.db.execute("SET LOCAL app.tenant_id = :tid", {"tid": tenant_id})

    # ============ Encounters ============
    def list_encounters(self, patient_id: Optional[int] = None, status: Optional[str] = None,
                        limit: int = 50, offset: int = 0) -> List[dict]:
        from .models import {{dept.code_short_pascal}}Encounter
        q = self.db.query({{dept.code_short_pascal}}Encounter).filter(
            {{dept.code_short_pascal}}Encounter.tenant_id == self.tenant_id,
            {{dept.code_short_pascal}}Encounter.deleted_at.is_(None)
        )
        if patient_id:
            q = q.filter({{dept.code_short_pascal}}Encounter.patient_id == patient_id)
        if status:
            q = q.filter({{dept.code_short_pascal}}Encounter.status == status)
        return [e.to_dict() for e in q.limit(limit).offset(offset).all()]

    def get_encounter(self, encounter_id: int) -> Optional[dict]:
        from .models import {{dept.code_short_pascal}}Encounter
        e = self.db.query({{dept.code_short_pascal}}Encounter).filter(
            {{dept.code_short_pascal}}Encounter.id == encounter_id,
            {{dept.code_short_pascal}}Encounter.tenant_id == self.tenant_id
        ).first()
        return e.to_dict() if e else None

    def create_encounter(self, payload: dict, actor_id: int) -> dict:
        from .models import {{dept.code_short_pascal}}Encounter
        e = {{dept.code_short_pascal}}Encounter(
            tenant_id=self.tenant_id,
            patient_id=payload["patient_id"],
            encounter_type=payload.get("encounter_type", "outpatient"),
            chief_complaint=payload.get("chief_complaint"),
            diagnosis_codes=payload.get("diagnosis_codes", []),
            status="active",
            started_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(e)
        self.db.commit()
        self.db.refresh(e)
        logger.info(f"Encounter created: id={e.id} tenant={self.tenant_id}")
        return e.to_dict()

    # ============ Orders ============
    def create_order(self, payload: dict, actor_id: int) -> dict:
        from .models import {{dept.code_short_pascal}}Order
        o = {{dept.code_short_pascal}}Order(
            tenant_id=self.tenant_id,
            patient_id=payload["patient_id"],
            encounter_id=payload.get("encounter_id"),
            order_type=payload["order_type"],
            order_code=payload["order_code"],
            order_detail=payload.get("order_detail", {}),
            priority=payload.get("priority", "routine"),
            status="pending",
            ordered_by=actor_id,
            ordered_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(o)
        self.db.commit()
        self.db.refresh(o)
        return o.to_dict()

    # ============ Clinical Decision Support ============
    def check_drug_interactions(self, medications: List[str]) -> List[dict]:
        \"\"\"Returns list of {severity, drugs, mechanism, recommendation}.\"\"\"
        from tools.drug_check import DrugCheckService
        checker = DrugCheckService(self.tenant_id)
        return checker.check_interactions(medications)

    def calc_risk_score(self, score_type: str, patient_data: dict) -> dict:
        \"\"\"Returns {score, interpretation, recommendation}.\"\"\"
        from engines.scoring import calc_score
        return calc_score(score_type, patient_data)
""",

    "21_backend_router.py": """# filepath: 02_MODULES/{{dept.code}}/21_backend_router.py
# FastAPI router for {{dept.name_en}} ({{dept.code}})

from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Optional, List

from auth.jwt_handler import verify_jwt
from auth.rbac_middleware import require_role
from tenancy.tenant_scope import require_tenant_scope
from db import get_db
from .schemas import *
from .service import {{dept.code_short_pascal}}Service

router = APIRouter(prefix="/api/{{dept.code_short}}", tags=["{{dept.name_en}}"])


@router.get("/list", response_model=List[{{dept.code_short_pascal}}Encounter])
async def list_encounters(
    patient_id: Optional[int] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    request: Request = None,
    db=Depends(get_db)
):
    \"\"\"List {{dept.name_en}} encounters for current tenant.\"\"\"
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = {{dept.code_short_pascal}}Service(db, tenant_id)
    return svc.list_encounters(patient_id, status, limit, offset)


@router.get("/{encounter_id}", response_model={{dept.code_short_pascal}}Encounter)
async def get_encounter(encounter_id: int, request: Request, db=Depends(get_db)):
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = {{dept.code_short_pascal}}Service(db, tenant_id)
    enc = svc.get_encounter(encounter_id)
    if not enc:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return enc


@router.post("/", response_model={{dept.code_short_pascal}}Encounter, status_code=201)
async def create_encounter(
    payload: {{dept.code_short_pascal}}EncounterCreate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["{{dept.code_short}}_specialist", "{{dept.code_short}}_nurse", "admin"])
    tenant_id = request.state.tenant_id
    svc = {{dept.code_short_pascal}}Service(db, tenant_id)
    return svc.create_encounter(payload.model_dump(), actor_id=user["id"])


@router.put("/{encounter_id}", response_model={{dept.code_short_pascal}}Encounter)
async def update_encounter(
    encounter_id: int,
    payload: {{dept.code_short_pascal}}EncounterUpdate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["{{dept.code_short}}_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = {{dept.code_short_pascal}}Service(db, tenant_id)
    return svc.update_encounter(encounter_id, payload.model_dump())


@router.delete("/{encounter_id}", status_code=204)
async def delete_encounter(
    encounter_id: int,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["{{dept.code_short}}_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = {{dept.code_short_pascal}}Service(db, tenant_id)
    svc.soft_delete_encounter(encounter_id)
    return None


@router.post("/ai/diagnose")
async def ai_diagnose(
    payload: dict,
    request: Request,
    user=Depends(verify_jwt)
):
    \"\"\"AI-powered differential diagnosis.\"\"\"
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    from .rag_pipeline import build_diagnosis_agent
    agent = build_diagnosis_agent(tenant_id)
    result = agent.invoke({"input": payload.get("question", "")})
    return {"answer": result["output"], "sources": [...]}
""",

    "22_frontend_page.tsx": """// filepath: 02_MODULES/{{dept.code}}/22_frontend_page.tsx
// Main page for {{dept.name_en}} ({{dept.code}})

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DeptPage, VitalPanel, AllergyBanner, RiskStratifier, OrderCard, PatientIDCard, CDSAlertBar } from '@nama/stitch-medical';
import { {{dept.code_short_pascal}}API } from './24_frontend_api_client';

interface {{dept.code_short_pascal}}PageProps {
  tenantId: number;
  patientId: number;
  lang?: 'ar' | 'en';
}

export default function {{dept.code_short_pascal}}Page({ tenantId, patientId, lang = 'ar' }: {{dept.code_short_pascal}}PageProps) {
  const { t } = useTranslation('{{dept.code_short}}');
  const [encounter, setEncounter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState<'overview'|'orders'|'results'|'notes'>('overview');

  useEffect(() => {
    {{dept.code_short_pascal}}API.listEncounters({ patientId, tenantId }).then(setEncounter);
    {{dept.code_short_pascal}}API.listOrders({ patientId, tenantId }).then(setOrders);
    {{dept.code_short_pascal}}API.listResults({ patientId, tenantId }).then(setResults);
  }, [patientId, tenantId]);

  return (
    <DeptPage
      title_ar="{{dept.name_ar}}"
      title_en="{{dept.name_en}}"
      tenantId={tenantId}
      lang={lang}
      sidebar={
        <>
          <PatientIDCard patientId={patientId} />
          <AllergyBanner patientId={patientId} />
          <RiskStratifier scoreType="{{dept.scores[0] if dept.scores else 'NEWS2'}}" patientId={patientId} />
        </>
      }
      main={
        <>
          {tab === 'overview' && (
            <>
              <VitalPanel patientId={patientId} metrics={['HR','BP','SpO2','RR','Temp']} />
              <CDSAlertBar tenantId={tenantId} patientId={patientId} />
            </>
          )}
          {tab === 'orders' && (
            <div className="orders-list">
              {orders.map(o => <OrderCard key={o.id} order={o} />)}
            </div>
          )}
          {tab === 'results' && (
            <div className="results-list">
              {results.map(r => <ResultCard key={r.id} result={r} />)}
            </div>
          )}
          {tab === 'notes' && (
            <NotesEditor patientId={patientId} encounterId={encounter?.id} />
          )}
        </>
      }
      tabs={[
        { id: 'overview', label_ar: 'نظرة عامة', label_en: 'Overview' },
        { id: 'orders', label_ar: `الطلبات (${orders.length})`, label_en: `Orders (${orders.length})` },
        { id: 'results', label_ar: 'النتائج', label_en: 'Results' },
        { id: 'notes', label_ar: 'الملاحظات', label_en: 'Notes' }
      ]}
      activeTab={tab}
      onTabChange={setTab}
    />
  );
}
""",

    "23_frontend_components.tsx": """// filepath: 02_MODULES/{{dept.code}}/23_frontend_components.tsx
// Stitch components for {{dept.name_en}} ({{dept.code}})

import React from 'react';
import { useTranslation } from 'next-i18next';

const API = (typeof window !== 'undefined') ? window.{{dept.code_short_pascal}}API : null;

// ============ ResultCard ============
export function ResultCard({ result }: { result: any }) {
  const { t, i18n } = useTranslation('{{dept.code_short}}');
  const isAbnormal = result.abnormal_flag && result.abnormal_flag !== 'N';
  return (
    <div className={`result-card ${isAbnormal ? 'result-card--abnormal' : ''}`}>
      <header className="result-card__header">
        <span className="result-card__type">{result.result_type}</span>
        {isAbnormal && <span className="badge badge--danger">{result.abnormal_flag}</span>}
      </header>
      <div className="result-card__body">
        <div className="result-card__value">{result.result_value}</div>
        <div className="result-card__unit">{result.result_unit}</div>
      </div>
      <footer className="result-card__footer">
        <span className="result-card__ref">Ref: {result.reference_range}</span>
        <time className="result-card__time">{new Date(result.result_at).toLocaleString(i18n.language)}</time>
      </footer>
    </div>
  );
}

// ============ NotesEditor ============
export function NotesEditor({ patientId, encounterId }: { patientId: number; encounterId?: number }) {
  const [text, setText] = React.useState('');
  const [signed, setSigned] = React.useState(false);

  const saveDraft = async () => {
    if (API) await API.saveNote({ patientId, encounterId, note_text: text });
  };

  const sign = async () => {
    if (API) await API.signNote({ patientId, encounterId });
    setSigned(true);
  };

  return (
    <div className="notes-editor">
      <textarea
        className="notes-editor__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="S/O: ... A/P: ..."
        rows={12}
      />
      <div className="notes-editor__actions">
        <button className="btn btn--ghost" onClick={saveDraft}>حفظ مسودة</button>
        <button className="btn btn--primary" onClick={sign} disabled={signed}>
          {signed ? '✓ موقّعة' : 'توقيع'}
        </button>
      </div>
    </div>
  );
}
""",

    "24_frontend_api_client.ts": """// filepath: 02_MODULES/{{dept.code}}/24_frontend_api_client.ts
// API client for {{dept.name_en}} ({{dept.code}})

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://jumanasoft.com/api';

interface APIOptions {
  tenantId: number;
  token?: string;
  lang?: 'ar' | 'en';
}

async function request(path: string, options: RequestInit & APIOptions): Promise<any> {
  const { tenantId, token, lang = 'ar', ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-tenant-id': String(tenantId),
    'Accept-Language': lang,
    ...(init.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const {{dept.code_short_pascal}}API = {
  listEncounters(opts: { patientId?: number; status?: string } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    if (opts.status) params.set('status', opts.status);
    return request(`/{{dept.code_short}}/list?${params}`, { method: 'GET', ...opts });
  },
  getEncounter(id: number, opts: APIOptions) {
    return request(`/{{dept.code_short}}/${id}`, { method: 'GET', ...opts });
  },
  createEncounter(payload: any, opts: APIOptions) {
    return request(`/{{dept.code_short}}/`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  updateEncounter(id: number, payload: any, opts: APIOptions) {
    return request(`/{{dept.code_short}}/${id}`, { method: 'PUT', body: JSON.stringify(payload), ...opts });
  },
  deleteEncounter(id: number, opts: APIOptions) {
    return request(`/{{dept.code_short}}/${id}`, { method: 'DELETE', ...opts });
  },
  listOrders(opts: { patientId?: number } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    return request(`/{{dept.code_short}}/orders?${params}`, { method: 'GET', ...opts });
  },
  listResults(opts: { patientId?: number } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    return request(`/{{dept.code_short}}/results?${params}`, { method: 'GET', ...opts });
  },
  saveNote(payload: any, opts: APIOptions) {
    return request(`/{{dept.code_short}}/notes`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  signNote(payload: any, opts: APIOptions) {
    return request(`/{{dept.code_short}}/notes/sign`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  aiDiagnose(payload: { question: string }, opts: APIOptions) {
    return request(`/{{dept.code_short}}/ai/diagnose`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
};
""",

    "25_style_guide_tokens.json": {
        "colors": {
            "primary": "#0F766E",
            "primary_hover": "#0D9488",
            "danger": "#DC2626",
            "warning": "#F59E0B",
            "success": "#10B981",
            "info": "#3B82F6",
            "bg": "#F9FAFB",
            "surface": "#FFFFFF",
            "text": "#111827",
            "text_muted": "#6B7280",
            "border": "#E5E7EB"
        },
        "typography": {
            "font_ar": "IBM Plex Sans Arabic, Tajawal",
            "font_en": "Inter, system-ui"
        },
        "spacing": { "1": "0.25rem", "2": "0.5rem", "4": "1rem", "6": "1.5rem", "8": "2rem" },
        "radius": { "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem" },
        "dept": "{{dept.code}}",
        "dept_name_ar": "{{dept.name_ar}}",
        "dept_name_en": "{{dept.name_en}}"
    },

    "26_i18n_ar.json": {
        "{{dept.code_short}}.title": "{{dept.name_ar}}",
        "{{dept.code_short}}.tabs.overview": "نظرة عامة",
        "{{dept.code_short}}.tabs.orders": "الطلبات",
        "{{dept.code_short}}.tabs.results": "النتائج",
        "{{dept.code_short}}.tabs.notes": "الملاحظات",
        "{{dept.code_short}}.vitals.hr": "معدل النبض",
        "{{dept.code_short}}.vitals.bp": "ضغط الدم",
        "{{dept.code_short}}.vitals.spo2": "تشبع الأكسجين",
        "{{dept.code_short}}.orders.new": "طلب جديد",
        "{{dept.code_short}}.notes.save_draft": "حفظ مسودة",
        "{{dept.code_short}}.notes.sign": "توقيع",
        "{{dept.code_short}}.ai.diagnose": "تشخيص بالذكاء الاصطناعي",
        "{{dept.code_short}}.ai.placeholder": "اطرح سؤالاً سريرياً...",
        "{{dept.code_short}}.errors.network": "خطأ في الاتصال بالشبكة",
        "{{dept.code_short}}.errors.unauthorized": "غير مصرح"
    },

    "27_i18n_en.json": {
        "{{dept.code_short}}.title": "{{dept.name_en}}",
        "{{dept.code_short}}.tabs.overview": "Overview",
        "{{dept.code_short}}.tabs.orders": "Orders",
        "{{dept.code_short}}.tabs.results": "Results",
        "{{dept.code_short}}.tabs.notes": "Notes",
        "{{dept.code_short}}.vitals.hr": "Heart Rate",
        "{{dept.code_short}}.vitals.bp": "Blood Pressure",
        "{{dept.code_short}}.vitals.spo2": "SpO2",
        "{{dept.code_short}}.orders.new": "New Order",
        "{{dept.code_short}}.notes.save_draft": "Save Draft",
        "{{dept.code_short}}.notes.sign": "Sign",
        "{{dept.code_short}}.ai.diagnose": "AI Diagnosis",
        "{{dept.code_short}}.ai.placeholder": "Ask a clinical question...",
        "{{dept.code_short}}.errors.network": "Network error",
        "{{dept.code_short}}.errors.unauthorized": "Unauthorized"
    },

    "28_test_unit.py": """# filepath: 02_MODULES/{{dept.code}}/28_test_unit.py
# Unit tests for {{dept.name_en}} ({{dept.code}})

import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime

from .service import {{dept.code_short_pascal}}Service


class Test{{dept.code_short_pascal}}Service:
    \"\"\"Unit tests for service layer.\"\"\"

    def test_init_requires_tenant(self):
        db = MagicMock()
        with pytest.raises(ValueError, match="tenant_id required"):
            {{dept.code_short_pascal}}Service(db, tenant_id=None)

    def test_init_sets_tenant(self):
        db = MagicMock()
        svc = {{dept.code_short_pascal}}Service(db, tenant_id=1)
        assert svc.tenant_id == 1
        db.execute.assert_called_once()

    def test_list_encounters_filters_by_tenant(self):
        db = MagicMock()
        svc = {{dept.code_short_pascal}}Service(db, tenant_id=42)
        svc.db.query.return_value.filter.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = []
        result = svc.list_encounters()
        assert result == []

    def test_create_encounter_sets_audit(self):
        db = MagicMock()
        svc = {{dept.code_short_pascal}}Service(db, tenant_id=1)
        payload = {"patient_id": 100, "chief_complaint": "Test"}
        result = svc.create_encounter(payload, actor_id=5)
        assert result is not None
        svc.db.add.assert_called_once()
        svc.db.commit.assert_called_once()

    def test_drug_interactions_returns_list(self):
        with patch("tools.drug_check.DrugCheckService") as mock_cls:
            mock_cls.return_value.check_interactions.return_value = [
                {"severity": "high", "drugs": ["warfarin", "amiodarone"], "mechanism": "CYP3A4"}
            ]
            db = MagicMock()
            svc = {{dept.code_short_pascal}}Service(db, tenant_id=1)
            result = svc.check_drug_interactions(["warfarin", "amiodarone"])
            assert len(result) == 1
            assert result[0]["severity"] == "high"
""",

    "29_test_integration.py": """# filepath: 02_MODULES/{{dept.code}}/29_test_integration.py
# Integration tests for {{dept.name_en}} ({{dept.code}})

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from main import app
from db import get_db, Base
from auth.jwt_handler import create_test_token


SQLALCHEMY_TEST_URL = "postgresql://test:test@localhost:5432/nama_test"

engine = create_engine(SQLALCHEMY_TEST_URL)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.fixture
def auth_headers():
    token = create_test_token(user_id=1, tenant_id=1, roles=["{{dept.code_short}}_specialist"])
    return {"Authorization": f"Bearer {token}", "x-tenant-id": "1"}


class Test{{dept.code_short_pascal}}API:
    def test_list_requires_tenant(self, client):
        res = client.get("/api/{{dept.code_short}}/list")
        assert res.status_code == 400  # Missing tenant header

    def test_list_with_tenant(self, client, auth_headers):
        res = client.get("/api/{{dept.code_short}}/list", headers=auth_headers)
        assert res.status_code == 200
        assert "items" in res.json() or isinstance(res.json(), list)

    def test_create_requires_role(self, client, db):
        token = create_test_token(user_id=1, tenant_id=1, roles=["nurse"])
        headers = {"Authorization": f"Bearer {token}", "x-tenant-id": "1"}
        res = client.post("/api/{{dept.code_short}}/", json={"patient_id": 1}, headers=headers)
        assert res.status_code == 403  # Forbidden

    def test_create_success(self, client, auth_headers, db):
        db.execute("INSERT INTO patients(tenant_id, mrn, name) VALUES (1, 'MRN001', 'Test')")
        res = client.post("/api/{{dept.code_short}}/", json={"patient_id": 1, "chief_complaint": "Test"}, headers=auth_headers)
        assert res.status_code == 201
        assert res.json()["patient_id"] == 1

    def test_ai_diagnose(self, client, auth_headers):
        with patch("rag_pipeline.build_diagnosis_agent") as mock:
            mock.return_value.invoke.return_value = {"output": "Possible STEMI"}
            res = client.post("/api/{{dept.code_short}}/ai/diagnose", json={"question": "Chest pain"}, headers=auth_headers)
            assert res.status_code == 200
""",

    "30_test_bdd.feature": """# filepath: 02_MODULES/{{dept.code}}/30_test_bdd.feature
# BDD scenarios for {{dept.name_en}} ({{dept.code}})
# Language: Gherkin (English for international tooling)

Feature: {{dept.name_en}} clinical workflow

  Background:
    Given a CBAHI/JCI-accredited hospital
    And a tenant with id 1
    And a {{dept.code_short}} specialist user
    And a patient with MRN 100045

  Scenario: List encounters for patient
    Given the patient has 3 active encounters
    When the specialist requests GET /api/{{dept.code_short}}/list?patient_id=100045
    Then the response status is 200
    And the response contains 3 encounters

  Scenario: Create new encounter with valid data
    Given the specialist is authenticated
    When the specialist POSTs to /api/{{dept.code_short}}/ with patient_id=100045
    Then the response status is 201
    And the encounter has status "active"

  Scenario: Unauthorized access is rejected
    Given no auth token
    When the user requests GET /api/{{dept.code_short}}/list
    Then the response status is 401

  Scenario: Cross-tenant access is blocked
    Given a tenant A with id 1
    And a tenant B with id 2
    And an encounter in tenant A
    When tenant B user requests that encounter
    Then the response status is 404

  Scenario: AI diagnosis returns differential
    Given the patient has chest pain
    When the specialist requests POST /api/{{dept.code_short}}/ai/diagnose
    Then the response includes 3 differential diagnoses
    And each diagnosis has an ICD-10 code

  Scenario: Drug interaction check warns
    Given the patient takes warfarin
    When the specialist orders amiodarone
    Then the system warns about CYP3A4 interaction
    And the warning severity is "high"
""",

    "31_user_manual_ar.md": """# دليل المستخدم — {{dept.name_ar}} ({{dept.code}})

> **الإصدار:** 1.0 · **التاريخ:** {{generated_at}}

## 1. مقدمة
هذا الدليل مخصص للأطباء والممرضين في قسم {{dept.name_ar}}.

## 2. تسجيل الدخول
1. افتح المتصفح على `https://jumanasoft.com`
2. أدخل اسم المستخدم وكلمة المرور
3. اختر المنشأة من القائمة
4. اختر "{{dept.name_ar}}" من الشريط الجانبي

## 3. الواجهة الرئيسية
- **الجزء الأيمن:** بطاقة المريض + التحذيرات + مقياس الخطورة
- **الجزء الأوسط:** علامات المريض + الطلبات + النتائج + الملاحظات
- **الجزء العلوي:** علامات التبويب (نظرة عامة، الطلبات، النتائج، الملاحظات)

## 4. تسجيل مريض
1. اضغط على "مريض جديد"
2. أدخل البيانات (الاسم، MRN، تاريخ الميلاد، الجنس)
3. أضف الحساسية إن وجدت
4. احفظ

## 5. كتابة الطلبات
1. اذهب إلى "الطلبات"
2. اضغط "طلب جديد"
3. اختر نوع الطلب (مختبر، أشعة، دواء، إجراء)
4. حدد الأولوية (عاجل، روتيني)
5. وقّع على الطلب

## 6. عرض النتائج
- اذهب إلى "النتائج"
- القيم غير الطبيعية تظهر باللون الأحمر
- اضغط على أي نتيجة لعرض التفاصيل

## 7. كتابة الملاحظات
1. اذهب إلى "الملاحظات"
2. اكتب SOAP (S/O, A/P)
3. احفظ كمسودة أو وقّع مباشرة
4. لا يمكن تعديل الملاحظات الموقعة (يجب إضافة ملاحظة تصحيحية)

## 8. التشخيص بالذكاء الاصطناعي
1. اضغط على أيقونة 🤖
2. اكتب سؤالك (مثلاً: "ما هو علاج الذبحة الصدرية المستقرة؟")
3. الذكاء الاصطناعي سيرد مع ICD-10 والمصادر

## 9. الأسئلة الشائعة
- **س: لا أرى نتائج المختبر؟**
  ج: تأكد من أن المختبر مرسل النتائج عبر FHIR.
- **س: كيف أوقّع على طلب؟**
  ج: اضغط على "توقيع" بعد كتابة الطلب.
- **س: كيف أضيف مستخدم جديد؟**
  ج: اطلب من مدير النظام إنشاء حساب عبر `/admin`.

## 10. الدعم الفني
- البريد الإلكتروني: support@jumanasoft.com
- الهاتف: +966-XXX-XXXX
- الموقع: https://jumanasoft.com/help
""",

    "32_user_manual_en.md": """# User Manual — {{dept.name_en}} ({{dept.code}})

> **Version:** 1.0 · **Date:** {{generated_at}}

## 1. Introduction
This manual is for doctors and nurses in the {{dept.name_en}} department.

## 2. Login
1. Open browser at `https://jumanasoft.com`
2. Enter username and password
3. Select facility
4. Select "{{dept.name_en}}" from sidebar

## 3. Main Interface
- **Right panel:** Patient card + Alerts + Risk score
- **Center:** Vitals + Orders + Results + Notes
- **Top:** Tabs (Overview, Orders, Results, Notes)

## 4. Register Patient
1. Click "New Patient"
2. Enter data (Name, MRN, DOB, Gender)
3. Add allergies if any
4. Save

## 5. Write Orders
1. Go to "Orders"
2. Click "New Order"
3. Choose type (Lab, Imaging, Medication, Procedure)
4. Set priority (Urgent, Routine)
5. Sign the order

## 6. View Results
- Go to "Results"
- Abnormal values appear in red
- Click any result for details

## 7. Write Notes
1. Go to "Notes"
2. Write SOAP (S/O, A/P)
3. Save as draft or sign
4. Signed notes cannot be edited (must add addendum)

## 8. AI Diagnosis
1. Click 🤖 icon
2. Type your question (e.g., "Treatment for stable angina?")
3. AI responds with ICD-10 + sources

## 9. FAQ
- **Q: Don't see lab results?**
  A: Ensure lab is sending via FHIR.
- **Q: How to sign an order?**
  A: Click "Sign" after writing the order.
- **Q: How to add new user?**
  A: Ask admin to create account via `/admin`.

## 10. Support
- Email: support@jumanasoft.com
- Phone: +966-XXX-XXXX
- Web: https://jumanasoft.com/help
""",

    "33_training_video_script.md": """# Training Video Script — {{dept.name_en}} ({{dept.code}})

> **Duration:** 15 minutes · **Generated:** {{generated_at}}

## Scene 1: Introduction (2 min)
[Visual: Hospital logo + narrator]
Narrator: "Welcome to NamaMedical ERP. In this video, we cover {{dept.name_en}} workflow."

## Scene 2: Login & Navigation (2 min)
[Visual: Screen recording]
- Open https://jumanasoft.com
- Login as {{dept.code_short}}_specialist
- Select {{dept.name_en}} from sidebar

## Scene 3: Patient Overview (2 min)
[Visual: Show patient card, vitals, risk score]
- Patient MRN 100045, 45y, M
- HR: 72, BP: 120/80, SpO2: 98
- Risk: NEWS2=2 (LOW)

## Scene 4: Writing Orders (3 min)
[Visual: Create order for CBC]
- Click "New Order"
- Type: Lab, Code: CBC
- Priority: Routine
- Sign order

## Scene 5: Receiving Results (2 min)
[Visual: Lab result appears]
- CBC results arrive via FHIR
- WBC: 7.2 (Normal)
- Hgb: 14.5 (Normal)

## Scene 6: AI Diagnosis (2 min)
[Visual: Click AI icon, type question]
- Question: "Patient with chest pain, ECG shows ST elevation. Differential?"
- AI returns: STEMI (I21.0), Unstable angina (I20.0), Pericarditis (I30.0)
- Sources cited

## Scene 7: Signing Notes (1 min)
[Visual: Write SOAP, sign]
- S/O: Patient presents with...
- A/P: Acute coronary syndrome...
- Sign with timestamp

## Scene 8: Closing (1 min)
[Visual: Outro]
Narrator: "For more training, visit our academy at jumanasoft.com/academy"
""",

    "34_legal_compliance.md": """# Legal & Compliance — {{dept.name_en}} ({{dept.code}})

> **CO:** Mr. Turki Al-Otaibi · **Generated:** {{generated_at}}

## 1. Licenses Required
- Hospital operating license (Saudi MoH)
- Department-specific accreditation (CBAHI)
- Specialist board certification (SCFHS)

## 2. Patient Rights
- Right to informed consent
- Right to privacy (PDPL)
- Right to second opinion
- Right to access own records

## 3. Data Protection (PDPL)
- All PHI encrypted at rest (crypto_envelope.js)
- Audit log retention: 7 years
- Patient consent for data sharing
- Breach notification within 72 hours

## 4. NPHIES Compliance
- Eligibility check before admission
- Pre-authorization for procedures
- Claim submission within 30 days
- Denial appeal within 60 days

## 5. CBAHI Standards
{% for c in dept.cbahi_controls %}
- {{c}}: see compliance matrix
{% endfor %}

## 6. JCI Standards
{% for j in dept.jci_controls %}
- {{j}}: see compliance matrix
{% endfor %}

## 7. SFDA Drug Reporting
- Adverse Drug Reaction (ADR) reporting within 15 days
- Batch recall protocol
- Pharmacovigilance contact

## 8. ZATCA Phase 2 (if applicable)
- VAT-inclusive pricing
- UBL 2.1 invoices
- XAdES-BES digital signature
- Clearance with ZATCA portal

## 9. Insurance Contracts
- Network status per payer
- Tariff negotiations
- Pre-auth requirements
- Co-pay calculations

## 10. Liability
- Malpractice insurance (minimum SAR 1M)
- Incident reporting protocol
- Root cause analysis (RCA)
- Family communication guidelines
""",

    "35_pmo_budget.md": """# PMO Budget — {{dept.name_en}} ({{dept.code}})

> **PM:** Master Orchestrator · **Generated:** {{generated_at}}

## 1. Story Points (Agile/Scrum)
| Epic | SP |
|---|---|
| Backend engine + RLS + RBAC | 8 |
| Frontend station (Stitch) + i18n | 5 |
| RAG ingestion + chains | 3 |
| Migrations + ERD + seeds | 3 |
| Tests (unit + integration + BDD) | 5 |
| Docs (manual AR/EN + training) | 2 |
| Compliance (JCI/CBAHI/PDPL) | 2 |
| **TOTAL** | **28 SP** |

## 2. Sprint Plan (2-week sprints)
| Sprint | Tasks |
|---|---|
| Sprint 1 | Design + Backend engine + Tests (15 SP) |
| Sprint 2 | Frontend + RAG + Docs (13 SP) |

## 3. Token Budget
| Phase | Tokens |
|---|---|
| Plan | 2,000 |
| Backend (engine + service + router) | 5,000 |
| Frontend (page + components + client) | 4,000 |
| RAG (chains + agents + pipeline) | 3,000 |
| Tests (3 files) | 3,000 |
| Docs (manual + training) | 2,000 |
| **TOTAL** | **~19,000 tokens** |

## 4. Cost Estimate (LLM)
- Avg $0.005 per 1k tokens (input) + $0.015 per 1k tokens (output)
- Per dept: ~$0.50 LLM cost
- For 60 depts: ~$30 LLM cost (one-time)

## 5. Wall-Clock Time
- Per dept (sequential): ~30 minutes
- Per dept (parallel, 7 experts): ~5 minutes
- For 60 depts: ~5 hours parallel

## 6. Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| RLS policy conflict | Medium | High | Test cross-tenant in CI |
| i18n missing key | High | Low | Auto-generate from ar.json |
| Migration drift | Medium | High | Always generate up + down symmetric |
| Token budget exceed | Medium | Medium | Truncate + appendix |

## 7. Acceptance Criteria
- [ ] Station loads in <500ms
- [ ] API endpoints respond in <200ms
- [ ] RLS blocks cross-tenant (test passed)
- [ ] i18n AR + EN complete
- [ ] RAG returns answer in <800ms
- [ ] All 35 files generated
- [ ] Tests pass (unit + integration + BDD)
- [ ] Manual AR + EN written
- [ ] Compliance mapping done

## 8. Dependencies
- Parent: {{dept.parent_group}}
- Related depts: {{dept.related_depts | default([]) | join(', ')}}

## 9. Definition of Done
- Code merged to `integration/all-epics`
- Tests pass in CI
- Reviewed by MO + 1 expert
- Index updated
- CHANGELOG entry added

## 10. Go/No-Go
**Owner signal: ACTIVE — GO**
""",
}


# ============ Main Factory ============
def render_file(template_str, dept, generated_at):
    if isinstance(template_str, dict):
        # JSON file
        return json.dumps(template_str, indent=2, ensure_ascii=False)
    tmpl = Template(template_str)
    return tmpl.render(dept=dept, generated_at=generated_at)


def generate_dept(dept_config, out_root, generated_at):
    """Generate 35 files for one department."""
    dept_code = dept_config["code"]
    code_short = dept_config.get("code_short", dept_code.lower().replace("-", "_"))
    dept_name_ar = dept_config.get("name_ar", dept_code)
    dept_name_en = dept_config.get("name_en", dept_code)

    # Build dept dict for template
    dept = {
        "code": dept_code,
        "code_short": code_short,
        "code_short_pascal": "".join(p.capitalize() for p in code_short.split("_")),
        "name_ar": dept_name_ar,
        "name_en": dept_name_en,
        "parent_group": dept_config.get("parent_group", ""),
        "facility_types": dept_config.get("facility_types", ["general_hospital"]),
        "subspecialties": dept_config.get("subspecialties", ["general"]),
        "conditions_top10": dept_config.get("conditions_top10", []),
        "procedures_top20": dept_config.get("procedures_top20", []),
        "red_flags": dept_config.get("red_flags", []),
        "scores": dept_config.get("scores", []),
        "drugs_top": dept_config.get("drugs_top", []),
        "jci_controls": dept_config.get("jci_controls", []),
        "cbahi_controls": dept_config.get("cbahi_controls", []),
        "pdpl_pii_categories": dept_config.get("pdpl_pii_categories", []),
        "rbac_roles": dept_config.get("rbac_roles", [f"{code_short}_specialist"]),
        "related_depts": dept_config.get("related_depts", []),
    }

    dept_dir = Path(out_root) / f"{dept_code}_{code_short}"
    dept_dir.mkdir(parents=True, exist_ok=True)

    files_written = []
    for filename, template_str in TEMPLATES.items():
        try:
            content = render_file(template_str, dept, generated_at)
            file_path = dept_dir / filename
            file_path.write_text(content, encoding="utf-8")
            files_written.append(str(file_path))
        except Exception as e:
            print(f"  [FAIL] {filename}: {e}")

    return files_written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True, help="YAML config file")
    ap.add_argument("--out", required=True, help="Output root directory")
    ap.add_argument("--dept", help="Generate only this dept code (e.g. DEP-001)")
    args = ap.parse_args()

    with open(args.config, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    generated_at = datetime.now().strftime("%Y-%m-%d")
    out_root = Path(args.out)

    if args.dept:
        # Single dept mode
        for d in cfg.get("depts", []):
            if d["code"] == args.dept:
                files = generate_dept(d, out_root, generated_at)
                print(f"[OK] {args.dept}: {len(files)} files")
                return
        print(f"[ERROR] Dept {args.dept} not found")
        return

    # All depts
    total_files = 0
    for d in cfg.get("depts", []):
        files = generate_dept(d, out_root, generated_at)
        total_files += len(files)
        print(f"[OK] {d['code']} ({d.get('name_en','?')}): {len(files)} files")

    print(f"\n[STATS] Total: {total_files} files generated")


if __name__ == "__main__":
    main()
