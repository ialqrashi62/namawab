// filepath: tier5_rare_ext_106_neuro_engine.js
// TIER5_RARE_EXT-106: Rare neuro (Huntington, ALS, SMA, muscular dystrophy, ataxia)
'use strict';

const CITATIONS = [
  'Huntington_LOE_2019',
  'McDermott_ALS_2019',
  'SMA_2019_Nusinersen_Zolgensma',
  'Bushby_DMD_2018',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function huntington_test(req) {
  ensureNumber(req.cag_repeat_count, 'cag_repeat_count');
  ensureBool(req.family_history_hd, 'family_history_hd');
  ensureBool(req.chorea_present, 'chorea_present');
  ensureNumber(req.age_years, 'age_years');

  let verdict;
  if (req.cag_repeat_count < 27) verdict = 'normal';
  else if (req.cag_repeat_count <= 35) verdict = 'intermediate_or_reduced_penetrance';
  else if (req.cag_repeat_count <= 39) verdict = 'reduced_penetrance_genetic_counseling';
  else verdict = 'full_penetrance_diagnosis_confirmed';

  let approach;
  if (req.chorea_present && req.cag_repeat_count > 35 && req.age_years >= 21) approach = 'symptomatic_treatment_deutetrabenazine_tiapride_with_genetic_counseling';
  else if (req.cag_repeat_count > 35 && req.family_history_hd) approach = 'pre_motor_genetic_counseling_observation';
  else approach = 'continue_monitoring_or_refer_genetic_counseling';

  return { cag_repeat_count: req.cag_repeat_count, age_years: req.age_years, verdict, approach, citation: CITATIONS[0] };
}

function als_score(req) {
  ensureNumber(req.alfsrs_score, 'alfsrs_score'); // ALSFRS-R score
  ensureNumber(req.fvc_pct, 'fvc_pct');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.months_since_symptoms, 'months_since_symptoms');
  ensureNumber(req.progress_rate, 'progress_rate'); // Δpoints/month

  let severity;
  if (req.alfsrs_score >= 35) severity = 'mild_functional_independency';
  else if (req.alfsrs_score >= 25) severity = 'moderate_limited_assistance';
  else if (req.alfsrs_score >= 15) severity = 'severe_assistive_required';
  else severity = 'end_stage_consider_palliative';

  let action;
  if (req.months_since_symptoms < 18 && req.alfsrs_score >= 25) action = 'riluzole_plus_edavarone_or_RNA_therapy_AVS_OR_FUS_FOR_GENETIC_SUBTYPES';
  else action = 'riluzole_edavarone_palliative_respiratory';

  return {
    alfsrs_score: req.alfsrs_score,
    fvc_pct: req.fvc_pct,
    bmi: req.bmi,
    severity,
    action,
    progress_rate_per_month: req.progress_rate,
    citation: CITATIONS[1],
  };
}

function sma_management(req) {
  ensureStr(req.sma_type, 'sma_type');
  ensureEnum(req.sma_type, 'sma_type', ['1','2','3','4','preclin']);
  ensureNumber(req.smn1_copy_no, 'smn1_copy_no');
  ensureNumber(req.chop_intend_score, 'chop_intend_score');
  ensureNumber(req.age_months, 'age_months');

  let approach;
  if (req.sma_type === '1' && req.age_months <= 6 && req.smn1_copy_no < 2) approach = 'zolgensma_gene_replacement_therapy_or_nusinersen_or_risdiplam';
  else if (req.sma_type === '2') approach = 'nusinersen_or_risdiplam_walking_and_functional_preservation';
  else if (req.sma_type === '3') approach = 'risdiplam_or_nusinersen_with_rehab_ambulation';
  else if (req.sma_type === 'preclin') approach = 'pre_symptomatic_initiate_gene_replacement_or_nusinersen_immediately';
  else approach = 'rehab_supportive_care';

  return { sma_type: req.sma_type, smn1_copy_no: req.smn1_copy_no, chop_intend_score: req.chop_intend_score, approach, citation: CITATIONS[2] };
}

function dmd_classification(req) {
  ensureNumber(req.ck, 'ck');
  ensureNumber(req.dystrophin_test_result_count, 'dystrophin_test_result_count'); // gene variant
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['duchenne','becker','female_carrier_other','other']);
  ensureBool(req.heart_involvement, 'heart_involvement');
  ensureBool(req.spine_scoliosis, 'spine_scoliosis');

  let approach;
  if (req.diagnosis === 'duchenne') approach = 'steroid_prednisone_or_deflazacort_with_rehab_and_cardiology_review_5_yrs_then_consider_eteplirsen_for_skip_1_mutations';
  else if (req.diagnosis === 'becker') approach = 'rehab_cardio_review_consider_cardio_acei_while_remaining_ambulatory';
  else if (req.diagnosis === 'female_carrier_other') approach = 'cardiology_review_every_3_yrs';
  else approach = 'observe_with_residual_followup';

  return { diagnosis: req.diagnosis, ck: req.ck, dystrophin_test_result_count: req.dystrophin_test_result_count, heart_involvement: req.heart_involvement, approach, citation: CITATIONS[3] };
}

function ataxia_screen(req) {
  ensureNumber(req.scale_for_assessment_and_rating_of_ataxia, 'scale_for_assessment_and_rating_of_ataxia');
  ensureStr(req.symptom_onset_age, 'symptom_onset_age');
  ensureEnum(req.symptom_onset_age, 'symptom_onset_age', ['pediatric','adult_variants','post_infection','vascular']);
  ensureStr(req.genetic_testing_done, 'genetic_testing_done');
  ensureEnum(req.genetic_testing_done, 'genetic_testing_done', ['done_positive','done_negative','pending','declined']);

  let diagnosis;
  if (req.genetic_testing_done === 'done_positive') diagnosis = 'hereditary_ataxia_known_genetic_mutation_management_per_mut_spec';
  else if (req.symptom_onset_age === 'pediatric' && req.scale_for_assessment_and_rating_of_ataxia >= 10) diagnosis = 'pediatric_ataxia_evaluate_Friedreichs_ataxia_or_ataxia_telangiectasia';
  else if (req.symptom_onset_age === 'post_infection') diagnosis = 'acute_post_infectious_ataxia_steroid_or_IVIG_consider';
  else if (req.symptom_onset_age === 'vascular') diagnosis = 'cerebellar_stroke_consider_anti_coagulation_or_thrombectomy';
  else if (req.genetic_testing_done === 'pending' && req.symptom_onset_age === 'adult_variants') diagnosis = 'MSA_C_or_SCA_consider_wait_test_results';
  else diagnosis = 'idiopathic_ataxia_review_differential';

  return { diagnosis, citation: CITATIONS };
}

function funcs() {
  return { huntington_test, als_score, sma_management, dmd_classification, ataxia_screen };
}

module.exports = { funcs, CITATIONS, ValidationError };
