/**
 * TIER3_PULM-301 COPD Engine
 * GOLD 2024 staging + exacerbation risk + inhaler adherence
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { GOLD_2024: 'GOLD COPD 2024', ATS_2024: 'ATS/ERS COPD 2024' };

function goldStaging(input) {
  const { fev1_pct, mMRC, cat_score, exacerbations, hospitalizations } = input;
  let airflow = 0;
  if (fev1_pct >= 80) airflow = 1;
  else if (fev1_pct >= 50) airflow = 2;
  else if (fev1_pct >= 30) airflow = 3;
  else airflow = 4;
  const symptom_high = mMRC >= 2 || cat_score >= 10;
  const exac_high = exacerbations >= 2 || hospitalizations >= 1;
  let group = 'A';
  if (symptom_high && exac_high) group = 'D';
  else if (exac_high) group = 'C';
  else if (symptom_high) group = 'B';
  return { group, airflow_severity: airflow, treatment: { A: 'SABA', B: 'LABA+LAMA', C: 'LABA+LAMA+ICS_exac', D: 'LABA+LAMA+ICS_or_triple_therapy' }[group], citation: CITATIONS.GOLD_2024 };
}

function exacerbationSeverity(input) {
  const { dyspnea, sputum_purulence, sputum_volume, rr, hr, spo2 } = input;
  const anthonisen_criteria = [dyspnea, sputum_purulence, sputum_volume].filter(Boolean).length;
  let severity = 'mild';
  if (spo2 < 90 || rr > 30 || hr > 110) severity = 'severe';
  else if (anthonisen_criteria >= 2) severity = 'moderate';
  return { severity, anthonisen_count: anthonisen_criteria, requires_hospitalization: severity === 'severe' || spo2 < 88, citation: CITATIONS.ATS_2024 };
}

function inhalerAdherence(input) {
  const { prescribed_puffs_per_day, actual_puffs_per_day, canisters_used_30d, canisters_expected_30d } = input;
  const adherence_pct = (actual_puffs_per_day / prescribed_puffs_per_day) * 100;
  const refill_adherence = (canisters_used_30d / canisters_expected_30d) * 100;
  const overall = (adherence_pct + refill_adherence) / 2;
  return { adherence_pct: Math.round(adherence_pct * 100) / 100, refill_adherence_pct: Math.round(refill_adherence * 100) / 100, overall: Math.round(overall * 100) / 100, status: overall >= 80 ? 'good' : overall >= 50 ? 'suboptimal' : 'poor' };
}

function oxygenTherapy(input) {
  const { pao2, spo2, copd_severity, smoking_status } = input;
  const ltot_indicated = pao2 < 55 || (pao2 < 60 && copd_severity === 'severe' && smoking_status === 'current');
  const target_spo2 = 88;
  const flow_l_min = pao2 < 50 ? 2 : pao2 < 60 ? 1.5 : 1;
  return { ltot_indicated, target_spo2, recommended_flow_l_min: flow_l_min, citation: CITATIONS.ATS_2024 };
}

function pulmonaryRehab(input) {
  const { mMRC, cat_score, fev1_pct, exacerbations_per_year } = input;
  const eligible = mMRC >= 2 || cat_score >= 10 || exacerbations_per_year >= 2;
  return { eligible, duration_weeks: eligible ? 8 : 0, sessions_per_week: 3, components: ['exercise_training', 'education', 'breathing_techniques', 'psychological_support'] };
}

function vaccinationPlan(input) {
  const { age, smoker, last_influenza, last_pneumococcal, last_covid_booster } = input;
  return {
    influenza: !last_influenza || (new Date() - new Date(last_influenza)) > 365 * 24 * 60 * 60 * 1000 ? 'DUE' : 'CURRENT',
    pneumococcal: age >= 65 && (!last_pneumococcal || last_pneumococcal === 'PCV13_only') ? 'PCV20_DUE' : 'CURRENT',
    covid_booster: !last_covid_booster ? 'DUE' : 'CURRENT',
    zoster: age >= 50 ? 'DUE' : 'N/A',
  };
}

module.exports = {
  goldStaging, exacerbationSeverity, inhalerAdherence, oxygenTherapy, pulmonaryRehab, vaccinationPlan,
  CITATIONS, ValidationError,
};