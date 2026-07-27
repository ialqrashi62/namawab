// P3-AV: Cardiac-Rehab Engine — 10 pure functions
const Engine = {};

Engine.CRPhase = function ({ phase = 1, daysPostMI = 5, ejectionFraction = 40, surgicalStatus = 'none' } = {}) {
  let phase1;
  if (phase === 1 || (daysPostMI < 14 && surgicalStatus === 'post-surgery')) phase1 = 'phase-1-inpatient-early-mobilization';
  else if (phase === 2 && daysPostMI >= 14 && daysPostMI < 84) phase1 = 'phase-2-early-outpatient-supervised-exercise';
  else if (phase === 3 && daysPostMI >= 84) phase1 = 'phase-3-late-outpatient-maintenance';
  else if (phase === 4) phase1 = 'phase-4-lifetime-maintenance';
  else if (ejectionFraction < 30) phase1 = 'phase-1-extended-or-heart-failure-track';
  else phase1 = 'unspecified-phase';
  return { phase1, recommendation: 'individualized-CR-protocol' };
};

Engine.ExercisePrescriptionMET = function ({ age = 50, maxHR = 170, restHR = 70, fit = 'moderate' } = {}) {
  const hrr = maxHR - restHR;
  let targetHR;
  if (fit === 'high') targetHR = restHR + hrr * 0.8;
  else if (fit === 'moderate') targetHR = restHR + hrr * 0.7;
  else if (fit === 'low') targetHR = restHR + hrr * 0.5;
  else targetHR = restHR + hrr * 0.6;
  const targetMET = fit === 'high' ? 7 : (fit === 'moderate' ? 5 : 3);
  return { targetHR: Math.round(targetHR), targetMET, recommendation: 'exercise-30-45-min-3-to-5-days-per-week' };
};

Engine.CardiopulmonaryExerciseTest = function ({ vo2max = 20, predictedVo2 = 30, rER = 1.0 } = {}) {
  let classification;
  if (vo2max / predictedVo2 >= 0.85) classification = 'normal-or-above-expected';
  else if (vo2max / predictedVo2 >= 0.7) classification = 'mildly-decreased';
  else if (vo2max / predictedVo2 >= 0.5) classification = 'moderately-decreased';
  else if (vo2max / predictedVo2 >= 0.3) classification = 'severely-decreased';
  else classification = 'very-severely-decreased';
  return { vo2max, percentPredicted: Math.round((vo2max / predictedVo2) * 100), classification, recommendation: classification.includes('normal') ? 'no-exercise-restriction' : 'structured-CR-protocol' };
};

Engine.RiskStratificationCR = function ({ ejectionFraction = 40, angina = false, arrhythmia = false, diabetes = false, age = 65 } = {}) {
  let risk;
  if (ejectionFraction < 30) risk = 'high-risk-CR-supervised';
  else if (arrhythmia || angina) risk = 'moderate-to-high-risk';
  else if (diabetes && age >= 70) risk = 'moderate-risk-CR-supervised';
  else if (diabetes || age >= 70) risk = 'moderate-risk-monitored';
  else if (ejectionFraction < 50) risk = 'low-moderate-risk';
  else risk = 'low-risk-CR-eligible';
  return { risk, recommendation: 'supervised-CR-program-with-telemetry-if-high-risk' };
};

Engine.CREnrollment = function ({ indication = 'post-MI', ejectionFraction = 40, age = 65, motivated = true } = {}) {
  let eligibility;
  if (indication === 'post-MI' || indication === 'post-PCI' || indication === 'post-CABG') eligibility = 'CR-class-I-indicated';
  else if (indication === 'stable-angina' || indication === 'CHF-EF-35-or-less') eligibility = 'CR-class-IIa-recommended';
  else if (indication === 'high-risk-prevention') eligibility = 'CR-class-IIb-consider';
  else eligibility = 'CR-not-indicated';
  const factors = motivated && age < 75 && ejectionFraction >= 30;
  return { eligibility, enrollmentLikely: factors, recommendation: 'refer-to-CR-and-track-enrollment' };
};

Engine.ExerciseResponse = function ({ heartRateDuring = 130, heartRateRest = 70, bpChange = 20, spo2 = 95, rpe = 14 } = {}) {
  let response;
  if (rpe >= 17 || heartRateDuring > 0.85 * (220 - 65)) response = 'high-intensity-stop-or-reduce';
  else if (rpe >= 13 || bpChange >= 30) response = 'vigorous-monitor-closely';
  else if (spo2 < 88) response = 'desaturation-stop-and-O2';
  else if (rpe >= 10) response = 'moderate-appropriate-target';
  else if (rpe < 10) response = 'low-intensity-increase-workload';
  else response = 'appropriate';
  return { response, recommendation: response.includes('stop') ? 'stop-exercise-and-evaluate' : 'continue-and-monitor' };
};

Engine.HeartFailureRehab = function ({ ejectionFraction = 30, nyha = 2, fitzgerald = 'fragile' } = {}) {
  let plan;
  if (ejectionFraction < 25) plan = 'CR-with-telemetry-and-ICD-consider';
  else if (ejectionFraction < 35 && nyha >= 3) plan = 'CR-supervised-and-advanced-HF-team';
  else if (ejectionFraction < 35) plan = 'CR-supervised-EF-recovery-track';
  else if (nyha <= 2) plan = 'CR-Phase-2-3-standard-protocol';
  else plan = 'CR-and-HF-team';
  if (fitzgerald === 'fragile') plan += '-with-low-intensity-start';
  return { plan, recommendation: 'CR-team-and-HF-cardiologist' };
};

Engine.PostCABGRehab = function ({ weeksPost = 2, sternalPrecautions = true, ejectionFraction = 45, walkDistance = 100 } = {}) {
  let status;
  if (weeksPost < 4 && sternalPrecautions) status = 'early-recovery-sternal-precautions-6-to-8-weeks';
  else if (weeksPost < 8 && sternalPrecautions) status = 'mid-recovery-sternal-precautions-and-gradual-activity';
  else if (weeksPost >= 8 && walkDistance >= 300) status = 'late-recovery-return-to-activity';
  else if (ejectionFraction < 35) status = 'post-CABG-and-low-EF-team-management';
  else status = 'standard-CR-Phase-2-3';
  return { status, recommendation: 'CR-team-and-cardiac-surgeon-clearance' };
};

Engine.PADExercise = function ({ claudicationDistance = 200, abi = 0.6, supervised = true } = {}) {
  let plan;
  if (supervised && abi < 0.9) plan = 'supervised-PAD-CR-walk-rest-walk-protocol';
  else if (supervised) plan = 'supervised-PAD-walking-program';
  else if (claudicationDistance < 200) plan = 'home-walking-program-short-intervals';
  else plan = 'home-walking-30-min-3-to-5-days-per-week';
  return { plan, recommendation: 'PAD-walking-program-with-vascular-clearance' };
};

Engine.CardiomyopathyExercise = function ({ cardiomyopathy = 'HCM', ejectionFraction = 55, familyHistory = false, arrhythmia = 'none' } = {}) {
  let plan;
  if (cardiomyopathy === 'HCM' && familyHistory) plan = 'avoid-competitive-sports-and-ICD-consider';
  else if (cardiomyopathy === 'HCM' && arrhythmia === 'VT') plan = 'restrict-athletic-activity-and-ICD-consider';
  else if (cardiomyopathy === 'DCM' && ejectionFraction < 35) plan = 'low-intensity-CR-with-ICD-team';
  else if (arrhythmia === 'VT') plan = 'CR-team-and-electrophysiology';
  else if (ejectionFraction >= 50) plan = 'standard-CR-eligible';
  else plan = 'individualized-CR-protocol';
  return { plan, recommendation: 'cardiomyopathy-team-and-CR' };
};

Engine.PediatricCardiacRehab = function ({ age = 8, surgery = 'repair-TOF', weeksPost = 4, parentAvailable = true } = {}) {
  let plan;
  if (age < 5 && surgery === 'single-ventricle') plan = 'pediatric-CR-with-Fontan-protocol';
  else if (age < 5) plan = 'pediatric-CR-with-parent-accompaniment';
  else if (age < 12 && parentAvailable) plan = 'pediatric-CR-with-parent-supervision';
  else if (surgery === 'repair-TOF' && weeksPost >= 6) plan = 'pediatric-CR-standard-protocol';
  else plan = 'pediatric-CR-graded-return-to-activity';
  return { plan, recommendation: 'pediatric-cardiac-team-and-CR' };
};

module.exports = Engine;
