// filepath: tier126_surgery_advanced_652_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function surgical_case(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure, 'proc');
  ensureEnum(req.urgency, 'urg', ['elective','urgent','emergent','other','unknown']);
  ensureEnum(req.asa_class, 'asa', ['1','2','3','4','5','6','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function trauma_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure, 'proc');
  ensureEnum(req.urgency, 'urg', ['elective','urgent','emergent','other','unknown']);
  ensureEnum(req.asa_class, 'asa', ['1','2','3','4','5','6','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function emergent_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure, 'proc');
  ensureEnum(req.urgency, 'urg', ['elective','urgent','emergent','other','unknown']);
  ensureEnum(req.asa_class, 'asa', ['1','2','3','4','5','6','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function complex_case(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure, 'proc');
  ensureEnum(req.urgency, 'urg', ['elective','urgent','emergent','other','unknown']);
  ensureNum(req.estimated_blood_loss_ml, 'ebl');
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function fetal_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.procedure, 'proc');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.delivery_mode, 'dm', ['vaginal','vacuum','forceps','c_section','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}

function funcs() { return { surgical_case, trauma_surgery, emergent_surgery, complex_case, fetal_surgery }; }
module.exports = { funcs, ValidationError };