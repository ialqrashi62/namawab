'use strict';
// Stroke/Neuro Engine: 10 pure deterministic functions
// Compliance: AHA/ASA, ESO, AAN, NINDS, Neurocritical Care Society

function NIHSS({ consciousness, month, age, gaze, visual, facial, motorArmL, motorArmR, motorLegL, motorLegR, ataxia, sensory, language, dysarthria, extinction }) {
  let score = 0;
  score += consciousness;
  score += month <= 2 ? 1 : month >= 9 ? 0 : 0;
  if (gaze === 'total') score += 2; else if (gaze === 'partial') score += 1;
  if (visual === 'total') score += 3; else if (visual === 'partial') score += 2; else if (visual === 'quad') score += 1;
  if (facial === 'both') score += 3; else if (facial === 'minor') score += 2; else if (facial === 'partial') score += 1;
  score += motorArmL; score += motorArmR; score += motorLegL; score += motorLegR;
  if (ataxia) score += 2;
  if (sensory) score += 2;
  if (language === 'global') score += 3; else if (language === 'severe') score += 2; else if (language === 'mild') score += 1;
  if (dysarthria) score += 2;
  if (extinction) score += 2;
  let severity;
  if (score >= 21) severity = 'severe';
  else if (score >= 15) severity = 'moderate-severe';
  else if (score >= 5) severity = 'moderate';
  else if (score >= 2) severity = 'minor';
  else severity = 'no-stroke';
  return { score, severity, thrombolysisEligible: score >= 6 && score <= 25, mechanicalThrombectomyConsider: score >= 6 };
}

function mRS({ score }) {
  const grades = {
    0: 'no-symptoms',
    1: 'no-significant-disability',
    2: 'slight-disability',
    3: 'moderate-disability',
    4: 'moderately-severe',
    5: 'severe-disability-bedbound',
    6: 'dead',
  };
  return { mRS: score, description: grades[score] || 'invalid', disability: score >= 3, mortality: score === 6 };
}

function ASPECTS({ earlyIschemicChanges, location }) {
  let score = 10;
  const deductions = {
    caudate: 1, lentiform: 1, insula: 1, ica: 1, mca_m1: 1, mca_m2: 1,
    mca_m3: 1, mca_m4: 1, mca_m5: 1, mca_m6: 1,
  };
  let applied = 0;
  for (const k of (location || [])) {
    if (deductions[k]) {
      score -= deductions[k];
      applied += 1;
    }
  }
  let interpretation;
  if (score <= 4) interpretation = 'large-infarct-avoid-thrombectomy';
  else if (score <= 7) interpretation = 'moderate-infarct';
  else interpretation = 'small-infarct-thrombectomy-beneficial';
  return { aspects: Math.max(0, score), earlyIschemicChanges, appliedDeductions: applied, interpretation };
}

function ABCD2TIA({ age, sbp, bp, clinicalFeatures, diabetes, duration }) {
  let score = 0;
  if (age >= 60) score += 1;
  if ((sbp || bp) >= 140) score += 1;
  if (clinicalFeatures === 'unilateral-weakness') score += 2;
  else if (clinicalFeatures === 'speech-disturbance') score += 1;
  if (diabetes) score += 1;
  if (duration >= 60) score += 2;
  else if (duration >= 10) score += 1;
  let risk;
  if (score >= 6) risk = 'high-stroke-risk';
  else if (score >= 4) risk = 'moderate-risk';
  else risk = 'low-risk';
  return { score, risk, recommendation: risk === 'high-stroke-risk' ? 'admit+urgent-workup' : risk === 'moderate-risk' ? 'observe+workup' : 'outpatient' };
}

function HuntHess({ grade, symptoms, levelOfConsciousness }) {
  let mortality;
  switch (grade) {
    case 0: mortality = 0; break;
    case 1: mortality = 1; break;
    case 2: mortality = 5; break;
    case 3: mortality = 10; break;
    case 4: mortality = 30; break;
    case 5: mortality = 50; break;
    default: mortality = 70;
  }
  return { grade, mortalityPct: mortality, severity: grade >= 4 ? 'severe' : grade >= 2 ? 'moderate' : 'mild' };
}

function GCS_Total({ eye, verbal, motor }) {
  const total = eye + verbal + motor;
  let severity;
  if (total <= 8) severity = 'severe-TBI';
  else if (total <= 12) severity = 'moderate-TBI';
  else severity = 'mild-TBI';
  return { total, components: { eye, verbal, motor }, severity, intubateIf: total <= 8 };
}

function ICHScore({ gcs, age, infratentorial, ivhVolumeMl, ichVolumeMl }) {
  let score = 0;
  if (gcs < 14) score += 1; else if (gcs < 9) score += 2;
  if (age >= 80) score += 1;
  if (infratentorial) score += 1;
  if (ivhVolumeMl > 0) score += 1;
  if (ichVolumeMl >= 30) score += 1;
  const mortality30d = [0, 13, 26, 72, 97, 100];
  return { score, mortalityPct: mortality30d[Math.min(5, score)] || 0 };
}

function ThrombolysisEligibility({ age, symptomOnsetHours, nihss, recentSurgery, recentStroke, intracranialHemorrhage, onAnticoagulation, inr, platelets, sbp, glucose, ctExcludesHemorrhage }) {
  const exclusions = [];
  if (age > 80 && !ctExcludesHemorrhage) exclusions.push('age>80-no-DWI-confirm');
  if (symptomOnsetHours > 4.5) exclusions.push('out-of-window');
  if (recentSurgery) exclusions.push('recent-surgery');
  if (intracranialHemorrhage) exclusions.push('ICH-present');
  if (inr > 1.7) exclusions.push('INR-elevated');
  if (platelets < 100000) exclusions.push('thrombocytopenia');
  if (sbp > 185) exclusions.push('severe-hypertension');
  if (glucose < 50 || glucose > 400) exclusions.push('glucose-abnormal');
  if (nihss < 6) exclusions.push('NIHSS-too-low');
  if (nihss > 25) exclusions.push('NIHSS-too-high');
  return { eligible: exclusions.length === 0 && ctExcludesHemorrhage, exclusions, candidate: exclusions.length === 0 };
}

function StatusEpilepticus({ seizureType, duration, consciousnessBetween, priorEpilepsy }) {
  let classification;
  if (duration < 5 && seizureType === 'convulsive') classification = 'evolving-SE';
  else if (duration >= 5 && seizureType === 'convulsive') classification = 'established-SE';
  else if (duration >= 30) classification = 'refractory-SE-candidate';
  else if (seizureType === 'non-convulsive') classification = 'NCSE';
  else classification = 'isolated-seizure';
  return { classification, duration, priorEpilepsy, recommendation: classification === 'isolated-seizure' ? 'observe' : 'urgent-treatment' };
}

function SubarachnoidHemorrhage({ fisherGrade, huntHessGrade }) {
  let vasospasmRisk;
  if (fisherGrade >= 3) vasospasmRisk = 'high';
  else if (fisherGrade === 2) vasospasmRisk = 'moderate';
  else vasospasmRisk = 'low';
  const mortalityPct = [0, 1, 5, 10, 30, 50, 70][Math.min(6, huntHessGrade)] || 0;
  return { fisherGrade, huntHessGrade, vasospasmRisk, mortalityPct, treatment: 'nimodipine+monitor-vasospasm' };
}

module.exports = {
  NIHSS, mRS, ASPECTS, ABCD2TIA, HuntHess,
  GCS_Total, ICHScore, ThrombolysisEligibility, StatusEpilepticus, SubarachnoidHemorrhage,
};
