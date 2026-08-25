'use strict';
// TIER4_RARE-101 Lysosomal Storage Disorders
// Gaucher, Fabry, Pompe, MPS, Niemann-Pick, Tay-Sachs
const CITATIONS = [
  { id: 'NORD-LSD', source: 'National Organization for Rare Disorders - Lysosomal Storage Disorders', year: 2023 },
  { id: 'WINN-2022', source: 'Wynn et al. - Lysosomal disease management', year: 2022 },
  { id: 'AHA-2024', source: 'American Heart Association - Fabry cardiomyopathy', year: 2024 }
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
function lysosomalDiseaseManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const disease = ensureEnum(input, 'disease', ['gaucher', 'fabry', 'pompe', 'mps1', 'mps2', 'niemann_pick', 'tay_sachs']);
  const age = ensureNumber(input, 'age', 0, 120);
  const enzyme_activity = ensureNumber(input, 'enzyme_activity_pct', 0, 100);
  const substrate_burden = ensureNumber(input, 'substrate_burden_score', 0, 100);
  const organ_involvement = Array.isArray(input.organ_involvement) ? input.organ_involvement : [];
  const on_ert = input.on_enzyme_replacement === true;
  const on_srt = input.on_substrate_reduction === true;
  const diagnosis_delay_years = ensureNumber(input, 'diagnosis_delay_years', 0, 60);
  let severity = 'mild';
  if (substrate_burden > 50 || enzyme_activity < 10) severity = 'severe';
  else if (substrate_burden > 25 || enzyme_activity < 30) severity = 'moderate';
  let therapy = 'enzyme_replacement_therapy';
  if (disease === 'fabry' || disease === 'gaucher') therapy = 'enzyme_replacement_therapy';
  if (disease === 'mps1' || disease === 'mps2') therapy = 'ert_plus_stem_cell_evaluation';
  if (disease === 'tay_sachs') therapy = 'supportive_palliative';
  if (disease === 'niemann_pick_c') therapy = 'substrate_reduction_therapy';
  const biomarkers = {
    glucosylsphingosine: disease === 'gaucher' ? 'elevated' : 'not_applicable',
    lyso_gb3: disease === 'fabry' ? 'elevated' : 'not_applicable',
    hexosaminidase_a: disease === 'tay_sachs' ? 'deficient' : 'normal',
    ck: organ_involvement.includes('muscle') ? 'elevated' : 'normal',
    urinary_gag: ['mps1', 'mps2'].includes(disease) ? 'elevated' : 'normal'
  };
  const monitoring = {
    imaging_q6mo: organ_involvement.some(o => ['heart', 'liver', 'spleen', 'lung'].includes(o)),
    neuro_q3mo: organ_involvement.includes('cns'),
    echo_annual: organ_involvement.includes('heart'),
    pft_annual: organ_involvement.includes('lung'),
    ergt_q2wk: on_ert
  };
  const flags = [];
  if (severity === 'severe' && !on_ert && !on_srt) flags.push('HIGH_PRIORITY_INITIATE_ERT');
  if (diagnosis_delay_years > 10) flags.push('DIAGNOSTIC_ODYSSEY_REVIEW');
  if (disease === 'pompe' && organ_involvement.includes('muscle')) flags.push('PULMONARY_FOLLOWUP_REQUIRED');
  return {
    module: 'tier4_rare_101_lysosomal',
    patient_id: patientId,
    disease,
    severity,
    therapy,
    biomarkers,
    monitoring,
    flags,
    citations: CITATIONS
  };
}
function fabryCardiacRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const lvh_mm = ensureNumber(input, 'lvw_mm', 0, 30);
  const lge_present = input.lge_present === true;
  const troponin = ensureNumber(input, 'troponin_ng_l', 0, 10000);
  const ntprobnp = ensureNumber(input, 'ntprobnp_pg_ml', 0, 50000);
  let stage = 'normal';
  if (lge_present || lvh_mm > 15) stage = 'advanced_fibrosis';
  else if (lvh_mm > 13) stage = 'early_hypertrophy';
  else if (lvh_mm > 11) stage = 'incipient';
  let risk = 'low';
  if (stage === 'advanced_fibrosis' || ntprobnp > 2000) risk = 'high';
  else if (stage === 'early_hypertrophy' || ntprobnp > 500) risk = 'moderate';
  const monitoring = {
    echo_q6mo: stage !== 'normal',
    cmr_annual: stage !== 'normal',
    holter_annual: true,
    crp_q3mo: true
  };
  const therapy = {
    ert: input.on_ert === true ? 'continue' : 'initiate_recommended',
    adjunct: stage === 'advanced_fibrosis' ? 'consider_ACE_inhibitor' : 'none'
  };
  return {
    module: 'tier4_rare_101_fabry_cardiac',
    patient_id: patientId,
    stage,
    risk,
    monitoring,
    therapy,
    citations: CITATIONS
  };
}
function gaucherTypeClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const neuro_findings = Array.isArray(input.neuro_findings) ? input.neuro_findings : [];
  const has_neuro = neuro_findings.length > 0;
  const type = has_neuro ? (input.age_at_diagnosis < 5 ? 'type2_acute_neuropathic' : 'type3_chronic_neuropathic') : 'type1_non_neuropathic';
  const imaging = {
    bone_marrow_burden: ensureNumber(input, 'bone_marrow_burden_score', 0, 16),
    spleen_volume_ml: ensureNumber(input, 'spleen_volume_ml', 0, 5000),
    liver_volume_ml: ensureNumber(input, 'liver_volume_ml', 0, 10000)
  };
  let therapy = 'enzyme_replacement_ert';
  if (type === 'type2_acute_neuropathic') therapy = 'supportive_only_ERT_limited_benefit';
  if (type === 'type3_chronic_neuropathic') therapy = 'high-dose_ERT_plus_substrate_reduction';
  return {
    module: 'tier4_rare_101_gaucher_type',
    patient_id: patientId,
    type,
    imaging,
    therapy,
    citations: CITATIONS
  };
}
function newbornScreeningLSD(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const screening_result = ensureEnum(input, 'screening_result', ['positive', 'negative', 'borderline']);
  const confirmatory_test = ensureEnum(input, 'confirmatory_test', ['pending', 'enzymatic', 'genetic', 'normal']);
  const diseases_to_screen = ['gaucher', 'fabry', 'pompe', 'mps1', 'mps2', 'niemann_pick_a_b'];
  const action = screening_result === 'positive' && confirmatory_test === 'enzymatic'
    ? 'URGENT_REFER_TO_LSD_CENTER'
    : screening_result === 'positive' && confirmatory_test === 'genetic'
    ? 'CONFIRMED_ERT_CANDIDATE'
    : screening_result === 'borderline'
    ? 'REPEAT_TEST_IN_2_WEEKS'
    : 'ROUTINE_FOLLOWUP';
  return {
    module: 'tier4_rare_101_nbs_lsd',
    patient_id: patientId,
    screening_result,
    confirmatory_test,
    diseases_screened: diseases_to_screen,
    action,
    citations: CITATIONS
  };
}
function familyScreeningLSD(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const proband_disease = ensureEnum(input, 'proband_disease', ['gaucher', 'fabry', 'pompe', 'mps1', 'mps2']);
  const inheritance = 'autosomal_recessive';
  const x_linked = proband_disease === 'fabry';
  const relatives_to_screen = ['parents', 'siblings', 'children'];
  if (x_linked) relatives_to_screen.push('maternal_uncles', 'maternal_cousins');
  return {
    module: 'tier4_rare_101_family_screening',
    patient_id: patientId,
    proband_disease,
    inheritance: x_linked ? 'x_linked' : 'autosomal_recessive',
    relatives_to_screen,
    testing: 'enzyme_activity_plus_gene_panel',
    cascade_initiated: true,
    citations: CITATIONS
  };
}
module.exports = {
  lysosomalDiseaseManagement,
  fabryCardiacRisk,
  gaucherTypeClassification,
  newbornScreeningLSD,
  familyScreeningLSD,
  CITATIONS,
  ValidationError
};
