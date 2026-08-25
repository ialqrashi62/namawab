// filepath: tier28_obstetrics_ext_173_prenatal_engine.js
// TIER28_OBSTETRICS-173: Prenatal care, visits, screening
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function prenatal_visit(req) {
  ensureStr(req.visit_id, 'visit_id');
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureNumber(req.weight_kg, 'weight');
  ensureNumber(req.bp_systolic, 'bp_s');
  ensureNumber(req.bp_diastolic, 'bp_d');
  ensureNumber(req.urine_protein, 'protein');
  ensureNumber(req.fundal_height_cm, 'fh');
  ensureEnum(req.heart_tone, 'heart_tone', ['present_normal','present_tachy','present_brady','absent','unknown','other']);
  ensureBool(req.edema, 'edema');
  let status;
  if (req.bp_systolic >= 160 || req.bp_diastolic >= 110) status = 'severe_preeclampsia_emergent';
  else if (req.urine_protein >= 3) status = 'severe_proteinuria_preeclampsia_review';
  else if (req.heart_tone === 'absent' && req.gestational_age_weeks > 24) status = 'no_fetal_heart_tone_urgent_eval';
  else if (req.gestational_age_weeks >= 24 && req.fundal_height_cm < req.gestational_age_weeks / 4 - 4) status = 'fundal_height_low_iufgr_review';
  else status = 'prenatal_visit_normal';
  return { status, gw: req.gestational_age_weeks };
}

function prenatal_screening(req) {
  ensureStr(req.screening_id, 'screening_id');
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureBool(req.first_trimester_screen, 'fts');
  ensureBool(req.cf_dna, 'cfdna');
  ensureBool(req.quad_screen, 'quad');
  ensureEnum(req.gdm_screen, 'gdm_screen', ['not_done','normal','abnormal_1hr','abnormal_3hr_gdm','abnormal_3hr_iggt','other']);
  ensureBool(req.gbs_done, 'gbs');
  let status;
  if (req.gestational_age_weeks >= 24 && req.gdm_screen === 'not_done') status = 'gdm_screen_missing_24_28w';
  else if (req.gestational_age_weeks >= 36 && req.gbs_done === false) status = 'gbs_screen_missing_36_37w';
  else if (req.gestational_age_weeks >= 11 && req.gestational_age_weeks <= 13 && !req.fts && !req.cf_dna) status = 'first_trimester_screening_missing';
  else status = 'screening_appropriate';
  return { status, gw: req.gestational_age_weeks };
}

function ultrasound(req) {
  ensureStr(req.us_id, 'us_id');
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureEnum(req.us_type, 'us_type', ['dating','first_trimester','anatomy','growth','bpp','doppler','biophysical','fetal_echo','twin','other']);
  ensureNumber(req.efw_g, 'efw');
  ensureNumber(req.amniotic_fluid_index, 'afi');
  ensureBool(req.fetal_anomaly, 'anomaly');
  let status;
  if (req.us_type === 'anatomy' && req.fetal_anomaly) status = 'anomaly_detailed_review_fetal_mri_or_refer';
  else if (req.amniotic_fluid_index < 5) status = 'oligohydramnios_review';
  else if (req.amniotic_fluid_index > 24) status = 'polyhydramnios_review';
  else if (req.us_type === 'growth' && req.efw_g < 2500) status = 'efw_low_iufgr_review';
  else status = 'ultrasound_appropriate';
  return { status, us: req.us_type };
}

function high_risk_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.risk_factor, 'risk_factor', ['advanced_age','obesity','diabetes','hypertension','thyroid','autoimmune','previous_preeclampsia','previous_cesarean','multiple_gestation','ivf','smoking','substance_use','other']);
  ensureEnum(req.severity, 'severity', ['low','moderate','high','very_high','other']);
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureEnum(req.referral, 'referral', ['none','maternal_fetal_medicine','genetic_counselor','diabetes_clinic','hypertension_clinic','social_work','mental_health','other']);
  ensureBool(req.plan_documented, 'plan');
  let status;
  if (req.severity === 'very_high' && req.referral === 'none') status = 'very_high_risk_mfm_required';
  else if (req.risk_factor === 'multiple_gestation' && req.referral === 'none') status = 'twins_mfm_referral_required';
  else if (!req.plan_documented) status = 'plan_documentation_required';
  else status = 'high_risk_reviewed';
  return { status, risk: req.risk_factor };
}

function vaccination(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.vaccine, 'vaccine', ['tdap','influenza','covid','rsv','hepatitis_b','varicella_pre','mmr_pre','other']);
  ensureNumber(req.gestational_age_weeks, 'gw');
  ensureBool(req.contraindicated, 'contra');
  ensureEnum(req.timing, 'timing', ['preconception','first_trimester','second_trimester','third_trimester','postpartum','other']);
  ensureBool(req.documented, 'doc');
  let status;
  if (req.timing === 'first_trimester' && req.vaccine === 'mmr_pre') status = 'mmr_live_vaccine_contraindicated';
  else if (req.vaccine === 'tdap' && req.timing !== 'third_trimester' && req.gestational_age_weeks >= 27) status = 'tdap_third_trimester_27_36';
  else if (req.timing === 'preconception' && req.contraindicated) status = 'preconception_review_vaccines';
  else status = 'vaccine_appropriate';
  return { status, vacc: req.vaccine };
}

const CITATIONS = { ACOG_PRENATAL_2024: 'ACOG Prenatal 2024', CDC_VAC_2024: 'CDC Pregnancy Vaccines 2024' };

function funcs() { return { prenatal_visit, prenatal_screening, ultrasound, high_risk_pregnancy, vaccination }; }
module.exports = { funcs, CITATIONS, ValidationError };