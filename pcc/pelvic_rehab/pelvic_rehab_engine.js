// P3-AV: Pelvic-Rehab Engine — 10 pure functions
const Engine = {};

Engine.PelvicFloorStrength = function ({ baselineTone = 'normal', strength = 3, endurance = 5, fastTwitch = 10 } = {}) {
  let assessment;
  if (strength >= 4 && endurance >= 10 && fastTwitch >= 15) assessment = 'normal-PF-strength';
  else if (strength >= 3 && endurance >= 5) assessment = 'mild-weakness-PFPT';
  else if (strength >= 2) assessment = 'moderate-weakness-PFPT-with-biofeedback';
  else if (baselineTone === 'hypertonic') assessment = 'hypertonic-pelvic-floor-downtraining';
  else assessment = 'severe-weakness-or-hypertonic-PFPT-with-biofeedback';
  return { assessment, recommendation: 'pelvic-floor-PT-program' };
};

Engine.IncontinenceImpact = function ({ padUse = 2, leakageFrequency = 'daily', padWeight = 50, urge = 'moderate' } = {}) {
  let severity;
  if (padWeight >= 100 || padUse >= 4) severity = 'severe-incontinence-3-pads-or-more-per-day';
  else if (padUse >= 2 && leakageFrequency === 'daily') severity = 'moderate-incontinence-1-to-2-pads-daily';
  else if (leakageFrequency === 'weekly') severity = 'mild-incontinence-1-pad-weekly';
  else if (leakageFrequency === 'monthly') severity = 'minimal-incontinence-monthly';
  else severity = 'no-incontinence';
  let urgeComponent;
  if (urge === 'severe') urgeComponent = 'urge-incontinence-dominant';
  else if (urge === 'moderate') urgeComponent = 'urge-mixed';
  else if (urge === 'mild') urgeComponent = 'urge-mild';
  return { severity, urgeComponent, recommendation: severity.includes('severe') ? 'PFPT-and-urology' : 'pelvic-floor-PT' };
};

Engine.PelvicOrganProlapse = function ({ stage = 1, symptom = 'none', pessaryIndicated = false } = {}) {
  let classification;
  if (stage === 0) classification = 'no-prolapse';
  else if (stage === 1) classification = 'stage-1-prolapse-mid-vagina';
  else if (stage === 2) classification = 'stage-2-prolapse-at-introitus';
  else if (stage === 3) classification = 'stage-3-prolapse-beyond-introitus';
  else if (stage === 4) classification = 'stage-4-complete-prolapse';
  else classification = 'unspecified';
  let management;
  if (stage <= 1) management = 'pelvic-floor-PT';
  else if (stage === 2) management = 'pessary-or-pelvic-floor-PT';
  else if (stage === 3) management = 'surgical-or-pessary';
  else if (stage === 4) management = 'surgical-repair';
  else management = 'evaluation';
  return { classification, management, recommendation: stage >= 3 ? 'urogynecology-referral' : 'pelvic-floor-PT' };
};

Engine.PelvicPain = function ({ dyspareunia = false, dysmenorrhea = false, painLocation = 'vulvar', duration = 3 } = {}) {
  let diagnosis;
  if (painLocation === 'vulvar' && duration >= 3) diagnosis = 'vulvodynia-consider';
  else if (dyspareunia && dysmenorrhea) diagnosis = 'endometriosis-or-pelvic-floor-dysfunction';
  else if (dyspareunia) diagnosis = 'pelvic-floor-muscle-dysfunction';
  else if (dysmenorrhea) diagnosis = 'dysmenorrhea-evaluate';
  else if (painLocation === 'deep-pelvic') diagnosis = 'chronic-pelvic-pain-syndrome';
  else diagnosis = 'unspecified-pelvic-pain';
  return { diagnosis, recommendation: 'pelvic-floor-PT-and-multidisciplinary' };
};

Engine.PregnancyPelvic = function ({ trimester = 1, diastasisRecti = 0, pelvicPain = false, priorPelvicFloorIssue = false } = {}) {
  let pathway;
  if (trimester >= 3 && diastasisRecti >= 3) pathway = 'postpartum-pelvic-PT-evaluation';
  else if (trimester >= 2 && pelvicPain) pathway = 'pregnancy-pelvic-girdle-pain-PT';
  else if (priorPelvicFloorIssue) pathway = 'prenatal-pelvic-floor-PT-preventive';
  else if (trimester === 1) pathway = 'baseline-pelvic-floor-assessment';
  else pathway = 'monitor';
  return { pathway, recommendation: 'pelvic-floor-PT-prenatal-and-postpartum' };
};

Engine.PostProstatectomy = function ({ weeksPost = 4, padUse = 1, errectileDysfunction = true, pelvicFloor = 'started' } = {}) {
  let status;
  if (weeksPost < 6 && padUse >= 2) status = 'early-incontinence-expected';
  else if (weeksPost < 12 && padUse >= 1) status = 'improving-incontinence-PFPT';
  else if (padUse === 0 && pelvicFloor === 'complete') status = 'continent-and-recovered';
  else if (padUse >= 1 && weeksPost >= 12) status = 'persistent-incontinence-PFPT-and-urology';
  else status = 'recovering';
  const edStatus = errectileDysfunction ? 'ED-present-consider-PDE5i' : 'no-ED';
  return { status, edStatus, recommendation: 'PFPT-and-urology' };
};

Engine.DyspareuniaEval = function ({ painOnset = 'initial', painLocation = 'superficial', primary = true } = {}) {
  let diagnosis;
  if (painLocation === 'superficial' && primary) diagnosis = 'provoked-vestibulodynia';
  else if (painLocation === 'superficial' && !primary) diagnosis = 'acquired-vestibulodynia';
  else if (painLocation === 'deep') diagnosis = 'deep-dyspareunia-MPFD-or-endometriosis';
  else if (painOnset === 'post-partum') diagnosis = 'post-partum-dyspareunia';
  else diagnosis = 'unspecified-dyspareunia';
  return { diagnosis, recommendation: 'pelvic-floor-PT-and-gynecology' };
};

Engine.PelvicFloorEMGBiofeedback = function ({ baselineTone = 'normal', strength = 3, endurance = 5, fastTwitch = 10 } = {}) {
  let assessment;
  if (strength >= 4 && endurance >= 10 && fastTwitch >= 15) assessment = 'normal-PF-strength';
  else if (strength >= 3 && endurance >= 5) assessment = 'mild-weakness-PFPT';
  else if (strength >= 2) assessment = 'moderate-weakness-PFPT-with-biofeedback';
  else if (baselineTone === 'hypertonic') assessment = 'hypertonic-pelvic-floor-downtraining';
  else assessment = 'severe-weakness-or-hypertonic-PFPT-with-biofeedback';
  return { assessment, recommendation: 'pelvic-floor-PT-program' };
};

Engine.PelvicSurgeryRecovery = function ({ surgery = 'hysterectomy', weeksPost = 4, painScore = 3, bladderFunction = 'normal', sexualFunction = 'pending' } = {}) {
  let recovery;
  if (weeksPost < 4) recovery = 'acute-recovery-rest';
  else if (weeksPost < 8 && painScore < 3) recovery = 'early-PFPT-gradual-activity';
  else if (weeksPost < 12 && painScore < 2) recovery = 'PFPT-and-pelvic-floor-strengthening';
  else if (weeksPost >= 12) recovery = 'maintenance-and-return-to-activity';
  if (bladderFunction === 'abnormal') recovery += '-with-urotherapy';
  if (sexualFunction === 'dyspareunia') recovery += '-and-dyspareunia-management';
  return { recovery, recommendation: 'PFPT-protocol-post-surgical' };
};

Engine.MalePelvicPain = function ({ cppsDuration = 3, urination = 'normal', sexualDysfunction = false, depression = false } = {}) {
  let diagnosis;
  if (cppsDuration >= 3 && urination === 'painful') diagnosis = 'CPPS-Category-III-chronic-prostatitis';
  else if (cppsDuration >= 3 && sexualDysfunction) diagnosis = 'CPPS-with-dysfunction';
  else if (cppsDuration < 3) diagnosis = 'acute-pelvic-pain-evaluate';
  else diagnosis = 'CPPS-Category-III-non-inflammatory';
  let management;
  if (depression) management = 'CPPS-multimodal-PT-pharm-psych';
  else if (sexualDysfunction) management = 'CPPS-PT-and-urology-and-sexual-medicine';
  else management = 'CPPS-PT-and-pharmacotherapy';
  return { diagnosis, management, recommendation: 'multidisciplinary-CPPS-clinic' };
};

module.exports = Engine;
