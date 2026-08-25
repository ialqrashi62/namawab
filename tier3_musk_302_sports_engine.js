/**
 * TIER3_MUSK-302 Sports Medicine Engine
 * ACL/PCL/MCL grading + meniscus tear classification + rotator cuff + PRP indication + RTS (return to sport)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AOSSM: 'AOSSM 2024', ESSKA: 'ESSKA 2024' };

function aclClassification(input) {
  const { lachman_test, anterior_drawer, pivot_shift, mri_signal } = input;
  let grade = 'I_partial';
  if (lachman_test >= 5 && anterior_drawer >= 5 && pivot_shift === 'positive' && mri_signal === 'complete_tear') grade = 'III_complete_rupture';
  else if (lachman_test >= 3 && pivot_shift === 'positive') grade = 'II_intact_but_lax';
  return { grade, surgery_indicated: grade === 'III_complete_rupture' && patient_demands === 'high' ? 'reconstruction_with_graft' : 'conservative_then_reconsider', citation: CITATIONS.AOSSM };
}

function meniscusTearClassification(input) {
  const { tear_pattern, location, size_cm, radial_zone, displaced, root_tear } = input;
  let repair_amenable = false;
  if (location === 'red_red_zone' && size_cm <= 5 && tear_pattern !== 'complex_degenerative') repair_amenable = true;
  if (root_tear) repair_amenable = true;
  return {
    pattern: tear_pattern, location, size_cm,
    repair_amenable,
    treatment: repair_amenable ? 'arthroscopic_meniscal_repair_inside_out_OR_all_inside' : root_tear ? 'root_repair_to_preserve_meniscus_function' : 'partial_meniscectomy_if_degenerative_irreparable',
    citation: CITATIONS.ESSKA,
  };
}

function rotatorCuff(input) {
  const { tear_size_cm, retraction_staging, fatty_infiltration, age, muscle_atrophy } = input;
  let surgery = 'consider_if_3cm_with_good_quality_remaining';
  if (tear_size_cm >= 3 && age < 65 && fatty_infiltration === 'low') surgery = 'arthroscopic_rotator_cuff_repair_recommended';
  else if (tear_size_cm < 1 && age < 65) surgery = 'arthroscopic_debridement_conservative';
  else if (tear_size_cm >= 5 || fatty_infiltration === 'severe' || age >= 70) surgery = 'consider_reverse_total_shoulder_or_long_head_biceps_tenotomy_only';
  return { tear_size_cm, retraction_staging, fatty_infiltration, surgery, prognosis: fatty_infiltration === 'low' ? 'good_repair_healing_potential' : 'guarded_repair_outcome', citation: CITATIONS.AOSSM };
}

function prpIndication(input) {
  const { indication, age, severity } = input;
  const eligible_indications = ['lateral_epicondylitis', 'mild_moderate_knee_OA', 'plantar_fasciitis', 'patellar_tendinopathy', 'partial_rotator_cuff_tear'];
  return {
    eligible: eligible_indications.includes(indication) && age <= 70,
    indication, severity,
    protocol: 'leukocyte_rich_PRP_single_injection_then_Q6_months_if_no_response',
    alternatives: ['prolotherapy', 'extracorporeal_shock_wave', 'physical_therapy_first_then_PRP'],
    citation: CITATIONS.AOSSM,
  };
}

function returnToSport(input) {
  const { surgery_type, months_post_surgery, hop_test, y_balance, isokinetic_strength, psychological_readiness } = input;
  let criteria_met = false;
  if (surgery_type === 'ACL_reconstruction' && months_post_surgery >= 9 && hop_test >= 90 && y_balance >= 95 && isokinetic_strength >= 90 && psychological_readiness >= 80) criteria_met = true;
  return {
    surgery_type, months_post_surgery,
    hop_test_pct, y_balance_pct: y_balance, isokinetic_strength_pct: isokinetic_strength, psychological_readiness,
    return_to_sport_cleared: criteria_met,
    criteria_failed: [hop_test < 90 && 'hop_test', y_balance < 95 && 'y_balance', isokinetic_strength < 90 && 'isokinetic_strength', psychological_readiness < 80 && 'psychological'].filter(Boolean),
  };
}

module.exports = { aclClassification, meniscusTearClassification, rotatorCuff, prpIndication, returnToSport, CITATIONS, ValidationError };