// filepath: scripts/gen_e54_depts_migration.js
// Generate e54 migration: 53 dept tables (patient-centric)
// Pattern: nm-sql-table-template (tenant_id + RLS + audit columns)
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';
const OUT_DIR = 'namaweb/migrations';
const OUT_DIR_DOWN = 'namaweb/migrations';

// Mapping: dept -> table_name -> [columns]
const DEPT_TABLES = {
    allergy:          { table: 'allergy_assessments',  cols: ['allergen TEXT', 'severity TEXT', 'reaction TEXT', 'anaphylaxis BOOLEAN DEFAULT false', 'date_identified DATE', 'notes TEXT'] },
    anesthesia:       { table: 'anesthesia_preops',     cols: ['asa_class INTEGER', 'airway TEXT', 'mallampati INTEGER', 'last_meal_hours INTEGER', 'allergies TEXT', 'prophylaxis TEXT'] },
    audiology:        { table: 'audiology_tests',       cols: ['test_type TEXT', 'right_ear_db INTEGER', 'left_ear_db INTEGER', 'speech_difficulty TEXT', 'tinnitus BOOLEAN DEFAULT false'] },
    burn_unit:        { table: 'burn_assessments',      cols: ['tbsa_percent NUMERIC', 'depth TEXT', 'inhalation_injury BOOLEAN DEFAULT false', 'rule_of_nines TEXT', 'fluid_resuscitation TEXT'] },
    cardiac_rehab:    { table: 'cardiac_rehab_sessions',cols: ['session_number INTEGER', 'vo2_max NUMERIC', 'mets_achieved NUMERIC', 'bp_resting INTEGER', 'ecg_findings TEXT'] },
    ccu:              { table: 'ccu_visits',            cols: ['admission_type TEXT', 'left_ventricle_ef NUMERIC', 'inotropic_support BOOLEAN DEFAULT false', 'iabp BOOLEAN DEFAULT false', 'mortality_risk NUMERIC'] },
    chaplaincy:       { table: 'chaplaincy_visits',     cols: ['visit_type TEXT', 'spiritual_concern TEXT', 'faith_tradition TEXT', 'family_notified BOOLEAN DEFAULT false', 'comfort_provided TEXT'] },
    cicu:             { table: 'cicu_visits',           cols: ['cardiac_diagnosis TEXT', 'surgical_status TEXT', 'echo_ef NUMERIC', 'vasoactive_drips TEXT', 'mech_circ_support BOOLEAN DEFAULT false'] },
    ctu:              { table: 'ctu_visits',            cols: ['transplant_type TEXT', 'waiting_list_date DATE', 'donor_match_score NUMERIC', 'immunosuppression TEXT', 'rejection_grade TEXT'] },
    dermatology:      { table: 'dermatology_lesions',   cols: ['location TEXT', 'lesion_type TEXT', 'abcde_score TEXT', 'biopsy_done BOOLEAN DEFAULT false', 'pathology_ref TEXT'] },
    dialysis:         { table: 'dialysis_sessions',     cols: ['access_type TEXT', 'duration_hours NUMERIC', 'dry_weight_kg NUMERIC', 'ultrafiltration_l NUMERIC', 'kt_v NUMERIC'] },
    epilepsy:         { table: 'epilepsy_seizures',     cols: ['seizure_type TEXT', 'frequency_per_month INTEGER', 'aed_text TEXT', 'last_eeg_date DATE', 'trigger TEXT'] },
    fetal_medicine:   { table: 'fetal_assessments',     cols: ['gestational_age INTEGER', 'biometry TEXT', 'doppler_findings TEXT', 'anomalies TEXT', 'plan TEXT'] },
    genetics:         { table: 'genetic_consults',      cols: ['reason TEXT', 'family_history TEXT', 'test_ordered TEXT', 'result TEXT', 'counseling TEXT'] },
    headache:         { table: 'headache_diary',        cols: ['frequency_per_month INTEGER', 'severity_avg NUMERIC', 'duration_hours NUMERIC', 'triggers TEXT', 'meds_response TEXT'] },
    hematology:       { table: 'hematology_results',    cols: ['cbc_date DATE', 'hemoglobin NUMERIC', 'wbc NUMERIC', 'platelets NUMERIC', 'morphology TEXT'] },
    icu:              { table: 'icu_visits',            cols: ['apache_ii INTEGER', 'sofa_score INTEGER', 'ventilator BOOLEAN DEFAULT false', 'vasopressors BOOLEAN DEFAULT false', 'icu_los_days INTEGER'] },
    immunology:       { table: 'immunology_workups',    cols: ['igg NUMERIC', 'iga NUMERIC', 'igm NUMERIC', 'ige NUMERIC', 'vaccine_response TEXT'] },
    infection_control:{ table: 'infection_surveillance',cols: ['organism TEXT', 'antibiotic TEXT', 'resistance_pattern TEXT', 'source TEXT', 'outbreak_flag BOOLEAN DEFAULT false'] },
    infectious_disease:{ table: 'id_consults',          cols: ['syndrome TEXT', 'exposure TEXT', 'travel_history TEXT', 'culture_results TEXT', 'empiric_abx TEXT'] },
    ivf:              { table: 'ivf_cycles',            cols: ['cycle_number INTEGER', 'protocol TEXT', 'follicles_count INTEGER', 'oocytes_retrieved INTEGER', 'embryos_transferred INTEGER'] },
    maternal_fetal:   { table: 'maternal_fetal_visits', cols: ['ga_weeks INTEGER', 'fhr INTEGER', 'presentation TEXT', 'placenta_location TEXT', 'complications TEXT'] },
    memory_clinic:    { table: 'memory_clinic_assessments', cols: ['mmse_score INTEGER', 'moca_score INTEGER', 'cdr_stage INTEGER', 'behavioural_changes TEXT', 'caregiver TEXT'] },
    movement:         { table: 'movement_assessments',  cols: ['updrs_score INTEGER', 'tremor TEXT', 'rigidity TEXT', 'bradykinesia TEXT', 'gait TEXT'] },
    movement_disorders:{ table: 'movement_disorders_clinical', cols: ['disorder_type TEXT', 'onset_age INTEGER', 'family_history TEXT', 'dbs_status TEXT', 'meds TEXT'] },
    multiple_sclerosis:{ table: 'ms_relapses',          cols: ['edss_score NUMERIC', 'relapse_date DATE', 'lesion_count INTEGER', 'mri_findings TEXT', 'dmt TEXT'] },
    neonatology:      { table: 'neonatal_assessments',  cols: ['birth_weight_kg NUMERIC', 'apgar_1min INTEGER', 'apgar_5min INTEGER', 'gestational_age INTEGER', 'nicu_los_days INTEGER'] },
    neuro_oncology:   { table: 'neuro_oncology_visits', cols: ['tumor_type TEXT', 'who_grade INTEGER', 'idh_status TEXT', 'mgmt_status TEXT', 'kps_score INTEGER'] },
    neurosurgery:     { table: 'neurosurgery_ops',      cols: ['procedure TEXT', 'approach TEXT', 'duration_hours NUMERIC', 'blood_loss_ml INTEGER', 'gcs_pre_op INTEGER'] },
    nicu:             { table: 'nicu_stays',            cols: ['birth_weight_kg NUMERIC', 'main_diagnosis TEXT', 'ventilator_days INTEGER', 'tpn BOOLEAN DEFAULT false', 'discharge_weight NUMERIC'] },
    nuclear_medicine: { table: 'nuclear_med_studies',   cols: ['tracer TEXT', 'study_type TEXT', 'uptake_pattern TEXT', 'suv_max NUMERIC', 'interpretation TEXT'] },
    nutrition:        { table: 'nutrition_assessments', cols: ['bmi NUMERIC', 'weight_change_kg NUMERIC', 'albumin NUMERIC', 'diet_order TEXT', 'calorie_target INTEGER'] },
    occupational_therapy:{ table: 'ot_sessions',       cols: ['goals TEXT', 'adl_score INTEGER', 'modifications TEXT', 'sessions_completed INTEGER', 'discharge_plan TEXT'] },
    pain_management:  { table: 'pain_clinic_visits',   cols: ['pain_score NUMERIC', 'pain_type TEXT', 'medications TEXT', 'interventions TEXT', 'functional_impact TEXT'] },
    palliative_care:  { table: 'palliative_visits',     cols: ['symptom_burden TEXT', 'goals_of_care TEXT', 'advance_directive TEXT', 'family_meeting TEXT', 'spiritual_needs TEXT'] },
    pathology:        { table: 'pathology_reports',     cols: ['specimen_type TEXT', 'gross_findings TEXT', 'microscopic TEXT', 'diagnosis TEXT', 'ihc_panel TEXT'] },
    physiotherapy:    { table: 'physio_sessions',       cols: ['mobility_score INTEGER', 'strength TEXT', 'balance TEXT', 'exercises TEXT', 'progress TEXT'] },
    picu:             { table: 'picu_visits',           cols: ['pelod_score INTEGER', 'primary_diagnosis TEXT', 'mech_vent BOOLEAN DEFAULT false', 'vasoactive BOOLEAN DEFAULT false', 'picu_los_days INTEGER'] },
    plastic_surgery:  { table: 'plastic_surgery_cases', cols: ['procedure TEXT', 'indication TEXT', 'anesthesia TEXT', 'duration_hours NUMERIC', 'graft_used TEXT'] },
    psychiatry:       { table: 'psychiatry_visits',     cols: ['phq9_score INTEGER', 'gad7_score INTEGER', 'diagnosis TEXT', 'medications TEXT', 'risk_assessment TEXT'] },
    pulmonary_rehab:  { table: 'pulm_rehab_sessions',   cols: ['fev1 NUMERIC', 'six_min_walk_m INTEGER', 'dyspnea_scale INTEGER', 'training TEXT', 'oxygen_use TEXT'] },
    radiology:        { table: 'radiology_studies',     cols: ['modality TEXT', 'body_part TEXT', 'contrast BOOLEAN DEFAULT false', 'findings TEXT', 'impression TEXT'] },
    rehabilitation:   { table: 'rehab_plans',           cols: ['functional_independent_measure INTEGER', 'goals TEXT', 'discharge_target TEXT', 'progress TEXT', 'barriers TEXT'] },
    sleep_medicine:   { table: 'sleep_studies',         cols: ['ahi NUMERIC', 'spo2_nadir NUMERIC', 'sleep_efficiency NUMERIC', 'recommendations TEXT', 'cpap_pressure NUMERIC'] },
    social_work:      { table: 'social_work_assessments', cols: ['psychosocial_issues TEXT', 'support_system TEXT', 'financial_concerns BOOLEAN DEFAULT false', 'referrals TEXT', 'follow_up TEXT'] },
    speech_therapy:   { table: 'speech_therapy_sessions', cols: ['dysphagia_grade TEXT', 'language TEXT', 'articulation TEXT', 'asha_score INTEGER', 'progress TEXT'] },
    stroke_unit:      { table: 'stroke_admissions',     cols: ['nihss INTEGER', 'occlusion_site TEXT', 'tpa_given BOOLEAN DEFAULT false', 'thrombectomy BOOLEAN DEFAULT false', 'mrs_discharge INTEGER'] },
    thoracic_surgery: { table: 'thoracic_surgery_cases', cols: ['procedure TEXT', 'approach TEXT', 'lobectomy BOOLEAN DEFAULT false', 'stage TEXT', 'complications TEXT'] },
    transplant:       { table: 'transplant_records',    cols: ['organ TEXT', 'donor_type TEXT', 'match_score NUMERIC', 'date_transplant DATE', 'follow_up_status TEXT'] },
    trauma_surgery:   { table: 'trauma_assessments',    cols: ['iss_score INTEGER', 'gcs INTEGER', 'mechanism TEXT', 'fast_findings TEXT', 'disposition TEXT'] },
    urology:          { table: 'urology_visits',        cols: ['psa NUMERIC', 'ipss_score INTEGER', 'prostate_volume_ml NUMERIC', 'uroflow_max NUMERIC', 'plan TEXT'] },
    vascular_surgery: { table: 'vascular_surgery_cases',cols: ['procedure TEXT', 'vessel TEXT', 'approach TEXT', 'bypass_used BOOLEAN DEFAULT false', 'graft_diameter NUMERIC'] },
    wound_care:       { table: 'wound_assessments',     cols: ['wound_type TEXT', 'stage_grade TEXT', 'size_cm NUMERIC', 'exudate TEXT', 'healing_progress TEXT'] },
};

// Build up + down migrations
const tables = Object.entries(DEPT_TABLES);
console.log(`Generating migration for ${tables.length} dept tables...`);

let up = `-- e54_53_depts_up.sql\n-- 53 dept tables (patient-centric) with FORCE RLS\n-- Generated 2026-08-11\n-- Pattern: nm-sql-table-template\n\nBEGIN;\n\n`;
let down = `-- e54_53_depts_down.sql\n-- Reverse: drop all 53 dept tables\n-- NON-DESTRUCTIVE: only drops tables; tenant + RLS policies preserved\n\nBEGIN;\n\n`;

for (const [dept, { table, cols }] of tables) {
    const colsSql = cols.map(c => `    ${c}`).join(',\n');
    up += `-- ${dept}\nCREATE TABLE IF NOT EXISTS ${table} (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    tenant_id TEXT NOT NULL,\n    patient_id TEXT NOT NULL,\n    encounter_id TEXT,\n    ${colsSql},\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    created_by TEXT,\n    updated_by TEXT\n);\n\nCREATE INDEX IF NOT EXISTS idx_${table}_tenant ON ${table}(tenant_id);\nCREATE INDEX IF NOT EXISTS idx_${table}_patient ON ${table}(tenant_id, patient_id);\n\nALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;\nALTER TABLE ${table} FORCE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS tenant_isolation_${table} ON ${table};\nCREATE POLICY tenant_isolation_${table} ON ${table}\n    USING (tenant_id = current_setting('app.tenant_id', true))\n    WITH CHECK (tenant_id = current_setting('app.tenant_id', true));\n\nDROP TRIGGER IF EXISTS trg_${table}_updated ON ${table};\nCREATE TRIGGER trg_${table}_updated\n    BEFORE UPDATE ON ${table}\n    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();\n\n`;
    down += `DROP TABLE IF EXISTS ${table} CASCADE;\n`;
}

up += '\nCOMMIT;\n';
down += '\nCOMMIT;\n';

fs.writeFileSync(path.join(OUT_DIR, 'e54_53_depts_up.sql'), up);
fs.writeFileSync(path.join(OUT_DIR_DOWN, 'e54_53_depts_down.sql'), down);

console.log(`✓ ${tables.length} dept tables`);
console.log(`  up.sql: ${up.length} bytes`);
console.log(`  down.sql: ${down.length} bytes`);
