// filepath: tier114_trauma_603_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ptsd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.trauma_type, 'tt');
  ensureNum(req.pcl_5_score, 'ps');
  ensureNum(req.duration_months, 'dm');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','very_severe','other','unknown']);
  ensureBool(req.intrusive_symptoms, 'is');
  ensureBool(req.traumatherapy, 'ttx');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function acute_stress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.days_since_event, 'dse');
  ensureNum(req.dissociation_score, 'ds');
  ensureBool(req.intrusive_symptoms, 'is');
  ensureBool(req.hyperarousal, 'ha');
  ensureNum(req.functioning_score, 'fs');
  ensureEnum(req.outcome, 'out', ['improving','stable','worsening','remission','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function adjustment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.stressor, 'st');
  ensureNum(req.duration_months, 'dm');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other','unknown']);
  ensureNum(req.functioning_pct, 'fp');
  ensureBool(req.counseling_initiated, 'ci');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function complex_trauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_of_onset, 'ao');
  ensureNum(req.trauma_events_count, 'tec');
  ensureNum(req.dissociation_score, 'ds');
  ensureBool(req.emotional_dysregulation, 'ed');
  ensureBool(req.attachment_issues, 'ai');
  ensureNum(req.therapy_weeks, 'tw');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function bereavement_reaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.months_since_loss, 'msl');
  ensureStr(req.relationship, 'rel');
  ensureNum(req.grief_intensity, 'gi');
  ensureNum(req.functioning_pct, 'fp');
  ensureBool(req.complicated_grief, 'cg');
  ensureBool(req.support_offered, 'so');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { ptsd, acute_stress, adjustment, complex_trauma, bereavement_reaction }; }
module.exports = { funcs, ValidationError };