// P3-AT: Aerospace-Medicine Engine — 10 pure functions
const Engine = {};

Engine.CabinAltitude = function ({ flightLevel = 35000, oxygenPartialPressure = 21, supplemental = false } = {}) {
  let altitude;
  if (flightLevel >= 40000) altitude = 'high-cabin-altitude-supplemental-O2';
  else if (flightLevel >= 35000 && !supplemental) altitude = 'commercial-cabin-altitude-8000ft';
  else if (flightLevel >= 25000) altitude = 'pressurized-cabin';
  else altitude = 'low-altitude';
  return { altitude, recommendation: supplemental ? 'monitor-and-oxygen' : 'standard-cabin' };
};

Engine.GForceTolerance = function ({ gForce = 1, duration = 0, direction = 'positive', tolerance = 'good' } = {}) {
  let effect;
  if (gForce >= 9) effect = 'extreme-G-LOC-risk';
  else if (gForce >= 7) effect = 'high-G-GLOC-without-anti-G-suit';
  else if (gForce >= 5 && direction === 'positive') effect = 'high-positive-G-pooling-and-vision-loss';
  else if (gForce >= 3) effect = 'moderate-G-tolerable';
  else if (gForce >= 1) effect = 'low-G-normal-flight';
  else effect = 'zero-or-negative-G';
  return { effect, recommendation: effect.includes('LOC') ? 'anti-G-suit-and-anti-G-straining' : 'standard' };
};

Engine.SpatialDisorientation = function ({ type = 'leans', weatherCondition = 'IMC', pilotExperience = 'novice' } = {}) {
  let risk;
  if (weatherCondition === 'IMC' && type === 'leans') risk = 'high-risk-IMC-leans-fatal';
  else if (type === 'coriolis') risk = 'severe-disorientation';
  else if (type === 'graveyard-spiral') risk = 'classic-fatal-spiral';
  else if (weatherCondition === 'IMC' && pilotExperience === 'novice') risk = 'high-risk-IMC-novice';
  else if (weatherCondition === 'IMC') risk = 'moderate-risk-IMC';
  else if (pilotExperience === 'novice') risk = 'moderate-risk-novice';
  else risk = 'low-risk-VMC';
  return { risk, recommendation: risk.includes('high') || risk.includes('fatal') ? 'recover-by-instruments-and-training' : 'trust-instruments' };
};

Engine.HypoxiaTraining = function ({ altitudeSimulated = 25000, timeOfUsefulConsciousness = 0, recognitionTime = 30 } = {}) {
  let classification;
  if (altitudeSimulated >= 40000) classification = 'rapid-hypoxia-TUC-15-30s';
  else if (altitudeSimulated >= 35000) classification = 'TUC-30-60s';
  else if (altitudeSimulated >= 25000) classification = 'TUC-3-5min-moderate-hypoxia';
  else classification = 'mild-hypoxia-TUC-longer';
  return { classification, recommendation: 'always-cockpit-O2-and-training' };
};

Engine.CirculationDecrease = function ({ alcoholUnits = 0, exercise = 'none', waterIntake = 1, gForce = 1 } = {}) {
  let risk;
  if (alcoholUnits >= 4) risk = 'severe-dehydration-and-GLOC';
  else if (alcoholUnits >= 2 && gForce >= 5) risk = 'increased-GLOC-risk';
  else if (waterIntake < 0.5) risk = 'dehydration-in-flight';
  else if (exercise === 'none' && waterIntake < 1) risk = 'mild-dehydration';
  else risk = 'adequate-hydration';
  return { risk, recommendation: risk.includes('severe') ? 'rehydrate-and-avoid-flight' : 'standard-precautions' };
};

Engine.AviationMedicalClearance = function ({ pilotClass = 1, condition = 'controlled', waiver = 'none', age = 35 } = {}) {
  let status;
  if (pilotClass === 1 && condition === 'stable' && waiver === 'none') status = 'Class-1-cleared';
  else if (pilotClass === 1 && waiver === 'FAA-issued') status = 'Class-1-with-waiver';
  else if (pilotClass === 2 && condition === 'stable') status = 'Class-2-cleared';
  else if (pilotClass === 3 && condition === 'stable') status = 'Class-3-cleared';
  else if (condition === 'unstable') status = 'disqualified-pending-control';
  else if (age >= 60) status = 'special-issuance-consider';
  else status = 'unspecified';
  return { status, recommendation: status.includes('cleared') ? 'clear-for-flight' : 'reassess-or-restrict' };
};

Engine.AeromedicalEvacuation = function ({ evacLevel = 'urgent', patient = 'stable', distanceKm = 500 } = {}) {
  let plan;
  if (evacLevel === 'urgent' && patient === 'critical') plan = 'aeromed-Critical-Care-Team-IMMEDIATE';
  else if (evacLevel === 'urgent') plan = 'aeromed-urgent-evacuation';
  else if (evacLevel === 'priority' && patient === 'stable') plan = 'aeromed-priority-6h-window';
  else if (evacLevel === 'routine') plan = 'aeromed-routine-scheduled';
  if (distanceKm >= 2000) plan += '-with-stops-for-fuel-and-crew-rest';
  return { plan, recommendation: 'coordinate-with-aeromed-command' };
};

Engine.AviationSurvival = function ({ environment = 'desert', survivalKit = 'standard', durationDays = 1 } = {}) {
  let survival;
  if (environment === 'arctic' && survivalKit === 'standard') survival = 'arctic-survival-shelter-and-fire';
  else if (environment === 'desert' && survivalKit === 'standard') survival = 'desert-survival-shade-and-water';
  else if (environment === 'jungle') survival = 'jungle-survival-water-and-shelter';
  else if (environment === 'ocean') survival = 'ocean-survival-flotation-and-water';
  else if (survivalKit === 'advanced') survival = 'advanced-survival-kit';
  return { survival, recommendation: 'training-and-survival-kit-checked' };
};

Engine.AirSickness = function ({ symptom = 'nausea', severity = 'mild', flightDuration = 2 } = {}) {
  let management;
  if (symptom === 'nausea' && severity === 'mild') management = 'ginger-and-hydration';
  else if (symptom === 'vomiting' && severity === 'moderate') management = 'meclizine-or-scopolamine';
  else if (severity === 'severe') management = 'IM-scopolamine-and-consider-landing';
  else if (flightDuration > 4) management = 'pre-flight-antihistamine';
  else management = 'monitor-and-antiemetic';
  return { management, recommendation: 'brief-pilot-and-monitor' };
};

Engine.AviationStressFactors = function ({ flightHours = 0, timeZoneChange = 0, sleepHours = 8, stressScore = 3 } = {}) {
  let fatigue;
  if (sleepHours < 4) fatigue = 'severe-fatigue-ground-the-pilot';
  else if (timeZoneChange >= 6 && sleepHours < 6) fatigue = 'jet-lag-and-fatigue';
  else if (flightHours >= 8) fatigue = 'extended-flight-fatigue';
  else if (stressScore >= 5) fatigue = 'high-stress-monitor';
  else if (sleepHours < 6) fatigue = 'mild-fatigue';
  else fatigue = 'adequate-rest';
  return { fatigue, recommendation: fatigue.includes('severe') ? 'ground-and-rest' : 'monitor-and-rest' };
};

module.exports = Engine;
