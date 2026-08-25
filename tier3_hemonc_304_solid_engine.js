/**
 * TIER3_HEMONC-304 Solid Tumor Engine
 * TNM staging (AJCC 8th) + ECOG/Karnofsky + CTCAE v5 toxicity grading + targeted therapy eligibility + chemo dosing + survivorship
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AJCC_8TH: 'AJCC Staging 8th ed', CTCAE_V5: 'NCI CTCAE v5.0', NCCN_SOLID: 'NCCN Solid Tumors 2024' };

function tnmStage(input) {
  const { t_stage, n_stage, m_stage, tumor_type } = input;
  let stage = 'I';
  if (m_stage === 'M1') stage = 'IV';
  else if (t_stage === 'T4' || n_stage === 'N3') stage = 'IIIB';
  else if (t_stage === 'T3' || n_stage === 'N2') stage = 'IIIA';
  else if (t_stage === 'T2' || n_stage === 'N1') stage = 'II';
  return { tumor_type, t: t_stage, n: n_stage, m: m_stage, stage, ajcc_edition: '8th', citation: CITATIONS.AJCC_8TH };
}

function performanceScore(input) {
  const { ecog, karnofsky, ambulatory } = input;
  const calculated_ecog = ecog || (karnofsky >= 90 ? 0 : karnofsky >= 70 ? 1 : karnofsky >= 50 ? 2 : karnofsky >= 30 ? 3 : karnofsky > 0 ? 4 : 5);
  return {
    ecog: calculated_ecog, karnofsky: karnofsky || (90 - calculated_ecog * 10),
    description: ['fully_active', 'restricted_but_ambulatory', 'ambulatory_with_debilitation', 'bedridden_partial_self_care', 'bedridden_no_self_care', 'death'][calculated_ecog],
    eligible_intensive_chemo: calculated_ecog <= 2,
    eligible_clinical_trial: calculated_ecog <= 3,
  };
}

function ctcaeGrading(input) {
  const { symptom, intervention, hospitalization, life_threatening, death } = input;
  let grade = 1;
  if (death) grade = 5;
  else if (life_threatening) grade = 4;
  else if (hospitalization) grade = 3;
  else if (intervention === 'invasive_intervention') grade = 3;
  else if (intervention === 'medical_intervention') grade = 2;
  else if (symptom === 'asymptomatic_only_lab_or_imaging_finding') grade = 1;
  return {
    ctcae_grade: grade,
    management: grade >= 3 ? 'hold_treatment_or_dose_reduce_25_percent' : grade === 2 ? 'symptomatic_treatment_maintain_dose' : 'monitor_no_change',
    citation: CITATIONS.CTCAE_V5,
  };
}

function targetedTherapyEligibility(input) {
  const { tumor_type, biomarkers, mutations, expression_score, biomarker_method } = input;
  const eligibility = [];
  if (tumor_type === 'breast' && (biomarkers?.her2 === 'positive_3_plus' || biomarkers?.her2 === 'positive_by_ISH')) eligibility.push('trastuzumab_OR_pertuzumab_eligible');
  if (tumor_type === 'breast' && biomarkers?.er_positive && biomarkers?.pr_positive) eligibility.push('endocrine_therapy_tamoxifen_or_AI');
  if (tumor_type === 'lung' && biomarkers?.egfr_activating_mutation) eligibility.push('osimertinib_first_line');
  if (tumor_type === 'lung' && biomarkers?.alk_rearrangement) eligibility.push('alectinib_or_lorlatinib');
  if (tumor_type === 'colon' && biomarkers?.mss_or_msi) eligibility.push('MSI_high_then_consider_pembrolizumab');
  if (mutations?.brca_1_or_2) eligibility.push('olaparib_or_talazoparib_eligible');
  if (expression_score?.pdl1 >= 50 && (tumor_type === 'lung' || tumor_type === 'urothelial')) eligibility.push('pembrolizumab_monotherapy');
  return {
    eligibility: eligibility.length ? eligibility : ['no_targetable_biomarker_found', 'consider_chemo_or_clinical_trial'],
    biomarker_method_used: biomarker_method,
    citation: CITATIONS.NCCN_SOLID,
  };
}

function chemoDoseCalculation(input) {
  const { drug, weight_kg, height_cm, age, egfr, bilirubin, ast, performance_status, prior_dose_reduction } = input;
  const bsa = Math.sqrt((height_cm * weight_kg) / 3600);
  let dose_mg_per_m2 = 0;
  let dose_mg_per_kg = 0;
  if (drug === 'paclitaxel') dose_mg_per_m2 = 175;
  else if (drug === 'docetaxel') dose_mg_per_m2 = 75;
  else if (drug === 'carboplatin') dose_mg_per_m2 = 5; // AUC
  else if (drug === 'doxorubicin') dose_mg_per_m2 = 60;
  else if (drug === 'cisplatin') dose_mg_per_m2 = 75;
  else if (drug === 'pemetrexed') dose_mg_per_m2 = 500;
  let total_dose = dose_mg_per_m2 * bsa;
  let dose_reduction_pct = 0;
  if (egfr < 60 && ['cisplatin', 'carboplatin', 'pemetrexed'].includes(drug)) dose_reduction_pct += 25;
  if (bilirubin > 1.5) dose_reduction_pct += 25;
  if (ast > 3 * upper_normal_limit) dose_reduction_pct += 25;
  if (performance_status === 2) dose_reduction_pct += 20;
  if (age >= 70) dose_reduction_pct += 10;
  if (prior_dose_reduction) dose_reduction_pct += 25;
  total_dose = total_dose * (1 - dose_reduction_pct / 100);
  return { drug, bsa: Math.round(bsa * 100) / 100, total_dose_mg: Math.round(total_dose), dose_reduction_pct: Math.min(75, dose_reduction_pct), citation: CITATIONS.NCCN_SOLID };
}

function survivorshipPlan(input) {
  const { cancer_type, end_treatment_date, current_age, comorbidity, last_followup, psychosocial_needs, fertility_preservation_concern } = input;
  return {
    followup_interval_months: comorbidity === 'severe' ? 3 : 6,
    surveillance_imaging: cancer_type === 'breast' ? 'annual_mammogram_x_5_years_then_2y' : cancer_type === 'colon' ? 'CT_chest_abdomen_annually_x_5_years' : 'tailored_per_cancer_type',
    psychosocial_needs: psychosocial_needs || 'screen_for_distress_anxiety_depression',
    cardio_oncology: cancer_type === 'breast' && (['doxorubicin', 'trastuzumab'].includes('chemo_exposure')) ? 'echocardiogram_Q12M_x_5_years' : 'consider_if_anthracycline_or_trastuzumab',
    fertility_preservation: fertility_preservation_concern ? 'refer_to_reproductive_endocrinology' : 'completed_or_not_applicable',
    chronic_symptom_management: ['fatigue', 'cognitive_changes_chemo_brain', 'sexual_dysfunction', 'lymphedema_if_axillary'],
    health_promotion: ['weight_management', 'exercise_150min_per_week', 'smoking_cessation', 'alcohol_limit', 'sun_protection_if_skin_cancer_hx'],
  };
}

module.exports = { tnmStage, performanceScore, ctcaeGrading, targetedTherapyEligibility, chemoDoseCalculation, survivorshipPlan, CITATIONS, ValidationError };