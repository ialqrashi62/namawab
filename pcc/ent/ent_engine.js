'use strict';
// ENT Engine: 10 pure deterministic functions
// Compliance: AAO-HNS, ENT UK, NICE ENT, Clinical Otolaryngology, American Academy Audiology

function CentorScore({ tonsillarExudate, tenderAnteriorCervicalLymphadenopathy, fever, absenceOfCough, age }) {
  let score = 0;
  if (tonsillarExudate) score += 1;
  if (tenderAnteriorCervicalLymphadenopathy) score += 1;
  if (fever) score += 1;
  if (absenceOfCough) score += 1;
  if (age >= 3 && age <= 14) score += 1;
  if (age >= 15 && age <= 44) score += 0;
  if (age >= 45) score -= 1;
  let risk;
  if (score >= 4) risk = 'high-50%-strep';
  else if (score === 3) risk = 'moderate-30%-strep';
  else if (score === 2) risk = 'low-15%-strep';
  else if (score === 1) risk = 'very-low-7%-strep';
  else risk = 'minimal-3%-strep';
  let recommendation;
  if (score >= 3) recommendation = 'rapid-strep-test-or-empiric-abx';
  else recommendation = 'no-strep-test-no-abx';
  return { score, risk, recommendation };
}

function HearingLossGrading({ ptaDbLaterality }) {
  let grade;
  if (ptaDbLaterality <= 25) grade = 'normal-hearing';
  else if (ptaDbLaterality <= 40) grade = 'mild-hearing-loss';
  else if (ptaDbLaterality <= 55) grade = 'moderate-hearing-loss';
  else if (ptaDbLaterality <= 70) grade = 'moderately-severe';
  else if (ptaDbLaterality <= 90) grade = 'severe-hearing-loss';
  else grade = 'profound-hearing-loss';
  return { ptaDbLaterality, grade, intervention: ptaDbLaterality >= 40 ? 'hearing-aid-candidate' : 'monitor' };
}

function TinnitusImpact({ tfiScore, durationMonths, bilateral, pulsatile, hearingLoss }) {
  let category;
  if (tfiScore >= 60) category = 'catastrophic';
  else if (tfiScore >= 40) category = 'severe';
  else if (tfiScore >= 20) category = 'moderate';
  else category = 'mild';
  const redFlags = (pulsatile ? 1 : 0) + (hearingLoss ? 1 : 0);
  return { tfiScore, category, durationMonths, bilateral, redFlags, urgentReferral: pulsatile, recommendation: redFlags > 0 ? 'urgent-audiology-ENT' : 'CBT-tinnitus-retraining' };
}

function VertigoDiagnosis({ hINTS, spontaneousNystagmus, headImpulse, skewDeviation, hearingLoss, vertigoDuration, positional }) {
  let diagnosis;
  if (hINTS === 'central') diagnosis = 'central-vertigo-stroke';
  else if (hINTS === 'peripheral' && positional === 'yes') diagnosis = 'BPPV';
  else if (hINTS === 'peripheral' && headImpulse === 'abnormal') diagnosis = 'vestibular-neuritis';
  else if (hearingLoss) diagnosis = 'Meniere-disease';
  else diagnosis = 'undetermined-vertigo';
  const severity = hINTS === 'central' ? 'emergency' : diagnosis === 'BPPV' ? 'benign' : 'moderate';
  return { diagnosis, severity, hINTS, recommendation: severity === 'emergency' ? 'stroke-workup-MRI' : diagnosis === 'BPPV' ? 'Epley-maneuver' : 'vestibular-suppressants' };
}

function EpistaxisSeverity({ estimatedBloodLossMl, hbDrop, vitalSigns, posteriorSource, anticoagulation }) {
  let severity;
  if (hbDrop >= 2 || vitalSigns === 'shock' || estimatedBloodLossMl >= 1000) severity = 'severe';
  else if (posteriorSource || estimatedBloodLossMl >= 500) severity = 'moderate';
  else severity = 'mild';
  let treatment;
  if (severity === 'severe') treatment = 'posterior-pack-embolization-OR';
  else if (severity === 'moderate') treatment = 'anterior-pack+monitor+reverse-anti-coagulation';
  else treatment = 'pinch+topical-vasoconstrictor';
  return { severity, treatment, posteriorSource, anticoagulation };
}

function LaryngomalaciaSeverity({ feedingDifficulties, stridor, sleepApnea, cyanosis, failureToThrive, ageMonths }) {
  let severity;
  if (cyanosis || failureToThrive) severity = 'severe';
  else if (stridor === 'constant' || sleepApnea === 'severe') severity = 'moderate-severe';
  else if (stridor === 'mild' || feedingDifficulties === 'mild') severity = 'mild';
  else severity = 'minimal';
  let treatment;
  if (severity === 'severe') treatment = 'supraglottoplasty';
  else if (severity === 'moderate-severe') treatment = 'observation-consider-surgery';
  else treatment = 'observation-reassure';
  return { severity, treatment, ageMonths };
}

function TracheostomyDecannulation({ age, weightKg, swallowingSafe, aspirationRisk, vocalCordFunction, daysSinceTracheostomy }) {
  let readiness = 0;
  if (swallowingSafe) readiness += 2;
  if (aspirationRisk === 'low') readiness += 2;
  if (vocalCordFunction === 'normal') readiness += 2;
  if (daysSinceTracheostomy >= 14) readiness += 1;
  if (age >= 12) readiness += 1;
  if (weightKg >= 10) readiness += 1;
  let decision;
  if (readiness >= 7) decision = 'decannulation-appropriate';
  else if (readiness >= 4) decision = 'cap-trial-then-decannulate';
  else decision = 'continue-tracheostomy';
  return { readiness, decision, age, weightKg };
}

function SinusitisComplications({ proptosis, visionChanges, severeHeadache, fever, meningismus, immunocompromised, ageMonths }) {
  let complications = [];
  if (proptosis) complications.push('orbital-cellulitis-erysipelas');
  if (visionChanges) complications.push('orbital-abscess');
  if (severeHeadache) complications.push('intracranial-extension');
  if (meningismus) complications.push('meningitis');
  if (fever && immunocompromised) complications.push('fungal-sinusitis');
  let severity;
  if (complications.length > 0) severity = 'complicated';
  else severity = 'uncomplicated';
  return { complications, severity, treatment: severity === 'complicated' ? 'urgent-CT-MRI-IV-antibiotics' : 'amoxicillin-clavulanate-7d' };
}

function SuddenHearingLoss({ onset, hearingLossDb, vertigo, tinnitus, priorHistory, audiogramShape }) {
  let diagnosis = 'idiopathic-SSNHL';
  if (priorHistory === 'recurrent') diagnosis = 'possible-MSD';
  if (audiogramShape === 'low-frequency') diagnosis = 'possible-endolymphatic-hydrops';
  const severity = hearingLossDb >= 70 ? 'severe-SSNHL' : hearingLossDb >= 40 ? 'moderate-SSNHL' : 'mild-SSNHL';
  return { diagnosis, severity, onset, hearingLossDb, urgentTreatment: severity !== 'mild-SSNHL' };
}

function HeadNeckCancerStaging({ tumorSite, sizeCm, nodalStatus, metastasis, hpv, depth }) {
  let t = sizeCm < 2 ? 'T1' : sizeCm < 4 ? 'T2' : sizeCm < 6 ? 'T3' : 'T4';
  let n = nodalStatus === 'N0' ? 'N0' : nodalStatus === 'N1' ? 'N1' : 'N2';
  let m = metastasis === 'M0' ? 'M0' : 'M1';
  let stageGroup;
  if (m === 'M1') stageGroup = 'IVC';
  else if (t === 'T4' || n === 'N2') stageGroup = 'IVA';
  else if (t === 'T3' || n === 'N1') stageGroup = 'III';
  else if (t === 'T2') stageGroup = 'II';
  else if (t === 'T1') stageGroup = 'I';
  let prognosis;
  if (stageGroup === 'I' || stageGroup === 'II') prognosis = 'good-80%+';
  else if (stageGroup === 'III') prognosis = 'moderate-50-70%';
  else prognosis = 'poor-30%';
  return { tnm: `T${t.charAt(1)}-${n}-${m}`, stageGroup, prognosis, hpv, depth };
}

module.exports = {
  CentorScore, HearingLossGrading, TinnitusImpact, VertigoDiagnosis, EpistaxisSeverity,
  LaryngomalaciaSeverity, TracheostomyDecannulation, SinusitisComplications, SuddenHearingLoss, HeadNeckCancerStaging,
};
