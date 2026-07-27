'use strict';
const Engine = require('./transplant_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('TRANSPLANT EXT ENGINE TESTS\n========================================');

describe('HeartAllocationStatus', () => {
  it('ECMO Status-1A', () => {
    const r = Engine.HeartAllocationStatus({ ecmo: true });
    assertEq(r.status, 'Status-1A');
  });
});

describe('LungAllocationScore', () => {
  it('high LAS PAH', () => {
    const r = Engine.LungAllocationScore({ diagnosis: 'PAH', fev1: 25, dlco: 20, oxygenRequirement: 6, mechanicalVentilation: true });
    assert(r.lasScore >= 70);
  });
});

describe('LiverMELDAllocation', () => {
  it('Status-1 acute liver failure', () => {
    const r = Engine.LiverMELDAllocation({ meldNa: 35, acuteLiverFailure: true });
    assertEq(r.allocation, 'Status-1-acute-liver-failure');
  });
});

describe('KidneyAllocationKDPI', () => {
  it('KDPI > 85 discard', () => {
    const r = Engine.KidneyAllocationKDPI({ donorAge: 70, donorHypertension: true, donorDiabetes: true, donorCreatinine: 2, donorCVA: true, donorHCV: true });
    assertEq(r.kdpi, 'KDPI-greater-than-85-discarded-discussed');
  });
});

describe('BanffRejection', () => {
  it('vascular IIA', () => {
    const r = Engine.BanffRejection({ tScore: 3, iScore: 2, vScore: 1, gScore: 0, ptcScore: 0, c4d: 0, dsaPositive: false });
    assertEq(r.histology, 'acute-cellular-rejection-III-vascular');
  });
});

describe('ISHLTRejection', () => {
  it('3R severe', () => {
    const r = Engine.ISHLTRejection({ isrL: 3, isrR: 3 });
    assertEq(r.acuteCellularGrade, '3R-severe');
  });
});

describe('TacrolimusTDM', () => {
  it('toxic', () => {
    const r = Engine.TacrolimusTDM({ troughLevel: 18, timePostTransplant: 6 });
    assertEq(r.category, 'toxic-nephrotoxic-neurotoxic');
  });
});

describe('PostTransplantInfection', () => {
  it('opportunistic 90 days', () => {
    const r = Engine.PostTransplantInfection({ daysPostTransplant: 90, fever: true });
    assertEq(r.risk, 'opportunistic-CMV-PJP-fungal');
  });
});

describe('DonorRiskIndex', () => {
  it('extended criteria', () => {
    const r = Engine.DonorRiskIndex({ age: 65, causeOfDeath: 'CVA', donorHypertension: true, donorDiabetes: true, donorCreatinine: 1.8, coldIschemiaTime: 30 });
    assert(r.classification === 'extended-criteria-discard-discuss' || r.classification === 'expanded-criteria');
  });
});

describe('TransplantEligibility', () => {
  it('not eligible substance', () => {
    const r = Engine.TransplantEligibility({ age: 50, substanceUse: true });
    assertEq(r.contraindication, true);
  });
});

console.log();
console.log('transplant_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
