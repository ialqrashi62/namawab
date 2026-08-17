// filepath: tier59_telemedicine_331_tele_psy_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tele_psychiatry_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['initial_evaluation','medication_management','psychotherapy','crisis','intake','discharge']);
  ensureEnum(req.platform, 'pl', ['doxy','simplepractice','zoom_healthcare','institutional_platform','teladoc']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.phq9_score, 'phq9');
  ensureStr(req.medication_change, 'mc');
  ensureNum(req.follow_up, 'fu');
  return { visit_type: req.visit_type };
}
function tele_psychotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.modality, 'mod', ['cbt','dbt','act','emdr','psychodynamic','supportive','interpersonal','somatic_experiencing']);
  ensureStr(req.platform, 'pl');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.session_number, 'sn');
  ensureBool(req.homework_completed, 'hw');
  ensureEnum(req.progress, 'pr', ['improving','steady','plateau','worsening','new_issues']);
  ensureNum(req.next_session, 'ns');
  return { modality: req.modality };
}
function tele_group_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.group_type, 'gt', ['dbt_skills','cbt_anxiety','depression_support','grief_support','trauma_recovery','substance_recovery','psychoeducation']);
  ensureNum(req.group_size, 'gs');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.topics_covered, 'tc');
  ensureNum(req.attendance_pct, 'ap');
  ensureEnum(req.peer_interaction_quality, 'piq', ['low','moderate','high','excellent']);
  return { group_type: req.group_type };
}
function tele_crisis_intervention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.crisis_level, 'cl', ['low','moderate','high','imminent_danger']);
  ensureNum(req.c_ssrs_score, 'cssrs');
  ensureNum(req.response_time_min, 'rt');
  ensureStr(req.intervention, 'int');
  ensureStr(req.safety_plan, 'sp');
  ensureEnum(req.follow_up, 'fu', ['same_day_recheck','next_day','within_week','monitoring_only','referred_in_person']);
  return { crisis_level: req.crisis_level };
}
function tele_substance_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.program, 'prog', ['recovery_coaching','sober_living','outpatient_rehab','relapse_prevention','mat_counseling','family_counseling','12_step_facilitation']);
  ensureEnum(req.platform, 'pl', ['zoom','doxy','simplepractice','phone','in_app_messaging']);
  ensureNum(req.session_number, 'sn');
  ensureNum(req.sobriety_days, 'sd');
  ensureEnum(req.engagement, 'eng', ['high','moderate','low','declining','missed_sessions']);
  ensureEnum(req.relapse_risk, 'rr', ['low','moderate','high','imminent','recent_use']);
  ensureNum(req['12_step_meetings_attended'], 'sm');
  return { program: req.program };
}

function funcs() { return { tele_psychiatry_visit, tele_psychotherapy, tele_group_therapy, tele_crisis_intervention, tele_substance_counseling }; }
module.exports = { funcs, ValidationError };