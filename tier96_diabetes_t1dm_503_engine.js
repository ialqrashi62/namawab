// filepath: tier96_diabetes_t1dm_503_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function t1dm_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.hba1c, 'hba1c');
  ensureNum(req.time_in_range, 'tir');
  ensureNum(req.hypoglycemia_episodes, 'he');
  ensureNum(req.total_daily_dose, 'tdd');
  ensureEnum(req.insulin_regimen, 'ir', ['mdi','pump','hybrid_closed_loop','other','unknown']);
  ensureNum(req.c_peptide, 'cpep');
  ensureNum(req.antibody_gad, 'gad');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function insulin_pump(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.pump_type, 'pt', ['medtronic','tandem','omnipod','other','unknown','none']);
  ensureEnum(req.cgm_type, 'ct', ['dexcom','libre','guardian','other','unknown','none']);
  ensureNum(req.basal_rate, 'br');
  ensureNum(req.carb_ratio, 'cr');
  ensureNum(req.correction_factor, 'cf');
  ensureBool(req.auto_mode, 'am');
  ensureNum(req.time_in_range_pct, 'tir');
  ensureStr(req.provider, 'pr');
  return { did: req.device_id };
}
function cgm_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.days_reviewed, 'dr');
  ensureNum(req.average_glucose, 'ag');
  ensureNum(req.gmi, 'gmi');
  ensureNum(req.cv, 'cv');
  ensureNum(req.tar_pct, 'tar');
  ensureNum(req.tbr_pct, 'tbr');
  ensureNum(req.time_in_range, 'tir');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function dka_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.blood_glucose, 'bg');
  ensureNum(req.ph, 'ph');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.anion_gap, 'ag');
  ensureNum(req.ketones, 'ket');
  ensureBool(req.icu_admission, 'icu');
  ensureNum(req.icu_days, 'id');
  ensureNum(req.time_to_resolution_hrs, 'ttx');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function hypoglycemia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.blood_glucose, 'bg');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unconscious','other','unknown']);
  ensureBool(req.glucagon_given, 'gg');
  ensureBool(req.emergency_dept, 'ed');
  ensureBool(req.hospitalization, 'hosp');
  ensureStr(req.cause, 'cau');
  ensureNum(req.treatment_time_min, 'ttm');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { t1dm_management, insulin_pump, cgm_review, dka_management, hypoglycemia }; }
module.exports = { funcs, ValidationError };
