// filepath: tier5_mtm_ext_104_deprescribing_engine.js
// TIER5_MTM_EXT-104: Deprescribing (Beers, STOPP, dose reduction, taper)
'use strict';

const CITATIONS = [
  'AGS_Beers_2023',
  'STOPP_START_2023',
  'Australian_Deprescribing_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function beers_criteria(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['diphenhydramine','benzodiazepine','z_drug_zolpidem','sulfonylurea_long_acting','tricyclic_antidepressant','anticholinergic_overall','antipsychotic_typical','antipsychotic_atypical','sliding_scale_insulin','megestrol']);
  ensureBool(req.documented_indication, 'documented_indication');
  ensureBool(req.alternative_attempted, 'alternative_attempted');

  let decision;
  if (req.age < 65) decision = 'continue_with_age_below_65_review';
  else if (!req.documented_indication) decision = 'continue_with_discontinuation_review';
  else if (!req.alternative_attempted) decision = 'continue_with_alternative_review';
  else decision = 'continue_with_cautious_review';
  return { decision };
}

function stopp_start(req) {
  ensureStr(req.criterion, 'criterion');
  ensureEnum(req.criterion, 'criterion', ['loop_diuretic_first_line_hypertension','first_line_depression','benzodiazepine_fall_history','opioid_first_line_pain','ppi_long_term','anticholinergic_cognitive','metformin_egfr_30','digoxin_first_line_hf','antiplatelet_bleeding_risk','ssri_bleeding_risk']);
  ensureBool(req.criterion_triggered, 'criterion_triggered');
  ensureNumber(req.age, 'age');
  ensureNumber(req.egfr, 'egfr');

  let plan;
  if (!req.criterion_triggered) plan = 'continue_with_review';
  else if (req.criterion === 'metformin_egfr_30' && req.egfr < 30) plan = 'continue_with_discontinuation_review';
  else plan = 'continue_with_alternative_review';
  return { plan };
}

function dose_reduction(req) {
  ensureNumber(req.days_on_drug, 'days_on_drug');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureBool(req.lab_value_improved, 'lab_value_improved');
  ensureBool(req.side_effects_present, 'side_effects_present');
  ensureBool(req.renal_function_improved, 'renal_function_improved');

  let plan;
  if (req.renal_function_improved && req.dose_mg > 5) plan = 'continue_with_dose_reduction_review';
  else if (req.side_effects_present) plan = 'continue_with_dose_reduction_review';
  else if (req.lab_value_improved && req.dose_mg > 10) plan = 'continue_with_dose_reduction_review';
  else plan = 'continue_with_review';
  return { plan };
}

function drug_switch(req) {
  ensureBool(req.side_effects_intolerable, 'side_effects_intolerable');
  ensureBool(req.contraindication_now_present, 'contraindication_now_present');
  ensureBool(req.better_alternative_available, 'better_alternative_available');
  ensureBool(req.cost_barrier, 'cost_barrier');
  ensureNumber(req.days_on_current, 'days_on_current');

  let plan;
  if (req.contraindication_now_present) plan = 'continue_with_immediate_switch_review';
  else if (req.side_effects_intolerable && req.better_alternative_available) plan = 'continue_with_switch_review';
  else if (req.cost_barrier && req.better_alternative_available) plan = 'continue_with_switch_review';
  else plan = 'continue_with_review';
  return { plan };
}

function taper(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['benzodiazepine','ssri','snri','gaba_analog','opioid','proton_pump_inhibitor','antipsychotic','anticholinergic']);
  ensureNumber(req.days_on_drug, 'days_on_drug');
  ensureNumber(req.taper_weeks_planned, 'taper_weeks_planned');
  ensureBool(req.withdrawal_risk_high, 'withdrawal_risk_high');

  let plan;
  if (req.withdrawal_risk_high && req.taper_weeks_planned < 4) plan = 'continue_with_slower_taper_review';
  else if (req.days_on_drug >= 180 && req.taper_weeks_planned < 8) plan = 'continue_with_slower_taper_review';
  else if (req.drug === 'proton_pump_inhibitor' && req.taper_weeks_planned < 2) plan = 'continue_with_gradual_taper_review';
  else plan = 'continue_with_review';
  return { plan };
}

function discontinuation_symptom(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['benzodiazepine','ssri','snri','opioid','beta_blocker','statin','ppi']);
  ensureNumber(req.days_after_discontinuation, 'days_after_discontinuation');
  ensureBool(req.symptoms_present, 'symptoms_present');
  ensureBool(req.dysphoria_present, 'dysphoria_present');
  ensureBool(req.electrolyte_imbalance_present, 'electrolyte_imbalance_present');

  let plan;
  if (req.electrolyte_imbalance_present) plan = 'continue_with_electrolyte_review';
  else if (req.dysphoria_present) plan = 'continue_with_reinstate_review';
  else if (req.symptoms_present && req.days_after_discontinuation > 14) plan = 'continue_with_slower_taper_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { beers_criteria, stopp_start, dose_reduction, drug_switch, taper, discontinuation_symptom }; }
module.exports = { funcs, CITATIONS, ValidationError };
