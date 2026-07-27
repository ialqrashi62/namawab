'use strict';
// Urology Engine: 10 pure deterministic functions
// Compliance: AUA, EAU, SUO, NCCN, ASCO

function IPSSScore({ incompleteEmptying, frequency, intermittency, urgency, weakStream, straining, nocturia, qualityOfLife }) {
  const total = incompleteEmptying + frequency + intermittency + urgency + weakStream + straining + nocturia;
  let severity;
  if (total >= 20) severity = 'severe';
  else if (total >= 8) severity = 'moderate';
  else if (total >= 1) severity = 'mild';
  else severity = 'none';
  return { score: total, severity, qualityOfLife, recommendation: severity === 'severe' ? 'surgical-TURP-or-laser' : severity === 'moderate' ? 'medical-5-alpha-reductase' : 'watchful-waiting' };
}

function AUASSeverity({ score }) {
  let severity;
  if (score >= 20) severity = 'severe';
  else if (score >= 8) severity = 'moderate';
  else if (score >= 1) severity = 'mild';
  else severity = 'none';
  return { aua: score, severity, recommendation: severity === 'severe' ? 'consider-surgery' : severity === 'moderate' ? 'alpha-blocker-5-ARI' : 'monitor' };
}

function StoneSizeRisk({ stoneSizeMm, location, hydronephrosis, infection, priorStones, bmi, familyHistory }) {
  let risk = 0;
  if (stoneSizeMm >= 10) risk += 3; else if (stoneSizeMm >= 5) risk += 1;
  if (location === 'ureteral') risk += 2;
  if (hydronephrosis) risk += 2;
  if (infection) risk += 3;
  if (priorStones) risk += 1;
  if (bmi >= 30) risk += 1;
  if (familyHistory) risk += 1;
  let intervention;
  if (infection || hydronephrosis) intervention = 'urgent-urology-ureteroscopy-or-stent';
  else if (stoneSizeMm >= 10) intervention = 'ESWL-or-ureteroscopy';
  else if (stoneSizeMm >= 5) intervention = 'ESWL-or-conservative';
  else intervention = 'conservative-stone-pass';
  return { riskScore: risk, intervention, stoneSizeMm, location };
}

function ProstateCancerRisk({ psa, age, familyHistory, priorBiopsy, dre, mpMriPiRads }) {
  let risk = 0;
  if (psa > 10) risk += 3; else if (psa > 4) risk += 1;
  if (age >= 70) risk += 1;
  if (familyHistory) risk += 2;
  if (priorBiopsy) risk += 1;
  if (dre === 'abnormal') risk += 2;
  if (mpMriPiRads === 'PI-RADS-4' || mpMriPiRads === 'PI-RADS-5') risk += 3;
  else if (mpMriPiRads === 'PI-RADS-3') risk += 1;
  let category;
  if (risk >= 5) category = 'high-risk-need-biopsy';
  else if (risk >= 3) category = 'intermediate-risk-mpMRI';
  else category = 'low-risk-monitor';
  return { riskScore: risk, category, recommendation: category === 'high-risk-need-biopsy' ? 'mpMRI-then-biopsy' : category === 'intermediate-risk-mpMRI' ? 'mpMRI' : 'PSA-monitoring-annual' };
}

function RenalMassStaging({ tumorSizeCm, location, histology, vascularInvasion, metastasis }) {
  let t = tumorSizeCm < 4 ? 'T1a' : tumorSizeCm < 7 ? 'T1b' : tumorSizeCm < 10 ? 'T2a' : 'T2b';
  if (vascularInvasion) t = 'T3';
  if (metastasis) t = 'T4';
  const stage = metastasis ? 'stage-IV' : vascularInvasion ? 'stage-III' : tumorSizeCm >= 7 ? 'stage-II' : 'stage-I';
  return { tnm: t, stage, histology, recommendation: stage === 'stage-I' ? 'partial-nephrectomy' : stage === 'stage-II' ? 'radical-nephrectomy' : 'systemic-therapy' };
}

function HematuriaWorkup({ gross, microscopic, rbcsHpf, age, smoking, priorUrothelialCancer, anticoagulation, infectionPresent }) {
  let recommendation;
  if (gross && !infectionPresent) recommendation = 'urgent-cystoscopy-CT-urography';
  else if (age >= 35 && smoking && (gross || rbcsHpf >= 25)) recommendation = 'cystoscopy-CT-urography';
  else if (rbcsHpf >= 25) recommendation = 'cystoscopy';
  else recommendation = 'monitor-repeat-UA';
  return { recommendation, gross, microscopic, rbcsHpf, age };
}

function EDAssessment({ iiefScore, etiology, age, diabetes, cardiovascular, medications, responseToPDE5i }) {
  let severity;
  if (iiefScore >= 22) severity = 'no-ED';
  else if (iiefScore >= 17) severity = 'mild-ED';
  else if (iiefScore >= 11) severity = 'moderate-ED';
  else if (iiefScore >= 6) severity = 'moderate-severe-ED';
  else severity = 'severe-ED';
  let treatment;
  if (severity === 'no-ED') treatment = 'no-treatment';
  else if (severity === 'mild-ED') treatment = 'lifestyle-psychotherapy';
  else if (responseToPDE5i === 'good') treatment = 'continue-PDE5i';
  else if (severity === 'severe-ED') treatment = 'consider-injection-or-implant';
  else treatment = 'PDE5i-vacuum-constriction';
  return { severity, treatment, etiology, recommendation: diabetes || cardiovascular ? 'cardiovascular-workup' : 'standard' };
}

function IncontinenceSeverity({ padsPerDay, leakageVolume, urgeSymptoms, stressSymptoms, pelvicFloorStrength, postProstatectomy }) {
  let severity;
  if (padsPerDay >= 6) severity = 'severe';
  else if (padsPerDay >= 3) severity = 'moderate';
  else if (padsPerDay >= 1) severity = 'mild';
  else severity = 'minimal';
  let treatment;
  if (severity === 'severe') treatment = 'artificial-sphincter-or-sling';
  else if (severity === 'moderate') treatment = 'mid-urethral-sling-Botox';
  else if (severity === 'mild') treatment = 'pelvic-floor-physical-therapy';
  else treatment = 'lifestyle';
  return { severity, treatment, padsPerDay, postProstatectomy };
}

function TesticularMassWorkup({ massSizeCm, age, tumorMarkers, ultrasoundFindings, familyHistory }) {
  let classification;
  if (age < 40 && tumorMarkers && tumorMarkers.afpElevated) classification = 'non-seminoma-suspect';
  else if (ultrasoundFindings === 'solid') classification = 'malignancy-suspect';
  else if (ultrasoundFindings === 'cystic') classification = 'likely-benign';
  else classification = 'indeterminate';
  let plan;
  if (classification === 'malignancy-suspect' || classification === 'non-seminoma-suspect') plan = 'radical-inguinal-orchiectomy';
  else if (classification === 'likely-benign') plan = 'monitor-3mo-US';
  else plan = 'repeat-US-3mo';
  return { classification, plan, familyHistory };
}

function CatheterAssociatedUTI({ fever, leukocytosis, pyuria, bacteriuria, priorAntibiotics, catheterDuration, pregnant }) {
  let diagnosis = 'CAUTI-suspected';
  if (!fever && !leukocytosis) diagnosis = 'asymptomatic-bacteriuria-no-treatment';
  if (pregnant) return { diagnosis: 'pregnant-UTI-treat', recommendation: 'safe-antibiotic' };
  let treatment;
  if (fever || leukocytosis) treatment = 'remove-catheter-antibiotics';
  else treatment = 'consider-catheter-removal-only';
  return { diagnosis, treatment, catheterDuration, priorAntibiotics };
}

module.exports = {
  IPSSScore, AUASSeverity, StoneSizeRisk, ProstateCancerRisk, RenalMassStaging,
  HematuriaWorkup, EDAssessment, IncontinenceSeverity, TesticularMassWorkup, CatheterAssociatedUTI,
};
