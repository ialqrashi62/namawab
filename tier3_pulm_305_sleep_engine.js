/**
 * TIER3_PULM-305 Sleep Medicine Engine
 * OSA severity + STOP-BANG + CPAP titration + insomnia CBT-I eligibility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AASM_2024: 'AASM Manual 2024', ICSD3: 'ICSD-3' };

function stopBang(input) {
  const { snore, tired, observed_stopped_breathing, bp_high, bmi, age, neck_circumference, male } = input;
  const score = [snore, tired, observed_stopped_breathing, bp_high].filter(Boolean).length
    + (bmi > 35 ? 1 : 0)
    + (age > 50 ? 1 : 0)
    + (neck_circumference > 40 ? 1 : 0)
    + (male ? 1 : 0);
  return {
    score, risk: score >= 5 ? 'high' : score >= 3 ? 'intermediate' : 'low',
    recommendation: score >= 5 ? 'PSG (polysomnography) required' : score >= 3 ? 'Consider HSAT' : 'Reassess',
    citation: CITATIONS.AASM_2024,
  };
}

function osaSeverity(input) {
  const { ahi, oxygen_desaturation } = input;
  let severity = 'normal';
  if (ahi >= 30) severity = 'severe';
  else if (ahi >= 15) severity = 'moderate';
  else if (ahi >= 5) severity = 'mild';
  return {
    ahi, severity,
    lowest_spo2: oxygen_desaturation,
    cpap_indicated: ahi >= 15 || (ahi >= 5 && oxygen_desaturation < 90),
    citation: CITATIONS.AASM_2024,
  };
}

function cpapTitration(input) {
  const { initial_pressure, leak_rate, residual_events, ahi } = input;
  let new_pressure = initial_pressure;
  if (residual_events === 'obstructive' && ahi > 5) new_pressure = initial_pressure + 1;
  else if (leak_rate > 24) new_pressure = Math.max(4, initial_pressure - 1);
  return { initial_pressure, new_pressure, residual_ahi: ahi, leak_ok: leak_rate <= 24 };
}

function insomniaCBTI(input) {
  const { sleep_onset_latency_min, wake_after_sleep_min, total_sleep_time_h, sleep_efficiency_pct, isi_score } = input;
  const eligible = sleep_efficiency_pct < 85 && (isi_score >= 15 || wake_after_sleep_min > 30);
  return {
    eligible,
    isi_severity: isi_score >= 22 ? 'severe' : isi_score >= 15 ? 'moderate' : isi_score >= 8 ? 'mild' : 'no_insomnia',
    components: ['stimulus_control', 'sleep_restriction', 'cognitive_restructuring', 'sleep_hygiene', 'relaxation_training'],
    duration_weeks: 6,
    citation: CITATIONS.ICSD3,
  };
}

function restlessLegsSeverity(input) {
  const { irls_score } = input;
  return {
    irls_score,
    severity: irls_score >= 31 ? 'very_severe' : irls_score >= 21 ? 'severe' : irls_score >= 11 ? 'moderate' : irls_score >= 1 ? 'mild' : 'none',
    iron_check: 'ferritin <75 ng/mL → iron supplementation',
    treatment: ['dopamine_agonists', 'alpha2delta_ligands', 'iron_therapy'],
  };
}

module.exports = { stopBang, osaSeverity, cpapTitration, insomniaCBTI, restlessLegsSeverity, CITATIONS, ValidationError };