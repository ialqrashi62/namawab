// P3-AQ: ECMO-Service Engine — 10 pure functions
const Engine = {};

Engine.ECMOIndication = function ({ indication = 'cardiac', age = 50, comorbidities = 'none', cardiopulmonaryBypass = false } = {}) {
  let pathway;
  if (indication === 'cardiac' && cardiopulmonaryBypass) pathway = 'VA-ECMO-postcardiotomy';
  else if (indication === 'cardiac' && age < 70) pathway = 'VA-ECMO-cardiogenic-shock';
  else if (indication === 'cardiac' && age >= 70) pathway = 'VA-ECMO-age-caution';
  else if (indication === 'respiratory' && age < 65) pathway = 'VV-ECMO-ARDS';
  else if (indication === 'respiratory' && age >= 65) pathway = 'VV-ECMO-age-caution';
  else if (indication === 'ecpr') pathway = 'VA-ECMO-extracorporeal-CPR';
  else if (indication === 'septic') pathway = 'VA-ECMO-septic-shock-experimental';
  else pathway = 'consider-ECMO-MDT';
  if (comorbidities === 'severe') pathway += '-comorbidities-discouraged';
  return { pathway, recommendation: pathway.includes('discouraged') ? 'palliative-care' : 'ECMO-team-evaluation' };
};

Engine.ECMOContraindication = function ({ age = 50, comorbidities = 'none', cprDuration = 0, gcs = 15, multiorganFailure = false } = {}) {
  let absolute;
  let relative;
  if (age > 75) absolute = 'age-75-or-older-relative';
  if (comorbidities === 'terminal-cancer' || comorbidities === 'end-stage') absolute = 'terminal-illness';
  if (cprDuration > 60) relative = 'prolonged-CPR-consider-termination';
  if (gcs < 5) absolute = 'severe-anoxic-brain-injury';
  if (multiorganFailure) relative = 'multi-organ-failure';
  return { absolute, relative, recommendation: absolute ? 'do-not-initiate-ECMO' : (relative ? 'consider-carefully' : 'ECMO-candidate') };
};

Engine.VAECMONativeHeartRecovery = function ({ lvef = 30, aorticValveOpen = true, pulsatility = 'present', lactate = 1.0, daysOnECMO = 5 } = {}) {
  let recoveryChance;
  if (lvef >= 50 && pulsatility === 'strong' && lactate < 1.5) recoveryChance = 'excellent-recovery-consider-weaning';
  else if (lvef >= 35 && lactate < 2.0) recoveryChance = 'good-recovery-trial-off';
  else if (lvef >= 25 && daysOnECMO < 7) recoveryChance = 'moderate-recovery-uncertain';
  else if (lvef < 25 && daysOnECMO >= 7) recoveryChance = 'poor-recovery-consider-LVAD-or-transplant';
  else recoveryChance = 'unknown-evaluate-daily';
  if (!aorticValveOpen) recoveryChance += '-aortic-valve-closure-issue';
  return { recoveryChance, recommendation: recoveryChance.includes('weaning') || recoveryChance.includes('trial-off') ? 'wean-protocol' : 'continue-and-evaluate' };
};

Engine.VVECMOWeaning = function ({ pao2 = 80, fio2 = 0.5, peep = 10, tidalVolume = 6, daysOnECMO = 7, secretions = 'manageable' } = {}) {
  let ready;
  if (pao2 >= 80 && fio2 <= 0.5 && tidalVolume >= 6 && secretions === 'manageable' && daysOnECMO >= 5) ready = 'ready-to-wean-VV-ECMO';
  else if (pao2 >= 70 && fio2 <= 0.6) ready = 'consider-weaning';
  else if (pao2 < 60) ready = 'not-ready-severe-hypoxemia';
  else ready = 'monitor-and-optimize';
  return { ready, recommendation: ready.includes('ready') || ready.includes('consider') ? 'wean-protocol' : 'continue-ECMO' };
};

Engine.ECMOComplication = function ({ oxygenatorFailure = false, pumpFailure = false, bleeding = false, thrombosis = false, hemolysis = false, infection = false } = {}) {
  let severity;
  if (pumpFailure) severity = 'catastrophic-pump-failure-emergent-circuit-change';
  else if (oxygenatorFailure) severity = 'oxygenator-failure-replace';
  else if (thrombosis) severity = 'circuit-thrombosis-evaluate-and-treat';
  else if (hemolysis) severity = 'hemolysis-check-flow-and-suction';
  else if (bleeding) severity = 'bleeding-reduce-heparin-or-transfuse';
  else if (infection) severity = 'cannula-infection-antibiotics';
  else severity = 'no-complication';
  return { severity, recommendation: severity.includes('catastrophic') || severity.includes('replace') ? 'emergent-circuit-replacement' : 'monitor' };
};

Engine.AnticoagulationECMO = function ({ mode = 'VA', target = 'aPTT', aPTT = 50, antiXa = 0.3, bleeding = false, thrombocytopenia = false } = {}) {
  let pathway;
  if (bleeding) pathway = 'hold-anticoagulation-and-transfuse';
  else if (thrombocytopenia) pathway = 'reduce-target-and-platelet-transfusion';
  else if (target === 'aPTT' && (aPTT < 45 || aPTT > 70)) pathway = 'adjust-heparin-to-target';
  else if (target === 'antiXa' && (antiXa < 0.2 || antiXa > 0.4)) pathway = 'adjust-heparin-to-antiXa';
  else pathway = 'maintain-anticoagulation';
  return { pathway, recommendation: pathway.includes('adjust') ? 'titrate-heparin' : pathway.includes('hold') ? 'hold-and-monitor' : 'continue' };
};

Engine.ECMOSedation = function ({ agitation = 'mild', painScore = 4, paralysisNeeded = false, daysOnECMO = 5 } = {}) {
  let regimen;
  if (paralysisNeeded) regimen = 'deep-sedation-plus-paralysis-cisatracurium';
  else if (daysOnECMO < 3) regimen = 'moderate-sedation-propofol-or-dexmedetomidine';
  else if (agitation === 'severe') regimen = 'deep-sedation-and-pain-control';
  else if (painScore >= 6) regimen = 'adequate-analgesia-fentanyl-and-low-sedation';
  else regimen = 'light-sedation-dexmedetomidine';
  return { regimen, recommendation: 'daily-sedation-vacation-if-stable' };
};

Engine.ECMOWeaningTrial = function ({ pumpFlow = 3, oxygenatorSweep = 2, hemodynamicsStable = true, ejectionFraction = 30, lactate = 1.0 } = {}) {
  let trial;
  if (pumpFlow >= 3 && hemodynamicsStable && ejectionFraction >= 30 && lactate < 1.5) trial = 'eligible-for-trial-off';
  else if (ejectionFraction < 25) trial = 'not-eligible-low-EF';
  else if (lactate >= 2.0) trial = 'not-eligible-hyperlactatemia';
  else if (!hemodynamicsStable) trial = 'not-eligible-hemodynamic-instability';
  else trial = 'continue-and-reassess';
  return { trial, recommendation: trial.includes('eligible') ? 'trial-off-protocol' : 'continue-ECMO' };
};

Engine.PediatricECMO = function ({ age = 5, weight = 20, indication = 'respiratory', daysOnECMO = 0, circuitType = 'VV' } = {}) {
  let pathway;
  if (age < 1) pathway = 'neonatal-ECMO-specialized-center';
  else if (weight < 5) pathway = 'small-pediatric-ECMO-experienced-center';
  else if (indication === 'cdh') pathway = 'CDH-ECMO-protocol';
  else if (indication === 'respiratory' && daysOnECMO < 14) pathway = 'pediatric-VV-ECMO-ARDS';
  else if (indication === 'cardiac') pathway = 'pediatric-VA-ECMO-cardiac';
  else if (indication === 'ecpr') pathway = 'pediatric-ECPR-ECMO';
  else if (daysOnECMO >= 14) pathway = 'prolonged-ECMO-evaluate-goals';
  else pathway = 'pediatric-ECMO-MDT';
  return { pathway, recommendation: pathway.includes('specialized') || pathway.includes('experienced') ? 'transfer-to-pediatric-ECMO-center' : 'continue-ECMO' };
};

Engine.ECMOOutcomes = function ({ indication = 'cardiac', age = 50, daysOnECMO = 5, complications = 0, bridgeToRecovery = true } = {}) {
  let survival;
  if (indication === 'respiratory' && age < 50 && daysOnECMO < 14 && complications === 0) survival = 'good-70-80-percent-survival';
  else if (indication === 'cardiac' && bridgeToRecovery && daysOnECMO < 7) survival = 'moderate-40-60-percent-survival';
  else if (indication === 'ecpr') survival = 'low-20-30-percent-survival';
  else if (complications >= 2) survival = 'poor-survival-with-complications';
  else if (age >= 70) survival = 'poor-30-40-percent-survival';
  else survival = 'moderate-survival';
  return { survival, recommendation: 'multidisciplinary-daily-goals-of-care' };
};

module.exports = Engine;
