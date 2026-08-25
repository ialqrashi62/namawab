// filepath: tier5_home_health_ext_103_home_infusion_engine.js
// TIER5_HOME_HEALTH_EXT-103: Home infusion/IV therapy (antibiotic, TPN, IVIG, pump)
'use strict';

const CITATIONS = [
  'INS_Infusion_Therapy_Standards_2018',
  'NHIA_Home_Infusion_2020',
  'ASHP_Home_Infusion_2019',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function antibiotic_home(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['ceftriaxone','vancomycin','ceftazidime','cefepime','meropenem','daptomycin','oxacillin','penicillin_g','ampicillin','gentamicin','linezolid','ertapenem','other_beta_lactam']);
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureNumber(req.dose_interval_hours, 'dose_interval_hours');
  ensureNumber(req.treatment_duration_days, 'treatment_duration_days');
  ensureBool(req.anaphylaxis_history, 'anaphylaxis_history');
  ensureNumber(req.egfr, 'egfr');

  let safety_check;
  if (req.egfr > 0 && req.egfr < 30 && req.drug === 'vancomycin') safety_check = 'risk_high_check_trough_levels_then_dose_adjust';
  else if (req.dose_interval_hours < 6) safety_check = 'very_high_frequency_evaluate_pump_use_then_assess_anaphylaxis_education';
  else if (req.treatment_duration_days > 21) safety_check = 'long_course_consider_picc_line_then_line_maintenance_education';
  else if (req.anaphylaxis_history && req.drug === 'ceftriaxone') safety_check = 'severe_anaphylaxis_history_then_seek_alternative_antibiotic_or_have_concerns';
  else safety_check = 'standard_home_infusion_with_kit_and_pump';

  return { safety_check, drug: req.drug, dose_mg: req.dose_mg, duration_days: req.treatment_duration_days };
}

function tpn_home(req) {
  ensureNumber(req.energy_kcal_per_day, 'energy_kcal_per_day');
  ensureNumber(req.protein_g_per_day, 'protein_g_per_day');
  ensureNumber(req.fluid_ml_per_day, 'fluid_ml_per_day');
  ensureNumber(req.dextrose_concentration_pct, 'dextrose_concentration_pct');
  ensureNumber(req.lipid_amount_ml_per_day, 'lipid_amount_ml_per_day');
  ensureNumber(req.tunneled_line_days_in_place, 'tunneled_line_days_in_place');

  if (req.tunneled_line_days_in_place > 7 * 30) {
    return { status: 'consider_line_replacement_then_reassess', recommendation: 'line_in_place_over_7_months_warrant_replacement', note: 'risk_of_line_sepsis_or_obstruction' };
  }
  if (req.fluid_ml_per_day < 1500) return { status: 'low_fluid_call_dietitian_to_increase_hydration_then_reassess', recommendation: 'update_tpn_then_recheck_renal_function_then_daily_weights' };
  return { status: 'standard_tpn_reassess_lipid_carbohydrate_ratio_weekly_then_continue_in_home' };
}

function ivig_home(req) {
  ensureNumber(req.dose_g_per_kg, 'dose_g_per_kg');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.max_infusion_rate_mL_per_kg_per_hr, 'max_infusion_rate_mL_per_kg_per_hr');
  ensureBool(req.pre_medication_with_antihistamine, 'pre_medication_with_antihistamine');

  const total_g = req.dose_g_per_kg * req.weight_kg;
  let pre_meds_required = ['antihistamine','acetaminophen'];
  if (total_g >= 70 && req.max_infusion_rate_mL_per_kg_per_hr > 2) pre_meds_required.push('corticosteroid');

  return {
    total_dose_g: Math.round(total_g * 100) / 100,
    pre_meds_required,
    rate_title: req.max_infusion_rate_mL_per_kg_per_hr > 2 ? 'consider_rate_titration_then_obs_for_24h' : 'maintain_rate_observed_use_pump_with_alarm',
    infusion_clinic_or_home: total_g >= 80 ? 'infusion_clinic_then_home' : 'home',
  };
}

function pump_alarm(req) {
  ensureStr(req.alarm_type, 'alarm_type');
  ensureEnum(req.alarm_type, 'alarm_type', ['low_battery','occlusion_high','air_in_line','high_pressure','flow_reversal','missing_setup','screen_disabled','not_operational','other']);
  ensureStr(req.alarm_management, 'alarm_management');
  ensureEnum(req.alarm_management, 'alarm_management', ['self_cleared','couple_to_visit_again','couple_directions_to_home_caregiver','pump_replaced']);
  ensureBool(req.family_present_and_decision_made, 'family_present_and_decision_made');

  return {
    alarm_type: req.alarm_type,
    family_or_caregiver_present: req.family_present_and_decision_made,
    recommended_action:
      req.alarm_management === 'self_cleared' ? 'document_only' :
      req.alarm_management === 'couple_directions_to_home_caregiver' ? 'send_smart_agent_for_direction' :
      req.alarm_management === 'couple_to_visit_again' ? 'send_next_visit_for_pump_with_compliance_visit' :
      req.alarm_management === 'pump_replaced' ? 'replace_pump_resume_infusion_then_recheck_in_4h' :
      'review_specified_by_alarm_resolution_team'
  };
}

function line_care(req) {
  ensureStr(req.line_type, 'line_type');
  ensureEnum(req.line_type, 'line_type', ['picc','midline','central_tunneled_cuffed','central_non_tunneled','peripheral_iv','port_a_cath']);
  ensureBool(req.dressing_intact, 'dressing_intact');
  ensureBool(req.extrusion_or_displacement, 'extrusion_or_displacement');
  ensureBool(req.line_flushes_with_neutral_pressure, 'line_flushes_with_neutral_pressure');
  ensureBool(req.skin_or_insertion_site_clean, 'skin_or_insertion_site_clean');

  if (req.extrusion_or_displacement) return { verdict: 'unsafe_replace_or_reinsert', citation: CITATIONS[0] };
  if (!req.dressing_intact) return { verdict: 'change_dressing_then_doc_within_24h' };
  if (!req.line_flushes_with_neutral_pressure) return { verdict: 'consider_tpa_clot_lysis_or_refer_xray_line_study' };
  if (!req.skin_or_insertion_site_clean) return { verdict: 'consider_chlorhexidine_bath_then_dressing_change' };
  return { verdict: 'standard_line_care_continue_with_weekly_dressing_change' };
}

function funcs() { return { antibiotic_home, tpn_home, ivig_home, pump_alarm, line_care }; }
module.exports = { funcs, CITATIONS, ValidationError };
