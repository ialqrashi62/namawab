/**
 * TIER3_GI-305 GI Bleeding Engine
 * Glasgow-Blatchford Score + risk stratification + transfusion strategy + endoscopy timing + variceal
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ESGE: 'ESGE Upper GI 2021', BSG: 'BSG Lower GI 2019', Baveno_VII: 'Baveno VII Portal Hypertension 2022' };

function glasgowBlatchford(input) {
  const { bun, hemoglobin, sbp, hr, melena, syncope, hepatic_disease, cardiac_failure } = input;
  let score = 0;
  if (bun >= 18 && bun < 22) score += 2;
  else if (bun >= 22 && bun < 28) score += 3;
  else if (bun >= 28 && bun < 70) score += 4;
  else if (bun >= 70) score += 6;
  if (hemoglobin < 10) score += 6;
  else if (hemoglobin < 12) score += 3;
  else if (hemoglobin >= 12 && hemoglobin < 13) score += 1;
  if (sbp < 90) score += 3;
  else if (sbp >= 90 && sbp < 100) score += 2;
  else if (sbp >= 100 && sbp < 110) score += 1;
  if (hr >= 100) score += 1;
  if (melena) score += 1;
  if (syncope) score += 2;
  if (hepatic_disease) score += 2;
  if (cardiac_failure) score += 2;
  return {
    score,
    risk: score >= 12 ? 'very_high' : score >= 7 ? 'high' : score >= 1 ? 'moderate' : 'low',
    intervention: score >= 6 ? 'intervention_likely' : 'consider_discharge',
    citation: CITATIONS.ESGE,
  };
}

function bleedingRiskStratification(input) {
  const { active_hematemesis, fresh_blood_per_rectum, sbp, hr, hemoglobin, comorbidities, age } = input;
  const shock = sbp < 90 || hr > 120;
  const massive = hemoglobin < 7 || (active_hematemesis && shock);
  const high_risk = massive || age > 80 || comorbidities === 'severe' || fresh_blood_per_rectum && hr > 120;
  return { shock, massive, high_risk, level_of_care: high_risk ? 'ICU' : 'monitored_unit' };
}

function transfusionStrategy(input) {
  const { hemoglobin, active_bleeding, hx_mi, hx_stroke, cirrhosis } = input;
  const threshold_restrictive = cirrhosis ? 7 : 8;
  const threshold_full = cirrhosis ? 9 : 10;
  const target = active_bleeding ? threshold_full : threshold_restrictive;
  const restrictive = hemoglobin >= threshold_restrictive && !active_bleeding;
  const plz_hint = 'platelets <50 OR (active_bleeding AND <80) — consider_platelet';
  const ffp_hint = 'INR >1.5 with active bleeding — consider_FFP_or_vitamin_K';
  return { target_hgb: target, restrictive_strategy: restrictive, platelets_threshold: plz_hint, ffp_threshold: ffp_hint, avoid_overtransfusion: hx_mi || hx_stroke };
}

function endoscopyTiming(input) {
  const { source, hemodynamic, risk_score } = input;
  if (source === 'upper' && hemodynamic === 'unstable') return { timing: 'within_12h_after_resuscitation', ward: 'ICU_or_endoscopy_suite' };
  if (source === 'upper' && risk_score >= 6) return { timing: 'within_24h' };
  if (source === 'lower' && hemodynamic === 'unstable') return { timing: 'within_24h', note: 'consider_upper_bleeding_until_proven_otherwise' };
  if (source === 'lower') return { timing: 'elective_24_72h_or_outpatient' };
  return { timing: 'urgent', ward: 'high_dependency' };
}

function varicealBleedingManagement(input) {
  const { active_bleeding, band_ligation_done, on_beta_blocker, child_pugh_class } = input;
  const resuscitate = { vasoactive: ['octreotide_50ug_bolus_then_25_ug_h_5days', 'terlipressin_2mg_q4h'], antibiotic: ['ceftriaxone_1g_daily_5days', 'ciprofloxacin_if_cephalosporin_allergy'] };
  const endoscopic = band_ligation_done ? 'band_ligation_confirmed' : 'urgent_band_ligation_required';
  return {
    vasoactive_therapy: resuscitate.vasoactive,
    prophylactic_antibiotic: resuscitate.antibiotic,
    endoscopic_therapy: endoscopic,
    rescue_therapy: child_pugh_class === 'B' || child_pugh_class === 'C' ? 'consider_TIPS_or_sengstaken' : 'continue_medical',
    citation: CITATIONS.Baveno_VII,
  };
}

module.exports = { glasgowBlatchford, bleedingRiskStratification, transfusionStrategy, endoscopyTiming, varicealBleedingManagement, CITATIONS, ValidationError };