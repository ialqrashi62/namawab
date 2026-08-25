/**
 * TIER3_ENDO-302 Thyroid Disease Engine
 * Hypothyroid levothyroxine dosing + hyperthyroid (Graves/Toxic Nodule) + thyroid cancer staging + storm + pregnancy
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ATA_HYPO: 'ATA Hypothyroidism 2014', ATA_HYPER: 'ATA Hyperthyroidism 2016', ATA_CANCER: 'ATA Thyroid Cancer 2015', ATA_STORM: 'ATA Thyroid Storm 2024' };

function hypothyroidDosing(input) {
  const { weight_kg, tsh, age, cardiac_history, pregnant } = input;
  let full_dose = 1.6 * weight_kg;
  if (age >= 65 || cardiac_history) full_dose = Math.min(full_dose, 50);
  if (tsh > 100) full_dose = 1.8 * weight_kg;
  if (pregnant && tsh > 2.5) full_dose = 1.8 * weight_kg;
  return {
    starting_dose_mcg: Math.round(full_dose),
    titration_interval_weeks: 6,
    recheck_tsh_interval_months: pregnant ? 4 : 6,
    target_tsh: pregnant && tsh > 2.5 ? 0.5 : age >= 65 ? 3 : 2.5,
    citation: CITATIONS.ATA_HYPO,
  };
}

function hyperthyroidManagement(input) {
  const { tsh, t4_free, t3_free, tsi, age, child_a, atrial_fibrillation, hot_nodule_scan } = input;
  let diagnosis = 'undetermined';
  if (tsi === 'positive') diagnosis = 'graves_disease';
  else if (hot_nodule_scan === 'solitary') diagnosis = 'toxic_adenoma';
  else if (hot_nodule_scan === 'multiple') diagnosis = 'toxic_multinodular_goiter';
  else if (t4_free > 1.8 && t3_free > 5) diagnosis = 'thyrotoxicosis_likely';
  let treatment = ['beta_blocker (propranolol) for symptoms', 'methimazole 20-30mg daily'];
  if (age >= 60 || child_a === 'planning') treatment = ['RAIU_evaluation', 'definitive_therapy_consideration'];
  if (atrial_fibrillation) treatment.push('aggressive_rate_control + anticoagulation_eval');
  return { diagnosis, treatment, methimazole_starting_dose_mg: 20, citation: CITATIONS.ATA_HYPER };
}

function thyroidCancerStaging(input) {
  const { t_stage, n_stage, m_stage, age_at_diagnosis, histology } = input;
  let stage = 'I';
  const age_over_55 = age_at_diagnosis >= 55;
  if (m_stage === 'M1') stage = 'IVC';
  else if (age_over_55) {
    if (t_stage === 'T4a') stage = 'IIIB';
    else if (t_stage === 'T3') stage = 'IIIA';
    else if (t_stage === 'T1' || t_stage === 'T2') stage = 'I';
  } else {
    if (t_stage === 'T4') stage = 'IVA';
    else if (t_stage === 'T3') stage = 'III';
    else if (t_stage === 'T2' || t_stage === 'T1' && n_stage === 'N1a') stage = 'II';
    else if (t_stage === 'T1' && n_stage === 'N0' && m_stage === 'M0') stage = 'I';
  }
  return {
    stage,
    histology,
    surgery_recommendation: 'total_thyroidectomy',
    rai_indicated: ['papillary', 'follicular'].includes(histology) && (stage !== 'I' || age_over_55),
    citation: CITATIONS.ATA_CANCER,
  };
}

function thyroidStormManagement(input) {
  const { burch_wartofsky_score } = input;
  const storm_likely = burch_wartofsky_score >= 45;
  return {
    burch_wartofsky_score: burch_wartofsky_score,
    storm_likely,
    treatment_if_storm: [
      'propranolol 60-80mg q4h OR 0.5-1mg IV q4h',
      'iodine (SSKI or Lugol) 1 hour after PTU/methimazole',
      'PTU 500-1000mg loading then 250mg q4h',
      'hydrocortisone 100mg q8h',
      'cooling + acetaminophen + active_supportive_care',
    ],
    citation: CITATIONS.ATA_STORM,
  };
}

function thyroidInPregnancy(input) {
  const { tsh, t4_free, trimester, anti_tpo } = input;
  const reference_ranges = { 1: { low: 0.1, high: 2.5 }, 2: { low: 0.2, high: 3.0 }, 3: { low: 0.3, high: 3.0 } };
  const ref = reference_ranges[trimester] || reference_ranges[1];
  const hypothyroid = tsh > ref.high;
  const hyperthyroid = tsh < ref.low && t4_free > 1.8;
  return {
    trimester, tsh, t4_free,
    hypothyroid, hyperthyroid,
    levothyroxine_action: hypothyroid ? 'start_levothyroxine_50-100mcg_daily' : 'monitor',
    anti_tpo_positive: anti_tpo === 'positive',
    postpartum_thyroiditis_risk: anti_tpo === 'positive',
    target_tsh: 2.5,
    citation: CITATIONS.ATA_HYPO,
  };
}

module.exports = { hypothyroidDosing, hyperthyroidManagement, thyroidCancerStaging, thyroidStormManagement, thyroidInPregnancy, CITATIONS, ValidationError };