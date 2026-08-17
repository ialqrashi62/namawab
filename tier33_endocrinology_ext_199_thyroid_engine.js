// filepath: tier33_endocrinology_ext_199_thyroid_engine.js
// TIER33_ENDOCRINOLOGY-199: Thyroid disorders
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function thyroid_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.free_t4, 'ft4');
  ensureNumber(req.free_t3, 'ft3');
  ensureEnum(req.pattern, 'pat', ['overt_hyperthyroidism','subclinical_hyperthyroidism','overt_hypothyroidism','subclinical_hypothyroidism','euthyroid','sick_euthyroid','central_hypothyroid','other']);
  ensureEnum(req.antibody_tpo, 'tpo', ['positive','negative','not_done','unknown']);
  let status;
  if (req.pattern === 'overt_hyperthyroidism' && req.antibody_tpo === 'positive') status = 'hashimoto_or_graves_diff_review';
  else if (req.pattern === 'overt_hyperthyroidism') status = 'overt_hyperthyroidism_treat';
  else if (req.pattern === 'overt_hypothyroidism') status = 'overt_hypothyroidism_levothyroxine';
  else if (req.pattern === 'subclinical_hyperthyroidism' && req.tsh < 0.1) status = 'subclinical_hyper_low_treat_consider';
  else if (req.pattern === 'subclinical_hypothyroidism' && req.tsh > 10) status = 'subclinical_high_treat';
  else status = 'thyroid_function_review';
  return { status, pat: req.pattern };
}

function thyroid_nodule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.nodule_size_cm, 'size');
  ensureEnum(req.tirads, 'tirads', ['tr1','tr2','tr3','tr4','tr5','other']);
  ensureNumber(req.tsh, 'tsh');
  ensureBool(req.biopsy_indicated, 'bx');
  ensureEnum(req.biopsy_result, 'bx_res', ['benign','malignant','suspicious_follicular','unsatisfactory','indeterminate','not_done','other']);
  let status;
  if (req.biopsy_result === 'malignant') status = 'malignant_refer_surgery';
  else if (req.biopsy_result === 'suspicious_follicular') status = 'suspicious_follicular_lobectomy';
  else if (req.tirads === 'tr5' && !req.biopsy_indicated) status = 'tr5_biopsy_indicated_refer';
  else if (req.biopsy_result === 'benign') status = 'benign_folow_up';
  else status = 'thyroid_nodule_review';
  return { status, size: req.nodule_size_cm };
}

function hyperthyroid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.etiology, 'etio', ['graves','toxic_multinodular','toxic_adenoma','thyroiditis','iodine_induced','exogenous','other']);
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.t4, 't4');
  ensureEnum(req.treatment, 'rx', ['methimazole','ptu','radioiodine','surgery','observation','beta_blocker','combination','other']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','euthyroid','hypothyroid','unknown']);
  ensureNumber(req.duration_months, 'months');
  let status;
  if (req.treatment === 'methimazole' && req.duration_months > 18 && req.response !== 'euthyroid') status = 'long_term_ati_review_radioiodine';
  else if (req.treatment === 'ptu' && req.duration_months > 12) status = 'ptu_long_term_review_hepatotoxicity';
  else if (req.response === 'worsening') status = 'worsening_reassess_treatment';
  else if (req.response === 'euthyroid' && req.treatment === 'methimazole') status = 'hyperthyroid_euthyroid_maintain';
  else status = 'hyperthyroid_review_appropriate';
  return { status, et: req.etiology };
}

function hypothyroid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.free_t4, 'ft4');
  ensureEnum(req.etiology, 'etio', ['hashimoto','iatrogenic','thyroidectomy','radioiodine','secondary','congenital','other']);
  ensureNumber(req.levothyroxine_dose, 'lt4');
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor']);
  ensureBool(req.recheck_6_weeks, 'recheck');
  let status;
  if (req.adherence === 'poor') status = 'adherence_poor_education_review';
  else if (req.tsh > 10 && req.free_t4 < 0.7) status = 'uncontrolled_overt_review_dose';
  else if (req.tsh >= 0.5 && req.tsh <= 2.5) status = 'at_target_maintain';
  else if (req.tsh > 4.5) status = 'tsh_above_target_dose_adjust';
  else status = 'hypothyroid_review';
  return { status, tsh: req.tsh };
}

function thyroid_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cancer_type, 'type', ['papillary','follicular','medullary','anaplastic','lymphoma','other']);
  ensureEnum(req.stage, 'stage', ['t1n0m0','t2n0m0','t3n0m0','t1n1m0','t2n1m0','t3n1m0','t4_any_n_any_m','any_t_any_n_m1','other']);
  ensureBool(req.surgery_done, 'sx');
  ensureBool(req.rai_needed, 'rai');
  ensureNumber(req.thyroglobulin, 'tg');
  ensureEnum(req.monitoring, 'mon', ['3_month','6_month','annual','observation','active_surveillance','other']);
  let status;
  if (req.cancer_type === 'anaplastic') status = 'anaplastic_urgent_multidisciplinary';
  else if (req.stage === 'any_t_any_n_m1') status = 'metastatic_thyroid_cancer_systemic';
  else if (req.rai_needed && !req.surgery_done) status = 'rai_pre_surgery_refer';
  else if (req.cancer_type === 'papillary' && req.tg > 10) status = 'elevated_tg_recurrence_review';
  else if (req.stage === 't1n0m0' && req.tg < 1 && req.monitoring === 'annual') status = 'low_risk_annual_monitoring';
  else status = 'thyroid_cancer_review';
  return { status, type: req.cancer_type };
}

function funcs() { return { thyroid_function, thyroid_nodule, hyperthyroid, hypothyroid, thyroid_cancer }; }
module.exports = { funcs, ValidationError };