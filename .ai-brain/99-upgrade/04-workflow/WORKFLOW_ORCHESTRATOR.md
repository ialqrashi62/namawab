---
id: WORKFLOW-ORCHESTRATOR
version: 1.0
date: 2026-08-01
owner: SA+CMO
status: ACTIVE
---

# Workflow Orchestrator + Care Pathway Library + Task System v2

> **Purpose:** Encode clinical and operational workflows as state machines (LangGraph + native FSM) with deterministic escalation, multi-role coordination, and audit trail.

---

## 1. Global systems comparison

| System | Workflow approach |
|--------|--------------------|
| **Epic** | Hyperspace "Best Practice Advisories" + Care Pathways as flowsheets |
| **Cerner** | MPages + Dynamic Care Pathways (CPATH) |
| **MEDITECH** | Care Plans + Order Sets |
| **InterSystems IRIS** | Business Process + Rules Engine |
| **Dell Boomi/MuleSoft** | Visual flow + enterprise integration |
| **NamaMedical** | **LangGraph supervisor + native FSM + dedicated care pathway library** |

---

## 2. LangGraph Supervisor (master orchestrator pattern)

```text
[ENTRY] → triage_node → {risk_branch}
            ├─> critical_branch  → immediate_action + page_oncall_node
            ├─> stable_branch    → standard_care_node
            └─> observation_branch → monitoring_node

Every node has:
- inputs
- outputs
- guardrails
- SLA (max time)
- escalation rule
- audit hook
```

State machine per encounter persists in `encounter_state` table.

---

## 3. Care Pathways Library — 50+ Codified

```yaml
care_pathways:
  - id: PATH:AMI:STEMI
    name: ST-Elevation Myocardial Infarction
    jurisdiction: KSA + ESC
    triggers:
      - ECG shows ST-elevation >=1mm in 2+ contiguous leads
      - New LBBB
    nodes:
      - id: trigger
      - id: activate_cath_lab
      - id: aspirin_loading
      - id: heparin
      - id: pci_within_90min
      - id: risk_stratify
      - id: cardiac_rehab
    durations:
      door_to_balloon: 90m  # MUST
      door_to_ecg: 10m
    order_sets: [AMI-Stemi-Acute]
    citations: [CIT:ESC-2024:STEMI, CIT:NPHIES:ACS-001]
    overrides_audit: strict
  - id: PATH:CVA:STROKE
    triggers:
      - FAST positive
      - last_known_well <=4.5h
    nodes: [...]
  - id: PATH:SEPSIS:1HR
    name: Sepsis 1-hour bundle
    triggers: [qSOFA>=2, lactate>=2, suspected infection]
    nodes: [...]
  - id: PATH:DKA
  - id: PATH:PE
  - id: PATH:AOE_APPENDICITIS
  - id: PATH:CHILDBIRTH_NORMAL
  - id: PATH:CHILDBIRTH_C_SECTION
  - id: PATH:AMI_NSTEMI
  - id: PATH:HEART_FAILURE
  - id: PATH:A_FIB
  - id: PATH:STROKE_HEMORRHAGIC
  - id: PATH:TRAUMA_MAJOR
  - id: PATH:BURN_TBSA_>20
  - id: PATH:ANAPHYLAXIS
  - id: PATH:STATUS_EPILEPTICUS
  - id: PATH:AORTIC_DISSECTION
  - id: PATH:ABDOMINAL_AORTIC_ANEURYSM
  - id: PATH:PE_DVT
  - id: PATH:GI_BLEED_UPPER
  - id: PATH:GI_BLEED_LOWER
  - id: PATH:CIRRHOSIS_VARICEAL_BLEED
  - id: PATH:ACUTE_KIDNEY_INJURY
  - id: PATH:HYPERKALEMIA
  - id: PATH:ACUTE_LIVER_FAILURE
  - id: PATH:NSTEMI
  - id: PATH:STEMI
  - id: PATH:SEPTIC_SHOCK
  - id: PATH:NEONATAL_SEPSIS
  - id: PATH:NEONATAL_RESUSCITATION
  - id: PATH:PRETERM_LABOR
  - id: PATH:ECTOPIC_PREGNANCY
  - id: PATH:OVARIAN_TORSION
  - id: PATH:TESTICULAR_TORSION
  - id: PATH:STATUS_ASTHMATICUS
  - id: PATH:COPD_EXACERBATION
  - id: PATH:PNEUMONIA_SEVERE
  - id: PATH:MENINGITIS
  - id: PATH:ENCEPHALITIS
  - id: PATH:HIV_OPPORTUNISTIC_INFECTION
  - id: PATH:MALARIA
  - id: PATH:TUBERCULOSIS_DRUG_RESISTANT
  - id: PATH:COVID_SEVERE
  - id: PATH:MONKEYPOX
  - id: PATH:ACUTE_GLAUCOMA
  - id: PATH:RETINAL_DETACHMENT
  - id: PATH:EPIGLOTTITIS
  - id: PATH:AIRWAY_OBSTRUCTION
  - id: PATH:POSTOP_HEMORRHAGE
  - id: PATH:ANASTOMOTIC_LEAK
  - id: PATH:DEEP_VEIN_THROMBOSIS
  - id: PATH:PULMONARY_EMBOLISM
```

> **All in `.ai-brain/04-workflow/pathways/` as YAML + code**.

---

## 4. Task System v2

```sql
CREATE TABLE tasks_v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT,
  patient_id BIGINT,
  pathway_id TEXT,           -- e.g., PATH:AMI:STEMI
  step_id TEXT,              -- node id
  title TEXT NOT NULL,
  description TEXT,
  task_type ENUM('order','medication','procedure','consult','education','review','document','care_coord'),
  priority ENUM('stat','urgent','routine'),
  assigned_role TEXT,        -- doctor, nurse, pharmacist, etc.
  assigned_to UUID,          -- provider_id
  due_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completion_reason TEXT,
  escalated BOOLEAN DEFAULT false,
  escalation_at TIMESTAMPTZ,
  parent_task_id BIGINT,
  created_by UUID,
  audit_hash TEXT,           -- for hash-chain
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS + FORCE_RLS, hash-chained audit
```

**API**:
- `GET /api/v1/tasks/mine?status=open` — clinician inbox
- `POST /api/v1/tasks/:id/complete` — mark done
- `POST /api/v1/tasks/:id/escalate` — escalate
- WebSocket: `/ws/tasks/inbox` — live update

---

## 5. Multi-disciplinary Rounds (MDR)

```yaml
mdr_sessions:
  - id: MDR-ICU-2026-08-01-AM
    date: 2026-08-01
    time: 08:30
    location: "ICU Round Room"
    attendees: [intensivist, nurse_lead, pharmacist, respiratory_therapist, nutritionist, social_worker]
    cases: 12
    duration_min: 60
    outputs:
      - care_plan_updates
      - new_orders
      - discharge_readiness_assessment
```

Stored in `mdr_sessions` + `mdr_actions` tables.

---

## 6. Order Sets Library

```yaml
order_sets:
  - id: OS:AMI:STEMI:acute
    name: AMI STEMI Acute
    items:
      - {type: medication, drug: aspirin, dose: 325mg, route: PO, timing: STAT}
      - {type: medication, drug: clopidogrel, dose: 600mg, route: PO, timing: STAT}
      - {type: medication, drug: heparin, dose: 60U/kg, route: IV, max: 4000U, timing: STAT}
      - {type: lab, panel: troponin_q3h, duration: 24h}
      - {type: lab, panel: CBC, timing: STAT}
      - {type: imaging, study: ECG, timing: STAT}
      - {type: consult, dept: interventional_cardiology}
      - {type: procedure, name: cardiac_cath, timing: within_90m_door_to_balloon}
  # + 100 order sets across specialties
```

---

## 7. Care Plans with Goals

```sql
CREATE TABLE care_plans (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  problem_id BIGINT,
  goal TEXT NOT NULL,
  goal_metric TEXT,           -- e.g., 'HbA1c <7%'
  interventions TEXT[],
  target_date DATE,
  status ENUM('active','achieved','abandoned'),
  created_by UUID,
  created_at TIMESTAMPTZ,
  -- RLS + audit
);
```

---

## 8. Implementation Files

```
src/workflow/
├── langgraph_supervisor.js
├── care_pathways/
│   ├── loader.js
│   ├── executor.js
│   ├── pathways/ami_stemi.js
│   ├── pathways/stroke.js
│   └── pathways/sepsis.js
├── tasks_v2/
│   ├── routes.js
│   ├── service.js
│   ├── escalation.js
│   └── ws.js
├── mdr/
├── order_sets/
├── care_plans/
└── audit/
```

---

## 9. Tests

- Unit: per pathway transitions, escalation SLA, task lifecycle
- Integration: pathway execution persists in DB
- E2E: door-to-balloon <90m measurable from event log
- Clinical safety: missing critical step raises blocking alert

---

*Owner: SA+CMO — version 1.0 — 2026-08-01*
