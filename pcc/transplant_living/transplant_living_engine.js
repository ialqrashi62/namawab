// P3-BE: Transplant-Living Engine — 10 pure functions
const Engine = {};

Engine.LivingDonorWorkup = function ({ age = 35, bmi = 25, gfr = 100, comorbidities = 'none', motivation = 'high' } = {}) {
  let workup;
  if (gfr < 90 || bmi >= 35) workup = 'high-risk-living-donor-and-discourage';
  else if (comorbidities === 'diabetic') workup = 'diabetic-and-living-donor-individualized';
  else if (comorbidities === 'hypertensive' && age < 50) workup = 'HTN-and-living-donor-individualized';
  else if (motivation === 'coerced' || motivation === 'low') workup = 'psych-eval-and-defer';
  else if (age < 25) workup = 'young-donor-and-decisional-capacity-eval';
  else if (age >= 60) workup = 'older-donor-and-cardiac-eval';
  else if (gfr >= 90 && bmi < 35 && comorbidities === 'none') workup = 'standard-living-donor-workup';
  else workup = 'individualized-living-donor-workup';
  return { workup, recommendation: 'multidisciplinary-team-and-IDLA' };
};

Engine.DonorNephrectomy = function ({ side = 'left', technique = 'lap', vasculature = 'normal', priorSurgery = 'none' } = {}) {
  let plan;
  if (side === 'left' && technique === 'lap' && vasculature === 'normal') plan = 'standard-lap-left-donor-nephrectomy';
  else if (technique === 'open') plan = 'open-donor-nephrectomy-and-recovery';
  else if (vasculature === 'multiple-arteries') plan = 'multiple-arteries-and-microscopic-anastomosis';
  else if (priorSurgery === 'yes') plan = 're-do-donor-nephrectomy-and-better-experience';
  else if (side === 'right' && vasculature === 'normal') plan = 'right-donor-nephrectomy-and-short-vein';
  else if (technique === 'robotic') plan = 'robotic-donor-nephrectomy';
  else plan = 'standard-donor-nephrectomy';
  return { plan, recommendation: 'minimally-invasive-and-minimal-morbidity' };
};

Engine.PairedExchange = function ({ donor = 'spouse', recipient = 'O', donorBlood = 'A', pairedWith = 'none' } = {}) {
  let plan;
  if (donorBlood === recipient) plan = 'no-exchange-needed-ABO-compatible';
  else if (donorBlood === 'O' || recipient === 'AB') plan = 'no-exchange-needed-universal';
  else if (pairedWith === 'available') plan = 'paired-exchange-and-NEPKE';
  else if (pairedWith === 'chain') plan = 'domino-chain-and-NEPKE';
  else if (donor === 'spouse' && donorBlood === 'A' && recipient === 'O') plan = 'paired-exchange-candidate-and-NEPKE';
  else if (donorBlood === 'B' && recipient === 'O') plan = 'paired-exchange-or-ABOi';
  else plan = 'individualized-exchange-or-ABOi-or-A2B';
  return { plan, recommendation: 'NEPKE-and-transplant-team' };
};

Engine.LivingDonorFollowup = function ({ monthsPost = 6, gfr = 70, hypertension = 'no', recovery = 'full' } = {}) {
  let plan;
  if (monthsPost < 3 && gfr >= 60) plan = 'early-post-donation-and-6-week-eval';
  else if (monthsPost < 12 && gfr >= 60) plan = 'standard-6-month-followup';
  else if (gfr < 60) plan = 'low-GFR-and-nephrology-referral';
  else if (hypertension === 'yes' && monthsPost >= 6) plan = 'HTN-developing-and-treatment';
  else if (recovery === 'incomplete' && monthsPost >= 6) plan = 'incomplete-recovery-and-eval';
  else if (monthsPost >= 12 && gfr >= 60) plan = 'annual-followup-and-long-term';
  else plan = 'standard-living-donor-followup';
  return { plan, recommendation: 'donor-advocate-and-long-term-CKD-screen' };
};

Engine.ABOiTransplant = function ({ donorTiter = 64, recipientTiter = 128, plasmapheresis = 'available' } = {}) {
  let plan;
  if (recipientTiter >= 256) plan = 'high-titer-ABOi-and-individualized-or-defer';
  else if (plasmapheresis === 'available' && recipientTiter < 128) plan = 'ABOi-eligible-and-plasmapheresis-and-IVIG';
  else if (donorTiter >= 128) plan = 'high-donor-titer-and-eval';
  else if (recipientTiter < 64 && plasmapheresis === 'available') plan = 'low-titer-ABOi-eligible';
  else plan = 'standard-ABOi-protocol';
  return { plan, recommendation: 'transplant-team-and-individualized' };
};

Engine.Desensitization = function ({ titer = 128, priorTransplant = 'no', plasmapheresis = 'yes', rituximab = 'available' } = {}) {
  let plan;
  if (titer >= 1024) plan = 'high-titer-and-intensive-desensitization';
  else if (titer >= 256 && plasmapheresis === 'yes' && rituximab === 'available') plan = 'standard-desensitization-and-plasmapheresis-and-IVIG';
  else if (titer >= 64 && priorTransplant === 'yes') plan = 'recall-antigen-and-eval';
  else if (titer < 64) plan = 'low-titer-and-acceptable';
  else plan = 'standard-desensitization';
  return { plan, recommendation: 'transplant-team-and-IVIG-or-rituximab' };
};

Engine.LDRecipient = function ({ donor = 'living', donorRelation = 'related', isKPD = 'no', induction = 'anti-thymo' } = {}) {
  let plan;
  if (donorRelation === 'related' && induction === 'anti-thymo') plan = 'standard-LD-kidney-and-rATG-induction';
  else if (donorRelation === 'unrelated-spouse' && isKPD === 'no') plan = 'LURD-and-standard-induction';
  else if (isKPD === 'yes') plan = 'KPD-and-similar-induction';
  else if (donor === 'living' && donorRelation === 'LRD') plan = 'LRD-and-standard-care';
  else if (induction === 'basiliximab') plan = 'low-immunologic-risk-and-basiliximab';
  else if (induction === 'alemtuzumab') plan = 'high-immunologic-risk-and-alemtuzumab';
  else plan = 'standard-LD-recipient';
  return { plan, recommendation: 'transplant-team-and-immunologic-risk' };
};

Engine.LDOutcomes = function ({ donorComplication = 'none', recipient1YrGraft = 95, recipientReturnToHD = 'no', donorGFR = 70 } = {}) {
  let result;
  if (donorComplication === 'none' && recipient1YrGraft >= 95 && donorGFR >= 60) result = 'excellent-LD-outcome';
  else if (recipient1YrGraft >= 90) result = 'good-LD-outcome';
  else if (recipientReturnToHD === 'yes' && recipient1YrGraft < 50) result = 'graft-loss-and-eval';
  else if (donorComplication === 'severe') result = 'donor-morbidity-and-eval';
  else if (donorGFR < 60) result = 'donor-low-GFR-and-eval';
  else result = 'standard-LD-outcome';
  return { result, recommendation: 'donor-team-and-recipient-team' };
};

Engine.LDRecipientDose = function ({ weight = 70, induction = 'rATG', totalDose = 6 } = {}) {
  let plan;
  if (induction === 'rATG' && totalDose === 6) plan = 'rATG-1.5-mg-kg-total-6-mg-kg-divided';
  else if (induction === 'alemtuzumab') plan = 'alemtuzumab-30-mg-single-dose';
  else if (induction === 'basiliximab') plan = 'basiliximab-20-mg-2-doses';
  else if (induction === 'rATG' && totalDose < 4) plan = 'low-rATG-and-immunologic-risk-low';
  else if (induction === 'rATG' && totalDose >= 8) plan = 'high-rATG-and-immunologic-risk-high';
  else plan = 'standard-induction';
  return { plan, recommendation: 'transplant-pharm-and-team' };
};

Engine.LDComplications = function ({ complication = 'none', weeksPost = 4, severity = 'mild', graftFunction = 'stable' } = {}) {
  let plan;
  if (complication === 'ureteral-stricture' && weeksPost < 12) plan = 'ureteral-stent-or-pyelogram';
  else if (complication === 'lymphocele') plan = 'lymphocele-drain-or-marsupialize';
  else if (complication === 'wound-infection') plan = 'wound-I&D-and-ABX';
  else if (complication === 'DVT') plan = 'anticoagulation-and-eval';
  else if (complication === 'pneumonia' && severity === 'severe') plan = 'pneumonia-and-IV-ABX';
  else if (complication === 'none' && graftFunction === 'stable') plan = 'no-complication-and-routine-care';
  else plan = 'standard-eval';
  return { plan, recommendation: 'transplant-surgery-and-team' };
};

module.exports = Engine;
