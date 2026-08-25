// filepath: tier130_pharm_admin_668_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function order_entry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureStr(req.drug, 'drug');
  ensureStr(req.dose, 'dose');
  ensureEnum(req.route, 'rt', ['po','iv','im','sc','topical','inhaled','other','unknown']);
  ensureEnum(req.frequency, 'fq', ['qd','bid','tid','qid','prn','q4h','q6h','q8h','q12h','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { oid: req.order_id };
}
function iv_admixture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.iv_id, 'iid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.diluent, 'dil');
  ensureNum(req.concentration_mg_ml, 'cnc');
  ensureBool(req.stability_verified, 'sv');
  ensureStr(req.provider, 'pr');
  return { iid: req.iv_id };
}
function patient_education_rx(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pe_id, 'pid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.teach_back_passed, 'tbp');
  ensureStr(req.provider, 'pr');
  return { pid: req.pe_id };
}
function med_reconciliation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mr_id, 'mid');
  ensureNum(req.meds_count, 'mc');
  ensureNum(req.discrepancies, 'dc');
  ensureBool(req.provider_callback, 'pc');
  ensureStr(req.provider, 'pr');
  return { mid: req.mr_id };
}
function inventory_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.inv_id, 'iid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.quantity_on_hand, 'qoh');
  ensureNum(req.reorder_level, 'rl');
  ensureStr(req.provider, 'pr');
  return { iid: req.inv_id };
}

function funcs() { return { order_entry, iv_admixture, patient_education_rx, med_reconciliation, inventory_check }; }
module.exports = { funcs, ValidationError };