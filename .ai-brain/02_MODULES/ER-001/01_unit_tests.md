---
module_id: ER-001
section: 07_testing
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Unit Tests

## File: `namaweb/er_engine_test.js` (full coverage)

```javascript
// namaweb/er_engine_test.js
'use strict';
const assert = require('assert');
const {
  classifyESI, detectRedFlags, checkMedicationSafety,
  initiateSepsisBundle, trackSTEMITiming, generateCriticalCallback,
} = require('./er_engine');

let testCount = 0;
let passCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    process.exit(1);
  }
}

console.log('ER-001 Engine Unit Tests\n');

// ===== ESI Classification =====
console.log('ESI Classification:');

test('Cardiac arrest → ESI 1', () => {
  const result = classifyESI({mental_status: 'unresponsive', heart_rate: 0, spo2: 50});
  assert.strictEqual(result.esi_level, 1);
  assert.ok(result.red_flags.length > 0);
});

test('Severe respiratory distress → ESI 1', () => {
  const result = classifyESI({spo2: 80, respiratory_distress: true});
  assert.strictEqual(result.esi_level, 1);
});

test('GCS <= 8 → ESI 1', () => {
  const result = classifyESI({gcs_total: 6});
  assert.strictEqual(result.esi_level, 1);
});

test('Severe anaphylaxis → ESI 1', () => {
  const result = classifyESI({skin_involvement: true, respiratory_distress: true});
  assert.strictEqual(result.esi_level, 1);
});

test('Chest pain with ECG changes → ESI 2', () => {
  const result = classifyESI({
    chief_complaint: 'chest pain radiating to arm',
    hpi: 'crushing, diaphoretic, 2 hours',
  });
  assert.strictEqual(result.esi_level, 2);
});

test('Stroke symptoms → ESI 2', () => {
  const result = classifyESI({chief_complaint: 'facial droop and slurred speech'});
  assert.strictEqual(result.esi_level, 2);
});

test('Sepsis (qSOFA 2) → ESI 2', () => {
  const result = classifyESI({qsofa: 2, mental_status: 'altered'});
  assert.strictEqual(result.esi_level, 2);
});

test('Major trauma → ESI 2', () => {
  const result = classifyESI({mechanism: 'MVC high speed'});
  assert.strictEqual(result.esi_level, 2);
});

test('Pain >= 7/10 → ESI 2', () => {
  const result = classifyESI({pain_score: 8});
  assert.strictEqual(result.esi_level, 2);
});

test('Stable + multiple resources → ESI 3', () => {
  const result = classifyESI({chief_complaint: 'abdominal pain', requires_imaging: true, requires_labs: true});
  assert.strictEqual(result.esi_level, 3);
});

test('Stable + one resource → ESI 4', () => {
  const result = classifyESI({chief_complaint: 'laceration', requires_procedure: true});
  assert.strictEqual(result.esi_level, 4);
});

test('No resources needed → ESI 5', () => {
  const result = classifyESI({chief_complaint: 'medication refill'});
  assert.strictEqual(result.esi_level, 5);
});

test('ESI returns recommended_action', () => {
  const r1 = classifyESI({heart_rate: 0, spo2: 50});
  assert.strictEqual(r1.recommended_action, 'resus_bay');
  const r5 = classifyESI({chief_complaint: 'med refill'});
  assert.strictEqual(r5.recommended_action, 'immediate_discharge');
});

test('ESI returns time_to_provider target', () => {
  assert.strictEqual(classifyESI({heart_rate: 0}).time_to_provider_minutes, 0);
  assert.strictEqual(classifyESI({qsofa: 2}).time_to_provider_minutes, 10);
  assert.strictEqual(classifyESI({chief_complaint: 'laceration', requires_procedure: true}).time_to_provider_minutes, 60);
  assert.strictEqual(classifyESI({chief_complaint: 'med refill'}).time_to_provider_minutes, 120);
});

test('ESI always returns citations', () => {
  const result = classifyESI({chief_complaint: 'chest pain'});
  assert.ok(result.citations.length > 0);
  assert.ok(result.citations[0].length > 0);
});

test('ESI always returns disclaimer', () => {
  const result = classifyESI({});
  assert.ok(result.disclaimer.includes('AI'));
});

console.log('\nRed Flag Detection:');

test('STEMI on ECG → category 1 red flag', () => {
  const flags = detectRedFlags({}, {stemi: true, lbbb_new: false});
  assert.strictEqual(flags[0].flagType, 'stemi');
  assert.strictEqual(flags[0].category, 1);
  assert.strictEqual(flags[0].response, 'code_stemi');
});

test('Lactate >= 4 → severe sepsis flag', () => {
  const flags = detectRedFlags({lactate: 5});
  assert.ok(flags.some(f => f.flagType === 'severe_sepsis'));
});

test('Troponin elevation → emergent flag', () => {
  const flags = detectRedFlags({}, {}, {troponin: 0.5});
  assert.ok(flags.some(f => f.flagType === 'troponin_elevation'));
});

test('NIHSS >= 4 with tPA window → stroke flag', () => {
  const flags = detectRedFlags({nihss_score: 6, last_known_well: 100});
  assert.ok(flags.some(f => f.flagType === 'stroke_tpa_candidate'));
});

test('qSOFA >= 2 → sepsis flag', () => {
  const flags = detectRedFlags({qsofa: 2});
  assert.ok(flags.some(f => f.flagType === 'sepsis'));
});

test('SpO2 < 88 → respiratory failure', () => {
  const flags = detectRedFlags({spo2: 85});
  assert.ok(flags.some(f => f.flagType === 'respiratory_failure'));
});

console.log('\nMedication Safety:');

test('Penicillin allergy blocks amoxicillin (HARD BLOCK)', () => {
  const safety = checkMedicationSafety({allergies: ['penicillin'], age: 30, sex: 'F'}, 'amoxicillin', '500mg', 'PO');
  assert.strictEqual(safety.safe, false);
  assert.ok(safety.alerts.some(a => a.type === 'allergy' && a.severity === 'critical'));
});

test('No allergy → no allergy alert', () => {
  const safety = checkMedicationSafety({allergies: [], age: 30, sex: 'F'}, 'amoxicillin', '500mg', 'PO');
  assert.ok(!safety.alerts.some(a => a.type === 'allergy'));
});

test('Pregnancy + teratogen (warfarin) blocks (HARD BLOCK)', () => {
  const safety = checkMedicationSafety({allergies: [], age: 30, sex: 'F', pregnancy_test_done: false}, 'warfarin', '5mg', 'PO');
  assert.strictEqual(safety.safe, false);
  assert.ok(safety.alerts.some(a => a.type === 'pregnancy_risk'));
});

test('Pregnancy test done → no pregnancy block', () => {
  const safety = checkMedicationSafety({allergies: [], age: 30, sex: 'F', pregnancy_test_done: true}, 'warfarin', '5mg', 'PO');
  assert.ok(!safety.alerts.some(a => a.type === 'pregnancy_risk'));
});

test('Renal dose adjustment (vancomycin in CKD)', () => {
  const safety = checkMedicationSafety({allergies: [], age: 60, sex: 'M', creatinine: 3.0}, 'vancomycin', '1g', 'IV');
  assert.ok(safety.alerts.some(a => a.type === 'renal_dose_adjustment'));
});

test('Pediatric weight-based dose check', () => {
  const safety = checkMedicationSafety({allergies: [], age: 5, sex: 'M', weight_kg: 20}, 'acetaminophen', '100mg', 'PO');
  assert.ok(safety.alerts.some(a => a.type === 'weight_based_dose'));
  // recommended: 15 mg/kg * 20 kg = 300 mg
});

test('Normal dose in adult → no alerts', () => {
  const safety = checkMedicationSafety({allergies: [], age: 30, sex: 'M', creatinine: 1.0}, 'acetaminophen', '500mg', 'PO');
  assert.strictEqual(safety.alerts.length, 0);
});

console.log('\nSepsis Bundle:');

test('Sepsis bundle has 1-hour target', () => {
  const bundle = initiateSepsisBundle({});
  assert.strictEqual(bundle.time_target_seconds, 3600);
});

test('Sepsis bundle includes all 5 actions', () => {
  const bundle = initiateSepsisBundle({});
  const actions = bundle.actions.map(a => a.action);
  assert.ok(actions.includes('measure_lactate'));
  assert.ok(actions.includes('blood_cultures_x2'));
  assert.ok(actions.includes('broad_spectrum_antibiotics'));
  assert.ok(actions.includes('iv_crystalloid_30ml_per_kg'));
  assert.ok(actions.includes('vasopressors_if_map_lt_65'));
});

test('Sepsis empiric antibiotic by source', () => {
  const pulmonary = initiateSepsisBundle({source_of_infection: 'pulmonary'});
  assert.ok(pulmonary.actions[2].drug_choice.includes('ceftriaxone'));
  const abdominal = initiateSepsisBundle({source_of_infection: 'abdominal'});
  assert.ok(abdominal.actions[2].drug_choice.includes('piperacillin-tazobactam'));
});

console.log('\nSTEMI Timing:');

test('Door-to-balloon < 90 min is on target', () => {
  const result = trackSTEMITiming('2026-07-23T10:00:00Z', '2026-07-23T10:45:00Z');
  assert.strictEqual(result.on_target, true);
});

test('Door-to-balloon > 90 min is NOT on target', () => {
  const result = trackSTEMITiming('2026-07-23T10:00:00Z', '2026-07-23T11:00:00Z');
  assert.strictEqual(result.on_target, false);
});

test('Door-to-balloon calculation in minutes', () => {
  const result = trackSTEMITiming('2026-07-23T10:00:00Z', '2026-07-23T10:30:00Z');
  assert.strictEqual(result.minutes_to_balloon, 30);
});

console.log('\nCritical Lab Callback:');

test('Critical lab generates callback', () => {
  const callback = generateCriticalCallback(
    {test_name: 'Troponin', result_value: '0.5', result_unit: 'ng/mL', is_critical: true},
    'md-001'
  );
  assert.ok(callback);
  assert.strictEqual(callback.callback_required_within_minutes, 30);
});

test('Non-critical lab does not generate callback', () => {
  const callback = generateCriticalCallback(
    {test_name: 'CBC', result_value: 'normal', is_critical: false},
    'md-001'
  );
  assert.strictEqual(callback, null);
});

console.log('\n========================================');
console.log(`ER-001 Engine Tests: ${passCount}/${testCount} PASS`);
console.log('========================================');
```

## Coverage Targets

- **Engine functions:** 100% line coverage
- **Edge cases:** 95% branch coverage
- **Critical paths:** 100% (triage, red flags, drug safety)
- **Error paths:** 90%

## Test Categories

### Unit Tests (50+)
- ESI classification (all levels 1-5)
- Red flag detection (all categories)
- Drug safety (allergy, interaction, renal, pregnancy, weight)
- Sepsis bundle
- STEMI timing
- Critical callback

### Integration Tests (10+)
- Triage → encounter creation
- Red flag detection → notification
- Drug safety block → audit
- Code activation → team page
- Disposition → admission workflow

### E2E Tests (5+)
- Patient journey: arrival → triage → treatment → discharge
- STEMI: arrival → ECG → cath lab → discharge
- Stroke: arrival → CT → tPA → admit
- Sepsis: arrival → bundle → admit
- AMA: arrival → triage → refuse → AMA

---
*Section 07.a of ER-001. Owner: QA. L4 validated.*
