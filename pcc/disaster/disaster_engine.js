'use strict';

// Disaster-Medicine PCC — 10 pure deterministic functions
// Compliance: WHO-ICRC, FEMA, CDC-CERC, ICS-100/200, START-JumpSTART, NATO-MASSCAL

const Engine = module.exports = {};

// 1) START triage
Engine.STARTTriage = function (input = {}) {
  const { respiratoryRate = 16, perfusion = 'present', mentalStatus = 'alert', canWalk = true } = input;
  if (canWalk) return { category: 'green-walking-wounded', recommendation: 'ambulatory-tent-minor' };
  if (respiratoryRate === 0 && perfusion === 'absent' && mentalStatus === 'unresponsive') return { category: 'black-deceased-or-unsalvageable', recommendation: 'expectant-morgue' };
  if (respiratoryRate >= 30) return { category: 'red-immediate', recommendation: 'immediate-life-saving' };
  if (perfusion === 'absent' || mentalStatus === 'unresponsive') return { category: 'red-immediate', recommendation: 'immediate-life-saving' };
  if (respiratoryRate < 10) return { category: 'red-immediate', recommendation: 'airway-rescue-breathing' };
  return { category: 'yellow-delayed', recommendation: 'urgent-non-ambulatory' };
};

// 2) Incident Command System — activation level
Engine.IncidentCommandActivation = function (input = {}) {
  const { magnitude = 'minor', fatalities = 0, injuries = 0, infrastructure = 'intact' } = input;
  let level;
  if (magnitude === 'catastrophic' || fatalities >= 25) level = 'level-1-ICS-full-activation';
  else if (magnitude === 'major' || fatalities >= 5 || injuries >= 50) level = 'level-2-partial-activation';
  else if (magnitude === 'moderate' || injuries >= 10) level = 'level-3-enhanced-monitoring';
  else if (infrastructure !== 'intact') level = 'level-2-partial-activation';
  else level = 'level-4-routine-monitoring';
  return { level, recommendation: level.startsWith('level-1') ? 'full-ICS-hospital-ED-evacuation-plan' : 'heightened-readiness' };
};

// 3) Hazmat decontamination
Engine.HazmatDeconNeed = function (input = {}) {
  const { agent = 'unknown', exposure = 'none', symptoms = 'none' } = input;
  let deconLevel;
  if (agent === 'chemical-known' && exposure === 'confirmed' && symptoms === 'severe') deconLevel = 'definitive-decontamination';
  else if (agent === 'chemical-known' && exposure === 'confirmed') deconLevel = 'gross-decontamination';
  else if (agent === 'biological-known' || symptoms === 'moderate') deconLevel = 'gross-decontamination';
  else if (agent === 'radiological') deconLevel = 'definitive-decontamination-radiological';
  else if (exposure === 'suspected') deconLevel = 'gross-decontamination-precautionary';
  else deconLevel = 'no-decontamination-needed';
  return { deconLevel, recommendation: deconLevel.startsWith('definitive') ? 'full-team-PPE-decon-area' : 'preattack-protect-first-responders' };
};

// 4) MCI resource allocation
Engine.MCIResourceAllocation = function (input = {}) {
  const { totalCasualties = 0, redCount = 0, yellowCount = 0, greenCount = 0, blackCount = 0, availableBeds = 100 } = input;
  let mciLevel;
  if (totalCasualties >= 100) mciLevel = 'MCI-level-3-major';
  else if (totalCasualties >= 25) mciLevel = 'MCI-level-2-moderate';
  else if (totalCasualties >= 5) mciLevel = 'MCI-level-1-minor';
  else mciLevel = 'no-MCI';
  const resourcesNeeded = (redCount * 2) + yellowCount + (greenCount * 0.2) + blackCount;
  const overload = resourcesNeeded > availableBeds;
  return { mciLevel, resourcesNeeded, overload, recommendation: overload ? 'mutual-aid-EMS-bypass-evacuation' : 'within-capacity-standard-MCI-protocol' };
};

// 5) Medical triage sieve (UK/NATO)
Engine.MedicalTriageSieve = function (input = {}) {
  const { respiratoryRate = 16, heartRate = 80, consciousness = 'alert', ableToWalk = true } = input;
  if (ableToWalk && consciousness === 'alert') return { priority: 'P3-minor', recommendation: 'ambulatory-tent' };
  if (respiratoryRate >= 30 || respiratoryRate < 10) return { priority: 'P1-immediate', recommendation: 'airway-or-respiratory-emergency' };
  if (consciousness !== 'alert') return { priority: 'P1-immediate', recommendation: 'neurological-emergency' };
  if (heartRate >= 180 || heartRate < 60) return { priority: 'P1-immediate', recommendation: 'circulatory-emergency' };
  return { priority: 'P2-urgent', recommendation: 'urgent-non-immediate' };
};

// 6) Shelter capacity planning
Engine.ShelterCapacityPlan = function (input = {}) {
  const { population = 0, capacity = 0, days = 0, sanitation = 'good', vulnerable = 0 } = input;
  const occupancyRate = (population / capacity) * 100;
  let status;
  if (occupancyRate > 100) status = 'overcrowded-immediate-relief';
  else if (occupancyRate > 90) status = 'near-capacity';
  else if (occupancyRate < 50) status = 'under-utilized';
  else status = 'optimal';
  if (sanitation === 'poor' && days > 7) status = 'overcrowded-immediate-relief';
  if (vulnerable > population * 0.3) status += '-priority-vulnerable';
  return { occupancyRate: Math.round(occupancyRate * 10) / 10, status, recommendation: status.includes('overcrowded') ? 'additional-shelter-mobilize-red-cross' : 'maintain-current-services' };
};

// 7) Water & sanitation emergency assessment
Engine.WaterSanitationEmergency = function (input = {}) {
  const { peopleAffected = 0, waterLitersPerDay = 20, sanitationFacilities = 100, latrineRatio = 20 } = input;
  const perCapita = waterLitersPerDay;
  const latrineCoverage = (latrineRatio / 20) * 100;
  let alertLevel;
  if (perCapita < 5) alertLevel = 'critical-water-shortage';
  else if (perCapita < 15) alertLevel = 'high-water-stress';
  else if (perCapita < 20) alertLevel = 'moderate-water-stress';
  else if (latrineCoverage < 50) alertLevel = 'high-sanitation-risk';
  else alertLevel = 'acceptable';
  return { perCapita, latrineCoverage: Math.round(latrineCoverage * 10) / 10, alertLevel, recommendation: alertLevel === 'critical-water-shortage' ? 'emergency-water-trucking-chlorination' : 'monitor-and-supplement' };
};

// 8) Epidemic outbreak detection
Engine.EpidemicOutbreakDetection = function (input = {}) {
  const { casesPerWeek = 0, expectedBaseline = 1, doublingTimeDays = 0, geographicSpread = 'localized' } = input;
  const incidenceRatio = casesPerWeek / Math.max(expectedBaseline, 1);
  let alert;
  if (incidenceRatio >= 5 && doublingTimeDays <= 3) alert = 'epidemic-outbreak-rapid';
  else if (incidenceRatio >= 3) alert = 'epidemic-outbreak';
  else if (incidenceRatio >= 2) alert = 'unusual-increase';
  else if (incidenceRatio >= 1.5) alert = 'watch';
  else alert = 'within-baseline';
  if (geographicSpread === 'multi-state' || geographicSpread === 'multi-country') alert += '-widespread';
  return { incidenceRatio: Math.round(incidenceRatio * 10) / 10, alert, recommendation: alert.includes('outbreak') ? 'activate-EOC-epidemiology-investigation' : 'routine-surveillance' };
};

// 9) Mass-fatality management
Engine.MortalityRateCrisis = function (input = {}) {
  const { deaths = 0, population = 1000, days = 1, infrastructure = 'functional' } = input;
  const crudeMortalityRate = (deaths / population) * (30 / days);
  let severity;
  if (crudeMortalityRate >= 2 || deaths >= 50) severity = 'mass-fatality-event';
  else if (crudeMortalityRate >= 1) severity = 'excess-mortality';
  else if (crudeMortalityRate >= 0.5) severity = 'elevated-mortality';
  else severity = 'baseline-mortality';
  if (infrastructure === 'destroyed' && deaths >= 10) severity = 'mass-fatality-event';
  return { crudeMortalityRate: Math.round(crudeMortalityRate * 100) / 100, severity, recommendation: severity === 'mass-fatality-event' ? 'activate-DMORT-temporary-morgue' : 'routine-tracking' };
};

// 10) Tetanus risk in disaster wounds
Engine.WoundTetanusRiskAssessment = function (input = {}) {
  const { lastTetanusYears = 0, woundType = 'clean', vaccineHistory = 'complete', immunoglobulinAvailable = true } = input;
  let risk;
  if (woundType === 'puncture' || woundType === 'crush' || woundType === 'burn') risk = 'high-risk-wound';
  else if (woundType === 'contaminated') risk = 'moderate-risk-wound';
  else risk = 'low-risk-wound';
  let action;
  if (lastTetanusYears >= 10 && risk === 'high-risk-wound') action = 'tetanus-booster-and-TIG';
  else if (lastTetanusYears >= 5 && risk !== 'low-risk-wound') action = 'tetanus-booster';
  else if (lastTetanusYears < 5) action = 'no-action-needed';
  else if (vaccineHistory === 'incomplete') action = 'tetanus-booster-and-TIG';
  else if (lastTetanusYears >= 10 && risk === 'low-risk-wound') action = 'tetanus-booster';
  else action = 'no-action-needed';
  if (!immunoglobulinAvailable && action === 'tetanus-booster-and-TIG') action += '-obtain-TIG-from-regional';
  return { risk, action, recommendation: action.includes('TIG') ? 'wound-debridement-TIG-and-toxoid' : 'wound-care-toxoid-only' };
};
