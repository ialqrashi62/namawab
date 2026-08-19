// filepath: tier112_sterilization_593_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sterilization_validation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.validation_id, 'vid');
  ensureEnum(req.method, 'mt', ['steam','eto','vapor_h2o2','dry_heat','other','unknown']);
  ensureNum(req.cycle_count, 'cc');
  ensureNum(req.temperature_c, 'temp');
  ensureNum(req.exposure_min, 'em');
  ensureNum(req.success_rate, 'sr');
  ensureStr(req.operator, 'op');
  ensureStr(req.provider, 'pr');
  return { vid: req.validation_id };
}
function biological_indicator(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indicator_id, 'iid');
  ensureStr(req.cycle_id, 'cid');
  ensureBool(req.growth, 'gw');
  ensureNum(req.incubation_hours, 'ih');
  ensureBool(req.control_growth, 'cg');
  ensureBool(req.pass, 'pa');
  ensureStr(req.provider, 'pr');
  return { iid: req.indicator_id };
}
function chemical_indicator(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chemical_id, 'cid');
  ensureStr(req.cycle_id, 'cyid');
  ensureEnum(req.class, 'cl', ['1','2','3','4','5','6','unknown','other']);
  ensureStr(req.color_change, 'cc');
  ensureBool(req.expected, 'exp');
  ensureBool(req.pass, 'pa');
  ensureStr(req.provider, 'pr');
  return { cid: req.chemical_id };
}
function sterilization_failure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.failure_id, 'fid');
  ensureStr(req.cycle_id, 'cid');
  ensureStr(req.reason, 'rsn');
  ensureEnum(req.remediation, 'rem', ['redone','re_cleaned','re_packaged','discarded','pending','other','unknown']);
  ensureNum(req.recalled_items, 'ri');
  ensureBool(req.infection_risk_assessed, 'ira');
  ensureStr(req.provider, 'pr');
  return { fid: req.failure_id };
}
function scope_reprocessing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reprocessing_id, 'rid');
  ensureEnum(req.scope_type, 'st', ['bronchoscope','colonoscope','gastroscope','cystoscope','laryngoscope','other','unknown']);
  ensureBool(req.manual_cleaning, 'mc');
  ensureBool(req.high_level_disinfection, 'hld');
  ensureNum(req.hang_time_hours, 'hth');
  ensureEnum(req.tracking, 'tr', ['complete','partial','missing','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.reprocessing_id };
}

function funcs() { return { sterilization_validation, biological_indicator, chemical_indicator, sterilization_failure, scope_reprocessing }; }
module.exports = { funcs, ValidationError };