/**
 * e-Prescription — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SFDA_2024: 'SFDA Drug Registry 2024', CBAHI: 'CBAHI E-Prescription' };

function controlledSubstanceCheck(input) {
  const { drug_name, schedule } = input;
  const sfda_schedules = { 'I': 'controlled_high', 'II': 'controlled_moderate', 'III': 'prescription_only', 'IV': 'prescription' };
  return {
    drug_name,
    schedule,
    category: sfda_schedules[schedule] || 'otc',
    requires_special_prescription: schedule === 'I' || schedule === 'II',
    max_refills: schedule === 'I' ? 0 : schedule === 'II' ? 0 : 5,
    citation: CITATIONS.SFDA_2024,
  };
}

function eRxGeneration(input) {
  const { patient_id, drug_name, dose, frequency, route, duration_days, refills, prescriber_id, controlled } = input;
  if (!patient_id || !drug_name) throw new ValidationError('INVALID', 'patient_id and drug_name required');
  const rx_id = `RX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    rx_id,
    status: 'active',
    patient_id,
    drug_name,
    dose, frequency, route, duration_days, refills,
    prescriber_id,
    controlled,
    electronic_signature_required: true,
    nphies_submitted: true,
    issued_at: new Date().toISOString(),
    citation: CITATIONS.CBAHI,
  };
}

function refillValidation(input) {
  const { prescription_id, refills_remaining, last_fill_date, controlled } = input;
  if (refills_remaining <= 0) return { eligible: false, reason: 'no_refills_remaining' };
  if (controlled) return { eligible: false, reason: 'controlled_substance_requires_visit' };
  return { eligible: true, refills_remaining };
}

function dosageValidation(input) {
  const { drug, dose_mg, weight_kg, age, max_dose_mg_kg, max_dose_mg, max_dose_age } = input;
  let valid = true;
  let reason = '';
  if (max_dose_mg_kg && weight_kg) {
    if (dose_mg > max_dose_mg_kg * weight_kg) { valid = false; reason = 'exceeds_per_kg_max'; }
  }
  if (max_dose_mg && dose_mg > max_dose_mg) { valid = false; reason = 'exceeds_max_dose'; }
  if (max_dose_age && age > max_dose_age) { valid = false; reason = 'age_exceeds_max'; }
  return { valid, dose_mg, reason, citation: CITATIONS.SFDA_2024 };
}

function prescriptionCancellation(input) {
  const { prescription_id, reason, prescriber_id } = input;
  return { prescription_id, status: 'cancelled', reason, cancelled_at: new Date().toISOString(), prescriber_id };
}

function priorAuthorization(input) {
  const { insurance_id, drug_name, estimated_cost, urgency } = input;
  const auto_approved = estimated_cost < 500 && urgency !== 'emergency';
  return {
    auth_id: `AUTH-${Date.now()}`,
    status: auto_approved ? 'auto_approved' : 'pending',
    insurance_id, drug_name, estimated_cost,
    decision_time_hours: auto_approved ? 0 : urgency === 'emergency' ? 1 : 24,
  };
}

function electronicSignature(input) {
  const { prescriber_id, prescription_id, signature_method } = input;
  const signature_hash = `SIG-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
  return {
    signature_id: signature_hash,
    prescriber_id,
    prescription_id,
    signature_method: signature_method || 'digital_certificate',
    signed_at: new Date().toISOString(),
    citation: CITATIONS.CBAHI,
  };
}

module.exports = {
  controlledSubstanceCheck, eRxGeneration, refillValidation,
  dosageValidation, prescriptionCancellation, priorAuthorization, electronicSignature,
  CITATIONS, ValidationError,
};
