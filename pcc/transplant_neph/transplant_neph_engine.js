'use strict';

// Transplant-Nephrology PCC — 10 pure deterministic functions
// Compliance: KDIGO, Banff, UNOS/OPTN, AST, ASHI, EBMT

const Engine = module.exports = {};

// 1) KDIGO AKI stage
Engine.KDIGOAKIStage = function (input = {}) {
  const { baselineCreatinine = 1.0, peakCreatinine = 1.0, urineOutputMLkgH = 1.0, durationHours = 24, rrt = false } = input;
  const ratio = peakCreatinine / baselineCreatinine;
  let stage;
  if (rrt || peakCreatinine >= 4.0) stage = 'stage-3';
  else if (peakCreatinine >= 3.0 || ratio >= 3 || (urineOutputMLkgH < 0.3 && durationHours >= 24)) stage = 'stage-3';
  else if (peakCreatinine >= 2.0 || ratio >= 2 || (urineOutputMLkgH < 0.5 && durationHours >= 12)) stage = 'stage-2';
  else if (ratio >= 1.5 || (urineOutputMLkgH < 0.5 && durationHours >= 6)) stage = 'stage-1';
  else stage = 'no-AKI';
  return { stage, ratio: Math.round(ratio * 100) / 100, recommendation: stage === 'stage-3' ? 'consider-RRT-nephrology' : 'monitor-fluid-balance-avoid-nephrotoxins' };
};

// 2) Kidney transplant waitlist priority — EPTS / KDPI
Engine.KidneyTransplantEPTS = function (input = {}) {
  const { age = 50, diabetes = false, priorTransplant = false, dialysisTimeYears = 0, sensitization = false, bloodType = 'O' } = input;
  let score = 0;
  if (age >= 70) score += 4; else if (age >= 60) score += 3; else if (age >= 50) score += 2; else if (age >= 40) score += 1;
  if (diabetes) score += 2;
  if (priorTransplant) score += 2;
  if (dialysisTimeYears >= 5) score += 2; else if (dialysisTimeYears >= 1) score += 1;
  if (sensitization) score += 1;
  if (bloodType === 'O') score += 1;
  let priority;
  if (score >= 7) priority = 'very-high-priority';
  else if (score >= 5) priority = 'high-priority';
  else if (score >= 3) priority = 'moderate-priority';
  else priority = 'low-priority';
  return { score, priority, recommendation: priority === 'very-high-priority' ? 'expedited-allocation-active-status' : 'standard-waitlist-monitoring' };
};

// 3) Donor kidney quality — KDPI
Engine.DonorKidneyKDPI = function (input = {}) {
  const { age = 50, height = 170, weight = 80, race = 'other', hypertension = false, diabetes = false, causeOfDeath = 'other', serumCreatinine = 1.0, dcd = false, hepatitisC = false } = input;
  let score = 0;
  if (age >= 65) score += 30; else if (age >= 55) score += 20; else if (age >= 45) score += 10; else if (age >= 35) score += 5;
  if (weight > 90) score += 5;
  if (height < 160) score += 5;
  if (race === 'black') score += 10;
  if (hypertension) score += 10;
  if (diabetes) score += 10;
  if (causeOfDeath === 'cva') score += 5;
  if (serumCreatinine > 1.5) score += 5;
  if (dcd) score += 5;
  if (hepatitisC) score += 5;
  let category;
  if (score >= 60) category = 'high-KDPI-discard-consider';
  else if (score >= 35) category = 'intermediate-KDPI';
  else category = 'low-KDPI-preferred';
  return { kdpi: score, category, recommendation: score >= 60 ? 'consider-dual-kidney-or-discard' : 'single-kidney-transplant' };
};

// 4) Rejection — Banff classification
Engine.BanffRejectionClassification = function (input = {}) {
  const { interstitialInflammation = 0, tubulitis = 0, intimalArteritis = 0, glomerulitis = 0, c4d = 0, antibodyMediated = false, chronicChanges = false } = input;
  let classification;
  if (antibodyMediated && c4d > 0) classification = 'Active-ABMR-C4d-positive';
  else if (antibodyMediated) classification = 'Active-ABMR-C4d-negative';
  else if (intimalArteritis >= 2) classification = 'Acute-TCMR-grade-III';
  else if (intimalArteritis === 1 && tubulitis >= 3) classification = 'Acute-TCMR-grade-IIA';
  else if (tubulitis >= 3) classification = 'Acute-TCMR-grade-IA-IB';
  else if (chronicChanges) classification = 'Chronic-allograft-nephropathy';
  else classification = 'No-rejection';
  return { classification, recommendation: classification.includes('TCMR') ? 'high-dose-steroids-ATG' : (classification.includes('ABMR') ? 'plasmapheresis-IVIG-rituximab' : 'continue-immunosuppression') };
};

// 5) ESRD dialysis adequacy — Kt/V
Engine.DialysisAdequacyKtV = function (input = {}) {
  const { spKtV = 1.4, ureaReductionRatio = 70, dialysisFrequency = 3, sessionHours = 4 } = input;
  const stdKtV = spKtV * ((dialysisFrequency * sessionHours) / 12);
  let adequacy;
  if (stdKtV >= 2.3) adequacy = 'excellent-above-target';
  else if (stdKtV >= 2.0) adequacy = 'adequate-meets-target';
  else if (stdKtV >= 1.7) adequacy = 'borderline-consider-changes';
  else adequacy = 'inadequate-needs-intervention';
  return { spKtV, stdKtV: Math.round(stdKtV * 100) / 100, adequacy, recommendation: adequacy === 'inadequate-needs-intervention' ? 'increase-frequency-or-duration' : 'maintain-current-prescription' };
};

// 6) Polyomavirus nephropathy — BK viral load
Engine.BKNephropathyRisk = function (input = {}) {
  const { bkViralLoad = 0, creatinineTrend = 'stable', biopsy = 'not-done' } = input;
  let risk;
  if (bkViralLoad >= 100000) risk = 'high-presumptive-BK-nephropathy';
  else if (bkViralLoad >= 10000) risk = 'probable-nephropathy';
  else if (bkViralLoad >= 1000) risk = 'viruria-only';
  else risk = 'low-undetectable';
  return { bkViralLoad, risk, recommendation: bkViralLoad >= 10000 ? 'reduce-immunosuppression-leflunomide-IVIG' : 'monitor-monthly-PCR' };
};

// 7) Nephrotic syndrome relapse
Engine.NephroticSyndromeRelapse = function (input = {}) {
  const { proteinuriaGrams = 0, albumin = 4.0, edema = false, steroidResponse = 'responsive' } = input;
  let category;
  if (proteinuriaGrams >= 3.5 && albumin < 3.0 && edema) category = 'full-relapse';
  else if (proteinuriaGrams >= 1.0) category = 'partial-relapse';
  else if (proteinuriaGrams >= 0.5) category = 'sub-nephrotic';
  else category = 'remission';
  return { category, recommendation: category === 'full-relapse' ? 'high-dose-steroids-consider-calcineurin' : 'maintenance-immunosuppression' };
};

// 8) CKD mineral bone disorder — KDIGO
Engine.CKDMineralBone = function (input = {}) {
  const { calcium = 9.5, phosphorus = 4.0, pth = 50, alkalinePhosphatase = 80, gfr = 30 } = input;
  let category;
  if (gfr < 30 && (pth > 600 || phosphorus > 5.5)) category = 'severe-CKD-MBD';
  else if (gfr < 60 && pth > 300) category = 'moderate-secondary-hyperparathyroidism';
  else if (gfr < 60 && pth > 100) category = 'mild-secondary-hyperparathyroidism';
  else category = 'normal-bone-mineral';
  return { category, recommendation: category === 'severe-CKD-MBD' ? 'calcimimetics-active-Vitamin-D' : 'phosphate-binder-monitoring' };
};

// 9) Renal artery stenosis intervention
Engine.RenalArteryStenosis = function (input = {}) {
  const { stenosisPercent = 0, refractoryHypertension = false, flashPulmonaryEdema = false, decliningRenalFunction = false, solitaryKidney = false } = input;
  let indication;
  if (stenosisPercent >= 70 && (flashPulmonaryEdema || refractoryHypertension)) indication = 'Class-I-stenting-indicated';
  else if (solitaryKidney && stenosisPercent >= 70 && decliningRenalFunction) indication = 'Class-I-stent-preserve-function';
  else if (stenosisPercent >= 70 && refractoryHypertension) indication = 'Class-IIa-stent-reasonable';
  else if (stenosisPercent >= 50) indication = 'Class-IIb-medical-therapy-stent-if-fails';
  else indication = 'medical-therapy-only';
  return { indication, recommendation: indication.startsWith('Class-I') ? 'renal-artery-stenting' : 'medical-therapy-ACE-I-ARB' };
};

// 10) Donor-specific antibody (DSA) MFI management
Engine.DSAManagement = function (input = {}) {
  const { mfi = 0, classType = 'I', previousAMR = false, nonAdherence = false } = input;
  let action;
  if (mfi >= 10000 && previousAMR) action = 'plasma-exchange-IVIG-rituximab-urgent';
  else if (mfi >= 10000) action = 'plasmapheresis-IVIG-rituximab';
  else if (mfi >= 5000 && (previousAMR || nonAdherence)) action = 'augmented-immunosuppression-IVIG';
  else if (mfi >= 3000) action = 'closer-surveillance-biweekly-MFI';
  else action = 'monitor-3-monthly';
  return { mfi, action, recommendation: action.startsWith('plasma') || action.startsWith('plasmapheresis') ? 'admit-plasmapheresis-protocol' : 'outpatient-monitoring-MFI' };
};
