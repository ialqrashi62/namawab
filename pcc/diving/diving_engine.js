// P3-AU: Diving-Medicine Engine — 10 pure functions
const Engine = {};

Engine.DCSAssessment = function ({ depth = 30, time = 20, ascent = 'normal', symptoms = 'none' } = {}) {
  let severity;
  if (ascent === 'rapid' && symptoms.includes('joint-pain')) severity = 'DCS-Type-I-mild-joint-pain';
  else if (ascent === 'rapid' && symptoms.includes('neurologic')) severity = 'DCS-Type-II-severe-neurologic-emergent-hyperbaric';
  else if (ascent === 'rapid' && depth > 30) severity = 'DCS-probable-hyperbaric-recompression';
  else if (symptoms.includes('cerebral') || symptoms.includes('spinal')) severity = 'DCS-neurologic-emergent';
  else if (symptoms.includes('cutaneous')) severity = 'DCS-cutaneous-skin-bends';
  else if (ascent === 'normal' && depth > 30) severity = 'low-risk-DCS-monitor';
  else severity = 'no-DCS';
  return { severity, recommendation: severity.includes('hyperbaric') || severity.includes('emergent') ? 'recompression-and-O2' : 'monitor' };
};

Engine.ArterialGasEmbolism = function ({ ascent = 'normal', symptoms = 'none', timeToSymptoms = 0 } = {}) {
  let diagnosis;
  if (ascent === 'rapid' && timeToSymptoms < 10) diagnosis = 'AGE-immediate-hyperbaric-treatment';
  else if (ascent === 'rapid' && symptoms.includes('neurologic')) diagnosis = 'AGE-presumed-hyperbaric';
  else if (symptoms.includes('cerebral')) diagnosis = 'AGE-cerebral-emergent';
  else if (symptoms.includes('cardiac')) diagnosis = 'AGE-coronary-arrhythmia';
  else diagnosis = 'no-AGE';
  return { diagnosis, recommendation: diagnosis.includes('AGE') || diagnosis.includes('hyperbaric') ? 'hyperbaric-immediately-and-100-percent-O2' : 'monitor' };
};

Engine.NitrogenNarcosis = function ({ depth = 30, cognitiveSymptoms = false, timeAtDepth = 20 } = {}) {
  let severity;
  if (depth >= 60) severity = 'severe-narcosis-300-feet-rapture-of-the-deep';
  else if (depth >= 40) severity = 'moderate-narcosis-130-feet';
  else if (depth >= 30 && cognitiveSymptoms) severity = 'mild-narcosis-martinique';
  else if (depth >= 30) severity = 'mild-narcosis-rising';
  else severity = 'no-narcosis';
  return { severity, recommendation: severity.includes('severe') || severity.includes('moderate') ? 'ascend-immediately' : 'monitor' };
};

Engine.OxygenToxicity = function ({ ppo2 = 0.5, duration = 60, symptoms = 'none' } = {}) {
  let risk;
  if (ppo2 >= 1.6 && symptoms.includes('seizure')) risk = 'CNS-O2-toxicity-seizure-emergent-ascend';
  else if (ppo2 >= 1.4) risk = 'CNS-O2-toxicity-imminent-ascend';
  else if (ppo2 >= 1.0 && duration >= 720) risk = 'pulmonary-O2-toxicity-limit-exposure';
  else if (ppo2 >= 0.8) risk = 'mild-O2-exposure-watch';
  else risk = 'no-O2-toxicity';
  return { risk, recommendation: risk.includes('seizure') || risk.includes('imminent') ? 'ascend-and-air-break' : 'monitor' };
};

Engine.DiveComputerProfile = function ({ depth = 30, time = 20, surfaceInterval = 0, repetitiveDive = false } = {}) {
  let profile;
  const noStopLimit = depth === 30 ? 20 : (depth === 40 ? 10 : (depth === 60 ? 5 : 0));
  if (time > noStopLimit) profile = 'deco-stop-required-USN-Table';
  else if (repetitiveDive && surfaceInterval < 60) profile = 'repetitive-dive-residual-nitrogen';
  else if (repetitiveDive) profile = 'repetitive-dive-standard';
  else profile = 'no-stop-dive';
  return { profile, recommendation: profile.includes('deco') ? 'decompression-stop-and-slow-ascent' : 'standard-ascent-30-feet-per-min' };
};

Engine.DiveMedicalFitness = function ({ condition = 'none', age = 35, bmi = 25, smoker = false } = {}) {
  let fitness;
  if (condition === 'asthma-active' || condition === 'pneumothorax-history') fitness = 'disqualifying-condition';
  else if (condition === 'asthma-controlled') fitness = 'controlled-acceptable';
  else if (condition === 'diabetes-on-insulin') fitness = 'diabetes-caution';
  else if (age >= 60) fitness = 'age-over-60-cardiac-clearance';
  else if (smoker && bmi >= 30) fitness = 'lifestyle-risk-factors';
  else fitness = 'fit-to-dive';
  return { fitness, recommendation: fitness.includes('disqualifying') ? 'do-not-dive' : fitness.includes('fit') ? 'cleared' : 'clear-with-caution' };
};

Engine.Barotrauma = function ({ descent = 'normal', equalization = 'good', symptoms = 'none' } = {}) {
  let injury;
  if (descent === 'rapid' && !equalization) injury = 'middle-ear-barotrauma';
  else if (descent === 'rapid' && symptoms.includes('sinus-pain')) injury = 'sinus-barotrauma';
  else if (descent === 'rapid' && symptoms.includes('vertigo')) injury = 'alternobaric-vertigo';
  else if (symptoms.includes('lung-injury') || symptoms.includes('hemoptysis')) injury = 'pulmonary-barotrauma-and-AGE-risk';
  else if (symptoms.includes('teeth-pain')) injury = 'dental-barotrauma';
  else injury = 'no-barotrauma';
  return { injury, recommendation: injury.includes('pulmonary') ? 'emergent-CT-and-hyperbaric' : injury.includes('middle-ear') ? 'decongestant-and-ear-drops' : 'monitor' };
};

Engine.GasMixture = function ({ oxygen = 21, helium = 0, nitrogen = 79, depth = 30 } = {}) {
  let mixture;
  const ppo2 = (oxygen / 100) * ((depth / 33) + 1);
  if (depth > 40 && helium > 0) mixture = 'trimix-helium-and-nitrogen';
  else if (depth > 40) mixture = 'nitrox-shallower-or-trimix';
  else if (oxygen > 32) mixture = 'enriched-nitrogen-nitrox';
  else mixture = 'standard-air';
  return { mixture, ppo2: Math.round(ppo2 * 100) / 100, recommendation: ppo2 > 1.4 ? 'high-ppo2-reduce-FO2' : 'standard' };
};

Engine.SurfaceSupport = function ({ emergency = false, responseTime = 30, oxygenAvailable = true, recompressionOnSite = false } = {}) {
  let support;
  if (emergency && responseTime > 60) support = 'no-emergency-response-unsafe';
  else if (emergency && !oxygenAvailable) support = 'missing-O2-unsafe-diving';
  else if (!recompressionOnSite && emergency) support = 'dive-without-on-site-recompression-caution';
  else if (oxygenAvailable && recompressionOnSite) support = 'optimal-dive-support';
  else support = 'standard-support';
  return { support, recommendation: support.includes('unsafe') ? 'do-not-dive' : support.includes('optimal') ? 'safe-to-dive' : 'monitor' };
};

Engine.DivingInjuryLongTerm = function ({ exposures = 50, depthMax = 30, decompressionSickness = false, pulmonaryFibrosis = false, hearingLoss = false } = {}) {
  let outcome;
  if (decompressionSickness && exposures > 100) outcome = 'DCI-with-residual-impairment';
  else if (pulmonaryFibrosis) outcome = 'pulmonary-fibrosis-from-O2-toxicity';
  else if (hearingLoss) outcome = 'hearing-loss-from-barotrauma';
  else if (depthMax > 60) outcome = 'long-term-narcosis-effects-monitor';
  else if (exposures > 100) outcome = 'long-term-diving-cumulative';
  else outcome = 'no-long-term-injury';
  return { outcome, recommendation: outcome.includes('DCI') || outcome.includes('fibrosis') ? 'specialist-followup' : 'monitor' };
};

module.exports = Engine;
