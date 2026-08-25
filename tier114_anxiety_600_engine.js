// filepath: tier114_anxiety_600_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gad(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gad_7_score, 'gs');
  ensureNum(req.duration_months, 'dm');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','severe','other','unknown']);
  ensureNum(req.worry_hours_per_day, 'wh');
  ensureStr(req.triggers, 'tr');
  ensureEnum(req.treatment, 'tx', ['cbt','medication','combination','observation','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function panic_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.panic_frequency, 'pf');
  ensureNum(req.last_panic_days, 'lpd');
  ensureEnum(req.agoraphobia, 'ago', ['none','mild','moderate','severe','other','unknown']);
  ensureNum(req.pdss_score, 'ps');
  ensureBool(req.experimental_med, 'em');
  ensureBool(req.cbt_initiated, 'ci');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function social_anxiety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.lsas_score, 'ls');
  ensureBool(req.avoidance_behavior, 'ab');
  ensureNum(req.situations_count, 'sc');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','very_severe','other','unknown']);
  ensureEnum(req.response_to_medication, 'rtm', ['good','partial','none','not_tried','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function phobia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.phobia_type, 'pt');
  ensureNum(req.onset_age, 'oa');
  ensureBool(req.avoids_situation, 'as');
  ensureEnum(req.exposure_treatment, 'et', ['initiated','declined','planned','completed','not_offered','other','unknown']);
  ensureNum(req.progress, 'pr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function separation_anxiety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.duration_months, 'dm');
  ensureNum(req.school_refusal_days, 'srd');
  ensureEnum(req.attachment_pattern, 'ap', ['secure','insecure','disorganized','other','unknown']);
  ensureBool(req.parent_intervention, 'pi');
  ensureEnum(req.outcome, 'out', ['improving','stable','worsening','remission','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { gad, panic_disorder, social_anxiety, phobia, separation_anxiety }; }
module.exports = { funcs, ValidationError };