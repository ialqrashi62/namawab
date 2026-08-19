// filepath: tier73_cardio_ext_384_cardio_imaging_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echo_complete(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ef_pct, 'ef');
  ensureStr(req.wall_motion_abnormalities, 'wma');
  ensureStr(req.valve_heart_disease, 'vhd');
  ensureBool(req.diastolic_dysfunction, 'dd');
  ensureNum(req.pulmonary_pressure, 'ppr');
  ensureEnum(req.imaging_quality, 'iq', ['adequate','excellent','good','limited','suboptimal','non_diagnostic','requires_repeat']);
  ensureBool(req.contrast_used, 'cu');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.sonographer, 'sono');
  ensureStr(req.reading_physician, 'rp');
  return { ef: req.ef_pct };
}
function stress_echo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.protocols, 'prot', ['dobutamine','exercise_treadmill','exercise_supine','exercise_bike','vasodilator','pacing','handgrip','cold_pressor','contrast','dobutamine_contrast','combined','other']);
  ensureNum(req.baseline_ef_pct, 'bef');
  ensureNum(req.peak_ef_pct, 'pef');
  ensureStr(req.wall_motion_at_peak, 'wmap');
  ensureBool(req.ischemia_detected, 'id');
  ensureEnum(req.reason_stopped, 'rs', ['target_heart_rate','symptom_limitation','arrhythmia','severe_hypotension','severe_hypertension','patient_request','protocol_complete','iv_access_lost','complications','other']);
  ensureEnum(req.complications, 'comp', ['none','chest_pain','palpitations','hypotension','arrhythmia','vomiting','syncope','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.sonographer, 'sono');
  ensureStr(req.reading_physician, 'rp');
  return { baseline_ef: req.baseline_ef_pct };
}
function stress_nuclear(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.tracer, 'tr', ['technetium_99m','thallium_201','sestamibi','tetrofosmin','rubidium_82','ammonia_n13','fdg','other']);
  ensureEnum(req.protocol, 'prot', ['exercise','pharmacologic','combined','rest_only','stress_only','dual_isotope','standard','modified','other']);
  ensureNum(req.risk_score, 'rs');
  ensureNum(req.summed_diff_score, 'sds');
  ensureEnum(req.ischemia_extent, 'ie', ['none','minimal','mild','moderate','severe','wide_spread','small','massive','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureBool(req.lung_uptake, 'lu');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.complications, 'comp', ['none','chest_pain','arrhythmia','hypotension','dyspnea','flushing','headache','nausea','other']);
  ensureStr(req.reading_physician, 'rp');
  ensureBool(req.return_baseline, 'rb');
  return { sds: req.summed_diff_score };
}
function ct_angiography_coronary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.agatston_score, 'as');
  ensureNum(req.cad_rads_category, 'crc');
  ensureNum(req.lesion_count, 'lc');
  ensureEnum(req.lesion_severity, 'ls', ['none','minimal','1_25','25_50','50_70','70_90','90_99','100','multiple','other']);
  ensureBool(req.high_risk_plaque, 'hrp');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.reader_confidence, 'rc', ['high','moderate','low','inconclusive','non_diagnostic','other']);
  ensureNum(req.dose_msv, 'dose');
  ensureNum(req.contrast_volume_ml, 'cvm');
  ensureStr(req.reading_physician, 'rp');
  return { cad_rads: req.cad_rads_category };
}
function cardiac_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['myocarditis','icarditis','viability','congenital','pericardial_disease','mass','cardiomyopathy','stress_cmr','iron_overload','fabry','amyloid','sarcoid','shone_complex','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureBool(req.late_gad_enhancement_present, 'lgep');
  ensureEnum(req.lge_pattern, 'lp', ['none','subepicardial','midwall','transmural','subendocardial','focal','diffuse','septal','lateral','anterior','inferior','right_ventricular','other']);
  ensureBool(req.t1_mapping_abnormal, 't1m');
  ensureBool(req.t2_mapping_abnormal, 't2m');
  ensureBool(req.edema_present, 'ep');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.reading_physician, 'rp');
  ensureEnum(req.study_quality, 'sq', ['adequate','excellent','good','limited','suboptimal','non_diagnostic','requires_repeat']);
  return { ef: req.ef_pct };
}

function funcs() { return { echo_complete, stress_echo, stress_nuclear, ct_angiography_coronary, cardiac_mri }; }
module.exports = { funcs, ValidationError };