'use strict';

const Engine = require('./transplant_neph_engine');

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; }
}
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('transplant_neph engine tests', () => {
  it('AKI stage 3', () => {
    const r = Engine.KDIGOAKIStage({ baselineCreatinine: 1.0, peakCreatinine: 3.5 });
    assertEq(r.stage, 'stage-3');
  });
  it('EPTS very high', () => {
    const r = Engine.KidneyTransplantEPTS({ age: 70, diabetes: true, priorTransplant: true, dialysisTimeYears: 6, bloodType: 'O' });
    assertEq(r.priority, 'very-high-priority');
  });
  it('KDPI high discard', () => {
    const r = Engine.DonorKidneyKDPI({ age: 70, weight: 100, hypertension: true, diabetes: true, causeOfDeath: 'cva' });
    assertEq(r.category, 'high-KDPI-discard-consider');
  });
  it('Banff acute TCMR IIA', () => {
    const r = Engine.BanffRejectionClassification({ interstitialInflammation: 2, tubulitis: 3, intimalArteritis: 1 });
    assertEq(r.classification, 'Acute-TCMR-grade-IIA');
  });
  it('Kt/V inadequate', () => {
    const r = Engine.DialysisAdequacyKtV({ spKtV: 1.0, ureaReductionRatio: 50, dialysisFrequency: 2, sessionHours: 3 });
    assertEq(r.adequacy, 'inadequate-needs-intervention');
  });
  it('BK nephropathy high', () => {
    const r = Engine.BKNephropathyRisk({ bkViralLoad: 200000 });
    assertEq(r.risk, 'high-presumptive-BK-nephropathy');
  });
  it('nephrotic full relapse', () => {
    const r = Engine.NephroticSyndromeRelapse({ proteinuriaGrams: 5, albumin: 2.5, edema: true });
    assertEq(r.category, 'full-relapse');
  });
  it('CKD-MBD severe', () => {
    const r = Engine.CKDMineralBone({ calcium: 9, phosphorus: 6, pth: 800, gfr: 20 });
    assertEq(r.category, 'severe-CKD-MBD');
  });
  it('RAS Class I stent', () => {
    const r = Engine.RenalArteryStenosis({ stenosisPercent: 80, flashPulmonaryEdema: true });
    assertEq(r.indication, 'Class-I-stenting-indicated');
  });
  it('DSA plasmapheresis', () => {
    const r = Engine.DSAManagement({ mfi: 15000, previousAMR: true });
    assertEq(r.action, 'plasma-exchange-IVIG-rituximab-urgent');
  });
});

console.log(`\ntransplant_neph engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
