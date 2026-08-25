// filepath: tier110_pharmacy_clinical_580_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function order_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.frequency_per_day, 'fpd');
  ensureNum(req.interactions, 'int');
  ensureNum(req.allergies_checked, 'ac');
  ensureBool(req.dose_appropriate, 'dap');
  ensureStr(req.provider, 'pr');
  return { oid: req.order_id };
}
function renal_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dosing_id, 'did');
  ensureStr(req.medication, 'med');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.creatinine_clearance, 'crcl');
  ensureNum(req.recommended_dose_m, 'rd');
  ensureNum(req.dose_adjustment_pct, 'dap');
  ensureBool(req.hemodialysis, 'hd');
  ensureStr(req.provider, 'pr');
  return { did: req.dosing_id };
}
function hepatic_dosing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dosing_id, 'did');
  ensureStr(req.medication, 'med');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown']);
  ensureEnum(req.dose_adjustment, 'da', ['none','mild','moderate','severe','contraindicated','unknown','other']);
  ensureNum(req.alt, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.bilirubin, 'br');
  ensureStr(req.provider, 'pr');
  return { did: req.dosing_id };
}
function therapeutic_drug_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tdm_id, 'tid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.trough_level, 'tr');
  ensureNum(req.peak_level, 'pk');
  ensureNum(req.target_range_low, 'trl');
  ensureNum(req.target_range_high, 'trh');
  ensureEnum(req.therapeutic_status, 'ts', ['subtherapeutic','therapeutic','supratherapeutic','toxic','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { tid: req.tdm_id };
}
function iv_to_po_conversion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.conversion_id, 'cid');
  ensureStr(req.medication, 'med');
  ensureNum(req.current_iv_dose, 'civ');
  ensureNum(req.recommended_po_dose, 'rpo');
  ensureBool(req.tolerating_po, 'tp');
  ensureNum(req.days_to_conversion, 'dtc');
  ensureEnum(req.outcome, 'out', ['converted','failed','pending','declined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.conversion_id };
}

function funcs() { return { order_review, renal_dosing, hepatic_dosing, therapeutic_drug_monitoring, iv_to_po_conversion }; }
module.exports = { funcs, ValidationError };