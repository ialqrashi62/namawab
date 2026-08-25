/**
 * TIER3_HEMONC-305 Hematopoietic Stem Cell Transplant (HSCT) Engine
 * Indication + HLA matching + conditioning regimens + GVHD prophylaxis + engraftment + long-term follow-up
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { EBMT_2024: 'EBMT 2024 Indications', NMDP: 'NMDP HLA Matching 2024', ASBMT: 'ASBMT GVHD 2024' };

function transplantIndication(input) {
  const { diagnosis, disease_status, age, comorbidity, hct_ci_score, donor_available } = input;
  let indication = 'not_indicated';
  const indications = {
    AML_first_CR: 'auto_or_allo_if_high_risk_cytogenetics',
    AML_second_CR: 'allo_indicated',
    ALL_high_risk_first_CR: 'allo_indicated',
    MDS_high_risk: 'allo_indicated',
    CML_chronic_phase_TKI_failure: 'allo_indicated',
    CML_blast_phase: 'allo_indicated',
    MM_first_line_eligible: 'autologous_indicated',
    HL_relapsed_chemosensitive: 'autologous_indicated',
    SAA_young_donor: 'allo_indicated',
    Fanconi_anemia: 'allo_indicated_if_donor',
  };
  if (indications[diagnosis]) indication = indications[diagnosis];
  if (age > 70 && comorbidity === 'severe') indication = 'high_morbidity_review_carefully';
  return {
    indication,
    hct_ci_score: hct_ci_score,
    eligibility: donor_available && comorbidity !== 'severe' ? 'eligible' : 'needs_donor_or_re_assessment',
    citation: CITATIONS.EBMT_2024,
  };
}

function donorMatching(input) {
  const { recipient_hla_a, recipient_hla_b, recipient_hla_c, recipient_hla_drb1, recipient_hla_dqb1, donor_hla_a, donor_hla_b, donor_hla_c, donor_hla_drb1, donor_hla_dqb1 } = input;
  const recipient_set = new Set([recipient_hla_a, recipient_hla_b, recipient_hla_c, recipient_hla_drb1, recipient_hla_dqb1]);
  const donor_set = new Set([donor_hla_a, donor_hla_b, donor_hla_c, donor_hla_drb1, donor_hla_dqb1]);
  const mismatches = [...recipient_set].filter(x => !donor_set.has(x)).length;
  let match_quality = 'fully_matched';
  if (mismatches >= 2) match_quality = 'mismatched_consider_post_transplant_cyclophosphamide';
  else if (mismatches === 1) match_quality = 'single_mismatch';
  return {
    hla_mismatches: mismatches,
    match_quality,
    cord_blood_alternative: mismatches >= 2 ? 'consider_cord_blood_if_no_matched_unrelated_donor' : 'not_needed',
    haploidentical_alternative: mismatches >= 3 ? 'haploidentical_with_PTCy' : 'not_needed',
    citation: CITATIONS.NMDP,
  };
}

function conditioningRegimen(input) {
  const { disease, age, comorbidity, donor_type, prior_therapy } = input;
  let regimen = 'BEAM'; // for auto
  if (donor_type === 'haploidentical') regimen = 'Flu_Bu_Cy_low_OR_Flu_Cy_with_PTCy';
  else if (comorbidity === 'severe' || age >= 65) regimen = 'reduced_intensity_conditioning_Flu_Mel';
  else if (donor_type === 'matched_related' || donor_type === 'matched_unrelated') regimen = 'myeloablative_Bu_Fludarabine_or_BEAM';
  if (disease === 'AML' && age < 50) regimen = 'myeloablative_Busulfan_Cyclophosphamide_Flu';
  return {
    regimen,
    duration_days: regimen.includes('Flu_Bu_Cy') ? 7 : 6,
    supportive_care_during: ['fluconazole_antifungal', 'valacyclovir_antiviral', 'PJP_prophylaxis_sulfamethoxazole', 'fluoroquinolone_if_neutropenic'],
    busulfan_pharmacokinetics: regimen.includes('Busulfan') ? 'therapeutic_drug_monitoring_daily_dose_adjustment' : 'not_required',
    citation: CITATIONS.EBMT_2024,
  };
}

function gvhdProphylaxis(input) {
  const { donor_type, hla_mismatch_count, prior_history_acute_gvhd, steroid_intolerance } = input;
  const match_related_8_8 = donor_type === 'matched_related' && hla_mismatch_count === 0;
  let regimen = 'CNI_MTX_standard';
  if (match_related_8_8) regimen = 'cyclosporine_methotrexate_x_4_doses';
  else if (donor_type === 'matched_unrelated') regimen = 'cyclosporine_MTX_or_tacrolimus_mtx';
  else if (donor_type === 'haploidentical') regimen = 'cyclophosphamide_MMF_tacrolimus_post_transplant_high_dose_PTCy';
  else if (donor_type === 'cord_blood') regimen = 'cyclosporine_mmf_standard';
  return {
    regimen,
    duration_days: 100,
    monitoring: ['tacrolimus_or_cyclosporine_drug_levels_Q1_2_weeks', 'CBC_Q_week', 'LFT_Q_week', 'acute_gvhd_grading_per_glucksberg_or_mAGRR'],
    steroid_intolerant_alternative: steroid_intolerance ? 'consider_sirolimus_or_ruxolitinib' : 'standard_steroids_for_acute_gvhd',
    prior_gvhd_history: prior_history_acute_gvhd ? 'increased_intensity_prophylaxis' : 'standard',
    citation: CITATIONS.ASBMT,
  };
}

function engraftmentMonitoring(input) {
  const { day_post_transplant, neutrophils, platelets, chimera_status, rbc_chimera, donor_source, cd34_dose } = input;
  const neutrophils_engrafted = neutrophils >= 500;
  const platelets_engrafted = platelets >= 20 && platelet_count_independent_of_transfusion;
  return {
    day_post_transplant, neutrophils_engrafted, platelets_engrafted: platelets >= 20,
    neutrophil_engraftment_day_expected: donor_source === 'cord_blood' ? 'day_plus_22' : donor_source === 'haploidentical' ? 'day_plus_17' : 'day_plus_15',
    plt_engraftment_expected_day: donor_source === 'cord_blood' ? 'day_plus_42' : 'day_plus_12',
    primary_graft_failure: day_post_transplant >= 28 && !neutrophils_engrafted,
    secondary_graft_failure: neutrophils_engrafted && neutrophils && neutrophils < 500 && lost_count,
    chimera_status: chimera_status || 'pending_day_plus_30',
    rbc_chimera: rbc_chimera,
    cd34_dose_target: cd34_dose >= 2 ? 'adequate_for_engraftment' : 'low_cd34_increased_risk_of_graft_failure',
  };
}

function longTermFollowup(input) {
  const { months_post_transplant, prior_uvb_or_puvh, prior_extensive_chronic_gvhd, comorbidity, immune_reconstitution, immunization_history } = input;
  return {
    followup_interval_months: months_post_transplant < 6 ? 2 : months_post_transplant < 24 ? 3 : 6,
    immune_reconstitution_evaluation: ['CD4_CD8_Q3_months_until_normal', 'IGG_levels_Q6M', 'vaccination_completion_6_to_12_months_post_transplant_immunizations'],
    chronic_gvhd_screening: ['skin_Q_visit', 'oral_mucosa', 'eyes_schirmer_test_or_VAS', 'liver_function', 'lung_function_test_PFT_Q_year'],
    vaccination_schedule: ['inactivated_vaccines_Q6M_post_transplant', 'live_vaccines_after_24_months_immunosuppression_free', 'HPV_vaccine_if_age_eligible'],
    bone_health: comorbidity === 'corticosteroids' ? 'DEXA_Q24M + vitamin_D + calcium' : 'DEXA_Q24M_baseline',
    fertility_referral: 'specialist_consult_if_reproductive_age',
    secondary_malignancy_screening: 'standard_age_appropriate_screening + skin_cancer_Q12M',
    cardio_metabolic: 'BP_lipids_HbA1c_Q_year_per_increased_risk',
  };
}

module.exports = { transplantIndication, donorMatching, conditioningRegimen, gvhdProphylaxis, engraftmentMonitoring, longTermFollowup, CITATIONS, ValidationError };