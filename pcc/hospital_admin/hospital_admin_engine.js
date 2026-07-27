'use strict';

// Hospital-Administration PCC — 10 pure deterministic functions
// Compliance: AHRQ, CMS, TJC, AHA, HFAP, DNV, IHI, NQF, ACHE

const Engine = module.exports = {};

// 1) Bed capacity management
Engine.BedCapacityManagement = function (input = {}) {
  const { totalBeds = 100, occupiedBeds = 80, edAdmissions = 15, electiveAdmissions = 5, dischargesExpected = 20, icuBeds = 0, icuOccupied = 0 } = input;
  const occupancyRate = (occupiedBeds / totalBeds) * 100;
  const icuOccupancy = icuBeds > 0 ? (icuOccupied / icuBeds) * 100 : 0;
  let status;
  if (occupiedBeds > totalBeds) status = 'overcapacity-divert-pending';
  else if (occupancyRate >= 95 || icuOccupancy >= 95) status = 'critical-near-capacity';
  else if (occupancyRate >= 85 || edAdmissions > 30) status = 'high-utilization-surge';
  else if (occupancyRate >= 70) status = 'optimal-utilization';
  else status = 'low-utilization';
  return { occupancyRate: Math.round(occupancyRate * 10) / 10, status, recommendation: status.includes('overcapacity') || status.includes('critical') ? 'surge-protocol-ICU-fast-track-discharges' : 'monitor-hourly' };
};

// 2) ED LOS
Engine.EDLOSAnalysis = function (input = {}) {
  const { edAdmissions = 30, edBeds = 20, averageLOS = 4, boardingAdmissions = 5 } = input;
  const totalEDHours = edAdmissions * averageLOS;
  const capacity = edBeds * 24;
  const utilization = (totalEDHours / capacity) * 100;
  let classification;
  if (boardingAdmissions > 8) classification = 'critical-ED-overcrowding';
  else if (utilization >= 90 || boardingAdmissions > 4) classification = 'high-ED-stress';
  else if (utilization >= 70) classification = 'moderate-ED-stress';
  else classification = 'low-ED-stress';
  return { utilization: Math.round(utilization * 10) / 10, classification, recommendation: classification === 'critical-ED-overcrowding' ? 'inpatient-boarding-protocol-discharge-coordinator' : 'monitor-ED-throughput' };
};

// 3) Readmission rate
Engine.ReadmissionRate = function (input = {}) {
  const { readmissions30day = 5, totalDischarges = 100, expected = 12 } = input;
  const rate = (readmissions30day / totalDischarges) * 100;
  let riskCategory;
  if (rate >= 20) riskCategory = 'very-high-readmission-rate';
  else if (rate >= 15) riskCategory = 'high-readmission-rate';
  else if (rate >= expected * 1.5) riskCategory = 'elevated-readmission';
  else if (rate <= expected) riskCategory = 'acceptable-readmission';
  else riskCategory = 'within-expected';
  return { rate: Math.round(rate * 10) / 10, riskCategory, recommendation: riskCategory.includes('high') ? 'transitions-of-care-program-followup-call' : 'monitor' };
};

// 4) Nurse staffing
Engine.NurseStaffingRatio = function (input = {}) {
  const { nurses = 5, patients = 10, icu = false, shift = 'day' } = input;
  const ratio = patients / nurses;
  let classification;
  if (icu && ratio > 2) classification = 'critical-staffing-shortage';
  else if (!icu && ratio > 6) classification = 'critical-staffing-shortage';
  else if (icu && ratio > 3) classification = 'understaffed';
  else if (!icu && ratio > 5) classification = 'understaffed';
  else if (icu && ratio <= 2) classification = 'optimal-staffing';
  else if (!icu && ratio <= 5) classification = 'optimal-staffing';
  else classification = 'overstaffed';
  return { ratio, classification, recommendation: classification === 'critical-staffing-shortage' ? 'agency-nurses-bed-closure' : (classification === 'understaffed' ? 'resource-pool-call-in' : 'maintain') };
};

// 5) ICU LOS
Engine.ICULOSAnalysis = function (input = {}) {
  const { icuLOSDays = 5, expectedLOS = 5, ventilatorDays = 0, apacheScore = 15 } = input;
  const ratio = icuLOSDays / expectedLOS;
  let classification;
  if (ratio >= 2) classification = 'extended-ICU-LOS-CLU-consider';
  else if (ratio >= 1.5) classification = 'prolonged-ICU-LOS';
  else if (ratio <= 1.2) classification = 'expected-ICU-LOS';
  else classification = 'within-acceptable-LOS';
  if (ventilatorDays >= 14) classification = 'prolonged-mechanical-ventilation-tracheostomy-consider';
  return { ratio, classification, recommendation: classification.includes('extended') || classification.includes('prolonged') ? 'step-down-ready-eval-MDT' : 'monitor' };
};

// 6) Discharge efficiency
Engine.DischargeEfficiency = function (input = {}) {
  const { dischargeOrdersBeforeNoon = 50, totalDischarges = 100, averageDischargeTime = 14 } = input;
  const beforeNoonPct = (dischargeOrdersBeforeNoon / totalDischarges) * 100;
  let efficiency;
  if (beforeNoonPct >= 70 && averageDischargeTime <= 12) efficiency = 'high-efficiency-noon-discharges';
  else if (beforeNoonPct >= 50 && averageDischargeTime <= 14) efficiency = 'moderate-efficiency';
  else if (beforeNoonPct >= 30) efficiency = 'low-efficiency-early-discharge-plan';
  else efficiency = 'very-low-discharge-planning-overhaul';
  return { beforeNoonPct: Math.round(beforeNoonPct * 10) / 10, efficiency, recommendation: efficiency.includes('low') ? 'noon-discharge-initiative-team-based-rounds' : 'maintain-current-process' };
};

// 7) OR utilization
Engine.ORUtilization = function (input = {}) {
  const { orRooms = 10, casesPerRoom = 6, totalORHours = 80, availableHours = 100, turnoverTime = 30 } = input;
  const utilization = (totalORHours / availableHours) * 100;
  let efficiency;
  if (utilization >= 90 && turnoverTime <= 20) efficiency = 'high-utilization-excellent-turnover';
  else if (utilization >= 75) efficiency = 'good-utilization';
  else if (utilization >= 50) efficiency = 'moderate-utilization';
  else if (turnoverTime > 60) efficiency = 'low-turnover-improve-process';
  else efficiency = 'low-utilization';
  return { utilization: Math.round(utilization * 10) / 10, efficiency, recommendation: efficiency.includes('low') ? 'turnover-improvement-LEAN-process' : 'maintain' };
};

// 8) Cost variance
Engine.CostVariance = function (input = {}) {
  const { actualCost = 1000000, budgetedCost = 1000000, department = 'general' } = input;
  const variance = ((actualCost - budgetedCost) / budgetedCost) * 100;
  let classification;
  if (variance >= 30) classification = 'high-variance-investigation-needed';
  else if (variance >= 15) classification = 'elevated-variance-review';
  else if (variance >= 5) classification = 'slight-variance-monitor';
  else if (variance >= -5) classification = 'within-budget';
  else classification = 'under-budget-credits';
  return { variance: Math.round(variance * 10) / 10, classification, recommendation: classification.includes('high') ? 'cost-reduction-PI-committee' : 'monitor-monthly' };
};

// 9) Claim denial rate
Engine.ClaimDenialRate = function (input = {}) {
  const { deniedClaims = 5, totalClaims = 100, overturned = 0 } = input;
  const denialRate = (deniedClaims / totalClaims) * 100;
  const overturnRate = deniedClaims > 0 ? (overturned / deniedClaims) * 100 : 0;
  let riskCategory;
  if (denialRate >= 20) riskCategory = 'high-denial-rate-appeal-process';
  else if (denialRate >= 10) riskCategory = 'elevated-denial-rate';
  else if (denialRate >= 5) riskCategory = 'moderate-denial-rate';
  else riskCategory = 'low-denial-rate';
  return { denialRate: Math.round(denialRate * 10) / 10, overturnRate: Math.round(overturnRate * 10) / 10, riskCategory, recommendation: riskCategory.includes('high') ? 'revenue-cycle-PI-appeal-team' : 'monitor-monthly' };
};

// 10) HCAHPS patient experience
Engine.HCAHPSPatientExperience = function (input = {}) {
  const { recommendScore = 90, communicationScore = 90, responsivenessScore = 85, cleanlinessScore = 85, painManagementScore = 85, dischargeScore = 85 } = input;
  const overallAvg = (recommendScore + communicationScore + responsivenessScore + cleanlinessScore + painManagementScore + dischargeScore) / 6;
  let performanceTier;
  if (overallAvg >= 85) performanceTier = 'high-performance-excellent';
  else if (overallAvg >= 75) performanceTier = 'good-performance';
  else if (overallAvg >= 65) performanceTier = 'moderate-performance';
  else if (overallAvg >= 50) performanceTier = 'low-performance-improvement-plan';
  else performanceTier = 'very-low-performance-crisis';
  return { overallAvg: Math.round(overallAvg * 10) / 10, performanceTier, recommendation: performanceTier.includes('low') ? 'patient-experience-PI-communication-training' : 'maintain-current-practices' };
};
