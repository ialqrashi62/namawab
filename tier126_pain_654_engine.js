// filepath: tier126_pain_654_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assess_id, 'aid');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.location, 'loc');
  ensureBool(req.chronic, 'chr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assess_id };
}
function analgesic_admin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.analgesic_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.route, 'rt', ['iv','im','po','sc','topical','other','unknown']);
  ensureNum(req.pain_relief_pct, 'prp');
  ensureStr(req.provider, 'pr');
  return { aid: req.analgesic_id };
}
function nerve_block(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nerve_id, 'nid');
  ensureEnum(req.block_type, 'bt', ['femoral','sciatic','brachial','interscalene','supraclavicular','other','unknown']);
  ensureEnum(req.needle_approach, 'na', ['landmark','ultrasound','fluoroscopy','ct','other','unknown']);
  ensureBool(req.success, 'suc');
  ensureStr(req.provider, 'pr');
  return { nid: req.nerve_id };
}
function pca_pump(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pca_id, 'pid');
  ensureStr(req.medication, 'med');
  ensureNum(req.bolus_mg, 'bm');
  ensureNum(req.lockout_min, 'lo');
  ensureNum(req.delivered_doses, 'dd');
  ensureStr(req.provider, 'pr');
  return { pid: req.pca_id };
}
function intrathecal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intrathecal_id, 'iid');
  ensureStr(req.medication, 'med');
  ensureStr(req.concentration, 'conc');
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.provider, 'pr');
  return { iid: req.intrathecal_id };
}

function funcs() { return { pain_assessment, analgesic_admin, nerve_block, pca_pump, intrathecal }; }
module.exports = { funcs, ValidationError };