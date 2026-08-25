// filepath: tier82_obgyn_ext_433_obgyn_antenatal_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function antenatal_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.gravida, 'grav');
  ensureNum(req.para, 'para');
  ensureNum(req.bmi, 'bmi');
  ensureBool(req.diabetes, 'dm');
  ensureBool(req.hypertension, 'htn');
  ensureStr(req.medications, 'meds');
  ensureBool(req.smoking, 'smo');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.allergies, 'alg');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function antenatal_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.weight_kg, 'wkg');
  ensureNum(req.blood_pressure_systolic, 'bps');
  ensureNum(req.blood_pressure_diastolic, 'bpd');
  ensureNum(req.fundal_height, 'fh');
  ensureNum(req.fetal_heart_rate, 'fhr');
  ensureStr(req.fetal_movement, 'fm');
  ensureStr(req.symptoms, 'sym');
  ensureStr(req.medications, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function high_risk_preg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.current_diagnosis, 'cd');
  ensureBool(req.maternal_age_advanced, 'maa');
  ensureBool(req.previous_preterm, 'pp');
  ensureNum(req.blood_pressure_systolic, 'bps');
  ensureNum(req.fundal_height, 'fh');
  ensureEnum(req.fetal_growth, 'fg', ['appropriate','lagging','accelerated','unknown']);
  ensureEnum(req.recommendation, 'rec', ['continue_routine','increased_surveillance','refer_mfm','admit','iufgr_protocol','other']);
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function rhesus_isoimmunization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureStr(req.blood_type, 'bt');
  ensureNum(req.antibody_titer, 'at');
  ensureStr(req.antibody_type, 'aty');
  ensureNum(req.previous_affected_pregnancies, 'pap');
  ensureBool(req.amnio_mcdonald_done, 'amd');
  ensureNum(req.mca_peak_systolic_velocity, 'mcapsv');
  ensureNum(req.delta_od_450, 'doo');
  ensureEnum(req.management, 'mg', ['monitor','transfusion','early_delivery','maternal_plasma','exchange_transfusion','none','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function multiples(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.chorionicity, 'ch', ['monochorionic_diamniotic','dichorionic_diamniotic','monochorionic_monoamniotic','triplet_other','unknown']);
  ensureNum(req.twins, 'tw');
  ensureBool(req.ttts_suspected, 'ts');
  ensureBool(req.twin_aneamia_polycythemia, 'tap');
  ensureNum(req.cervical_length_mm, 'clm');
  ensureBool(req.cerclage_planned, 'cp');
  ensureNum(req.delivery_target_weeks, 'dtw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { antenatal_initial, antenatal_followup, high_risk_preg, rhesus_isoimmunization, multiples }; }
module.exports = { funcs, ValidationError };