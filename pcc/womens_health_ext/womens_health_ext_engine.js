// P3-BF: Womens-Health-Ext Engine — 10 pure functions
const Engine = {};

Engine.WellWoman = function ({ age = 35, pap = 'up-to-date', mammogram = 'NA', screening = 'current' } = {}) {
  let plan;
  if (age >= 21 && age < 30 && pap === 'up-to-date') plan = 'cytology-only-and-every-3-years';
  else if (age >= 30 && pap === 'up-to-date' && screening === 'current') plan = 'co-testing-and-HPV-and-every-5-years';
  else if (age >= 40 && mammogram === 'current') plan = 'annual-mammogram-and-co-testing';
  else if (age >= 50 && mammogram === 'overdue') plan = 'mammogram-overdue-and-eval';
  else if (age < 21) plan = 'too-young-and-pap-deferred';
  else plan = 'standard-screening';
  return { plan, recommendation: 'OBGYN-and-primary-care' };
};

Engine.Menopause = function ({ age = 50, fsh = 60, vasomotor = 'moderate', boneDensity = 'normal' } = {}) {
  let plan;
  if (fsh >= 30 && age >= 45 && vasomotor === 'moderate') plan = 'menopause-and-MHT-or-non-hormonal';
  else if (boneDensity === 'osteopenia' && age >= 50) plan = 'menopause-and-bone-protection';
  else if (vasomotor === 'severe') plan = 'menopause-and-MHT-or-SSRI';
  else if (age >= 60) plan = 'post-menopause-and-screen';
  else if (fsh < 25) plan = 'perimenopause-and-eval';
  else plan = 'standard-eval';
  return { plan, recommendation: 'OBGYN-and-bone-health' };
};

Engine.PCOSWH = function ({ cycle = 'irregular', bmi = 28, hirsutism = 'mild', age = 28 } = {}) {
  let plan;
  if (cycle === 'irregular' && bmi >= 25) plan = 'metformin-and-OCP-and-weight-loss';
  else if (hirsutism === 'severe') plan = 'spironolactone-and-OCP-and-Cosmetic';
  else if (bmi >= 30 && cycle === 'irregular') plan = 'PCOS-metabolic-and-OCP-and-weight-loss';
  else if (cycle === 'irregular' && bmi < 25) plan = 'OCP-and-eval-and-fertility';
  else plan = 'standard-PCOS-eval';
  return { plan, recommendation: 'OBGYN-and-endocrine' };
};

Engine.EndometriosisWH = function ({ pain = 'mild', stage = 1, fertility = 'preserved', priorSurgery = 'no' } = {}) {
  let plan;
  if (pain === 'severe' && fertility === 'preserved') plan = 'laparoscopy-and-medical-suppression';
  else if (stage >= 3 && fertility === 'compromised') plan = 'ART-and-IVF-and-eval';
  else if (pain === 'mild' && stage === 1) plan = 'NSAID-and-OCP-and-monitor';
  else if (priorSurgery === 'yes' && pain === 'recurrent') plan = 'recurrent-endo-and-re-eval-or-IVF';
  else plan = 'standard-eval';
  return { plan, recommendation: 'gyn-and-reproductive-eval' };
};

Engine.UTI = function ({ frequency = 'recurrent', culture = 'E-coli', sex = 'female', prophylaxis = 'no' } = {}) {
  let plan;
  if (frequency === 'recurrent' && prophylaxis === 'no') plan = 'post-coital-or-daily-prophylaxis';
  else if (culture === 'E-coli' && frequency === 'recurrent') plan = 'recurrent-UTI-and-eval-anatomy';
  else if (sex === 'female' && frequency === 'first') plan = 'first-UTI-and-short-course-ABX';
  else if (culture === 'klebsiella' && prophylaxis === 'yes') plan = 'resistant-UTI-and-culture-and-ABX';
  else if (frequency === 'recurrent' && prophylaxis === 'failed') plan = 'cranberry-and-topical-estrogen-and-eval';
  else plan = 'standard-UTI';
  return { plan, recommendation: 'primary-care-and-urology' };
};

Engine.STI = function ({ pathogen = 'chlamydia', symptoms = 'present', partner = 'unknown', risk = 'moderate' } = {}) {
  let plan;
  if (pathogen === 'chlamydia' && symptoms === 'present') plan = 'doxycycline-and-partner-treatment';
  else if (pathogen === 'gonorrhea' && risk === 'high') plan = 'ceftriaxone-and-IM-and-eval';
  else if (pathogen === 'HIV' && risk === 'high') plan = 'PEP-or-PrEP-and-ID-eval';
  else if (partner === 'unknown' && risk === 'high') plan = 'empiric-treatment-and-test';
  else if (pathogen === 'syphilis') plan = 'penicillin-and-stage-and-eval';
  else plan = 'standard-STI';
  return { plan, recommendation: 'OBGYN-or-primary-care' };
};

Engine.CervicalScreen = function ({ hpv = 'negative', cytology = 'NILM', age = 35, prior = 'normal' } = {}) {
  let plan;
  if (age >= 30 && hpv === 'negative' && cytology === 'NILM') plan = 'co-test-negative-and-routine-5y';
  else if (hpv === 'positive-16-18' && cytology === 'NILM') plan = 'colposcopy-and-eval';
  else if (hpv === 'positive-other' && cytology === 'ASCUS') plan = 'reflex-HPV-and-co-test-1y';
  else if (cytology === 'HSIL' || cytology === 'ASC-H') plan = 'colposcopy-and-bx';
  else if (age < 25) plan = 'cytology-only-and-annual';
  else plan = 'standard-screen';
  return { plan, recommendation: 'OBGYN-and-gyn-path' };
};

Engine.Urogyn = function ({ leakage = 'stress', frequency = 'weekly', priorSurgery = 'no', qualityOfLife = 'mild' } = {}) {
  let plan;
  if (leakage === 'urge' && qualityOfLife === 'moderate') plan = 'anticholinergic-and-PFT';
  else if (leakage === 'stress' && qualityOfLife === 'moderate') plan = 'PFT-and-pessary-or-sling-eval';
  else if (leakage === 'mixed' && qualityOfLife === 'severe') plan = 'urodynamics-and-mgmt';
  else if (priorSurgery === 'sling-failed') plan = 'redo-or-bulking-eval';
  else if (leakage === 'urge' && frequency === 'daily') plan = 'PTNS-or-sacral-stim';
  else plan = 'standard-eval';
  return { plan, recommendation: 'urogyn-and-PT' };
};

Engine.PelvicFloorWH = function ({ prolapse = 'mild', urinary = 'normal', sexual = 'normal', age = 35 } = {}) {
  let plan;
  if (prolapse === 'severe' && age >= 65) plan = 'pessary-or-surgery-eval';
  else if (prolapse === 'moderate' && sexual === 'affected') plan = 'PFPT-and-pessary-eval';
  else if (prolapse === 'mild' && age < 50) plan = 'PFPT-and-monitor';
  else if (urinary === 'incontinence') plan = 'PFPT-and-incontinence-eval';
  else plan = 'standard-PFPT';
  return { plan, recommendation: 'urogyn-and-PT' };
};

Engine.IVFandGyn = function ({ ivfCycles = 0, eggReserve = 'normal', age = 35, gynecology = 'normal' } = {}) {
  let plan;
  if (ivfCycles >= 3 && age < 38) plan = 'consider-donor-or-surrogate';
  else if (eggReserve === 'low' && age >= 38) plan = 'IVF-with-EM-or-donor-eggs';
  else if (ivfCycles === 0 && gynecology === 'normal') plan = 'IVF-start';
  else if (age < 35 && ivfCycles < 3) plan = 'continue-IVF-and-eval';
  else if (gynecology === 'fibroids') plan = 'myomectomy-and-IVF';
  else plan = 'standard-IVF-and-eval';
  return { plan, recommendation: 'REI-team-and-OBGYN' };
};

module.exports = Engine;
