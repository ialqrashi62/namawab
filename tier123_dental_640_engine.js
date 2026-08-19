// filepath: tier123_dental_640_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dental_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.exam_id, 'eid');
  ensureNum(req.tooth_number, 'tn');
  ensureBool(req.caries_present, 'cp');
  ensureStr(req.provider, 'pr');
  return { eid: req.exam_id };
}
function restorative(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rest_id, 'rid');
  ensureNum(req.tooth_number, 'tn');
  ensureEnum(req.filling_type, 'ft', ['amalgam','composite','glass_ionomer','ceramic','other','unknown']);
  ensureEnum(req.surface, 'surf', ['occlusal','mesial','distal','buccal','lingual','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.rest_id };
}
function endodontic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.endo_id, 'eid');
  ensureNum(req.tooth_number, 'tn');
  ensureNum(req.root_canals, 'rc');
  ensureStr(req.provider, 'pr');
  return { eid: req.endo_id };
}
function periodontal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.perio_id, 'pid');
  ensureNum(req.pocket_depth_mm, 'pdm');
  ensureBool(req.bleeding, 'bl');
  ensureStr(req.provider, 'pr');
  return { pid: req.perio_id };
}
function orthodontic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ortho_id, 'oid');
  ensureEnum(req.malocclusion_class, 'mc', ['I','II','III','normal','other','unknown']);
  ensureEnum(req.treatment, 'tr', ['braces','aligners','retainer','expander','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { oid: req.ortho_id };
}

function funcs() { return { dental_exam, restorative, endodontic, periodontal, orthodontic }; }
module.exports = { funcs, ValidationError };