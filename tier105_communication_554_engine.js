// filepath: tier105_communication_554_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function secure_messaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.message_id, 'mid');
  ensureStr(req.sender, 'snd');
  ensureStr(req.recipient, 'rcp');
  ensureEnum(req.priority, 'pr', ['normal','urgent','stat','other','unknown']);
  ensureBool(req.encrypted, 'enc');
  ensureNum(req.read_minutes, 'rm');
  ensureStr(req.provider, 'pr');
  return { mid: req.message_id };
}
function telehealth_video(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.clinician, 'cl');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.bandwidth_kbps, 'bw');
  ensureNum(req.connection_quality, 'cq');
  ensureEnum(req.outcome, 'out', ['completed','incomplete','rescheduled','technical_failure','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function patient_portal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.pages_visited, 'pv');
  ensureNum(req.minutes_on_portal, 'mp');
  ensureNum(req.lab_results_viewed, 'lrv');
  ensureNum(req.messages_sent, 'ms');
  ensureNum(req.appointments_booked, 'ab');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function care_team(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.team_id, 'tid');
  ensureNum(req.team_size, 'ts');
  ensureNum(req.coordination_hours, 'ch');
  ensureNum(req.handoffs, 'ho');
  ensureNum(req.missed_communications, 'mc');
  ensureNum(req.care_plan_updates, 'cpu');
  ensureStr(req.provider, 'pr');
  return { tid: req.team_id };
}
function patient_engagement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.engagement_id, 'eid');
  ensureNum(req.app_logins_30d, 'al');
  ensureNum(req.appointments_kept, 'ak');
  ensureNum(req.appointments_total, 'at');
  ensureNum(req.education_modules, 'em');
  ensureNum(req.goal_completion, 'gc');
  ensureStr(req.provider, 'pr');
  return { eid: req.engagement_id };
}

function funcs() { return { secure_messaging, telehealth_video, patient_portal, care_team, patient_engagement }; }
module.exports = { funcs, ValidationError };