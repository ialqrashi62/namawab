// P3-AO: Pharmacy-Clinical Engine — 10 pure functions
const Engine = {};

Engine.DoseRenalAdjustment = function ({ baselineDose = 100, creatinineClearance = 90, drugName = 'vancomycin' } = {}) {
  let adjustment;
  if (creatinineClearance >= 60) adjustment = 1.0;
  else if (creatinineClearance >= 30) adjustment = 0.75;
  else if (creatinineClearance >= 20) adjustment = 0.5;
  else if (creatinineClearance >= 10) adjustment = 0.25;
  else adjustment = 0;
  const adjustedDose = baselineDose * adjustment;
  return { adjustedDose, adjustment, recommendation: adjustment === 0 ? 'dialysis-dosing' : (adjustment < 0.5 ? 'nephrology-consult' : 'monitor-renal-function') };
};

Engine.TherapeuticDrugMonitoring = function ({ drug = 'vancomycin', troughLevel = 0, peakLevel = 0, dose = 1000, interval = 12 } = {}) {
  let interpretation;
  if (drug === 'vancomycin') {
    if (troughLevel >= 15 && troughLevel <= 20) interpretation = 'therapeutic-AUC-targeted';
    else if (troughLevel < 10) interpretation = 'subtherapeutic-increase-dose';
    else if (troughLevel > 20) interpretation = 'toxic-reduce-dose';
    else interpretation = 'subtherapeutic-trough-low';
  } else if (drug === 'gentamicin') {
    if (peakLevel >= 6 && peakLevel <= 10) interpretation = 'therapeutic-peak';
    else if (peakLevel < 6) interpretation = 'subtherapeutic-increase-dose';
    else interpretation = 'toxic-decrease-dose';
  } else if (drug === 'digoxin') {
    if (troughLevel >= 0.8 && troughLevel <= 2.0) interpretation = 'therapeutic-digoxin';
    else if (troughLevel < 0.8) interpretation = 'subtherapeutic-increase';
    else interpretation = 'toxic-reduce-or-hold';
  } else if (drug === 'phenytoin') {
    if (troughLevel >= 10 && troughLevel <= 20) interpretation = 'therapeutic-phenytoin';
    else if (troughLevel < 10) interpretation = 'subtherapeutic';
    else interpretation = 'toxic';
  } else {
    interpretation = 'unspecified-drug-manual-review';
  }
  return { interpretation, recommendation: interpretation.includes('toxic') ? 'hold-and-renal-check' : 'continue-monitor' };
};

Engine.DrugInteractionCheck = function ({ interactions = [], severity = 'minor' } = {}) {
  let alertLevel;
  if (severity === 'contraindicated') alertLevel = 'contraindicated-do-not-co-administer';
  else if (severity === 'major') alertLevel = 'major-avoid-or-monitor-closely';
  else if (severity === 'moderate') alertLevel = 'moderate-monitor';
  else alertLevel = 'minor-no-action';
  const interactionCount = interactions.length;
  return { alertLevel, interactionCount, recommendation: alertLevel.includes('contraindicated') ? 'substitute-or-avoid' : 'monitor-and-document' };
};

Engine.VancomycinAUC = function ({ trough = 0, dose = 1000, interval = 12, weight = 70 } = {}) {
  const dailyDose = (dose * 24) / interval;
  const auc = trough * 24;
  let interpretation;
  if (auc >= 400 && auc <= 600) interpretation = 'therapeutic-AUC-goal';
  else if (auc < 400) interpretation = 'subtherapeutic-AUC-low';
  else interpretation = 'supratherapeutic-AUC-toxic';
  return { auc: Math.round(auc), dailyDose, interpretation, recommendation: interpretation.includes('therapeutic') ? 'continue' : 'adjust-dose' };
};

Engine.AminoglycosideExtendedInterval = function ({ dose = 5, weight = 70, creatinine = 1.0, drug = 'gentamicin' } = {}) {
  const crCl = (140 - 65) * weight / (72 * creatinine);
  let interval;
  if (crCl >= 60) interval = 24;
  else if (crCl >= 40) interval = 36;
  else if (crCl >= 20) interval = 48;
  else interval = 'avoid-or-dialysis';
  const totalDose = dose * weight;
  return { interval, totalDose, crCl: Math.round(crCl), recommendation: interval === 'avoid-or-dialysis' ? 'avoid-extended-interval' : 'extended-interval-monitoring' };
};

Engine.PhenytoinCorrection = function ({ totalLevel = 10, albumin = 4.0, renalFailure = false } = {}) {
  const corrected = (totalLevel * 0.9 * albumin) / 4.0;
  let interpretation;
  if (corrected >= 10 && corrected <= 20) interpretation = 'therapeutic-corrected';
  else if (corrected < 10) interpretation = 'subtherapeutic-corrected';
  else interpretation = 'toxic-corrected';
  if (renalFailure) interpretation += '-uremic-monitor-free-level';
  return { corrected: Math.round(corrected * 10) / 10, interpretation, recommendation: renalFailure ? 'order-free-phenytoin-level' : 'use-corrected-value' };
};

Engine.WarfarinINRManagement = function ({ inr = 2.5, indication = 'afib', currentDose = 5 } = {}) {
  let adjustment;
  let targetINR;
  if (indication === 'mechanical-valve') targetINR = 3.0;
  else targetINR = 2.5;
  if (inr < 1.5) adjustment = 'bolus-5mg-and-increase-weekly-10-20%';
  else if (inr < 2.0) adjustment = 'increase-weekly-dose-10-15%';
  else if (inr > 3.5 && inr < 5.0) adjustment = 'hold-one-dose-and-decrease-5-10%';
  else if (inr >= 5.0) adjustment = 'hold-and-vitamin-K-consider';
  else adjustment = 'no-change-continue';
  return { adjustment, targetINR, recommendation: inr > 5.0 ? 'urgent-reversal' : 'continue-with-adjustment' };
};

Engine.InsulinDrip = function ({ currentRate = 2, glucose = 150, previousGlucose = 180, sensitivityFactor = 50 } = {}) {
  const delta = glucose - previousGlucose;
  let newRate;
  if (glucose < 70) newRate = 0;
  else if (glucose < 100) newRate = Math.max(0, currentRate - 1);
  else if (glucose < 150) newRate = currentRate;
  else if (glucose < 200) newRate = currentRate + 1;
  else if (glucose < 300) newRate = currentRate + 2;
  else newRate = currentRate + 3;
  return { newRate, delta, recommendation: glucose < 70 ? 'hold-drip-and-D50' : 'recheck-glucose-1h' };
};

Engine.VancomycinLoading = function ({ weight = 70, creatinine = 1.0, severity = 'severe' } = {}) {
  const crCl = (140 - 65) * weight / (72 * creatinine);
  let loadDose;
  if (severity === 'severe' || severity === 'sepsis') loadDose = 30 * weight;
  else if (severity === 'moderate') loadDose = 25 * weight;
  else loadDose = 20 * weight;
  let maintenanceInterval;
  if (crCl >= 50) maintenanceInterval = 12;
  else if (crCl >= 20) maintenanceInterval = 24;
  else maintenanceInterval = 48;
  return { loadDose, maintenanceInterval, crCl: Math.round(crCl), recommendation: 'administer-over-90-120-min' };
};

Engine.MedicationReconciliation = function ({ discrepancies = 0, omissions = 0, duplications = 0, interactions = 0, allergies = 0 } = {}) {
  let severity;
  const totalIssues = discrepancies + omissions + duplications + interactions + allergies;
  if (allergies > 0) severity = 'critical-allergy-flag-must-resolve';
  else if (interactions > 0) severity = 'high-interaction-must-resolve';
  else if (omissions > 2) severity = 'high-omission-review';
  else if (duplications > 0) severity = 'moderate-duplication';
  else if (discrepancies > 0) severity = 'minor-discrepancy-document';
  else severity = 'no-issues-clean-reconciliation';
  return { totalIssues, severity, recommendation: severity.includes('critical') || severity.includes('high') ? 'urgent-pharmacy-resolution' : 'document-and-continue' };
};

module.exports = Engine;
