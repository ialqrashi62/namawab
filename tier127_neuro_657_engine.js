// filepath: tier127_neuro_657_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_scale(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nih_id, 'nid');
  ensureNum(req.nihss_score, 'ns');
  ensureNum(req.gcs, 'gcs');
  ensureStr(req.symptom_onset, 'so');
  ensureStr(req.provider, 'pr');
  return { nid: req.nih_id };
}
function seizure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.seiz_id, 'sid');
  ensureEnum(req.type, 'ty', ['generalized','focal','absence','status','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.post_ictal, 'pi');
  ensureStr(req.provider, 'pr');
  return { sid: req.seiz_id };
}
function neuro_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.exam_id, 'eid');
  ensureEnum(req.cranial_nerves, 'cn', ['intact','focal_deficit','multiple_deficits','other','unknown']);
  ensureNum(req.motor_strength, 'ms');
  ensureEnum(req.gait, 'gt', ['normal','abnormal','unable','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.exam_id };
}
function eeg_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.eeg_id, 'eid');
  ensureEnum(req.finding, 'fnd', ['normal','epileptiform','slowing','focal_abnormality','other','unknown']);
  ensureStr(req.duration_min, 'dur');
  ensureStr(req.provider, 'pr');
  return { eid: req.eeg_id };
}
function lumbar_puncture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.lp_id, 'lid');
  ensureNum(req.opening_pressure, 'op');
  ensureNum(req.wbc, 'wbc');
  ensureNum(req.protein, 'prt');
  ensureStr(req.provider, 'pr');
  return { lid: req.lp_id };
}

function funcs() { return { stroke_scale, seizure, neuro_exam, eeg_report, lumbar_puncture }; }
module.exports = { funcs, ValidationError };