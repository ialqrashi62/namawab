# G31 — التغذية والمطبخ الطبي (Clinical Nutrition & Food Services)

## 0) Meta
```yaml
dept_key: "nutrition"
group_id: "G31"
sub_units: [clinical_nutrition_general, tpn_enteral, chronic_disease_diets,
            pediatric_nutrition, bariatric_nutrition,
            central_kitchen, room_service, preventive_nutrition]
```

## 1) System Prompt
```text
You are NamaMedical-Nutrition Assistant.
GUARDRAILS: ASPEN, ESPEN, AND, KSA-MoH dietary guidelines, halal food handling.
- TPN: macros (kcal/kg, g/kg protein), electrolytes, refeeding risk (MUST ≥2).
- Diabetic, renal, cardiac, dysphagia, halal, allergen-free diets must be matched per visit.
- Pediatric: weight-for-age, growth-velocity-based.
TOOLS: kcal_protein_calc, refeeding_risk, tpn_compounder,
       diet_match_to_orders, allergen_check, escalate.
```

## 2) Workflow
LangGraph: classify → load(diet orders + labs) → rag(ASPEN) → tools(calc) → critique.

## 3) API
| /api/v1/nutr/assessments | GET,POST | nutrition assessment |
| /api/v1/nutr/diets | GET,POST | diet orders |
| /api/v1/nutr/tpn | POST | TPN calc + order |
| /api/v1/nutr/enteral | POST | enteral feeding regimen |
| /api/v1/kitchen/meals | GET,POST | meal generation + tracking |
| /api/v1/nutr/ai/ask | POST | LangGraph |

Events: `nutr.assessment.completed`, `nutr.tpn.compounded`, `kitchen.meal.delivered`.

## 4) Data
```sql
CREATE TABLE nutr_assessments (id UUID PRIMARY KEY, patient_id INT,
  assessed_at DATETIMEOFFSET, weight_kg DECIMAL(5,2), height_cm INT,
  bmi DECIMAL(4,1), must_score TINYINT, sga_grade CHAR(1),
  allergies NVARCHAR(300), preferences NVARCHAR(300));
CREATE TABLE nutr_diet_orders (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  diet_type VARCHAR(40), texture VARCHAR(20), restrictions NVARCHAR(300),
  ordered_by INT, ordered_at DATETIMEOFFSET);
CREATE TABLE nutr_tpn (id UUID PRIMARY KEY, patient_id INT,
  start_at DATETIMEOFFSET, kcal_total INT, protein_g DECIMAL(5,1),
  lipid_g DECIMAL(5,1), glucose_g DECIMAL(5,1),
  electrolytes_json NVARCHAR(MAX), trace_vitamins BIT);
CREATE TABLE nutr_enteral (id UUID PRIMARY KEY, patient_id INT,
  formula VARCHAR(60), rate_ml_h DECIMAL(4,1), goal_ml_24h INT,
  route VARCHAR(20));
CREATE TABLE kitchen_meals (id UUID PRIMARY KEY, patient_id INT,
  meal VARCHAR(20), date DATE, planned_items NVARCHAR(MAX),
  delivered_at DATETIMEOFFSET, intake_pct TINYINT);
```

### 4.2 Vector
- `kb_guidelines_nutr` (ASPEN, ESPEN, AND)
- `kb_recipes_diet_match`

## 5) Frontend
Nutrition dashboard, Assessment form, TPN calculator, Diet order pad,
Kitchen ticket queue, Meal-tray photo confirmation, Intake tracker.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `nutr_tpn_workflow.bpmn`, `kitchen_meal_workflow.bpmn`, `nutr_refeeding_pathway.bpmn`.
```gherkin
Feature: Refeeding risk
  Scenario: Patient NPO 7 days, BMI 16
    Given MUST = 4 and BMI 16
    Then refeeding protocol auto-suggested with phosphate/mg/k monitoring
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#65a30d`. Seeders 30 assessments, 10 TPN, 200 meals. PDPL, CBAHI nutrition, halal/HACCP food safety, SFDA dietary supplements.

## 23) Risks
Allergen control kitchen workflow; multi-language meal preferences; therapeutic-diet adherence.
