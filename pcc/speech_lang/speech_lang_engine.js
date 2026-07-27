'use strict';

// Speech-Language-Pathology PCC — 10 pure deterministic functions
// Compliance: ASHA, AAP, NIDCD, WHO-ICF, JCAHO, CMS, NSDA

const Engine = module.exports = {};

// 1) Aphasia type — Boston
Engine.AphasiaTypeAssessment = function (input = {}) {
  const { fluency = 'fluent', comprehension = 'intact', repetition = 'intact', naming = 'intact' } = input;
  let type;
  if (fluency === 'non-fluent' && comprehension === 'intact' && repetition === 'impaired') type = 'Brocas-aphasia';
  else if (fluency === 'fluent' && comprehension === 'impaired' && repetition === 'impaired') type = 'Wernickes-aphasia';
  else if (fluency === 'fluent' && comprehension === 'intact' && repetition === 'impaired') type = 'conduction-aphasia';
  if (fluency === 'non-fluent' && (comprehension === 'impaired' || comprehension === 'absent') && (repetition === 'impaired' || repetition === 'absent') && (naming === 'impaired' || naming === 'absent')) type = 'global-aphasia';
  else if (fluency === 'fluent' && comprehension === 'impaired' && repetition === 'intact') type = 'transcortical-sensory-aphasia';
  else if (fluency === 'non-fluent' && comprehension === 'intact' && repetition === 'intact' && naming === 'impaired') type = 'anomic-aphasia';
  else type = 'mixed-aphasia';
  return { type, recommendation: type === 'global-aphasia' ? 'AAC-immediate-melodic-intonation' : (type.includes('Broca') ? 'constraint-induced-SL' : 'SL-therapy-2x-week') };
};

// 2) Dysarthria
Engine.DysarthriaAssessment = function (input = {}) {
  const { intelligibility = 0.5, rate = 'normal', voice = 'normal', strength = 'normal' } = input;
  let severity, type;
  if (intelligibility >= 0.9) severity = 'no-dysarthria';
  else if (intelligibility >= 0.6) severity = 'mild-dysarthria';
  else if (intelligibility >= 0.3) severity = 'moderate-dysarthria';
  else severity = 'severe-dysarthria';
  if (rate === 'slow' && voice === 'strained') type = 'spastic-dysarthria';
  else if (rate === 'slow' && voice === 'breathy') type = 'flaccid-dysarthria';
  else if (rate === 'variable') type = 'ataxic-dysarthria';
  else if (rate === 'fast' && voice === 'hypernasal') type = 'hyperkinetic-dysarthria';
  else type = 'mixed-dysarthria';
  return { severity, type, recommendation: severity === 'severe-dysarthria' ? 'AAC-device-dysphagia-screen' : 'SL-therapy-Be-HAVOK' };
};

// 3) Dysphagia — FEES
Engine.DysphagiaFEES = function (input = {}) {
  const { penetrationAspiration = 'none', valleculaPooling = 'minimal', pharyngealDelay = 'normal', residue = 'minimal' } = input;
  let severity;
  if (penetrationAspiration === 'silent-aspiration') severity = 'severe-dysphagia-NPO-immediate';
  else if (penetrationAspiration === 'aspiration-with-cough') severity = 'severe-dysphagia-NPO-MBS';
  else if (valleculaPooling === 'severe' || pharyngealDelay === 'severe') severity = 'moderate-severe-dysphagia';
  else if (valleculaPooling === 'moderate' || residue === 'moderate') severity = 'moderate-dysphagia';
  else severity = 'mild-dysphagia';
  return { severity, recommendation: severity.includes('severe') ? 'NPO-IVF-MBS-swallow' : 'texture-modification-SL-therapy' };
};

// 4) Stuttering severity
Engine.StutteringSeverity = function (input = {}) {
  const { percentSyllablesStuttered = 0, secondaryBehaviors = 'absent', duration = 0, age = 20 } = input;
  let severity;
  if (percentSyllablesStuttered >= 20) severity = 'severe-stuttering';
  else if (percentSyllablesStuttered >= 10) severity = 'moderate-stuttering';
  else if (percentSyllablesStuttered >= 5) severity = 'mild-stuttering';
  else severity = 'normal-disfluency';
  if (secondaryBehaviors === 'present' && percentSyllablesStuttered >= 5) severity = 'moderate-severe-stuttering';
  if (age < 6 && duration > 6) severity = 'early-childhood-stuttering-consider-therapy';
  return { severity, recommendation: severity.includes('severe') ? 'fluency-shaping-CWS-Lidcombe' : 'monitoring-and-parent-training' };
};

// 5) Voice disorder GRBAS
Engine.VoiceDisorderGRBAS = function (input = {}) {
  const { grade = 0, roughness = 0, breathiness = 0, asthenia = 0, strain = 0 } = input;
  const total = grade + roughness + breathiness + asthenia + strain;
  let severity;
  if (grade === 3 || total >= 12) severity = 'severe-dysphonia';
  else if (grade === 2 || total >= 8) severity = 'moderate-dysphonia';
  else if (grade === 1 || total >= 4) severity = 'mild-dysphonia';
  else severity = 'normal-voice';
  return { total, severity, recommendation: severity.includes('severe') ? 'ENT-SL-therapy-MRI-larynx' : 'monitoring-SL-eval' };
};

// 6) Aphasia severity (AQ)
Engine.AphasiaSeverityAQ = function (input = {}) {
  const { aqScore = 80 } = input;
  let severity;
  if (aqScore >= 90) severity = 'normal-mild-impairment';
  else if (aqScore >= 70) severity = 'mild-aphasia';
  else if (aqScore >= 50) severity = 'moderate-aphasia';
  else if (aqScore >= 30) severity = 'severe-aphasia';
  else severity = 'profound-global-aphasia';
  return { severity, recommendation: severity.includes('severe') || severity === 'profound-global-aphasia' ? 'intensive-SL-therapy-AAC' : 'SL-therapy-2x-week' };
};

// 7) AAC (Augmentative and Alternative Communication) need
Engine.AACNeed = function (input = {}) {
  const { intelligibleSpeech = 0.5, motorImpairment = 'none', cognitiveAdequate = true, communicationPartner = 'available' } = input;
  let need;
  if (intelligibleSpeech < 0.3 && motorImpairment !== 'none' && cognitiveAdequate) need = 'high-AAC-needed';
  else if (intelligibleSpeech < 0.5 && motorImpairment === 'mild') need = 'moderate-AAC-supplementation';
  else if (motorImpairment === 'severe' && !cognitiveAdequate) need = 'no-AAC-cognitive-too-severe';
  else if (intelligibleSpeech >= 0.5) need = 'no-AAC-needed-natural-speech';
  else need = 'consider-low-tech-AAC';
  return { need, recommendation: need === 'high-AAC-needed' ? 'eye-gaze-tablet-AAC-evaluation' : 'monitoring-SL-eval' };
};

// 8) Child language disorder
Engine.ChildLanguageDisorder = function (input = {}) {
  const { ageMonths = 36, expressiveVocabulary = 100, receptiveVocabulary = 100, milestonesMet = true, hearingNormal = true } = input;
  const expectedExpressive = ageMonths * 0.5;
  let classification;
  if (!hearingNormal) classification = 'rule-out-hearing-loss-first';
  else if (expressiveVocabulary < expectedExpressive * 0.5) classification = 'significant-language-delay';
  else if (expressiveVocabulary < expectedExpressive * 0.8) classification = 'mild-expressive-delay';
  else if (receptiveVocabulary < expectedExpressive * 0.7) classification = 'receptive-delay';
  else if (milestonesMet) classification = 'language-age-appropriate';
  else classification = 'borderline-monitor';
  return { classification, recommendation: classification.includes('delay') ? 'early-intervention-SL-eval' : 'monitoring' };
};

// 9) Dysphagia oral care + cognitive
Engine.DysphagiaOralCareCognitive = function (input = {}) {
  const { mmse = 28, oralHygiene = 'good', cooperation = 'cooperative' } = input;
  let assessment;
  if (mmse < 18) assessment = 'severe-cognitive-impairment-consider-NPO';
  else if (mmse < 24) assessment = 'cognitive-impairment-supervised-oral-intake';
  else if (oralHygiene === 'poor' && cooperation === 'uncooperative') assessment = 'poor-oral-care-aspiration-risk';
  else if (oralHygiene === 'good') assessment = 'cognitively-competent-oral-care-good';
  else assessment = 'mild-risk-oral-care';
  return { assessment, recommendation: assessment === 'severe-cognitive-impairment-consider-NPO' ? 'NPO-consider-PEG-MDT' : 'oral-care-protocol' };
};

// 10) Cognitive-communication disorder
Engine.CognitiveCommunicationDisorder = function (input = {}) {
  const { memory = 'normal', attention = 'normal', executive = 'normal', pragmatics = 'normal' } = input;
  const severityCount = (memory === 'severe-impairment' ? 1 : 0) + (attention === 'severe' ? 1 : 0) + (executive === 'severe' ? 1 : 0) + (pragmatics === 'severe-impairment' ? 1 : 0);
  let severity;
  if (severityCount >= 3) severity = 'severe-cognitive-communication-disorder';
  else if (severityCount >= 2) severity = 'moderate-cognitive-communication-disorder';
  else if (severityCount >= 1) severity = 'mild-cognitive-communication-disorder';
  else severity = 'minimal-deficits';
  return { severity, recommendation: severity.includes('severe') ? 'intensive-SL-cognitive-therapy-2x-week' : 'monitor-SL-eval' };
};
