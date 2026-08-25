/**
 * TIER3_PULM-302 Asthma Engine
 * GINA 2024 control + ACT score + step therapy + biologics eligibility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { GINA_2024: 'GINA Asthma 2024', NAEPP: 'NAEPP EPR-4 2024' };

function ginaControl(input) {
  const { symptoms_during_day, nighttime_awakenings, reliever_use, activity_limitation } = input;
  let well_controlled = symptoms_during_day <= 2 && nighttime_awakenings === 0 && reliever_use <= 2 && !activity_limitation;
  let partly_controlled = !well_controlled && (symptoms_during_day <= 4 && nighttime_awakenings <= 1 && reliever_use <= 4 && !activity_limitation);
  return {
    well_controlled,
    partly_controlled,
    uncontrolled: !well_controlled && !partly_controlled,
    recommended_step: well_controlled ? 'maintain' : partly_controlled ? 'step_up_1_level' : 'step_up_2_levels',
    citation: CITATIONS.GINA_2024,
  };
}

function actScore(input) {
  const { act_total } = input;
  let control = 'uncontrolled';
  if (act_total >= 20) control = 'well_controlled';
  else if (act_total >= 16) control = 'not_well_controlled';
  return { act_total, control, recommendation: control === 'well_controlled' ? 'maintain' : 'step_up' };
}

function stepTherapy(input) {
  const { current_step, control_status, exacerbations } = input;
  let new_step = current_step;
  if (control_status === 'uncontrolled' || exacerbations >= 2) new_step = Math.min(6, current_step + 1);
  else if (control_status === 'well_controlled' && exacerbations === 0) new_step = Math.max(1, current_step - 1);
  const treatments = {
    1: ['PRN SABA'],
    2: ['PRN SABA', 'Low-dose ICS-formoterol'],
    3: ['Low-dose ICS-LABA daily'],
    4: ['Medium-dose ICS-LABA'],
    5: ['High-dose ICS-LABA', 'Consider LAMA', 'Consider biologic'],
    6: ['High-dose ICS-LABA', 'LAMA', 'Biologic', 'Oral corticosteroid'],
  };
  return { current_step, new_step, treatments: treatments[new_step] || [] };
}

function biologicsEligibility(input) {
  const { eosinophil_count, exacerbations_per_year, ics_dose_steps, allergic, nasal_polyps } = input;
  const criteria = {
    eosinophil_count: eosinophil_count >= 300,
    exacerbations: exacerbations_per_year >= 2,
    high_ics: ics_dose_steps >= 4,
  };
  const eligible = Object.values(criteria).filter(Boolean).length >= 2;
  const candidates = [];
  if (eligible) {
    if (allergic) candidates.push('omalizumab');
    if (eosinophil_count >= 150) candidates.push('mepolizumab');
    if (eosinophil_count >= 300) candidates.push('benralizumab');
    if (nasal_polyps) candidates.push('dupilumab');
    if (exacerbations_per_year >= 3) candidates.push('tezepelumab');
  }
  return { eligible, criteria, candidates, citation: CITATIONS.GINA_2024 };
}

function exerciseInducedBronchoconstriction(input) {
  const { fev1_drop_pct, symptoms_present } = input;
  return {
    eib_diagnosed: fev1_drop_pct >= 10 && symptoms_present,
    severity: fev1_drop_pct >= 30 ? 'severe' : fev1_drop_pct >= 20 ? 'moderate' : 'mild',
    pre_treatment: 'SABA 15min before exercise or daily LTRA',
  };
}

function asthmaActionPlan(input) {
  const { peak_flow_pct, current_zone } = input;
  return {
    zones: {
      green: { criteria: peak_flow_pct >= 80, action: 'Continue maintenance' },
      yellow: { criteria: peak_flow_pct >= 50 && peak_flow_pct < 80, action: 'Increase reliever + call doctor if not improving in 24h' },
      red: { criteria: peak_flow_pct < 50, action: 'Take oral steroids + call emergency / 911' },
    },
    current_zone: current_zone || (peak_flow_pct >= 80 ? 'green' : peak_flow_pct >= 50 ? 'yellow' : 'red'),
    citation: CITATIONS.NAEPP,
  };
}

module.exports = { ginaControl, actScore, stepTherapy, biologicsEligibility, exerciseInducedBronchoconstriction, asthmaActionPlan, CITATIONS, ValidationError };