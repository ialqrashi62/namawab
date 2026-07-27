'use strict';

const Engine = require('./hospital_admin_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('hospital_admin engine tests', () => {
  it('bed capacity exceed', () => {
    const r = Engine.BedCapacityManagement({ totalBeds: 100, occupiedBeds: 105, edAdmissions: 25 });
    assertEq(r.status, 'overcapacity-divert-pending');
  });
  it('ED LOS critical', () => {
    const r = Engine.EDLOSAnalysis({ edAdmissions: 50, edBeds: 20, averageLOS: 8, boardingAdmissions: 12 });
    assertEq(r.classification, 'critical-ED-overcrowding');
  });
  it('readmission high', () => {
    const r = Engine.ReadmissionRate({ readmissions30day: 15, totalDischarges: 100 });
    assertEq(r.riskCategory, 'high-readmission-rate');
  });
  it('staffing critical', () => {
    const r = Engine.NurseStaffingRatio({ nurses: 5, patients: 40 });
    assertEq(r.classification, 'critical-staffing-shortage');
  });
  it('ICU LOS extended', () => {
    const r = Engine.ICULOSAnalysis({ icuLOSDays: 14, expectedLOS: 5, ventilatorDays: 10 });
    assertEq(r.classification, 'extended-ICU-LOS-CLU-consider');
  });
  it('discharge slow', () => {
    const r = Engine.DischargeEfficiency({ dischargeOrdersBeforeNoon: 30, totalDischarges: 100, averageDischargeTime: 16 });
    assertEq(r.efficiency, 'low-efficiency-early-discharge-plan');
  });
  it('OR turnover slow', () => {
    const r = Engine.ORUtilization({ orRooms: 10, casesPerRoom: 4, totalORHours: 40, availableHours: 100, turnoverTime: 90 });
    assertEq(r.efficiency, 'low-turnover-improve-process');
  });
  it('cost variance high', () => {
    const r = Engine.CostVariance({ actualCost: 1500000, budgetedCost: 1000000 });
    assertEq(r.classification, 'high-variance-investigation-needed');
  });
  it('denial rate high', () => {
    const r = Engine.ClaimDenialRate({ deniedClaims: 30, totalClaims: 100 });
    assertEq(r.riskCategory, 'high-denial-rate-appeal-process');
  });
  it('HCAHPS low', () => {
    const r = Engine.HCAHPSPatientExperience({ recommendScore: 55, communicationScore: 55, responsivenessScore: 55, cleanlinessScore: 55, painManagementScore: 55, dischargeScore: 55 });
    assertEq(r.performanceTier, 'low-performance-improvement-plan');
  });
});

console.log(`\nhospital_admin engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
