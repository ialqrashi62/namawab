/**
 * TIER3_DERM-301 General Dermatology Engine
 * Burn assessment (Rule of 9s) + Stevens-Johnson syndrome (SJS/TEN) + Drug reaction (DRESS) + Acne (severity) + Psoriasis (PASI)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAD: 'AAD Practice Guidelines 2024', BAD: 'BAD Dermatology 2024' };

function burnAssessmentRule9s(input) {
  const { head_pct, anterior_trunk_pct, posterior_trunk_pct, each_arm_pct, each_leg_pct, perineum_pct, depth_grade, inhalation_injury } = input;
  const tbsa_burned_pct = head_pct + anterior_trunk_pct + posterior_trunk_pct + (each_arm_pct * 2) + (each_leg_pct * 2) + perineum_pct;
  let severity = 'minor_burn_outpatient';
  if (tbsa_burned_pct >= 20 || depth_grade === 'third_or_fourth') severity = 'major_burn_admit_to_burn_center';
  else if (tbsa_burned_pct >= 10 || depth_grade === 'second_deep' || inhalation_injury === 'yes') severity = 'moderate_burn_admit_for_observation';
  return {
    tbsa_burned_pct, depth_grade, inhalation_injury,
    severity, fluid_resuscitation: severity === 'major_burn_admit_to_burn_center' || severity === 'moderate_burn_admit_for_observation' ? 'parkland_formula_4mL_per_kg_per_pct_TBSA_lactated_Ringers_first_24h_half_in_first_8h' : 'oral_hydration',
    burn_center_referral: tbsa_burned_pct >= 10 || depth_grade === 'third_or_fourth' || inhalation_injury === 'yes' || perineum_pct > 0 || each_leg_pct > 50 ? 'yes' : 'no',
    citation: CITATIONS.AAD,
  };
}

function stevensJohnsonSjsTen(input) {
  const { body_surface_area_detached_pct, mucosal_involvement, drug_exposure_history, onset_weeks, nikolsky_sign, scorten_score } = input;
  let classification = 'SJS';
  if (body_surface_area_detached_pct >= 30) classification = 'TEN_toxic_epidermal_necrolysis';
  else if (body_surface_area_detached_pct >= 10) classification = 'SJS_TEN_overlap';
  let prognosis = 'mortality_5_to_10pct';
  if (classification === 'TEN_toxic_epidermal_necrolysis') prognosis = 'mortality_30_to_50pct';
  else if (classification === 'SJS_TEN_overlap') prognosis = 'mortality_15_to_25pct';
  return {
    classification, body_surface_area_detached_pct, scorten_score, mucosal_involvement,
    treatment: ['stop_offending_drug_immediately', 'admit_to_burn_unit_or_ICU', 'supportive_care_fluid_electrolyte_nutrition', 'wound_care_with_nonadherent_dressing', 'consider_IVIG_cyclosporine_etanercept_for_TEN', 'ophthalmology_consultation_for_ocular_involvement'],
    prognosis, citation: CITATIONS.BAD,
  };
}

function drugReactionDress(input) {
  const { rash_extent, fever_present, lymphadenopathy, eosinophilia, organ_involvement, time_to_onset_weeks, regi_score } = input;
  const features_count = [rash_extent === 'generalized', fever_present === 'yes', lymphadenopathy === 'yes', eosinophilia === 'yes', organ_involvement === 'yes'].filter(Boolean).length;
  const dress_likely = (time_to_onset_weeks >= 2 && time_to_onset_weeks <= 8) && features_count >= 3;
  return {
    dress_likely, features_count, time_to_onset_weeks,
    management: dress_likely ? ['stop_offending_drug_immediately', 'systemic_steroid_prednisone_1mg_per_kg_daily_or_IV_methylprednisolone', 'dermatology_consultation', 'monitor_liver_kidney_thyroid_function', 'taper_steroid_over_6_to_8_weeks_to_prevent_rebound'] : 'continue_observation_with_offending_drug_held',
    workup: ['CBC_with_eosinophil_count', 'LFTs_renal_thyroid_function', 'EBV_HHV6_7_viral_serology', 'consider_skin_biopsy_for_pathology'],
    citation: CITATIONS.BAD,
  };
}

function acneSeverityClassification(input) {
  const { comedones, papules, pustules, nodules_cysts, scarring_present, treatment_history } = input;
  let severity = 'mild_acne';
  if (nodules_cysts >= 5 || scarring_present === 'yes') severity = 'severe_nodulocystic_acne';
  else if (papules >= 10 || pustules >= 10) severity = 'moderate_acne';
  else if (comedones >= 20 || papules >= 5) severity = 'mild_to_moderate_acne';
  return {
    severity, comedones, papules, pustules, nodules_cysts, scarring_present,
    treatment: severity === 'severe_nodulocystic_acne' ? ['oral_isotretin_for_severe_acne_with_dermatology_supervision', 'iPLEDGE_program_enrollment', 'lab_monitoring_lipids_lfts_pregnancy_test'] : severity === 'moderate_acne' ? ['topical_retinoid_plus_benzoyl_peroxide', 'consider_topical_antibiotic_or_oral_antibiotic'] : ['topical_retinoid_or_benzoyl_peroxide', 'gentle_cleanser_noncomedogenic_products'],
    citation: CITATIONS.AAD,
  };
}

function psoriasisPasi(input) {
  const { head_pct, trunk_pct, upper_extremities_pct, lower_extremities_pct, erythema, induration, desquamation } = input;
  const head_area = head_pct * (erythema + induration + desquamation) / 3;
  const trunk_area = trunk_pct * (erythema + induration + desquamation) / 3;
  const upper_area = upper_extremities_pct * (erythema + induration + desquamation) / 3;
  const lower_area = lower_extremities_pct * (erythema + induration + desquamation) / 3;
  const pasi_score = head_area + trunk_area + upper_area + lower_area;
  let severity = 'mild_psoriasis';
  if (pasi_score >= 20) severity = 'severe_psoriasis';
  else if (pasi_score >= 10) severity = 'moderate_psoriasis';
  return {
    pasi_score: pasi_score.toFixed(1), severity, body_surface_area: (head_pct + trunk_pct + upper_extremities_pct + lower_extremities_pct).toFixed(1),
    treatment: severity === 'severe_psoriasis' ? ['biologics_TNF_inhibitor_IL17_IL23_IL12_23_inhibitor', 'methotrexate_or_apremilast_or_cyclosporine', 'phototherapy_UVB_NB_or_PUVA'] : severity === 'moderate_psoriasis' ? ['phototherapy_or_systemic_therapy', 'topical_combination_steroid_calcipotriene', 'consider_biologics_if_quality_of_life_impacted'] : ['topical_corticosteroid_with_calcipotriene', 'topical_tazarotene'],
    citation: CITATIONS.AAD,
  };
}

module.exports = { burnAssessmentRule9s, stevensJohnsonSjsTen, drugReactionDress, acneSeverityClassification, psoriasisPasi, CITATIONS, ValidationError };