// P3-BB: Falls-Prevention Engine — 10 pure functions
const Engine = {};

Engine.FallsRiskAssessment = function ({ age = 75, historyOfFalls = 'yes', gait = 'abnormal', balance = 'Berg-40', medications = 'polypharmacy-5+' } = {}) {
  let risk;
  if (historyOfFalls === 'yes' && gait === 'abnormal' && balance === 'Berg-40') risk = 'high-risk-multifactorial';
  else if (historyOfFalls === 'yes' && medications === 'polypharmacy-5+') risk = 'high-risk-medication-and-history';
  else if (gait === 'abnormal' || balance === 'Berg-40') risk = 'moderate-risk-balance-or-gait';
  else if (historyOfFalls === 'no' && age >= 80) risk = 'moderate-risk-age-only';
  else if (historyOfFalls === 'yes') risk = 'moderate-risk-history-only';
  else if (age < 75 && historyOfFalls === 'no') risk = 'low-risk-young-and-no-history';
  else risk = 'low-risk-monitor';
  return { risk, recommendation: 'comprehensive-falls-eval-and-multifactorial-intervention' };
};

Engine.TimedUpAndGo = function ({ tugSeconds = 12, assistiveDevice = 'cane', footwear = 'shoes' } = {}) {
  let result;
  if (tugSeconds >= 30) result = 'high-risk-mobility-impairment-and-falls';
  else if (tugSeconds >= 20) result = 'moderate-mobility-impairment';
  else if (tugSeconds >= 14) result = 'mild-mobility-impairment-monitor';
  else if (tugSeconds < 14) result = 'normal-mobility-low-fall-risk';
  else result = 'unspecified';
  return { result, recommendation: `${result}-device-${assistiveDevice}-footwear-${footwear}` };
};

Engine.BergBalance = function ({ bergScore = 45 } = {}) {
  let result;
  if (bergScore >= 56) result = 'normal-balance-very-low-fall-risk';
  else if (bergScore >= 45) result = 'mild-balance-impairment';
  else if (bergScore >= 35) result = 'moderate-balance-impairment-fall-risk';
  else if (bergScore >= 20) result = 'severe-balance-impairment-high-fall-risk';
  else if (bergScore < 20) result = 'very-severe-balance-impairment-very-high-fall-risk';
  else result = 'unspecified';
  return { result, recommendation: `${result}-PT-balance-program` };
};

Engine.MedicationFallRisk = function ({ meds = ['benzo', 'opioid', 'anticholinergic'], dose = 'standard' } = {}) {
  let count = meds.length;
  let risk;
  if (count >= 3) risk = 'high-fall-risk-medication-burden-3-or-more';
  else if (count >= 2) risk = 'moderate-fall-risk-medication-2';
  else if (count >= 1) risk = 'mild-fall-risk-medication-1';
  else if (count === 0) risk = 'no-fall-risk-medications';
  if (dose === 'high') risk = 'high-fall-risk-high-dose';
  if (meds.includes('benzo') || meds.includes('z-drug')) risk = 'high-fall-risk-benzo-or-z-drug';
  return { risk, recommendation: 'pharmacy-medication-review-and-taper' };
};

Engine.HomeSafety = function ({ lighting = 'adequate', rugs = 'no', grabBars = 'no', stairs = 'no', pets = 'no' } = {}) {
  let hazards = 0;
  if (lighting === 'inadequate') hazards++;
  if (rugs === 'yes') hazards++;
  if (grabBars === 'no' && stairs === 'no') hazards++;
  if (stairs === 'yes' && grabBars === 'no') hazards++;
  if (pets === 'yes') hazards++;
  let plan;
  if (hazards >= 3) plan = 'comprehensive-home-safety-and-OT-eval';
  else if (hazards >= 1) plan = 'targeted-home-safety-modifications';
  else plan = 'home-safety-monitor';
  return { plan, recommendation: `hazards-${hazards}-and-OT-eval` };
};

Engine.Footwear = function ({ type = 'slippers', fit = 'loose', sole = 'slick' } = {}) {
  let plan;
  if (type === 'slippers' || sole === 'slick') plan = 'replace-with-closed-toe-and-non-slip-sole';
  else if (fit === 'loose') plan = 'better-fit-and-orthotic-eval';
  else if (type === 'high-heel') plan = 'avoid-high-heels-and-choose-flat';
  else if (type === 'shoes' && sole === 'non-slip') plan = 'good-footwear-continue';
  else plan = 'standard-footwear-eval';
  return { plan, recommendation: 'podiatry-and-footwear-counseling' };
};

Engine.VisionAndFalls = function ({ acuity = '20/40', depthPerception = 'normal', cataract = 'none', glasses = 'bifocal' } = {}) {
  let plan;
  if (cataract === 'bilateral' && acuity === '20/100') plan = 'cataract-surgery-eval-and-anti-fall';
  else if (glasses === 'bifocal' && acuity === '20/40') plan = 'consider-monofocal-or-no-glasses-outdoors';
  else if (acuity === '20/100') plan = 'low-vision-eval-and-anti-fall';
  else if (depthPerception === 'impaired') plan = 'depth-perception-eval-and-environment-mod';
  else if (acuity === '20/40' && cataract === 'none') plan = 'routine-vision-eval-annually';
  else plan = 'standard-vision-fall-eval';
  return { plan, recommendation: 'ophthalmology-and-low-vision-eval' };
};

Engine.ExerciseForFalls = function ({ currentActivity = 'sedentary', strength = 'fair', balance = 'fair', weeks = 12 } = {}) {
  let plan;
  if (currentActivity === 'sedentary' && strength === 'fair') plan = 'Otago-Exercise-Program-and-balance-training';
  else if (currentActivity === 'active' && balance === 'fair') plan = 'Tai-Chi-2x-week-and-balance-and-strength';
  else if (strength === 'poor') plan = 'strengthening-first-then-balance-progression';
  else if (currentActivity === 'sedentary' && weeks < 8) plan = 'short-term-PT-and-step-count-goal';
  else if (currentActivity === 'active') plan = 'maintain-and-progress-balance';
  else plan = 'standard-balance-and-strength';
  return { plan, recommendation: 'PT-prescription-and-group-class' };
};

Engine.BoneHealth = function ({ age = 75, sex = 'female', tScore = -2.5, fragilityFx = 'none' } = {}) {
  let diagnosis;
  if (tScore <= -2.5) diagnosis = 'osteoporosis-by-DXA';
  else if (tScore <= -1.0) diagnosis = 'osteopenia';
  else if (fragilityFx === 'hip-or-spine') diagnosis = 'osteoporosis-clinical-history';
  else if (age >= 65 && sex === 'female') diagnosis = 'screen-DXA-and-eval';
  else diagnosis = 'no-diagnosis-routine-screen';
  return { diagnosis, recommendation: 'DEXA-and-treatment-eval' };
};

Engine.FallsOutcome = function ({ preFallsRate = 4, postFallsRate = 1, scale = 'falls-per-year', weeksElapsed = 26 } = {}) {
  const delta = preFallsRate - postFallsRate;
  const pctChange = (delta / preFallsRate) * 100;
  let result;
  if (pctChange >= 75) result = 'large-fall-reduction';
  else if (pctChange >= 50) result = 'moderate-fall-reduction';
  else if (pctChange >= 25) result = 'small-fall-reduction';
  else if (pctChange >= 0) result = 'plateau-or-stable';
  else if (pctChange < 0) result = 'falls-increased-reassess';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('reduction') ? 'maintain' : 'modify-or-evaluate' };
};

module.exports = Engine;
