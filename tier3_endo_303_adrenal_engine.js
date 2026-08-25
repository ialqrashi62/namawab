/**
 * TIER3_ENDO-303 Adrenal Disease Engine
 * Cushing workup + Addisonian crisis + hyperaldosteronism + pheochromocytoma + adrenal incidentaloma
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ENDO_CUSHING: 'Endocrine Society Cushing 2008', ENDO_PHEO: 'Endocrine Society Pheo 2014', ESE_HALDO: 'ESCE Primary Aldosteronism 2020' };

function cushingsWorkup(input) {
  const { cortisol_am, acth, dst_cortisol, urinary_free_cortisol_24h, lat_cortisol_salivary, females, on_oral_contraceptive } = input;
  let positive = false;
  if (dst_cortisol >= 1.8) positive = true;
  if (urinary_free_cortisol_24h > upper_limit && !on_oral_contraceptive) positive = true;
  if (lat_cortisol_salivary > upper_limit) positive = true;
  let acth_level = 'normal';
  if (acth < 5) acth_level = 'suppressed_acth_independent_cushing';
  else if (acth > 20) acth_level = 'elevated_acth_dependent';
  return {
    dst_cortisol: Math.round(dst_cortisol * 100) / 100,
    urinary_free_cortisol: urinary_free_cortisol_24h,
    cushings_diagnosed: positive,
    acth_status: acth_level,
    next_step: positive ? 'pituitary_MRI_if_acth_dependent OR adrenal_CT_if_suppressed' : 'consider_pseudo_cushing_or_obesity',
    citation: CITATIONS.ENDO_CUSHING,
  };
}

function adrenalCrisis(input) {
  const { sodium, potassium, cortisol_am, bp_systolic, hr, mental_status } = input;
  const crisis_likely = bp_systolic < 90 && sodium < 130 && cortisol_am < 3;
  return {
    crisis_likely,
    immediate_treatment: [
      'IV hydrocortisone 100mg bolus immediately',
      '0.9% saline 1L bolus (repeat as needed)',
      'Continue hydrocortisone 50mg IV q6h',
      'Correct electrolytes (especially hyperkalemia)',
      'Identify and treat precipitating cause',
    ],
    fludrocortisone: 'start_0.1mg_daily_after_stabilization',
    citation: CITATIONS.ENDO_CUSHING,
  };
}

function primaryAldosteronismWorkup(input) {
  const { aldosterone, renin, ratio, potassium, on_acei, on_arb } = input;
  const positive_screen = ratio >= 20 && aldosterone >= 15;
  return {
    ratio: Math.round(ratio * 10) / 10,
    screen_positive: positive_screen,
    interpretation: positive_screen ? 'PA_likely' : 'PA_unlikely',
    confirmatory_tests: ['saline_load_test', 'oral_sodium_load', 'fludrocortisone_suppression', 'captopril_challenge'],
    subtype_testing: 'adrenal_CT + adrenal_vein_sampling',
    treatment_unilateral: 'laparoscopic_adrenalectomy',
    treatment_bilateral: 'spironolactone_or_eplerenone',
    caveat: 'Off_ACEi_ARB_4wks_preferred if clinically safe (potassium_replete)',
  };
}

function pheochromocytomaWorkup(input) {
  const { plasma_free_metanephrines, urinary_metanephrines_24h, bp_severe, episodic_headaches, palpitations, diaphoresis, mibg_scan } = input;
  const positive = (plasma_free_metanephrines && plasma_free_metanephrines > 3 * upper_limit) || (urinary_metanephrines_24h > 2 * upper_limit);
  return {
    plasma_free_metanephrines, urinary_metanephrines_24h,
    pheochromocytoma_likely: positive,
    imaging_indicated: positive ? 'CT_or_MRI_adrenal' : 'not_yet',
    mibg_scan: positive && bp_severe ? 'consider_MIBG_for_metastatic' : 'not_indicated',
    preoperative_blockade: 'phenoxybenzamine 10mg BID titrate to BP control 7-14 days',
    surgical_management: 'laparoscopic_adrenalectomy_after_blockade',
    citation: CITATIONS.ENDO_PHEO,
  };
}

function adrenalIncidentaloma(input) {
  const { size_cm, density_hu, enhancement_washout, hormonal_workup, history_cancer } = input;
  const surgical = size_cm >= 4 || density_hu > 20 || enhancement_washout < 50 || hormonal_workup === 'functional';
  return {
    size_cm, density_hu, enhancement_washout,
    surgical_referral: surgical,
    biopsy_indicated: !history_cancer || history_cancer === 'unknown',
    followup_interval_months: size_cm < 2 ? 12 : size_cm < 4 ? 6 : 3,
    hormonal_workup_required: ['cortisol_post_DST', 'aldosterone_renin', 'plasma_metanephrines', 'sex_steroids'],
    citation: CITATIONS.ENDO_PHEO,
  };
}

module.exports = { cushingsWorkup, adrenalCrisis, primaryAldosteronismWorkup, pheochromocytomaWorkup, adrenalIncidentaloma, CITATIONS, ValidationError };