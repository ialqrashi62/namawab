/**
 * Advanced HF — Unit Tests
 * 30+ test cases covering all scoring functions.
 */

'use strict';

const engine = require('./tier3_card_302_ahf_engine');

let passed = 0, failed = 0;

function assert(cond, msg) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
}

function suite(name, fn) {
  console.log(`\n--- ${name} ---`);
  try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); }
}

suite('NYHA', () => {
  assert(engine.nyhaClass({ class: 1 }).name === 'No limitation', 'NYHA 1');
  assert(engine.nyhaClass({ class: 4 }).name === 'Severe limitation', 'NYHA 4');
  try { engine.nyhaClass({ class: 5 }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID', 'NYHA invalid throws'); }
});

suite('ACC Stage', () => {
  assert(engine.accStage({ stage: 'A' }).description.includes('At risk'), 'Stage A');
  assert(engine.accStage({ stage: 'D' }).description.includes('Refractory'), 'Stage D');
  try { engine.accStage({ stage: 'E' }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID', 'Stage invalid throws'); }
});

suite('LVEF', () => {
  assert(engine.lvefClassification({ ef_pct: 25 }).type === 'HFrEF', '25% HFrEF');
  assert(engine.lvefClassification({ ef_pct: 45 }).type === 'HFmrEF', '45% HFmrEF');
  assert(engine.lvefClassification({ ef_pct: 60 }).type === 'HFpEF', '60% HFpEF');
});

suite('NT-proBNP', () => {
  assert(engine.ntprobnpInterpret({ nt_probnp: 100, age: 50 }).severity === 'normal', 'NT-proBNP 100 normal');
  assert(engine.ntprobnpInterpret({ nt_probnp: 1500, age: 50 }).severity === 'high', 'NT-proBNP 1500 high');
  assert(engine.ntprobnpInterpret({ nt_probnp: 6000, age: 80 }).threshold_age_adjusted === 1800, 'Age 80 threshold');
});

suite('MAGGIC Score', () => {
  const low = { age: 50, ef: 50, sbp: 130, bmi: 28, creatinine: 1.0, nyha: 1, diabetes: false, copd: false, smoker: false, years_since_dx: 1 };
  assert(engine.maggicScore(low).score < 10, 'Low risk MAGGIC');
  const high = { age: 85, ef: 20, sbp: 100, bmi: 18, creatinine: 2.0, nyha: 4, diabetes: true, copd: true, smoker: true, years_since_dx: 15 };
  assert(engine.maggicScore(high).score > 30, 'High risk MAGGIC');
  assert(engine.maggicScore(high).mortality_1yr > 0.4, 'High mortality 1yr');
});

suite('INTERMACS', () => {
  assert(engine.intermacsProfile({ profile: 1 }).mcs_candidate === true, 'INTERMACS 1 urgent');
  assert(engine.intermacsProfile({ profile: 7 }).mcs_candidate === false, 'INTERMACS 7 not urgent');
});

suite('SCAI Shock', () => {
  const stable = engine.scaiShockStage({ sbp: 110, lactate: 1, ci: 2.5, inotropes: 0 });
  assert(stable.stage === 'A', 'SCAI A');
  const shock = engine.scaiShockStage({ sbp: 80, lactate: 3, ci: 1.5, inotropes: 2 });
  assert(shock.stage === 'C', 'SCAI C');
  const extremis = engine.scaiShockStage({ sbp: 60, lactate: 8, ci: 1.0, inotropes: 3, arrest: true });
  assert(extremis.stage === 'E', 'SCAI E');
});

suite('GDMT Eligibility', () => {
  const hfrEF = { ef: 30, nyha: 3, systolic_bp: 110, potassium: 4.5, gfr: 60, hr: 70 };
  assert(engine.gdmtEligibility(hfrEF).complete === true, 'HFrEF eligible for all 4');
  const lowBP = { ef: 30, nyha: 3, systolic_bp: 90, potassium: 4.5, gfr: 60, hr: 70 };
  assert(engine.gdmtEligibility(lowBP).pillars.arni.eligible === false, 'Low BP excludes ARNI');
  const hfpef = { ef: 60, nyha: 2, systolic_bp: 130, potassium: 4.5, gfr: 60, hr: 70 };
  assert(engine.gdmtEligibility(hfpef).complete === false, 'HFpEF not eligible for all 4');
});

suite('ARNI Dose', () => {
  const r = engine.arniDosing({ sbp: 110, potassium: 4.0, gfr: 60 });
  assert(r.start_dose_mg === '24/26 BID', 'ARNI start');
  assert(r.target_dose_mg === '97/103 BID', 'ARNI target');
  try { engine.arniDosing({ sbp: 90, potassium: 4.0, gfr: 60 }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'CONTRA', 'Low BP contra'); }
});

suite('SGLT2i Dose', () => {
  const r = engine.sglt2iDosing({ drug: 'dapagliflozin', gfr: 50 });
  assert(r.dose === '10 mg daily', 'Dapagliflozin dose');
  try { engine.sglt2iDosing({ drug: 'dapagliflozin', gfr: 15 }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'CONTRA', 'Low GFR contra'); }
});

suite('LVAD Checklist', () => {
  const full = { cardiac_cath: true, rhc_pvr_ok: true, cpet_vo2_low: true, renal_gfr_ok: true, liver_ok: true, pulmonary_ok: true, psychosocial_clear: true, financial_counseled: true, scot_listed_or_dt: true, age_appropriate: true };
  const r = engine.lvadPreOpChecklist(full);
  assert(r.ready === true, 'LVAD checklist complete');
  assert(r.completed === 10, 'All 10 items checked');
  const partial = { ...full, psychosocial_clear: false };
  assert(engine.lvadPreOpChecklist(partial).ready === false, 'Partial checklist not ready');
});

suite('Transplant Listing', () => {
  const status1A = engine.transplantListingStatus({ on_inotropes: true, icu: true, mcs: true });
  assert(status1A.status === '1A', 'Status 1A');
  const status1B = engine.transplantListingStatus({ on_inotropes: false, icu: false, mcs: true, lvad_complications: true });
  assert(status1B.status === '1B', 'Status 1B');
  const inactive = engine.transplantListingStatus({ on_inotropes: false, icu: false, mcs: false, lvad_complications: false });
  assert(inactive.status === 'inactive', 'Inactive');
});

suite('LVAD Pump Thrombosis', () => {
  const highRisk = engine.lvadPumpThrombosisRisk({ speed_rpm: 6000, power_w: 8, flow_lpm: 2.5, ldh: 1200, plasma_hemoglobin: 50 });
  assert(highRisk.high_risk === true, 'Pump thrombosis high risk');
  const lowRisk = engine.lvadPumpThrombosisRisk({ speed_rpm: 5400, power_w: 4.5, flow_lpm: 4.5, ldh: 200, plasma_hemoglobin: 10 });
  assert(lowRisk.high_risk === false, 'Pump thrombosis low risk');
});

suite('HeartMate 3 Risk', () => {
  const low = engine.heartMate3Risk({ age: 50, creatinine: 1.0, ldh: 300, rvad: false, cardiopulmonary_bypass: false });
  assert(low.risk_level === 'low', 'HM3 low risk');
  const high = engine.heartMate3Risk({ age: 75, creatinine: 2.0, ldh: 1200, rvad: true, cardiopulmonary_bypass: true });
  assert(high.risk_level === 'high', 'HM3 high risk');
});

suite('Diuretic Dose', () => {
  const r = engine.diureticDose({ weight_kg: 80, daily_oral_dose: 40, current_creatinine: 1.0, urine_output_ml_hr: 80 });
  assert(r.iv_dose_mg === 100, 'Standard dose 2.5x oral');
  const lowUO = engine.diureticDose({ weight_kg: 80, daily_oral_dose: 40, current_creatinine: 1.0, urine_output_ml_hr: 20 });
  assert(lowUO.iv_dose_mg === 150, 'High dose for low UO');
});

suite('Palliative Care Trigger', () => {
  const triggers = engine.palliativeCareTrigger({ acc_stage: 'D', nyha: 4, intermacs: 2, multiple_hospitalizations: 4, cardiac_cachexia: true });
  assert(triggers.eligible === true, 'Palliative eligible');
  assert(triggers.triggers.length >= 2, 'Multiple triggers');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
