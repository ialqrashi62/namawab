/**
 * Patient Portal — Unit Tests
 */

'use strict';

const engine = require('./p0_1_patient_portal_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  � FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('Identity Verification', () => {
  const verified = engine.identityVerification({ national_id: '1234567890', mobile: '0501234567', otp_verified: true });
  assert(verified.verified === true, 'Identity verified');
  assert(verified.level === 'L2_otp', 'OTP level');
});

suite('Appointment Booking', () => {
  const apt = engine.appointmentBooking({ patient_id: 1, facility_id: 1, specialty: 'cardiology', appointment_date: '2026-08-20', appointment_time: '10:00', insurance_approved: true });
  assert(apt.cost === 0, 'Insurance approved = free');
  const paid = engine.appointmentBooking({ patient_id: 1, facility_id: 1, specialty: 'cardiology', appointment_date: '2026-08-20', appointment_time: '10:00' });
  assert(paid.cost === 200, 'No insurance = 200 SAR');
});

suite('Telehealth Eligibility', () => {
  const eligible = engine.telehealthEligibility({ chief_complaint: 'follow-up', requires_physical_exam: false, has_video_capability: true, location_within_ksa: true, urgency: 'routine' });
  assert(eligible.eligible === true, 'Telehealth eligible');
  const inperson = engine.telehealthEligibility({ chief_complaint: 'pain', requires_physical_exam: true, has_video_capability: true, location_within_ksa: true, urgency: 'routine' });
  assert(inperson.eligible === false, 'Physical exam requires in-person');
});

suite('Lab Results Disclosure', () => {
  const normal = engine.labResultsDisclosure({ result: 'WBC 7000', critical: false, patient_consented: true });
  assert(normal.disclosed === true, 'Normal lab disclosed');
  try { engine.labResultsDisclosure({ result: 'K 6.8', critical: true, patient_consented: true }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'UNVERIFIED', 'Critical needs verification'); }
});

suite('Refill Request', () => {
  const eligible = engine.refillRequestValidation({ prescription_id: 1, refills_remaining: 2, last_fill_date: '2026-07-01', controlled: false });
  assert(eligible.eligible === true, 'Refill eligible');
  const nor = engine.refillRequestValidation({ prescription_id: 1, refills_remaining: 0, last_fill_date: '2026-07-01', controlled: false });
  assert(nor.eligible === false, 'No refills');
  const ctrl = engine.refillRequestValidation({ prescription_id: 1, refills_remaining: 2, last_fill_date: '2026-07-01', controlled: true });
  assert(ctrl.eligible === false, 'Controlled substance');
});

suite('Caregiver Proxy', () => {
  const r = engine.caregiverProxyAccess({ patient_id: 1, caregiver_national_id: '1234567890', relationship: 'spouse', consent_doc_id: 'CONSENT-001' });
  assert(r.active === true, 'Proxy active');
  try { engine.caregiverProxyAccess({ patient_id: 1, caregiver_national_id: '1234567890', relationship: 'friend', consent_doc_id: 'CONSENT-001' }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID', 'Invalid relationship'); }
});

suite('Self-Reported Vitals', () => {
  const normal = engine.selfReportedVitals({ type: 'systolic_bp', value: 120, unit: 'mmHg', measured_at: '2026-08-15' });
  assert(normal.abnormal === false, 'Normal BP');
  const abnormal = engine.selfReportedVitals({ type: 'systolic_bp', value: 180, unit: 'mmHg', measured_at: '2026-08-15' });
  assert(abnormal.abnormal === true, 'High BP abnormal');
});

suite('FHIR Export', () => {
  const r = engine.fhirExport({ patient_id: 67890 });
  assert(r.format === 'json', 'Default JSON format');
  assert(r.sections.includes('medications'), 'Medications included');
});

suite('Insurance Verification', () => {
  const r = engine.insuranceVerification({ member_id: 'MEM001', payer_id: 'PAYER001', service_date: '2026-08-15', deductible_remaining: 1000, copay_pct: 20 });
  assert(r.eligible === true, 'Insurance eligible');
  assert(r.copay_amount === 40, '20% copay of 200');
});

suite('Health Risk Score', () => {
  const low = engine.healthRiskScore({ age: 30, bmi: 22, systolic_bp: 110, glucose: 90, smoking: false, exercise_min_per_week: 200 });
  assert(low.risk === 'low', 'Low risk young healthy');
  const high = engine.healthRiskScore({ age: 70, bmi: 35, systolic_bp: 180, glucose: 250, smoking: true, exercise_min_per_week: 0 });
  assert(high.risk === 'high', 'High risk elderly smoker');
});

suite('Consent Withdrawal', () => {
  const r = engine.consentWithdrawal({ patient_id: 1, withdrawal_type: 'marketing' });
  assert(r.withdrawn === true, 'Consent withdrawn');
  try { engine.consentWithdrawal({ patient_id: 1, withdrawal_type: 'invalid_type' }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID', 'Invalid withdrawal'); }
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
