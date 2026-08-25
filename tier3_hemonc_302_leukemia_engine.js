/**
 * TIER3_HEMONC-302 Leukemia Engine
 * AML/ALL/CML/CLL WHO 2022 + risk stratification (ELN) + supportive care + tumor lysis + induction + transfusion
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_2022: 'WHO Classification 2022', ELN_2022: 'ELN AML 2022', NCCN_AML: 'NCCN AML 2024' };

function leukemiaClassification(input) {
  const { blast_pct_bm, blast_pct_pB, cytogenetics, molecular, lymphoblasts, philadelphia_chromosome, bcr_abl, hairy_cell_trap, jak2_v617f } = input;
  let classification = 'unclassified';
  if (blast_pct_bm >= 20) classification = 'AML';
  else if (blast_pct_bm >= 10 && lymphoblasts) classification = 'B_ALL_OR_T_ALL';
  else if (blast_pct_bm >= 10 && philadelphia_chromosome === 'positive' && bcr_abl) classification = 'Ph_positive_ALL';
  else if (bcr_abl && blast_pct_bm < 10) classification = 'CML_chronic_phase';
  else if (hairy_cell_trap === 'positive') classification = 'hairy_cell_leukemia';
  else if (jak2_v617f === 'positive' && blast_pct_bm < 10) classification = 'MPN_or_Ph_neg_MPN';
  else if (blast_pct_pB >= 5) classification = 'possible_AML_or_MDS';
  return { classification, cytogenetics, molecular, who_edition: '2022', citation: CITATIONS.WHO_2022 };
}

function allRiskStratification(input) {
  const { age, wbc, cytogenetics, molecular, philadelphia_chromosome, response_d14_induction, mrd_day_33 } = input;
  let risk = 'standard';
  if (age >= 35) risk = 'high';
  if (philadelphia_chromosome === 'positive') risk = 'high_with_TKI';
  if (wbc >= 30 && philadelphia_chromosome !== 'positive') risk = 'high';
  if (mrd_day_33 === 'positive') risk = 'high';
  if (response_d14_induction === 'm3_marrow') risk = 'induction_failure';
  return { risk, mrd: mrd_day_33, induction_response: response_d14_induction, eligibility_for_blina: risk === 'high' ? 'consider_Blina_with_chemo' : 'standard_protocol', citation: CITATIONS.ELN_2022 };
}

function supportiveCareNeutropenia(input) {
  const { anc, expected_duration_neutropenia_days, temperature_max, hypotensive, suspected_source, on_prophylactic_fluoroquinolone } = input;
  const fever = temperature_max >= 38.3;
  const sepsis = hypotensive === 'shock' || temperature_max >= 39 && suspected_source === 'unclear';
  return {
    fever_neutropenia_diagnosed: fever && anc < 500,
    severity: sepsis ? 'high_icu_admission' : 'standard',
    immediate_empiric_abx: sepsis ? 'PIP_TAZO + amikacin_within_1h' : 'PIP_TAZO_alone_within_4h',
    coverage_modifications: suspected_source === 'line' ? 'add_vancomycin' : suspected_source === 'pneumonia' ? 'add_azithromycin_or_daptomycin' : 'no_change',
    gcsf_consideration: expected_duration_neutropenia_days >= 7 ? 'consider_gcsf_daily_until_ANC_recovery' : 'no_gcsf_routinely',
    antifungal_prophylaxis: on_prophylactic_fluoroquinolone ? 'continue_antibacterial' : 'consider_posaconazole_or_fluconazole_per_risk',
    duration_of_empiric_abx: anc < 500 && fever ? 'until_anc_500_AND_fever_resolved' : 'tailor_by_culture',
    citation: CITATIONS.NCCN_AML,
  };
}

function tumorLysisRisk(input) {
  const { tumor_type, wbc, uric_acid, ld_elevated, renal_function, bulky_disease, age } = input;
  const high_risk_disease = ['AML_high_count', 'Burkitt_lymphoma', 'ALL_high_WBC', 'DLBCL_bulky'].includes(tumor_type);
  const very_high_risk = high_risk_disease && (wbc >= 100 || uric_acid >= 8);
  return {
    risk_level: very_high_risk ? 'very_high' : high_risk_disease ? 'high' : wbc >= 50 ? 'intermediate' : 'low',
    prophylaxis: very_high_risk ? ['aggressive_IV_hydration_3L/m2/d', 'rasburicase_0.2mg/kg', 'admit_for_close_monitoring'] : high_risk_disease ? ['aggressive_IV_hydration', 'allopurinol_or_rasburicase'] : ['IV_hydration', 'monitor_labs_Q12h'],
    monitoring: very_high_risk ? 'Q6h_electrolytes_x_72h' : 'Q12h_electrolytes_x_72h',
    indication_rasburicase: uric_acid >= 8 || very_high_risk ? 'mandatory' : 'consider_if_hyperuricemia',
  };
}

function amlInduction(input) {
  const { age, cytogenetics, molecular, ecog, cardiac, induction_type } = input;
  const favorable = ['t_8_21', 'inv_16', 'NPM1_without_FLT3_ITD'];
  const adverse = ['complex_karyotype', 'monosomal_karyotype', 'TP53_mutated', 'FLT3_ITD_high_allele'];
  let regimen = '7_plus_3';
  if (age >= 60 && ecog >= 2) regimen = 'azacitidine_venetoclax_or_low_dose_cytarabine';
  if (favorable.includes(cytogenetics) && age < 60) regimen = '7_plus_3_no_allo_sct_upfront';
  if (adverse.includes(cytogenetics)) regimen = '7_plus_3_then_evaluate_allo_sct_in_first_CR';
  if (molecular === 'FLT3_mutated') regimen += ' + Midostaurin_or_Gilteritinib';
  if (molecular === 'NPM1_AML_>_60') regimen = '7_plus_3_with_gemtuzumab_for_elderly';
  return {
    regimen,
    induction_cycle_days: 7 + 3,
    post_induction_plan: ['marrow_day_14_to_21', 'consider_reinduction_if_residual_disease', 'proceed_to_consolidation_if_CR'],
    mortality_risk: age >= 60 ? 'high' : 'moderate',
    citation: CITATIONS.ELN_2022,
  };
}

function transfusionThresholds(input) {
  const { hemoglobin, platelets, acute_leukemia_undergoing_chemo, surgery_planned, invasive_procedure, hx_plt_transfusion_refractoriness, anc } = input;
  const hgb_threshold = acute_leukemia_undergoing_chemo ? 7 : surgery_planned ? 8 : 7;
  const plt_threshold = invasive_procedure ? 20 : acute_leukemia_undergoing_chemo && anc < 1000 ? 10 : 20;
  return {
    hgb_transfusion_threshold: hgb_threshold, plt_transfusion_threshold: plt_threshold,
    plt_refractoriness_workup: hx_plt_transfusion_refractoriness ? 'check_anti_HLA_and_anti_HPA_antibodies' : 'not_indicated',
    irradiated_blood_products: acute_leukemia_undergoing_chemo ? 'irradiated_RBC_PLT' : 'standard_products',
    cmv_serostatus_products: 'leukoreduced_if_CMV_neg_recipient_OR_CMV_neg_donor',
    citation: CITATIONS.NCCN_AML,
  };
}

module.exports = { leukemiaClassification, allRiskStratification, supportiveCareNeutropenia, tumorLysisRisk, amlInduction, transfusionThresholds, CITATIONS, ValidationError };