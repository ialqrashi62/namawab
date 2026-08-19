// filepath: tier107_nursing_med_admin_562_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function medication_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.administration_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.route, 'rt', ['po','iv','im','sc','topical','inhalation','other','unknown']);
  ensureNum(req.time_to_admin, 'tta');
  ensureBool(req.patient_identification_verified, 'piv');
  ensureBool(req.allergy_verified, 'av');
  ensureStr(req.provider, 'pr');
  return { aid: req.administration_id };
}
function barcode_scanning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scan_id, 'sid');
  ensureBool(req.patient_wristband_scanned, 'pws');
  ensureBool(req.medication_barcode_scanned, 'mbs');
  ensureBool(req.matched, 'mt');
  ensureNum(req.scan_duration, 'sd');
  ensureEnum(req.outcome, 'out', ['administered','blocked','rescanned','error','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.scan_id };
}
function iv_pump_programming(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pid');
  ensureStr(req.medication, 'med');
  ensureNum(req.rate_ml_hr, 'rmh');
  ensureNum(req.volume_ml, 'vm');
  ensureNum(req.duration_hours, 'dh');
  ensureBool(req.safety_software, 'ss');
  ensureEnum(req.outcome, 'out', ['infusing','completed','paused','error','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.program_id };
}
function double_check_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.check_id, 'cid');
  ensureStr(req.medication, 'med');
  ensureStr(req.primary_nurse, 'pn');
  ensureStr(req.secondary_nurse, 'sn');
  ensureNum(req.dose_agreement, 'da');
  ensureBool(req.route_agreement, 'ra');
  ensureEnum(req.outcome, 'out', ['administered','held','clarification','error','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.check_id };
}
function medication_reconciliation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reconciliation_id, 'rid');
  ensureNum(req.admission_meds, 'amn');
  ensureNum(req.discharge_meds, 'dmn');
  ensureNum(req.discrepancies, 'dsc');
  ensureNum(req.resolved_count, 'rc');
  ensureEnum(req.accuracy, 'acc', ['complete','partial','incomplete','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.reconciliation_id };
}

function funcs() { return { medication_administration, barcode_scanning, iv_pump_programming, double_check_medication, medication_reconciliation }; }
module.exports = { funcs, ValidationError };