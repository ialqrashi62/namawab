/**
 * TIER3_HEMONC-303 Multiple Myeloma Engine
 * IMWG 2024 diagnostic + R-ISS staging + cytogenetic risk + Dara-VRd selection + IMWG response + renal
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { IMWG_2024: 'IMWG MM 2024', R_ISS: 'Revised ISS 2015', NCCN_MM: 'NCCN MM 2024' };

function myelomaDiagnosticCriteria(input) {
  const { monoclonal_protein, bone_marrow_plasma_cells_pct, end_organ_damage_CRAB, serum_free_light_chain_ratio, m_protein_igg_or_iga } = input;
  const crab_present = end_organ_damage_CRAB;
  const plasma_cells_infiltration = bone_marrow_plasma_cells_pct >= 10 || m_protein_igg_or_iga >= 30 || serum_free_light_chain_ratio >= 100;
  let diagnosis = 'MGUS_or_asymptomatic';
  if (crab_present && plasma_cells_infiltration) diagnosis = 'active_multiple_myeloma';
  else if (crab_present && (bone_marrow_plasma_cells_pct < 10 && (m_protein_igg_or_iga < 30 && serum_free_light_chain_ratio < 100))) diagnosis = 'solitary_plasmacytoma_or_other_plasma_cell_related';
  return { diagnosis, crab_present, plasma_cells_infiltration, citation: CITATIONS.IMWG_2024 };
}

function mayoRissStaging(input) {
  const { beta_2_microglobulin, albumin, serum_ldh, cytogenetics, del_17p, t_4_14, t_14_16 } = input;
  let stage = 'Stage_I';
  const cytogenetic_high = del_17p || t_4_14 || t_14_16;
  if (cytogenetic_high && beta_2_microglobulin >= 5.5) stage = 'Stage_III_high_risk';
  else if (cytogenetic_high) stage = 'Stage_II_with_high_risk';
  else if (beta_2_microglobulin >= 5.5) stage = 'Stage_III_standard_risk';
  else if (beta_2_microglobulin < 5.5 && albumin >= 3.5) stage = 'Stage_I';
  else stage = 'Stage_II_standard_risk';
  const median_os_months = { Stage_I: 182, 'Stage_II_standard_risk': 84, 'Stage_III_standard_risk': 47, 'Stage_II_with_high_risk': 42, 'Stage_III_high_risk': 29 }[stage];
  return { stage, cytogenetic_high_risk: cytogenetic_high, median_os_months, citation: CITATIONS.R_ISS };
}

function mmRiskStratification(input) {
  const { cytogenetics, age, egfr, performance_status, plasma_cells_pct, beta_2_microglobulin } = input;
  const standard_risk = !cytogenetics?.del_17p && !cytogenetics?.t_4_14 && !cytogenetics?.t_14_16 && !cytogenetics?.t_14_20;
  return {
    risk_category: standard_risk ? 'standard_risk' : 'high_risk',
    cytogenetic_status: cytogenetics,
    eligibility_for_transplant: age < 70 && egfr >= 30 && performance_status <= 2,
    intensity_recommendation: standard_risk ? 'Dara_VRd_full_intensity' : 'Dara_VRd_with_Car_PKPOR_Isa_Pd',
    monitoring_recommendation: 'MRD_testing_Q12M_until_negative_then_per_5y',
  };
}

function myelomaTreatment(input) {
  const { age, performance_status, eligibility_transplant, frailty_status, comorbidities } = input;
  const fit = performance_status <= 2 && age < 70 && eligibility_transplant;
  const intermediate = performance_status <= 3;
  const frail = performance_status > 3 || age >= 80 || comorbidities === 'severe';
  let regimen = 'Dara_VRd';
  if (intermediate && !fit) regimen = 'Dara_Rd_x_cycles_until_progression';
  if (frail) regimen = 'Dara_Rd_reduced_dose';
  return {
    regimen, eligibility_autologous_transplant: fit, eligibility_ciltacabtagene: fit && frailty_status === 'not_frail',
    maintenance: fit ? 'Lenalidomide_maintenance_post_ASCT' : 'Dara_maintenance_or_Rd_continuous',
    duration: 'continue_until_progression_or_unacceptable_toxicity',
    citation: CITATIONS.NCCN_MM,
  };
}

function mmResponseAssessment(input) {
  const { baseline_m_protein, current_m_protein, serum_free_light_chain, baseline_bm_plasma_cells, current_bm_plasma_cells, imaging_response, mrd_status } = input;
  const m_protein_reduction_pct = baseline_m_protein ? Math.round(((baseline_m_protein - current_m_protein) / baseline_m_protein) * 100) : 0;
  let response = 'partial_response';
  if (current_m_protein === 0 && serum_free_light_chain === 'normal' && baseline_bm_plasma_cells && current_bm_plasma_cells < 5) response = 'complete_response';
  else if (m_protein_reduction_pct >= 90 && current_m_protein < 100) response = 'very_good_partial_response';
  else if (m_protein_reduction_pct >= 50) response = 'partial_response';
  if (mrd_status === 'undetectable_at_10^-6') response = 'MRD_negative_CR';
  return { response, m_protein_reduction_pct, mrd_status, citation: CITATIONS.IMWG_2024 };
}

function renalMgmtInMM(input) {
  const { egfr, urine_protein_g_24h, light_chain_type, hypercalcemia, dialysis_required, fluid_balance } = input;
  const renal_failure_mm = egfr < 40 && (light_chain_type === 'lambda' || light_chain_type === 'kappa');
  return {
    renal_failure_mm,
    plasmapheresis_indicated: renal_failure_mm && light_chain_type === 'light_chain_heavy_or_kappa',
    dialysis_initiation: egfr < 15 || uremic_symptoms || fluid_overload,
    hydration_strategy: hypercalcemia ? 'aggressive_IV_saline_200_300mL_h' : 'maintain_urine_output_2_3L_d',
    chemotherapy_intensity_consideration: egfr >= 30 ? 'full_dose' : egfr >= 15 ? 'reduced_dose_zoledronic_acid_15min' : 'hold_zoledronic_acid',
  };
}

module.exports = { myelomaDiagnosticCriteria, mayoRissStaging, mmRiskStratification, myelomaTreatment, mmResponseAssessment, renalMgmtInMM, CITATIONS, ValidationError };