// filepath: tier29_cardiology_ext_179_echo_engine.js
// TIER29_CARDIOLOGY-179: Echocardiography (TTE, TEE, strain)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function tte_assess(req) {
  ensureStr(req.study_id, 'study_id');
  ensureNumber(req.lvef, 'lvef');
  ensureEnum(req.lv_function, 'lv_function', ['normal','mildly_reduced','moderately_reduced','severely_reduced','hyperdynamic','other']);
  ensureEnum(req.rv_function, 'rv_function', ['normal','mildly_reduced','moderately_reduced','severely_reduced','other']);
  ensureBool(req.regurgitation_significant, 'regurg');
  ensureEnum(req.valve_severity, 'valve_severity', ['none','mild','moderate','severe','other']);
  ensureBool(req.pericardial_effusion, 'pe');
  let status;
  if (req.lvef < 30) status = 'lvef_severely_reduced_advanced_therapy';
  else if (req.valve_severity === 'severe' && req.regurg) status = 'severe_valve_disease_review';
  else if (req.pericardial_effusion) status = 'pericardial_effusion_assess_tamponade';
  else status = 'tte_reviewed';
  return { status, lvef: req.lvef };
}

function strain(req) {
  ensureStr(req.study_id, 'study_id');
  ensureNumber(req.gls, 'gls');
  ensureNumber(req.age, 'age');
  ensureEnum(req.sex, 'sex', ['male','female','other','unknown','other']);
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.cardiac_amyloid_pattern, 'amyloid');
  ensureBool(req.hcm_pattern, 'hcm');
  let status;
  if (req.gls > -16 && req.lvef > 50) status = 'glse_relatively_reduced_subclinical_dysfunction';
  else if (req.amyloid_pattern) status = 'cardiac_amyloid_suspicion_review_pyro';
  else if (req.hcm_pattern) status = 'hcm_pattern_genetic_review';
  else if (req.gls < -16 && req.lvef >= 50) status = 'glse_normal';
  else status = 'strain_reviewed';
  return { status, gls: req.gls };
}

function tee_assess(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.indication, 'indication', ['endocarditis','valve_assessment','la_appendage','aortic_pathology','afib_source','stroke_workup','other']);
  ensureEnum(req.endocarditis, 'endocarditis', ['no','possible','definite','rejected','other']);
  ensureNumber(req.vegetation_size_mm, 'veg');
  ensureNumber(req.ejection_fraction_visual, 'ef');
  ensureBool(req.intracardiac_thrombus, 'thrombus');
  let status;
  if (req.endocarditis === 'definite' && req.vegetation_size_mm > 10) status = 'large_vegetation_surgical_review';
  else if (req.intracardiac_thrombus) status = 'thrombus_anticoagulation_review';
  else status = 'tee_reviewed';
  return { status, ind: req.indication };
}

function pulmonary_htn(req) {
  ensureStr(req.study_id, 'study_id');
  ensureNumber(req.pasp, 'pasp');
  ensureNumber(req.tap, 'tap');
  ensureEnum(req.ph_severity, 'ph_severity', ['none','mild','moderate','severe','other']);
  ensureBool(req.right_ventricular_dilation, 'rv_dil');
  ensureBool(req.d_sign, 'd_sign');
  ensureNumber(req.tr_max_velocity, 'tr_max');
  let status;
  if (req.pasp >= 60) status = 'severe_pulmonary_hypertension_refer';
  else if (req.d_sign) status = 'rv_pressure_overload_review';
  else if (req.tap < 1.7) status = 'tap_low_rv_dysfunction';
  else status = 'pulmonary_htn_reviewed';
  return { status, pasp: req.pasp };
}

function diastolic(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.grade, 'grade', ['normal','grade_1_impaired_relaxation','grade_2_pseudonormal','grade_3_restrictive_reversible','grade_4_restrictive_irreversible','indeterminate','other']);
  ensureNumber(req.e_e_ratio, 'ee');
  ensureNumber(req.la_volume_index, 'lavi');
  ensureNumber(req.tr_max_velocity, 'tr');
  ensureBool(req.pulmonary_veins_reviewed, 'pv');
  let status;
  if (req.grade === 'grade_4_restrictive_irreversible') status = 'restrictive_grade_4_advanced_disease';
  else if (req.grade === 'grade_3_restrictive_reversible') status = 'restrictive_grade_3_optimize';
  else if (req.grade === 'grade_1_impaired_relaxation') status = 'grade_1_appropriate';
  else status = 'diastolic_reviewed';
  return { status, g: req.grade };
}

const CITATIONS = { ASE_2024: 'ASE 2024', ESC_CARDIO_2024: 'ESC Cardio 2024' };

function funcs() { return { tte_assess, strain, tee_assess, pulmonary_htn, diastolic }; }
module.exports = { funcs, CITATIONS, ValidationError };