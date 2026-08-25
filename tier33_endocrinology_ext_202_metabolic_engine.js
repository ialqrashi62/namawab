// filepath: tier33_endocrinology_ext_202_metabolic_engine.js
// TIER33_ENDOCRINOLOGY-202: Metabolic disorders
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function obesity_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.waist_cm, 'waist');
  ensureEnum(req.comorbidities, 'comorb', ['none','t2dm','htn','dyslipidemia','multiple','other','t2dm_htn','t2dm_dyslipidemia','multiple_comorbid']);
  ensureNumber(req.previous_attempts, 'att');
  ensureBool(req.glp1_agonist, 'glp1');
  ensureBool(req.bariatric_referred, 'bar');
  let status;
  if (req.bmi >= 40 && !req.bariatric_referred) status = 'class_3_obesity_bariatric_refer';
  else if (req.bmi >= 35 && req.comorbidities !== 'none' && !req.bariatric_referred) status = 'class_2_with_comorb_bariatric_refer';
  else if (req.bmi >= 30 && !req.glp1_agonist && req.previous_attempts >= 2) status = 'obesity_with_failures_initiate_glp1';
  else if (req.bmi < 25) status = 'normal_bmi_obesity_management_not_applicable';
  else status = 'obesity_management_appropriate';
  return { status, bmi: req.bmi };
}

function lipid_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.ldl, 'ldl');
  ensureNumber(req.hdl, 'hdl');
  ensureNumber(req.triglycerides, 'tg');
  ensureEnum(req.statin_intensity, 'statin', ['high_intensity','moderate_intensity','low_intensity','none','intolerant','other']);
  ensureEnum(req.cv_risk, 'risk', ['low','moderate','high','very_high','extreme','other']);
  ensureBool(req.pcsk9_consider, 'pcsk9');
  let status;
  if (req.cv_risk === 'very_high' && req.ldl >= 70 && req.statin_intensity !== 'high_intensity') status = 'very_high_risk_escalate_high_intensity';
  else if (req.ldl >= 100 && req.statin_intensity === 'high_intensity' && req.pcsk9_consider) status = 'pcsk9_inhibitor_consider';
  else if (req.triglycerides >= 500) status = 'severe_hypertriglyceridemia_pancreatitis_risk';
  else if (req.ldl < 70 && req.statin_intensity === 'high_intensity') status = 'ldl_at_target_high_risk';
  else status = 'lipid_management_review';
  return { status, ldl: req.ldl };
}

function osteoporosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.t_score, 't');
  ensureEnum(req.fracture_history, 'fhx', ['none','low_trauma','vertebral','hip','multiple','other']);
  ensureNumber(req.vitamin_d, 'vit_d');
  ensureNumber(req.calcium_intake, 'ca');
  ensureBool(req.bisphosphonate_started, 'bisp');
  let status;
  if (req.t_score <= -2.5 && req.fracture_history === 'hip' && !req.bisphosphonate_started) status = 'hip_fracture_osteoporosis_urgent_treatment';
  else if (req.t_score <= -2.5 && !req.bisphosphonate_started) status = 'osteoporosis_start_treatment';
  else if (req.vitamin_d < 20 && req.bisphosphonate_started) status = 'vitamin_d_low_replace_before_bisp';
  else if (req.calcium_intake < 1000) status = 'calcium_intake_low_supplement';
  else if (req.bisphosphonate_started && req.t_score >= -2.5) status = 'osteoporosis_treatment_active';
  else status = 'osteoporosis_review_appropriate';
  return { status, t: req.t_score };
}

function pcos(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.oligomenorrhea, 'oligo');
  ensureBool(req.hyperandrogenism, 'hyper_and');
  ensureBool(req.polycystic_ovaries, 'pco');
  ensureBool(req.metformin_started, 'metformin');
  ensureBool(req.fertility_desire, 'fertility');
  let status;
  if (req.oligomenorrhea && req.hyperandrogenism && !req.metformin_started) status = 'pcos_diagnosed_initiate_metformin';
  else if (req.fertility_desire && !req.metformin_started) status = 'pcos_fertility_metformin_clomid';
  else if (!req.oligomenorrhea && !req.hyperandrogenism && !req.polycystic_ovaries) status = 'rotterdam_not_met_review';
  else if (req.metformin_started && req.fertility_desire) status = 'pcos_metformin_fertility_continue';
  else status = 'pcos_review';
  return { status, f: req.fertility_desire };
}

function gender_dysphoria(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.assigned_sex, 'sx', ['male','female','intersex','other']);
  ensureEnum(req.identified_gender, 'gender', ['male','female','non_binary','other']);
  ensureBool(req.hrt_started, 'hrt');
  ensureBool(req.psych_clearance, 'psych');
  ensureBool(req.follow_up_3_months, 'fup');
  let status;
  if (req.hrt_started && !req.psych_clearance) status = 'hrt_without_psych_clearance_pause';
  else if (!req.hrt_started && req.psych_clearance) status = 'psych_cleared_initiate_hrt';
  else if (req.hrt_started && req.psych_clearance && req.follow_up_3_months) status = 'hrt_active_follow_up';
  else status = 'gender_dysphoria_review';
  return { status, gender: req.identified_gender };
}

function funcs() { return { obesity_management, lipid_management, osteoporosis, pcos, gender_dysphoria }; }
module.exports = { funcs, ValidationError };