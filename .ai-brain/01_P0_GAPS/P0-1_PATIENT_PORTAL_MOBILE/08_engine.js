/**
 * Patient Portal Mobile — Engine
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
  PDPL_2024: 'PDPL 2024 Saudi Arabia',
  CBAHI_PORTAL: 'CBAHI Patient Portal 2024',
  SEHHATY_2024: 'Sehhaty 2024',
};

/**
 * Identity Verification (Nafath/Absher)
 */
function identityVerification(input) {
  const { national_id, mobile, otp_verified, biometric_verified } = input;
  return {
    verified: (otp_verified || biometric_verified) && national_id && national_id.length === 10,
    level: biometric_verified ? 'L3_biometric' : otp_verified ? 'L2_otp' : 'L1_unverified',
    citation: CITATIONS.PDPL_2024,
  };
}

/**
 * Appointment Booking
 */
function appointmentBooking(input) {
  const { patient_id, facility_id, specialty, appointment_date, appointment_time, insurance_approved } = input;
  if (!patient_id || !facility_id || !specialty || !appointment_date || !appointment_time) {
    throw new ValidationError('INVALID', 'patient_id, facility_id, specialty, date, time required');
  }
  const appointment_id = `APT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  let cost = 200;
  if (insurance_approved) cost = 0;
  return {
    appointment_id, status: 'confirmed', cost, insurance_approved: !!insurance_approved,
    citation: CITATIONS.MAWID_2024 || 'Mawid 2024',
  };
}

/**
 * Telehealth Eligibility
 */
function telehealthEligibility(input) {
  const { chief_complaint, requires_physical_exam, urgency, has_video_capability, location_within_ksa } = input;
  const eligible = has_video_capability && location_within_ksa && !requires_physical_exam && urgency !== 'emergent';
  return {
    eligible,
    modality: eligible ? 'video' : 'in_person',
    reason: !eligible ? (requires_physical_exam ? 'physical_exam_required' : !location_within_ksa ? 'outside_ksa' : 'no_video') : null,
    citation: CITATIONS.SEHHATY_2024,
  };
}

/**
 * Lab Results Disclosure (PDPL-aware)
 */
function labResultsDisclosure(input) {
  const { result, critical, verified_by, patient_consented } = input;
  if (!patient_consented) throw new ValidationError('NO_CONSENT', 'PDPL consent required');
  if (critical && !verified_by) throw new ValidationError('UNVERIFIED', 'Critical result requires clinician verification');
  return { disclosed: true, delay_minutes: critical ? 0 : 5, citation: CITATIONS.PDPL_2024 };
}

/**
 * Refill Request Validation
 */
function refillRequestValidation(input) {
  const { prescription_id, refills_remaining, last_fill_date, controlled } = input;
  if (refills_remaining <= 0) return { eligible: false, reason: 'no_refills_remaining' };
  if (controlled) return { eligible: false, reason: 'controlled_substance' };
  return { eligible: true, citation: CITATIONS.SFDA_2024 || 'SFDA 2024' };
}

/**
 * Caregiver Proxy Access
 */
function caregiverProxyAccess(input) {
  const { patient_id, caregiver_national_id, relationship, consent_doc_id, expires_at } = input;
  if (!consent_doc_id) throw new ValidationError('NO_CONSENT', 'Caregiver consent document required');
  if (expires_at && new Date(expires_at) < new Date()) {
    return { active: false, reason: 'expired' };
  }
  const valid_relationships = ['spouse','parent','child','sibling','legal_guardian'];
  if (!valid_relationships.includes(relationship)) {
    throw new ValidationError('INVALID', 'Invalid relationship');
  }
  return { active: true, citation: CITATIONS.PDPL_2024 };
}

/**
 * Self-Reported Vitals Normalization
 */
function selfReportedVitals(input) {
  const { type, value, unit, measured_at } = input;
  const ranges = {
    systolic_bp: { min: 60, max: 250, unit: 'mmHg' },
    diastolic_bp: { min: 40, max: 150, unit: 'mmHg' },
    glucose: { min: 20, max: 600, unit: 'mg/dL' },
    weight_kg: { min: 1, max: 400, unit: 'kg' },
    heart_rate: { min: 30, max: 220, unit: 'bpm' },
    spo2: { min: 50, max: 100, unit: '%' },
    temperature_c: { min: 30, max: 45, unit: '°C' },
  };
  const range = ranges[type];
  if (!range) throw new ValidationError('INVALID', 'Unknown vital type');
  const abnormal = value < range.min || value > range.max;
  return { type, value, unit: range.unit, measured_at, abnormal, citation: CITATIONS.SEHHATY_2024 };
}

/**
 * FHIR Export (CCD)
 */
function fhirExport(input) {
  const { patient_id, sections, format } = input;
  if (!patient_id) throw new ValidationError('INVALID', 'patient_id required');
  const fhir_sections = sections || ['allergies','medications','conditions','immunizations','labs','vitals','procedures'];
  return {
    format: format || 'json',
    sections: fhir_sections,
    bundle_id: `BUNDLE-${Date.now()}`,
    resource_count: fhir_sections.length * 3,
    citation: 'FHIR R4',
  };
}

/**
 * Insurance Verification
 */
function insuranceVerification(input) {
  const { member_id, payer_id, service_date, deductible_remaining, copay_pct } = input;
  if (!member_id || !payer_id) throw new ValidationError('INVALID', 'member_id and payer_id required');
  return {
    eligible: deductible_remaining > 0 || copay_pct > 0,
    payer_id, member_id, service_date,
    copay_amount: 200 * (copay_pct / 100),
    citation: CITATIONS.WATEEN_2024 || 'Wateen 2024',
  };
}

/**
 * Push Notification Priority
 */
function pushNotificationPriority(input) {
  const { type, urgency } = input;
  const priority_map = {
    'lab_critical': { priority: 'high', badge: 1, sound: 'critical' },
    'appointment_reminder': { priority: 'normal', badge: 0, sound: 'default' },
    'medication_reminder': { priority: 'normal', badge: 0, sound: 'default' },
    'telehealth_invitation': { priority: 'high', badge: 1, sound: 'ring' },
    'bill_payment': { priority: 'low', badge: 0, sound: 'silent' },
  };
  return priority_map[type] || { priority: 'low', badge: 0, sound: 'silent' };
}

/**
 * Consent Withdrawal (PDPL Right to Erasure)
 */
function consentWithdrawal(input) {
  const { patient_id, withdrawal_type } = input;
  if (!patient_id || !withdrawal_type) throw new ValidationError('INVALID', 'patient_id and withdrawal_type required');
  const valid_types = ['data_processing','research','marketing','third_party_sharing'];
  if (!valid_types.includes(withdrawal_type)) throw new ValidationError('INVALID', 'Invalid withdrawal type');
  return {
    withdrawn: true,
    effective_at: new Date().toISOString(),
    citation: CITATIONS.PDPL_2024,
  };
}

/**
 * Health Risk Score from Self-Reported Data
 */
function healthRiskScore(input) {
  const { age, bmi, systolic_bp, glucose, smoking, exercise_min_per_week } = input;
  let score = 0;
  if (age > 65) score += 2;
  if (bmi > 30) score += 1;
  if (systolic_bp > 140) score += 2;
  if (glucose > 200) score += 2;
  if (smoking) score += 2;
  if (exercise_min_per_week < 150) score += 1;
  let risk = 'low';
  if (score >= 4) risk = 'moderate';
  if (score >= 7) risk = 'high';
  return { score, risk, recommendation: risk === 'high' ? 'Schedule visit with PCP' : 'Continue healthy lifestyle', citation: CITATIONS.SEHHATY_2024 };
}

module.exports = {
  identityVerification, appointmentBooking, telehealthEligibility,
  labResultsDisclosure, refillRequestValidation, caregiverProxyAccess,
  selfReportedVitals, fhirExport, insuranceVerification,
  pushNotificationPriority, consentWithdrawal, healthRiskScore,
  CITATIONS, ValidationError,
};
