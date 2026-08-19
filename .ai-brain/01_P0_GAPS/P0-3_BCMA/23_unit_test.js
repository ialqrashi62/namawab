/**
 * BCMA — Unit Tests
 */

'use strict';

const engine = require('./p0_3_bcma_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  ✗ FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('5 Rights Verification', () => {
  const scheduled = new Date(Date.now() - 30000).toISOString();
  const ok = engine.verifyFiveRights({ scanned_patient: 'P1', scanned_drug: 'D1', expected_patient: 'P1', expected_drug: 'D1', expected_dose: '500mg', expected_route: 'PO', expected_time: scheduled, actual_dose: '500mg', actual_route: 'PO' });
  assert(ok.all_passed === true, '5 Rights pass');
  const wrong = engine.verifyFiveRights({ scanned_patient: 'P1', scanned_drug: 'D1', expected_patient: 'P2', expected_drug: 'D1', expected_dose: '500mg', expected_route: 'PO', expected_time: scheduled, actual_dose: '500mg', actual_route: 'PO' });
  assert(wrong.all_passed === false, 'Wrong patient detected');
});

suite('Allergy Check', () => {
  const safe = engine.allergyCheck({ drug: 'Amoxicillin', allergies: ['Sulfa'] });
  assert(safe.safe === true, 'No cross-reactivity');
  const unsafe = engine.allergyCheck({ drug: 'Penicillin', allergies: ['Penicillin'] });
  assert(unsafe.safe === false, 'Direct allergy detected');
  const cross = engine.allergyCheck({ drug: 'Amoxicillin', allergies: ['Penicillin'] });
  assert(cross.safe === false, 'Cross-reactivity detected');
});

suite('Drug Interaction', () => {
  const interaction = engine.drugInteractionCheck({ drug: 'Warfarin', current_medications: ['Aspirin'] });
  assert(interaction.safe === false, 'Warfarin + Aspirin interaction');
  const safe = engine.drugInteractionCheck({ drug: 'Metformin', current_medications: ['Atorvastatin'] });
  assert(safe.safe === true, 'No interaction');
});

suite('High-Alert Double Check', () => {
  const insulin = engine.highAlertDoubleCheck({ drug: 'Insulin Lispro', dose: '10', high_alert_list: ['insulin', 'heparin', 'warfarin'] });
  assert(insulin.requires_double_check === true, 'Insulin requires double check');
  const normal = engine.highAlertDoubleCheck({ drug: 'Tylenol', dose: '500mg', high_alert_list: ['insulin', 'heparin'] });
  assert(normal.requires_double_check === false, 'Tylenol does not require double check');
});

suite('Override Workflow', () => {
  const ok = engine.overrideWorkflow({ reason: 'emergency', witness_nurse_id: 2, provider_approval: true });
  assert(ok.valid === true, 'Valid override');
  const no_witness = engine.overrideWorkflow({ reason: 'emergency', witness_nurse_id: null, provider_approval: true });
  assert(no_witness.valid === false, 'No witness invalid');
});

suite('PRN Tracking', () => {
  const ok = engine.prnTracking({ last_dose_time: new Date(Date.now() - 5*3600000).toISOString(), min_interval_hours: 4, max_doses_per_day: 6, doses_today: 1, pain_score: 6 });
  assert(ok.can_administer === true, 'Can administer PRN');
  const too_soon = engine.prnTracking({ last_dose_time: new Date(Date.now() - 1*3600000).toISOString(), min_interval_hours: 4, max_doses_per_day: 6, doses_today: 1, pain_score: 6 });
  assert(too_soon.can_administer === false, 'Too soon');
});

suite('Insulin Double Check', () => {
  const ok = engine.insulinDoubleCheck({ dose_units: 10, patient_dose: 10, syringe_concentration: 1, nurse1_id: 1, nurse2_id: 2 });
  assert(ok.both_signed === true, 'Both nurses signed');
  const one = engine.insulinDoubleCheck({ dose_units: 10, patient_dose: 10, syringe_concentration: 1, nurse1_id: 1, nurse2_id: null });
  assert(one.both_signed === false, 'Only one nurse signed');
});

suite('Chemo Verification', () => {
  const ok = engine.chemoVerification({ drug: 'Doxorubicin', dose_mg_m2: 50, patient_bsa: 1.8, calculated_dose: 90, regimen: { standard_doses: [40, 50, 60] } });
  assert(ok.dose_correct === true, 'Chemo dose correct');
});

suite('Disposal Tracking', () => {
  const ok = engine.disposalTracking({ drug: 'Morphine', amount_disposed: '5mg', witness_nurse_id: 2, reason: 'expired' });
  assert(ok.documented === true, 'Disposal documented');
});

suite('Late Dose Detection', () => {
  const late = engine.lateDoseDetection({ scheduled_time: new Date(Date.now() - 90*60000).toISOString() });
  assert(late.status === 'very_late', 'Very late detected');
  const on_time = engine.lateDoseDetection({ scheduled_time: new Date().toISOString() });
  assert(['on_time', 'early'].includes(on_time.status), 'On time or early');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
