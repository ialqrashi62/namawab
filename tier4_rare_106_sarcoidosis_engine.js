'use strict';
// TIER4_RARE-106 Sarcoidosis
// Pulmonary, cardiac, neuro, ocular, cutaneous
const CITATIONS = [
  { id: 'WASOG-2023', source: 'World Association of Sarcoidosis and Other Granulomatous Diseases', year: 2023 },
  { id: 'HRS-Cardiac-Sarc', source: 'Heart Rhythm Society - Cardiac Sarcoidosis', year: 2024 },
  { id: 'ERS-2021', source: 'European Respiratory Society - Sarcoidosis', year: 2021 }
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
function sarcoidosisPhenotyping(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const organs = {
    lung: input.lung_involvement === true,
    cardiac: input.cardiac_involvement === true,
    neuro: input.neuro_involvement === true,
    eye: input.eye_involvement === true,
    skin: input.skin_involvement === true,
    liver: input.liver_involvement === true,
    joint: input.joint_involvement === true
  };
  const acc = (input.acc > 0 ? Number(input.acc) : 0);
  const ace = ensureNumber(input, 'ace_level', 0, 200);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const organ_count = Object.values(organs).filter(Boolean).length;
  const imaging = {
    cxr_stage: ensureEnum(input, 'cxr_stage', ['0', 'I', 'II', 'III', 'IV']),
    hila_adenopathy: input.hilar_adenopathy === true,
    parenchymal_changes: input.parenchymal_changes === true
  };
  return {
    module: 'tier4_rare_106_sarcoid_phenotype',
    patient_id: patientId,
    organs,
    organ_count,
    biomarkers: { acc, ace, crp },
    imaging,
    disease_extent: organ_count >= 3 ? 'multisystem' : (organ_count >= 2 ? 'multisystem' : 'single_organ'),
    citations: CITATIONS
  };
}
function cardiacSarcoidosisManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const av_block = ensureEnum(input, 'av_block', ['none', 'first_degree', 'second_degree', 'complete']);
  const lge_present = input.lge_present === true;
  const lv_ef = ensureNumber(input, 'lv_ef', 0, 80);
  const symptomatic = input.symptomatic === true;
  const pacemaker_indicated = av_block === 'complete' || av_block === 'second_degree';
  const icd_indicated = lge_present && lv_ef < 35;
  const immunosuppression = symptomatic || lge_present || av_block !== 'none'
    ? 'prednisone_0.5_mg_kg_then_taper_plus_mtx_or_azathioprine'
    : 'observe_only_if_asymptomatic_no_lge';
  return {
    module: 'tier4_rare_106_cardiac_sarc',
    patient_id: patientId,
    av_block,
    lge_present,
    lv_ef,
    symptomatic,
    pacemaker_indicated,
    icd_indicated,
    immunosuppression,
    monitoring: {
      echo_q3mo: lv_ef < 50,
      holter_annual: true,
      deferred_pet_if_flare: true,
      cmr_annual: lge_present
    },
    citations: CITATIONS
  };
}
function pulmonarySarcoidStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const scadding_stage = ensureEnum(input, 'scadding_stage', ['0', 'I', 'II', 'III', 'IV']);
  const fvc = ensureNumber(input, 'fvc_pct', 0, 150);
  const dlco = ensureNumber(input, 'dlco_pct', 0, 150);
  const symptoms = input.symptomatic === true;
  const therapy = (scadding_stage === 'I' && !symptoms) ? 'observe_q6mo_followup'
    : (scadding_stage === 'II' || scadding_stage === 'III') ? 'prednisone_20_40mg_then_taper'
    : (scadding_stage === 'IV') ? 'antifibrotic_consider_nintedanib_plus_oxygen'
    : 'observe';
  return {
    module: 'tier4_rare_106_pulmonary_sarc',
    patient_id: patientId,
    scadding_stage,
    fvc,
    dlco,
    therapy,
    monitoring: {
      pft_q3mo: true,
      six_min_walk_q6mo: fvc < 70,
      ct_q12mo: scadding_stage === 'IV'
    },
    citations: CITATIONS
  };
}
function neurosarcoidosisWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const csf_pleocytosis = input.csf_pleocytosis === true;
  const csf_protein = ensureNumber(input, 'csf_protein_mg_dl', 0, 500);
  const mri_enhancement = input.mri_enhancement === true;
  const cranial_nerve = input.cranial_nerve === true;
  const probable = (csf_pleocytosis && mri_enhancement) || (cranial_nerve && mri_enhancement);
  const biopsy = probable ? 'consider_if_therapy_response_poor' : 'recommended_to_confirm';
  return {
    module: 'tier4_rare_106_neuro_sarc',
    patient_id: patientId,
    csf_pleocytosis,
    csf_protein,
    mri_enhancement,
    cranial_nerve,
    probable_neurosarcoidosis: probable,
    biopsy_needed: biopsy,
    initial_therapy: probable ? 'iv_methylpred_1g_x3_then_oral_prednisone' : 'await_biopsy',
    citations: CITATIONS
  };
}
function sarcoidTreatmentPathway(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const line = ensureNumber(input, 'line', 1, 5);
  const on_prednisone = input.on_prednisone === true;
  const steroid_sparing = input.need_steroid_sparing === true;
  const agents = {
    line1: 'prednisone_20_40mg_then_taper',
    line2: 'methotrexate_or_azathioprine',
    line3: 'mycophenolate_mycophenolic',
    line4: 'infliximab_5_mg_kg_at_0_2_6_then_q8w',
    line5: 'rituximab_or_adalimumab'
  };
  const recommended = line === 1 ? agents.line1
    : line === 2 ? agents.line2
    : line === 3 ? agents.line3
    : line === 4 ? agents.line4
    : agents.line5;
  const steroid_sparing_when = line >= 2 || steroid_sparing;
  return {
    module: 'tier4_rare_106_treatment',
    patient_id: patientId,
    line,
    on_prednisone,
    recommended,
    steroid_sparing_initiate: steroid_sparing_when,
    monitoring: {
      lft: 'methotrexate_azathioprine_myco',
      cbc: 'all_immunosuppressives',
      tb_screen: 'before_tnf_inhibitor',
      pjp_prophylaxis: 'infliximab_with_prednisone'
    },
    citations: CITATIONS
  };
}
module.exports = {
  sarcoidosisPhenotyping,
  cardiacSarcoidosisManagement,
  pulmonarySarcoidStaging,
  neurosarcoidosisWorkup,
  sarcoidTreatmentPathway,
  CITATIONS,
  ValidationError
};
