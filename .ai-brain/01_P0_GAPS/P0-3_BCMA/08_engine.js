/**
 * BCMA — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

const CITATIONS = {
  NPSG_01: 'Joint Commission NPSG.01 — 5 Rights',
  ISMP: 'ISMP Medication Safety',
  ASHP: 'ASHP Best Practices',
  SFDA: 'SFDA Barcode Standards',
};

/**
 * 5 Rights Verification
 */
function verifyFiveRights(input) {
  const { scanned_patient, scanned_drug, expected_patient, expected_drug, expected_dose, expected_route, expected_time, actual_dose, actual_route } = input;
  const results = {
    right_patient: scanned_patient === expected_patient,
    right_drug: scanned_drug === expected_drug,
    right_dose: parseFloat(actual_dose) === parseFloat(expected_dose),
    right_route: (actual_route || '').toLowerCase() === (expected_route || '').toLowerCase(),
    right_time: withinTimeWindow(expected_time),
  };
  const all_passed = Object.values(results).every(Boolean);
  return {
    ...results,
    all_passed,
    violations: Object.entries(results).filter(([_, v]) => !v).map(([k]) => k),
    citation: CITATIONS.NPSG_01,
  };
}

function withinTimeWindow(scheduled) {
  const now = new Date();
  const sched = new Date(scheduled);
  const diff = Math.abs(now - sched) / 60000;
  return diff <= 60;
}

/**
 * Allergy Check
 */
function allergyCheck(input) {
  const { drug, allergies } = input;
  const allergy_list = (allergies || []).map(a => a.toLowerCase());
  const drug_lower = drug.toLowerCase();
  const cross_reactive = allergy_list.filter(a =>
    drug_lower.includes(a) ||
    ['penicillin', 'amoxicillin', 'ampicillin'].some(p => a.includes(p) && drug_lower.includes('penicillin'))
  );
  return {
    safe: cross_reactive.length === 0,
    allergies_matched: cross_reactive,
    severity: cross_reactive.length > 0 ? 'critical' : 'safe',
    citation: CITATIONS.NPSG_01,
  };
}

/**
 * Drug Interaction Check
 */
function drugInteractionCheck(input) {
  const { drug, current_medications } = input;
  const known_interactions = {
    'warfarin': ['aspirin', 'ibuprofen', 'naproxen', 'fluconazole', 'amiodarone'],
    'simvastatin': ['clarithromycin', 'erythromycin', 'itraconazole', 'ketoconazole'],
    'metformin': ['iodinated contrast'],
    'digoxin': ['amiodarone', 'verapamil', 'diltiazem'],
    'lithium': ['nsaids', 'thiazide', 'ace_inhibitors'],
    'maoi': ['ssris', 'snris', 'tramadol', 'tyramine'],
  };
  const interactions_found = [];
  for (const med of current_medications || []) {
    const med_lower = med.toLowerCase();
    for (const [target_drug, contra_list] of Object.entries(known_interactions)) {
      if (drug.toLowerCase() === target_drug && contra_list.some(c => med_lower.includes(c))) {
        interactions_found.push({ drug1: target_drug, drug2: med, severity: 'moderate' });
      }
      if (med_lower.includes(target_drug) && contra_list.some(c => drug.toLowerCase().includes(c))) {
        interactions_found.push({ drug1: med, drug2: drug, severity: 'moderate' });
      }
    }
  }
  return {
    safe: interactions_found.length === 0,
    interactions: interactions_found,
    citation: CITATIONS.ISMP,
  };
}

/**
 * High-Alert Medication Double Check
 */
function highAlertDoubleCheck(input) {
  const { drug, dose, high_alert_list } = input;
  const is_high_alert = high_alert_list.some(m => drug.toLowerCase().includes(m.toLowerCase()));
  return {
    requires_double_check: is_high_alert,
    high_alert_drugs: high_alert_list,
    requires_witness: is_high_alert,
    citation: CITATIONS.ISMP,
  };
}

/**
 * Override Workflow Validation
 */
function overrideWorkflow(input) {
  const { reason, witness_nurse_id, provider_approval } = input;
  const valid_reasons = ['emergency', 'patient_refusal', 'stock_out', 'patient_critical', 'documented_exception'];
  return {
    valid: valid_reasons.includes(reason) && witness_nurse_id && provider_approval,
    requires_provider_approval: true,
    requires_witness: true,
    citation: CITATIONS.NPSG_01,
  };
}

/**
 * PRN Tracking
 */
function prnTracking(input) {
  const { last_dose_time, last_dose_amount, min_interval_hours, max_doses_per_day, doses_today, pain_score } = input;
  const now = new Date();
  const last = new Date(last_dose_time);
  const hours_since = (now - last) / 3600000;
  const interval_ok = hours_since >= min_interval_hours;
  const max_not_exceeded = doses_today < max_doses_per_day;
  const pain_appropriate = pain_score >= 4;
  return {
    can_administer: interval_ok && max_not_exceeded && pain_appropriate,
    interval_ok,
    max_not_exceeded,
    pain_appropriate,
    hours_since_last_dose: Math.round(hours_since * 10) / 10,
    citation: CITATIONS.ASHP,
  };
}

/**
 * Insulin Double Verification
 */
function insulinDoubleCheck(input) {
  const { dose_units, patient_dose, syringe_concentration, nurse1_id, nurse2_id } = input;
  return {
    requires_double_check: true,
    calculation_correct: dose_units === patient_dose * syringe_concentration,
    nurse1_signed: !!nurse1_id,
    nurse2_signed: !!nurse2_id,
    both_signed: !!nurse1_id && !!nurse2_id,
    citation: CITATIONS.ISMP,
  };
}

/**
 * Chemotherapy Verification
 */
function chemoVerification(input) {
  const { drug, dose_mg_m2, patient_bsa, calculated_dose, regimen } = input;
  const expected_dose = patient_bsa * dose_mg_m2;
  return {
    regimen_match: regimen.standard_doses.some(s => Math.abs(s - dose_mg_m2) < 0.1),
    dose_correct: Math.abs(calculated_dose - expected_dose) < 0.5,
    expected_dose_mg: expected_dose,
    requires_two_nurses: true,
    requires_pharmacist: true,
    citation: CITATIONS.ISMP,
  };
}

/**
 * Disposal Tracking
 */
function disposalTracking(input) {
  const { drug, amount_disposed, witness_nurse_id, reason } = input;
  const valid_reasons = ['expired', 'patient_refusal', 'spillage', 'damaged', 'other'];
  return {
    documented: valid_reasons.includes(reason) && witness_nurse_id,
    witness_required: true,
    citation: CITATIONS.ASHP,
  };
}

/**
 * Late Dose Detection
 */
function lateDoseDetection(input) {
  const { scheduled_time, current_time, grace_period_minutes } = input;
  const now = new Date(current_time || new Date());
  const sched = new Date(scheduled_time);
  const minutes_late = (now - sched) / 60000;
  let status = 'on_time';
  if (minutes_late > 30) status = 'late';
  if (minutes_late > 60) status = 'very_late';
  if (minutes_late < -30) status = 'early';
  return {
    minutes_late: Math.round(minutes_late),
    status,
    requires_documentation: status === 'very_late' || status === 'late',
    citation: CITATIONS.NPSG_01,
  };
}

module.exports = {
  verifyFiveRights, allergyCheck, drugInteractionCheck, highAlertDoubleCheck,
  overrideWorkflow, prnTracking, insulinDoubleCheck, chemoVerification,
  disposalTracking, lateDoseDetection,
  CITATIONS, ValidationError,
};
