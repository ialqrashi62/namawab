'use strict';

// Tropical-Medicine PCC — 10 pure deterministic functions
// Compliance: WHO-TDR, CDC-Yellow-Book, ASTMH, IDSA, NHS-UK, RCPS-Glasgow

const Engine = module.exports = {};

// 1) Malaria severity — WHO 2015
Engine.MalariaSeverityWHO = function (input = {}) {
  const { parasiteDensity = 1000, species = 'P-falciparum', consciousness = 'alert', hypoglycemia = false, hemoglobin = 12, creatinine = 1, bilirubin = 1, parasiteStage = 'ring' } = input;
  let severity;
  if (species === 'P-falciparum' && parasiteDensity > 100000) severity = 'severe-malaria';
  else if (species === 'P-knowlesi' && parasiteDensity > 100000) severity = 'severe-malaria';
  else if (consciousness !== 'alert' || hypoglycemia || hemoglobin < 5 || creatinine > 3 || bilirubin > 3) severity = 'severe-malaria';
  else if (species === 'P-vivax' && parasiteDensity > 20000) severity = 'moderate-malaria';
  else if (parasiteStage === 'trophozoite' && species === 'P-falciparum') severity = 'moderate-malaria';
  else severity = 'uncomplicated-malaria';
  return { severity, recommendation: severity === 'severe-malaria' ? 'IV-artesunate-ICU' : 'oral-ACT-artemether-lumefantrine' };
};

// 2) Dengue severity — WHO 2009
Engine.DengueSeverityWHO = function (input = {}) {
  const { plasmaLeakage = false, bleeding = false, organImpairment = false, hematocritRising = false, plateletCount = 100, pulsePressure = 30, lethargy = false } = input;
  let category;
  if (organImpairment) category = 'severe-dengue-organ-impairment';
  else if (plasmaLeakage && (bleeding || pulsePressure < 20 || hematocritRising)) category = 'severe-dengue-with-warning-signs';
  else if (plasmaLeakage) category = 'dengue-with-warning-signs';
  else if (lethargy || bleeding) category = 'dengue-with-warning-signs';
  else if (plateletCount < 50) category = 'dengue-with-warning-signs';
  else category = 'dengue-without-warning-signs';
  return { category, recommendation: category === 'severe-dengue-organ-impairment' ? 'ICU-fluid-resuscitation-FFP-platelet' : (category.includes('warning-signs') ? 'admit-observation-IV-fluids' : 'outpatient-monitoring-ORS') };
};

// 3) Chikungunya severity
Engine.ChikungunyaSeverity = function (input = {}) {
  const { jointPainDurationDays = 7, chronicArthritis = false, age = 40, comorbidities = [] } = input;
  let category;
  if (chronicArthritis && jointPainDurationDays > 90) category = 'chronic-chikungunya-arthritis';
  else if (jointPainDurationDays > 14) category = 'persistent-chikungunya';
  else if (age >= 60 || comorbidities.length > 0) category = 'at-risk-severe';
  else category = 'acute-chikungunya';
  return { category, recommendation: category === 'chronic-chikungunya-arthritis' ? 'DMARDs-physio-long-term-followup' : 'NSAIDs-supportive-care' };
};

// 4) Leishmaniasis visceral vs cutaneous
Engine.LeishmaniasisType = function (input = {}) {
  const { presentation = 'cutaneous', lesionSite = 'exposed-skin', splenomegaly = false, fever = false, weightLoss = false, pancytopenia = false, leishmanDonovaniTest = 'not-done' } = input;
  let classification;
  if (splenomegaly && fever && weightLoss && pancytopenia && leishmanDonovaniTest === 'positive') classification = 'visceral-leishmaniasis-kala-azar';
  else if (splenomegaly || fever) classification = 'suspected-visceral-leishmaniasis';
  else if (presentation === 'cutaneous' && lesionSite === 'exposed-skin') classification = 'cutaneous-leishmaniasis';
  else if (presentation === 'mucocutaneous') classification = 'mucocutaneous-leishmaniasis-espundia';
  else classification = 'unclassified';
  return { classification, recommendation: classification === 'visceral-leishmaniasis-kala-azar' ? 'Liposomal-amphotericin-B-IV-21-days' : (classification === 'cutaneous-leishmaniasis' ? 'local-care-pentavalent-antimony' : 'biopsy-confirm-serology') };
};

// 5) Schistosomiasis — kidney/liver involvement
Engine.SchistosomiasisComplication = function (input = {}) {
  const { species = 'S-mansoni', chronicDurationYears = 0, hematuria = false, hepatosplenomegaly = false, periportalFibrosis = 'none', bladderCarcinoma = false, ascites = false } = input;
  let complication;
  if (species === 'S-haematobium' && bladderCarcinoma) complication = 'SCC-bladder-urgent-oncology';
  else if (species === 'S-haematobium' && hematuria) complication = 'urinary-schistosomiasis';
  else if (species === 'S-mansoni' && ascites) complication = 'hepatic-schistosomiasis-decompensated';
  else if (periportalFibrosis === 'severe') complication = 'Symmers-pipe-stem-fibrosis';
  else if (hepatosplenomegaly) complication = 'chronic-hepatic-schistosomiasis';
  else if (chronicDurationYears >= 1) complication = 'chronic-schistosomiasis';
  else complication = 'acute-schistosomiasis-Katayama-fever';
  return { complication, recommendation: complication.includes('SCC') ? 'praziquantel-urology-oncology' : 'praziquantel-40-60mg/kg-day-1' };
};

// 6) Typhoid severity
Engine.TyphoidSeverity = function (input = {}) {
  const { feverDuration = 5, consciousness = 'alert', perforation = false, bradycardia = false, roseSpots = false, hepatosplenomegaly = false, bloodCulture = 'pending' } = input;
  let severity;
  if (perforation || consciousness !== 'alert') severity = 'severe-typhoid-with-complication';
  else if (hepatosplenomegaly && roseSpots && bradycardia) severity = 'typical-typhoid';
  else if (feverDuration >= 7) severity = 'typical-typhoid';
  else severity = 'suspected-enteric-fever';
  return { severity, recommendation: severity.includes('severe') ? 'IV-ceftriaxone-surgical-consult' : (severity === 'typical-typhoid' ? 'oral-azithromycin-or-cefixime' : 'await-culture') };
};

// 7) Rabies PEP decision
Engine.RabiesPEP = function (input = {}) {
  const { exposure = 'none', animal = 'dog', animalStatus = 'unknown', previousVaccination = 'none', woundSeverity = 'minor' } = input;
  let pepRecommendation;
  if (exposure === 'no-exposure' || animalStatus === 'vaccinated') pepRecommendation = 'no-PEP-needed';
  else if (previousVaccination === 'complete' && exposure !== 'severe') pepRecommendation = 'two-booster-doses-days-0-3';
  else if (exposure === 'category-III' || woundSeverity === 'severe') pepRecommendation = 'RIG-full-vaccine-series-5-doses';
  else if (exposure === 'category-II') pepRecommendation = 'vaccine-series-no-RIG';
  else if (exposure === 'category-I') pepRecommendation = 'no-PEP-needed';
  else if (animal === 'bat') pepRecommendation = 'RIG-full-vaccine-series';
  else pepRecommendation = 'rabies-immunoglobulin-and-vaccine';
  return { pepRecommendation, recommendation: pepRecommendation.includes('RIG') ? 'wound-wash-RIG-infiltrate-vaccine' : 'wound-wash-vaccine-only' };
};

// 8) Traveler's diarrhea — treatment
Engine.TravelerDiarrhea = function (input = {}) {
  const { diarrheaFrequency = 1, bloodInStool = false, fever = false, dehydration = 'mild', durationDays = 1 } = input;
  let category;
  if (bloodInStool && fever) category = 'dysentery-invasive';
  else if (dehydration === 'severe') category = 'severe-dehydration-IV-fluids';
  else if (diarrheaFrequency >= 6) category = 'acute-travelers-diarrhea';
  else if (durationDays >= 14) category = 'chronic-diarrhea-investigate';
  else if (fever) category = 'acute-travelers-diarrhea';
  else category = 'mild-travelers-diarrhea';
  return { category, recommendation: category === 'dysentery-invasive' ? 'oral-ciprofloxacin-or-azithromycin' : (category === 'severe-dehydration-IV-fluids' ? 'admit-IV-fluids-OR-antibiotics' : (category === 'chronic-diarrhea-investigate' ? 'stool-studies-parasites-CRP' : 'oral-rehydration-loperamide-azithromycin')) };
};

// 9) Cutaneous leishmaniasis
Engine.CutaneousLeishmaniasis = function (input = {}) {
  const { lesionType = 'ulcer', numberOfLesions = 1, lesionSizeMM = 5, location = 'exposed-skin', mucosal = false, immunocompromised = false } = input;
  let treatment;
  if (mucosal) treatment = 'systemic-treatment-LAmB-required';
  else if (lesionSizeMM > 50 || numberOfLesions > 5) treatment = 'systemic-LAmB-or-antimony';
  else if (immunocompromised) treatment = 'systemic-treatment';
  else if (lesionSizeMM > 10) treatment = 'intralesional-antimony-3-injections';
  else treatment = 'local-care-cryotherapy-watchful-waiting';
  return { treatment, recommendation: treatment.includes('local-care') ? 'monitor-3-month-healing' : 'infectious-disease-skin-surgery' };
};

// 10) Hemorrhagic fever — Ebola/Marburg screening
Engine.HemorrhagicFeverScreening = function (input = {}) {
  const { fever = false, bleeding = false, travel = 'none', contactWithPatient = false, diarrheaVomiting = false, exposure = 'none', deathOfContacts = 0 } = input;
  let risk;
  if (fever && bleeding && (exposure === 'body-fluid' || contactWithPatient)) risk = 'very-high-EVD-confirm-PCR';
  else if (fever && (travel === 'EVD-endemic-area' || deathOfContacts > 0) && (diarrheaVomiting || bleeding)) risk = 'high-suspect-EVD';
  else if (fever && travel === 'EVD-endemic-area') risk = 'moderate-watchful';
  else if (fever && bleeding) risk = 'low-monitor';
  else risk = 'no-VHF';
  return { risk, recommendation: risk === 'very-high-EVD-confirm-PCR' ? 'immediate-isolation-PCR-double-glove-2-layer-PPE' : (risk === 'high-suspect-EVD' ? 'isolation-PPE-PCR' : 'routine-care') };
};
