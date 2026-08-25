/**
 * TIER3_RENAL-302 AKI Engine
 * KDIGO AKI staging + cause workup + RRT initiation criteria + recovery tracking
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_AKI: 'KDIGO AKI 2012', ADQI: 'ADQI Consensus' };

function akiStaging(input) {
  const { creatinine, baseline_creatinine, urine_output_ml_per_kg_per_h, hours } = input;
  const ratio = creatinine / baseline_creatinine;
  let stage = 'no_AKI';
  let stage_desc = 'No AKI';
  if (baseline_creatinine > 0) {
    if (creatinine >= 4 || ratio >= 3 || (urine_output_ml_per_kg_per_h < 0.3 && hours >= 24)) { stage = 'stage_3'; stage_desc = 'Severe'; }
    else if (creatinine >= baseline_creatinine * 2.0 || (urine_output_ml_per_kg_per_h < 0.5 && hours >= 12)) { stage = 'stage_2'; stage_desc = 'Moderate'; }
    else if (creatinine >= baseline_creatinine * 1.5 || (urine_output_ml_per_kg_per_h < 0.5 && hours >= 6)) { stage = 'stage_1'; stage_desc = 'Mild'; }
  }
  return { stage, stage_desc, ratio: Math.round(ratio * 100) / 100, citation: CITATIONS.KDIGO_AKI };
}

function causeWorkup(input) {
  const { pre_renal, intrinsic, post_renal, fena, uosm, microscopy } = input;
  let cause = 'undetermined'; let pretest = 0;
  if (post_renal && uosm < 350) { cause = 'post_renal_obstruction'; pretest = 80; }
  else if (pre_renal && fena < 1 && uosm > 500) { cause = 'pre_renal'; pretest = 90; }
  else if (intrinsic && fena > 2 && microscopy === 'casts') { cause = 'intrinsic_ATN'; pretest = 85; }
  else if (intrinsic && microscopy === 'red_cell_cast') { cause = 'glomerulonephritis'; pretest = 95; }
  return { cause, pretest_probability_pct: pretest, workup: ['feNa', 'UOsm', 'urine_microscopy', 'renal_ultrasound', 'complement'] };
}

function rrtInitiation(input) {
  const { potassium, ph, pao2, volume_status, uremic_complications } = input;
  const absolute = (potassium >= 6.5 && ecg_changes) || ph < 7.1 || pao2_fio2_ratio < 200;
  const relative = potassium >= 5.5 || volume_status === 'overload' || uremic_complications;
  return {
    absolute_indication: !!absolute,
    relative_indication: !!relative,
    modality: uremic_complications === 'severe' ? 'CRRT' : volume_status === 'overload' ? 'SLED' : 'IHD',
    citation: CITATIONS.ADQI,
  };
}

function akiRecoveryTracking(input) {
  const { baseline_creatinine, current_creatinine, days_since_event } = input;
  const ratio = current_creatinine / baseline_creatinine;
  return {
    recovery_status: ratio <= 1.5 ? 'recovered' : ratio <= 2 ? 'partial_recovery' : 'non_recovery',
    follow_up_recommended: days_since_event <= 90,
    risk_of_ckd: days_since_event > 7 && ratio > 1.5 ? 'elevated' : 'normal',
  };
}

function contrastNephropathyRisk(input) {
  const { egfr, diabetes, age, heart_failure, contrast_volume_ml } = input;
  const score = (egfr < 60 ? 4 : egfr < 45 ? 5 : egfr < 30 ? 6 : 0)
    + (diabetes ? 1 : 0)
    + (age > 75 ? 2 : 0)
    + (heart_failure ? 2 : 0)
    + (contrast_volume_ml > 100 ? 2 : 0);
  return {
    risk_score: score,
    risk_level: score >= 7 ? 'high' : score >= 4 ? 'moderate' : 'low',
    prophylaxis: score >= 4 ? ['IV_saline_pre', 'NAC_pre', 'minimize_contrast_volume', 'stop_nephrotoxic_24h_pre'] : ['routine'],
  };
}

module.exports = { akiStaging, causeWorkup, rrtInitiation, akiRecoveryTracking, contrastNephropathyRisk, CITATIONS, ValidationError };