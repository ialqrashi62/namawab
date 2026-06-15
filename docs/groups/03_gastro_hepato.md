# G03 — الجهاز الهضمي والكبد (Gastroenterology & Hepatology)

## 0) Meta
```yaml
dept_key: "gastro_hepato"
dept_name_en: "Gastroenterology, Hepatology & Pancreato-Biliary"
dept_name_ar: "طب الجهاز الهضمي والكبد"
group_id: "G03"
sub_units: [gastro_general, advanced_endoscopy_eus, ercp, enteroscopy,
            laparoscopy_medical, hepatology, pancreato_biliary,
            gi_motility, clinical_nutrition_med]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-GI Assistant.
ROLE: Help GI/Hepatology consultants, fellows, endoscopy nurses, dietitians.
GUARDRAILS: AGA/ACG, EASL, ESGE, AASLD guidelines.
- HCV/HBV: always check INR, bilirubin, platelets before procedure.
- Anticoag/antiplatelet: apply ASGE periendoscopic guidance.
- Liver: compute Child-Pugh + MELD before transplant referral.
TOOLS: search_patient, get_endoscopy, get_liver_panel, meld_calc, child_pugh,
       interpret_endoscopy_image, ercp_difficulty_score, hcv_treatment_select,
       check_drug_interaction, pull_protocol, escalate.
STYLE: SOAP; cite guideline; "Time-critical" (variceal bleed = YES).
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, etoh_intake, viral_serology, allergies}
labs:    {alt, ast, alkphos, bili_total, bili_direct, alb, inr, plt, creatinine}
visit:   {id, type, doctor_id}
top_k_rag: 5
```

### 1.3 Few-shot
```
Q: 55F, jaundice + RUQ pain, US shows CBD 12mm + stone. Plan?
A: Choledocholithiasis. Admit, NPO, IV fluids, broad-spectrum if cholangitis (Tokyo TG18).
   Urgent ERCP within 24-48h for stone extraction + sphincterotomy.
   Pre-procedure: INR, plt, allergy, anticoag review.
   Next-best-action: book ERCP, consult anesthesia, consent.
   Time-critical: YES if cholangitis criteria met.

Q: 45M HCV genotype 1, F2 fibrosis, naive. Treatment?
A: Pan-genotypic DAA: glecaprevir/pibrentasvir 8w (no cirrhosis) or sofosbuvir/velpatasvir 12w.
   Check HBV serology (reactivation risk), pregnancy in partners (ribavirin avoid),
   drug interactions (statins, amiodarone).
   Next-best-action: SVR12 follow-up plan + lifestyle counseling.
```

## 2) Workflow
LangGraph: classify → load(labs+endo history) → rag → tools (meld/child/dose) → compose → critique.
Chains: variceal bleed → triage → endoscopy STAT → vasoactives → ICU; suspected pancreatic cancer → CA19-9 → MRCP/EUS → tumor board.

## 3) Backend / API
| Path | Method | Purpose |
|------|--------|---------|
| /api/v1/gi/endoscopy | GET,POST | EGD/colon/ERCP/EUS reports |
| /api/v1/gi/liver/scores | GET | MELD/Child/APRI/FIB-4 |
| /api/v1/gi/hcv/treatment_plan | POST | DAA selector |
| /api/v1/gi/motility | GET,POST | manometry/pH-Imp |
| /api/v1/gi/ai/ask | POST | LangGraph |

Events: `gi.endoscopy.completed`, `gi.ercp.completed`, `gi.hcv.svr12.confirmed`.

## 4) Data
```sql
CREATE TABLE gi_endoscopy (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  procedure VARCHAR(20), -- 'egd','colon','ercp','eus','enteroscopy','flex_sig'
  date DATE, indication NVARCHAR(300), findings NVARCHAR(MAX),
  biopsy_taken BIT, polyps_n INT, prep_quality VARCHAR(20),
  complications NVARCHAR(500), images_blob_url VARCHAR(500),
  ai_findings NVARCHAR(MAX));
CREATE TABLE gi_liver_scores (id UUID PRIMARY KEY, patient_id INT,
  computed_at DATETIMEOFFSET, meld INT, meld_na INT, child_pugh CHAR(1),
  apri DECIMAL(4,2), fib4 DECIMAL(4,2));
CREATE TABLE gi_hcv_treatment (id UUID PRIMARY KEY, patient_id INT,
  genotype VARCHAR(10), fibrosis_stage VARCHAR(5), regimen VARCHAR(60),
  start_date DATE, end_date DATE, svr12_status VARCHAR(20));
CREATE TABLE gi_ercp_logs (id UUID PRIMARY KEY, patient_id INT,
  date DATE, sphincterotomy BIT, stone_extracted BIT, stent_placed BIT,
  difficulty_grade INT, post_ercp_pancreatitis BIT);
CREATE TABLE gi_motility (id UUID PRIMARY KEY, patient_id INT,
  test_type VARCHAR(20), date DATE, results_json NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_gi` (AGA, ACG, EASL, AASLD, ESGE)
- `kb_local_sop_gi`
- `kb_drug_formulary_gi` (DAAs, PPIs, IBD biologics)

## 5) Frontend
Screens: Endoscopy worklist, Image viewer (with AI overlay polyp detection),
Hepatology dashboard (MELD/Child trends), HCV treatment tracker.
Components: `<EndoImageViewer>`, `<MELDChart>`, `<HCVRegimenPicker>`.

## 6) Infra/CI/CD: standard.

## 7) Testing
Unit: MELD/Child/FIB-4. Integration: ERCP request → schedule → completion → biopsy lab → path report.

## 8-15) Wireframes/BPMN/ERD/Stories/Tests/Arch/Security/Deploy
- BPMN: `gi_variceal_bleed.bpmn`, `gi_ercp_workflow.bpmn`, `gi_hcv_treatment.bpmn`.
- Gherkin:
```gherkin
Feature: ERCP scheduling for choledocholithiasis
  Scenario: Cholangitis with bilirubin 6
    Given a 60yo with bilirubin 6, fever, RUQ pain, US dilated CBD
    When physician orders urgent ERCP
    Then case scheduled within 24h with anesthesia + GI on-call
    And antibiotics auto-suggested per Tokyo TG18
```
- STRIDE: Endoscopy video PHI, biopsy chain-of-custody.

## 16-22) Style/i18n/Seeders/Migrations/Manual/Training/Compliance
Accent `#06b6d4`. i18n ~250 keys. Seeders: 40 endo, 20 ERCP, 20 hcv. PDPL + CBAHI infection-control endoscopy.

## 23) Risks
Endoscopy reprocessing logs (CSSD link), HCV registry MoH reporting, AI polyp detector calibration.
