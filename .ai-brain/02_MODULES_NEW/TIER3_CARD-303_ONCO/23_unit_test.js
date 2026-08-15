/**
 * Cardio-Onc — Unit Tests
 */

'use strict';

const engine = require('./tier3_card_303_onco_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  ✗ FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('HFA-ICOS Risk', () => {
  const low = { age: 50, baseline_ef: 60, anthracycline_dose: 100, hypertension: false, diabetes: false, smoking: false };
  assert(['low','moderate'].includes(engine.hfaIcosRiskScore(low).risk), 'Low risk');
  const veryHigh = { age: 70, baseline_ef: 45, anthracycline_dose: 450, prior_cardiotoxicity: true, al_amyloidosis: true };
  assert(engine.hfaIcosRiskScore(veryHigh).risk === 'very_high', 'Very high risk');
});

suite('CTCAE Grade', () => {
  assert(engine.ctcaeCardiotoxicityGrade({ ef_drop_pct: 5, symptoms: 'mild' }).grade === 'I', 'CTCAE I');
  assert(engine.ctcaeCardiotoxicityGrade({ ef_drop_pct: 12, lvef: 45 }).grade === 'III', 'CTCAE III');
  assert(engine.ctcaeCardiotoxicityGrade({ ef_drop_pct: 25, life_threatening: true }).grade === 'IV', 'CTCAE IV life-threatening');
  assert(engine.ctcaeCardiotoxicityGrade({ fatal: true }).grade === 'V', 'CTCAE V fatal');
});

suite('GLS Change', () => {
  const normal = engine.glsChangeDetection({ baseline_gls: -20, current_gls: -19 });
  assert(normal.action === 'continue', 'GLS normal change');
  const high = engine.glsChangeDetection({ baseline_gls: -20, current_gls: -16 });
  assert(high.action === 'hold_chemo', 'GLS >15% drop holds chemo');
});

suite('ICI Myocarditis', () => {
  const mild = engine.iciMyocarditis({ troponin: 0.05, uln: 0.1, ef_pct: 55, hemodynamics: 'stable' });
  assert(mild.severity === 'mild', 'ICI mild');
  const severe = engine.iciMyocarditis({ troponin: 0.5, uln: 0.1, ef_pct: 40, hemodynamics: 'stable' });
  assert(severe.severity === 'severe', 'ICI severe');
  const fulminant = engine.iciMyocarditis({ troponin: 0.5, uln: 0.1, ef_pct: 25, hemodynamics: 'unstable' });
  assert(fulminant.severity === 'fulminant', 'ICI fulminant');
});

suite('Anthracycline Dose', () => {
  const low = engine.anthracyclineDose({ drug: 'doxorubicin', total_dose_mg_m2: 200 });
  assert(low.doxorubicin_equivalent_mg_m2 === 200, 'Dox 200 low');
  assert(low.risk === 'low', 'Dox 200 low risk');
  const high = engine.anthracyclineDose({ drug: 'doxorubicin', total_dose_mg_m2: 450 });
  assert(high.risk === 'high', 'Dox 450 high risk');
  const epi = engine.anthracyclineDose({ drug: 'epirubicin', total_dose_mg_m2: 600 });
  assert(epi.doxorubicin_equivalent_mg_m2 === 402, 'Epi 600 = Dox 402');
});

suite('Trastuzumab Risk', () => {
  const mild = engine.trastuzumabCardiotoxicityRisk({ baseline_ef: 60, current_ef: 55, time_on_trastuzumab_months: 6, anthracycline_dose: 100 });
  assert(mild.severity === 'mild', 'Trastuzumab mild');
  const severe = engine.trastuzumabCardiotoxicityRisk({ baseline_ef: 60, current_ef: 45, time_on_trastuzumab_months: 6, anthracycline_dose: 300 });
  assert(severe.severity === 'severe', 'Trastuzumab severe');
});

suite('QTc Monitoring', () => {
  const normal = engine.qtcMonitoring({ baseline_qtc: 420, current_qtc: 440 });
  assert(normal.action === 'continue', 'QTc normal');
  const high = engine.qtcMonitoring({ baseline_qtc: 420, current_qtc: 510 });
  assert(high.action === 'hold_agent', 'QTc >500ms hold');
});

suite('VTE Treatment', () => {
  const breast = engine.vteTreatment({ cancer_type: 'breast', gi_lesions: false, platelet: 200000, creatinine: 1.0 });
  assert(breast.first_line === 'doac', 'Breast cancer VTE → DOAC');
  const gastric = engine.vteTreatment({ cancer_type: 'gastric', gi_lesions: true, platelet: 200000, creatinine: 1.0 });
  assert(gastric.first_line === 'lmwh', 'Gastric cancer VTE → LMWH');
});

suite('Cardiac Amyloid', () => {
  const positive = engine.cardiacAmyloidWorkup({ pyrophosphate_grade: 3 });
  assert(positive.suspicion === 'high', 'Pyrophosphate Grade 3 high suspicion');
  const lge = engine.cardiacAmyloidWorkup({ lge_present: true, septal_thickness: 18 });
  assert(lge.suspicion === 'high', 'LGE + thick septum = high');
});

suite('Cardioprotection', () => {
  const high = engine.cardioprotectionDecision({ risk_category: 'very_high', ef_pct: 30, anthracycline_dose: 450 });
  assert(high.recommended.length >= 3, 'Very high risk: 3+ recommendations');
  const low = engine.cardioprotectionDecision({ risk_category: 'low', ef_pct: 60, anthracycline_dose: 100 });
  assert(low.recommended.length === 0, 'Low risk: no recommendations');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
