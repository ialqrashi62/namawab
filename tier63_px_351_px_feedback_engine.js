// filepath: tier63_px_351_px_feedback_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_praise(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.staff_name, 'sn');
  ensureEnum(req.praise_type, 'pt', ['compassion','clinical_excellence','efficiency','communication','teamwork','going_above_beyond','listening','cultural_sensitivity']);
  ensureStr(req.department, 'dept');
  ensureStr(req.message, 'msg');
  ensureBool(req.shared_with_staff, 'sws');
  ensureBool(req.recognition_given, 'rg');
  ensureStr(req.date, 'date');
  return { staff: req.staff_name };
}
function patient_suggestion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.suggestion_id, 'si');
  ensureEnum(req.category, 'cat', ['waitroom','parking','signage','digital','communication','staff','environment','food','process','billing','other']);
  ensureStr(req.current_state, 'cs');
  ensureStr(req.suggestion, 'sug');
  ensureEnum(req.feasibility, 'feas', ['under_review','accepted','rejected','deferred','implementing','complete','on_hold']);
  ensureStr(req.implementer, 'impl');
  ensureStr(req.target_date, 'td');
  return { category: req.category };
}
function patient_real_time_pulse(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pulse_id, 'pi');
  ensureEnum(req.touchpoint, 'tp', ['post_visit_24h','post_visit_7d','post_discharge_24h','tele_visit_post','lab_post','imaging_post','billing_post']);
  ensureNum(req.score, 'score');
  ensureStr(req.comment_text, 'ct');
  ensureEnum(req.sentiment, 'sent', ['positive','neutral','negative','mixed','unknown','n_a']);
  ensureStr(req.trigger_actions, 'ta');
  ensureBool(req.alert_needed, 'an');
  return { touchpoint: req.touchpoint };
}
function patient_focus_group(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.focus_group_id, 'fgi');
  ensureStr(req.topic, 'topic');
  ensureStr(req.attended_date, 'ad');
  ensureNum(req.pre_survey_score, 'pss');
  ensureNum(req.post_survey_score, 'pos');
  ensureStr(req.themes_identified, 'ti');
  ensureNum(req.action_items, 'ai');
  ensureBool(req.incentive_provided, 'ip');
  return { topic: req.topic };
}
function patient_quality_partner(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.council_id, 'ci');
  ensureEnum(req.role, 'role', ['co_chair','chair','member','liaison','advisor','secretary','treasurer','observer']);
  ensureNum(req.meeting_attendance_pct, 'map');
  ensureStr(req.committees, 'comm');
  ensureNum(req.projects_led, 'pl');
  ensureStr(req.since, 'since');
  ensureEnum(req.leadership_potential, 'lp', ['low','moderate','high','exceptional']);
  return { role: req.role };
}

function funcs() { return { patient_praise, patient_suggestion, patient_real_time_pulse, patient_focus_group, patient_quality_partner }; }
module.exports = { funcs, ValidationError };