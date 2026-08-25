/**
 * TIER3_OPHTH-304 Cornea / Refractive Surgery Engine
 * Keratoconus screening + Refractive surgery candidacy (LASIK/PRK/SMILE) + Corneal ulcer evaluation + Pterygium grading + Fuchs dystrophy assessment
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_CORNEA: 'AAO Cornea Preferred Practice 2024' };

function keratoconusScreening(input) {
  const { topography_pattern, keratometry_steepest_k, pachymetry_thinnest_um, posterior_elevation_abnormal, patient_age_years, progression_evidence } = input;
  let diagnosis = 'normal_cornea';
  if (topography_pattern === 'irregular_asymmetric_bow_tie' || keratometry_steepest_k >= 48) diagnosis = 'keratoconus_suspected';
  if (posterior_elevation_abnormal === 'yes' && pachymetry_thinnest_um < 450) diagnosis = 'advanced_keratoconus_or_keratoconus_with_cornea_thinning';
  let treatment = 'observation_with_serial_topography_Q6_months';
  if (diagnosis === 'keratoconus_suspected') treatment = 'observation_with_serial_topography_and_consider_CXL_if_progression';
  if (diagnosis === 'advanced_keratoconus_or_keratoconus_with_cornea_thinning') treatment = 'rigid_gas_permeable_contact_lens_or_intacs_or_CXL_then_topography_planning_keratoplasty_if_severe';
  return {
    diagnosis, topography_pattern, keratometry_steepest_k, pachymetry_thinnest_um, posterior_elevation_abnormal,
    treatment, cxl_indicated: progression_evidence === 'yes' ? 'yes_UV_crosslinking_to_halt_progression' : 'no_observe',
    citation: CITATIONS.AAO_CORNEA,
  };
}

function refractiveSurgeryCandidacy(input) {
  const { refraction_spherical_equivalent, refraction_astigmatism, pachymetry_thick_um, topography_stable, dry_eye_present, age_years, pupil_size_mm, occupational_risk } = input;
  const in_range = Math.abs(refraction_spherical_equivalent) <= 10 && refraction_astigmatism <= 3 && pachymetry_thick_um >= 480;
  const safe = topography_stable === 'yes' && dry_eye_present !== 'severe';
  let procedure = 'none';
  if (in_range && safe) {
    if (occupational_risk === 'high_impact_sports_military') procedure = 'PRK_preferred_no_flap_creation';
    else if (age_years >= 30 && pachymetry_thick_um >= 500) procedure = 'LASIK_or_SMILE_acceptable';
    else procedure = 'LASIK_for_adequate_pachymetry';
  }
  return {
    candidate: in_range && safe, refraction_spherical_equivalent, pachymetry_thick_um, dry_eye_present, age_years, pupil_size_mm,
    procedure_recommendation: procedure, contraindication: !safe ? 'dry_eye_or_topography_unstable' : !in_range ? 'refraction_outside_range' : 'none',
    citation: CITATIONS.AAO_CORNEA,
  };
}

function cornealUlcerEvaluation(input) {
  const { corneal_infiltrate_size_mm, hypopyon_present, pain_severity, vision_loss, contact_lens_wearer, gram_stain_result, prior_topical_steroid } = input;
  let severity = 'uncomplicated';
  if (contact_lens_wearer === 'yes' && corneal_infiltrate_size_mm >= 3) severity = 'high_risk_for_Pseudomonas_aeruginosa';
  if (hypopyon_present === 'yes' && vision_loss === 'severe') severity = 'severe_bacterial_keratitis_with_posterior_segment_involvement';
  return {
    severity, corneal_infiltrate_size_mm, hypopyon_present, contact_lens_wearer,
    empirical_treatment: severity === 'uncomplicated' ? 'moxifloxacin_or_gatifloxacin_fluoroquinolone_Q1h_and_cycloplegic' : severity === 'high_risk_for_Pseudomonas_aeruginosa' ? 'fortified_tobramycin_14mg_per_mL_and_cefazolin_50mg_per_mL_Q1h_alternating' : 'fortified_antibiotics_with_vitreous_tap_if_endophthalmitis_suspected',
    workup: ['corneal_scraping_for_gram_stain_KOH_and_culture', 'viral_PCR_if_HSV_suspected', 'avoid_contact_lens_use_until_complete_resolution'],
    citation: CITATIONS.AAO_CORNEA,
  };
}

function pterygiumGrading(input) {
  const { pterygium_extent, visual_axis_involvement, induced_astigmatism_diopters, inflammation_active, binocular_discomfort } = input;
  let surgical_indication = false;
  if (visual_axis_involvement === 'yes' || induced_astigmatism_diopters >= 1.5 || binocular_discomfort === 'yes') surgical_indication = true;
  return {
    surgical_indication, pterygium_extent, visual_axis_involvement, induced_astigmatism_diopters,
    technique: surgical_indication ? 'pterygium_excision_with_conjunctival_autograft_fibrin_glue_preferred_to_reduce_recurrence' : 'observation_artificial_tears_prn_sun_protection',
    recurrence_risk: 'recurrence_rate_5_to_15pct_with_conjunctival_autograft',
    citation: CITATIONS.AAO_CORNEA,
  };
}

function fuchsDystrophyAssessment(input) {
  const { corneal_guttata_present, central_corneal_thickness_um, endothelial_cell_density, vision_with_glare, fuchs_severity_stage } = input;
  let progression_risk = 'low';
  if (central_corneal_thickness_um && central_corneal_thickness_um >= 640) progression_risk = 'increased_risk_for_decompensation';
  if (fuchs_severity_stage >= 4) progression_risk = 'advanced_high_risk_for_decompensation';
  return {
    progression_risk, central_corneal_thickness_um, endothelial_cell_density, vision_with_glare, fuchs_severity_stage,
    treatment: progression_risk === 'advanced_high_risk_for_decompensation' ? 'consider_Descemet_membrane_endothelial_keratoplasty_DMEK_or_DSAEK' : progression_risk === 'increased_risk_for_decompensation' ? 'hypertonic_saline_drop_QID_for_corneal_edema_and_observation_Q6_months' : 'observation_Q12_months_no_treatment',
    surgical_options: ['DMEK_preferred_for_faster_visual_recovery', 'DSAEK_for_complex_anatomy', 'PKP_for_advanced_disease'],
    citation: CITATIONS.AAO_CORNEA,
  };
}

module.exports = { keratoconusScreening, refractiveSurgeryCandidacy, cornealUlcerEvaluation, pterygiumGrading, fuchsDystrophyAssessment, CITATIONS, ValidationError };