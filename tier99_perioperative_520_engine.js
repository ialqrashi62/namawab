// filepath: tier99_perioperative_520_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preanesthetic_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.asa_class, 'asa', ['1','2','3','4','5','6','e','unknown','other']);
  ensureNum(req.mallampati, 'mall');
  ensureNum(req.airway_difficulty, 'awd');
  ensureNum(req.fasting_hours, 'fah');
  ensureNum(req.consent_signed, 'cs');
  ensureNum(req.allergies_reviewed, 'ar');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function intraoperative_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.ebl_ml, 'ebl');
  ensureNum(req.bp_average, 'bpa');
  ensureNum(req.heart_rate_avg, 'hra');
  ensureNum(req.spo2_min, 'smin');
  ensureNum(req.temp_c, 'temp');
  ensureNum(req.fluid_input_ml, 'fli');
  ensureNum(req.fluid_output_ml, 'flo');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function pacu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.alderete_score, 'ald');
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.pacu_time_min, 'ptm');
  ensureBool(req.nausea, 'nau');
  ensureBool(req.antiemetic_given, 'aeg');
  ensureEnum(req.discharge_status, 'ds', ['home','floor','icu','step_down','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function postop_complications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.complication, 'comp', ['none','bleeding','infection','dvt','pe','ileus','anastomotic_leak','pneumonia','mi','stroke','other','unknown']);
  ensureNum(req.days_postop, 'dp');
  ensureNum(req.clavien_dindo, 'cd');
  ensureNum(req.reoperation, 'ro');
  ensureNum(req.readmission_30d, 'r30');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function enhanced_recovery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureBool(req.preop_carbs, 'pc');
  ensureBool(req.no_npo, 'npo');
  ensureBool(req.multimodal_analgesia, 'ma');
  ensureNum(req.early_mobilization, 'em');
  ensureNum(req.opioid_sparing, 'os');
  ensureNum(req.los_days, 'los');
  ensureNum(req.compliance_pct, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { preanesthetic_eval, intraoperative_monitoring, pacu, postop_complications, enhanced_recovery }; }
module.exports = { funcs, ValidationError };
