// filepath: tier104_public_health_546_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function community_health(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pid');
  ensureEnum(req.initiative_type, 'it', ['community_health','school_health','workplace','faith_based','other','unknown']);
  ensureStr(req.target_audience, 'ta');
  ensureNum(req.reach, 'reach');
  ensureEnum(req.intervention, 'int', ['vaccination','screening','education','lifestyle','other','unknown']);
  ensureNum(req.outcome_metric, 'om');
  ensureNum(req.outcome_value, 'ov');
  ensureStr(req.provider, 'pr');
  return { pid: req.program_id };
}
function health_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.topic, 'top');
  ensureEnum(req.format, 'fmt', ['individual','group_education','workshop','online','print','broadcast','other','unknown']);
  ensureNum(req.attendees, 'att');
  ensureNum(req.knowledge_improvement_score, 'kis');
  ensureNum(req.behavior_change_score, 'bcs');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function screening_program(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pid');
  ensureStr(req.condition, 'cond');
  ensureNum(req.eligible_population, 'ep');
  ensureNum(req.enrolled, 'en');
  ensureNum(req.screened, 'sc');
  ensureNum(req.abnormal_findings, 'af');
  ensureStr(req.provider, 'pr');
  return { pid: req.program_id };
}
function environmental_health(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.location, 'loc');
  ensureEnum(req.contamination, 'con', ['none','lead','asbestos','mold','radiation','air','water','other','unknown']);
  ensureEnum(req.lead_level, 'll', ['below_detection','normal','elevated','high','critical','other','unknown']);
  ensureEnum(req.nitrates, 'nit', ['within_normal','elevated','high','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['continue_monitoring','remediation','evacuation','public_health_intervention','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function maternal_child_health(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pid');
  ensureNum(req.maternal_visits, 'mv');
  ensureNum(req.immunization_rate, 'ir');
  ensureNum(req.infant_mortality, 'im');
  ensureNum(req.exclusive_breastfeeding, 'ebf');
  ensureNum(req.low_birth_weight_pct, 'lbw');
  ensureStr(req.provider, 'pr');
  return { pid: req.program_id };
}

function funcs() { return { community_health, health_education, screening_program, environmental_health, maternal_child_health }; }
module.exports = { funcs, ValidationError };
