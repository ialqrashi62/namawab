'use strict';

// Sports-Medicine PCC — 10 pure deterministic functions
// Compliance: ACSM, AMSSM, FIFA, IOC, NCAA, NATA, AOSSM

const Engine = module.exports = {};

// 1) Concussion — SCAT5
Engine.ConcussionSCAT5 = function (input = {}) {
  const { symptomsScore = 0, cognitiveScore = 30, balanceScore = 30, saccades = 'normal', vestibular = 'normal', lossOfConsciousness = false, postTraumaticAmnesia = false } = input;
  let risk;
  if (lossOfConsciousness || postTraumaticAmnesia) risk = 'high-risk-concussion';
  else if (symptomsScore >= 30 || vestibular === 'abnormal' || saccades === 'abnormal') risk = 'moderate-risk-concussion';
  else if (symptomsScore >= 10 || cognitiveScore < 25 || balanceScore < 25) risk = 'mild-concussion';
  else risk = 'no-concussion';
  return { risk, recommendation: risk === 'high-risk-concussion' ? 'immediate-removal-CT-head-72h-rest' : (risk === 'moderate-risk-concussion' ? '24h-rest-graduated-return-protocol' : 'monitor-only') };
};

// 2) Return-to-play protocol stage
Engine.ReturnToPlayStage = function (input = {}) {
  const { daysPostConcussion = 0, symptomsResolved = false, exertionTolerance = 'normal', neurocognitiveTest = 'passed', balanceTest = 'passed' } = input;
  let stage;
  if (!symptomsResolved) stage = 0;
  else if (daysPostConcussion < 24) stage = 1;
  else if (daysPostConcussion < 48 || exertionTolerance !== 'normal') stage = 2;
  else if (daysPostConcussion < 96 || neurocognitiveTest !== 'passed') stage = 3;
  else if (daysPostConcussion < 144 || balanceTest !== 'passed') stage = 4;
  else stage = 5;
  return { stage, recommendation: stage === 5 ? 'cleared-for-full-competition' : 'continue-protocol-no-return' };
};

// 3) ACL injury — IKDC grade
Engine.ACLIKDCGrade = function (input = {}) {
  const { lachmanTest = 'firm-endpoint', pivotShift = 'absent', anteriorDrawer = 'negative', functionalScore = 100 } = input;
  let grade;
  if (lachmanTest === 'soft-endpoint' && pivotShift === 'gross') grade = 'grade-C-severe';
  else if (lachmanTest === 'soft-endpoint' || pivotShift === 'clunk') grade = 'grade-C-markedly-abnormal';
  else if (lachmanTest === 'firm-endpoint' && pivotShift === 'glide') grade = 'grade-B-abnormal';
  else if (functionalScore >= 80) grade = 'grade-A-normal';
  else grade = 'grade-B-nearly-normal';
  return { grade, recommendation: grade === 'grade-C-severe' ? 'ACL-reconstruction-referral' : (grade === 'grade-B-abnormal' ? 'PT-bracing-consider-surgery' : 'return-to-sport') };
};

// 4) Heat illness severity
Engine.HeatIllness = function (input = {}) {
  const { coreTemperature = 37, mentalStatus = 'normal', muscleActivity = 'normal', sweating = 'normal', dehydration = 'mild' } = input;
  let category;
  if (coreTemperature >= 40 && mentalStatus === 'altered') category = 'heat-stroke-ICU-emergency';
  else if (coreTemperature >= 38.5 && muscleActivity === 'cramping') category = 'heat-exhaustion-with-cramping';
  else if (coreTemperature >= 38) category = 'heat-exhaustion';
  else if (muscleActivity === 'cramping') category = 'heat-cramps';
  else category = 'heat-edema-or-miliaria';
  return { category, recommendation: category === 'heat-stroke-ICU-emergency' ? 'cold-water-immersion-ICU' : 'oral-hydration-cool-environment' };
};

// 5) Compartment syndrome (exertional)
Engine.ExertionalCompartmentSyndrome = function (input = {}) {
  const { compartmentPressure = 20, durationOfPain = 10, reliefWithRest = true, exertionTrigger = 'running', fascialDefect = false } = input;
  let diagnosis;
  if (compartmentPressure >= 30 && !reliefWithRest) diagnosis = 'acute-compartment-syndrome-emergent-fasciotomy';
  else if (compartmentPressure >= 20 && reliefWithRest) diagnosis = 'chronic-exertional-CECS';
  else if (compartmentPressure >= 15 && durationOfPain > 15) diagnosis = 'suspected-CECS-needs-stress-test';
  else diagnosis = 'no-compartment-syndrome';
  return { diagnosis, recommendation: diagnosis === 'acute-compartment-syndrome-emergent-fasciotomy' ? 'immediate-OR-OR-fasciotomy' : 'gait-analysis-surgery-consult' };
};

// 6) Sudden cardiac death risk — athlete screening
Engine.SuddenCardiacDeathAthlete = function (input = {}) {
  const { familyHistorySCD = false, exertionalChestPain = false, exertionalSyncope = false, ecgAbnormal = false, echocardiogramAbnormal = false } = input;
  let risk;
  if (familyHistorySCD && ecgAbnormal) risk = 'very-high-risk-disqualify';
  else if (echocardiogramAbnormal) risk = 'high-risk-cardiomyopathy';
  else if (exertionalSyncope || ecgAbnormal) risk = 'moderate-risk-cleared-with-restrictions';
  else if (exertionalChestPain) risk = 'low-moderate-risk-stress-test';
  else risk = 'low-risk-cleared';
  return { risk, recommendation: risk === 'very-high-risk-disqualify' ? 'disqualification-from-competition' : 'follow-up-cardiology-3-6-mo' };
};

// 7) Meniscus tear — McMurray
Engine.MeniscusMcMurray = function (input = {}) {
  const { medialClick = false, lateralClick = false, jointLineTenderness = false, locking = false, mriConfirmed = 'not-done' } = input;
  let likelihood;
  if (mriConfirmed === 'positive') likelihood = 'confirmed-tear';
  else if ((medialClick || lateralClick) && locking) likelihood = 'highly-suspected-tear';
  else if ((medialClick || lateralClick) && jointLineTenderness) likelihood = 'suspected-tear';
  else if (jointLineTenderness) likelihood = 'low-likelihood-clinical';
  else likelihood = 'no-tear';
  return { likelihood, recommendation: likelihood === 'confirmed-tear' ? 'arthroscopic-repair-or-meniscectomy' : (likelihood === 'highly-suspected-tear' ? 'MRI-orthopedic-referral' : 'PT-monitoring') };
};

// 8) Hamstring strain grade
Engine.HamstringStrainGrade = function (input = {}) {
  const { ecchymosis = false, defectPalpable = false, lossOfStrength = 'mild', lossOfMotion = 'minimal' } = input;
  let grade;
  if (defectPalpable) grade = 'grade-III-complete-tear';
  else if (ecchymosis && lossOfStrength === 'severe') grade = 'grade-II-partial-tear-extensive';
  else if (lossOfStrength === 'moderate' || lossOfMotion === 'significant') grade = 'grade-II-partial-tear';
  else if (lossOfStrength === 'mild') grade = 'grade-I-strain';
  else grade = 'grade-0-no-strain';
  return { grade, recommendation: grade === 'grade-III-complete-tear' ? 'surgical-repair-3-mo-rehab' : (grade === 'grade-II-partial-tear' ? 'PRP-PT-4-6-week-return' : 'RICE-early-return') };
};

// 9) Tennis elbow — Nirschl stage
Engine.TennisElbowNirschl = function (input = {}) {
  const { painWithADL = false, painWithGrip = false, microtear = false, tendinosis = 'mild' } = input;
  let stage;
  if (microtear) stage = 'stage-VII-microtear-or-rupture';
  else if (tendinosis === 'severe') stage = 'stage-VI-extensive-degeneration';
  else if (tendinosis === 'moderate') stage = 'stage-V-moderate-degeneration';
  else if (painWithGrip && tendinosis === 'mild') stage = 'stage-IV-partial-degeneration';
  else if (painWithADL) stage = 'stage-III-pain-with-ADL';
  else if (painWithGrip) stage = 'stage-II-pain-after-activity';
  else stage = 'stage-I-pain-after-activity';
  return { stage, recommendation: stage === 'stage-VII-microtear-or-rupture' ? 'surgical-debridement' : (stage.includes('IV') || stage.includes('V') || stage.includes('VI') ? 'PRP-tenex-tenotomy' : 'eccentric-exercise-bracing') };
};

// 10) Exercise prescription — FITT
Engine.ExercisePrescriptionFITT = function (input = {}) {
  const { goal = 'general-fitness', baselineFitness = 'low', age = 40, comorbidity = 'none' } = input;
  let frequency, intensity, time, type;
  if (goal === 'weight-loss') { frequency = '5-7-days/week'; intensity = 'moderate-to-vigorous'; time = '45-60-min'; type = 'aerobic+resistance'; }
  else if (goal === 'cardiac-rehab') { frequency = '3-5-days/week'; intensity = 'moderate-RPE-12-14'; time = '30-45-min'; type = 'aerobic-supervised'; }
  else if (goal === 'rehab-post-injury') { frequency = 'daily'; intensity = 'low-to-moderate'; time = '20-30-min'; type = 'specific-PT-protocol'; }
  else if (goal === 'strength') { frequency = '3-days/week'; intensity = 'high-70-85-1RM'; time = '30-45-min'; type = 'resistance-progressive'; }
  else { frequency = '3-5-days/week'; intensity = 'moderate-RPE-11-13'; time = '30-min'; type = 'mixed-aerobic-resistance'; }
  if (age >= 65) intensity = 'low-to-moderate';
  if (comorbidity === 'cardiac') frequency = '3-days-supervised';
  return { frequency, intensity, time, type, recommendation: `${frequency}, ${intensity}, ${time}, ${type}` };
};
