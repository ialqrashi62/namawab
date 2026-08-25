/**
 * TIER3_PULM-303 ILD Engine
 * Interstitial Lung Disease — GAP index + antifibrotic eligibility + monitoring
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ATS_2024: 'ATS/ERS/JRS/ALAT IPF 2024', NICE: 'NICE ILD Guidance' };

function gapIndex(input) {
  const { gender, age, fvc_pct, dlco_pct } = input;
  const points = {
    gender: gender === 'female' ? 0 : 1,
    age: age <= 64 ? 0 : age <= 65 ? 1 : age <= 75 ? 2 : 3,
    fvc_pct: fvc_pct >= 75 ? 0 : fvc_pct >= 50 ? 1 : 2,
    dlco_pct: dlco_pct >= 55 ? 0 : dlco_pct >= 40 ? 1 : dlco_pct >= 25 ? 2 : 3,
  };
  const total = Object.values(points).reduce((a, b) => a + b, 0);
  let stage = 'I'; let mortality_1y = 5.6;
  if (total > 5) { stage = 'III'; mortality_1y = 39.2; }
  else if (total > 3) { stage = 'II'; mortality_1y = 16.2; }
  return { total_points: total, stage, mortality_1y_pct: mortality_1y, citation: CITATIONS.ATS_2024 };
}

function antifibroticEligibility(input) {
  const { diagnosis, fvc_pct, age, dlco_pct, smoker } = input;
  const ipf = diagnosis === 'IPF';
  const eligible_fvc = fvc_pct >= 50;
  const eligible_dlco = dlco_pct >= 30;
  const eligible_age = age >= 40;
  return {
    pirfenidone_eligible: ipf && eligible_fvc && eligible_dlco && eligible_age,
    nintedanib_eligible: ipf && eligible_fvc && eligible_dlco,
    alternative_dx: !ipf ? ['progressive_fibrotic_ILDs', 'unclassifiable_ILD', 'hypersensitivity_pneumonitis', 'sarcoidosis'] : [],
    smoking_cessation: smoker ? 'REQUIRED' : 'CONTINUE_NON_SMOKER',
    citation: CITATIONS.ATS_2024,
  };
}

function progressionMonitoring(input) {
  const { fvc_change_pct, symptoms_worsening, hospitalizations_since_last, o2_required } = input;
  const progressive = fvc_change_pct <= -10 || symptoms_worsening && fvc_change_pct <= -5 || hospitalizations_since_last >= 1;
  return {
    progressive_fibrosing: progressive,
    antifibrotic_recommendation: progressive ? 'Consider nintedanib' : 'Continue observation',
    fvc_change_pct, symptoms_worsening, hospitalizations_since_last, o2_required,
    citation: CITATIONS.ATS_2024,
  };
}

function oxygenRequirement(input) {
  const { spo2_at_rest, spo2_exertion, pao2 } = input;
  return {
    ltot: spo2_at_rest < 88 || pao2 < 55,
    exertional_only: spo2_at_rest >= 88 && spo2_exertion < 88,
    flow_l_min: pao2 < 50 ? 4 : pao2 < 60 ? 3 : 2,
  };
}

function sarcoidosisStaging(input) {
  const { chest_xray_stage } = input;
  const stages = {
    0: 'Normal CXR',
    1: 'Bilateral hilar lymphadenopathy',
    2: 'BHL + parenchymal infiltrates',
    3: 'Parenchymal infiltrates only',
    4: 'Pulmonary fibrosis',
  };
  return { scadding_stage: chest_xray_stage, description: stages[chest_xray_stage] || 'Unknown', citation: CITATIONS.ATS_2024 };
}

module.exports = { gapIndex, antifibroticEligibility, progressionMonitoring, oxygenRequirement, sarcoidosisStaging, CITATIONS, ValidationError };