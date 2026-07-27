// P3-BB: Frailty Engine — 10 pure functions
const Engine = {};

Engine.FrailtyIndex = function ({ unintentionalWeightLoss = 'no', exhaustion = 'no', weakness = 'no', slowness = 'no', lowActivity = 'no' } = {}) {
  const count = [unintentionalWeightLoss, exhaustion, weakness, slowness, lowActivity].filter(x => x === 'yes').length;
  let classification;
  if (count >= 4) classification = 'frail-3-or-more-of-5';
  else if (count >= 2) classification = 'pre-frail-1-or-2';
  else if (count >= 1) classification = 'pre-frail-1-or-2';
  else classification = 'robust-not-frail';
  return { count, classification, recommendation: 'comprehensive-geriatric-eval-and-multidomain-intervention' };
};

Engine.ClinicalFrailtyScale = function ({ cfsScore = 4, comorbidities = 3 } = {}) {
  let classification;
  if (cfsScore >= 7) classification = 'severely-frail-to-terminally-ill';
  else if (cfsScore === 6) classification = 'moderately-frail';
  else if (cfsScore === 5) classification = 'mildly-frail';
  else if (cfsScore === 4) classification = 'very-mildly-frail-or-pre-frail';
  else if (cfsScore === 3) classification = 'managing-well';
  else if (cfsScore <= 2) classification = 'well-to-very-fit';
  else classification = 'unspecified';
  return { classification, recommendation: `${classification}-CGA-and-care-planning` };
};

Engine.FriedFrailty = function ({ weightLoss = 0, exhaustion = 'no', activity = 'active', walkTime = 8, gripStrength = 30 } = {}) {
  let count = 0;
  if (weightLoss >= 4.5) count++;
  if (exhaustion === 'yes') count++;
  if (activity === 'sedentary') count++;
  if (walkTime >= 7) count++;
  if (gripStrength < 20) count++;
  let result;
  if (count >= 3) result = 'frail-by-Fried';
  else if (count >= 1) result = 'pre-frail-by-Fried';
  else result = 'robust-by-Fried';
  return { count, result, recommendation: 'multidomain-frailty-intervention' };
};

Engine.Sarcopenia = function ({ muscleMass = 'low', gripStrength = 18, gaitSpeed = 0.8, age = 75 } = {}) {
  let diagnosis;
  if (gripStrength < 16 && gaitSpeed < 0.8) diagnosis = 'severe-sarcopenia';
  else if (muscleMass === 'low' && gaitSpeed < 0.8) diagnosis = 'sarcopenia-by-EWGSOP2';
  else if (gripStrength < 27 && age >= 70) diagnosis = 'probable-sarcopenia';
  else if (gaitSpeed < 0.8) diagnosis = 'slow-gait-speed-eval';
  else diagnosis = 'no-sarcopenia-monitor';
  return { diagnosis, recommendation: 'resistance-exercise-and-protein' };
};

Engine.NutritionInFrail = function ({ albumin = 3.0, bmi = 19, intake = 'poor', weightLossPct = 8 } = {}) {
  let plan;
  if (albumin < 2.5 || weightLossPct >= 10) plan = 'severe-malnutrition-ONS-and-dietitian';
  else if (bmi < 18.5 && intake === 'poor') plan = 'underweight-and-poor-intake';
  else if (albumin < 3.5 && weightLossPct >= 5) plan = 'mild-malnutrition-ONS';
  else if (bmi < 22) plan = 'at-risk-for-malnutrition';
  else plan = 'monitor-and-screen';
  return { plan, recommendation: 'dietitian-and-protein-1.2-to-1.5-g-kg' };
};

Engine.FrailtyTrajectory = function ({ baselineCfs = 3, currentCfs = 5, monthsElapsed = 12 } = {}) {
  const delta = currentCfs - baselineCfs;
  let result;
  if (delta >= 3) result = 'rapid-frailty-progression';
  else if (delta >= 1) result = 'moderate-frailty-progression';
  else if (delta === 0) result = 'stable-frailty';
  else if (delta <= -1) result = 'frailty-improvement-or-reversal';
  else result = 'unspecified';
  return { delta, result, recommendation: 'CGA-and-modify-care-plan' };
};

Engine.FrailtyAndSurgery = function ({ cfsScore = 5, surgery = 'major-elective', age = 75 } = {}) {
  let plan;
  if (cfsScore >= 7) plan = 'avoid-surgery-and-palliative-or-non-operative';
  else if (cfsScore >= 5 && surgery === 'major-elective') plan = 'high-risk-prehab-and-shared-decision';
  else if (cfsScore >= 4 && surgery === 'major-emergent') plan = 'high-risk-and-emergent-eval';
  else if (cfsScore <= 3) plan = 'low-risk-and-standard-perioperative';
  else plan = 'standard-perioperative-eval';
  return { plan, recommendation: 'prehab-and-CGA-and-anesthesia-consult' };
};

Engine.PolypharmacyInFrail = function ({ medCount = 8, highRiskMeds = ['benzo', 'anticholinergic'], cfs = 5 } = {}) {
  let plan;
  if (medCount >= 10) plan = 'severe-polypharmacy-deprescribing';
  else if (medCount >= 5 && highRiskMeds.length >= 1) plan = 'polypharmacy-and-high-risk-review';
  else if (medCount >= 5) plan = 'polypharmacy-review-and-deprescribing';
  else if (cfs >= 5) plan = 'frailty-and-pharmacy-review';
  else plan = 'standard-medication-review';
  return { plan, recommendation: 'pharmacist-and-deprescribing' };
};

Engine.CognitiveFrailty = function ({ mmse = 24, cfs = 5, depression = 'moderate', socialIsolation = 'moderate' } = {}) {
  let plan;
  if (mmse < 20 && cfs >= 5) plan = 'dementia-and-frailty-comprehensive-care';
  else if (mmse < 24 && depression === 'severe') plan = 'cognitive-impairment-and-depression-eval';
  else if (socialIsolation === 'severe' && cfs >= 5) plan = 'social-prescribing-and-OT';
  else if (mmse < 24) plan = 'MCI-eval-and-stim';
  else plan = 'monitor-and-stim';
  return { plan, recommendation: 'CGA-cognitive-and-social' };
};

Engine.FrailtyOutcome = function ({ preCfs = 5, postCfs = 4, scale = 'CFS', weeksElapsed = 26 } = {}) {
  const delta = preCfs - postCfs;
  let result;
  if (delta >= 2) result = 'large-frailty-improvement';
  else if (delta >= 1) result = 'moderate-frailty-improvement';
  else if (delta === 0) result = 'stable-or-no-change';
  else if (delta === -1) result = 'small-worsening';
  else result = 'large-worsening';
  return { delta, result, recommendation: result.includes('improvement') ? 'maintain-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
