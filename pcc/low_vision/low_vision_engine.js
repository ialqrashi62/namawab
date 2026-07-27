// P3-AZ: Low-Vision Rehab Engine — 10 pure functions
const Engine = {};

Engine.LowVisionAssessment = function ({ acuity = '20/200', visualField = 'constricted', contrast = 'reduced', glare = 'high' } = {}) {
  let classification;
  if (acuity === '20/200' || visualField === '20-degrees') classification = 'legally-blind-or-tunnel-vision';
  else if (acuity === '20/100' || visualField === 'constricted') classification = 'low-vision-eligible-for-rehab';
  else if (contrast === 'reduced' || glare === 'high') classification = 'functional-vision-impairment-rehab-eligible';
  else if (acuity === '20/70' || acuity === '20/50') classification = 'mild-vision-loss-monitor';
  else classification = 'within-normal-limits';
  return { classification, recommendation: 'low-vision-clinic-referral-if-not-yet-seen' };
};

Engine.MagnificationRx = function ({ task = 'near-reading', acuity = '20/100', target = '20/30', workingDistance = 40 } = {}) {
  const ratio = parseInt(acuity.split('/')[1]) / parseInt(target.split('/')[1]);
  let power;
  if (task === 'near-reading' && workingDistance === 40) power = Math.round(ratio * 2.5 * 10) / 10;
  else if (task === 'near-reading') power = Math.round((100 / workingDistance) * ratio * 10) / 10;
  else if (task === 'distance') power = Math.round(ratio * 10) / 10;
  else if (task === 'intermediate') power = Math.round((100 / workingDistance) * ratio * 10) / 10;
  else power = 2.5;
  let device;
  if (power <= 4) device = 'handheld-or-stand-magnifier';
  else if (power <= 8) device = 'spectacle-mounted-magnifier-or-CCTV';
  else if (power <= 12) device = 'CCTV-or-electronic-magnifier';
  else device = 'electronic-video-magnifier-or-OCR';
  return { power, device, recommendation: `${device}-${power}X` };
};

Engine.VisualField = function ({ defect = 'central-scotoma', laterality = 'right', onset = 'acute' } = {}) {
  let classification;
  if (defect === 'central-scotoma' && laterality === 'both') classification = 'macular-degeneration-pattern';
  else if (defect === 'hemianopia' && onset === 'acute') classification = 'stroke-or-TIA-immediate-neuro';
  else if (defect === 'hemianopia' && onset === 'gradual') classification = 'chiasmal-or-retro-chiasmal-mass';
  else if (defect === 'tunnel' || defect === 'constricted') classification = 'RP-or-glaucoma-pattern';
  else if (defect === 'altitudinal') classification = 'AION-or-branch-artery-occlusion';
  else classification = 'localize-and-evaluate';
  return { classification, recommendation: 'low-vision-and-perimetry-eval' };
};

Engine.ContrastSensitivity = function ({ logCS = 1.0, age = 60, lighting = 'photopic' } = {}) {
  let result;
  if (logCS >= 1.5) result = 'normal-contrast-sensitivity';
  else if (logCS >= 1.0) result = 'mild-contrast-loss';
  else if (logCS >= 0.5) result = 'moderate-contrast-loss';
  else if (logCS >= 0.0) result = 'severe-contrast-loss';
  else result = 'profound-contrast-loss';
  let environment;
  if (lighting === 'photopic' && age >= 60) environment = 'high-contrast-strategies-and-task-lighting';
  else if (lighting === 'mesopic') environment = 'glare-control-and-yellow-tint';
  else environment = 'standard-lighting-and-contrast-enhancement';
  return { result, environment, recommendation: `${environment}-for-${result}` };
};

Engine.AssistiveTech = function ({ task = 'reading', vision = '20/100', techAccess = 'high', dexterity = 'normal' } = {}) {
  let plan;
  if (task === 'reading' && vision === '20/100' && techAccess === 'high') plan = 'CCTV-and-tablet-with-zoom';
  else if (task === 'reading' && techAccess === 'low') plan = 'optical-magnifier-and-large-print';
  else if (task === 'computer' && techAccess === 'high') plan = 'screen-reader-and-zoom-and-high-contrast';
  else if (task === 'wayfinding') plan = 'white-cane-and-orientation-and-mobility';
  else if (task === 'cooking' && dexterity === 'normal') plan = 'talking-thermometer-and-large-print-recipes';
  else if (task === 'medication') plan = 'talking-pillbox-and-large-print-labels';
  else plan = 'standard-low-vision-AAT';
  return { plan, recommendation: 'OT-low-vision-and-AAT-evaluation' };
};

Engine.ADL = function ({ reading = 'cannot', writing = 'limited', selfCare = 'independent', mealPrep = 'limited' } = {}) {
  let plan;
  if (reading === 'cannot' && writing === 'cannot') plan = 'non-visual-alternatives-and-audio';
  else if (mealPrep === 'cannot') plan = 'meal-prep-adaptations-and-meal-services-referral';
  else if (selfCare === 'dependent') plan = 'self-care-adaptations-and-caregiver-training';
  else if (reading === 'limited' || writing === 'limited') plan = 'magnifier-and-large-print-strategies';
  else plan = 'maintain-and-monitor';
  return { plan, recommendation: 'OT-low-vision-eval-and-ADL-training' };
};

Engine.MobilityOM = function ({ vision = '20/200', field = 'tunnel', familiarEnv = 'yes', travelAlone = 'no' } = {}) {
  let plan;
  if (vision === '20/200' && field === 'tunnel') plan = 'white-cane-and-O-and-M-training';
  else if (field === 'hemianopia' && travelAlone === 'no') plan = 'hemianopia-scanning-and-O-and-M';
  else if (familiarEnv === 'yes' && travelAlone === 'no') plan = 'familiar-route-O-and-M-with-cane-or-guide';
  else if (travelAlone === 'yes' && familiarEnv === 'no') plan = 'comprehensive-O-and-M-and-bus-travel-training';
  else plan = 'standard-low-vision-O-and-M';
  return { plan, recommendation: 'COMS-or-CVRT-certified-instructor' };
};

Engine.LowVisionDriving = function ({ vision = '20/100', field = 'normal', contrast = 'mild-loss', history = 'no' } = {}) {
  let status;
  if (vision === '20/40' && field === 'normal') status = 'meets-most-state-vision-requirements';
  else if (vision === '20/50' && field === 'normal' && contrast === 'normal') status = 'meets-with-bioptic-or-restriction';
  else if (vision === '20/100' && field === 'normal') status = 'bioptic-telescope-eval-eligible';
  else if (field === 'hemianopia') status = 'visual-field-deficit-on-road-eval';
  else if (contrast === 'severe') status = 'contrast-loss-driving-not-recommended';
  else if (vision === '20/200') status = 'not-eligible-driving-refer-to-low-vision-services';
  else status = 'individualized-driving-eval';
  return { status, recommendation: 'specialist-driving-eval-and-DMV' };
};

Engine.PedLowVision = function ({ age = 6, condition = 'ROP', vision = '20/200', school = 'mainstream' } = {}) {
  let plan;
  if (age < 3) plan = 'early-intervention-and-stim';
  else if (age < 6 && school === 'mainstream') plan = 'pre-school-low-vision-services';
  else if (age < 18 && school === 'mainstream') plan = 'school-low-vision-services-and-IEP';
  else if (school === 'specialized') plan = 'school-for-the-blind-and-low-vision';
  else if (condition === 'ROP') plan = 'ROP-vision-rehab-and-family-support';
  else plan = 'standard-pediatric-low-vision';
  return { plan, recommendation: 'TVI-and-certified-low-vision-specialist' };
};

Engine.LowVisionOutcome = function ({ pre = 50, post = 75, scale = 'visual-function', weeksElapsed = 8 } = {}) {
  const delta = post - pre;
  const pctChange = (delta / pre) * 100;
  let result;
  if (pctChange >= 60) result = 'large-functional-gain';
  else if (pctChange >= 30) result = 'moderate-functional-gain';
  else if (pctChange >= 10) result = 'small-functional-gain';
  else if (pctChange >= 0) result = 'minimal-change-continue';
  else result = 'no-gain-or-decline-reassess';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintain-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
