'use strict';
const assert = require('assert');
const Engine = require('./cticu_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('ChestTubeOutput', () => {
  it('severe total > 1500', () => {
    const r = Engine.ChestTubeOutput({ hourlyOutput: [400, 350, 300, 300, 200], consecutiveHours: 5 });
    assertEq(r.severity, 'severe');
    assertEq(r.takebackIndicated, true);
  });
  it('minimal', () => {
    const r = Engine.ChestTubeOutput({ hourlyOutput: [50, 50, 50, 50], consecutiveHours: 4 });
    assertEq(r.severity, 'minimal');
  });
  it('moderate consecutive takeback', () => {
    const r = Engine.ChestTubeOutput({ hourlyOutput: [300, 300, 300, 200], consecutiveHours: 3 });
    assertEq(r.severity, 'moderate');
    assertEq(r.takebackIndicated, true);
  });
});

describe('PostCPBHemodynamics', () => {
  it('cold wet', () => {
    const r = Engine.PostCPBHemodynamics({ map: 60, cvp: 15, cardiacIndex: 1.8, svr: 1500, hr: 100 });
    assertEq(r.state, 'cold_wet');
  });
  it('warm dry normal', () => {
    const r = Engine.PostCPBHemodynamics({ map: 75, cvp: 8, cardiacIndex: 2.5, svr: 1200, hr: 80 });
    assertEq(r.state, 'warm_dry');
  });
});

describe('PacemakerWires', () => {
  it('failure to capture', () => {
    const r = Engine.PacemakerWires({ mode: 'DDD', rate: 70, capture: false, thresholdMA: 2 });
    assertEq(r.status, 'failure_to_capture');
  });
  it('functional', () => {
    const r = Engine.PacemakerWires({ mode: 'DDD', rate: 80, capture: true, thresholdMA: 2 });
    assertEq(r.status, 'functional');
  });
});

describe('IABPCounterpulsation', () => {
  it('optimal', () => {
    const r = Engine.IABPCounterpulsation({ inflationTime: 'correct', deflationTime: 'correct' });
    assertEq(r.timingQuality, 'optimal');
  });
  it('poor late inflation', () => {
    const r = Engine.IABPCounterpulsation({ inflationTime: 'late', deflationTime: 'correct' });
    assertEq(r.timingQuality, 'poor');
  });
});

describe('PostOpAtrialFibrillation', () => {
  it('unstable -> rhythm', () => {
    const r = Engine.PostOpAtrialFibrillation({ rateBpm: 150, hemodynamicsStable: false, durationHours: 1, chadsVasc: 0 });
    assertEq(r.controlStrategy, 'rhythm');
  });
  it('rate control', () => {
    const r = Engine.PostOpAtrialFibrillation({ rateBpm: 140, hemodynamicsStable: true, durationHours: 1, chadsVasc: 0 });
    assertEq(r.controlStrategy, 'rate');
  });
  it('chads determines anticoag', () => {
    const r = Engine.PostOpAtrialFibrillation({ rateBpm: 150, hemodynamicsStable: false, durationHours: 1, chadsVasc: 3 });
    assertEq(r.anticoagulation, 'yes');
  });
});

describe('SwanGanzProfile', () => {
  it('cardiogenic shock', () => {
    const r = Engine.SwanGanzProfile({ cvp: 14, pas: 50, pad: 28, pcwp: 22, co: 3.0 });
    assertEq(r.profile, 'cardiogenic_shock');
  });
  it('right heart failure', () => {
    const r = Engine.SwanGanzProfile({ cvp: 16, pas: 35, pad: 18, pcwp: 10, co: 4.5 });
    assertEq(r.profile, 'right_heart_failure');
  });
});

describe('VasoactiveScore', () => {
  it('extreme', () => {
    const r = Engine.VasoactiveScore({ dopamine: 0, dobutamine: 0, epinephrine: 0.2, norepinephrine: 0.3, vasopressin: 0.04, milrinone: 0 });
    assert(r.vis >= 45);
    assertEq(r.category, 'extreme');
  });
  it('low', () => {
    const r = Engine.VasoactiveScore({ dopamine: 0, dobutamine: 0, epinephrine: 0, norepinephrine: 0, vasopressin: 0, milrinone: 0 });
    assertEq(r.category, 'low');
  });
});

describe('PostOpMI', () => {
  it('type 5', () => {
    const r = Engine.PostOpMI({ troponinFold: 12, newSTChanges: true, wallMotionAbnormality: false, chestPain: false, daysPostOp: 3 });
    assertEq(r.likelyMI, true);
    assertEq(r.type, 5);
  });
  it('type 4a', () => {
    const r = Engine.PostOpMI({ troponinFold: 6, newSTChanges: true, wallMotionAbnormality: false, chestPain: true, daysPostOp: 1 });
    assertEq(r.type, '4a');
  });
});

describe('Mediastinitis', () => {
  it('high risk', () => {
    const r = Engine.Mediastinitis({ daysPostOp: 5, fever: true, woundDrainage: true, sternalInstability: true, leukocytosis: true });
    assertEq(r.risk, 'high');
    assertEq(r.surgicalReexplore, true);
  });
  it('low risk', () => {
    const r = Engine.Mediastinitis({ daysPostOp: 30, fever: false, woundDrainage: false, sternalInstability: false, leukocytosis: false });
    assertEq(r.risk, 'low');
  });
});

describe('WeaningFromVent', () => {
  it('ready to extubate', () => {
    const r = Engine.WeaningFromVent({ peep: 5, fio2: 0.4, tidalVolume: 500, rr: 16, spo2: 96, mentalStatus: 'awake', minutesOnVent: 300 });
    assertEq(r.readyToExtubate, true);
    assertEq(r.supportLevel, 'extubated');
  });
  it('t-piece', () => {
    const r = Engine.WeaningFromVent({ peep: 5, fio2: 0.5, tidalVolume: 500, rr: 16, spo2: 96, mentalStatus: 'awake', minutesOnVent: 300 });
    assertEq(r.supportLevel, 'tpiece');
  });
  it('full support high peep', () => {
    const r = Engine.WeaningFromVent({ peep: 12, fio2: 0.7, tidalVolume: 500, rr: 18, spo2: 94, mentalStatus: 'awake', minutesOnVent: 300 });
    assertEq(r.supportLevel, 'full');
  });
});

console.log('cticu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
