'use strict';
const assert = require('assert');
const Engine = require('./or_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('ASAClassification', () => {
  it('healthy', () => {
    const r = Engine.ASAClassification({ systemicDisease: 'none' });
    assertEq(r.asa, 1);
  });
  it('severe disease', () => {
    const r = Engine.ASAClassification({ systemicDisease: 'severe' });
    assertEq(r.asa, 4);
  });
  it('moribund', () => {
    const r = Engine.ASAClassification({ moribund: true });
    assertEq(r.asa, 5);
  });
});

describe('PreOpNPO', () => {
  it('compliant', () => {
    const eightHoursAgo = new Date(Date.now() - 8 * 3600000).toISOString();
    const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
    const r = Engine.PreOpNPO({ lastSolids: eightHoursAgo, lastClearLiquids: twoHoursAgo });
    assertEq(r.npoCompliant, true);
  });
  it('recent clear', () => {
    const eightHoursAgo = new Date(Date.now() - 8 * 3600000).toISOString();
    const recent = new Date(Date.now() - 30 * 60000).toISOString();
    const r = Engine.PreOpNPO({ lastSolids: eightHoursAgo, lastClearLiquids: recent });
    assertEq(r.npoCompliant, false);
  });
  it('emergency overrides', () => {
    const recent = new Date().toISOString();
    const r = Engine.PreOpNPO({ lastSolids: recent, surgeryType: 'emergency' });
    assertEq(r.npoCompliant, true);
  });
});

describe('MallampatiScore', () => {
  it('class 1 easy', () => {
    const r = Engine.MallampatiScore({ softPalate: 'visible', faucialPillars: 'visible', uvula: 'visible' });
    assertEq(r.class, 1);
    assertEq(r.difficultAirway, false);
  });
  it('class 4 difficult', () => {
    const r = Engine.MallampatiScore({ softPalate: 'not_visible', faucialPillars: 'not_visible', uvula: 'not_visible', tonsils: 'not_visible' });
    assertEq(r.class, 4);
    assertEq(r.difficultAirway, true);
  });
});

describe('STOPBangScore', () => {
  it('low risk', () => {
    const r = Engine.STOPBangScore({ snore: false, tired: false, observedStop: false, highBP: false, bmi: 28, age: 40, neckCircumference: 38, male: false });
    assertEq(r.risk, 'low');
  });
  it('high risk 6+', () => {
    const r = Engine.STOPBangScore({ snore: true, tired: true, observedStop: true, highBP: true, bmi: 40, age: 55, neckCircumference: 45, male: true });
    assertEq(r.risk, 'high');
  });
});

describe('AntibioticProphylaxis', () => {
  it('cefazolin 2g', () => {
    const r = Engine.AntibioticProphylaxis({ surgeryType: 'orthopedic', age: 50, weightKg: 70, egfr: 80 });
    assertEq(r.agent, 'cefazolin');
  });
  it('penicillin allergy -> vancomycin', () => {
    const r = Engine.AntibioticProphylaxis({ surgeryType: 'orthopedic', age: 50, weightKg: 70, egfr: 80, allergies: ['penicillin'] });
    assertEq(r.agent, 'vancomycin');
  });
  it('colorectal adds metronidazole', () => {
    const r = Engine.AntibioticProphylaxis({ surgeryType: 'colorectal', age: 50, weightKg: 70, egfr: 80 });
    assert(r.agent.includes('metronidazole'));
  });
});

describe('IntraopBloodLossEstimate', () => {
  it('minimal', () => {
    const r = Engine.IntraopBloodLossEstimate({ suctionVolume: 100, irrigationVolume: 50, preopHct: 40, currentHct: 38 });
    assertEq(r.severity, 'minimal');
  });
  it('massive EBL 3000', () => {
    const r = Engine.IntraopBloodLossEstimate({ suctionVolume: 3000, irrigationVolume: 0, preopHct: 40, currentHct: 30 });
    assertEq(r.severity, 'massive');
    assertEq(r.mtpIndicated, true);
  });
});

describe('ReversalAgentDecision', () => {
  it('no reversal needed TOF=4', () => {
    const r = Engine.ReversalAgentDecision({ agent: 'rocuronium', lastDoseMin: 60, trainOfFour: 4, weightKg: 70 });
    assertEq(r.reversal, 'not_needed');
  });
  it('sugammadex recent', () => {
    const r = Engine.ReversalAgentDecision({ agent: 'rocuronium', lastDoseMin: 20, trainOfFour: 0, weightKg: 70 });
    assertEq(r.reversal, 'sugammadex');
  });
  it('renal failure -> neostigmine', () => {
    const r = Engine.ReversalAgentDecision({ agent: 'rocuronium', lastDoseMin: 240, trainOfFour: 0, weightKg: 70, renalFailure: true });
    assertEq(r.reversal, 'neostigmine');
  });
});

describe('PostOpPainManagement', () => {
  it('multimodal standard', () => {
    const r = Engine.PostOpPainManagement({ procedureType: 'general', opioidTolerance: false });
    assertEq(r.multimodal, true);
  });
  it('thoracic gets epidural', () => {
    const r = Engine.PostOpPainManagement({ procedureType: 'thoracic', opioidTolerance: false });
    assert(r.plan.includes('thoracic_epidural'));
  });
});

describe('PACUDischarge', () => {
  it('ready aldrete 10', () => {
    const r = Engine.PACUDischarge({ activity: 4, respiration: 16, bpDelta: 10, consciousness: 'fully_awake', spo2: 96 });
    assertEq(r.aldrete, 10);
    assertEq(r.dischargeReady, true);
  });
  it('not ready low spo2', () => {
    const r = Engine.PACUDischarge({ activity: 4, respiration: 16, bpDelta: 10, consciousness: 'fully_awake', spo2: 88 });
    assertEq(r.dischargeReady, false);
  });
});

describe('WHOChecklist', () => {
  it('all complete', () => {
    const r = Engine.WHOChecklist({ signInComplete: true, timeOutComplete: true, signOutComplete: true, surgicalSiteMarked: true, antibioticGiven: true, allergiesConfirmed: true });
    assertEq(r.completionPct, 100);
    assertEq(r.canProceed, true);
  });
  it('site not marked', () => {
    const r = Engine.WHOChecklist({ signInComplete: true, timeOutComplete: true, signOutComplete: false, surgicalSiteMarked: false, antibioticGiven: true, allergiesConfirmed: true });
    assertEq(r.canProceed, false);
  });
});

console.log('or engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
