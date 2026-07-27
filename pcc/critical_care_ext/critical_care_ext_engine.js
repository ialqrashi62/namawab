// P3-AR: Critical-Care-Ext Engine — 10 pure functions
const Engine = {};

Engine.ARDSAssessment = function ({ pao2 = 80, fio2 = 0.5, peep = 5, bilateral = true, acute = true } = {}) {
  const pfRatio = pao2 / fio2;
  let severity;
  if (pfRatio < 100) severity = 'severe-ARDS-PEEP-15';
  else if (pfRatio < 200) severity = 'moderate-ARDS-PEEP-10';
  else if (pfRatio < 300) severity = 'mild-ARDS-PEEP-5';
  else severity = 'no-ARDS';
  const peepOk = (severity.includes('severe') && peep >= 12) || (severity.includes('moderate') && peep >= 8) || (severity.includes('mild') && peep >= 5);
  return { pfRatio: Math.round(pfRatio), severity, peepOk, recommendation: severity.includes('severe') ? 'VV-ECMO-consider' : 'lung-protective-ventilation' };
};

Engine.Sepsis1Hour = function ({ lactate = 1.0, fluidsReceived = 0, hypotension = false, antibioticGiven = false, culturesDrawn = false } = {}) {
  let compliance;
  const items = [];
  if (lactate > 2) items.push('lactate-measured');
  else items.push('lactate-not-measured-needed');
  if (fluidsReceived >= 30) items.push('fluids-30ml-per-kg-given');
  else items.push('fluids-insufficient');
  if (antibioticGiven) items.push('antibiotics-given');
  else items.push('antibiotics-needed');
  if (culturesDrawn) items.push('cultures-drawn');
  else items.push('cultures-needed');
  if (hypotension && fluidsReceived >= 30 && !antibioticGiven) compliance = 'sepsis-bundle-incomplete';
  else if (lactate > 4 && hypotension) compliance = 'septic-shock-monitor';
  else compliance = 'sepsis-bundle-partial-or-complete';
  return { compliance, items, recommendation: compliance.includes('incomplete') ? 'complete-1-hour-bundle' : 'continue' };
};

Engine.ShockVasopressor = function ({ map = 65, sbp = 100, lactate = 1.0, norepinephrineDose = 0, vasopressin = false, cardiacOutput = 5 } = {}) {
  let pathway;
  if (map < 65 && norepinephrineDose === 0) pathway = 'start-norepinephrine';
  else if (map < 65 && norepinephrineDose < 0.1) pathway = 'increase-norepinephrine-low-dose';
  else if (map < 65 && norepinephrineDose >= 0.1 && norepinephrineDose < 0.25) pathway = 'add-vasopressin-and-increase-norepi';
  else if (map < 65 && norepinephrineDose >= 0.25) pathway = 'add-hydroxocobalamin-or-angiotensin-II';
  else if (lactate > 4 && cardiacOutput < 2.5) pathway = 'cardiogenic-shock-add-dobutamine';
  else if (lactate > 4 && cardiacOutput >= 2.5) pathway = 'distributive-shock-consider-cortisol';
  else pathway = 'maintain-current';
  return { pathway, recommendation: pathway.includes('start') || pathway.includes('add') || pathway.includes('increase') ? 'titrate-vasopressors' : 'monitor' };
};

Engine.WeaningLiberation = function ({ fio2 = 0.4, peep = 5, mental = 'alert', pressureSupport = 8, rsbi = 50, secretionLoad = 'low' } = {}) {
  let ready;
  if (fio2 <= 0.4 && peep <= 5 && mental === 'alert' && pressureSupport <= 8 && rsbi <= 105) ready = 'ready-for-spontaneous-breathing-trial';
  else if (fio2 > 0.5) ready = 'not-ready-high-FiO2';
  else if (peep > 8) ready = 'not-ready-high-PEEP';
  else if (rsbi > 105) ready = 'not-ready-rsbi-high';
  else if (secretionLoad === 'high') ready = 'not-ready-high-secretion';
  else ready = 'consider-trial';
  return { ready, recommendation: ready.includes('ready') || ready.includes('consider') ? 'SBT-and-extubate' : 'continue-vent' };
};

Engine.ICPManagement = function ({ icp = 15, cerebralPerfusionPressure = 70, gcs = 8, pupils = 'equal-reactive', treatment = 'none' } = {}) {
  let pathway;
  if (icp > 25) pathway = 'severe-ICP-hyperosmolar-and-consider-decompressive';
  else if (icp > 20) pathway = 'elevated-ICP-tier-2-treatment';
  else if (icp > 15) pathway = 'mild-ICP-tier-1-head-of-bed-sedation';
  else if (cerebralPerfusionPressure < 60 && icp <= 15) pathway = 'low-CPP-optimize-BP';
  else pathway = 'normal-ICP-and-CPP';
  if (pupils === 'unequal') pathway += '-and-unequal-pupils-evaluate';
  return { pathway, recommendation: pathway.includes('severe') || pathway.includes('unequal') ? 'neurosurgery-consult' : 'monitor' };
};

Engine.TBIAssessment = function ({ gcs = 8, pupil = 'equal', sbp = 100, hypoxia = false, ct = 'normal' } = {}) {
  let classification;
  if (gcs <= 8) classification = 'severe-TBI-GCS-3-8';
  else if (gcs <= 12) classification = 'moderate-TBI-GCS-9-12';
  else classification = 'mild-TBI-GCS-13-15';
  let pathway;
  if (classification.includes('severe') && pupil === 'unreactive') pathway = 'severe-TBI-monitor-ICP-consider-decompression';
  else if (classification.includes('severe') && ct === 'abnormal') pathway = 'severe-TBI-ICP-monitor-and-craniotomy-if-needed';
  else if (classification.includes('severe')) pathway = 'severe-TBI-ICU-monitoring';
  else if (classification.includes('moderate') && ct === 'abnormal') pathway = 'moderate-TBI-neurosurgical-consult';
  else if (classification.includes('moderate')) pathway = 'moderate-TBI-floor-monitoring';
  else pathway = 'mild-TBI-observation-and-discharge';
  return { classification, pathway, recommendation: pathway.includes('severe') ? 'neurosurgery' : (pathway.includes('moderate') ? 'neurosurgery-consult' : 'observation') };
};

Engine.VentilatorLiberationBundle = function ({ sbpOk = true, noVasopressors = true, mentalOk = true, suctioningTolerance = 'good', coughStrength = 'strong' } = {}) {
  const items = [sbpOk, noVasopressors, mentalOk, suctioningTolerance === 'good', coughStrength === 'strong'].filter(x => x).length;
  let ready;
  if (items === 5) ready = 'fully-ready-for-extubation';
  else if (items === 4) ready = 'mostly-ready-minor-concerns';
  else if (items === 3) ready = 'partial-need-reassessment';
  else ready = 'not-ready-extubation';
  return { ready, items, recommendation: ready.includes('fully') || ready.includes('mostly') ? 'proceed-with-SBT' : 'address-concerns-first' };
};

Engine.MultipleOrganFailure = function ({ respiratoryScore = 0, renalScore = 0, liverScore = 0, cardiacScore = 0, hematologicScore = 0, neurologicScore = 0 } = {}) {
  const total = respiratoryScore + renalScore + liverScore + cardiacScore + hematologicScore + neurologicScore;
  let mortality;
  if (total >= 20) mortality = 'very-high-mortality-80-percent';
  else if (total >= 15) mortality = 'high-mortality-50-80-percent';
  else if (total >= 10) mortality = 'moderate-mortality-25-50-percent';
  else if (total >= 5) mortality = 'low-mortality-10-25-percent';
  else mortality = 'minimal-mortality-less-than-10-percent';
  return { total, mortality, recommendation: total >= 15 ? 'goals-of-care-discussion' : 'continue-ICU-care' };
};

Engine.VentilatorAssociatedPneumonia = function ({ purulentSputum = false, fever = false, leukocytosis = false, newInfiltrate = false, worseningOxygenation = false } = {}) {
  const cpis = [purulentSputum, fever, leukocytosis, newInfiltrate, worseningOxygenation].filter(x => x).length;
  let diagnosis;
  if (cpis >= 4) diagnosis = 'probable-VAP-start-empiric-antibiotics';
  else if (cpis >= 3) diagnosis = 'possible-VAP-culture-and-monitor';
  else if (cpis >= 2) diagnosis = 'low-probability-VAP-monitor';
  else diagnosis = 'no-VAP';
  return { diagnosis, recommendation: diagnosis.includes('probable') ? 'empiric-antibiotics-and-BAL' : 'monitor' };
};

Engine.DeliriumCAMICU = function ({ acuteChange = false, inattention = false, alteredConsciousness = false, disorganizedThinking = false } = {}) {
  const features = (acuteChange ? 1 : 0) + (inattention ? 1 : 0) + (alteredConsciousness ? 1 : 0) + (disorganizedThinking ? 1 : 0);
  let diagnosis;
  if (acuteChange && inattention && (alteredConsciousness || disorganizedThinking)) diagnosis = 'delirium-CAM-ICU-positive';
  else if (features >= 2) diagnosis = 'subsyndromal-delirium';
  else if (features >= 1) diagnosis = 'mild-delirium-symptoms';
  else diagnosis = 'no-delirium';
  return { diagnosis, recommendation: diagnosis.includes('positive') ? 'non-pharmacologic-first-and-consider-haloperidol' : 'monitor' };
};

module.exports = Engine;
