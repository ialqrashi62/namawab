// filepath: tier125_transfusion_651_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function type_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.type_id, 'tid');
  ensureEnum(req.blood_type, 'bt', ['O_pos','O_neg','A_pos','A_neg','B_pos','B_neg','AB_pos','AB_neg','other','unknown']);
  ensureEnum(req.antibody_screen, 'as', ['negative','positive','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.type_id };
}
function crossmatch(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.xm_id, 'xid');
  ensureStr(req.unit_id, 'uid');
  ensureBool(req.compatible, 'cmp');
  ensureStr(req.provider, 'pr');
  return { xid: req.xm_id };
}
function transfuse_unit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tx_id, 'tid');
  ensureStr(req.unit_id, 'uid');
  ensureNum(req.volume_ml, 'vol');
  ensureBool(req.reaction, 'rxn');
  ensureStr(req.provider, 'pr');
  return { tid: req.tx_id };
}
function reaction_investigation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rxn_id, 'rid');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','other','unknown']);
  ensureBool(req.febrile, 'feb');
  ensureBool(req.workup_complete, 'wc');
  ensureStr(req.provider, 'pr');
  return { rid: req.rxn_id };
}
function apheresis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.aph_id, 'aid');
  ensureEnum(req.type, 'ty', ['plasmapheresis','plateletpheresis','leukapheresis','stem_cell','other','unknown']);
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.provider, 'pr');
  return { aid: req.aph_id };
}

function funcs() { return { type_screen, crossmatch, transfuse_unit, reaction_investigation, apheresis }; }
module.exports = { funcs, ValidationError };