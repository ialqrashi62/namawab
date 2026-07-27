'use strict';

// Neuropsychology PCC — 10 pure deterministic functions
// Compliance: APA-Division-40, NINDS, EAN, NIA-AA, DSM-5, ICD-11, INS

const Engine = module.exports = {};

// 1) MoCA — Montreal Cognitive Assessment
Engine.MoCAScore = function (input = {}) {
  const { totalScore = 30, educationYears = 12, age = 65 } = input;
  let correctedScore = totalScore;
  if (educationYears <= 12) correctedScore += 1;
  let classification;
  if (correctedScore >= 26) classification = 'normal-cognition';
  else if (correctedScore >= 19) classification = 'mild-cognitive-impairment';
  else if (correctedScore >= 11) classification = 'moderate-cognitive-impairment';
  else classification = 'severe-cognitive-impairment';
  return { correctedScore, classification, recommendation: classification === 'normal-cognition' ? 'no-action-needed' : (classification === 'mild-cognitive-impairment' ? 'followup-1y-neuropsych-battery' : 'dementia-workup-neurology') };
};

// 2) MMSE — Folstein Mini-Mental State
Engine.MMSEFolstein = function (input = {}) {
  const { orientation = 10, registration = 3, attention = 5, recall = 3, language = 8, visuospatial = 1 } = input;
  const total = orientation + registration + attention + recall + language + visuospatial;
  let classification;
  if (total >= 27) classification = 'normal';
  else if (total >= 21) classification = 'mild-cognitive-impairment';
  else if (total >= 10) classification = 'moderate-cognitive-impairment';
  else classification = 'severe-cognitive-impairment';
  return { total, classification, recommendation: classification === 'normal' ? 'no-action' : 'follow-up-neuropsych' };
};

// 3) ACE-III Addenbrooke's Cognitive Examination
Engine.ACE3Addenbrokes = function (input = {}) {
  const { attention = 18, memory = 26, fluency = 14, language = 26, visuospatial = 16 } = input;
  const total = attention + memory + fluency + language + visuospatial;
  let cutoff100, recommendation;
  if (total >= 88) cutoff100 = 'above-cutoff-88-no-dementia';
  else if (total >= 78) cutoff100 = 'below-cutoff-88-suggestive-of-dementia';
  else if (total >= 60) cutoff100 = 'moderate-cognitive-impairment';
  else cutoff100 = 'severe-cognitive-impairment';
  recommendation = cutoff100 === 'above-cutoff-88-no-dementia' ? 'no-action-needed' : 'dementia-workup-MRI-csf-neuropsych';
  return { total, cutoff100, recommendation };
};

// 4) Beck Depression Inventory (BDI-II)
Engine.BeckDepressionInventory = function (input = {}) {
  const { score = 0, suicidalIdeation = false } = input;
  let severity;
  if (score >= 30) severity = 'severe-depression';
  else if (score >= 19) severity = 'moderate-depression';
  else if (score >= 14) severity = 'moderate-mild-depression';
  else if (score >= 10) severity = 'mild-depression';
  else if (score >= 0) severity = 'minimal-depression';
  return { severity, recommendation: suicidalIdeation ? 'urgent-psychiatric-emergency' : (severity === 'severe-depression' ? 'medication-management-ECT-consider' : 'psychotherapy-SSRI-consider') };
};

// 5) Hamilton Anxiety Rating Scale (HAM-A)
Engine.HamiltonAnxietyScale = function (input = {}) {
  const { score = 0 } = input;
  let severity;
  if (score >= 25) severity = 'severe-anxiety';
  else if (score >= 18) severity = 'moderate-anxiety';
  else if (score >= 8) severity = 'mild-anxiety';
  else severity = 'no-anxiety';
  return { severity, recommendation: severity === 'severe-anxiety' ? 'SSRI-SNRI-CBT-intensive' : (severity === 'moderate-anxiety' ? 'SSRI-CBT-consider' : 'monitoring-CBT-consider') };
};

// 6) Trail Making Test A
Engine.TrailMakingTestA = function (input = {}) {
  const { time = 30, errors = 0, age = 50, education = 12 } = input;
  const expected = 30;
  const deviation = time - expected;
  let interpretation;
  if (deviation <= 10) interpretation = 'normal-processing-speed';
  else if (deviation <= 30) interpretation = 'mild-impairment';
  else if (deviation <= 60) interpretation = 'moderate-impairment';
  else interpretation = 'severe-impairment-processing-speed';
  if (errors >= 4) interpretation = 'severe-impairment-with-errors';
  return { interpretation, recommendation: interpretation.includes('severe') ? 'frontal-subcortical-workup' : 'monitoring' };
};

// 7) Trail Making Test B
Engine.TrailMakingTestB = function (input = {}) {
  const { time = 75, errors = 0, age = 60 } = input;
  const expected = 75;
  const deviation = time - expected;
  let interpretation;
  if (deviation <= 15) interpretation = 'normal-set-shifting';
  else if (deviation <= 45) interpretation = 'mild-impairment-set-shifting';
  else if (deviation <= 90) interpretation = 'moderate-impairment-set-shifting';
  else interpretation = 'severely-impaired-set-shifting';
  if (errors >= 4) interpretation = 'severely-impaired-set-shifting-with-errors';
  return { interpretation, recommendation: interpretation.includes('severe') ? 'frontal-executive-workup' : 'monitoring' };
};

// 8) Confusion Assessment Method (CAM) — ICU delirium
Engine.ConfusionAssessmentMethod = function (input = {}) {
  const { acuteOnset = false, inattention = false, disorganizedThinking = false, alteredLevel = false } = input;
  const positive = (acuteOnset ? 1 : 0) + (inattention ? 1 : 0) + (disorganizedThinking ? 1 : 0) + (alteredLevel ? 1 : 0);
  let diagnosis;
  if (positive >= 4) diagnosis = 'delirium-CAM-positive-severe';
  else if (positive >= 3) diagnosis = 'delirium-CAM-positive';
  else if (positive >= 1) diagnosis = 'subclinical-suspect';
  else diagnosis = 'no-delirium';
  return { positiveCount: positive, diagnosis, recommendation: diagnosis === 'delirium-CAM-positive' ? 'antipsychotic-reorient-environmental' : 'monitor' };
};

// 9) Frontal Assessment Battery (FAB)
Engine.FABFrontal = function (input = {}) {
  const { conceptualization = 3, mentalFlexibility = 3, motorProgramming = 3, sensitivityInterference = 3, inhibitoryControl = 3, environmentalAutonomy = 3 } = input;
  const total = conceptualization + mentalFlexibility + motorProgramming + sensitivityInterference + inhibitoryControl + environmentalAutonomy;
  let interpretation;
  if (total >= 16) interpretation = 'normal-frontal-function';
  else if (total >= 12) interpretation = 'mild-frontal-dysfunction';
  else if (total >= 8) interpretation = 'moderate-frontal-dysfunction';
  else interpretation = 'severe-frontal-dysfunction';
  return { total, interpretation, recommendation: interpretation.includes('severe') ? 'frontal-lobe-workup-MRI-DTI' : 'monitor' };
};

// 10) WAIS-style FSIQ estimate
Engine.WAISFSIQEstimate = function (input = {}) {
  const { verbalComprehension = 100, perceptualReasoning = 100, workingMemory = 100, processingSpeed = 100 } = input;
  const fsiq = Math.round((verbalComprehension + perceptualReasoning + workingMemory + processingSpeed) / 4);
  let classification;
  if (fsiq >= 130) classification = 'very-superior';
  else if (fsiq >= 120) classification = 'superior';
  else if (fsiq >= 110) classification = 'high-average';
  else if (fsiq >= 90) classification = 'average';
  else if (fsiq >= 80) classification = 'low-average';
  else if (fsiq >= 71) classification = 'borderline';
  else classification = 'intellectual-disability';
  return { fsiq, classification, recommendation: classification === 'intellectual-disability' ? 'comprehensive-ID-eval-adaptive-support' : 'rehabilitation-monitoring' };
};
