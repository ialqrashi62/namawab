// filepath: tier126_orthotics_655_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function splint(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.splint_id, 'sid');
  ensureStr(req.injury, 'inj');
  ensureEnum(req.type, 'ty', ['long_leg','short_leg','long_arm','short_arm','thumb','sugar_tong','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.splint_id };
}
function cast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cast_id, 'cid');
  ensureStr(req.injury, 'inj');
  ensureEnum(req.material, 'mat', ['fiberglass','plaster','waterproof','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cast_id };
}
function bracing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bracing_id, 'bid');
  ensureEnum(req.region, 'reg', ['lumbar','cervical','thoracic','knee','ankle','other','unknown']);
  ensureStr(req.type, 'ty');
  ensureNum(req.wear_hours, 'wh');
  ensureStr(req.provider, 'pr');
  return { bid: req.bracing_id };
}
function prosthetic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prosthetic_id, 'pid');
  ensureEnum(req.type, 'ty', ['transfemoral','transtibial','transhumeral','transradial','other','unknown']);
  ensureEnum(req.side, 'sd', ['left','right','bilateral','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.prosthetic_id };
}
function orthotic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.orthotic_id, 'oid');
  ensureEnum(req.type, 'ty', ['afo','kfo','kafo','smo','ucb','other','unknown']);
  ensureNum(req.patient_age, 'age');
  ensureStr(req.provider, 'pr');
  return { oid: req.orthotic_id };
}

function funcs() { return { splint, cast, bracing, prosthetic, orthotic }; }
module.exports = { funcs, ValidationError };