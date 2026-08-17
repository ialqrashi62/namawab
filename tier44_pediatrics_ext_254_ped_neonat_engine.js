// filepath: tier44_pediatrics_ext_254_ped_neonat_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function premature_infant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gestational_age_weeks, 'ga');
  ensureNum(req.birth_weight_g, 'bw');
  ensureNum(req.apgar_5, 'apgar');
  ensureBool(req.surfactant_administered, 'surf');
  ensureEnum(req.ventilation, 'vent', ['none','cpap','mechanical','hfnc','niv']);
  ensureNum(req.nicu_days, 'days');
  return { ga: req.gestational_age_weeks, birth_weight: req.birth_weight_g, status: 'monitored' };
}
function respiratory_distress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gestational_age_weeks, 'ga');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureEnum(req.retractions, 'retr', ['none','mild','moderate','severe']);
  ensureNum(req.silverman_score, 'ss');
  ensureBool(req.surfactant_given, 'surf');
  ensureEnum(req.ventilation, 'vent', ['cpap','mechanical','niv','oxygen','none']);
  return { severity: req.silverman_score >= 6 ? 'severe' : req.silverman_score >= 4 ? 'moderate' : 'mild', ventilation: req.ventilation };
}
function neonatal_jaundice(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_hours, 'age_h');
  ensureNum(req.bilirubin_total, 'tbil');
  ensureNum(req.bilirubin_direct, 'dbil');
  ensureEnum(req.phototherapy, 'pt', ['none','conventional','intensive','exchange_transfusion']);
  ensureBool(req.exchange_transfusion, 'etx');
  ensureStr(req.risk, 'risk');
  return { bilirubin: req.bilirubin_total, phototherapy: req.phototherapy };
}
function sepsis_neonatal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_days, 'age_d');
  ensureNum(req.temperature, 'temp');
  ensureNum(req.wbc, 'wbc');
  ensureStr(req.blood_culture, 'cx');
  ensureStr(req.antibiotics, 'abx');
  ensureStr(req.supportive, 'sup');
  return { status: 'monitored', antibiotics: req.antibiotics };
}
function feeding_problem(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_days, 'age_d');
  ensureNum(req.weight_loss_pct, 'wloss');
  ensureEnum(req.feeding_method, 'fm', ['breast','formula','mixed','ng_tube','parenteral']);
  ensureBool(req.latch_difficulty, 'latch');
  ensureStr(req.intervention, 'int');
  return { weight_loss: req.weight_loss_pct, intervention: req.intervention };
}

function funcs() { return { premature_infant, respiratory_distress, neonatal_jaundice, sepsis_neonatal, feeding_problem }; }
module.exports = { funcs, ValidationError };