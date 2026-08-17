// filepath: tier28_obstetrics_ext_175_gynecology_engine.js
// TIER28_OBSTETRICS-175: Gynecology, contraception, menopause, screening
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function contraception(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.method, 'method', ['none','iud_copper','iud_levonorgestrel','implant','injection','pill_combined','pill_progestin','patch','ring','condom','diaphragm','fertility_awareness','sterilization','emergency','other']);
  ensureNumber(req.age, 'age');
  ensureBool(req.smoking, 'smoking');
  ensureBool(req.hypertension, 'htn');
  ensureBool(req.migraine_with_aura, 'migraine');
  ensureEnum(req.us_medical_eligibility, 'mec', ['mec_1','mec_2','mec_3','mec_4','unknown','other']);
  let status;
  if (req.method === 'pill_combined' && req.age > 35 && req.smoking) status = 'chc_smoking_over_35_contraindicated';
  else if (req.method === 'pill_combined' && req.migraine_with_aura) status = 'chc_migraine_aura_contraindicated';
  else if (req.method === 'pill_combined' && req.hypertension) status = 'chc_htn_relative_contraindication';
  else if (req.us_medical_eligibility === 'mec_4') status = 'mec_4_method_contraindicated';
  else status = 'contraception_appropriate';
  return { status, method: req.method };
}

function cervical_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.test_type, 'test_type', ['pap_only','hpv_only','co_test','none','other']);
  ensureEnum(req.result, 'result', ['normal','ascus','lsil','hsil','asc_h','agc','hpv_positive','hpv_negative','other']);
  ensureEnum(req.previous_result, 'previous_result', ['normal','ascus','lsil','hsil','asc_h','agc','hpv_positive','hpv_negative','unknown','other']);
  ensureNumber(req.years_since_last, 'years_since_last');
  let status;
  if (req.age < 21 && req.test_type !== 'none') status = 'under_21_no_routine_screening';
  else if (req.age >= 30 && req.years_since_last > 5 && req.test_type === 'none') status = 'co_test_every_5y_required';
  else if (req.result === 'hsil' || req.result === 'asc_h') status = 'colposcopy_required';
  else if (req.result === 'agc') status = 'colposcopy_endometrial_biopsy';
  else status = 'cervical_screening_appropriate';
  return { status, res: req.result };
}

function menopause(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureBool(req.amenorrhea_12mo, 'amenorrhea');
  ensureEnum(req.symptoms, 'symptoms', ['none','hot_flashes','vaginal_dryness','sleep_disturbance','mood','cognitive','joint_pain','libido','other']);
  ensureBool(req.ht_appropriate, 'ht_appr');
  ensureBool(req.contraindication, 'contra');
  let status;
  if (req.ht_appropriate && req.contraindication) status = 'ht_contraindicated_review_options';
  else if (req.amenorrhea_12mo && req.symptoms === 'hot_flashes' && req.age < 60) status = 'menopausal_symptoms_ht_recommended';
  else if (req.age < 45 && req.amenorrhea_12mo) status = 'premature_ovarian_insufficiency_review';
  else status = 'menopause_reviewed';
  return { status, age: req.age };
}

function abnormal_bleeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.pattern, 'pattern', ['amenorrhea','oligomenorrhea','menorrhagia','metrorrhagia','polymenorrhea','postcoital','postmenopausal','other']);
  ensureNumber(req.hemoglobin, 'hb');
  ensureBool(req.pregnancy_test, 'preg');
  ensureBool(req.ultrasound_done, 'us');
  ensureBool(req.biopsy_indicated, 'biopsy');
  let status;
  if (req.hemoglobin < 8) status = 'severe_anemia_transfuse_workup';
  else if (req.pattern === 'postmenopausal' && !req.biopsy_indicated) status = 'postmenopausal_bleeding_biopsy_required';
  else if (req.pattern === 'menorrhagia' && !req.ultrasound_done) status = 'pelvic_ultrasound_required';
  else if (req.pattern === 'amenorrhea' && !req.pregnancy_test) status = 'pregnancy_test_required';
  else status = 'abnormal_bleeding_reviewed';
  return { status, pattern: req.pattern };
}

function pcos(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rotterdam, 'rotterdam', ['classic_pcos','ovulatory_pcos','normo_androgenic_pcos','not_pcos','unknown','other']);
  ensureBool(req.irregular_cycles, 'irregular');
  ensureBool(req.hyperandrogenism_clinical, 'hyperand_clin');
  ensureBool(req.polycystic_ovaries_us, 'pco_us');
  ensureBool(req.metabolic_syndrome, 'metabolic');
  let status;
  if (req.rotterdam === 'classic_pcos' && req.metabolic_syndrome) status = 'pcos_metabolic_lifestyle_metformin';
  else if (req.rotterdam === 'not_pcos') status = 'pcos_excluded_review_other_causes';
  else if (!req.irregular_cycles && !req.hyperandrogenism_clinical && !req.polycystic_ovaries_us) status = 'two_of_three_required_for_pcos';
  else status = 'pcos_assessed';
  return { status, r: req.rotterdam };
}

const CITATIONS = { ACOG_GYN_2024: 'ACOG Gynecology 2024', USPSTF_CERVICAL_2024: 'USPSTF Cervical 2024' };

function funcs() { return { contraception, cervical_screening, menopause, abnormal_bleeding, pcos }; }
module.exports = { funcs, CITATIONS, ValidationError };