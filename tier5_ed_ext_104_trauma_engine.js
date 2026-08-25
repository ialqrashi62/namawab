// filepath: tier5_ed_ext_104_trauma_engine.js
// TIER5_ED_EXT-104: Trauma (primary/secondary survey, mechanism, disposition)
'use strict';

const CITATIONS = [
  'ATLS_10th_Ed_2018',
  'EAST_Practice_Management_2022',
  'CDC_Field_Triage_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function primary_survey(req) {
  ensureBool(req.airway_patent, 'airway_patent');
  ensureBool(req.breathing_normal, 'breathing_normal');
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureBool(req.gcs_below_8, 'gcs_below_8');
  ensureBool(req.cervical_spine_clear, 'cervical_spine_clear');

  let plan;
  if (!req.airway_patent) plan = 'continue_with_immediate_airway_review';
  else if (!req.breathing_normal) plan = 'continue_with_immediate_breathing_review';
  else if (req.heart_rate_bpm >= 130 && req.systolic_bp < 90) plan = 'continue_with_hemorrhage_control_review';
  else if (req.gcs_below_8) plan = 'continue_with_intubation_review';
  else if (!req.cervical_spine_clear) plan = 'continue_with_c_spine_immobilization';
  else plan = 'continue_with_secondary_survey';
  return { plan };
}

function secondary_survey(req) {
  ensureBool(req.head_injury, 'head_injury');
  ensureBool(req.chest_injury, 'chest_injury');
  ensureBool(req.abdominal_injury, 'abdominal_injury');
  ensureBool(req.pelvic_fracture, 'pelvic_fracture');
  ensureBool(req.extremity_fracture, 'extremity_fracture');
  ensureBool(req.soft_tissue_injury, 'soft_tissue_injury');

  let recommendation;
  if (req.head_injury && req.chest_injury && req.abdominal_injury) recommendation = 'continue_with_pan_scan_review';
  else if (req.pelvic_fracture) recommendation = 'continue_with_pelvic_xr_then_review';
  else if (req.extremity_fracture) recommendation = 'continue_with_xr_then_review';
  else if (req.soft_tissue_injury) recommendation = 'continue_with_dressing_review';
  else recommendation = 'continue_with_observation_review';
  return { recommendation };
}

function mechanism(req) {
  ensureStr(req.mechanism_type, 'mechanism_type');
  ensureEnum(req.mechanism_type, 'mechanism_type', ['mvc','fall','penetrating','blunt','burn','drowning','hanging','blast','sports','pedestrian_struck']);
  ensureNumber(req.mechanism_severity_score, 'mechanism_severity_score');
  ensureBool(req.ejection_present, 'ejection_present');
  ensureBool(req.belt_used, 'belt_used');
  ensureBool(req.helmet_used, 'helmet_used');

  let triage;
  if (req.mechanism_type === 'mvc' && req.ejection_present) triage = 'continue_with_high_level_triage';
  else if (req.mechanism_type === 'fall' && req.mechanism_severity_score >= 4) triage = 'continue_with_high_level_triage';
  else if (req.mechanism_type === 'penetrating') triage = 'continue_with_surgical_review';
  else if (req.mechanism_type === 'drowning') triage = 'continue_with_observation_for_ards';
  else if (!req.belt_used && req.mechanism_type === 'mvc') triage = 'continue_with_high_level_triage';
  else triage = 'continue_with_standard_triage';
  return { triage };
}

function disposition(req) {
  ensureNumber(req.iss_score, 'iss_score');
  ensureBool(req.operative_intervention_required, 'operative_intervention_required');
  ensureBool(req.icu_required, 'icu_required');
  ensureBool(req.ward_admission_required, 'ward_admission_required');
  ensureBool(req.discharge_safe, 'discharge_safe');

  let disposition;
  if (req.icu_required) disposition = 'continue_with_icu_admission';
  else if (req.operative_intervention_required) disposition = 'continue_with_operative_review';
  else if (req.iss_score >= 15) disposition = 'continue_with_trauma_team_review';
  else if (req.ward_admission_required) disposition = 'continue_with_ward_admission';
  else if (req.discharge_safe) disposition = 'continue_with_discharge_planning';
  else disposition = 'continue_with_observation';
  return { disposition };
}

function pain_mgmt_trauma(req) {
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.hypotension_present, 'hypotension_present');
  ensureBool(req.opioid_safe, 'opioid_safe');
  ensureBool(req.regional_block_planned, 'regional_block_planned');
  ensureBool(req.conscious_sedation_required, 'conscious_sedation_required');

  let plan;
  if (!req.opioid_safe) plan = 'continue_with_regional_block_review';
  else if (req.regional_block_planned) plan = 'continue_with_regional_block_review';
  else if (req.conscious_sedation_required) plan = 'continue_with_conscious_sedation_review';
  else if (req.pain_score >= 7) plan = 'continue_with_iv_opioid_review';
  else if (req.pain_score >= 4) plan = 'continue_with_oral_analgesia_review';
  else plan = 'continue_with_review';
  return { plan };
}

function tetanus_immunization(req) {
  ensureNumber(req.doses_received_in_lifetime, 'doses_received_in_lifetime');
  ensureStr(req.injury_type, 'injury_type');
  ensureEnum(req.injury_type, 'injury_type', ['clean_minor','clean_major','contaminated_major','puncture','burn','bite','crush']);
  ensureNumber(req.years_since_last_tetanus, 'years_since_last_tetanus');
  ensureBool(req.immunocompromised, 'immunocompromised');

  let plan;
  if (req.doses_received_in_lifetime < 3) plan = 'continue_with_tetanus_ig_then_tdap_review';
  else if (req.injury_type === 'clean_minor' && req.years_since_last_tetanus < 10) plan = 'continue_with_no_tdap_needed_review';
  else if (req.immunocompromised || req.injury_type === 'contaminated_major') plan = 'continue_with_tdap_then_tetanus_ig_review';
  else if (req.years_since_last_tetanus >= 10) plan = 'continue_with_tdap_review';
  else if (req.years_since_last_tetanus >= 5 && req.injury_type !== 'clean_minor') plan = 'continue_with_tdap_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { primary_survey, secondary_survey, mechanism, disposition, pain_mgmt_trauma, tetanus_immunization }; }
module.exports = { funcs, CITATIONS, ValidationError };
