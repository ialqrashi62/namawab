'use strict';
// Transplant Extended Engine: 10 pure deterministic functions
// Compliance: UNOS/OPTN, Banff, ISHLT, KDIGO, AASLD, ELTR

function HeartAllocationStatus({ inotropeDose, ecmo, mechCirculatorySupport, vad, refractoryArrhythmia, hybridStatus, onVentilator, age }) {
  let status;
  if (ecmo) status = 'Status-1A';
  else if (vad) status = 'Status-1A';
  else if (mechCirculatorySupport === 'total-artificial-heart') status = 'Status-1A';
  else if (refractoryArrhythmia) status = 'Status-1A';
  else if (inotropeDose >= 7) status = 'Status-2';
  else if (inotropeDose >= 3) status = 'Status-3';
  else if (mechCirculatorySupport) status = 'Status-3';
  else if (hybridStatus) status = 'Status-4';
  else if (onVentilator) status = 'Status-4';
  else status = 'Status-6';
  return { status, recommendation: status === 'Status-1A' ? 'urgent-transplant-list' : 'continue-monitoring' };
}

function LungAllocationScore({ diagnosis, age, fev1, fvc, dlco, sixMinuteWalkDistance, oxygenRequirement, mechanicalVentilation, pco2, pulmonaryArterySystolic }) {
  let diagnosisScore = 10;
  if (diagnosis === 'IPF') diagnosisScore = 30;
  else if (diagnosis === 'CF') diagnosisScore = 25;
  else if (diagnosis === 'COPD') diagnosisScore = 15;
  else if (diagnosis === 'PAH') diagnosisScore = 35;
  let functionalScore = 0;
  if (fev1 && fev1 < 30) functionalScore += 20;
  if (fvc && fvc < 50) functionalScore += 10;
  if (dlco && dlco < 30) functionalScore += 20;
  if (sixMinuteWalkDistance < 200) functionalScore += 15;
  if (oxygenRequirement > 4) functionalScore += 20;
  else if (oxygenRequirement > 0) functionalScore += 10;
  if (mechanicalVentilation) functionalScore += 30;
  if (pco2 > 50) functionalScore += 10;
  if (pulmonaryArterySystolic > 50) functionalScore += 15;
  const las = diagnosisScore + functionalScore + 50;
  return { lasScore: Math.max(0, Math.min(100, las)), recommendation: las >= 70 ? 'high-priority-list' : 'monitor-LAS-quarterly' };
}

function LiverMELDAllocation({ meldNa, meldException, status1A, acuteLiverFailure, cholangiocarcinoma, hepatocellularCarcinoma, hepatoblastoma, primaryOxaluria, ureaCycle, tyrosinemia, map }) {
  let allocation;
  if (status1A) allocation = 'Status-1A-urgent';
  else if (acuteLiverFailure) allocation = 'Status-1-acute-liver-failure';
  else if (meldException) allocation = `Exception-MELD-${meldException}`;
  else if (hepatocellularCarcinoma) allocation = 'MELD-exception-HCC-stage-T2';
  else if (meldNa >= 40) allocation = 'MELD-40+';
  else if (meldNa >= 30) allocation = 'MELD-30-39';
  else if (meldNa >= 20) allocation = 'MELD-20-29';
  else if (meldNa >= 15) allocation = 'MELD-15-19';
  else if (meldNa >= 10) allocation = 'MELD-10-14';
  else allocation = 'MELD-below-10';
  return { allocation, meldNa };
}

function KidneyAllocationKDPI({ donorAge, donorHeight, donorWeight, donorHypertension, donorDiabetes, donorCreatinine, donorCVA, donorHCV, donorHepatitisB, donorDCD, donorAfricanAmerican }) {
  let risk = 0;
  if (donorAge >= 60) risk += 30;
  else if (donorAge >= 50) risk += 20;
  else if (donorAge >= 40) risk += 10;
  if (donorHypertension) risk += 15;
  if (donorDiabetes) risk += 15;
  if (donorCreatinine > 1.5) risk += 10;
  if (donorCVA) risk += 5;
  if (donorHCV) risk += 5;
  if (donorDCD) risk += 5;
  if (donorAfricanAmerican) risk += 5;
  if (donorHepatitisB) risk += 5;
  let kdpi;
  if (risk >= 80) kdpi = 'KDPI-greater-than-85-discarded-discussed';
  else if (risk >= 60) kdpi = 'KDPI-60-85-suboptimal';
  else if (risk >= 35) kdpi = 'KDPI-35-60-acceptable';
  else kdpi = 'KDPI-less-than-35-excellent';
  return { kdpi, recommendation: kdpi === 'KDPI-greater-than-85-discarded-discussed' ? 'consider-discarding-or-dual-kidney' : 'acceptable-for-transplant' };
}

function BanffRejection({ tScore, iScore, vScore, gScore, ptcScore, c4d, dsaPositive, timePostTransplant, donorSpecificAntibody }) {
  let histology = 'no-rejection';
  if (tScore >= 2 && iScore >= 2) histology = 'acute-cellular-rejection-IA';
  if (tScore >= 3) histology = 'acute-cellular-rejection-IIA';
  if (vScore >= 1) histology = 'acute-cellular-rejection-III-vascular';
  let antibodyMediated = 'no-AMR';
  if ((gScore >= 1 || ptcScore >= 1) && (c4d > 0 || dsaPositive || donorSpecificAntibody)) antibodyMediated = 'AMR-suspected';
  if ((gScore >= 2 || ptcScore >= 2) && c4d >= 2) antibodyMediated = 'AMR-definite';
  let treatment;
  if (histology === 'acute-cellular-rejection-III-vascular' || antibodyMediated === 'AMR-definite') treatment = 'pulse-steroids-thymoglobulin-IVIG-plasmapheresis-rituximab';
  else if (histology === 'acute-cellular-rejection-IIA' || antibodyMediated === 'AMR-suspected') treatment = 'pulse-steroids-thymoglobulin-or-IVIG';
  else if (histology === 'acute-cellular-rejection-IA') treatment = 'pulse-steroids-500mg-methylpred-3days';
  else treatment = 'continue-immunosuppression-monitoring';
  return { histology, antibodyMediated, treatment };
}

function ISHLTRejection({ isrL, isrR, isrE, biopsyGrade, acuteCellular, humoral, donorSpecificAntibody, timePostTransplant, hemodynamicCompromise }) {
  let acuteCellularGrade = 'no-rejection';
  if (isrL === 1 || isrR === 1) acuteCellularGrade = '1R-mild';
  if (isrL >= 2 || isrR >= 2) acuteCellularGrade = '2R-moderate';
  if (isrL >= 3 || isrR >= 3) acuteCellularGrade = '3R-severe';
  let humoralGrade = 'pAMR-0-no-AMR';
  if (humoral === 'positive' && donorSpecificAntibody) humoralGrade = 'pAMR-1-suspected';
  if (humoral === 'strong' && donorSpecificAntibody) humoralGrade = 'pAMR-2-definite';
  if (biopsyGrade === 3) humoralGrade = 'pAMR-3-severe';
  let treatment;
  if (acuteCellularGrade === '3R-severe' || humoralGrade === 'pAMR-3-severe') treatment = 'pulse-steroids-thymoglobulin-IVIG-plasmapheresis-rituximab';
  else if (acuteCellularGrade === '2R-moderate' || humoralGrade === 'pAMR-2-definite') treatment = 'pulse-steroids-consider-thymoglobulin';
  else if (acuteCellularGrade === '1R-mild' || humoralGrade === 'pAMR-1-suspected') treatment = 'increase-steroids-500mg-methylpred';
  else treatment = 'continue-immunosuppression-monitoring';
  if (hemodynamicCompromise) treatment = 'ICU-inotropes-mech-support';
  return { acuteCellularGrade, humoralGrade, treatment };
}

function TacrolimusTDM({ troughLevel, timePostTransplant, age, indication, onCYP3A4Inhibitor, onCYP3A4Inducer, kidneyFunction }) {
  let category;
  if (troughLevel < 5) category = 'subtherapeutic-rejection-risk';
  else if (troughLevel > 15) category = 'toxic-nephrotoxic-neurotoxic';
  else category = 'therapeutic';
  let adjustment = 'no-change';
  if (troughLevel < 5) adjustment = 'increase-dose-25pct-recheck';
  else if (troughLevel > 15) adjustment = 'decrease-dose-25pct-recheck';
  if (onCYP3A4Inhibitor) adjustment = 'reduce-dose-or-switch';
  if (onCYP3A4Inducer) adjustment = 'increase-dose';
  let target;
  if (timePostTransplant < 3) target = '10-15-ng-ml';
  else if (timePostTransplant < 12) target = '8-12-ng-ml';
  else target = '5-10-ng-ml';
  return { troughLevel, category, adjustment, target };
}

function PostTransplantInfection({ daysPostTransplant, fever, source, organism, prophylaxis, immunosuppressionLevel, recentRejectionTreatment, vaccination, contactExposure }) {
  let risk;
  if (daysPostTransplant < 30) risk = 'early-postop-bacterial-nosocomial';
  else if (daysPostTransplant < 180) risk = 'opportunistic-CMV-PJP-fungal';
  else if (daysPostTransplant < 365 && recentRejectionTreatment) risk = 'high-immunosuppression-opportunistic';
  else risk = 'community-acquired';
  let workup;
  if (risk === 'opportunistic-CMV-PJP-fungal') workup = 'CMV-PCR-PJP-urine-Ag-galactomannan-CXR';
  else if (risk === 'early-postop-bacterial-nosocomial') workup = 'blood-urine-wound-culture-imaging';
  else if (risk === 'high-immunosuppression-opportunistic') workup = 'broad-OPAT-CMV-PJP-fungal-bacterial-viral';
  else workup = 'community-pathogens-RSV-flu-strep';
  return { risk, workup, recommendation: fever ? 'admit-broad-coverage' : 'outpatient-targeted' };
}

function DonorRiskIndex({ age, causeOfDeath, hlaMismatch, coldIschemiaTime, donorAfro, donorHypertension, donorDiabetes, donorCreatinine, donorBMI, donorHCV, donationAfterCirculatoryDeath, organType }) {
  let risk = 0;
  if (age >= 60) risk += 25;
  else if (age >= 50) risk += 15;
  if (causeOfDeath === 'CVA') risk += 10;
  if (hlaMismatch >= 4) risk += 10;
  if (coldIschemiaTime >= 24) risk += 10;
  if (donorAfro) risk += 5;
  if (donorHypertension) risk += 10;
  if (donorDiabetes) risk += 10;
  if (donorCreatinine > 1.5) risk += 5;
  if (donorBMI >= 30) risk += 5;
  if (donorHCV) risk += 10;
  if (donationAfterCirculatoryDeath) risk += 10;
  let classification;
  if (risk >= 50) classification = 'extended-criteria-discard-discuss';
  else if (risk >= 25) classification = 'expanded-criteria';
  else classification = 'standard-criteria';
  return { riskScore: risk, classification };
}

function TransplantEligibility({ age, bmi, comorbidities, lifeExpectancy, compliance, psychiatric, substanceUse, malignancy, infection, cardiacEF, pulmonaryFunction, malignancyFreeInterval, onImmunosuppression }) {
  let contraindication = false;
  const reasons = [];
  if (age >= 80) { contraindication = true; reasons.push('age-too-old'); }
  if (bmi >= 40) { contraindication = true; reasons.push('bmi-too-high'); }
  if (comorbidities >= 4) { contraindication = true; reasons.push('multiple-comorbidities'); }
  if (substanceUse) { contraindication = true; reasons.push('substance-use'); }
  if (psychiatric && psychiatric === 'uncontrolled') { contraindication = true; reasons.push('uncontrolled-psychiatric'); }
  if (infection === 'active') { contraindication = true; reasons.push('active-infection'); }
  if (malignancy && malignancyFreeInterval < 2) { contraindication = true; reasons.push('recent-malignancy'); }
  if (cardiacEF < 25) { contraindication = true; reasons.push('cardiac-EF-too-low'); }
  let priority = 'standard';
  if (malignancy === 'cancer-cured') priority = 'acceptable-after-cure';
  if (compliance === 'good') priority = 'good-compliance-priority';
  return { contraindication, reasons, priority, recommendation: contraindication ? 'not-eligible' : 'eligible-list' };
}

module.exports = {
  HeartAllocationStatus, LungAllocationScore, LiverMELDAllocation, KidneyAllocationKDPI, BanffRejection,
  ISHLTRejection, TacrolimusTDM, PostTransplantInfection, DonorRiskIndex, TransplantEligibility,
};
