/**
 * TIER3_RENAL-303 Dialysis Engine
 * Hemodialysis adequacy (Kt/V, URR) + PD adequacy + dry weight + vascular access + CRRT
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDOQI_HD: 'KDOQI HD Adequacy 2020', ISPD: 'ISPD PD Guidelines 2022', KDIGO_CKD: 'KDIGO CKD 2024' };

function hdAdequacy(input) {
  const { pre_bun, post_bun, session_hours, weight_kg, residual_urine_ml_per_day } = input;
  const urr = ((pre_bun - post_bun) / pre_bun) * 100;
  const kt_v = -Math.log(post_bun / pre_bun - 0.008 * session_hours) + (4 - 3.5 * (post_bun / pre_bun)) * (weight_kg * 0.55 - residual_urine_ml_per_day / 35 / 1000);
  return {
    urr: Math.round(urr * 100) / 100,
    spkt_v: Math.round(kt_v * 100) / 100,
    target_met: urr >= 65 || kt_v >= 1.2,
    weekly_ekt_v: kt_v * 3,
    target_weekly: kt_v * 3 >= 2.0,
    citation: CITATIONS.KDOQI_HD,
  };
}

function pdPrescription(input) {
  const { weight_kg, pet_creatinine, residual_kru, dwell_hours, exchanges_per_day } = input;
  const weekly_krt = (pet_creatinite || 0.65) * 7 * 2; // simplified
  return {
    prescription: {
      fill_volume_ml: weight_kg * 40,
      exchanges_per_day: exchanges_per_day || 4,
      dwell_hours: dwell_hours || 6,
    },
    adequacy: weekly_krt >= 1.7 ? 'adequate' : 'inadequate',
    apd_option: exchanges_per_day >= 5 ? 'consider_APD' : 'continue_CAPD',
    citation: CITATIONS.ISPD,
  };
}

function dryWeightAssessment(input) {
  const { pre_hd_weight, edematous, lung_congestion, bp, weight_change_kg } = input;
  return {
    overhydrated: edematous && lung_congestion && bp > 160,
    fluid_removal_target_kg: edematous ? weight_change_kg || 2 : 0,
    crrt_recommendation: edematous ? 'dry_weight_reduce_0.5_kg_per_session' : 'maintain_current',
    reference_method: 'bioimpedance OR lung_ultrasound',
  };
}

function vascularAccessAssessment(input) {
  const { access_type, blood_flow_ml_min, venous_pressure, recirculation_pct, thrill, bruit } = input;
  const malfunctions = {
    avf_maturation: access_type === 'AVF' && blood_flow_ml_min < 600,
    avg_stenosis: access_type === 'AVG' && venous_pressure > 200,
    high_recirculation: recirculation_pct > 15,
    thrill_loss: !thrill,
    bruit_loss: !bruit,
  };
  return {
    access_type,
    flow_status: blood_flow_ml_min >= 600 ? 'adequate' : blood_flow_ml_min >= 400 ? 'low' : 'inadequate',
    malfunctions,
    intervention_needed: Object.values(malfunctions).some(Boolean),
  };
}

function crrtPrescription(input) {
  const { weight_kg, modality, indication, fluid_overload_l, acidosis, hyperkalemia } = input;
  return {
    modality: modality || 'CVVH',
    blood_flow_ml_min: Math.min(200, weight_kg * 4),
    replacement_dose_ml_per_kg_per_h: 25,
    fluid_removal_target_l_per_day: fluid_overload_l && fluid_overload_l > 3 ? 1 : 0.5,
    anticoagulation: hyperkalemia ? 'heparin' : 'regional_citrate',
    duration: indication === 'urgent' ? '24-72h_continuous' : 'as_needed',
  };
}

module.exports = { hdAdequacy, pdPrescription, dryWeightAssessment, vascularAccessAssessment, crrtPrescription, CITATIONS, ValidationError };