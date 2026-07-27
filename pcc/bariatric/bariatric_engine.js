'use strict';
// Bariatric Medicine Engine: 10 pure deterministic functions
// Compliance: ASMBS, IFSO, NIH, AHA, NHLBI, ADA

function BMICategory({ weightKg, heightCm }) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category;
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else if (bmi < 35) category = 'obesity-class-I';
  else if (bmi < 40) category = 'obesity-class-II';
  else category = 'obesity-class-III';
  return { bmi: Math.round(bmi * 10) / 10, category };
}

function BariatricEligibility({ bmi, comorbidities, age, priorAttempt, psychiatricClearance, medicalClearance, pregnancy, substanceUse }) {
  let eligible = false;
  const reasons = [];
  if (bmi >= 40) eligible = true;
  else if (bmi >= 35 && comorbidities) eligible = true;
  if (age < 18 || age > 65) { eligible = false; reasons.push('age-out-of-range'); }
  if (!priorAttempt) { eligible = false; reasons.push('no-prior-weight-loss-attempt'); }
  if (!psychiatricClearance) { eligible = false; reasons.push('psychiatric-clearance-required'); }
  if (!medicalClearance) { eligible = false; reasons.push('medical-clearance-required'); }
  if (pregnancy) { eligible = false; reasons.push('pregnancy-contraindication'); }
  if (substanceUse) { eligible = false; reasons.push('substance-use-disorder'); }
  return { eligible, reasons, bmi };
}

function ProcedureChoice({ bmi, t2dm, gerd, ibs, sweetEating, anatomy, priorSurgery, age, patientPreference }) {
  let primary;
  if (bmi < 35) primary = 'endoscopic-sleeve-orballoon';
  else if (t2dm && bmi >= 35) primary = 'roux-en-y-bypass-better-DM-remission';
  else if (gerd) primary = 'roux-en-y-bypass-better-GERD-control';
  else if (sweetEating) primary = 'sleeve-gastrectomy-better-than-bypass';
  else primary = 'sleeve-gastrectomy';
  if (priorSurgery) primary = 'revision-bariatric-surgery';
  if (age >= 70) primary = 'sleeve-gastrectomy-safer-than-bypass';
  return { recommendation: primary, anatomy, patientPreference };
}

function WeightLossProgress({ startWeightKg, currentWeightKg, weeksPostOp, expectedPercent }) {
  const totalLoss = startWeightKg - currentWeightKg;
  const percentLoss = (totalLoss / startWeightKg) * 100;
  const expectedAtWeek = expectedPercent;
  let status;
  if (percentLoss >= expectedAtWeek * 1.1) status = 'excellent-progress';
  else if (percentLoss >= expectedAtWeek * 0.9) status = 'on-track';
  else if (percentLoss >= expectedAtWeek * 0.7) status = 'below-expected';
  else status = 'poor-progress-evaluate';
  return { weightLossKg: totalLoss, percentLoss: Math.round(percentLoss * 10) / 10, status, weeksPostOp };
}

function ComorbidityResolution({ baselineComorbidities, monthsPostOp, percentExcessWeightLoss, t2dmStatus, hypertensionStatus, hyperlipidemiaStatus, sleepApneaStatus }) {
  const resolved = [];
  if (t2dmStatus === 'remission' && percentExcessWeightLoss >= 50) resolved.push('T2DM');
  if (hypertensionStatus === 'remission' && percentExcessWeightLoss >= 50) resolved.push('hypertension');
  if (hyperlipidemiaStatus === 'improved' && percentExcessWeightLoss >= 50) resolved.push('hyperlipidemia');
  if (sleepApneaStatus === 'resolved' && percentExcessWeightLoss >= 50) resolved.push('OSA');
  return { resolved, monthsPostOp, percentExcessWeightLoss };
}

function NutritionalDeficiency({ monthsPostOp, procedure, supplementation, vitaminB12, iron, vitaminD, calcium, proteinIntake, paresthesiaSymptoms }) {
  let risk = 0;
  if (procedure === 'roux-en-y-bypass') risk += 3;
  if (monthsPostOp > 6 && !supplementation) risk += 3;
  if (vitaminB12 < 200) risk += 2;
  if (iron < 30) risk += 2;
  if (vitaminD < 30) risk += 1;
  if (calcium < 8.5) risk += 1;
  if (proteinIntake < 60) risk += 2;
  if (paresthesiaSymptoms) risk += 2;
  let severity;
  if (risk >= 8) severity = 'severe-deficiency';
  else if (risk >= 5) severity = 'moderate-deficiency';
  else if (risk >= 3) severity = 'mild-deficiency';
  else severity = 'no-deficiency';
  return { riskScore: risk, severity, monthsPostOp, procedure, recommendation: severity === 'severe-deficiency' ? 'IV-replacement-urgent' : 'oral-supplementation-adjust' };
}

function DumpingSyndrome({ procedure, rapidEating, highSugar, palpitations, diarrhea, sweating, dizziness, timeAfterMeal }) {
  if (procedure !== 'roux-en-y-bypass' && procedure !== 'sleeve-gastrectomy') {
    return { syndrome: 'not-applicable', procedure, recommendation: 'monitor' };
  }
  let score = 0;
  if (rapidEating) score++;
  if (highSugar) score += 2;
  if (palpitations) score++;
  if (diarrhea) score++;
  if (sweating) score++;
  if (dizziness) score++;
  let category;
  if (score >= 4) category = 'severe-dumping';
  else if (score >= 2) category = 'moderate-dumping';
  else if (score >= 1) category = 'mild-dumping';
  else category = 'no-dumping';
  let treatment;
  if (category === 'severe-dumping') treatment = 'acarbose-octreotide-dietitian';
  else if (category === 'moderate-dumping') treatment = 'low-simple-sugar-small-meals';
  else treatment = 'monitor-dietary-advice';
  return { syndrome: 'dumping', score, category, treatment };
}

function PostOpComplications({ procedure, daysPostOp, leak, stenosis, marginalUlcer, internalHernia, vomiting, abdominalPain, tachycardia, fever }) {
  let alert = 'routine-followup';
  if (daysPostOp <= 7 && (tachycardia || fever)) alert = 'urgent-leak-evaluation';
  else if (daysPostOp <= 30 && (vomiting || abdominalPain)) alert = 'urgent-stenosis-or-obstruction';
  else if (leak || stenosis || marginalUlcer) alert = 'urgent-endoscopy';
  if (internalHernia) alert = 'urgent-CT-surgical-consult';
  return { alert, procedure, daysPostOp, recommendation: alert === 'routine-followup' ? 'continue-monitoring' : 'urgent-evaluation' };
}

function SurgicalRisk({ age, bmi, asa, priorSurgery, comorbidities, diabetes, smoking, functionalCapacity }) {
  let risk = 0;
  if (age >= 60) risk += 1;
  if (bmi >= 50) risk += 2;
  if (asa >= 3) risk += 2;
  if (priorSurgery) risk += 1;
  if (comorbidities >= 3) risk += 2;
  if (diabetes) risk += 1;
  if (smoking) risk += 2;
  if (functionalCapacity === 'poor') risk += 2;
  let category;
  if (risk >= 8) category = 'high-risk';
  else if (risk >= 5) category = 'moderate-risk';
  else if (risk >= 3) category = 'low-moderate-risk';
  else category = 'low-risk';
  return { riskScore: risk, category, recommendation: category === 'high-risk' ? 'intensive-preop-optimization' : 'standard-preop' };
}

function PediatricObesity({ age, bmi, familyHistory, comorbidities, tannerStage, parentalObesity, bmiPercentile }) {
  const percentile = bmiPercentile !== undefined ? bmiPercentile : (bmi >= 28 ? 95 : bmi >= 24 ? 85 : 50);
  let category;
  if (percentile >= 95) category = 'obese-95th-percentile';
  else if (percentile >= 85) category = 'overweight-85th-percentile';
  else category = 'normal-weight';
  let treatment;
  if (category === 'normal-weight') treatment = 'lifestyle-prevention';
  else if (tannerStage >= 4 && percentile >= 99 && comorbidities) treatment = 'consider-bariatric-surgery';
  else if (category === 'obese-95th-percentile') treatment = 'intensive-family-based-intervention';
  else treatment = 'lifestyle-counseling';
  return { bmi, percentile, category, treatment, tannerStage };
}

module.exports = {
  BMICategory, BariatricEligibility, ProcedureChoice, WeightLossProgress, ComorbidityResolution,
  NutritionalDeficiency, DumpingSyndrome, PostOpComplications, SurgicalRisk, PediatricObesity,
};
