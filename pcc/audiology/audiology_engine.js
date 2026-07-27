'use strict';

// Audiology PCC — 10 pure deterministic functions
// Compliance: ASHA, AAA, EHDI-JCIH, WHO-PHC, BSA, NHSP, NICE-Hearing

const Engine = module.exports = {};

// 1) Pure-tone audiometry grading (WHO 2018)
Engine.PureToneAudiometry = function (input = {}) {
  const { pta500 = 25, pta1000 = 25, pta2000 = 25, pta4000 = 25, side = 'right' } = input;
  const pta = (pta500 + pta1000 + pta2000 + pta4000) / 4;
  let grade;
  if (pta < 20) grade = 'normal-hearing';
  else if (pta < 35) grade = 'mild-SNHL';
  else if (pta < 50) grade = 'moderate-SNHL';
  else if (pta < 65) grade = 'moderately-severe-SNHL';
  else if (pta < 80) grade = 'severe-SNHL';
  else grade = 'profound-SNHL';
  return { pta: Math.round(pta * 10) / 10, grade, recommendation: grade.startsWith('severe') ? 'hearing-aid-cochlear-implant-eval' : (grade === 'mild-SNHL' ? 'monitor-annual' : 'hearing-aid-eval') };
};

// 2) Asymmetric hearing loss
Engine.AsymmetricHearingLoss = function (input = {}) {
  const { rightEar = 0, leftEar = 0, age = 50, tinnitus = false } = input;
  const difference = Math.abs(rightEar - leftEar);
  let assessment, urgency;
  if (difference >= 30) { assessment = 'asymmetric-30dB-differential-needed'; urgency = 'urgent-MRI-IAC-rule-out-VS'; }
  else if (difference >= 15) { assessment = 'asymmetric-15dB-followup'; urgency = 'MRI-if-sudden-or-progressive'; }
  else assessment = 'symmetric-hearing';
  if (tinnitus && (difference >= 15)) urgency = 'urgent-MRI-rule-out-VS';
  return { difference, assessment, urgency: urgency || 'routine', recommendation: (urgency || '').startsWith('urgent') ? 'MRI-IAC-with-gad-2-week' : 'annual-monitoring' };
};

// 3) Tinnitus severity
Engine.TinnitusSeverity = function (input = {}) {
  const { loudness = 5, distress = 5, durationMonths = 0, hearingLoss = false, laterality = 'bilateral' } = input;
  let category;
  if (loudness >= 8 && distress >= 8) category = 'severe-tinnitus-habituation-needed';
  else if (loudness >= 6 && distress >= 6) category = 'moderate-TTS-restore';
  else if (loudness >= 4 || distress >= 4) category = 'mild-tinnitus';
  else if (durationMonths >= 6) category = 'chronic-tinnitus-monitor';
  else category = 'acute-tinnitus';
  if (laterality === 'unilateral' && durationMonths > 3) category = 'unilateral-rule-out-VS-MRI';
  return { category, recommendation: category.includes('severe') ? 'CBT-Cochlear-implant-tinnitus-CBT-TLC' : (category === 'moderate-TTS-restore' ? 'TRT-sound-therapy-3mo' : 'monitor-counseling') };
};

// 4) ABR threshold/interpretation
Engine.ABRThreshold = function (input = {}) {
  const { latencies = {}, interpeak = 'normal', cochlearVsRetro = 'cochlear', thresholdDB = 30 } = input;
  let interpretation;
  if (interpeak === 'prolonged' || cochlearVsRetro === 'retro-cochlear') interpretation = 'retro-cochlear-mass-rule-out';
  else if (thresholdDB >= 50) interpretation = 'severe-hearing-loss';
  else if (thresholdDB >= 30) interpretation = 'moderate-hearing-loss';
  else if (thresholdDB >= 20) interpretation = 'mild-hearing-loss';
  else interpretation = 'normal-hearing-ABR';
  return { interpretation, recommendation: interpretation === 'retro-cochlear-mass-rule-out' ? 'MRI-IAC-emergent' : 'interpretation-consistent-with-PTA' };
};

// 5) OAE — otoacoustic emissions
Engine.OtoacousticEmissions = function (input = {}) {
  const { snrRatio = 6, age = 1, side = 'right' } = input;
  let result, interpretation;
  if (snrRatio >= 6) { result = 'pass'; interpretation = 'outer-hair-cell-function-normal'; }
  else if (snrRatio >= 3) { result = 'marginal'; interpretation = 're-test-needed'; }
  else { result = 'refer'; interpretation = 'outer-hair-cell-dysfunction-rule-out-hearing-loss'; }
  if (age < 3 && result === 'refer') interpretation = 'newborn-refer-ABR-confirmation-needed';
  return { result, interpretation, recommendation: result === 'pass' ? 'no-action' : (result === 'refer' ? 'ABR-confirmation-immediately' : 're-test-2-weeks') };
};

// 6) Word recognition score
Engine.WordRecognitionScore = function (input = {}) {
  const { wordScore = 50, presentationLevel = 50, masking = false } = input;
  let category;
  if (wordScore >= 80) category = 'excellent-WRS-no-aids';
  else if (wordScore >= 60) category = 'good-aided-candidate';
  else if (wordScore >= 40) category = 'fair-aided-candidate';
  else if (wordScore >= 20) category = 'poor-consider-CI';
  else category = 'very-poor-CI-required';
  return { wordScore, category, recommendation: category.includes('CI') ? 'cochlear-implant-eval' : 'hearing-aid-trial' };
};

// 7) Cochlear implant candidacy
Engine.CochlearImplantCandidate = function (input = {}) {
  const { ptaBilateral = 50, wRS = 50, age = 50, durationDeafness = 5, hearingAidTrial = 'failed' } = input;
  let candidacy;
  if (ptaBilateral >= 80 && wRS <= 50 && age < 80 && durationDeafness < 30 && hearingAidTrial === 'failed') candidacy = 'excellent-candidate-CI';
  else if (ptaBilateral >= 70 && wRS <= 60) candidacy = 'good-candidate-CI';
  else if (ptaBilateral >= 60 && wRS <= 70) candidacy = 'borderline-candidate-CI';
  else candidacy = 'not-CI-candidate';
  return { candidacy, recommendation: candidacy.startsWith('excellent') ? 'CI-eval-CI-surgery' : (candidacy === 'not-CI-candidate' ? 'optimize-hearing-aid' : 'CROS-or-BAHA-consider') };
};

// 8) Hyperacusis severity
Engine.Hyperacusis = function (input = {}) {
  const { loudnessDiscomfortLevel = 100, noiseAvoidance = 'none', durationMonths = 0 } = input;
  let severity;
  if (loudnessDiscomfortLevel < 60 && noiseAvoidance === 'extreme') severity = 'severe-hyperacusis';
  else if (loudnessDiscomfortLevel < 80) severity = 'moderate-hyperacusis';
  else if (noiseAvoidance === 'moderate') severity = 'mild-hyperacusis';
  else if (durationMonths > 6) severity = 'chronic-mild-hyperacusis';
  else severity = 'no-hyperacusis';
  return { severity, recommendation: severity.includes('severe') ? 'sound-desensitization-therapy-counseling' : 'monitor-earplugs' };
};

// 9) Vestibular assessment
Engine.VestibularAssessment = function (input = {}) {
  const { caloricAsymmetry = 0, directionNystagmus = 'horizontal', saccades = 'normal', hittest = 'normal' } = input;
  let localization;
  if (directionNystagmus === 'vertical' || directionNystagmus === 'torsional') localization = 'central-vestibular';
  else if (caloricAsymmetry >= 30) localization = 'unilateral-vestibular-loss';
  else if (caloricAsymmetry >= 20) localization = 'unilateral-vestibular-weakness';
  else if (saccades === 'abnormal') localization = 'central-cerebellar';
  else if (hittest === 'abnormal') localization = 'peripheral-vestibular';
  else localization = 'normal-vestibular';
  return { localization, recommendation: localization === 'central-vestibular' ? 'MRI-brain-audiometry' : (localization === 'unilateral-vestibular-loss' ? 'Epley-maneuver-VRT' : 'monitor') };
};

// 10) Presbycusis progression
Engine.PresbycusisProgression = function (input = {}) {
  const { age = 65, highFrequencyPTA = 30, speechPTA = 20, duration = 5, slope = 'gradual' } = input;
  let severity, intervention;
  if (highFrequencyPTA >= 60) { severity = 'severe-presbycusis'; intervention = 'high-power-BTE-consider-CROS'; }
  else if (highFrequencyPTA >= 40) { severity = 'moderate-presbycusis'; intervention = 'open-fit-BTE-amplification'; }
  else if (highFrequencyPTA >= 25) { severity = 'mild-presbycusis'; intervention = 'monitor-annual-audiogram'; }
  else { severity = 'no-presbycusis'; intervention = 'preventive-counseling'; }
  if (speechPTA >= 40) intervention = 'speech-in-noise-difficulty-amplification-urgent';
  return { severity, intervention, recommendation: intervention };
};
