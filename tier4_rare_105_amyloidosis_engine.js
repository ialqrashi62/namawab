'use strict';
// TIER4_RARE-105 Amyloidosis
// AL, ATTRv, ATTRwt, AA, ALECT2, AFib
const CITATIONS = [
  { id: 'ISA-2024', source: 'International Society Amyloidosis - Amyloid nomenclature', year: 2024 },
  { id: 'JCS-2023', source: 'Japanese Circulation Society - Cardiac amyloidosis', year: 2023 },
  { id: 'NCCN-AL-2024', source: 'NCCN Guidelines - Light Chain Amyloidosis', year: 2024 }
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
function amyloidosisWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cardiac_involvement = input.cardiac_involvement === true;
  const renal_involvement = input.renal_involvement === true;
  const neuro_involvement = input.neuro_involvement === true;
  const monoclonal_band = ensureEnum(input, 'monoclonal_band', ['present', 'absent', 'pending']);
  const lvmass = ensureNumber(input, 'lvmass_g_m2', 0, 300);
  const gLS = ensureNumber(input, 'gLS_pct', 0, 30);
  const ntprobnp = ensureNumber(input, 'ntprobnp_pg_ml', 0, 50000);
  const suspicion = cardiac_involvement || renal_involvement || neuro_involvement;
  let type = 'pending_typing';
  if (monoclonal_band === 'present') type = 'likely_al';
  else if (monoclonal_band === 'absent' && cardiac_involvement) type = 'suspect_attr_wild_type';
  const workup = {
    biopsy_site: suspicion ? 'fat_pad_or_affected_organ' : 'not_indicated',
    typing_method: 'mass_spectrometry_gold_standard',
    immunohistochemistry: 'concurrent_with_ms',
    serum_free_light_chain: 'mandatory',
    serum_and_urine_immunofixation: 'mandatory',
    bone_marrow_biopsy: monoclonal_band === 'present',
    cardiac_mri: cardiac_involvement,
    pyrophosphate_scan: cardiac_involvement && monoclonal_band === 'absent',
    genetic_ttr: cardiac_involvement && monoclonal_band === 'absent'
  };
  return {
    module: 'tier4_rare_105_amyloid_workup',
    patient_id: patientId,
    suspicion,
    likely_type: type,
    labs: { lvmass, gLS, ntprobnp, monoclonal_band },
    organs: { cardiac: cardiac_involvement, renal: renal_involvement, neuro: neuro_involvement },
    workup,
    citations: CITATIONS
  };
}
function cardiacAmyloidStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'type', ['al', 'attrv', 'attrwt']);
  const ntprobnp = ensureNumber(input, 'ntprobnp_pg_ml', 0, 50000);
  const troponin = ensureNumber(input, 'troponin_ng_l', 0, 10000);
  const mayo_stage = (ntprobnp > 1800 ? 1 : 0) + (troponin > 25 ? 1 : 0);
  let stage = 'I';
  if (mayo_stage === 2) stage = 'III';
  else if (mayo_stage === 1) stage = 'II';
  return {
    module: 'tier4_rare_105_cardiac_stage',
    patient_id: patientId,
    type,
    mayo_stage,
    ntprobnp,
    troponin,
    prognosis: stage === 'I' ? 'median_survival_~5_years' : stage === 'II' ? 'median_survival_~3_years' : 'median_survival_~1_year',
    therapy_specific: {
      al: 'chemotherapy_plus_autologous_stem_cell_if_eligible',
      attrv: 'tafamidis_or_patients_select_vutrisiran',
      attrwt: 'tafamidis_recommended'
    },
    citations: CITATIONS
  };
}
function alAmyloidTherapy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cardiac_stage = ensureEnum(input, 'cardiac_stage', ['I', 'II', 'III']);
  const eligible_asct = input.eligible_asct === true;
  const renal_function = ensureNumber(input, 'egfr', 0, 120);
  const first_line = eligible_asct && cardiac_stage === 'I' && renal_function > 30
    ? 'autologous_stem_cell_transplant_likely'
    : 'dara_cybord_protocol';
  return {
    module: 'tier4_rare_105_al_therapy',
    patient_id: patientId,
    cardiac_stage,
    eligible_asct,
    egfr: renal_function,
    first_line,
    monitoring: {
      serum_flc_q1mo: true,
      cardiac_biomarkers_q3mo: true,
      organ_response_q6mo: true
    },
    hematology_referral: 'mandatory',
    citations: CITATIONS
  };
}
function attrSilencerTherapy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const variant = ensureEnum(input, 'variant', ['v122i', 't60a', 'v30m', 'wt']);
  const neuropathy = input.neuropathy === true;
  const cardiomyopathy = input.cardiomyopathy === true;
  const options = {
    tafamidis: 'stabilizer_61mg_oral_daily',
    vutrisiran: 'rnai_25mg_sc_q3mo',
    patisiran: 'rnai_0.3mg_kg_sc_q3wk',
    inotersen: 'antisense_300mg_sc_weekly_now_less_used'
  };
  const recommended = neuropathy ? 'patisiran_or_vutrisiran' : 'tafamidis_or_vutrisiran';
  return {
    module: 'tier4_rare_105_attr_therapy',
    patient_id: patientId,
    variant,
    neuropathy,
    cardiomyopathy,
    recommended,
    options,
    monitoring: {
      neuro_assessment_q6mo: neuropathy,
      cardiac_imaging_q6mo: cardiomyopathy,
      lft_q3mo: true,
      thrombocytopenia_watch: 'inotersen_only'
    },
    citations: CITATIONS
  };
}
function amyloidosisFamilyScreening(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'proband_type', ['attrv', 'afib', 'aalys', 'afap']);
  const inheritance = ['attrv', 'aalys', 'afap'].includes(type) ? 'autosomal_dominant' : 'varies';
  return {
    module: 'tier4_rare_105_family_screening',
    patient_id: patientId,
    proband_type: type,
    inheritance,
    first_degree_relatives: 'genetic_testing_plus_ekg_echo_baseline',
    predictive_testing_age: type === 'attrv' ? '18_to_21' : 'discuss_with_genetic_counselor',
    counseling: 'cardiac_and_neuro_surveillance_if_positive',
    citations: CITATIONS
  };
}
module.exports = {
  amyloidosisWorkup,
  cardiacAmyloidStaging,
  alAmyloidTherapy,
  attrSilencerTherapy,
  amyloidosisFamilyScreening,
  CITATIONS,
  ValidationError
};
