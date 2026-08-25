// filepath: tier106_poison_control_558_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function exposure_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.substance, 'sub');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.time_to_call, 'tc');
  ensureEnum(req.severity, 'sev', ['none','mild','moderate','severe','fatal','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function antidote_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.treatment_id, 'tid');
  ensureStr(req.antidote, 'ant');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.route, 'rt', ['iv','im','po','sc','inhalation','topical','other','unknown']);
  ensureNum(req.reactions, 'rxn');
  ensureEnum(req.effectiveness, 'eff', ['complete','partial','failed','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.treatment_id };
}
function observation_period(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.period_id, 'pid');
  ensureStr(req.substance, 'sub');
  ensureNum(req.duration_hours, 'dh');
  ensureEnum(req.monitoring, 'mon', ['cardiac','neuro','metabolic','respiratory','renal','other','unknown']);
  ensureNum(req.symptoms, 'sym');
  ensureEnum(req.disposition, 'disp', ['discharged','admitted','transferred','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.period_id };
}
function follow_up_call(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.call_id, 'cid');
  ensureStr(req.case_id, 'caseid');
  ensureNum(req.time_hours, 'th');
  ensureEnum(req.status, 'st', ['stable','worsening','improved','critical','deceased','other','unknown']);
  ensureNum(req.symptoms, 'sym');
  ensureNum(req.adherence, 'adh');
  ensureEnum(req.outcome, 'out', ['resolved','ongoing','referred','expired','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.call_id };
}
function toxicology_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureEnum(req.panel, 'pn', ['comprehensive_drug','basic_drug','alcohol','opioid','stimulant','other','unknown']);
  ensureNum(req.results_count, 'rc');
  ensureNum(req.abnormal_count, 'ac');
  ensureNum(req.critical_values, 'cv');
  ensureNum(req.turnaround_hours, 'th');
  ensureStr(req.provider, 'pr');
  return { oid: req.order_id };
}

function funcs() { return { exposure_assessment, antidote_administration, observation_period, follow_up_call, toxicology_screen }; }
module.exports = { funcs, ValidationError };