// filepath: tier29_cardiology_ext_178_stress_engine.js
// TIER29_CARDIOLOGY-178: Stress testing (exercise, nuclear, echo stress)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function exercise_stress(req) {
  ensureStr(req.test_id, 'test_id');
  ensureEnum(req.protocol, 'protocol', ['bruce','modified_bruce','naughton','ramp','treadmill','bicycle','other']);
  ensureNumber(req.mets_achieved, 'mets');
  ensureNumber(req.max_hr_achieved, 'max_hr');
  ensureNumber(req.max_hr_predicted, 'predicted');
  ensureBool(req.st_changes, 'st_changes');
  ensureBool(req.chest_pain, 'cp');
  ensureEnum(req.result, 'result', ['negative','positive','equivocal','inconclusive','indeterminate','other']);
  let status;
  if (req.cp && req.st_changes) status = 'positive_stress_terminate_review';
  else if (req.mets_achieved < 5) status = 'low_functional_capacity_high_risk';
  else if (req.max_hr_achieved < req.max_hr_predicted * 0.85) status = 'submaximal_inconclusive_review';
  else if (req.result === 'positive') status = 'positive_stress_review_cath';
  else status = 'stress_test_completed';
  return { status, mets: req.mets_achieved };
}

function nuclear_stress(req) {
  ensureStr(req.test_id, 'test_id');
  ensureEnum(req.tracer, 'tracer', ['sestamibi','thallium','myoview','rubidium','ammonia','other']);
  ensureEnum(req.perfusion, 'perfusion', ['normal','reversible_defect','fixed_defect','mixed','equivocal','other']);
  ensureNumber(req.lvef_stress, 'lvef_s');
  ensureNumber(req.lvef_rest, 'lvef_r');
  ensureNumber(req.ischemic_volume_pct, 'isv');
  ensureEnum(req.risk_strat, 'risk_strat', ['low','intermediate','high','other']);
  let status;
  if (req.perfusion === 'fixed_defect' && req.lvef_stress < 40) status = 'fixed_defect_low_lvef_high_risk';
  else if (req.ischemic_volume_pct > 10) status = 'large_ischemic_burden_cath_review';
  else if (req.risk_strat === 'high') status = 'high_risk_cath_referral';
  else status = 'nuclear_stress_reviewed';
  return { status, perf: req.perfusion };
}

function echo_stress(req) {
  ensureStr(req.test_id, 'test_id');
  ensureNumber(req.lvef_rest, 'lvef_r');
  ensureNumber(req.lvef_stress, 'lvef_s');
  ensureNumber(req.wall_motion_score_index, 'wmsi');
  ensureEnum(req.response, 'response', ['normal','ischemia','scar','mixed','other']);
  ensureBool(req.valvular_significant, 'valv');
  ensureBool(req.pulmonary_hypertension, 'ph');
  let status;
  if (req.response === 'ischemia') status = 'stress_induced_ischemia_review_cath';
  else if (req.lvef_stress < req.lvef_rest - 5) status = 'drop_lvef_cad_review';
  else if (req.wall_motion_score_index > 1.7) status = 'wmci_elevated_significant_cad';
  else status = 'echo_stress_reviewed';
  return { status, resp: req.response };
}

function ct_angio(req) {
  ensureStr(req.study_id, 'study_id');
  ensureNumber(req.calcium_score, 'cac');
  ensureEnum(req.severity, 'severity', ['none','minimal','mild','moderate','severe','other']);
  ensureNumber(req.stenosis_max_pct, 'stenosis');
  ensureBool(req.high_risk_plaque, 'hrp');
  ensureEnum(req.recommendation, 'recommendation', ['routine_follow_up','functional_testing','invasive_angiogram','optimize_medical','other']);
  let status;
  if (req.stenosis_max_pct >= 70) status = 'severe_stenosis_invasive_review';
  else if (req.high_risk_plaque) status = 'high_risk_plaque_optimize_medical';
  else if (req.calcium_score > 400) status = 'high_cac_risk_review';
  else status = 'ct_angio_reviewed';
  return { status, st: req.stenosis_max_pct };
}

function ami_marker(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.troponin_peak, 'tn');
  ensureNumber(req.ck_mb, 'ckmb');
  ensureEnum(req.st_pattern, 'st_pattern', ['stemi_anterior','stemi_inferior','stemi_lateral','stemi_posterior','nstemi','st_depression','t_inversion','normal','lbbb','paced','other']);
  ensureNumber(req.time_since_onset_min, 'tso');
  ensureBool(req.reperfusion_given, 'reper');
  let status;
  if (req.st_pattern === 'stemi_anterior' && !req.reperfusion) status = 'stemi_anterior_pci_immediately';
  else if (req.st_pattern === 'stemi_inferior' && !req.reperfusion) status = 'stemi_inferior_pci_immediately';
  else if (req.st_pattern === 'nstemi') status = 'nstemi_risk_strat_heparin';
  else if (req.troponin_peak > 50) status = 'high_trop_large_infarct_review';
  else status = 'ami_marker_reviewed';
  return { status, tn: req.troponin_peak };
}

const CITATIONS = { ACC_AHA_STRESS_2024: 'ACC/AHA Stress Testing 2024', SCCT_2024: 'SCCT 2024' };

function funcs() { return { exercise_stress, nuclear_stress, echo_stress, ct_angio, ami_marker }; }
module.exports = { funcs, CITATIONS, ValidationError };