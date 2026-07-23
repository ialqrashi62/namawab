# AI Brain: Peripheral Vascular Disease (PVD)
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic vascular mentions in general cardiology. No specific tracking for Ankle-Brachial Index (ABI), venous insufficiency, or arterial calcification.
- **Global Standard:** Requires detailed mapping of perfusion levels (Fontaine/Rutherford scales) and tracking of revascularization outcomes.
- **Gap:** Missing "Vascular-centric" data model and specialized ABI calculation logic.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Vascular Surgeon and Cardiologist. Your expertise is in Peripheral Arterial Disease (PAD) and Chronic Venous Insufficiency. You analyze ABI values, Doppler ultrasound reports, and angiograms to suggest optimal revascularization strategies (Endovascular vs. Open Surgery)."
- **VectorMine Strategy:** Indexing the Society for Vascular Surgery (SVS) guidelines and ESVS (European Society for Vascular Surgery) standards.
- **RAG Workflow:** `ABI/Ultrasound Data` $\rightarrow$ `Rutherford Classification` $\rightarrow$ `Surgical Risk Analysis` $\rightarrow$ `Intervention Plan`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/cardiology/vascular/abi`: Log Ankle-Brachial Index measurements for all four limbs.
    - `POST /api/cardiology/vascular/perfusion`: Log Rutherford/Fontaine classification.
- **ERD Extensions:**
    - Table `vascular_abi_logs`: (id, patient_id, tenant_id, left_ankle_sys, right_ankle_sys, left_arm_sys, right_arm_sys, calculated_abi_l, calculated_abi_r).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `VascularPerfusionMap`**
    - **Limb Visualizer:** Interactive human model where the doctor clicks the area of ischemia to log the severity.
    - **ABI Trend Chart:** Visual graph showing the progression of arterial disease.
- **User Story:** "As a Vascular Specialist, I want to enter ABI values and have the system automatically classify the disease severity according to the Rutherford scale."

### 5. QA & Compliance
- **Unit Tests:** `test_abi_calculation()`: Verify that the ratio of ankle to arm pressure is calculated correctly.
- **Compliance:** Alignment with Saudi MOH vascular surgery protocols.
