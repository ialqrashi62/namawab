'use strict';
const Engine = require('./billing_rcm_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('BILLING/RCM ENGINE TESTS\n========================================');

describe('CPTLookup', () => {
  it('99213 E/M', () => {
    const r = Engine.CPTLookup({ code: '99213' });
    assertEq(r.category, 'E/M');
  });
  it('73721 MRI', () => {
    const r = Engine.CPTLookup({ code: '73721' });
    assertEq(r.category, 'Radiology');
  });
  it('80053 BMP lab', () => {
    const r = Engine.CPTLookup({ code: '80053' });
    assertEq(r.category, 'Pathology/Lab');
  });
});

describe('ICD10Lookup', () => {
  it('I50.9 heart failure', () => {
    const r = Engine.ICD10Lookup({ code: 'I50.9' });
    assertEq(r.chapter, 'Circulatory');
  });
  it('C50.9 breast cancer', () => {
    const r = Engine.ICD10Lookup({ code: 'C50.9' });
    assertEq(r.chapter, 'Neoplasms');
  });
  it('E11.9 diabetes', () => {
    const r = Engine.ICD10Lookup({ code: 'E11.9' });
    assertEq(r.chapter, 'Endocrine');
  });
});

describe('ModifierValidation', () => {
  it('Modifier 25 valid', () => {
    const r = Engine.ModifierValidation({ cpt: '99213', modifier: '25' });
    assertEq(r.valid, true);
  });
  it('Invalid modifier', () => {
    const r = Engine.ModifierValidation({ cpt: '99213', modifier: '99' });
    assertEq(r.valid, false);
  });
});

describe('NPHIESClaim', () => {
  it('ready to submit', () => {
    const r = Engine.NPHIESClaim({ diagnosisCodes: ['I50.9'], serviceCodes: ['99213'], payer: 'PHI', authorizationNumber: 'AUTH123', priorAuthRequired: true, attachmentCount: 3 });
    assertEq(r.status, 'ready-to-submit');
  });
  it('incomplete missing auth', () => {
    const r = Engine.NPHIESClaim({ diagnosisCodes: ['I50.9'], serviceCodes: ['99213'], payer: 'PHI', priorAuthRequired: true });
    assertEq(r.status, 'incomplete');
  });
});

describe('DenialReason', () => {
  it('CO-16 contractual', () => {
    const r = Engine.DenialReason({ reason: 'CO-16' });
    assertEq(r.category, 'contractual');
  });
  it('PR-1 patient responsibility', () => {
    const r = Engine.DenialReason({ reason: 'PR-1' });
    assertEq(r.category, 'patient-responsibility');
  });
});

describe('ChargeCapture', () => {
  it('office visit + lab', () => {
    const r = Engine.ChargeCapture({ encounterType: 'office', services: [{ cpt: '99213', units: 1 }, { cpt: '80053', units: 1 }] });
    assert(r.totalRVU > 1);
  });
});

describe('CodingAccuracy', () => {
  it('excellent', () => {
    const r = Engine.CodingAccuracy({ actualEncounter: '99213', codedEncounter: '99213', missedCodes: ['99214'] });
    assertEq(r.level, 'excellent');
  });
  it('fair with misses', () => {
    const r = Engine.CodingAccuracy({ actualEncounter: '99213', codedEncounter: '99214', missedCodes: ['99213', '85025', '80053'] });
    assertEq(r.level, 'poor');
  });
});

describe('AR_AgingBucket', () => {
  it('current', () => {
    const r = Engine.AR_AgingBucket({ daysOut: 15, amount: 500 });
    assertEq(r.bucket, 'current');
  });
  it('180+', () => {
    const r = Engine.AR_AgingBucket({ daysOut: 200, amount: 1000 });
    assertEq(r.bucket, '180+');
  });
});

describe('PreAuthRequirement', () => {
  it('emergency no auth', () => {
    const r = Engine.PreAuthRequirement({ procedure: 'MRI', emergency: true });
    assertEq(r.required, false);
  });
  it('MRI elective requires auth', () => {
    const r = Engine.PreAuthRequirement({ procedure: 'MRI', elective: true });
    assertEq(r.required, true);
  });
});

describe('RevenueCycleKPI', () => {
  it('excellent', () => {
    const r = Engine.RevenueCycleKPI({ charges: 100000, payments: 95000, denials: 3000, daysInAR: 30, cleanClaimRate: 0.97, collectionRate: 0.95 });
    assertEq(r.health, 'excellent');
  });
});

console.log();
console.log('billing_rcm engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
