// filepath: tier33_endocrinology_ext_201_pituitary_engine.js
// TIER33_ENDOCRINOLOGY-201: Pituitary disorders
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pituitary_adenoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.tumor_size_mm, 'size');
  ensureBool(req.functional, 'functional');
  ensureEnum(req.hormonal_workup, 'workup', ['non_functional','prolactinoma','acromegaly','cushing','tsh_secreting','mixed','other']);
  ensureBool(req.vision_defect, 'vision');
  ensureEnum(req.follow_up, 'fup', ['3_month','6_month','12_month','observation','surgery_referred','other','6_months','12_months']);
  let status;
  if (req.tumor_size_mm >= 10 && req.vision_defect) status = 'macro_with_vision_defect_surgery_refer';
  else if (req.tumor_size_mm >= 10 && req.functional) status = 'macro_functional_surgery_medical';
  else if (req.functional && req.workup === 'prolactinoma' && req.tumor_size_mm < 10) status = 'microprolactinoma_dopamine_agonist';
  else if (!req.functional && req.tumor_size_mm < 10) status = 'non_functional_microadenoma_follow';
  else status = 'pituitary_adenoma_review';
  return { status, size: req.tumor_size_mm };
}

function prolactinoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.prolactin, 'prl');
  ensureNumber(req.tumor_size_mm, 'size');
  ensureEnum(req.dopamine_agonist, 'da', ['cabergoline','bromocriptine','none','other']);
  ensureEnum(req.response, 'resp', ['normalized','partial','poor','resistant','unknown']);
  ensureEnum(req.side_effects, 'se', ['none','nausea','orthostasis','valvular','psychiatric','other']);
  let status;
  if (req.response === 'resistant' && req.dopamine_agonist === 'cabergoline') status = 'cabergoline_resistant_surgery_refer';
  else if (req.response === 'normalized' && req.side_effects === 'none') status = 'prolactin_normalized_maintain';
  else if (req.response === 'poor' && req.dopamine_agonist === 'bromocriptine') status = 'bromocriptine_poor_switch_cabergoline';
  else if (req.dopamine_agonist === 'none' && req.prolactin > 200) status = 'macroprolactinoma_initiate_medical';
  else status = 'prolactinoma_review';
  return { status, prl: req.prolactin };
}

function acromegaly(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.igf1, 'igf1');
  ensureNumber(req.gh_after_ogtt, 'gh');
  ensureNumber(req.tumor_size_mm, 'size');
  ensureEnum(req.treatment, 'rx', ['transsphenoidal_surgery','medical_observation','somatostatin_analog','pegvisomant','combination','other']);
  ensureEnum(req.response, 'resp', ['biochemical_control','partial','persistent','unknown']);
  let status;
  if (req.treatment === 'transsphenoidal_surgery' && req.response === 'persistent' && req.tumor_size_mm >= 10) status = 'persistent_acromegaly_medical_add';
  else if (req.response === 'biochemical_control') status = 'biochemical_control_maintain_follow';
  else if (req.gh_after_ogtt >= 1 && req.response === 'persistent') status = 'gh_not_suppressed_active_disease';
  else status = 'acromegaly_review';
  return { status, resp: req.response };
}

function diabetes_insipidus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.urine_output_ml_day, 'urine');
  ensureNumber(req.sodium, 'na');
  ensureNumber(req.plasma_osmolality, 'posm');
  ensureEnum(req.water_deprivation_test, 'wdt', ['positive','negative','partial','inconclusive','not_done']);
  ensureBool(req.desmopressin_response, 'dda_vp');
  let status;
  if (req.water_deprivation_test === 'positive' && req.desmopressin_response) status = 'central_di_initiate_desmopressin';
  else if (req.water_deprivation_test === 'positive' && !req.desmopressin_response) status = 'nephrogenic_di_thiazide_indomethacin';
  else if (req.urine_output_ml_day < 3000 && req.water_deprivation_test === 'negative') status = 'polyuria_not_di_review';
  else if (req.sodium > 150 && req.plasma_osmolality > 295) status = 'severe_hypernatremia_admit';
  else status = 'di_review_appropriate';
  return { status, u: req.urine_output_ml_day };
}

function pituitary_apoplexy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.presentation, 'pres', ['acute_headache_visual_loss','incidental_findings','subclinical','hypopituitarism_only','other']);
  ensureEnum(req.hormonal_deficit, 'def', ['none','panhypopituitarism','partial','secondary_adrenal','secondary_hypothyroid','multiple','other']);
  ensureEnum(req.imaging, 'img', ['hemorrhage','infarction','both','unknown','other']);
  ensureEnum(req.treatment, 'rx', ['emergency_surgery','urgent_surgery','conservative','observation','other']);
  let status;
  if (req.presentation === 'acute_headache_visual_loss' && req.hormonal_deficit === 'panhypopituitarism') status = 'classical_apoplexy_emergency_surgery';
  else if (req.treatment === 'emergency_surgery' && req.hormonal_deficit === 'panhypopituitarism') status = 'apoplexy_surgery_glucocorticoid_replacement';
  else if (req.presentation === 'subclinical' && req.treatment === 'observation') status = 'subclinical_apoplexy_observation_appropriate';
  else status = 'apoplexy_review';
  return { status, pres: req.presentation };
}

function funcs() { return { pituitary_adenoma, prolactinoma, acromegaly, diabetes_insipidus, pituitary_apoplexy }; }
module.exports = { funcs, ValidationError };