# AI Brain: Nephrology & Dialysis Suite
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis (The Loop)
- **Current State:** Generic `nephrology_module` exists in DB. No structured tracking for dialysis sessions, ultrafiltration (UF) targets, or kidney transplant immunosuppression protocols.
- **Global Standard (KDIGO):** Requires precise tracking of GFR (Glomerular Filtration Rate), albuminuria, and dialysis adequacy (Kt/V).
- **Gap:** Missing "Dialysis-centric" data model and automated GFR/Creatinine Clearance calculators.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Nephrologist and Dialysis Specialist. Your expertise is in chronic kidney disease (CKD), acute kidney injury (AKI), and renal replacement therapy. You analyze creatinine, urea, and electrolytes to suggest dialysis prescriptions and manage immunosuppression for transplant patients based on KDIGO guidelines."
- **VectorMine Strategy:** Indexing the KDIGO (Kidney Disease: Improving Global Outcomes) guidelines and ISN (International Society of Nephrology) standards.
- **RAG Workflow:** `Creatinine/Age/Sex` $\rightarrow$ `eGFR Calculation` $\rightarrow$ `CKD Stage Assignment` $\rightarrow$ `Management Plan`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/nephrology/gfr`: Calculate and log eGFR (CKD-EPI/MDRD).
    - `POST /api/nephrology/dialysis/session`: Log dialysis session (Pre/Post weight, UF volume, Blood flow rate).
    - `POST /api/nephrology/transplant/meds`: Track immunosuppressant levels (Tacrolimus/Cyclosporine).
- **ERD Extensions:**
    - Table `nephrology_gfr_logs`: (id, patient_id, tenant_id, creatinine, age, sex, calculated_egfr, stage).
    - Table `dialysis_sessions`: (id, patient_id, tenant_id, session_date, pre_weight, post_weight, uf_volume, blood_flow_rate, la_duration).
    - Table `renal_transplant_logs`: (id, patient_id, tenant_id, donor_type, transplant_date, immunosuppressant_regimen).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `DialysisCommandCenter`**
    - **UF Tracker:** Real-time gauge showing current vs. target ultrafiltration.
    - **Weight Trendline:** Graph showing "Dry Weight" vs. "Interdialytic Weight Gain".
    - **GFR Badge:** Dynamic badge showing CKD Stage (1-5).
- **User Story:** "As a Nephrologist, I want to see the patient's weight gain since the last session to calculate the safe ultrafiltration target for today's dialysis."

### 5. QA & Compliance
- **Unit Tests:** 
    - `test_egfr_calculation()`: Verify eGFR accuracy using CKD-EPI formula.
    - `test_uf_limit_alert()`: Trigger alert if UF volume exceeds safe hourly limits.
- **Integration Tests:** Verify that dialysis sessions are linked to the billing module for insurance claims.
- **Compliance:** Alignment with Saudi MOH and international renal care standards.
