'use strict';
// TIER4_RARE-103 Porphyrias
// AIP, PCT, EPP, CEP, VP, HCP
const CITATIONS = [
  { id: 'EASL-Porphyria', source: 'European Association Liver - Porphyria guidelines', year: 2023 },
  { id: 'AHP-2024', source: 'American Porphyria Foundation - Acute Hepatic Porphyria consensus', year: 2024 },
  { id: 'FDA-Givosiran', source: 'FDA approval Givosiran for AIP', year: 2019 }
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
function acuteHepaticPorphyriaAttack(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'porphyria_type', ['aip', 'vp', 'hcp', 'adp']);
  const abdominal_pain = input.abdominal_pain === true;
  const neuro_symptoms = Array.isArray(input.neuro_symptoms) ? input.neuro_symptoms : [];
  const mental_status = input.mental_status_change === true;
  const urine_ala = ensureNumber(input, 'urine_ala_umol_l', 0, 2000);
  const urine_pbg = ensureNumber(input, 'urine_pbg_umol_l', 0, 2000);
  const trigger = input.trigger || 'none';
  const severity = abdominal_pain && neuro_symptoms.length > 0 && urine_pbg > 200 ? 'severe' : (abdominal_pain && urine_pbg > 100 ? 'moderate' : 'mild');
  const therapy = {
    heme_arginate: severity === 'severe' ? '3_to_4_mg_kg_d_x4_days' : 'consider',
    glucose_loading: severity === 'mild' ? 'high_dose_iv' : 'adjunct',
    givosiran: 'consider_for_recurrent_attacks',
    pain_control: 'opioid_safe_avoid_CYP_inducers',
    avoid: ['phenytoin', 'phenobarbital', 'rifampin', 'sulfonamides', 'estrogens', 'alcohol']
  };
  const monitoring = {
    urine_pbg_daily: true,
    electrolytes_2x_daily: true,
    neuro_check_q6h: true,
    respiratory_monitor: neuro_symptoms.includes('bulbar')
  };
  return {
    module: 'tier4_rare_103_ahp_attack',
    patient_id: patientId,
    porphyria_type: type,
    severity,
    trigger,
    therapy,
    monitoring,
    citations: CITATIONS
  };
}
function cutaneousPorphyriaManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'porphyria_type', ['pct', 'epp', 'cep', 'xlp']);
  const skin_findings = Array.isArray(input.skin_findings) ? input.skin_findings : [];
  const uro_coproporphyrin = ensureNumber(input, 'uro_coproporphyrin_umol_l', 0, 5000);
  const protoporphyrin = ensureNumber(input, 'protoporphyrin_umol_l', 0, 5000);
  const liver_iron = ensureNumber(input, 'liver_iron_umol_g', 0, 100);
  const therapy = {};
  if (type === 'pct') {
    therapy.first_line = 'low-dose_hydroxychloroquine_or_phlebotomy';
    therapy.reduction_iron = liver_iron > 30;
    therapy.avoid = ['alcohol', 'estrogens', 'iron_supplements'];
  } else if (type === 'epp') {
    therapy.first_line = 'afamelanotide_implant_plus_strict_sun_avoidance';
    therapy.beta_carotene = 'adjunct';
    therapy.lft_monitoring = 'hepatic_porphyria_risk';
  } else if (type === 'cep') {
    therapy.first_line = 'strict_sun_avoidance_bleached_fabric';
    therapy.alpha_melanocyte = 'experimental';
  } else if (type === 'xlp') {
    therapy.first_line = 'sun_avoidance_photoprotective_clothing';
    therapy.beta_carotene = 'consider';
  }
  return {
    module: 'tier4_rare_103_cutaneous',
    patient_id: patientId,
    porphyria_type: type,
    skin_findings,
    labs: { uro_coproporphyrin, protoporphyrin, liver_iron },
    therapy,
    citations: CITATIONS
  };
}
function porphyriaSafeDrugList(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const drug = input.drug_name;
  if (!drug) throw new ValidationError('drug_name required', 'drug_name');
  const unsafe = ['phenytoin', 'phenobarbital', 'primidone', 'rifampin', 'rifampicin', 'sulfonamides', 'sulfasalazine', 'trimethoprim', 'estrogens', 'progesterones', 'alcohol', 'griseofulvin', 'ergots', 'metoclopramide'];
  const drug_lower = String(drug).toLowerCase();
  const is_unsafe = unsafe.some(d => drug_lower.includes(d));
  return {
    module: 'tier4_rare_103_drug_safety',
    patient_id: patientId,
    drug_name: drug,
    safe_in_porphyria: !is_unsafe,
    alternative_if_unsafe: is_unsafe ? 'consult_porphyria_drug_database_www.drugs-porphyria.org' : null,
    citations: CITATIONS
  };
}
function givosiranEligibility(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const attacks_per_year = ensureNumber(input, 'attacks_per_year', 0, 50);
  const on_hemin = input.on_hemin === true;
  const ahp_type = ensureEnum(input, 'ahp_type', ['aip', 'vp', 'hcp', 'adp']);
  const eligible = attacks_per_year >= 2 || (attacks_per_year >= 1 && on_hemin);
  return {
    module: 'tier4_rare_103_givosiran',
    patient_id: patientId,
    ahp_type,
    attacks_per_year,
    on_hemin,
    eligible_for_givosiran: eligible,
    dosing_if_eligible: '2.5_mg_kg_sc_monthly',
    monitoring: { lft_q1mo: true, homocysteine_q3mo: true, gfr_q3mo: true },
    citations: CITATIONS
  };
}
function familyScreeningPorphyria(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const proband_type = ensureEnum(input, 'proband_type', ['aip', 'vp', 'hcp', 'pct', 'epp', 'cep']);
  const inheritance = ['aip', 'vp', 'hcp', 'pct', 'cep'].includes(proband_type) ? 'autosomal_dominant' : 'autosomal_recessive';
  return {
    module: 'tier4_rare_103_family_screening',
    patient_id: patientId,
    proband_type,
    inheritance,
    first_degree_relatives: 'screen_with_urine_pbg_and_porphyrins',
    counseling: 'lifetime_predisposing_factor_avoidance',
    citations: CITATIONS
  };
}
module.exports = {
  acuteHepaticPorphyriaAttack,
  cutaneousPorphyriaManagement,
  porphyriaSafeDrugList,
  givosiranEligibility,
  familyScreeningPorphyria,
  CITATIONS,
  ValidationError
};
