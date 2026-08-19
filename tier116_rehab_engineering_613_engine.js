// filepath: tier116_rehab_engineering_613_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function wheelchair_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.weight_kg, 'wk');
  ensureStr(req.measurements, 'meas');
  ensureEnum(req.propulsion, 'prop', ['self','attendant','both','other','unknown']);
  ensureNum(req.satisfaction, 'sat');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function orthotic_fitting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fitting_id, 'fid');
  ensureEnum(req.device, 'dev', ['afo','knee_brace','wrist_hand','spine','helmet','other','unknown']);
  ensureEnum(req.type, 'tp', ['custom','off_the_shelf','hybrid','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.wearing_tolerance_hr, 'wth');
  ensureStr(req.provider, 'pr');
  return { fid: req.fitting_id };
}
function prosthetic_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.amputation_level, 'al', ['below_knee','above_knee','below_elbow','above_elbow','partial_hand','partial_foot','other','unknown']);
  ensureNum(req.residual_length_cm, 'rlc');
  ensureEnum(req.prosthesis_type, 'pt', ['microprocessor','mechanical','cosmetic','hybrid','other','unknown']);
  ensureEnum(req.socket_fit, 'sf', ['poor','fair','good','excellent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function adaptive_equipment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureStr(req.device, 'dev');
  ensureStr(req.location, 'loc');
  ensureNum(req.training_hours, 'th');
  ensureBool(req.adoption, 'ad');
  ensureStr(req.provider, 'pr');
  return { did: req.device_id };
}
function home_modifications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ramps, 'rmp');
  ensureNum(req.grab_bars, 'gb');
  ensureNum(req.doorway_widening, 'dw');
  ensureNum(req.cost_dollars, 'cost');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { wheelchair_assessment, orthotic_fitting, prosthetic_assessment, adaptive_equipment, home_modifications }; }
module.exports = { funcs, ValidationError };