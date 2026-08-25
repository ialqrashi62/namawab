/**
 * TIER3_PULM-304 Pulmonary Hypertension Engine
 * WHO functional class + REVEAL 2.0 risk score + vasoreactivity testing + therapy escalation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ESC_2024: 'ESC/ERS PH Guidelines 2024', REVEAL: 'REVEAL 2.0 Risk Calculator' };

function whoFunctionalClass(input) {
  const { symptoms } = input;
  return { class: symptoms, description: { I: 'No limitation', II: 'Slight limitation', III: 'Marked limitation', IV: 'Inability to carry out any physical activity' }[symptoms] };
}

function revealScore(input) {
  const { age, gender, who_class, systolic_bp, hr, six_min_walk, bnp, rap, dlco, pv_obstruction, scleroderma, renal_function } = input;
  const points = {
    age: age < 60 ? 0 : age >= 80 ? 4 : 2,
    gender: gender === 'female' ? -2 : 0,
    who_class: who_class === 'I' ? -1 : who_class === 'IV' ? 2 : 0,
    systolic_bp: systolic_bp >= 110 ? 2 : systolic_bp < 110 ? 4 : 0,
    hr: hr >= 96 ? 1 : 0,
    six_min_walk: six_min_walk >= 440 ? 0 : six_min_walk >= 320 ? -2 : -5,
    bnp: bnp < 50 ? -1 : bnp >= 1800 ? 5 : 3,
    rap: rap < 14 ? 0 : rap >= 20 ? 4 : 2,
    dlco: dlco >= 40 ? 0 : -3,
    pv_obstruction: pv_obstruction ? -3 : 0,
    scleroderma: scleroderma ? 1 : 0,
    renal_function: renal_function < 60 ? 1 : 0,
  };
  const total = Object.values(points).reduce((a, b) => a + b, 0);
  let risk = 'low'; let mortality_1y = '<2';
  if (total >= 8) { risk = 'very_high'; mortality_1y = '>28'; }
  else if (total >= 7) { risk = 'high'; mortality_1y = '10-15'; }
  else if (total >= 5) { risk = 'intermediate'; mortality_1y = '5-10'; }
  return { total_points: total, risk, mortality_1y_pct: mortality_1y, citation: CITATIONS.REVEAL };
}

function vasoreactivityTesting(input) {
  const { mpap, cardiac_output, pulmonary_capillary_wedge, no_vasodilator_response } = input;
  const positive = !no_vasodilator_response && mpap > 20 && (mpap - 10) >= cardiac_output;
  return {
    vasoreactive: positive,
    calcium_channel_blocker_eligible: positive,
    testing_drugs: ['inhaled_nitric_oxide', 'IV_epoprostenol', 'inhaled_iloprost'],
    citation: CITATIONS.ESC_2024,
  };
}

function therapyEscalation(input) {
  const { who_class, current_therapy, risk_score } = input;
  const recommendations = {
    II_low: ['oral_ERA', 'oral_PDE5i'],
    II_intermediate: ['oral_ERA + PDE5i'],
    III_low: ['oral_ERA + PDE5i'],
    III_intermediate: ['parenteral_prostanoid OR oral combo'],
    IV_high: ['parenteral_prostanoid + combination therapy'],
  };
  const key = `${who_class}_${risk_score}`;
  return {
    current_therapy,
    recommended_therapy: recommendations[key] || ['specialist_referral'],
    citation: CITATIONS.ESC_2024,
  };
}

function followUpInterval(input) {
  const { risk_score, who_class, therapy_type } = input;
  const low_risk = risk_score === 'low' && who_class === 'I' || who_class === 'II';
  return {
    next_visit_months: low_risk ? 6 : risk_score === 'high' ? 1 : risk_score === 'very_high' ? 0.5 : 3,
    next_tests: ['echocardiogram', 'six_min_walk', 'bnp', 'liver_function'],
  };
}

module.exports = { whoFunctionalClass, revealScore, vasoreactivityTesting, therapyEscalation, followUpInterval, CITATIONS, ValidationError };