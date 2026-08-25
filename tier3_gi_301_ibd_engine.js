/**
 * TIER3_GI-301 IBD Engine
 * Crohn's (CDAI) + UC (Mayo) + step therapy + biologics + colorectal cancer surveillance
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ECCO_2024: 'ECCO Guidelines 2024', AGA: 'AGA IBD 2024' };

function crohnActivity(input) {
  const { number_of_liquid_stools, abdominal_pain, general_wellbeing, hematocrit, extraintestinal, abdominal_mass, weight_loss, loperamide } = input;
  let cdai = 0;
  cdai += number_of_liquid_stools * 2;
  cdai += { 0: 0, 1: 5, 2: 10, 3: 20 }[abdominal_pain] || 0;
  cdai += { 0: 0, 1: 7, 2: 14, 3: 21, 4: 28 }[general_wellbeing] || 0;
  cdai += hematocrit < 30 ? 6 : 0;
  cdai += extraintestinal ? 20 : 0;
  cdai += { 0: 0, 1: 10, 2: 20, 3: 30 }[abdominal_mass] || 0;
  cdai += weight_loss ? 20 : 0;
  cdai += loperamide ? 0 : 30;  // crude simplification
  let severity = 'remission';
  if (cdai > 450) severity = 'severe';
  else if (cdai > 220) severity = 'moderate';
  else if (cdai > 150) severity = 'mild';
  return { cdai: Math.round(cdai), severity, target: cdai < 150, citation: CITATIONS.ECCO_2024 };
}

function ulcerativeActivity(input) {
  const { stool_frequency, rectal_bleeding, endoscopic_appearance, physician_rating } = input;
  const partialMayo = (stool_frequency > 3 ? 3 : stool_frequency) + (rectal_bleeding > 3 ? 3 : rectal_bleeding) + physician_rating;
  const totalMayo = partialMayo + endoscopic_appearance;
  let severity = 'remission';
  if (totalMayo >= 10) severity = 'severe';
  else if (totalMayo >= 6) severity = 'moderate';
  else if (totalMayo >= 3) severity = 'mild';
  return {
    partial_mayo: partialMayo, total_mayo: totalMayo, severity,
    target: totalMayo < 3, citation: CITATIONS.AGA,
  };
}

function stepTherapyIBD(input) {
  const { diagnosis, severity } = input;
  const treatmentMap = {
    UC_mild: ['5-ASA (mesalazine)', 'rectal_5-ASA if distal'],
    UC_moderate: ['5-ASA + topical steroid', 'add_budesonide', 'thiopurine'],
    UC_severe: ['IV_steroid', 'infliximab OR adalimumab OR vedolizumab', 'JAK_inhibitor', 'colectomy_consideration'],
    CD_mild: ['budesonide (ileocecal)', '5-ASA (colonic)'],
    CD_moderate: ['budesonide', 'thiopurine', 'methotrexate'],
    CD_severe: ['anti_TNF (infliximab/adalimumab)', 'ustekinumab', 'vedolizumab', 'risankizumab', 'surgery'],
  };
  return { key: `${diagnosis}_${severity}`, treatment: treatmentMap[`${diagnosis}_${severity}`] || ['specialist_consult'] };
}

function biologicsEligibilityIBD(input) {
  const { age, severity, refractory, steroid_dependent, hx_anti_tnf } = input;
  const eligible = (severity === 'moderate' || severity === 'severe') && (refractory || steroid_dependent);
  const candidates = [];
  if (eligible) {
    if (!hx_anti_tnf) candidates.push('infliximab_or_adalimumab_first_line');
    candidates.push('vedolizumab_gut_selective');
    if (age < 65) candidates.push('ustekinumab_or_risankizumab');
    if (severity === 'severe') candidates.push('JAK_inhibitor_tofacitinib');
  }
  return { eligible, candidates, workup_before: ['TST_or_quantiFERON', 'HBV_screen', 'varicella_igg', 'vaccination_update'] };
}

function colorectalCancerSurveillance(input) {
  const { diagnosis, years_since_diagnosis, extent, psc, family_history_crc } = input;
  let interval_years = 5;
  if (extent === 'pancolitis' && (years_since_diagnosis >= 8 || psc)) interval_years = 1;
  else if (extent === 'left_sided' && years_since_diagnosis >= 15) interval_years = 2;
  const high_risk = psc || family_history_crc;
  return {
    surveillance_interval_years: interval_years, high_risk,
    recommended_modality: high_risk ? 'chromoendoscopy + targeted_biopsy' : 'white_light_with_random_biopsies',
    start_year: extent === 'pancolitis' ? 8 : 15,
  };
}

module.exports = { crohnActivity, ulcerativeActivity, stepTherapyIBD, biologicsEligibilityIBD, colorectalCancerSurveillance, CITATIONS, ValidationError };