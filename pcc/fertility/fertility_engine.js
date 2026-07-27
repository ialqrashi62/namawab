// P3-BF: Fertility Engine — 10 pure functions
const Engine = {};

Engine.FertilityEval = function ({ partnerAge = 35, duration = 12, cycle = 'regular', priorPreg = 'none' } = {}) {
  let plan;
  if (duration >= 12 && cycle === 'regular' && partnerAge < 40) plan = 'standard-infertility-workup';
  else if (duration < 6) plan = 'try-naturally-6-more-months';
  else if (cycle === 'irregular') plan = 'anovulation-workup-and-ovulation-induction';
  else if (priorPreg === 'yes' && duration >= 12) plan = 'secondary-infertility-and-eval';
  else if (partnerAge >= 40) plan = 'advanced-reproductive-age-and-IVF-soon';
  else if (duration >= 24) plan = 'advanced-infertility-and-IVF';
  else plan = 'standard-eval';
  return { plan, recommendation: 'REI-and-OB-team' };
};

Engine.IVFProtocol = function ({ age = 35, amh = 2, bmi = 25, priorCycles = 0, response = 'unknown' } = {}) {
  let plan;
  if (amh >= 3 && age < 35) plan = 'high-responder-and-lower-dose-and-monitor';
  else if (amh < 0.5 && age >= 40) plan = 'low-responder-and-consider-donor-or-EM';
  else if (priorCycles >= 2 && response === 'poor') plan = 'poor-responder-and-mini-IVF-or-EM';
  else if (amh >= 1 && age < 38) plan = 'standard-responder-and-standard-protocol';
  else if (bmi >= 30) plan = 'weight-loss-and-revised-protocol';
  else if (response === 'hyper') plan = 'OHSS-risk-and-trigger-adjust';
  else plan = 'standard-IVF';
  return { plan, recommendation: 'REI-team-and-individualized' };
};

Engine.OHSS = function ({ follicles = 12, estradiol = 3000, symptoms = 'mild' } = {}) {
  let classification;
  if (follicles >= 20 && estradiol >= 5000 && symptoms === 'severe') classification = 'severe-OHSS-and-admit';
  else if (follicles >= 15 && estradiol >= 3000) classification = 'moderate-OHSS-and-monitor';
  else if (follicles >= 10 && estradiol >= 2000) classification = 'mild-OHSS-and-warn';
  else classification = 'no-OHSS';
  return { classification, recommendation: 'REI-team-and-coasting-or-trigger' };
};

Engine.Endometriosis = function ({ stage = 2, pain = 'mild', fertility = 'preserved', age = 32 } = {}) {
  let plan;
  if (stage >= 3 && fertility === 'preserved' && age < 35) plan = 'laparoscopy-and-IVF-or-ART';
  else if (stage === 1 && pain === 'mild' && fertility === 'preserved') plan = 'medical-management-and-NSAID-and-OCP';
  else if (stage >= 3 && pain === 'severe') plan = 'laparoscopy-or-suppression-and-IVF';
  else if (stage >= 2 && fertility === 'compromised') plan = 'ART-and-IVF-soon';
  else if (stage === 4) plan = 'severe-endometriosis-and-ART-or-hysterectomy-eval';
  else plan = 'standard-eval';
  return { plan, recommendation: 'REI-and-gyn-team' };
};

Engine.PCOS = function ({ cycle = 'irregular', bmi = 30, insulin = 'resistant', amh = 4 } = {}) {
  let plan;
  if (bmi >= 30 && insulin === 'resistant') plan = 'metformin-and-weight-loss-and-letrozole';
  else if (cycle === 'irregular' && bmi < 25) plan = 'letrozole-or-clomiphene-and-trigger';
  else if (cycle === 'irregular' && amh >= 5) plan = 'PCOS-and-ovulation-induction-and-monitor';
  else if (bmi >= 30 && cycle === 'irregular') plan = 'weight-loss-and-OCP-and-letrozole';
  else plan = 'standard-PCOS-eval';
  return { plan, recommendation: 'REI-and-endocrine-team' };
};

Engine.Malefactor = function ({ count = 15, motility = 30, morphology = 4, fsh = 5 } = {}) {
  let classification;
  if (count < 5 && motility < 20 && morphology < 2) classification = 'severe-oligoasthenoteratozoospermia';
  else if (count < 15 && motility < 30) classification = 'moderate-male-factor';
  else if (count >= 15 && motility >= 30 && morphology >= 4) classification = 'normal-semen-analysis';
  else if (fsh >= 10) classification = 'primary-testicular-failure';
  else classification = 'mild-male-factor';
  return { classification, recommendation: 'urology-and-andrology-and-IVF/ICSI' };
};

Engine.Miscarriage = function ({ losses = 1, gaLast = 8, age = 32, workup = 'none' } = {}) {
  let plan;
  if (losses >= 3 && workup === 'none') plan = 'recurrent-pregnancy-loss-workup';
  else if (losses >= 2 && age >= 35) plan = 'RPL-workup-and-genetic-and-anatomic';
  else if (gaLast >= 10 && workup === 'none') plan = 'second-trimester-loss-eval-anatomic';
  else if (losses === 1) plan = 'standard-care-and-reassure';
  else if (workup === 'complete') plan = 'standard-care-and-reassure';
  else plan = 'standard-eval';
  return { plan, recommendation: 'REI-MFM-and-hematology' };
};

Engine.PGT = function ({ age = 35, indication = 'advanced-maternal-age', cycles = 1 } = {}) {
  let plan;
  if (age >= 38 && indication === 'advanced-maternal-age') plan = 'PGT-A-and-IVF';
  else if (indication === 'translocation' || indication === 'X-linked') plan = 'PGT-SR-or-M-and-IVF';
  else if (cycles >= 2 && indication === 'recurrent-miscarriage') plan = 'PGT-A-and-IVF';
  else if (age < 35 && cycles < 2) plan = 'no-PGT-and-IVF';
  else plan = 'standard-IVF';
  return { plan, recommendation: 'REI-and-genetic-counsel' };
};

Engine.FertilityPreservation = function ({ age = 32, indication = 'egg-freezing', cancer = 'no', partner = 'no' } = {}) {
  let plan;
  if (indication === 'egg-freezing' && age < 38) plan = 'elective-egg-freezing-and-2-cycles';
  else if (cancer === 'yes') plan = 'oncofertility-and-urgent-egg-or-embryo-freezing';
  else if (indication === 'embryo-freezing' && partner === 'yes') plan = 'embryo-freezing-and-IVF';
  else if (indication === 'sperm-freezing') plan = 'sperm-freezing-and-2-3-samples';
  else if (age >= 38) plan = 'FP-and-consider-2-cycles-and-AMH-discussion';
  else plan = 'standard-eval';
  return { plan, recommendation: 'REI-team-and-oncofertility' };
};

Engine.FertilityOutcome = function ({ preConceive = 0, postDelivery = 1, cycles = 2, age = 35 } = {}) {
  let result;
  if (postDelivery >= 1 && cycles <= 2 && age < 38) result = 'successful-FP-or-ART';
  else if (postDelivery >= 1 && cycles <= 4) result = 'eventual-success-after-IVF';
  else if (cycles >= 4 && postDelivery === 0) result = 'unsuccessful-and-consider-donor-or-surrogate';
  else if (age >= 40 && postDelivery === 0) result = 'advanced-age-and-reconsider';
  else if (postDelivery === 0 && cycles <= 2) result = 'early-and-continue';
  else result = 'standard-eval';
  return { result, recommendation: 'REI-team-and-eval' };
};

module.exports = Engine;
