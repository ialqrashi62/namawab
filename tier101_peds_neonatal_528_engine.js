// filepath: tier101_peds_neonatal_528_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nicu_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.admission_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.birth_weight_grams, 'bwg');
  ensureNum(req.apgar_1, 'a1');
  ensureNum(req.apgar_5, 'a5');
  ensureEnum(req.respiratory_support, 'rs', ['none','cpap','mechanical','niv','high_flow','other','unknown']);
  ensureNum(req.icu_days, 'icd');
  ensureEnum(req.outcome, 'out', ['improved','transferred','expired','home','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.admission_id };
}
function respiratory_distress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.retractions, 'ret');
  ensureBool(req.grunting, 'gru');
  ensureBool(req.oxygen_required, 'or');
  ensureNum(req.cpap_pressure, 'cpap');
  ensureEnum(req.imaging, 'img', ['chest_xray','ct','ultrasound','none','other','unknown']);
  ensureEnum(req.diagnosis, 'dx', ['rds','ttn','meconium_aspiration','pneumonia','pphn','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function neonatal_sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_days, 'ad');
  ensureNum(req.temperature, 'temp');
  ensureEnum(req.blood_culture, 'bc', ['positive','negative','pending','other','unknown']);
  ensureNum(req.antibiotic, 'ab');
  ensureNum(req.wbc, 'wbc');
  ensureNum(req.crp, 'crp');
  ensureNum(req.platelet, 'plt');
  ensureEnum(req.outcome, 'out', ['stable','improving','worsening','expired','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function feeding_growth(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_days, 'ad');
  ensureEnum(req.feeding_type, 'ft', ['breast','bottle','both','tube','tpn','other','unknown']);
  ensureNum(req.weight_gain_g_day, 'wg');
  ensureNum(req.calorie_intake, 'ci');
  ensureNum(req.growth_percentile, 'gp');
  ensureEnum(req.concerns, 'con', ['none','failure_to_thrive','obesity','feeding_difficulty','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function neonatal_jaundice(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_days, 'ad');
  ensureNum(req.bilirubin, 'bil');
  ensureBool(req.phototherapy, 'pt');
  ensureBool(req.exchange_transfusion, 'et');
  ensureEnum(req.etiology, 'et2', ['physiologic','breastfeeding','hemolytic','breast_milk','infection','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { nicu_admission, respiratory_distress, neonatal_sepsis, feeding_growth, neonatal_jaundice }; }
module.exports = { funcs, ValidationError };
