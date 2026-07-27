'use strict';
// Pain Medicine Engine: 10 pure deterministic functions
// Compliance: WHO, CDC, AAPM, ASRA, IASP, NICE

function WHOLadder({ painScore, currentStep, cancerPain, neuropathic }) {
  let recommendedStep;
  if (painScore <= 3) recommendedStep = 'step-1-non-opioid';
  else if (painScore <= 6) recommendedStep = currentStep === 'step-1-non-opioid' ? 'step-2-weak-opioid' : 'step-2-weak-opioid';
  else if (painScore >= 7) recommendedStep = 'step-3-strong-opioid';
  if (cancerPain && painScore >= 5) recommendedStep = 'step-3-strong-opioid-bypass-step-2';
  if (neuropathic) recommendedStep += '-plus-adjuvant-gabapentin-or-amitriptyline';
  return { painScore, currentStep, recommendedStep };
}

function OpioidRiskTool({ familyHistory, personalHistory, age, psychologicalDisease, alcohol, illegalDrugs, sexualAbuse, depression, ethnicityNonWhite, prescribedOpioidBefore }) {
  let risk = 0;
  if (familyHistory) risk += 3;
  if (personalHistory) risk += 4;
  if (age < 45) risk += 1;
  if (psychologicalDisease) risk += 2;
  if (alcohol) risk += 3;
  if (illegalDrugs) risk += 4;
  if (sexualAbuse) risk += 3;
  if (depression) risk += 1;
  if (ethnicityNonWhite) risk += 1;
  if (prescribedOpioidBefore) risk += 2;
  let category;
  if (risk >= 8) category = 'high-risk';
  else if (risk >= 4) category = 'moderate-risk';
  else category = 'low-risk';
  return { riskScore: risk, category, recommendation: category === 'high-risk' ? 'avoid-or-intensive-monitoring' : category === 'moderate-risk' ? 'cautious-monitoring' : 'standard-monitoring' };
}

function VisualAnalogScale({ vasScore }) {
  let category;
  if (vasScore === 0) category = 'no-pain';
  else if (vasScore <= 3) category = 'mild-pain';
  else if (vasScore <= 6) category = 'moderate-pain';
  else category = 'severe-pain';
  return { vasScore, category, recommendation: category === 'severe-pain' ? 'step-3-or-urgent' : category === 'moderate-pain' ? 'step-2' : 'step-1' };
}

function NeuropathicPainDN4({ burning, painfulCold, electricShocks, tingling, pins, numbness, itching, hypoesthesia, pricking, allodynia }) {
  let score = 0;
  if (burning) score++;
  if (painfulCold) score++;
  if (electricShocks) score++;
  if (tingling) score++;
  if (pins) score++;
  if (numbness) score++;
  if (itching) score++;
  if (hypoesthesia) score++;
  if (pricking) score++;
  if (allodynia) score++;
  const neuropathic = score >= 4;
  return { score, neuropathic, recommendation: neuropathic ? 'gabapentin-or-amitriptyline-or-duloxetine' : 'reassess-diagnosis' };
}

function CDC_MME({ opioid, doseMg, dosesPerDay }) {
  const factors = { morphine: 1, oxycodone: 1.5, hydromorphone: 4, fentanyl: 2.4, methadone: 4, codeine: 0.15, tramadol: 0.2, hydrocodone: 1, buprenorphine: 10 };
  const factor = factors[opioid] || 1;
  const dailyDose = doseMg * dosesPerDay;
  const mme = dailyDose * factor;
  let category;
  if (mme >= 90) category = 'high-dose-90-plus';
  else if (mme >= 50) category = 'caution-50-to-90';
  else category = 'acceptable-below-50';
  return { dailyDose, mme: Math.round(mme), category, recommendation: mme >= 90 ? 'tapering-consider' : mme >= 50 ? 'review-and-monitor' : 'continue' };
}

function PostOpPainManagement({ surgeryType, expectedPainDuration, patientControlledAnalgesia, multimodal, regionalAnesthesia, opioidNaive, comorbidities }) {
  let regimen = 'multimodal-acetaminophen-NSAIDs';
  if (expectedPainDuration > 7) regimen += '-plus-opioid-short-course';
  if (surgeryType === 'major' || surgeryType === 'abdominal' || surgeryType === 'thoracic') regimen += '-with-PCA-or-epidural';
  if (regionalAnesthesia) regimen += '-plus-nerve-block';
  if (!multimodal) regimen = 'consider-adding-acetaminophen-NSAIDs';
  if (comorbidities >= 2) regimen += '-with-renal-or-hepatic-adjustment';
  return { regimen, surgeryType, opioidNaive, recommendation: opioidNaive ? 'start-low-titrate' : 'standard-dose' };
}

function CancerPainAssessment({ painScore, breakthrough, neuropathicComponent, boneMetastases, visceralPain, opioidTolerance }) {
  let regimen = 'step-3-strong-opioid-basal';
  if (breakthrough) regimen += '-with-rescue-dose-10pct-of-total';
  if (neuropathicComponent) regimen += '-plus-adjuvant';
  if (boneMetastases) regimen += '-plus-bisphosphonate-radiotherapy';
  if (visceralPain) regimen += '-plus-antispasmodic';
  if (opioidTolerance) regimen += '-rotation-consider';
  return { regimen, painScore, breakthrough, recommendation: painScore >= 7 ? 'urgent-palliative' : 'titrate' };
}

function FailedBackSurgerySyndrome({ previousSurgeries, durationSinceLastSurgery, adhesions, scarTissue, spinalCordStimulatorCandidate, ongoingMedication, depression, adhesiveArachnoiditis }) {
  let treatment = 'conservative-physical-therapy';
  if (previousSurgeries >= 2) treatment = 'spinal-cord-stimulator-trial';
  if (adhesiveArachnoiditis) treatment = 'neuromodulation-adhesiolysis';
  if (depression) treatment += '-with-psychological-counseling';
  if (spinalCordStimulatorCandidate) treatment = 'spinal-cord-stimulator-referral';
  return { treatment, previousSurgeries, durationSinceLastSurgery };
}

function MigraineSeverity({ headacheDaysPerMonth, severityScore, disability, aura, nausea, photophobia, phonophobia }) {
  let category;
  if (headacheDaysPerMonth >= 15) category = 'chronic-migraine';
  else if (headacheDaysPerMonth >= 4) category = 'episodic-migraine-frequent';
  else category = 'episodic-migraine-infrequent';
  let treatment = 'triptan-NSAID-acute';
  if (category === 'chronic-migraine') treatment = 'CGRP-monoclonal-antibody-preventive';
  else if (headacheDaysPerMonth >= 4) treatment = 'topiramate-or-propranolol-preventive';
  if (aura) treatment += '-with-aura-caution';
  return { category, treatment, severityScore, disability };
}

function FibromyalgiaAssessment({ widespreadPainIndex, symptomSeverity, fatigue, wakingUnrefreshed, cognitiveSymptoms, somaticSymptoms, duration }) {
  const score = widespreadPainIndex + symptomSeverity;
  let category;
  if (score >= 13 && symptomSeverity >= 9) category = 'fibromyalgia-severe';
  else if (score >= 7) category = 'fibromyalgia-moderate';
  else category = 'possible-fibromyalgia';
  let treatment = 'exercise-cognitive-behavioral-therapy';
  if (category === 'fibromyalgia-severe') treatment += '-plus-duloxetine-or-pregabalin';
  else if (category === 'fibromyalgia-moderate') treatment += '-plus-SNRI-or-gabapentinoid';
  return { score, category, treatment, duration };
}

module.exports = {
  WHOLadder, OpioidRiskTool, VisualAnalogScale, NeuropathicPainDN4, CDC_MME,
  PostOpPainManagement, CancerPainAssessment, FailedBackSurgerySyndrome, MigraineSeverity, FibromyalgiaAssessment,
};
