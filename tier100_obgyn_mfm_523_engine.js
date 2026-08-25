// filepath: tier100_obgyn_mfm_523_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function prenatal_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.weight_kg, 'wt');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.fundal_height, 'fh');
  ensureEnum(req.fetal_heart_tone, 'fht', ['present','absent','variable','other','unknown','none']);
  ensureNum(req.edema, 'ede');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function high_risk_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.risk_factors, 'rf', ['age_advanced','age_young','preexisting_dm','preexisting_htn','obesity','multiple_gestation','previous_preterm','previous_preeclampsia','incompetent_cervix','other','unknown','none']);
  ensureNum(req.risk_score, 'rs');
  ensureNum(req.referrals_count, 'rc');
  ensureNum(req.ultrasounds_completed, 'uc');
  ensureEnum(req.plan, 'plan', ['surveillance','specialist_referral','medication','hospitalization','delivery','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function preeclampsia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.proteinuria, 'pro');
  ensureNum(req.edema, 'ede');
  ensureNum(req.platelets, 'plt');
  ensureNum(req.alt, 'alt');
  ensureNum(req.creatinine, 'cr');
  ensureEnum(req.severity, 'sev', ['mild','severe','eclampsia','hellp','unknown','other','none']);
  ensureEnum(req.treatment, 'tx', ['observation','antihypertensives','magnesium','delivery','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function gestational_diabetes_mgmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.postprandial_glucose, 'ppg');
  ensureNum(req.hba1c, 'hba1c');
  ensureEnum(req.treatment, 'tx', ['diet','exercise','metformin','insulin','combination','other','unknown','none']);
  ensureNum(req.fetal_growth_percentile, 'fgp');
  ensureNum(req.amniotic_fluid, 'af');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function delivery_summary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.delivery_id, 'did');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.delivery_mode, 'dm', ['spontaneous_vaginal','assisted_vaginal','scheduled_csection','emergency_csection','vacuum','forceps','other','unknown']);
  ensureNum(req.blood_loss_ml, 'blm');
  ensureNum(req.apgar_1, 'a1');
  ensureNum(req.apgar_5, 'a5');
  ensureNum(req.birth_weight_grams, 'bwg');
  ensureEnum(req.complications, 'comp', ['none','postpartum_hemorrhage','perineal_tear','shoulder_dystocia','cord_prolapse','placental_abruption','uterine_rupture','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.delivery_id };
}

function funcs() { return { prenatal_visit, high_risk_pregnancy, preeclampsia, gestational_diabetes_mgmt, delivery_summary }; }
module.exports = { funcs, ValidationError };
