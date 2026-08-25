'use strict';
// TIER4_GI-103 Hepatology
const CITATIONS = [
  { id: 'AASLD-2024', source: 'American Association Liver Disease', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function cirrhosisAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const meld = ensureNumber(input, 'meld_score', 0, 50);
  const child = ensureEnum(input, 'child_pugh', ['A', 'B', 'C']);
  const ascites = ensureEnum(input, 'ascites', ['none', 'mild', 'moderate', 'refractory']);
  const he = ensureEnum(input, 'hepatic_encephalopathy', ['none', 'grade_1', 'grade_2', 'grade_3', 'grade_4']);
  const varices = input.esophageal_varices === true;
  let treatment = 'decompensated_cirrhosis_refer_transplant';
  if (child === 'A' && meld < 10) treatment = 'compensated_surveillance_q6mo';
  else if (child === 'A' || child === 'B') treatment = 'maintenance_breath_alf_evaluation';
  return {
    module: 'tier4_gi_103_cirrhosis',
    patient_id: patientId,
    meld,
    child_pugh: child,
    ascites,
    hepatic_encephalopathy: he,
    varices,
    treatment,
    monitoring: 'q3mo_meld_labs_q6mo_us_alpha_feto',
    citations: CITATIONS
  };
}
function hepatitisCare(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'type', ['hepb_chronic', 'hepb_acute', 'hepc_chronic', 'hepc_treated', 'nafld_nash', 'alcoholic_liver', 'aiha', 'pbc', 'psc']);
  const viral_load = ensureNumber(input, 'viral_load_iu', 0, 50000000);
  const alt = ensureNumber(input, 'alt', 0, 1000);
  const fibrosis = ensureEnum(input, 'fibrosis_stage', ['f0', 'f1', 'f2', 'f3', 'f4']);
  const therapy = {
    hepb_chronic: fibrosis === 'f2' || viral_load > 2000 ? 'tenofovir_or_entecavir_lifelong' : 'observe_q6mo',
    hepb_acute: 'supportive_rare_antiviral',
    hepc_chronic: 'treatment_eligible_daa_8_to_12wk',
    hepc_treated: 'sustained_virologic_response_q12_post',
    nafld_nash: fibrosis === 'f2' || fibrosis === 'f3' ? 'resmetirom_or_pioglitazone_vitamin_e' : 'weight_loss_5_10',
    alcoholic_liver: 'complete_abstinence_nutrition',
    aiha: 'prednisone_azathioprine',
    pbc: 'ursodeoxycholic_acid_obeticholic_if_failure',
    psc: 'mrcp_surveillance_cholangiocarcinoma'
  };
  return {
    module: 'tier4_gi_103_hepatitis',
    patient_id: patientId,
    type,
    viral_load,
    alt,
    fibrosis,
    therapy: therapy[type],
    monitoring: 'q3mo_labs_q1y_fibrosis_assessment',
    citations: CITATIONS
  };
}
function ascitesManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const grade = ensureEnum(input, 'ascites_grade', ['1', '2', '3']);
  const sodium = ensureNumber(input, 'sodium', 0, 200);
  const cre = ensureNumber(input, 'creatinine', 0, 20);
  const therapy = (grade === '1') ? 'sodium_restriction_only' :
    (grade === '2') ? 'sodium_restriction_or_diuretics_aldactone_then_furosemide' :
    'large_volume_paracentesis_albumin_8g_per_l_third_space_then_lvp_5L_lap';
  return {
    module: 'tier4_gi_103_ascites',
    patient_id: patientId,
    ascites_grade: grade,
    sodium,
    creatinine: cre,
    therapy,
    monitoring: 'daily_weights_q3mo_labs',
    citations: CITATIONS
  };
}
function hepaticEncephalopathy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const grade = ensureNumber(input, 'westhaven_grade', 0, 4);
  const ammonia = ensureNumber(input, 'ammonia', 0, 500);
  const trigger = ensureEnum(input, 'trigger', ['infection', 'gi_bleeding', 'constipation', 'dehydration', 'medication', 'unknown', 'other']);
  const therapy = (grade >= 3) ? 'iv_lactulose_or_rifaximin_intensive_care_then_oral' :
    (grade >= 1) ? 'oral_lactulose_rifaximin' : 'no_therapy_monitoring';
  return {
    module: 'tier4_gi_103_he',
    patient_id: patientId,
    westhaven_grade: grade,
    ammonia,
    trigger,
    therapy,
    monitoring: 'q4_to_12h_neuro_q3mo_labs',
    citations: CITATIONS
  };
}
module.exports = {
  cirrhosisAssessment,
  hepatitisCare,
  ascitesManagement,
  hepaticEncephalopathy,
  CITATIONS,
  ValidationError
};
