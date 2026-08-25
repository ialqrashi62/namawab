// filepath: tier106_er_extended_555_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function triage_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.triage_id, 'tid');
  ensureNum(req.acuity_level, 'al');
  ensureNum(req.esi_level, 'esi');
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.vital_score, 'vs');
  ensureNum(req.wait_min, 'wm');
  ensureStr(req.provider, 'pr');
  return { tid: req.triage_id };
}
function fast_track(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fasttrack_id, 'fid');
  ensureBool(req.eligibility, 'elg');
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.treatment_min, 'tm');
  ensureEnum(req.disposition, 'disp', ['discharged','admitted','transferred','eloped','other','unknown']);
  ensureNum(req.satisfaction, 'sat');
  ensureStr(req.provider, 'pr');
  return { fid: req.fasttrack_id };
}
function critical_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.acuity, 'acu');
  ensureStr(req.presenting, 'pres');
  ensureNum(req.interventions, 'int');
  ensureNum(req.response_minutes, 'rm');
  ensureEnum(req.outcome, 'out', ['stabilized','intubated','arrested','died','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function observation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.observation_hours, 'oh');
  ensureStr(req.reason, 'rs');
  ensureNum(req.tests_ordered, 'to');
  ensureEnum(req.disposition, 'disp', ['discharged','admitted','transferred','eloped','other','unknown']);
  ensureBool(req.readmission_30d, 'r30');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function discharge_planning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.social_risk_score, 'srs');
  ensureNum(req.follow_up_appointment, 'fua');
  ensureBool(req.home_care_needed, 'hcn');
  ensureNum(req.barriers_count, 'bc');
  ensureEnum(req.disposition, 'disp', ['home','home_health','snf','rehab','ltach','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { triage_protocol, fast_track, critical_care, observation, discharge_planning }; }
module.exports = { funcs, ValidationError };