/**
 * TIER3_HEMONC-301 Lymphoma Engine
 * HL/NHL classification (WHO 2022) + Ann Arbor staging + IPI score + R-CHOP selection + Lugano response
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_2022: 'WHO Classification 2022', LUGANO_2014: 'Lugano Classification 2014', NCCN_BNHL: 'NCCN B-NHL 2024' };

function lymphomaClassification(input) {
  const { hodgkin_reeed_sternberg, bcl2_translocation, myc_translocation, cd20_positive, cd30_positive, lymph_node_architecture, ebv_positive } = input;
  let classification = 'unclassified';
  if (hodgkin_reeed_sternberg && cd30_positive) classification = 'classic_hodgkin_lymphoma';
  else if (cd20_positive && myc_translocation && bcl2_translocation) classification = 'double_hit_high_grade_bcell';
  else if (cd20_positive && bcl2_translocation && !myc_translocation) classification = 'follicular_lymphoma';
  else if (cd20_positive && !bcl2_translocation && !myc_translocation) classification = 'diffuse_large_bcell_lymphoma';
  else if (ebv_positive) classification = 'EBV_positive_NHL';
  return { classification, who_edition: '2022', citation: CITATIONS.WHO_2022 };
}

function lymphomaStaging(input) {
  const { lymph_nodes_regions, nodal_extranodal, spleen_involvement, liver_involvement, bone_marrow_involvement, b_symptoms, bulky_disease } = input;
  let stage = 'I';
  if (bone_marrow_involvement) stage = 'IV';
  else if (liver_involvement || nodal_extranodal === 'extranodal_distant') stage = 'IV';
  else if (spleen_involvement || lymph_nodes_regions === 'both_sides_diaphragm') stage = 'III';
  else if (lymph_nodes_regions === 'both_sides_same_diaphragm' || lymph_nodes_regions === 'multiple_same_side') stage = 'II';
  const stage_label = stage + (b_symptoms ? 'B' : 'A') + (bulky_disease ? '_X' : '');
  return {
    ann_arbor_stage: stage, stage_label,
    bulky_disease: bulky_disease, b_symptoms: b_symptoms,
    recommended_imaging: ['PET_CT_baseline', 'marrow_biopsy_for_stage_III_IV'],
    citation: CITATIONS.LUGANO_2014,
  };
}

function lymphomaIPI(input) {
  const { age, stage, ecog, ldh_elevated, extranodal_sites } = input;
  let score = 0;
  if (age > 60) score += 1;
  if (stage === 'III' || stage === 'IV') score += 1;
  if (ecog >= 2) score += 1;
  if (ldh_elevated) score += 1;
  if (extranodal_sites >= 2) score += 1;
  let risk = 'low';
  if (score >= 4) risk = 'high';
  else if (score >= 3) risk = 'high_intermediate';
  else if (score >= 2) risk = 'low_intermediate';
  return { ipi_score: score, risk, mortality_5y: { low: 12, low_intermediate: 35, high_intermediate: 65, high: 90 }[risk], citation: CITATIONS.LUGANO_2014 };
}

function lymphomaTreatment(input) {
  const { classification, stage, bulky, ipi_risk } = input;
  const regimens = {
    classic_hodgkin_early: 'ABVD_x_2 + IFRT (favorable)', // Or ABVD alone 4 cycles
    classic_hodgkin_advanced: 'escalated_BEACOPP OR AVD + brentuximab_if_high_risk',
    dlbcl: 'R_CHOP_x_6_cycles + intrathecal_if_CNS_risk',
    follicular_low_tumor_burden: 'watch_and_wait',
    follicular_high_tumor_burden: 'R_CHOP_OR_R_bendamustine + maintenance_rituximab',
    double_hit: 'DA_EPOCH_R_intensified',
  };
  let regimen = 'R_CHOP_x_6';
  if (classification === 'classic_hodgkin_lymphoma') regimen = stage === 'I' || stage === 'II' ? 'ABVD_x_2_4 + IFRT' : 'escalated_BEACOPP';
  if (classification === 'double_hit_high_grade_bcell') regimen = 'DA_EPOCH_R_intensified';
  if (classification === 'follicular_lymphoma') regimen = bulky || ipi_risk === 'high_intermediate' ? 'R_CHOP_x_6 + maintenance_rituximab' : 'watch_and_wait_for_low_tumor_burden';
  return { classification, regimen, cns_prophylaxis: classification === 'double_hit_high_grade_bcell' || classification === 'dlbcl' ? 'intrathecal_methotrexate_or_high_dose_methotrexate' : 'not_routinely', citation: CITATIONS.NCCN_BNHL };
}

function lymphomaResponseAssessment(input) {
  const { baseline_pet_negative, post_chemo_pet_negative, residual_mass_size_cm, residual_pet_suv } = input;
  let response = 'partial_response';
  if (baseline_pet_negative && post_chemo_pet_negative) response = 'complete_metabolic_response';
  else if (post_chemo_pet_negative && residual_mass_size_cm <= 2) response = 'complete_metabolic_response';
  else if (post_chemo_pet_negative && residual_mass_size_cm > 2) response = 'residual_mass_negative_pet';
  else if (residual_pet_suv >= 4) response = 'no_response_or_progression';
  return { response, residual_pet_suv, citation: CITATIONS.LUGANO_2014 };
}

function lymphomaSurveillance(input) {
  const { classification, stage, end_treatment_date } = input;
  const months_since = end_treatment_date ? (new Date() - new Date(end_treatment_date)) / (1000 * 60 * 60 * 24 * 30) : 0;
  let interval_months = 3;
  if (months_since > 24) interval_months = 6;
  if (months_since > 60) interval_months = 12;
  return {
    surveillance_imaging: stage >= 'III' ? 'CT_or_PET_Q3_to_6M_x_2y_then_Q6_to_12M' : 'CT_only_Q6M_x_2y_then_annually',
    late_effects_monitoring: ['secondary_malignancies', 'cardiotoxicity_if_anthracycline', 'thyroid_if_neck_RT', 'fertility_assessment'],
    labs: ['CBC_Q3M', 'LDH_Q6M', 'liver_Q6M'],
    citation: CITATIONS.NCCN_BNHL,
  };
}

module.exports = { lymphomaClassification, lymphomaStaging, lymphomaIPI, lymphomaTreatment, lymphomaResponseAssessment, lymphomaSurveillance, CITATIONS, ValidationError };