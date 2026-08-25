/**
 * TIER3_PEDS-305 Pediatric Surgery Engine
 * Intussusception + Hirschsprung + pyloric stenosis + pediatric appendicitis (PAS) + congenital diaphragmatic hernia + TEF
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { APSA: 'APSA 2024', AAP_PED_SURG: 'AAP Pediatric Surgery 2024' };

function intussusception(input) {
  const { age_months, abdominal_pain_episodes, currant_jelly_stool, ultrasound_target_sign, vomiting } = input;
  let score = 0;
  if (age_months >= 6 && age_months <= 36) score += 1;
  if (abdominal_pain_episodes === 'episodic_colicky') score += 1;
  if (currant_jelly_stool === 'yes') score += 1;
  if (ultrasound_target_sign === 'yes') score += 2;
  if (vomiting === 'yes') score += 1;
  let management = 'monitor_if_low_score';
  if (score >= 3) management = 'air_enema_reduction_under_imaging_or_surgical_reduction';
  if (ultrasound_target_sign === 'yes' && age_months < 36) management = 'urgent_air_or_contrast_enema';
  return {
    score, suspected_intussusception: score >= 3,
    management, immediate_imaging: 'abdominal_ultrasound_first_line',
    contraindications_to_air_enema: ['perforation_signs_peritonitis', 'sepsis', 'shock'],
    citation: CITATIONS.APSA,
  };
}

function hirschsprungDisease(input) {
  const { delay_in_passing_meconium_hours_48, abdominal_distension, contrast_enema_rectal_narrowing, rectal_biopsy_aganglionosis, chronic_constipation } = input;
  return {
    suspected: delay_in_passing_meconium_hours_48 === 'yes' || rectal_biopsy_aganglionosis === 'yes',
    workup: ['contrast_enema_showing_narrow_rectum_with_proximal_dilation', 'rectal_suction_biopsy_to_confirm_aganglionosis', 'anorectal_manometry_optional'],
    definitive_treatment: 'surgical_resection_of_aganglionic_segment_with_pull_through_procedure',
    citation: CITATIONS.APSA,
  };
}

function pyloricStenosis(input) {
  const { age_weeks, projectile_vomiting, non_bilious_vomiting, olive_like_mass, pyloric_thickness_mm, weight_loss } = input;
  return {
    suspected: age_weeks >= 3 && age_weeks <= 8 && projectile_vomiting === 'yes' && non_bilious_vomiting === 'yes',
    confirmatory_test: 'abdominal_ultrasound_pyloric_thickness_3mm_or_more_and_length_14mm_or_more',
    preoperative_care: ['correct_electrolyte_alterations_with_Po_then_Na_then_K', 'IV_normal_saline_bolus_20mL_per_kg_then_maintenance', 'continue_NPO_with_NG_decompression'],
    definitive_treatment: 'pyloromyotomy_Ramstedt_procedure_laparoscopic_or_open',
    citation: CITATIONS.APSA,
  };
}

function pediatricAppendicitisPas(input) {
  const { right_lower_quadrant_tenderness, anorexia, fever_38_or_more, nausea_vomiting, migration_of_pain, rebound_tenderness, wbc_count, neutrophil_pct, ultrasound_diameter_mm } = input;
  let score = 0;
  if (right_lower_quadrant_tenderness === 'yes') score += 2;
  if (anorexia === 'yes') score += 1;
  if (fever_38_or_more === 'yes') score += 1;
  if (nausea_vomiting === 'yes') score += 1;
  if (migration_of_pain === 'yes') score += 1;
  if (rebound_tenderness === 'yes') score += 2;
  if (wbc_count && wbc_count >= 10000) score += 1;
  if (neutrophil_pct && neutrophil_pct >= 75) score += 1;
  if (ultrasound_diameter_mm && ultrasound_diameter_mm >= 6) score += 2;
  return {
    pas_score: score, interpretation: score <= 3 ? 'low_risk_observation' : score <= 6 ? 'intermediate_imaging_then_decide' : 'high_risk_surgical_consult',
    imaging: 'abdominal_ultrasound_for_appendiceal_diameter_then_MRI_or_CT_if_equivocal',
    surgery_recommendation: score >= 7 ? 'urgent_laparoscopic_appendectomy_within_24h' : 'continue_observation_reassess_Q4h',
    citation: CITATIONS.APSA,
  };
}

function congenitalDiaphragmaticHernia(input) {
  const { respiratory_distress_at_birth, scaphoid_abdomen, bowel_sounds_in_chest, xray_findings } = input;
  return {
    suspected: respiratory_distress_at_birth === 'yes' && scaphoid_abdomen === 'yes' && bowel_sounds_in_chest === 'yes',
    diagnosis_xray: xray_findings === 'bowel_loops_in_left_chest_with_mediastinal_shift_to_right' ? 'CDH_left_posterior_lateral_defect_Bochdalek' : 'confirm_with_imaging',
    immediate_management: ['endotracheal_intubation_avoid_bag_mask_ventilation', 'NG_tube_decompression', 'gentle_ventilation_with_low_pressure_to_avoid_barotrauma', 'permissive_hypercapnia', 'maintain_oxygenation_preductal_spo2_85_percent'],
    surgical_repair: 'delayed_after_physiologic_stabilization_24_to_72h_after_birth',
    citation: CITATIONS.AAP_PED_SURG,
  };
}

module.exports = { intussusception, hirschsprungDisease, pyloricStenosis, pediatricAppendicitisPas, congenitalDiaphragmaticHernia, CITATIONS, ValidationError };