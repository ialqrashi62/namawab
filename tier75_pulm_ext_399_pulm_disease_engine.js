// filepath: tier75_pulm_ext_399_pulm_disease_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function copd_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gold_stage, 'gs');
  ensureNum(req.fev1_pct_predicted, 'fpp');
  ensureEnum(req.risk_category, 'rc', ['groupA','groupB','groupC','groupD','group_a','group_b','group_c','group_d','low','medium','high','unknown','other']);
  ensureNum(req.symptom_score_cat, 'ssc');
  ensureNum(req.exacerbation_count_year, 'ecy');
  ensureStr(req.comorbidities, 'com');
  ensureNum(req.medication_adherence, 'ma');
  ensureBool(req.inhaler_technique_adequate, 'ita');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { gs: req.gold_stage };
}
function asthma_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.classification_id, 'cid');
  ensureEnum(req.severity, 'sev', ['intermittent','mild_persistent','moderate_persistent','severe_persistent','mild','moderate','severe','unknown','other']);
  ensureNum(req.act_score, 'act');
  ensureEnum(req.control_level, 'cl', ['well_controlled','not_well_controlled','very_poorly_controlled','other','unknown']);
  ensureStr(req.comorbidities, 'com');
  ensureBool(req.trigger_identification_complete, 'tic');
  ensureNum(req.controller_med_adherence, 'cma');
  ensureNum(req.step_therapy_level, 'stl');
  ensureBool(req.biologic_therapies_considered, 'btc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_action_plan_revision, 'napr');
  return { act: req.act_score };
}
function interstitial_lung_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.pattern, 'pat', ['usual_interstitial_pneumonia','nonspecific_interstitial_pneumonia','cryptogenic_organizing_pneumonia','lymphocytic_interstitial_pneumonia','desquamative_interstitial_pneumonia','respiratory_bronchiolitis','hypersensitivity_pneumonitis','sarcoidosis','pulmonary_langerhans','lymphangioleiomyomatosis','unclassifiable','other']);
  ensureNum(req.fvc_pct_predicted, 'fpp');
  ensureNum(req.dlco_pct_predicted, 'dpp');
  ensureStr(req.imaging_findings, 'if');
  ensureEnum(req.oxygen_requirement, 'or', ['none','exertion_only','continuous','sleep_only','nocturnal_and_exertion','continuous_high_flow','unknown','other']);
  ensureEnum(req.disease_severity, 'ds', ['mild','moderate','severe','very_severe','unknown','other']);
  ensureStr(req.treatment_started, 'ts');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureBool(req.lung_transplant_referred, 'ltr');
  return { pat: req.pattern };
}
function pulmonary_hypertension_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.who_functional_class, 'wfc');
  ensureNum(req.pulmonary_artery_pressure, 'pap');
  ensureNum(req.pvr, 'pvr');
  ensureNum(req.pcwp, 'pcwp');
  ensureNum(req.cardiac_output, 'co');
  ensureNum(req.six_minute_walk_distance, 'smwd');
  ensureEnum(req.etiology, 'et', ['idiopathic','heritable','connective_tissue_disease','congenital_heart_disease','portal_hypertension','hiv','drugs_toxin','other']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.risk_stratification, 'rs', ['low','intermediate','high','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pap: req.pulmonary_artery_pressure };
}
function bronchiectasis_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.ct_findings, 'cf');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','very_severe','radiographic_only','unknown','other']);
  ensureNum(req.exacerbation_count_year, 'ecy');
  ensureStr(req.chronic_infections, 'ci');
  ensureNum(req.quality_of_life_score, 'qol');
  ensureStr(req.airway_clearance_therapy, 'act');
  ensureBool(req.inhaled_antibiotic_considered, 'iac');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sev: req.severity };
}

function funcs() { return { copd_assessment, asthma_classification, interstitial_lung_disease, pulmonary_hypertension_eval, bronchiectasis_assessment }; }
module.exports = { funcs, ValidationError };