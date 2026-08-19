// filepath: tier75_pulm_ext_401_pulm_special_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sleep_study_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureStr(req.reason, 'rsn');
  ensureNum(req.ahi_from_screen, 'afs');
  ensureNum(req.epworth_score, 'es');
  ensureNum(req.bmi, 'bmi');
  ensureStr(req.comorbidities, 'com');
  ensureEnum(req.test_type, 'tt', ['home_sleep_test','attended_polysomnography','unattended_polysomnography','split_night','maintenance_of_wakefulness','multiple_sleep_latency','actigraphy','other']);
  ensureBool(req.interpreter_required, 'ir');
  ensureBool(req.insurance_authorized, 'ia');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { rid: req.referral_id };
}
function oxygen_therapy_setup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.setup_id, 'sid');
  ensureEnum(req.prescription, 'rx', ['continuous_2L','continuous_3L','continuous_4L','continuous_5L','exertion_only','nocturnal_only','as_needed','prn','palliative','high_flow','other']);
  ensureStr(req.equipment, 'eq');
  ensureBool(req.portable_tank_provided, 'ptp');
  ensureNum(req.liter_flow, 'lf');
  ensureNum(req.duration_hours_per_day, 'dhpd');
  ensureNum(req.rest_spo2_target, 'rst');
  ensureNum(req.ambulation_spo2_target, 'ast');
  ensureStr(req.provider, 'pr');
  ensureBool(req.compliance_assessed, 'ca');
  ensureNum(req.next_review, 'nr');
  return { sid: req.setup_id };
}
function cpap_bpap_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.setup_id, 'sid');
  ensureEnum(req.machine_type, 'mt', ['cpap','bipap','auto_cpap','auto_bipap','asv','avaps','other']);
  ensureNum(req.pressure_cm_h2o, 'pch');
  ensureEnum(req.mask_type, 'msk', ['nasal','nasal_pillow','full_face','oral','hybrid','total_face','other']);
  ensureNum(req.compliance_hours_per_night, 'chpn');
  ensureBool(req.mask_fit_optimal, 'mfo');
  ensureBool(req.humidifier_added, 'ha');
  ensureBool(req.side_effects_addressed, 'sea');
  ensureBool(req.downloaded_data_reviewed, 'ddr');
  ensureNum(req.ahi_post, 'ap');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.setup_id };
}
function pulmonary_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enrollment_id, 'eid');
  ensureNum(req.program_duration_weeks, 'pdw');
  ensureNum(req.sessions_attended, 'sa');
  ensureNum(req.sessions_goal, 'sg');
  ensureNum(req.six_min_walk_pre_ft, 'smwpf');
  ensureNum(req.six_min_walk_post_ft, 'smwptf');
  ensureNum(req.dyspnea_score_change, 'dsc');
  ensureNum(req.qol_score_change, 'qsc');
  ensureEnum(req.completion_status, 'cs', ['active','completed','incomplete','dropped','on_hold','graduated','withdrew','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { eid: req.enrollment_id };
}
function inhaler_technique_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.inhaler_type, 'it', ['ics','laba','ics_laba','lama','lama_laba','saba','sama','triple_therapy','oral','nebulizer','mdi','dpi','soft_mist','other']);
  ensureNum(req.technique_score, 'ts');
  ensureNum(req.mistakes_count, 'mc');
  ensureBool(req.technique_corrected, 'tc');
  ensureBool(req.spacer_provided, 'sp');
  ensureBool(req.patient_demonstrated_comprehension, 'pdc');
  ensureBool(req.rinsing_mouth_recommended, 'rmr');
  ensureNum(req.follow_up_review, 'fur');
  ensureStr(req.provider, 'pr');
  ensureStr(req.improvement_plan, 'ip');
  return { aid: req.assessment_id };
}

function funcs() { return { sleep_study_referral, oxygen_therapy_setup, cpap_bpap_management, pulmonary_rehab, inhaler_technique_assessment }; }
module.exports = { funcs, ValidationError };