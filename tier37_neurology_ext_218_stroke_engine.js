// filepath: tier37_neurology_ext_218_stroke_engine.js
// TIER37_NEUROLOGY-218: Stroke
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function stroke_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.nihss, 'nihss');
  ensureNumber(req.onset_min, 'onset');
  ensureEnum(req.occlusion_vessel, 'ves', ['mca','aca','pca','ica','basilar','vertebral','lacunar','multiple','none','other']);
  ensureBool(req.ct_hemorrhage, 'ich');
  ensureEnum(req.classification, 'cls', ['ischemic','hemorrhagic','tia','undetermined','mimic','other']);
  let status;
  if (req.ct_hemorrhage) status = 'hemorrhagic_stroke_reverse_anticoagulation';
  else if (req.classification === 'ischemic' && req.onset_min <= 270 && req.nihss >= 6) status = 'large_vessel_occlusion_thrombectomy_eval';
  else if (req.classification === 'ischemic' && req.onset_min <= 270 && req.nihss < 6) status = 'small_vessel_tpa_evaluate';
  else if (req.classification === 'tia') status = 'tia_evaluate_secondary_prevention';
  else if (req.classification === 'undetermined') status = 'classification_undetermined_further_workup';
  else status = 'stroke_classified_appropriate';
  return { status, cls: req.classification };
}

function tpa_eligibility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.onset_min, 'onset');
  ensureNumber(req.bp_systolic, 'sbp');
  ensureNumber(req.glucose, 'glu');
  ensureBool(req.prior_ich, 'ich');
  ensureEnum(req.anticoagulation, 'ac', ['none','warfarin','doac','heparin','antiplatelet','other']);
  ensureEnum(req.indication, 'ind', ['tpa','tnk','none','thrombectomy_only','other']);
  let status;
  if (req.prior_ich) status = 'tpa_contraindicated_prior_ich';
  else if (req.bp_systolic >= 185 && req.indication !== 'none') status = 'bp_uncontrolled_treat_then_tpa';
  else if (req.onset_min > 270 && req.indication === 'tpa') status = 'onset_too_long_tpa_outside_window';
  else if (req.anticoagulation === 'warfarin' && req.indication === 'tpa') status = 'warfarin_review_inr_tpa';
  else if (req.indication === 'tpa' && req.onset_min <= 270) status = 'tpa_eligible_administer';
  else status = 'tpa_eligibility_review';
  return { status, ind: req.indication };
}

function thrombectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.nihss, 'nihss');
  ensureEnum(req.occlusion, 'occ', ['mca_m1','mca_m2','ica_terminal','ica_m1','basilar','posterior','tandem','none','other']);
  ensureNumber(req.onset_to_puncture_min, 'otp');
  ensureBool(req.successful_reperfusion, 'tic');
  ensureEnum(req.complication, 'comp', ['none','groin_hematoma','intracranial_hemorrhage','distal_emboli','dissection','other']);
  let status;
  if (req.nihss < 6 && req.occlusion !== 'basilar') status = 'thrombectomy_low_nihss_consider';
  else if (req.onset_to_puncture_min > 360 && req.successful_reperfusion) status = 'delayed_puncture_successful_review';
  else if (req.complication === 'intracranial_hemorrhage') status = 'post_thrombectomy_ich_urgent';
  else if (req.successful_reperfusion) status = 'thrombectomy_successful';
  else status = 'thrombectomy_review_appropriate';
  return { status, t: req.successful_reperfusion };
}

function secondary_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.etiology, 'etio', ['large_artery','small_vessel','cardioembolic','cryptogenic','dissection','hypercoagulable','other']);
  ensureEnum(req.antiplatelet, 'ap', ['aspirin','clopidogrel','aspirin_dipyridamole','aspirin_clopidogrel','none','other']);
  ensureEnum(req.statin, 'st', ['high_intensity','moderate_intensity','low_intensity','none','intolerant','other']);
  ensureNumber(req.bp_target, 'bp_target');
  ensureEnum(req.anticoagulation, 'ac', ['warfarin','doac','heparin','none','other']);
  let status;
  if (req.etiology === 'cardioembolic' && req.anticoagulation === 'none') status = 'cardioembolic_doa_c_indicated';
  else if (req.bp_target > 140) status = 'bp_target_too_high_strict';
  else if (req.statin !== 'high_intensity' && req.etiology !== 'cardioembolic') status = 'high_intensity_statin_recommended';
  else if (req.antiplatelet === 'aspirin_clopidogrel' && req.etiology !== 'large_artery') status = 'dual_antiplatelet_short_term_only';
  else status = 'secondary_prevention_appropriate';
  return { status, et: req.etiology };
}

function stroke_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.days_post_stroke, 'days');
  ensureNumber(req.fim_score, 'fim');
  ensureEnum(req.pt_intensity, 'int', ['low','moderate','high','intense','unknown','other']);
  ensureEnum(req.swallow_assessment, 'swal', ['passed','failed','pending','not_indicated','other']);
  ensureEnum(req.discharge_destination, 'dc', ['home','rehab_unit','ltac','snf','hospice','deceased','other']);
  let status;
  if (req.days_post_stroke <= 7 && req.pt_intensity === 'low') status = 'early_stroke_low_intensity_escalate';
  else if (req.swallow_assessment === 'pending' && req.days_post_stroke >= 3) status = 'swallow_assess_complete_allow_diet';
  else if (req.fim_score < 40 && req.discharge_destination === 'home') status = 'low_fim_home_discharge_unsupported';
  else if (req.pt_intensity === 'high' && req.swallow_assessment === 'passed') status = 'stroke_rehab_on_track';
  else status = 'stroke_rehab_review';
  return { status, fim: req.fim_score };
}

function funcs() { return { stroke_classification, tpa_eligibility, thrombectomy, secondary_prevention, stroke_rehab }; }
module.exports = { funcs, ValidationError };