/**
 * TIER3_NEURO-301 Stroke Engine
 * NIHSS + ASPECTS + tPA candidacy + thrombectomy eligibility + stroke etiology + rehabilitation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHA_2024: 'AHA/ASA Stroke 2024', ESO: 'ESO 2021' };

function nihssScore(input) {
  const items = ['consciousness', 'orientation', 'commands', 'gaze', 'visual_fields', 'facial_palsy', 'motor_arm', 'motor_leg', 'ataxia', 'sensory', 'language', 'dysarthria', 'extinction'];
  let total = 0;
  for (const k of items) {
    const v = input[k];
    if (v !== undefined && v !== null) total += Number(v);
  }
  let severity = 'minor';
  if (total >= 21) severity = 'severe';
  else if (total >= 16) severity = 'moderate_severe';
  else if (total >= 6) severity = 'moderate';
  return { nihss_total: total, severity, max_score: 42, citation: CITATIONS.AHA_2024 };
}

function aspectsScore(input) {
  const { early_ischemic_changes_in_10_regions } = input;
  let score = 10;
  const affected_regions = early_ischemic_changes_in_10_regions || 0;
  score -= affected_regions;
  return { aspects: score, favorable_for_thrombectomy: score >= 6, score_interpretation: score >= 8 ? 'normal' : score >= 6 ? 'mild_early_changes' : 'significant_early_changes' };
}

function tPACandidacy(input) {
  const { age, stroke_onset_minutes, nihss, systolic_bp, diastolic_bp, glucose_mg_dl, on_anticoagulant, recent_surgery, recent_stroke, active_bleeding } = input;
  const within_window = stroke_onset_minutes <= 270;
  const inclusion = within_window && nihss >= 6 && systolic_bp < 185 && diastolic_bp < 110 && glucose_mg_dl >= 50 && glucose_mg_dl < 400 && !active_bleeding;
  const exclusion = on_anticoagulant === 'DOAC_within_48h' || recent_surgery === 'within_14d' || recent_stroke === 'within_3mo' || active_bleeding;
  return {
    within_window,
    inclusion_met: inclusion && !exclusion,
    exclusion,
    tpa_dose: inclusion ? 'alteplase_0.9mg_per_kg_max_90mg' : 'not_indicated',
    ten_percent_bolus: inclusion ? 'give_10pct_bolus_then_60min_infusion' : 'not_indicated',
    citation: CITATIONS.AHA_2024,
  };
}

function thrombectomyEligibility(input) {
  const { nihss, aspects, last_known_well_hours, large_vessel_occlusion, age, premorbid_mrs, ct_perfusion_positive_mismatch } = input;
  const within_24h = last_known_well_hours <= 24 && large_vessel_occlusion && aspects >= 6 && premorbid_mrs <= 1;
  const extended_window = last_known_well_hours <= 6 || (last_known_well_hours <= 24 && ct_perfusion_positive_mismatch);
  return {
    eligible: within_24h && extended_window,
    nihss_threshold_met: nihss >= 6,
    aspects_threshold_met: aspects >= 6,
    window_selection: extended_window ? 'extended_window_with_perfusion' : 'standard_window_6h',
    citation: CITATIONS.ESO,
  };
}

function strokeEtiology(input) {
  const { atrial_fibrillation, carotid_stenosis_pct, aortic_arch_plaque, recent_mi, dissection, hypercoagulable } = input;
  let etiology = 'undetermined';
  if (atrial_fibrillation) etiology = 'cardioembolic_AF';
  else if (carotid_stenosis_pct >= 70) etiology = 'large_artery_atherosclerosis';
  else if (recent_mi || aortic_arch_plaque >= 4) etiology = 'large_artery_aortic_arch';
  else if (dissection) etiology = 'arterial_dissection';
  else if (hypercoagulable) etiology = 'hypercoagulable_state';
  else etiology = 'undetermined_or_cryptogenic';
  return { etiology, workup_completed: ['echo', 'telemonitoring_24h', 'carotid_duplex', 'CTA_head_neck'] };
}

function strokeRehabPlan(input) {
  const { nihss, mrs_discharge, swallowing_assessment_done, mrs_premorbid } = input;
  return {
    rehabilitation_needed: mrs_discharge >= 1,
    inpatient_rehab: mrs_discharge >= 3 || nihss >= 10,
    speech_therapy: swallowing_assessment_done === 'failed_or_dysphagia',
    mrs_premorbid,
    mrs_discharge,
    expected_recovery_weeks: mrs_discharge <= 2 ? 4 : mrs_discharge <= 4 ? 12 : 26,
    citation: CITATIONS.AHA_2024,
  };
}

module.exports = { nihssScore, aspectsScore, tPACandidacy, thrombectomyEligibility, strokeEtiology, strokeRehabPlan, CITATIONS, ValidationError };