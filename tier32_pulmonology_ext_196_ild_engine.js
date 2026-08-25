// filepath: tier32_pulmonology_ext_196_ild_engine.js
// TIER32_PULMONOLOGY-196: Interstitial lung disease
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ild_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ild_pattern, 'pattern', ['uip','nsip','organizing_pneumonia','lymphocytic_interstitial','hypersensitivity','sarcoidosis','drug_induced','ip','other']);
  ensureEnum(req.ct_findings, 'ct', ['honeycombing','traction_bronchiectasis','ground_glass','reticulation','consolidation','mixed','other']);
  ensureBool(req.biopsy_done, 'bx');
  ensureEnum(req.etiology, 'etio', ['ip','connective_tissue','drug','occupational','hypersensitivity','sarcoidosis','familial','idiopathic','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','end_stage','other']);
  let status;
  if (req.ild_pattern === 'uip' && req.ct_findings === 'honeycombing' && !req.biopsy_done) status = 'uip_with_honeycombing_radiologic_dx';
  else if (req.severity === 'severe' && req.etiology === 'ip') status = 'severe_ip_refer_transplant';
  else if (!req.biopsy_done && req.severity === 'moderate') status = 'biopsy_refer_for_diagnosis';
  else status = 'ild_classified_appropriate';
  return { status, pattern: req.ild_pattern };
}

function ild_progression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.fvc_baseline, 'fvc_b');
  ensureNumber(req.fvc_current, 'fvc_c');
  ensureNumber(req.fvc_decline_pct, 'decline');
  ensureNumber(req.follow_up_months, 'fup_m');
  ensureEnum(req.progression, 'prog', ['stable','declining','rapidly_progressive','improving','unknown']);
  let status;
  if (req.progression === 'rapidly_progressive') status = 'rapid_progression_expedite_transplant';
  else if (req.fvc_decline_pct >= 10) status = 'fvc_decline_significant_antifibrotic_escalate';
  else if (req.fvc_decline_pct < 10 && req.progression === 'declining') status = 'mild_declining_continue_antifibrotic';
  else if (req.progression === 'stable') status = 'ild_stable_continue_monitoring';
  else status = 'ild_progression_review';
  return { status, decline: req.fvc_decline_pct };
}

function antifibrotic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.drug, 'drug', ['nintedanib','pirfenidone','nintedanib_pirfenidone_switch','none','other']);
  ensureNumber(req.fvc_pct, 'fvc');
  ensureEnum(req.tolerance, 'tol', ['excellent','good','fair','poor','discontinued']);
  ensureEnum(req.side_effects, 'se', ['none','mild_diarrhea','moderate_diarrhea','severe_diarrhea','liver_elevation','nausea','photosensitivity','multiple','other']);
  ensureEnum(req.response, 'resp', ['stable','improved','declining','unknown']);
  let status;
  if (req.side_effects === 'severe_diarrhea' && req.tolerance !== 'discontinued') status = 'severe_diarrhea_dose_reduce_review';
  else if (req.tolerance === 'poor') status = 'antifibrotic_poor_tolerance_consider_switch';
  else if (req.drug === 'nintedanib' && req.response === 'declining') status = 'declining_on_nintedanib_expedite_transplant';
  else if (req.tolerance === 'discontinued') status = 'antifibrotic_discontinued_review_alternative';
  else if (req.drug === 'nintedanib' && req.response === 'stable') status = 'antifibrotic_response_favorable';
  else status = 'antifibrotic_review_appropriate';
  return { status, drug: req.drug };
}

function oxygen_ild(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.rest_spo2, 'spo2_r');
  ensureNumber(req.exercise_spo2, 'spo2_e');
  ensureNumber(req.oxygen_at_rest_l, 'o2_r');
  ensureNumber(req.oxygen_during_exercise_l, 'o2_e');
  ensureNumber(req.oxygen_hours_per_day, 'hrs');
  let status;
  if (req.rest_spo2 < 88 && req.oxygen_at_rest_l < 2) status = 'rest_hypoxemia_increase_oxygen';
  else if (req.exercise_spo2 < 88 && req.oxygen_during_exercise_l < 3) status = 'exercise_desaturation_increase_oxygen';
  else if (req.oxygen_hours_per_day < 15 && req.rest_spo2 < 88) status = 'ltot_inadequate_extend_duration';
  else if (req.oxygen_hours_per_day >= 15) status = 'ltot_adequate';
  else status = 'oxygen_ild_review';
  return { status, hrs: req.oxygen_hours_per_day };
}

function lung_transplant_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.fvc_pct, 'fvc');
  ensureNumber(req.dlco_pct, 'dlco');
  ensureBool(req.transplant_referred, 'referred');
  ensureEnum(req.evaluation_status, 'status', ['not_started','in_progress','listed','declined','other']);
  ensureNumber(req.six_min_walk, 'walk');
  let status;
  if (req.age > 70 && req.fvc_pct < 50) status = 'age_advanced_ild_transplant_review_criteria';
  else if (req.dlco_pct < 40 && !req.transplant_referred) status = 'low_dlco_refer_transplant';
  else if (!req.transplant_referred && req.fvc_pct < 50) status = 'advanced_ild_refer_transplant';
  else if (req.evaluation_status === 'listed') status = 'transplant_listed_continue';
  else status = 'transplant_eval_review';
  return { status, status: req.evaluation_status };
}

function funcs() { return { ild_classification, ild_progression, antifibrotic_therapy, oxygen_ild, lung_transplant_eval }; }
module.exports = { funcs, ValidationError };