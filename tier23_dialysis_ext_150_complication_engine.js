// filepath: tier23_dialysis_ext_150_complication_engine.js
// TIER23_DIALYSIS-150: Dialysis complications (hypotension, cramps, arrhythmia)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hypotension(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.sbp_drop, 'sbp_drop');
  ensureNumber(req.sbp_nadir, 'sbp_nadir');
  ensureBool(req.symptoms_present, 'symptoms');
  ensureEnum(req.timing, 'timing', ['early_first_hour','mid_session','late_session','post_session','other']);
  ensureNumber(req.uf_rate_ml_kg_h, 'uf_rate');
  ensureBool(req.intervention_required, 'intervention');
  let status;
  if (req.sbp_nadir < 80) status = 'severe_hypotension_stop_uf_saline_bolus';
  else if (req.symptoms_present && req.uf_rate_ml_kg_h > 13) status = 'symptomatic_reduce_uf_rate';
  else if (req.sbp_drop > 30) status = 'significant_drop_consider_dry_weight';
  else status = 'mild_hypotension_monitor';
  return { status, nadir: req.sbp_nadir };
}

function arrhythmia(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.arrhythmia_type, 'arrhythmia_type', ['afib_rvr','afib_slow','svt','vt_nonsustained','vf','bradycardia','asystole','paced','other']);
  ensureNumber(req.duration_sec, 'duration');
  ensureBool(req.hemodynamic_compromise, 'compromise');
  ensureNumber(req.potassium_pre, 'k');
  ensureNumber(req.calcium_pre, 'ca');
  ensureBool(req.electrolyte_review_needed, 'review');
  let status;
  if (req.arrhythmia_type === 'vf' || req.arrhythmia_type === 'asystole') status = 'cardiac_arrest_acls_protocol';
  else if (req.hemodynamic_compromise) status = 'hemodynamic_compromise_urgent_intervention';
  else if (req.potassium_pre > 6.5 || req.potassium_pre < 3.0) status = 'electrolyte_abnormality_review_dialysate';
  else status = 'arrhythmia_observed_monitor';
  return { status, type: req.arrhythmia_type };
}

function cramping(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.location, 'location', ['calf','foot','hand','abdominal','generalized','other']);
  ensureNumber(req.severity, 'severity');
  ensureNumber(req.uf_volume_l, 'uf');
  ensureNumber(req.pre_weight_kg, 'pre_w');
  ensureBool(req.responded_to_saline, 'responded');
  let status;
  const uf_pct = (req.uf_volume_l / req.pre_weight_kg) * 100;
  if (req.severity >= 7) status = 'severe_cramping_stop_uf_saline';
  else if (uf_pct > 5) status = 'excessive_uf_reduce_target_weight';
  else if (!req.responded_to_saline) status = 'no_response_consider_other_causes';
  else status = 'mild_cramping_monitor';
  return { status, severity: req.severity };
}

function disequilibrium(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.bnp_pre, 'bnp_pre');
  ensureBool(req.first_dialysis, 'first');
  ensureNumber(req.pre_urea, 'pre_urea');
  ensureEnum(req.symptoms, 'symptoms', ['headache','nausea','vomiting','confusion','seizure','coma','restlessness','other']);
  ensureNumber(req.urea_reduction_ratio_pct, 'urr');
  let status;
  if (req.symptoms === 'seizure' || req.symptoms === 'coma') status = 'severe_disequilibrium_emergency';
  else if (req.first_dialysis && req.urea_reduction_ratio_pct > 40) status = 'rapid_reduction_first_dx_slower_urea_clearance';
  else if (req.urea_reduction_ratio_pct > 50 && req.symptoms !== 'restlessness' && req.symptoms !== 'other') status = 'significant_reduction_slower_needed';
  else status = 'mild_disequilibrium_manage_conservatively';
  return { status, symptoms: req.symptoms };
}

function air_embolism(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.air_volume_ml, 'volume');
  ensureBool(req.cns_symptoms, 'cns');
  ensureBool(req.cardiovascular_collapse, 'cv_collapse');
  ensureNumber(req.detection_time_sec, 'detection');
  ensureBool(req.trendelenburg_positioned, 'trendelenburg');
  let status;
  if (req.cardiovascular_collapse || req.cns_symptoms) status = 'air_embolism_emergency_trendelenburg_aspiration';
  else if (req.air_volume_ml > 50) status = 'significant_volume_aspiration_high_flow';
  else if (req.detection_time_sec > 60) status = 'delayed_detection_monitor_only';
  else status = 'air_detected_aspiration_protocol';
  return { status, volume: req.air_volume_ml };
}

const CITATIONS = { KDOQI_2024: 'KDOQI 2024 Complications', AHA_HD_2024: 'AHA Hemodialysis 2024' };

function funcs() { return { hypotension, arrhythmia, cramping, disequilibrium, air_embolism }; }
module.exports = { funcs, CITATIONS, ValidationError };