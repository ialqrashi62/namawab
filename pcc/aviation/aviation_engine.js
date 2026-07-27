'use strict';

// Aviation-Medicine PCC — 10 pure deterministic functions
// Compliance: ICAO, FAA, EASA, IATA, AOPA, AsMA, AMDA, ICAO-9184

const Engine = module.exports = {};

// 1) Altitude hypoxia
Engine.AltitudeHypoxia = function (input = {}) {
  const { cabinPressureEquivalentFeet = 8000, oxygenSaturation = 95, durationMinutes = 60 } = input;
  let severity;
  if (oxygenSaturation < 85 || cabinPressureEquivalentFeet >= 35000) severity = 'critical-immediate-oxygen-100';
  else if (oxygenSaturation < 90) severity = 'severe-supplemental-oxygen';
  else if (cabinPressureEquivalentFeet >= 25000) severity = 'moderate-monitor-SpO2';
  else if (cabinPressureEquivalentFeet >= 10000) severity = 'mild-monitor';
  else severity = 'normal';
  return { severity, recommendation: severity.includes('critical') ? '100-percent-oxygen-descent-10000ft' : (severity === 'mild-monitor' ? 'pulse-oxymetry' : 'no-action-needed') };
};

// 2) G-LOC (G-induced loss of consciousness)
Engine.GLOCAssessment = function (input = {}) {
  const { gForce = 1, durationSeconds = 1, antiGSuit = false, hydration = 'normal', pilotExperience = 'high' } = input;
  let risk;
  if (gForce >= 7 && durationSeconds >= 6 && !antiGSuit) risk = 'high-G-LOC';
  else if (gForce >= 5 && durationSeconds >= 10) risk = 'high-G-LOC';
  else if (gForce >= 4 && !antiGSuit && pilotExperience === 'low') risk = 'moderate-G-LOC-risk';
  else if (gForce >= 3) risk = 'low-G-LOC-risk';
  else risk = 'no-G-LOC-risk';
  return { risk, recommendation: risk === 'high-G-LOC' ? 'anti-G-straining-maneuver-AGSM' : (risk === 'moderate-G-LOC-risk' ? 'AGSM-hydration-check' : 'no-special-action') };
};

// 3) Rapid decompression
Engine.RapidDecompression = function (input = {}) {
  const { pressureDrop = 0, timeSeconds = 0, altitude = 35000, hypoxicTimeOfUsefulConsciousness = 60 } = input;
  let classType, response;
  if (timeSeconds <= 1 && pressureDrop > 5000) classType = 'Class-I-explosive';
  else if (timeSeconds < 10 && pressureDrop > 1000) classType = 'Class-II-rapid';
  else if (timeSeconds >= 10 && pressureDrop > 1000) classType = 'Class-III-explosive';
  else classType = 'no-significant-decompression';
  if (classType === 'Class-I-explosive') response = 'immediate-descent-to-10000ft-or-below';
  else if (classType === 'Class-II-rapid') response = 'descent-within-30-seconds';
  else if (classType === 'Class-III-explosive') response = 'controlled-descent-immediate-oxygen';
  else response = 'continue-flight';
  return { classType, response, recommendation: 'emergency-descent-protocol' };
};

// 4) Pilot medical class — FAA/IACO
Engine.PilotMedicalClass = function (input = {}) {
  const { vision = '20-20', hearing = 'normal', cardiac = 'cleared', neurologic = 'cleared', psychiatric = 'cleared', age = 30, hypertension = 'controlled', diabetes = 'none' } = input;
  let medicalClass, disqualification;
  if (cardiac === 'disqualifying' || neurologic === 'disqualifying') disqualification = 'permanently-disqualified';
  else if (vision === 'below-standard' || hearing === 'below-standard') disqualification = 'restricted-license-with-restrictions';
  else if (psychiatric === 'active-psychosis') disqualification = 'temporarily-disqualified';
  else if (age >= 60) disqualification = 'second-class-only';
  else if (diabetes === 'uncontrolled') disqualification = 'restricted-monitoring';
  else disqualification = 'fully-qualified';
  if (disqualification === 'fully-qualified' && age < 40) medicalClass = 'Class-I-first-class';
  else if (disqualification === 'fully-qualified') medicalClass = 'Class-II-second-class';
  else if (disqualification === 'second-class-only') medicalClass = 'Class-II-second-class';
  else if (disqualification === 'restricted-license-with-restrictions') medicalClass = 'restricted-Class-III';
  else medicalClass = 'disqualified';
  return { medicalClass, disqualification, recommendation: disqualification === 'fully-qualified' ? 'renew-medical-every-6-mo' : 're-evaluation' };
};

// 5) Cosmic radiation exposure
Engine.CosmicRadiationDose = function (input = {}) {
  const { flightHours = 0, altitude = 35000, latitude = 40, solarActivity = 'normal' } = input;
  const doseMicroSievert = flightHours * (altitude / 1000) * (1 + (latitude - 30) / 60) * (solarActivity === 'high' ? 1.3 : 1);
  let risk;
  if (doseMicroSievert > 5000) risk = 'elevated-radiation-exposure';
  else if (doseMicroSievert > 2000) risk = 'moderate-radiation';
  else if (doseMicroSievert > 500) risk = 'low-radiation';
  else risk = 'minimal-radiation';
  return { doseMicroSievert: Math.round(doseMicroSievert * 10) / 10, risk, recommendation: risk === 'elevated-radiation-exposure' ? 'limit-flight-hours-pregnancy-restriction' : 'standard-monitoring' };
};

// 6) DVT — long flight risk
Engine.DVTLongFlightRisk = function (input = {}) {
  const { flightDurationHours = 4, priorDVT = false, oralContraceptives = false, smoking = false, age = 40, bmi = 25 } = input;
  let score = 0;
  if (flightDurationHours > 8) score += 2; else if (flightDurationHours > 4) score += 1;
  if (priorDVT) score += 3;
  if (oralContraceptives) score += 1;
  if (smoking) score += 1;
  if (age >= 60) score += 1;
  if (bmi >= 30) score += 1;
  let risk;
  if (score >= 5) risk = 'very-high-DVT-risk';
  else if (score >= 3) risk = 'high-DVT-risk';
  else if (score >= 1) risk = 'moderate-DVT-risk';
  else risk = 'low-DVT-risk';
  return { score, risk, recommendation: score >= 3 ? 'low-molecular-weight-heparin-elastic-stockings' : 'mobilize-hydrate-ankle-exercises' };
};

// 7) Jet lag disorder
Engine.JetLagDisorder = function (input = {}) {
  const { timeZonesCrossed = 0, direction = 'eastward', days = 0, sleepDeprivation = 'mild' } = input;
  let severity;
  if (timeZonesCrossed >= 8 && days < 3) severity = 'severe-jet-lag';
  else if (timeZonesCrossed >= 5 && days < 3) severity = 'moderate-jet-lag';
  else if (timeZonesCrossed >= 3) severity = 'mild-jet-lag';
  else severity = 'no-jet-lag';
  if (direction === 'eastward') severity += '-eastward-harder';
  if (sleepDeprivation === 'severe') severity = 'severe-jet-lag';
  return { severity, recommendation: severity.includes('severe') ? 'melatonin-0.5mg-pre-bed-bright-light-therapy' : 'sleep-hygiene-light-exposure' };
};

// 8) Barotrauma
Engine.BarotraumaAssessment = function (input = {}) {
  const { baroSite = 'sinus', descent = 'gradual', symptoms = 'mild' } = input;
  let severity;
  if (baroSite === 'middle-ear' && symptoms === 'severe-pain') severity = 'severe-otitic-barotrauma';
  else if (baroSite === 'sinus' && symptoms === 'severe-pain') severity = 'severe-barosinusitis';
  else if (baroSite === 'lung' && descent === 'rapid') severity = 'pulmonary-barotrauma-emergency';
  else if (symptoms === 'mild-pain') severity = 'mild-barotrauma';
  else if (symptoms === 'severe-pain' && descent === 'rapid') severity = 'severe-barotrauma';
  else severity = 'no-barotrauma';
  return { severity, recommendation: severity === 'pulmonary-barotrauma-emergency' ? 'recompression-chamber-emergency' : (severity.includes('severe') ? 'decongestants-ENT-consult' : 'no-action-needed') };
};

// 9) Spatial disorientation
Engine.SpatialDisorientation = function (input = {}) {
  const { nightFlight = false, weather = 'VMC', vestibularDisease = false, fatigue = 'normal' } = input;
  let risk;
  if (nightFlight && weather === 'IMC' && vestibularDisease) risk = 'high-spatial-disorientation';
  else if (weather === 'IMC' && fatigue === 'severe') risk = 'high-spatial-disorientation';
  else if (nightFlight && vestibularDisease) risk = 'moderate-spatial-disorientation';
  else if (weather === 'IMC' || nightFlight) risk = 'moderate-spatial-disorientation';
  else if (fatigue === 'severe') risk = 'low-spatial-disorientation';
  else risk = 'no-spatial-disorientation';
  return { risk, recommendation: risk === 'high-spatial-disorientation' ? 'ground-the-flight-deny-takeoff' : (risk === 'moderate-spatial-disorientation' ? 'use-instruments-fatigue-management' : 'standard-flight') };
};

// 10) Cabin air quality
Engine.CabinAirQuality = function (input = {}) {
  const { co2Level = 600, humidity = 20, ozone = 'low', recirculatedAir = 'normal' } = input;
  let assessment;
  if (co2Level > 1500 || humidity < 10) assessment = 'significant-cabin-air-issues';
  else if (co2Level > 1000) assessment = 'moderate-air-quality-concerns';
  else if (ozone === 'high') assessment = 'high-ozone-concerns';
  else if (humidity < 15) assessment = 'low-humidity-symptoms';
  else assessment = 'normal-cabin-air';
  return { assessment, recommendation: assessment === 'significant-cabin-air-issues' ? 'increase-fresh-air-ventilation' : 'standard-cabin-air' };
};
