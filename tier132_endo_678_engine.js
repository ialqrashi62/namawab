// filepath: tier132_endo_678_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diabetes_mgmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dm_id, 'did');
  ensureNum(req.hba1c, 'hba');
  ensureNum(req.fbg, 'fbg');
  ensureEnum(req.regimen, 'rgn', ['basal_bolus','csii','mdi','oral_only','diet_only','other','unknown']);
  ensureBool(req.complications, 'cmp');
  ensureStr(req.provider, 'pr');
  return { did: req.dm_id };
}
function thyroid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.thyroid_id, 'tid');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.free_t4, 'ft4');
  ensureEnum(req.diagnosis, 'dg', ['euthyroid','hypothyroid','hyperthyroid','subclinical','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.thyroid_id };
}
function adrenal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.adr_id, 'aid');
  ensureNum(req.cortisol_am, 'cor');
  ensureNum(req.acth, 'acth');
  ensureEnum(req.diagnosis, 'dg', ['normal','cushings','addisons','secondary','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.adr_id };
}
function reproductive_endocrine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.repro_id, 'rid');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.lh, 'lh');
  ensureNum(req.testosterone, 'testo');
  ensureStr(req.provider, 'pr');
  return { rid: req.repro_id };
}
function bone_density(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bone_id, 'bid');
  ensureNum(req.t_score_lumbar, 'tsl');
  ensureNum(req.t_score_femur, 'tsf');
  ensureEnum(req.diagnosis, 'dg', ['normal','osteopenia','osteoporosis','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { bid: req.bone_id };
}

function funcs() { return { diabetes_mgmt, thyroid, adrenal, reproductive_endocrine, bone_density }; }
module.exports = { funcs, ValidationError };