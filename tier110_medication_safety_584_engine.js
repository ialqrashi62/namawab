// filepath: tier110_medication_safety_584_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function high_alert_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.high_alert_id, 'hid');
  ensureStr(req.medication, 'med');
  ensureEnum(req.type, 'tp', ['high_alert','high_risk','chemotherapy','controlled','other','unknown']);
  ensureNum(req.verification_count, 'vc');
  ensureStr(req.protocol_used, 'pu');
  ensureEnum(req.outcome, 'out', ['administered','held','error_caught','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { hid: req.high_alert_id };
}
function look_alike_sound_alike(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.lasa_id, 'lid');
  ensureStr(req.medication, 'med');
  ensureStr(req.confused_with, 'cw');
  ensureBool(req.look_alike, 'la');
  ensureBool(req.sound_alike, 'sa');
  ensureStr(req.prevention, 'prev');
  ensureStr(req.provider, 'pr');
  return { lid: req.lasa_id };
}
function double_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.check_id, 'cid');
  ensureStr(req.medication, 'med');
  ensureStr(req.verifier_1, 'v1');
  ensureStr(req.verifier_2, 'v2');
  ensureBool(req.dose_agreement, 'da');
  ensureBool(req.route_agreement, 'ra');
  ensureEnum(req.outcome, 'out', ['administered','held','error_caught','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.check_id };
}
function cis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cis_id, 'cid');
  ensureStr(req.medication, 'med');
  ensureNum(req.cis_count, 'cc');
  ensureBool(req.alert_acknowledged, 'aa');
  ensureBool(req.override, 'ov');
  ensureEnum(req.outcome, 'out', ['dosed','dosed_modified','held','changed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cis_id };
}
function smart_pump(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pump_id, 'pid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg_per_kg, 'dmpk');
  ensureBool(req.library_used, 'lu');
  ensureEnum(req.soft_limit, 'sl', ['respected','warning','override','hard_limit_blocked','other','unknown']);
  ensureNum(req.alert_count, 'ac');
  ensureStr(req.provider, 'pr');
  return { pid: req.pump_id };
}

function funcs() { return { high_alert_medication, look_alike_sound_alike, double_check, cis, smart_pump }; }
module.exports = { funcs, ValidationError };