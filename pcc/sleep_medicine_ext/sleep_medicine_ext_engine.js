// P3-BD: Sleep-Medicine-Ext Engine — 10 pure functions
const Engine = {};

Engine.Polysomnography = function ({ ahi = 12, sleepEfficiency = 80, arousalIndex = 15, sleepStage = 'reduced-REM' } = {}) {
  let diagnosis;
  if (ahi >= 30) diagnosis = 'severe-OSA';
  else if (ahi >= 15) diagnosis = 'moderate-OSA';
  else if (ahi >= 5) diagnosis = 'mild-OSA';
  else if (ahi < 5 && sleepEfficiency < 70) diagnosis = 'no-OSA-but-insomnia-eval';
  else diagnosis = 'normal-PSG';
  if (arousalIndex >= 25) diagnosis = 'severe-RLS-or-PLMD-eval';
  return { diagnosis, recommendation: 'sleep-medicine-eval-and-treatment' };
};

Engine.OSATreatment = function ({ ahi = 12, bmi = 30, position = 'supine', priorCPAP = 'naive', anatomy = 'normal' } = {}) {
  let plan;
  if (ahi >= 30 && bmi >= 35) plan = 'CPAP-or-bariatric-and-sleep-surgery';
  else if (ahi >= 15 && bmi < 35) plan = 'CPAP-and-weight-loss';
  else if (position === 'supine' && ahi < 15) plan = 'positional-therapy-and-OAS';
  else if (anatomy === 'crowded' && ahi >= 15) plan = 'UPPP-or-MMA-surgery-eval';
  else if (ahi >= 5) plan = 'CPAP-and-OAS-and-followup';
  else if (priorCPAP === 'tried-failed') plan = 'oral-appliance-or-hypoglossal-stim';
  else plan = 'weight-loss-and-monitoring';
  return { plan, recommendation: 'CPAP-titration-and-sleep-clinic' };
};

Engine.CPAPAdherence = function ({ hoursPerNight = 4, daysUsed = 24, residualAHI = 4 } = {}) {
  let adherence;
  if (hoursPerNight >= 4 && daysUsed >= 21) adherence = 'excellent-CPAP-adherence-CMS-compliant';
  else if (hoursPerNight >= 3 && daysUsed >= 14) adherence = 'good-CPAP-adherence';
  else if (hoursPerNight >= 2) adherence = 'partial-CPAP-adherence-and-eval';
  else if (hoursPerNight < 2) adherence = 'poor-CPAP-adherence-and-barriers';
  else if (residualAHI >= 10) adherence = 'CPAP-not-controlled-re-eval';
  else adherence = 'monitor-and-evaluate';
  return { adherence, recommendation: 'CPAP-clinician-and-mask-fit' };
};

Engine.InsomniaCBTI = function ({ sleepLatency = 60, wakeAfterSleep = 60, totalSleep = 5, sleepAid = 'Z-drug' } = {}) {
  let plan;
  if (sleepLatency >= 30 && wakeAfterSleep >= 30) plan = 'CBT-I-with-stimulus-control-and-restriction';
  else if (sleepAid === 'Z-drug' || sleepAid === 'benzo') plan = 'CBT-I-and-taper-Z-drug';
  else if (totalSleep < 5) plan = 'CBT-I-and-sleep-restriction';
  else if (sleepLatency >= 30) plan = 'CBT-I-sleep-hygiene-and-cognitive';
  else plan = 'sleep-hygiene-and-monitor';
  return { plan, recommendation: 'CBT-I-certified-provider-and-6-to-8-weeks' };
};

Engine.CircadianDisorder = function ({ shiftWork = 'no', jetLag = 'no', delayedPhase = 'no', advancedPhase = 'no' } = {}) {
  let diagnosis;
  if (shiftWork === 'yes') diagnosis = 'shift-work-disorder';
  else if (jetLag === 'yes') diagnosis = 'jet-lag-disorder';
  else if (delayedPhase === 'yes') diagnosis = 'delayed-sleep-phase';
  else if (advancedPhase === 'yes') diagnosis = 'advanced-sleep-phase';
  else diagnosis = 'unspecified-circadian-eval';
  return { diagnosis, recommendation: 'chronotherapy-and-melatonin' };
};

Engine.PediatricSleep = function ({ age = 5, parasomnia = 'night-terrors', apnea = 'no', bedtimeResistance = 'no' } = {}) {
  let plan;
  if (apnea === 'yes' && age < 6) plan = 'pediatric-OSA-eval-and-AT';
  else if (parasomnia === 'night-terrors' && age < 8) plan = 'reassure-and-sleep-hygiene';
  else if (parasomnia === 'sleepwalking' && age < 12) plan = 'safety-and-sleep-hygiene';
  else if (bedtimeResistance === 'yes') plan = 'behavioral-intervention-and-graduated-extinction';
  else if (parasomnia === 'nightmares' && age < 12) plan = 'image-rehearsal-therapy';
  else plan = 'standard-pediatric-sleep';
  return { plan, recommendation: 'pediatric-sleep-medicine-and-parent-counsel' };
};

Engine.Narcolepsy = function ({ cataplexy = 'no', eds = 'severe', sleepOnset = 'rapid', hallucinations = 'no' } = {}) {
  let diagnosis;
  if (cataplexy === 'yes' && eds === 'severe') diagnosis = 'narcolepsy-type-1';
  else if (cataplexy === 'no' && eds === 'severe' && sleepOnset === 'rapid') diagnosis = 'narcolepsy-type-2';
  else if (eds === 'moderate' && sleepOnset === 'rapid') diagnosis = 'narcolepsy-or-IH-eval';
  else if (hallucinations === 'yes' && cataplexy === 'yes') diagnosis = 'narcolepsy-type-1-with-hallucinations';
  else diagnosis = 'unspecified-EDS-eval';
  return { diagnosis, recommendation: 'MSLT-and-sleep-specialist' };
};

Engine.RestlessLegs = function ({ urge = 'yes', worseAtRest = 'yes', reliefWithMovement = 'yes', ferritin = 25 } = {}) {
  let diagnosis;
  if (urge === 'yes' && worseAtRest === 'yes' && reliefWithMovement === 'yes') diagnosis = 'RLS-by-URGE';
  else if (ferritin < 50) diagnosis = 'RLS-with-iron-deficiency';
  else diagnosis = 'unspecified-RLS-or-mimic';
  return { diagnosis, recommendation: 'iron-supplementation-and-D2-agonist-or-alpha-2-delta' };
};

Engine.SleepAndMed = function ({ med = 'SSRI', insomnia = 'moderate', sedating = 'no' } = {}) {
  let plan;
  if (med === 'SSRI' && insomnia === 'moderate') plan = 'mirtazapine-eval-or-bupropion';
  else if (med === 'SSRI' && insomnia === 'severe') plan = 'low-dose-mirtazapine-or-trazodone';
  else if (med === 'stimulant' && insomnia === 'severe') plan = 'sleep-hygiene-and-melatonin';
  else if (med === 'opiate' && insomnia === 'moderate') plan = 'sleep-apnea-screen-eval';
  else if (sedating === 'yes' && insomnia === 'mild') plan = 'accept-as-benefit';
  else plan = 'standard-pharm-and-sleep-eval';
  return { plan, recommendation: 'pharmacy-and-sleep-medicine' };
};

Engine.SleepOutcome = function ({ preISI = 22, postISI = 10, preESS = 18, postESS = 8, weeksElapsed = 8 } = {}) {
  const isiDelta = preISI - postISI;
  const isiPct = (isiDelta / preISI) * 100;
  const essDelta = preESS - postESS;
  let result;
  if (isiPct >= 50 && essDelta >= 5) result = 'large-sleep-and-daytime-improvement';
  else if (isiPct >= 30 || essDelta >= 3) result = 'moderate-improvement';
  else if (isiPct >= 10 || essDelta >= 1) result = 'small-improvement';
  else if (isiPct < 0) result = 'no-improvement-or-worsening';
  else result = 'plateau-or-stable';
  return { isiDelta, isiPct: Math.round(isiPct), essDelta, result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintain-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
