# User Stories & Acceptance Criteria — NamaMedical ERP
# Filepath: .ai-brain/08_TESTING/user-stories.md
# Generated: 2026-08-08

# User Stories & Acceptance Criteria

> **Format:** As a [role], I want [feature], so that [benefit]
> **Coverage:** 60 departments × 5-10 stories = 300-600 stories
> **Status:** Mapped to 35-file blueprint per dept

---

## 1. Epic Cardiology User Stories (Sample)

### Story DEP-001-001: STEMI Pathway
**As a** cardiologist on call
**I want** automatic cath lab activation when ECG shows ST elevation
**So that** door-to-balloon time stays < 90 minutes (ESC 2024 guideline)

**Acceptance Criteria:**
- [ ] ECG upload triggers automatic interpretation
- [ ] ST elevation detection within 30 seconds
- [ ] Alert sent to cardiologist + cath lab team
- [ ] Aspirin + clopidogrel + heparin order set auto-suggested
- [ ] Door-to-balloon metric tracked in dashboard
- [ ] Outcome: 90% of STEMI patients within 90 min

### Story DEP-001-002: Atrial Fibrillation Anticoagulation
**As a** cardiologist
**I want** automatic CHA2DS2-VASc calculation + DOAC recommendation
**So that** AF patients get guideline-directed anticoagulation

**Acceptance Criteria:**
- [ ] CHA2DS2-VASc auto-calculated from patient data
- [ ] HAS-BLED score also displayed (bleeding risk)
- [ ] DOAC (apixaban) suggested if score ≥ 2 (men) or ≥ 3 (women)
- [ ] Renal function (CrCl) factored into dose
- [ ] Patient education materials auto-generated

### Story DEP-001-003: Heart Failure GDMT
**As a** cardiologist
**I want** guideline-directed medical therapy checklist
**So that** HFrEF patients get all 4 pillars (ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i)

**Acceptance Criteria:**
- [ ] LVEF-based checklist (HFrEF < 40%, HFmrEF 40-49%, HFpEF ≥ 50%)
- [ ] All 4 pillars tracked
- [ ] Contraindication alerts
- [ ] Titration schedule reminder

---

## 2. Cross-Department User Stories (60 depts × 5)

### 2.1 Clinical (10 stories per dept × 50 clinical depts = 500 stories)

For each dept:
1. **Encounter creation** — Doctor creates encounter with chief complaint + vitals
2. **Order creation** — Doctor orders lab/imaging/medication with indication
3. **Result review** — Doctor reviews results, signs note
4. **AI assist** — Doctor asks AI for differential, validates
5. **Discharge** — Doctor writes discharge summary + prescriptions

### 2.2 Operational (10 stories × 10 op depts = 100 stories)

For each op dept (pharmacy, billing, etc.):
1. **Daily workflow** — User performs typical daily task
2. **Approval flow** — Manager approves transactions
3. **Report generation** — User generates daily/weekly report
4. **Exception handling** — User handles error case
5. **Audit query** — User queries audit log

---

## 3. Universal User Stories (Apply to All)

### Story UNI-001: Multi-Tenant Isolation
**As a** hospital IT admin
**I want** my hospital's data to be invisible to other hospitals
**So that** PDPL/HIPAA compliance is maintained

**Acceptance Criteria:**
- [ ] All queries filter by `tenant_id`
- [ ] RLS policies on every table
- [ ] Cross-tenant attack returns 404 (not 403)
- [ ] Audit log entry for any cross-tenant attempt

### Story UNI-002: Arabic-First UI
**As a** Saudi doctor
**I want** the interface in Arabic with RTL layout
**So that** I can work in my native language

**Acceptance Criteria:**
- [ ] Default language = Arabic
- [ ] RTL layout on body
- [ ] Arabic font (IBM Plex Sans Arabic)
- [ ] All clinical terms have Arabic translation
- [ ] Toggle to English available

### Story UNI-003: AI Diagnosis (RAG)
**As a** doctor
**I want** AI to suggest differential diagnosis with citations
**So that** I can validate my clinical reasoning with evidence

**Acceptance Criteria:**
- [ ] AI returns top 3 differentials with ICD-10
- [ ] Citations to guidelines (Uptodate, ESC, etc.)
- [ ] Response in < 2 seconds
- [ ] Bilingual (AR + EN)
- [ ] Physician can accept/reject/override

### Story UNI-004: Audit Trail
**As a** compliance officer
**I want** every PHI access logged immutably
**So that** I can investigate breaches and prove compliance

**Acceptance Criteria:**
- [ ] Every read/write logged with actor + timestamp + entity
- [ ] Hash-chained (tamper-evident)
- [ ] 7+ years retention
- [ ] Queryable via UI

### Story UNI-005: Offline Mode
**As a** rural doctor
**I want** to work offline and sync later
**So that** poor connectivity doesn't block patient care

**Acceptance Criteria:**
- [ ] Service worker caches critical assets
- [ ] Local IndexedDB for queue
- [ ] Conflict resolution on sync
- [ ] Offline indicator in UI

---

## 4. Persona Coverage Matrix

| Persona | Coverage |
|---|---|
| **Owner/Admin** | 100% |
| **Doctor (all 50 clinical)** | 100% |
| **Nurse** | 100% |
| **Pharmacist** | 100% |
| **Lab tech** | 100% |
| **Radiology tech** | 100% |
| **Billing clerk** | 100% |
| **Insurance coordinator** | 100% |
| **Quality officer** | 100% |
| **Patient (portal)** | Roadmap (PWA Sprint 54) |

---

## 5. Story Point Distribution

| Story Type | Avg SP | Total |
|---|---|---|
| Encounters (60 depts × 1) | 5 | 300 |
| Orders (60 × 1) | 3 | 180 |
| Results (60 × 1) | 3 | 180 |
| AI (60 × 1) | 8 | 480 |
| Discharge (60 × 1) | 5 | 300 |
| Operational (10 × 5) | 5 | 250 |
| Universal (5) | 13 | 65 |
| **TOTAL** | | **1,755 SP** |

---

## 6. Acceptance Test Pattern (Given-When-Then)

```gherkin
Feature: STEMI Auto-Activation
  Background:
    Given a cardiologist user
    And a patient with chest pain
  Scenario: ECG with ST elevation triggers cath lab
    Given the doctor uploads an ECG
    When the ECG interpretation detects ST elevation > 1mm in 2 contiguous leads
    Then the system activates the cath lab within 30 seconds
    And the cardiologist receives an SMS alert
    And the order set "STEMI bundle" appears in the orders list
    And the door-to-balloon timer starts
```

---

**Generated:** 2026-08-08 · **Total Stories:** 1,755 SP across 60 depts
