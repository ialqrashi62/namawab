// filepath: tier121_pharm_advanced_632_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function controlled_substance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.dea_schedule, 'ds', ['2','3','4','5','none','other','unknown']);
  ensureNum(req.days_supply, 'ds2');
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}
function compounded_sterile(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.compounding_type, 'ct', ['sterile','non_sterile','hazardous','other','unknown']);
  ensureEnum(req.iso_class, 'ic', ['5','7','8','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}
function radiopharmaceutical(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureStr(req.isotope, 'iso');
  ensureNum(req.dose_mbq, 'dm');
  ensureNum(req.radiation_mSv, 'rs');
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}
function biologic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureStr(req.biologic, 'bio');
  ensureNum(req.infusion_duration_min, 'idm');
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}
function specialty_med(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rx_id, 'rid');
  ensureEnum(req.specialty, 'sp', ['hiv','oncology','rheumatology','neurology','rare_disease','other','unknown']);
  ensureBool(req.prior_auth, 'pa');
  ensureBool(req.copay_assistance, 'ca');
  ensureStr(req.provider, 'pr');
  return { rid: req.rx_id };
}

function funcs() { return { controlled_substance, compounded_sterile, radiopharmaceutical, biologic_therapy, specialty_med }; }
module.exports = { funcs, ValidationError };