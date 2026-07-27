// P3-BE: Perinatal-Ext Engine — 10 pure functions
const Engine = {};

Engine.PrenatalCare = function ({ trimester = 2, ga = 24, visits = 8, highRisk = 'no' } = {}) {
  let plan;
  if (visits >= 7 && highRisk === 'no') plan = 'standard-prenatal-care';
  else if (highRisk === 'yes' && ga < 28) plan = 'high-risk-and-MFM-referral';
  else if (trimester === 1 && visits < 4) plan = 'inadequate-prenatal-and-catch-up';
  else if (ga < 20 && visits < 2) plan = 'late-prenatal-and-screen';
  else if (highRisk === 'yes' && visits >= 10) plan = 'high-risk-and-adequate';
  else if (visits < 4) plan = 'inadequate-and-target-eval';
  else plan = 'standard-prenatal';
  return { plan, recommendation: 'OB-and-MFM-team' };
};

Engine.HighRiskPregnancy = function ({ condition = 'preeclampsia', ga = 32, severity = 'mild', maternalAge = 28 } = {}) {
  let plan;
  if (condition === 'preeclampsia' && severity === 'severe' && ga < 34) plan = 'severe-pre-eclampsia-and-Mg-and-delivery';
  else if (condition === 'preeclampsia' && severity === 'mild' && ga < 37) plan = 'mild-pre-eclampsia-and-monitoring';
  else if (condition === 'GDM' && severity === 'diet-controlled') plan = 'GDM-and-diet-and-glucose-monitoring';
  else if (condition === 'GDM' && severity === 'insulin-required') plan = 'GDM-and-insulin-and-MFM';
  else if (condition === 'twins' && ga < 32) plan = 'twin-pregnancy-and-MFM-and-cerclage-eval';
  else if (maternalAge >= 35) plan = 'AMA-and-genetic-counseling';
  else if (maternalAge < 20) plan = 'teen-pregnancy-and-social-support';
  else plan = 'standard-high-risk';
  return { plan, recommendation: 'MFM-and-OB-team' };
};

Engine.Preeclampsia = function ({ bpSystolic = 150, bpDiastolic = 95, proteinuria = 'yes', symptoms = 'no', ga = 32 } = {}) {
  let diagnosis;
  if (bpSystolic >= 160 || bpDiastolic >= 110 && symptoms === 'yes') diagnosis = 'severe-preeclampsia-with-severe-features';
  else if (bpSystolic >= 160 || bpDiastolic >= 110) diagnosis = 'severe-preeclampsia';
  else if (bpSystolic >= 140 || bpDiastolic >= 90 && proteinuria === 'yes') diagnosis = 'preeclampsia';
  else if (bpSystolic >= 140 || bpDiastolic >= 90 && symptoms === 'yes') diagnosis = 'preeclampsia-with-severe-features';
  else if (bpSystolic >= 140 || bpDiastolic >= 90) diagnosis = 'gestational-hypertension';
  else if (bpSystolic < 140) diagnosis = 'no-hypertension';
  else diagnosis = 'unspecified';
  return { diagnosis, recommendation: 'MFM-and-delivery-decision' };
};

Engine.PrenatalScreen = function ({ ga = 18, screen = 'NIPT', risk = 'low', ultrasound = 'normal' } = {}) {
  let plan;
  if (screen === 'NIPT' && risk === 'high' && ga >= 12) plan = 'NIPT-and-aneuploidy-screen-and-genetic-counsel';
  else if (screen === 'quad' && risk === 'high') plan = 'quad-screen-and-MFM-referral';
  else if (screen === 'IPS' && risk === 'moderate') plan = 'IPS-and-consider-amnio';
  else if (screen === 'amnio' && risk === 'high') plan = 'amniocentesis-and-cytogenetics';
  else if (screen === 'NIPT' && risk === 'low') plan = 'NIPT-and-standard-prenatal';
  else if (ultrasound === 'abnormal' && ga >= 18) plan = 'anatomy-ultrasound-and-eval';
  else if (ga < 12) plan = 'too-early-and-recheck';
  else plan = 'standard-screen';
  return { plan, recommendation: 'OB-and-genetic-counseling' };
};

Engine.FGR = function ({ estimatedGA = 32, actualGA = 32, abdominalCirc = 25, doppler = 'normal' } = {}) {
  let classification;
  if (estimatedGA < actualGA - 3) classification = 'severe-FGR-or-IUGR';
  else if (estimatedGA < actualGA - 2) classification = 'FGR-or-IUGR';
  else if (estimatedGA < actualGA - 1) classification = 'mild-FGR';
  else if (doppler === 'abnormal') classification = 'FGR-with-doppler-eval';
  else if (doppler === 'normal' && estimatedGA < actualGA) classification = 'constitutionally-small';
  else classification = 'normal-growth';
  return { classification, recommendation: 'MFM-and-doppler-surveillance' };
};

Engine.LaborMgmt = function ({ stage = 'active', dilation = 5, effacement = 60, fetalHR = 'reassuring' } = {}) {
  let plan;
  if (stage === 'active' && dilation >= 6 && fetalHR === 'reassuring') plan = 'active-labor-and-progress';
  else if (stage === 'active' && dilation < 6 && fetalHR === 'reassuring') plan = 'protraction-disorder-and-augmentation';
  else if (fetalHR === 'non-reassuring') plan = 'fetal-distress-and-immediate-delivery';
  else if (stage === 'latent' && dilation < 6) plan = 'latent-labor-and-observation';
  else if (stage === 'second' && dilation === 10) plan = 'second-stage-and-pushing';
  else plan = 'standard-labor-mgmt';
  return { plan, recommendation: 'OB-and-nursing' };
};

Engine.IntrapartumMonitor = function ({ baseline = 140, variability = 'moderate', decels = 'none', category = 'I' } = {}) {
  let result;
  if (category === 'I') result = 'category-I-and-continue-monitoring';
  else if (category === 'II' && decels === 'variable') result = 'category-II-and-resuscitation-and-eval';
  else if (category === 'II' && decels === 'late') result = 'category-II-and-position-and-O2';
  else if (category === 'II' && variability === 'minimal') result = 'category-II-and-scalp-stim';
  else if (category === 'III') result = 'category-III-and-immediate-delivery';
  else if (variability === 'absent') result = 'category-III-and-immediate';
  else result = 'unspecified-monitor';
  return { result, recommendation: 'OB-team-and-immediate-decision' };
};

Engine.PostpartumHemorrhage = function ({ ebl = 500, uterineTone = 'boggy', placenta = 'intact' } = {}) {
  let plan;
  if (ebl >= 1500 && uterineTone === 'boggy') plan = 'severe-PPH-and-bakri-or-hysterectomy';
  else if (ebl >= 1000) plan = 'PPH-and-uterotonics-and-balloon';
  else if (uterineTone === 'boggy' && placenta === 'intact') plan = 'uterine-atoniy-and-massage-and-uterotonics';
  else if (placenta === 'retained') plan = 'retained-placenta-and-D&C';
  else if (ebl >= 500) plan = 'PPH-and-evaluation';
  else plan = 'mild-bleeding-and-monitor';
  return { plan, recommendation: 'OB-team-and-blood-bank' };
};

Engine.PerinatalMental = function ({ edinburgh = 14, anxiety = 'high', support = 'limited', priorHistory = 'no' } = {}) {
  let plan;
  if (edinburgh >= 20) plan = 'severe-PPD-and-psych-and-SSRI';
  else if (edinburgh >= 13 && support === 'limited') plan = 'PPD-and-therapy-and-social-work';
  else if (priorHistory === 'yes' && edinburgh >= 13) plan = 'PPD-recurrence-and-psych';
  else if (anxiety === 'high' && edinburgh >= 10) plan = 'perinatal-anxiety-and-therapy';
  else if (support === 'limited' && edinburgh >= 10) plan = 'PPD-and-support-network';
  else if (edinburgh < 10) plan = 'low-risk-and-monitor';
  else plan = 'standard-screen';
  return { plan, recommendation: 'OB-psych-and-social-work' };
};

Engine.PerinatalOutcome = function ({ gaBirth = 39, birthWeight = 3200, apgar5 = 8, breastfeeding = 'yes', maternalComp = 'none' } = {}) {
  let result;
  if (gaBirth >= 39 && birthWeight >= 2500 && apgar5 >= 8 && maternalComp === 'none') result = 'optimal-perinatal-outcome';
  else if (gaBirth >= 37 && birthWeight >= 2500 && apgar5 >= 7) result = 'standard-perinatal-outcome';
  else if (gaBirth >= 35) result = 'late-preterm-and-monitoring';
  else if (gaBirth < 35) result = 'preterm-and-NICU';
  else if (maternalComp === 'severe') result = 'maternal-complication-and-eval';
  else if (apgar5 < 4) result = 'low-apgar-and-resuscitation-and-NICU';
  else result = 'unspecified';
  return { result, recommendation: 'standard-or-specialty-followup' };
};

module.exports = Engine;
