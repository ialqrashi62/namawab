'use strict';

// Military-Medicine PCC — 10 pure deterministic functions
// Compliance: NATO-STANAG, TCCC, JTS-CPG, DHA, AFHSB, USAMRMC, DHHS, CoTCCC

const Engine = module.exports = {};

// 1) Combat hemorrhage — tourniquet
Engine.CombatTourniquet = function (input = {}) {
  const { hemorrhageControl = 'effective', limb = 'lower', evacuation = 30, bloodLoss = 'minimal' } = input;
  let action;
  if (hemorrhageControl === 'ineffective' && limb !== 'junction') action = 'apply-tourniquet-immediate';
  else if (bloodLoss === 'massive' && limb !== 'junction') action = 'apply-tourniquet-immediate';
  else if (hemorrhageControl === 'ineffective' && limb === 'junction') action = 'wound-packing-hemostatic-gauze';
  else if (evacuation > 60 && bloodLoss === 'moderate') action = 'consider-tourniquet';
  else if (hemorrhageControl === 'effective') action = 'monitor-and-elevate';
  else action = 'direct-pressure-only';
  return { action, recommendation: action.includes('tourniquet') ? 'apply-CAT-tourniquet-time-mark' : 'direct-pressure-hemostatic-gauze' };
};

// 2) Mild TBI / Concussion
Engine.MildTraumaticBrainInjury = function (input = {}) {
  const { lossOfConsciousness = 0, pta = 0, headache = false, amnesia = false, neuroSymptoms = false, priorConcussion = 0 } = input;
  let severity;
  if (lossOfConsciousness > 5 || pta > 60 || neuroSymptoms) severity = 'severe-mTBI-imaging-required';
  else if (lossOfConsciousness > 1 || pta > 30) severity = 'moderate-mTBI';
  else if (lossOfConsciousness > 0 || pta > 0 || headache || amnesia) severity = 'mild-mTBI';
  else severity = 'no-mTBI';
  if (priorConcussion >= 3) severity += '-with-prior-history';
  return { severity, recommendation: severity.includes('severe') ? 'CT-head-MRI-72h-rest' : (severity === 'moderate-mTBI' ? '24h-rest-graduated-return-protocol' : 'remove-from-duty-24h') };
};

// 3) PTSD risk
Engine.PTSDRiskAssessment = function (input = {}) {
  const { combatExposure = false, hyperarousal = false, reexperiencing = false, avoidance = false, durationMonths = 0, priorTrauma = false } = input;
  const symptomCount = (hyperarousal ? 1 : 0) + (reexperiencing ? 1 : 0) + (avoidance ? 1 : 0) + (durationMonths > 1 ? 1 : 0) + (priorTrauma ? 1 : 0);
  let risk;
  if (symptomCount >= 4 && combatExposure) risk = 'high-PTSD-probable';
  else if (symptomCount >= 3) risk = 'moderate-PTSD-suspect';
  else if (symptomCount >= 2) risk = 'mild-PTSD-symptoms';
  else if (symptomCount >= 1) risk = 'minimal-symptoms';
  else risk = 'no-PTSD';
  return { risk, recommendation: risk === 'high-PTSD-probable' ? 'psychiatric-referral-CPT-trauma-focused-therapy' : (risk === 'moderate-PTSD-suspect' ? 'mental-health-screening-resilience-training' : 'monitoring') };
};

// 4) Blast injury type
Engine.BlastInjuryType = function (input = {}) {
  const { distanceMeters = 50, enclosedSpace = false, rupturedEardrum = false, penetratingWound = false, bluntTrauma = false, burns = false } = input;
  let injuryType;
  if (distanceMeters < 5 && (rupturedEardrum || enclosedSpace)) injuryType = 'primary-blast-injury';
  else if (penetratingWound) injuryType = 'secondary-blast-injury-fragments';
  else if (bluntTrauma) injuryType = 'tertiary-blast-injury-blunt';
  else if (burns) injuryType = 'quaternary-blast-injury-thermal';
  else if (enclosedSpace) injuryType = 'primary-blast-injury-consider';
  else injuryType = 'no-blast-injury';
  return { injuryType, recommendation: injuryType === 'primary-blast-injury' ? 'CT-chest-abdomen-MRI-brain' : 'wound-care-imaging' };
};

// 5) TCCC — Tactical Combat Casualty Care
Engine.TCCCAlgorithm = function (input = {}) {
  const { airway = 'patent', breathing = 'adequate', circulation = 'controlled', consciousness = 'alert' } = input;
  let category;
  if (airway === 'compromised' || breathing === 'tension-pneumothorax' || circulation === 'catastrophic-bleed') category = 'mass-casualty-immediate';
  else if (consciousness === 'unconscious' || circulation === 'uncontrolled') category = 'priority-1-immediate';
  else if (breathing === 'compromised' || consciousness === 'altered') category = 'priority-2-urgent';
  else if (circulation === 'controlled') category = 'priority-3-delayed';
  else category = 'priority-4-minor';
  return { category, recommendation: category === 'mass-casualty-immediate' ? 'TCCC-march-algorithm' : (category === 'priority-1-immediate' ? 'MEDEVAC-immediate' : 'standard-evacuation') };
};

// 6) Triage — mass-casualty
Engine.MilitaryTriageMASS = function (input = {}) {
  const { walking = true, respiratoryRate = 16, perfusion = 'normal', mentalStatus = 'alert' } = input;
  if (walking) return { tag: 'green-minor', recommendation: 'ambulatory-deferred-care' };
  if (respiratoryRate > 30 || respiratoryRate < 10) return { tag: 'red-immediate', recommendation: 'airway-or-respiratory-support' };
  if (perfusion === 'absent') return { tag: 'red-immediate', recommendation: 'hemorrhage-control' };
  if (mentalStatus !== 'alert') return { tag: 'red-immediate', recommendation: 'neurological-emergency' };
  return { tag: 'yellow-delayed', recommendation: 'urgent-care-evacuation' };
};

// 7) Hypothermia combat
Engine.HypothermiaCombat = function (input = {}) {
  const { coreTemperature = 37, immersion = false, environment = 'temperate', windChill = 0, evacuation = 30, consciousness = 'alert' } = input;
  let severity;
  if (coreTemperature < 28) severity = 'severe-hypothermia-cardiac-arrest-risk';
  else if (coreTemperature < 32) severity = 'moderate-hypothermia';
  else if (coreTemperature < 35) severity = 'mild-hypothermia';
  else severity = 'no-hypothermia';
  if (immersion && windChill > 30) severity = 'severe-hypothermia-cardiac-arrest-risk';
  return { severity, recommendation: severity === 'severe-hypothermia-cardiac-arrest-risk' ? 'passive-rewarming-bladder-irrigation-warm-IV' : (severity === 'moderate-hypothermia' ? 'passive-rewarming-warm-IV' : 'remove-wet-clothes-blanket') };
};

// 8) Chemical exposure (warfare)
Engine.ChemicalWarfareExposure = function (input = {}) {
  const { agent = 'unknown', symptoms = 'none', exposureLevel = 'low', decontamination = 'none' } = input;
  let management;
  if (agent === 'nerve-agent' && symptoms === 'severe-cholinergic') management = 'atropine-2-PAM-immediate';
  else if (agent === 'blister-agent' && exposureLevel === 'high') management = 'decontamination-supportive-burn-care';
  else if (agent === 'choking-agent' && symptoms === 'severe') management = 'oxygen-bronchodilators-intubation';
  else if (agent === 'blood-agent' && symptoms === 'severe') management = '100-oxygen-hydroxocobalamin';
  else if (agent === 'incapacitating') management = 'supportive-monitoring';
  else management = 'decontamination-observation';
  return { management, recommendation: management.includes('immediate') ? 'auto-injector-buddy-aid' : 'decontamination-zone' };
};

// 9) Aeromedical evacuation priority
Engine.AeroEvacPriority = function (input = {}) {
  const { urgency = 'routine', patientStability = 'stable', nbcContamination = false, distanceKm = 100, lifeThreat = 'none' } = input;
  let priority;
  if (urgency === 'urgent' && lifeThreat === 'imminent') priority = 'priority-1-urgent-90min';
  else if (urgency === 'priority' && (lifeThreat === 'serious' || !patientStability)) priority = 'priority-2-4h';
  else if (urgency === 'routine' && patientStability === 'stable') priority = 'priority-3-24h';
  else if (nbcContamination) priority = 'priority-3-24h-after-decontamination';
  else priority = 'priority-2-4h';
  if (distanceKm > 500) priority += '-long-distance';
  return { priority, recommendation: priority.startsWith('priority-1') ? 'C-130-C-17-mission' : 'rotary-wing-acceptable' };
};

// 10) Field dental emergency
Engine.FieldDentalEmergency = function (input = {}) {
  const { complaint = 'pain', swelling = 'absent', trismus = 'absent', trauma = false, avulsion = false, caries = 'visible' } = input;
  let management;
  if (avulsion) management = 'replant-immediate-within-60min-splint';
  else if (trauma) management = 'dental-trauma-kit-hemostasis';
  else if (swelling === 'severe' && trismus === 'present') management = 'dental-abscess-IV-antibiotics-I&D-drainage';
  else if (swelling === 'mild') management = 'antibiotics-pulp-capping';
  else if (complaint === 'pain') management = 'analgesic-nerve-block-temporary-restoration';
  else if (caries === 'visible') management = 'temporary-filling-zinc-oxide';
  else management = 'monitor-return-to-duty';
  return { management, recommendation: management.includes('abscess') ? 'forward-surgical-team-referral' : 'field-treatment' };
};
