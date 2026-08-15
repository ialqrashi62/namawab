/**
 * PE/DVT — Unit Tests
 */

'use strict';

const engine = require('./tier3_card_305_pe_dvt_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  ✗ FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('sPESI', () => {
  const low = { age: 60, cancer: false, chronic_cardiopulmonary: false, sbp: 120, hr: 90, spo2: 95 };
  assert(engine.sPesi(low).risk === 'low', 'Low risk sPESI=0');
  const high = { age: 85, cancer: true, chronic_cardiopulmonary: true, sbp: 95, hr: 130, spo2: 85 };
  assert(engine.sPesi(high).risk === 'high', 'High risk sPESI');
});

suite('Wells DVT', () => {
  const high = { active_cancer: true, recently_bedridden: true, entire_leg_swollen: true, calf_swelling_3cm: true };
  assert(engine.wellsDvt(high).probability === 'high', 'Wells DVT high');
  const low = { active_cancer: false, alternative_diagnosis_likely: true };
  assert(engine.wellsDvt(low).probability === 'low', 'Wells DVT low');
});

suite('Wells PE', () => {
  const high = { clinical_signs_dvt: true, pe_most_likely: true, hr_gt_100: true };
  assert(engine.wellsPe(high).probability === 'high', 'Wells PE high');
});

suite('PE Severity', () => {
  const massive = engine.peSeverity({ hemodynamically_unstable: true });
  assert(massive.severity === 'massive', 'Massive PE');
  const sub = engine.peSeverity({ rv_dysfunction: true, biomarker_positive: true });
  assert(sub.severity === 'intermediate_high', 'Intermediate High');
  const lo = engine.peSeverity({ rv_dysfunction: false, biomarker_positive: false });
  assert(lo.severity === 'low', 'Low Risk');
});

suite('Thrombolysis Eligibility', () => {
  const eligible = engine.thrombolysisEligibility({ massive_pe: true, sbp: 85 });
  assert(eligible.eligible === true, 'Thrombolysis eligible');
  assert(eligible.drug === 'Alteplase' || eligible.drug === 'Tenecteplase', 'Drug selected');
  const contra = engine.thrombolysisEligibility({ massive_pe: true, sbp: 85, recent_surgery: true });
  assert(contra.eligible === false, 'Contraindicated');
});

suite('CDT', () => {
  const eligible = engine.catheterDirectedTherapy({ intermediate_high_pe: true, contraindications_systemic: true, ekos_available: true });
  assert(eligible.eligible === true, 'CDT eligible');
});

suite('Mechanical Thrombectomy', () => {
  const eligible = engine.mechanicalThrombectomy({ massive_pe: true, contraindications: true, flowtriever_available: true });
  assert(eligible.eligible === true, 'Thrombectomy eligible');
});

suite('IVC Filter', () => {
  const eligible = engine.ivcFilterDecision({ acute_anticoagulation_contraindicated: true });
  assert(eligible.eligible === true, 'IVC filter eligible');
});

suite('Anticoagulation Choice', () => {
  const basic = engine.anticoagulationChoice({});
  assert(basic.first_line === 'apixaban', 'Default Apixaban');
  const cancer = engine.anticoagulationChoice({ cancer: true, gastric_cancer: true });
  assert(cancer.first_line === 'lmwh', 'Cancer gastric → LMWH');
});

suite('CTEPH Workup', () => {
  const sus = engine.ctephWorkup({ persistent_dyspnea_after_pe: true, vq_scan_mismatch: true, mean_pa_pressure_gt_20: true, pvr_gt_2: true });
  assert(sus.suspected === true, 'CTEPH suspected');
  assert(sus.pea_eligible === true, 'PEA eligible');
});

suite('PERT Activation', () => {
  const yes = engine.pertActivation({ massive_pe: true });
  assert(yes.activate === true, 'PERT for massive PE');
  const no = engine.pertActivation({ massive_pe: false, intermediate_high_pe: false, deterioration: false, rv_failure: false, thrombolysis_being_considered: false });
  assert(no.activate === false, 'No PERT');
});

suite('Bleeding Risk', () => {
  const high = engine.bleedingRiskAssessment({ has_bled_score: 4, recent_bleeding: true });
  assert(high.risk === 'high', 'High bleeding risk');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
