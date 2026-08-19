// filepath: tier84_psych_ext_446_psych_sud_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function alcohol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.drinks_per_day, 'dpd');
  ensureNum(req.drinks_per_week, 'dpw');
  ensureNum(req.audit_score, 'as');
  ensureNum(req.last_drink_days, 'lld');
  ensureBool(req.withdrawal_present, 'wp');
  ensureEnum(req.ciwa_ar_score, 'cwa', ['minimal','mild','moderate','severe','unknown','other']);
  ensureNum(req.bac_level, 'bac');
  ensureEnum(req.treatment, 'tx', ['detox','inpatient_rehab','outpatient_rehab','aa','counseling','naltrexone','acamprosate','disulfiram','combination','observation','other']);
  ensureStr(req.plan, 'plan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function opioid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.opioid_type, 'ot', ['heroin','oxycodone','hydrocodone','morphine','fentanyl','methadone','buprenorphine','codeine','other','unknown']);
  ensureNum(req.duration_years, 'dur');
  ensureNum(req.last_use_days, 'lud');
  ensureNum(req.cows_score, 'cws');
  ensureEnum(req.treatment, 'tx', ['buprenorphine','methadone','naltrexone','detox','inpatient_rehab','outpatient','naloxone_kit','harm_reduction','combination','other']);
  ensureBool(req.overdose_history, 'oh');
  ensureBool(req.naloxone_prescribed, 'np');
  ensureBool(req.fentanyl_test_strip, 'fts');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cannabis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.use_per_week, 'upw');
  ensureNum(req.years_use, 'yu');
  ensureBool(req.last_use_24h, 'lu');
  ensureEnum(req.use_motivation, 'um', ['medical','recreational','addiction','self_medication','other','unknown']);
  ensureBool(req.dependence_present, 'dp');
  ensureBool(req.cessation_attempt, 'ca');
  ensureNum(req.cannabis_use_disorder_score, 'cuds');
  ensureEnum(req.treatment, 'tx', ['cbt','motivation_enhancement','contingency_management','support_group','combination','observation','other']);
  ensureBool(req.comorbid_psych, 'cp');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function stimulant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['cocaine','methamphetamine','amphetamine','mdma','other','unknown']);
  ensureNum(req.years_use, 'yu');
  ensureNum(req.last_use_days, 'lud');
  ensureBool(req.injection_use, 'iu');
  ensureNum(req.use_per_week, 'upw');
  ensureBool(req.psychotic_symptoms, 'ps');
  ensureEnum(req.treatment, 'tx', ['cm','matrix_model','cbt','support_group','detox','inpatient_rehab','outpatient','combination','other']);
  ensureBool(req.comorbid_adhd, 'ca');
  ensureBool(req.comorbid_bipolar, 'cb');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function dual_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.psychiatric_diagnosis, 'pd');
  ensureStr(req.substance_diagnosis, 'sd');
  ensureNum(req.duration_years, 'dur');
  ensureBool(req.severity_psychiatric, 'sp');
  ensureBool(req.severity_substance, 'ss');
  ensureBool(req.integrated_treatment, 'it');
  ensureEnum(req.treatment_plan, 'tp', ['integrated','sequential','parallel','referral','observation','combination','other']);
  ensureBool(req.medications_for_sud, 'mfs');
  ensureBool(req.medications_for_psych, 'mfp');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { alcohol, opioid, cannabis, stimulant, dual_diagnosis }; }
module.exports = { funcs, ValidationError };