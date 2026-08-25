/**
 * TIER3_OBGYN-304 Gynecologic Oncology Engine
 * Ovarian mass (O-RADS/RMI) + endometrial cancer workup + cervical screening + GTN management + FIGO staging
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { FIGO_2023: 'FIGO 2023 Staging', NCCN_GYN: 'NCCN Gyn Onc 2024', ACR_O_RADS: 'ACR O-RADS 2020' };

function ovarianMassRiskStratification(input) {
  const { age, ca_125_value, ultrasound_features, ascites_present, pleural_effusion_present } = input;
  let rmi_score = ca_125_value * (ultrasound_features === 'multiloculated_or_solid' ? 3 : 1) * (age >= 50 ? 3 : 1);
  let risk = 'low';
  if (rmi_score > 200) risk = 'high_risk_for_malignancy';
  else if (rmi_score > 25) risk = 'intermediate_risk';
  return {
    rmi_score: Math.round(rmi_score), risk,
    o_rads_us: ultrasound_features,
    ca_125_value, age,
    recommendation: risk === 'high_risk_for_malignancy' ? 'refer_to_gynecologic_oncology_for_staging_and_debulking_surgery' : 'monitor_per_protocol_or_refer',
    citation: CITATIONS.ACR_O_RADS,
  };
}

function endometrialCancerWorkup(input) {
  const { post_menopausal_bleeding, endometrial_thickness_mm, biopsy_done, biopsy_result } = input;
  const biopsy_indicated = (post_menopausal_bleeding && endometrial_thickness_mm >= 4) || endometrial_thickness_mm >= 10;
  return {
    biopsy_indicated,
    imaging: ['transvaginal_us_first', 'pelvic_MRI_for_staging_if_cancer_diagnosed'],
    biopsy_type: biopsy_done ? 'office_endometrial_sampling' : 'recommend_endometrial_biopsy',
    histology: biopsy_result,
    workup_if_cancer: ['CA_125_for_ovarian_serous_papillary_subtype', 'pelvic_MRI', 'referral_to_gynecologic_oncology'],
    citation: CITATIONS.NCCN_GYN,
  };
}

function cervicalCancerScreening(input) {
  const { age, hpv_status, pap_smear_result, prior_screening_history, immunocompromised, hpv_vaccine_status } = input;
  let recommendation = '';
  if (age >= 30) {
    if (hpv_status === 'positive' && pap_smear_result === 'normal') recommendation = 'colposcopy_recommended';
    else if (hpv_status === 'positive' && pap_smear_result === 'ASC_US') recommendation = 'co_testing_repeat_in_1_year_or_colposcopy';
    else if (hpv_status === 'negative') recommendation = 'co_testing_every_5_years_until_65';
  }
  else if (age >= 21 && age < 30) recommendation = 'cytology_every_3_years';
  if (immunocompromised) recommendation += '_annual_screening_recommended_if_HIV_positive_or_transplant';
  return { age, hpv_status, pap_smear_result, recommendation, citation: CITATIONS.NCCN_GYN };
}

function gestationalTrophoblastic(input) {
  const { gestational_age_weeks, ultrasound_findings, beta_hcg_value, prior_molar_pregnancy } = input;
  let diagnosis = 'unclassified';
  if (beta_hcg_value >= 100000 && ultrasound_findings === 'snowstorm_appearance') diagnosis = 'complete_hydatidiform_mole';
  else if (ultrasound_findings === 'snowstorm_appearance' && beta_hcg_value < 100000) diagnosis = 'partial_hydatidiform_mole';
  else if (beta_hcg_value > 100000 && ultrasound_findings === 'placental_mass_post_evacuation') diagnosis = 'gestational_trophoblastic_neoplasia_high_risk_GTN';
  return {
    diagnosis,
    evacuation_indicated: diagnosis.includes('mole') ? 'suction_dilation_and_evacuation_then_hcg_followup' : 'workup_for_GTN_serum_hcg_lumbar_puncture_chest_xray_pelvic_us',
    hcg_followup: 'weekly_until_undetectable_then_monthly_x_6_to_12_months',
    citation: CITATIONS.FIGO_2023,
  };
}

function cancerStagingFigo(input) {
  const { cancer_type, t_stage, n_stage, m_stage, lymphovascular_invasion } = input;
  const staging_map = {
    ovarian: { I: 'limited_to_ovary', II: 'pelvic_extension', III: 'peritoneal_metastases_or_retroperitoneal_lymph_nodes', IV: 'distant_metastases' },
    endometrial: { I: 'limited_to_uterus', II: 'cervical_stromal_invasion', III: 'local_or_regional_spread', IV: 'bladder_or_rectum_or_distant' },
    cervix: { I: 'limited_to_cervix', II: 'beyond_cervix_but_not_pelvic_wall_or_lower_third_vagina', III: 'pelvic_wall_or_lower_third_vagina_or_hydronephrosis', IV: 'bladder_or_rectum_or_distant' },
  };
  return {
    cancer_type, t_stage, n_stage, m_stage,
    overall_stage: `${t_stage}_${n_stage}_${m_stage}`,
    stage_description: staging_map[cancer_type]?.[t_stage] || 'unknown',
    lymphovascular_invasion,
    citation: CITATIONS.FIGO_2023,
  };
}

module.exports = { ovarianMassRiskStratification, endometrialCancerWorkup, cervicalCancerScreening, gestationalTrophoblastic, cancerStagingFigo, CITATIONS, ValidationError };