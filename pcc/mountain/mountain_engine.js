// P3-AU: Mountain-Medicine Engine — 10 pure functions
const Engine = {};

Engine.AltitudeSickness = function ({ altitudeMeters = 3000, symptoms = 'none', rateAscent = 500 } = {}) {
  let diagnosis;
  if (altitudeMeters >= 5000 && symptoms.includes('cerebral')) diagnosis = 'HACE-cerebral-edema-emergent';
  else if (altitudeMeters >= 4500 && symptoms.includes('pulmonary')) diagnosis = 'HAPE-pulmonary-edema-emergent';
  else if (altitudeMeters >= 3500 && symptoms.includes('headache-nausea')) diagnosis = 'moderate-AMS-acetazolamide-and-descend';
  else if (altitudeMeters >= 2500 && symptoms.includes('headache')) diagnosis = 'mild-AMS-rest-and-acetazolamide';
  else if (rateAscent > 500) diagnosis = 'rapid-ascent-risk-AMS';
  else diagnosis = 'no-AMS';
  return { diagnosis, recommendation: diagnosis.includes('HACE') || diagnosis.includes('HAPE') ? 'immediate-descent-and-O2' : diagnosis.includes('moderate') ? 'descend-and-treat' : diagnosis.includes('mild') ? 'rest-and-monitor' : 'monitor' };
};

Engine.HyperbaricToAltitude = function ({ altitudeMeters = 3000, ascentRate = 500, hydration = 'adequate' } = {}) {
  let risk;
  if (altitudeMeters >= 4500 && ascentRate > 500) risk = 'very-high-altitude-sickness-risk';
  else if (altitudeMeters >= 3500 && ascentRate > 500) risk = 'high-altitude-sickness-risk';
  else if (altitudeMeters >= 2500 && hydration === 'poor') risk = 'moderate-risk-dehydration-AMS';
  else if (altitudeMeters >= 2500) risk = 'moderate-altitude-standard-prep';
  else if (altitudeMeters >= 1500) risk = 'low-altitude';
  else risk = 'no-risk';
  return { risk, recommendation: risk.includes('very-high') || risk.includes('high') ? 'acetazolamide-pre-medication' : 'standard' };
};

Engine.AcetazolamideProphylaxis = function ({ altitudeMeters = 3000, priorAMS = false, ascentRate = 500 } = {}) {
  let prophylaxis;
  if (altitudeMeters >= 4000 && priorAMS) prophylaxis = 'acetazolamide-125mg-BID-and-dexamethasone';
  else if (altitudeMeters >= 3500) prophylaxis = 'acetazolamide-125mg-BID-start-2-days-before';
  else if (altitudeMeters >= 2500 && ascentRate > 500) prophylaxis = 'acetazolamide-consider';
  else if (priorAMS) prophylaxis = 'consider-acetazolamide-on-history';
  else prophylaxis = 'no-prophylaxis-needed';
  return { prophylaxis, recommendation: 'pre-travel-consult-and-start-1-2-days-before' };
};

Engine.FrostbiteRisk = function ({ tempC = -10, windChillC = -15, duration = 30, exposedSkin = 'minimal' } = {}) {
  let risk;
  if (windChillC < -30) risk = 'extreme-frostbite-risk-minutes';
  else if (windChillC < -15) risk = 'high-frostbite-risk';
  else if (tempC < -10 && exposedSkin === 'extensive') risk = 'high-risk-facial-frostbite';
  else if (tempC < 0 && duration >= 60) risk = 'moderate-frostbite-risk';
  else if (tempC < 0) risk = 'mild-frostbite-risk';
  else risk = 'no-frostbite-risk';
  return { risk, recommendation: risk.includes('extreme') || risk.includes('high') ? 'cover-exposed-skin-and-rescue' : 'cover-and-monitor' };
};

Engine.Hypothermia = function ({ coreTempC = 37, ambientC = 10, shivering = true, conscious = true } = {}) {
  let severity;
  if (coreTempC < 28) severity = 'severe-hypothermia-cardiac-arrhythmia-risk';
  else if (coreTempC < 32 && !conscious) severity = 'severe-hypothermia-afterdrop';
  else if (coreTempC < 32) severity = 'moderate-hypothermia-active-external-rewarming';
  else if (coreTempC < 35 && shivering) severity = 'mild-hypothermia-passive-rewarming';
  else if (coreTempC < 35) severity = 'mild-hypothermia-passive-rewarming';
  else severity = 'normal-temperature';
  return { severity, recommendation: severity.includes('severe') ? 'passive-rewarming-and-rescue' : severity.includes('moderate') ? 'active-external-rewarming' : severity.includes('mild') ? 'passive-rewarming-and-warm-drinks' : 'monitor' };
};

Engine.AvalancheRescue = function ({ burial = 'partial', timeBurial = 0, airway = 'clear', bodyTempC = 37 } = {}) {
  let rescue;
  if (burial === 'full' && timeBurial > 15 && airway === 'clear') rescue = 'survival-low-air-pocket-essential';
  else if (burial === 'full' && timeBurial > 35) rescue = 'survival-very-low-ALS-protocol';
  else if (burial === 'partial' && airway === 'clear') rescue = 'partial-burial-self-extrication';
  else if (airway === 'compromised') rescue = 'airway-emergency-ALS-protocol';
  else if (bodyTempC < 32) rescue = 'hypothermic-burial-rewarming';
  else rescue = 'standard-burial';
  return { rescue, recommendation: rescue.includes('ALS') || rescue.includes('low-survival') ? 'evac-to-ALS-center' : 'monitor' };
};

Engine.Acclimatization = function ({ daysAtAltitude = 1, sleepingAltitude = 3000, climbedToday = 500 } = {}) {
  let status;
  if (daysAtAltitude < 1 && sleepingAltitude >= 3500) status = 'rapid-ascent-no-acclimatization';
  else if (climbedToday > 500) status = 'climbing-too-fast-sleep-low';
  else if (daysAtAltitude < 2 && sleepingAltitude >= 4000) status = 'insufficient-acclimatization';
  else if (daysAtAltitude >= 3) status = 'partially-acclimatized';
  else if (daysAtAltitude >= 7) status = 'fully-acclimatized';
  else status = 'acclimatizing';
  return { status, recommendation: status.includes('insufficient') || status.includes('rapid') ? 'sleep-low-and-rest' : 'continue' };
};

Engine.SnowBlindness = function ({ uvExposure = 'low', duration = 30, glassesUV = 'good' } = {}) {
  let injury;
  if (uvExposure === 'extreme' && glassesUV === 'poor') injury = 'severe-photokeratitis-imminent';
  else if (uvExposure === 'high' && glassesUV === 'poor') injury = 'high-risk-photokeratitis';
  else if (uvExposure === 'moderate' && duration >= 240) injury = 'moderate-risk-prolonged-exposure';
  else if (glassesUV === 'good') injury = 'no-snow-blindness-risk';
  else injury = 'low-risk';
  return { injury, recommendation: injury.includes('severe') || injury.includes('high') ? 'UV-goggles-required-and-evacuate' : 'UV-goggles' };
};

Engine.MountainRescue = function ({ incident = 'altitude-sickness', evacAvailable = true, weather = 'clear' } = {}) {
  let plan;
  if (incident === 'HAPE' || incident === 'HACE') plan = 'helicopter-rescue-immediate';
  else if (incident === 'avalanche' && evacAvailable) plan = 'avalanche-rescue-team';
  else if (incident === 'frostbite-severe') plan = 'evac-and-rewarming-center';
  else if (weather === 'poor') plan = 'shelter-in-place-and-delayed-rescue';
  else if (incident === 'altitude-sickness' && evacAvailable) plan = 'ground-evac-or-helicopter';
  else plan = 'standard-mountain-rescue';
  return { plan, recommendation: plan.includes('immediate') ? 'activate-rescue-immediately' : 'monitor' };
};

Engine.MountainMedications = function ({ altitudeMeters = 3000, condition = 'healthy' } = {}) {
  let medications;
  if (altitudeMeters >= 4500) medications = 'acetazolamide-dexamethasone-nifedipine';
  else if (altitudeMeters >= 3500) medications = 'acetazolamide-125mg-BID-ibuprofen';
  else if (altitudeMeters >= 2500 && condition === 'prior-AMS') medications = 'acetazolamide-pre-emptive';
  else if (condition === 'COPD' || condition === 'cardiac') medications = 'consult-and-pre-travel-clearance';
  else medications = 'standard-altitude-meds-ibuprofen-and-O2';
  return { medications, recommendation: 'pre-travel-consult-and-pharmacy-kit' };
};

module.exports = Engine;
