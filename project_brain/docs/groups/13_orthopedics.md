# G13 — العظام والمفاصل (Orthopedics, Joint Replacement, Trauma, Sports, Hand, Foot, Onc, Pediatric)

## 0) Meta
```yaml
dept_key: "orthopedics"
group_id: "G13"
sub_units: [ortho_general, spinal_orthopedics, joint_arthroplasty_hip,
            joint_arthroplasty_knee, joint_shoulder_elbow, trauma_orthopedics,
            hand_microsurgery, foot_ankle, sports_arthroscopy, ortho_oncology, peds_ortho]
```

## 1) System Prompt
```text
You are NamaMedical-Ortho Assistant.
GUARDRAILS: AAOS, BOA, AOTrauma, ICRS (cartilage), ISAKOS (sports).
- Fragility fracture → DXA + secondary fracture prevention referral.
- Joint replacement: pre-op risk (Charlson, KOOS/HOOS), VTE prophylaxis, infection bundle.
- Pediatric: open growth plate considerations.
TOOLS: ao_fracture_classify, koos_hoos_score, parker_score,
       vte_proph_ortho, pre_op_optimization, implant_trace, escalate.
```

## 2) Workflow
LangGraph: classify → load(imaging+labs) → rag → tools(scores/classify) → critique.

## 3) API
| /api/v1/ortho/cases | GET,POST | OR/clinic cases |
| /api/v1/ortho/fractures | POST | AO/OTA classification |
| /api/v1/ortho/arthroplasty | GET,POST | hip/knee/shoulder logs |
| /api/v1/ortho/sports | GET,POST | ACL/meniscus/rotator cuff |
| /api/v1/ortho/peds | GET,POST | growth-plate cases |
| /api/v1/ortho/ai/ask | POST | LangGraph |

Events: `ortho.case.scheduled`, `ortho.implant.registered`, `ortho.dxa.scheduled`.

## 4) Data
```sql
CREATE TABLE ortho_cases (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  procedure VARCHAR(60), side VARCHAR(5), scheduled_date DATE, surgeon_id INT,
  approach VARCHAR(40), implant_id UUID, ebl_ml INT,
  outcome VARCHAR(40));
CREATE TABLE ortho_fractures (id UUID PRIMARY KEY, patient_id INT,
  body_site VARCHAR(40), ao_ota_code VARCHAR(20), open_grade TINYINT,
  treatment VARCHAR(40), reduction_quality VARCHAR(20));
CREATE TABLE ortho_arthroplasty (id UUID PRIMARY KEY, patient_id INT, ortho_case_id UUID,
  joint VARCHAR(20), bearing VARCHAR(40), cup_size INT, head_size INT,
  cemented BIT, alignment_deg DECIMAL(4,1));
CREATE TABLE ortho_sports (id UUID PRIMARY KEY, patient_id INT,
  injury VARCHAR(40), repair_type VARCHAR(40), graft VARCHAR(40),
  return_to_sport_weeks INT);
CREATE TABLE ortho_peds_growth (id UUID PRIMARY KEY, patient_id INT,
  exam_date DATE, leg_length_disc_mm INT, scoliosis_cobb INT, treatment_plan NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_ortho` (AAOS, AOTrauma, ISAKOS)
- `kb_implants_catalog` (UDI catalog)

## 5) Frontend
OR ortho schedule, Fracture classifier (image-assisted), Arthroplasty templating viewer (linked PACS),
Sports rehab tracker, Peds growth-plate tracker.
Components: `<XRViewer>`, `<AOClassifier>`, `<TemplateOverlay>`, `<ROMTracker>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `ortho_hip_replacement.bpmn`, `ortho_open_fracture_eras.bpmn`.
```gherkin
Feature: Open fracture antibiotic timing
  Scenario: Gustilo III fracture
    Given trauma admission with open tibia Gustilo IIIB
    When orders are written
    Then antibiotic + tetanus given within 1h, OR within 6h
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#22c55e`. Seeders 30 ortho cases mix arthroplasty/trauma/sports. PDPL, CBAHI ortho bundle, SFDA implant tracking, MoH disability registry link.

## 23) Risks
Implant supply chain; pediatric implant sizing; sports-rehab digital therapeutic integrations.
