// P3-BB: Geriatric-Assessment Engine — 10 pure functions
const Engine = {};

Engine.ComprehensiveGeriatric = function ({ domains = { cognitive: 'normal', mobility: 'normal', nutrition: 'normal', mood: 'normal', function: 'normal', social: 'normal', meds: 'normal', continence: 'normal' } } = {}) {
  const issues = Object.values(domains).filter(d => d !== 'normal').length;
  let classification;
  if (issues >= 5) classification = 'highly-complex-multi-domain-issues';
  else if (issues >= 3) classification = 'moderate-multi-domain-issues';
  else if (issues >= 1) classification = 'one-or-two-domain-issues';
  else classification = 'robust-no-major-issues';
  return { issues, classification, recommendation: 'CGA-and-multi-disciplinary-team' };
};

Engine.MiniCog = function ({ wordRecall = 2, clockDraw = 'normal' } = {}) {
  let result;
  if (wordRecall >= 3 && clockDraw === 'normal') result = 'normal-Mini-Cog';
  else if (wordRecall <= 1) result = 'positive-screen-for-dementia';
  else if (wordRecall === 2 && clockDraw === 'abnormal') result = 'positive-screen-for-dementia';
  else result = 'screen-positive-and-full-eval';
  return { result, recommendation: 'MoCA-or-MMSE-and-geriatric-eval' };
};

Engine.MoCA = function ({ score = 26, education = 12 } = {}) {
  const adjusted = education <= 12 ? score + 1 : score;
  let result;
  if (adjusted >= 26) result = 'normal-MoCA';
  else if (adjusted >= 20) result = 'mild-cognitive-impairment-MCI';
  else if (adjusted >= 10) result = 'moderate-cognitive-impairment';
  else result = 'severe-cognitive-impairment';
  return { score, adjusted, result, recommendation: 'geriatric-eval-and-neuropsych' };
};

Engine.ADL_IADL = function ({ adl = 6, iadl = 7 } = {}) {
  let result;
  if (adl === 6 && iadl === 8) result = 'fully-independent-no-deficits';
  else if (adl >= 5 && iadl >= 6) result = 'mild-functional-decline';
  else if (adl >= 3 && iadl >= 4) result = 'moderate-functional-decline';
  else if (adl < 3) result = 'severe-ADL-decline-and-caregiver';
  else if (iadl < 4) result = 'IADL-decline-and-supervision';
  else result = 'unspecified';
  return { result, recommendation: 'OT-and-caregiver-training' };
};

Engine.GeriatricDepression = function ({ gadScore = 6 } = {}) {
  let result;
  if (gadScore >= 10) result = 'severe-depression';
  else if (gadScore >= 5) result = 'moderate-depression';
  else if (gadScore >= 2) result = 'mild-depression';
  else result = 'no-depression';
  return { result, recommendation: 'geriatric-psychiatry-and-pharm-or-therapy' };
};

Engine.NutritionMNA = function ({ mnaScore = 24, bmi = 22, weightLoss = 0 } = {}) {
  let result;
  if (mnaScore >= 24) result = 'normal-nutrition';
  else if (mnaScore >= 17) result = 'at-risk-of-malnutrition';
  else if (mnaScore < 17) result = 'malnourished';
  else result = 'unspecified';
  if (bmi < 18.5) result = 'underweight-and-malnutrition';
  if (weightLoss >= 5) result = `${result}-and-recent-weight-loss`;
  return { result, recommendation: 'dietitian-and-protein-and-Oral-Nutrition-Supplements' };
};

Engine.PolypharmacyGeri = function ({ medCount = 8, beersCriteria = 2, age = 80 } = {}) {
  let plan;
  if (medCount >= 10 && beersCriteria >= 3) plan = 'severe-polypharmacy-deprescribing-by-pharmacist';
  else if (medCount >= 5 && beersCriteria >= 1) plan = 'polypharmacy-and-Beers-eval';
  else if (medCount >= 5) plan = 'polypharmacy-review';
  else if (age >= 80) plan = 'geriatric-age-and-medication-review';
  else plan = 'standard-medication-review';
  return { plan, recommendation: 'pharmacist-and-deprescribing' };
};

Engine.ContinenceGeri = function ({ type = 'mixed', frequency = 'daily', severity = 'moderate', cognition = 'normal' } = {}) {
  let plan;
  if (type === 'mixed' && severity === 'severe' && cognition === 'impaired') plan = 'comprehensive-continence-and-cognition-eval';
  else if (type === 'urge' && severity === 'moderate') plan = 'bladder-training-and-anticholinergic-eval';
  else if (type === 'stress' && severity === 'mild') plan = 'pelvic-floor-PT';
  else if (type === 'overflow' && frequency === 'daily') plan = 'urodynamics-and-catheter-eval';
  else plan = 'standard-continence-eval';
  return { plan, recommendation: 'urogynecology-or-urology-and-pelvic-PT' };
};

Engine.GeriatricPain = function ({ painScore = 4, painType = 'nociceptive', meds = ['NSAID'], cognition = 'normal' } = {}) {
  let plan;
  if (cognition === 'impaired' && painScore >= 4) plan = 'PAINAD-and-non-pharm-and-scheduled-analgesia';
  else if (meds.includes('opioid') && age >= 80) plan = 'opioid-stewardship-and-Beers-eval';
  else if (painType === 'neuropathic') plan = 'gabapentin-or-SNRI-and-eval';
  else if (painScore >= 7) plan = 'multimodal-pain-control';
  else if (painScore >= 4) plan = 'scheduled-acetaminophen-and-eval';
  else plan = 'monitor-and-non-pharm';
  return { plan, recommendation: 'geriatric-pain-team-and-pharmacy' };
};

Engine.GoalsOfCare = function ({ codeStatus = 'full', prognosis = '1-year', goals = 'function' } = {}) {
  let plan;
  if (goals === 'comfort' && prognosis === '1-year') plan = 'transition-to-hospice-or-comfort-care';
  else if (codeStatus === 'DNR' && goals === 'comfort') plan = 'comfort-care-plan';
  else if (prognosis === '5-year' && goals === 'function') plan = 'restorative-and-prehab';
  else if (prognosis === '1-year' && goals === 'function') plan = 'restorative-and-cga';
  else if (prognosis === '6-month' && goals === 'function') plan = 'limited-restorative-and-palliative-overlay';
  else plan = 'standard-goals-discussion';
  return { plan, recommendation: 'ACP-and-family-meeting-and-document' };
};

module.exports = Engine;
