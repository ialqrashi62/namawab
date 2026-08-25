// filepath: tier123_wound_641_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function wound_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.wound_id, 'wid');
  ensureEnum(req.stage, 'st', ['1','2','3','4','unstageable','dtpi','other','unknown']);
  ensureStr(req.size_cm, 'sc');
  ensureEnum(req.location, 'loc', ['sacrum','heel','elbow','hip','ankle','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { wid: req.wound_id };
}
function wound_dressing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dressing_id, 'did');
  ensureStr(req.wound_id, 'wid');
  ensureEnum(req.dressing_type, 'dt', ['hydrocolloid','foam','alginate','gauze','transparent','other','unknown']);
  ensureNum(req.change_frequency_days, 'cfd');
  ensureStr(req.provider, 'pr');
  return { did: req.dressing_id };
}
function wound_culture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.wound_id, 'wid');
  ensureStr(req.organism, 'org');
  ensureStr(req.provider, 'pr');
  return { cid: req.culture_id };
}
function debridement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.debride_id, 'did');
  ensureStr(req.wound_id, 'wid');
  ensureEnum(req.method, 'meth', ['sharp','mechanical','enzymatic','autolytic','other','unknown']);
  ensureNum(req.tissue_removed_g, 'trg');
  ensureStr(req.provider, 'pr');
  return { did: req.debride_id };
}
function wound_closure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.closure_id, 'cid');
  ensureStr(req.wound_id, 'wid');
  ensureEnum(req.method, 'meth', ['primary','secondary','tertiary','delayed','other','unknown']);
  ensureNum(req.suture_count, 'sc');
  ensureStr(req.provider, 'pr');
  return { cid: req.closure_id };
}

function funcs() { return { wound_assessment, wound_dressing, wound_culture, debridement, wound_closure }; }
module.exports = { funcs, ValidationError };