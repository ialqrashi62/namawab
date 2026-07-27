'use strict';

// Veterinary-Medicine PCC — 10 pure deterministic functions (zoonoses & One Health)
// Compliance: OIE-WOAH, WHO-One-Health, CDC, AVMA, FAO, IDSA, EISMV, EIS

const Engine = module.exports = {};

// 1) Pet-related rabies exposure
Engine.RabiesPetExposurerisk = function (input = {}) {
  const { species = 'dog', vaccinated = false, provoked = false, wound = 'none', animalBehavior = 'normal' } = input;
  let risk, recommendation;
  if (species === 'bat') { risk = 'high-rabies-exposure'; recommendation = 'rabies-PEP-RIG-vaccine-immediate'; }
  else if (species === 'dog' && !vaccinated && animalBehavior === 'aggressive') { risk = 'high-rabies-exposure'; recommendation = 'rabies-PEP-RIG-vaccine-immediate'; }
  else if (species === 'dog' && vaccinated && animalBehavior === 'normal') { risk = 'low-rabies-exposure'; recommendation = 'observe-pet-10-days-or-test'; }
  else if (provoked && animalBehavior === 'normal') { risk = 'low-rabies-exposure'; recommendation = 'observe-pet-10-days-or-test'; }
  else if (species === 'dog' && !vaccinated) { risk = 'moderate-rabies-exposure'; recommendation = 'rabies-vaccine-PEP-consider-RIG'; }
  else { risk = 'minimal-risk'; recommendation = 'no-action-needed'; }
  return { risk, recommendation };
};

// 2) Brucellosis risk
Engine.BrucellosisRisk = function (input = {}) {
  const { animalContact = 'none', symptoms = 'none', occupationalExposure = false, ingestion = 'no' } = input;
  let risk;
  if (animalContact === 'cattle-birthing' && symptoms === 'fever-night-sweats') risk = 'high-acute-brucellosis';
  else if (occupationalExposure && animalContact !== 'none') risk = 'moderate-brucellosis-risk';
  else if (ingestion === 'unpasteurized-dairy') risk = 'moderate-brucellosis-risk';
  else if (animalContact !== 'none') risk = 'low-brucellosis-exposure';
  else risk = 'no-brucellosis';
  return { risk, recommendation: risk === 'high-acute-brucellosis' ? 'doxycycline-rifampin-or-streptomycin-6wks' : (risk.includes('moderate') ? 'serology-monitoring-doxycycline' : 'no-action') };
};

// 3) Anthrax exposure
Engine.AnthraxExposure = function (input = {}) {
  const { animal = 'none', exposureType = 'none', symptoms = 'none', vaxHistory = 'none' } = input;
  let diagnosis;
  if (animal === 'cattle' && exposureType === 'skin-contact' && symptoms === 'black-eschar') diagnosis = 'cutaneous-anthrax';
  else if (exposureType === 'inhalation' && symptoms === 'severe-respiratory') diagnosis = 'inhalational-anthrax';
  else if (animal === 'cattle' && exposureType === 'ingestion') diagnosis = 'gastrointestinal-anthrax';
  else if (animal === 'cattle' && symptoms === 'none' && vaxHistory === 'annual') diagnosis = 'no-anthrax-vaccinated';
  else if (animal === 'cattle') diagnosis = 'anthrax-exposure-monitor';
  else diagnosis = 'no-anthrax';
  return { diagnosis, recommendation: diagnosis === 'cutaneous-anthrax' ? 'ciprofloxacin-or-doxycycline-60-days' : (diagnosis === 'inhalational-anthrax' ? 'ICU-IV-ciprofloxacin-3-antibiotics' : 'no-action') };
};

// 4) Leptospirosis severity
Engine.LeptospirosisSeverity = function (input = {}) {
  const { jaundice = false, renalFailure = false, hemorrhage = false, myalgia = false, fever = false } = input;
  let severity;
  if (jaundice && renalFailure && hemorrhage) severity = 'severe-Weils-disease';
  else if ((jaundice && renalFailure) || hemorrhage) severity = 'severe-leptospirosis';
  else if (fever && myalgia) severity = 'mild-anicteric-leptospirosis';
  else if (fever) severity = 'suspected-leptospirosis';
  else severity = 'no-leptospirosis';
  return { severity, recommendation: severity === 'severe-Weils-disease' ? 'IV-penicillin-G-ceftriaxone-ICU-dialysis' : (severity === 'mild-anicteric-leptospirosis' ? 'oral-doxycycline-7days' : 'monitor') };
};

// 5) Q fever chronic
Engine.QFeverChronic = function (input = {}) {
  const { endocarditis = false, hepatitis = false, duration = 0, iggPhase1 = 0 } = input;
  let diagnosis;
  if (endocarditis && iggPhase1 > 800) diagnosis = 'chronic-Q-fever-endocarditis';
  else if (hepatitis && duration > 6) diagnosis = 'chronic-Q-fever-hepatitis';
  else if (iggPhase1 > 200 && duration > 3) diagnosis = 'probable-chronic-Q-fever';
  else if (iggPhase1 > 100) diagnosis = 'acute-Q-fever';
  else diagnosis = 'no-Q-fever';
  return { diagnosis, recommendation: diagnosis.includes('chronic') ? 'doxycycline-hydroxychloroquine-18-24mo' : (diagnosis === 'acute-Q-fever' ? 'doxycycline-14-days' : 'no-action') };
};

// 6) Hendra/Nipah virus
Engine.HendraNipahRisk = function (input = {}) {
  const { exposure = 'none', symptoms = 'none', encephalitis = false, respiratory = false } = input;
  let diagnosis, recommendation;
  if (exposure === 'bat-or-pig' && symptoms === 'encephalitis') { diagnosis = 'probable-Hendra-or-Nipah'; recommendation = 'strict-isolation-ribavirin-consider'; }
  else if (exposure === 'bat-or-pig' && respiratory) { diagnosis = 'probable-Nipah'; recommendation = 'strict-isolation-ribavirin'; }
  else if (exposure === 'bat-or-pig' && symptoms === 'severe-cholinergic') { diagnosis = 'suspected-zoonotic-encephalitis'; recommendation = 'isolation-consider-ribavirin'; }
  else if (exposure === 'bat-or-pig' && symptoms !== 'none') { diagnosis = 'suspected-zoonotic-encephalitis'; recommendation = 'isolation-consider-ribavirin'; }
  else if (exposure === 'bat-or-pig') { diagnosis = 'exposed-monitor'; recommendation = 'quarantine-21-days-monitor-symptoms'; }
  else { diagnosis = 'no-Hendra-Nipah'; recommendation = 'no-action'; }
  return { diagnosis, recommendation };
};

// 7) Cat scratch disease
Engine.CatScratchDisease = function (input = {}) {
  const { catExposure = false, papule = false, lymphadenopathy = false, bacillaryAngiomatosis = false, immunocompromised = false } = input;
  let diagnosis;
  if (catExposure && papule && lymphadenopathy) diagnosis = 'cat-scratch-confirmed';
  else if (catExposure && lymphadenopathy) diagnosis = 'probable-cat-scratch';
  else if (immunocompromised && bacillaryAngiomatosis) diagnosis = 'bacillary-angiomatosis-Bartonella';
  else if (catExposure) diagnosis = 'cat-exposure-monitor';
  else diagnosis = 'no-cat-scratch';
  return { diagnosis, recommendation: diagnosis === 'cat-scratch-confirmed' ? 'azithromycin-5-days-symptomatic' : (diagnosis === 'bacillary-angiomatosis-Bartonella' ? 'erythromycin-or-doxycycline-3-months' : 'monitor') };
};

// 8) West Nile neuroinvasive
Engine.WestNileNeuroinvasive = function (input = {}) {
  const { encephalitis = false, meningitis = false, paralysis = false, fever = false, mosquitoExposure = 'none' } = input;
  let severity;
  if (paralysis && encephalitis) severity = 'neuroinvasive-WNV';
  else if (encephalitis || meningitis) severity = 'neuroinvasive-WNV-meningoencephalitis';
  else if (fever && mosquitoExposure !== 'none') severity = 'febrile-WNV';
  else if (fever) severity = 'suspected-WNV';
  else severity = 'no-WNV';
  return { severity, recommendation: severity === 'neuroinvasive-WNV' ? 'ICU-supportive-IVIG-IFN-consider' : (severity === 'febrile-WNV' ? 'supportive-outpatient-monitoring' : 'no-action') };
};

// 9) Toxoplasma pregnancy
Engine.ToxoplasmaPregnancy = function (input = {}) {
  const { igm = 'negative', igg = 'negative', avidity = 'high', gestationalAge = 20, amniocentesis = 'not-done' } = input;
  let risk;
  if (igm === 'positive' && avidity === 'low') risk = 'high-transmission-active-infection';
  else if (igm === 'positive' && avidity === 'high' && gestationalAge > 16) risk = 'low-transmission-prior';
  else if (igg === 'positive' && igm === 'negative') risk = 'past-immunity-protected';
  else if (igm === 'positive') risk = 'suspected-recent-infection';
  else risk = 'no-toxoplasma';
  return { risk, recommendation: risk === 'high-transmission-active-infection' ? 'spiramycin-then-pyrimethamine-sulfadiazine-folinic' : (risk === 'suspected-recent-infection' ? 'spiramycin-3wks-amniocentesis-PCR' : 'counseling-avoid-raw-meat-cat-feces') };
};

// 10) Mycobacterium bovis
Engine.MycobacteriumBovis = function (input = {}) {
  const { unpasteurizedMilk = false, lymphadenitis = false, ppdPositive = false, cattleExposure = false, biopsy = 'not-done' } = input;
  let diagnosis;
  if (unpasteurizedMilk && lymphadenitis && ppdPositive) diagnosis = 'Mycobacterium-bovis-confirmed';
  else if (cattleExposure && lymphadenitis) diagnosis = 'suspected-M-bovis';
  else if (ppdPositive && unpasteurizedMilk) diagnosis = 'M-bovis-exposure-monitor';
  else if (lymphadenitis) diagnosis = 'non-tuberculous-mycobacteria';
  else diagnosis = 'no-M-bovis';
  return { diagnosis, recommendation: diagnosis === 'Mycobacterium-bovis-confirmed' ? 'isoniazid-rifampin-9-12mo' : (diagnosis === 'suspected-M-bovis' ? 'isoniazid-rifampin-6mo-biopsy' : 'monitor') };
};
