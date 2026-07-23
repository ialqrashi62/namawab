# The 'Golden Path' E2E Test Scenarios
## Cross-Wave Patient Journey Validation

### Scenario 1: The Major Trauma Case (The Critical Path)
**Journey**: Emergency $\rightarrow$ Neurosurgery $\rightarrow$ ICU $\rightarrow$ Rehab.
- **Step 1 (Emergency)**: Patient arrives with TBI. Log ESI triage $\rightarrow$ `esi_engine`.
- **Step 2 (Neurosurgery)**: Emergency Craniotomy. Log procedure $\rightarrow$ `neuro_surgical_logs`.
- **Step 3 (ICU)**: Post-op ICP monitoring. Log ICP/CPP $\rightarrow$ `intracranial_pressure_logs`. Trigger "Neurological Emergency" alert.
- **Step 4 (Rehab)**: Transition to Physical Therapy. Log ROM and Gait $\rightarrow$ `rehab_physical_logs`.
- **Verification**: Ensure `patient_id` and `tenant_id` are consistent across all 4 tables. Verify that the "Neurological Emergency" alert in ICU triggers a priority flag in Rehab.

### Scenario 2: The High-Risk Pregnancy (The Maternal-Fetal Path)
**Journey**: OBGYN $\rightarrow$ Diagnostics $\rightarrow$ Pediatrics (NICU).
- **Step 1 (OBGYN)**: High-risk pregnancy detected. Log MFM metrics $\rightarrow$ `maternal_fetal_metrics`. Trigger "FGR" alert.
- **Step 2 (Diagnostics)**: Advanced Fetal Echo. Log volumetric data $\rightarrow$ `radiology_advanced_metrics`.
- **Step 3 (Delivery)**: Preterm delivery. Log APGAR $\rightarrow$ `obgyn_delivery_logs`. Trigger "NICU Transition" alert.
- **Step 4 (NICU)**: Neonatal ventilation. Log HFOV settings $\rightarrow$ `nicu_ventilation_logs`.
- **Verification**: Trace the "FGR" alert from OBGYN to the NICU admission notes. Verify that the neonatal transition log links back to the delivery log.

### Scenario 3: The Complex Oncology Case (The Precision Medicine Path)
**Journey**: Diagnostics $\rightarrow$ Surgery $\rightarrow$ Rare Specialties $\rightarrow$ Rehab.
- **Step 1 (Diagnostics)**: Liquid Biopsy. Log NGS mutation $\rightarrow$ `diag_molecular_logs`.
- **Step 2 (Surgery)**: Robotic Resection. Log robotic metrics $\rightarrow$ `surgical_robotic_logs`.
- **Step 3 (Rare Spec)**: Nanomedicine targeted therapy. Log nanoparticle delivery $\rightarrow$ `nanomedicine_metrics`.
- **Step 4 (Rehab)**: Psychosocial support for chronic illness. Log PHQ-9 $\rightarrow$ la-Surgical logic for psychosocial logs.
- **Verification**: Verify that the molecular mutation (e.g., KRAS) in Diagnostics informs the nanoparticle targeting ligand in Rare Specialties.

### Scenario 4: The Pediatric Chronic Condition (The Developmental Path)
**Journey**: Pediatrics $\rightarrow$ Peds Subspecialties $\rightarrow$ Rehab.
- **Step 1 (Pediatrics)**: Growth tracking. Log Z-scores $\rightarrow$ `peds_growth_logs`.
- **Step 2 (Peds Subspec)**: Pediatric Nephrology. Log GFR $\rightarrow$ `peds_nephro_logs`.
- **Step 3 (Rehab)**: Developmental milestone tracking. Log ASQ-3 $\rightarrow$ `peds_milestone_tracking`.
- **Verification**: Ensure the GFR drop in Nephrology correlates with the developmental delay in the milestone logs.

### Scenario 5: The Operational Crisis (The Admin Path)
**Journey**: Admin/Ops $\rightarrow$ Critical Care $\rightarrow$ Diagnostics.
- **Step 1 (Admin)**: Bed occupancy reaches 98%. Log resource bottleneck $\rightarrow$ `admin_resource_logs`.
- **Step 2 (Critical Care)**: Sepsis surge. Log bundle compliance $\rightarrow$ la-Surgical logic for sepsis logs.
- **Step 3 (Diagnostics)**: Rapid molecular screening for sepsis. Log PCR $\rightarrow$ `diag_molecular_logs`.
- **Verification**: Verify that the "Operational Crisis" alert in Admin triggers a priority resource allocation for the Sepsis bundle in ICU.
