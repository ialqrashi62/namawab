'use strict';
const Engine = require('./transplant_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('TRANSPLANT ENGINE TESTS\n========================================');

describe('KDPI_Kidney', () => {
  it('young donor excellent', () => {
    const r = Engine.KDPI_Kidney({ donorAge: 25, donorHeight: 175, donorWeight: 75, donorCreatinine: 1.0, donorSex: 'male' });
    assertEq(r.quality, 'excellent');
  });
  it('older donor with comorbidities', () => {
    const r = Engine.KDPI_Kidney({ donorAge: 65, donorHtn: true, donorDiabetes: true, donorCkd: true, donorHcv: true, donorCreatinine: 2.5 });
    assertEq(r.quality, 'poor');
  });
});

describe('HLAMatch', () => {
  it('zero mismatch', () => {
    const r = Engine.HLAMatch({ aMismatch: 0, bMismatch: 0, drMismatch: 0 });
    assertEq(r.grade, 'perfect-zero-mismatch');
  });
  it('poor mismatch', () => {
    const r = Engine.HLAMatch({ aMismatch: 2, bMismatch: 2, drMismatch: 2 });
    assertEq(r.grade, 'poor');
  });
});

describe('EPTSScore', () => {
  it('high priority', () => {
    const r = Engine.EPTSScore({ recipientAge: 70, recipientDiabetes: true, recipientDialysisYears: 5, recipientTransplant: true });
    assertEq(r.tier, 'high-priority');
  });
  it('low priority', () => {
    const r = Engine.EPTSScore({ recipientAge: 30, recipientDiabetes: false, recipientDialysisYears: 0 });
    assertEq(r.tier, 'low');
  });
});

describe('ImmunosuppressionLevel', () => {
  it('tacrolimus in range', () => {
    const r = Engine.ImmunosuppressionLevel({ drugLevel: 10, drugName: 'tacrolimus', timePostTransplantDays: 60 });
    assertEq(r.inRange, true);
  });
  it('subtherapeutic', () => {
    const r = Engine.ImmunosuppressionLevel({ drugLevel: 3, drugName: 'tacrolimus', timePostTransplantDays: 60 });
    assertEq(r.action, 'increase');
  });
});

describe('RejectionRisk', () => {
  it('high risk with DSA', () => {
    const r = Engine.RejectionRisk({ donorSpecificAntibody: true, crossMatch: 'positive', hlaMismatch: 6 });
    assertEq(r.level, 'high');
  });
  it('low risk', () => {
    const r = Engine.RejectionRisk({ donorSpecificAntibody: false, crossMatch: 'negative', hlaMismatch: 1 });
    assertEq(r.level, 'low');
  });
});

describe('BanffRejection', () => {
  it('borderline', () => {
    const r = Engine.BanffRejection({ interstitialInfiltratePct: 30, tubulitisScore: 1 });
    assertEq(r.grade, 'borderline');
  });
  it('severe intimal arteritis', () => {
    const r = Engine.BanffRejection({ interstitialInfiltratePct: 20, tubulitisScore: 0, intimalArteritisScore: 2 });
    assertEq(r.grade, 'III');
  });
});

describe('DonorRecipientMatch', () => {
  it('O donor universal', () => {
    const r = Engine.DonorRecipientMatch({ bloodTypeDonor: 'O', bloodTypeRecipient: 'A', weightRatio: 1.0, ageDiffYears: 10 });
    assertEq(r.aboOk, true);
  });
  it('AB mismatch', () => {
    const r = Engine.DonorRecipientMatch({ bloodTypeDonor: 'AB', bloodTypeRecipient: 'O', weightRatio: 1.0, ageDiffYears: 10 });
    assertEq(r.aboOk, false);
  });
  it('CMV risk D+/R-', () => {
    const r = Engine.DonorRecipientMatch({ bloodTypeDonor: 'O', bloodTypeRecipient: 'O', weightRatio: 1.0, ageDiffYears: 10, cmvStatusDonor: 'positive', cmvStatusRecipient: 'negative' });
    assertEq(r.cmvRisk, true);
  });
});

describe('PostTransplantComplication', () => {
  it('early DGF', () => {
    const r = Engine.PostTransplantComplication({ daysPostTransplant: 5, creatinine: 3.0 });
    assert(r.complications.includes('early-DGF'));
  });
  it('late chronic allograft', () => {
    const r = Engine.PostTransplantComplication({ daysPostTransplant: 365, creatinine: 2.5 });
    assert(r.complications.includes('chronic-allograft'));
  });
});

describe('AllocationPriority', () => {
  it('high wait time + sensitized', () => {
    const r = Engine.AllocationPriority({ bloodType: 'O', waitListDays: 1500, sensitizationCpra: 95, status: 'high' });
    assert(r.points > 50);
  });
  it('pediatric', () => {
    const r = Engine.AllocationPriority({ bloodType: 'O', waitListDays: 100, ageMonths: 12, status: 'standard' });
    assert(r.points >= 30);
  });
});

describe('InductionTherapy', () => {
  it('sensitized ATG', () => {
    const r = Engine.InductionTherapy({ sensitizationCpra: 90, priorTransplant: false, donorType: 'deceased', hlaMismatch: 5 });
    assertEq(r.risk, 'high-immunologic');
  });
  it('living donor IL-2RA', () => {
    const r = Engine.InductionTherapy({ sensitizationCpra: 0, priorTransplant: false, donorType: 'living', hlaMismatch: 2 });
    assertEq(r.risk, 'low-immunologic');
  });
});

console.log();
console.log('transplant engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
