/**
 * TIER3_ANESTH-303 Regional Anesthesia Engine
 * Spinal anesthesia dose + Epidural dosing + Nerve block selection + Local anesthetic toxicity (LAST) + Coagulation check before block
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASRA: 'ASRA Regional Anesthesia 2024', ESRA: 'ESRA 2024' };

function spinalAnesthesiaDosing(input) {
  const { height_cm, weight_kg, age_years, surgical_procedure_level, drug } = input;
  let dose_mg = 0;
  if (drug === 'bupivacaine_0.5_percent') dose_mg = 15;
  else if (drug === 'ropivacaine_0.5_percent') dose_mg = 18;
  else if (drug === 'tetracaine_1_percent') dose_mg = 12;
  if (height_cm >= 180) dose_mg += 2;
  else if (height_cm <= 160) dose_mg -= 2;
  if (age_years >= 70) dose_mg -= 2;
  return {
    drug, dose_mg, height_cm, weight_kg, age_years,
    expected_block_level: surgical_procedure_level === 'lower_abdominal' ? 'T6_to_T10' : surgical_procedure_level === 'hip_or_lower_extremity' ? 'T10_to_T12' : 'saddle_block_S2_to_S5',
    baricity: drug === 'bupivacaine_0.5_percent' ? 'isobaric_or_hyperbaric' : 'isobaric',
    citation: CITATIONS.ASRA,
  };
}

function epiduralDosingCalculation(input) {
  const { catheter_level, drug, concentration_pct, bolus_volume_ml, infusion_rate_ml_per_h } = input;
  let total_mg_per_h = 0;
  if (drug === 'bupivacaine_0.1_percent') total_mg_per_h = infusion_rate_ml_per_h * 1;
  else if (drug === 'ropivacaine_0.2_percent') total_mg_per_h = infusion_rate_ml_per_h * 2;
  else if (drug === 'lidocaine_1.5_percent') total_mg_per_h = infusion_rate_ml_per_h * 15;
  return {
    catheter_level, drug, concentration_pct, bolus_volume_ml, infusion_rate_ml_per_h,
    total_mg_per_h,
    max_safe_dose_mg_per_h: drug === 'bupivacaine_0.1_percent' ? 20 : drug === 'ropivacaine_0.2_percent' ? 20 : drug === 'lidocaine_1.5_percent' ? 30 : 'consult_reference',
    monitoring: ['pain_score_Q1h', 'motor_block_score_Q4h', 'blood_pressure_Q5min_first_30min_then_Q15min', 'sedation_score_Q4h'],
    citation: CITATIONS.ESRA,
  };
}

function nerveBlockSelection(input) {
  const { surgical_procedure, block_indications, patient_position_acceptable, coagulation_ok } = input;
  let recommended_block = 'no_block_indicated';
  if (!coagulation_ok) recommended_block = 'no_block_safe_due_to_coagulopathy';
  if (surgical_procedure === 'shoulder_surgery') recommended_block = 'interscalene_brachial_plexus_block';
  else if (surgical_procedure === 'hand_surgery') recommended_block = 'axillary_or_infraclavicular_brachial_plexus_block';
  else if (surgical_procedure === 'forearm_surgery') recommended_block = 'supraclavicular_brachial_plexus_block';
  else if (surgical_procedure === 'knee_surgery') recommended_block = 'adductor_canals_plus_femoral_block';
  else if (surgical_procedure === 'ankle_surgery') recommended_block = 'popliteal_sciatic_plus_saphenous_block';
  else if (surgical_procedure === 'hernia_inguinal') recommended_block = 'ilioinguinal_iliohypogastric_block_or_TAP_block';
  else if (surgical_procedure === 'abdominal_surgery') recommended_block = 'transversus_abdominis_plane_TAP_block';
  return {
    surgical_procedure, recommended_block, indications: block_indications, position_acceptable: patient_position_acceptable, coagulation_ok,
    ultrasound_guidance: 'recommended_for_all_peripheral_nerve_blocks_for_safety_and_efficacy',
    citation: CITATIONS.ASRA,
  };
}

function lastManagement(input) {
  const { symptoms_present, onsets_minutes_after_block, lipid_emulsion_available } = input;
  const last_symptoms = [];
  if (symptoms_present === 'perioral_numbness_metallic_taste') last_symptoms.push('early_CNS_signs');
  if (symptoms_present === 'tinnitus_visual_disturbance') last_symptoms.push('CNS_excitation');
  if (symptoms_present === 'seizure_or_loss_of_consciousness') last_symptoms.push('CNS_severe');
  if (symptoms_present === 'cardiac_arrest') last_symptoms.push('cardiovascular_collapse');
  let action = 'stop_local_anesthetic_infusion_immediate';
  action += ' call_for_help_monitoring';
  action += ' airway_management_100pct_oxygen';
  if (last_symptoms.includes('CNS_severe') || last_symptoms.includes('cardiovascular_collapse')) action += ' IV_lipid_emulsion_20pct_bolus_1.5_mL_per_kg_over_1_min_then_infusion_0.25_mL_per_kg_per_min';
  return {
    last_recognized: symptoms_present, last_symptoms, action,
    lipid_emulsion_available, follow_up: 'monitor_for_24h_repeat_dosing_prn_do_not_use_propofol_for_seizure',
    citation: CITATIONS.ASRA,
  };
}

function coagulationCheckBeforeBlock(input) {
  const { planned_block, inr_value, platelet_count, anticoagulation_medication, last_anticoagulant_dose_hours } = input;
  const neuraxial_block = planned_block === 'spinal' || planned_block === 'epidural' || planned_block === 'deep_plexus';
  let safe_to_proceed = true;
  const reasons = [];
  if (neuraxial_block) {
    if (inr_value >= 1.5) { safe_to_proceed = false; reasons.push('INR_gt_1.5'); }
    if (platelet_count < 80000) { safe_to_proceed = false; reasons.push('platelets_lt_80k'); }
    if (anticoagulation_medication === 'rivaroxaban' && last_anticoagulant_dose_hours < 72) { safe_to_proceed = false; reasons.push('rivaroxaban_lt_72h'); }
    if (anticoagulation_medication === 'apixaban' && last_anticoagulant_dose_hours < 72) { safe_to_proceed = false; reasons.push('apixaban_lt_72h'); }
    if (anticoagulation_medication === 'enoxaparin_treatment_dose' && last_anticoagulant_dose_hours < 24) { safe_to_proceed = false; reasons.push('LMWH_treatment_lt_24h'); }
    if (anticoagulation_medication === 'enoxaparin_prophylactic_dose' && last_anticoagulant_dose_hours < 12) { safe_to_proceed = false; reasons.push('LMWH_prophylactic_lt_12h'); }
  }
  return {
    safe_to_proceed, reasons_blocking: reasons, planned_block, inr_value, platelet_count, anticoagulation_medication, last_anticoagulant_dose_hours,
    asra_guideline_reference: 'ASRA_anticoagulation_guidelines_for_regional_anesthesia',
    citation: CITATIONS.ASRA,
  };
}

module.exports = { spinalAnesthesiaDosing, epiduralDosingCalculation, nerveBlockSelection, lastManagement, coagulationCheckBeforeBlock, CITATIONS, ValidationError };