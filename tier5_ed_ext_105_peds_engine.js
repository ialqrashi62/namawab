// filepath: tier5_ed_ext_105_peds_engine.js
// TIER5_ED_EXT-105: Pediatric ED (PEWS, age-specific, equipment)
'use strict';

const CITATIONS = [
  'PEWS_Validation_2018',
  'PALS_2020_AHA',
  'AAP_Pediatric_ED_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pews(req) {
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.spo2_pct, 'spo2_pct');
  ensureBool(req.capillary_refill_normal, 'capillary_refill_normal');
  ensureBool(req.oxygen_therapy, 'oxygen_therapy');

  let score = 0;
  if (req.heart_rate_bpm > 180 || req.heart_rate_bpm < 50) score += 2;
  else if (req.heart_rate_bpm > 150 || req.heart_rate_bpm < 60) score += 1;
  if (req.respiratory_rate > 70 || req.respiratory_rate < 10) score += 2;
  else if (req.respiratory_rate > 50 || req.respiratory_rate < 20) score += 1;
  if (req.systolic_bp > 110 || req.systolic_bp < 40) score += 2;
  else if (req.systolic_bp > 90 || req.systolic_bp < 50) score += 1;
  if (req.spo2_pct < 90) score += 2;
  else if (req.spo2_pct <= 95) score += 1;
  if (!req.capillary_refill_normal) score += 2;
  if (req.oxygen_therapy) score += 1;

  let action;
  if (score >= 7) action = 'continue_with_immediate_review';
  else if (score >= 4) action = 'continue_with_urgent_review';
  else if (score >= 1) action = 'continue_with_observation';
  else action = 'continue_with_routine';
  return { pews_score: score, action };
}

function age_dosing(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['acetaminophen','ibuprofen','amoxicillin','cefdinir','azithromycin','diphenhydramine','ondansetron','midazolam','fentanyl','morphine','albuterol','prednisolone','dexamethasone']);
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureStr(req.route, 'route');
  ensureEnum(req.route, 'route', ['po','pr','iv','im','inhalation','intranasal','subcutaneous']);
  ensureBool(req.allergy_present, 'allergy_present');

  let plan;
  if (req.allergy_present) plan = 'continue_with_alternative_drug_review';
  else if (req.age_years < 1 && req.drug === 'diphenhydramine') plan = 'continue_with_caution_review';
  else if (req.drug === 'morphine' && req.weight_kg < 10) plan = 'continue_with_weight_based_review';
  else plan = 'continue_with_standard_pediatric_dosing';
  return { plan };
}

function pediatric_airway(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.croup_cough, 'croup_cough');
  ensureBool(req.stridor_present, 'stridor_present');
  ensureBool(req.barking_cough, 'barking_cough');
  ensureBool(req.epiglottitis_suspected, 'epiglottitis_suspected');
  ensureBool(req.foreign_body_aspiration, 'foreign_body_aspiration');

  let plan;
  if (req.epiglottitis_suspected) plan = 'continue_with_immediate_airway_review';
  else if (req.stridor_present && req.barking_cough) plan = 'continue_with_steam_then_dexamethasone_review';
  else if (req.foreign_body_aspiration) plan = 'continue_with_rigid_bronchoscopy_review';
  else if (req.croup_cough) plan = 'continue_with_steroid_review';
  else plan = 'continue_with_review';
  return { plan };
}

function pediatric_resus(req) {
  ensureBool(req.cardiac_arrest, 'cardiac_arrest');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.iv_or_io_access, 'iv_or_io_access');
  ensureNumber(req.epinephrine_dose_mcg, 'epinephrine_dose_mcg');
  ensureBool(req.defibrillation_required, 'defibrillation_required');
  ensureBool(req.cpr_in_progress, 'cpr_in_progress');

  let plan;
  if (!req.iv_or_io_access && req.cardiac_arrest) plan = 'continue_with_immediate_io_access';
  else if (req.epinephrine_dose_mcg === 0 && req.cardiac_arrest) plan = 'continue_with_epinephrine_dose_review';
  else if (req.defibrillation_required && req.cpr_in_progress) plan = 'continue_with_defibrillation_review';
  else if (!req.cpr_in_progress && req.cardiac_arrest) plan = 'continue_with_cpr_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function pediatric_sepsis(req) {
  ensureNumber(req.temp_c, 'temp_c');
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureBool(req.bacterial_infection_suspected, 'bacterial_infection_suspected');
  ensureBool(req.blood_culture_drawn, 'blood_culture_drawn');
  ensureNumber(req.crystalloid_bolus_ml, 'crystalloid_bolus_ml');
  ensureBool(req.antibiotic_within_1_hour, 'antibiotic_within_1_hour');

  let plan;
  if (req.bacterial_infection_suspected && !req.blood_culture_drawn) plan = 'continue_with_blood_culture_review';
  else if (!req.antibiotic_within_1_hour) plan = 'continue_with_immediate_antibiotic_review';
  else if (req.heart_rate_bpm >= 180 && req.temp_c >= 38) plan = 'continue_with_fluid_bolus_review';
  else if (req.crystalloid_bolus_ml === 0) plan = 'continue_with_crystalloid_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function pediatric_trauma(req) {
  ensureBool(req.head_injury, 'head_injury');
  ensureBool(req.gcs_below_13, 'gcs_below_13');
  ensureBool(req.mechanism_significant, 'mechanism_significant');
  ensureBool(req.ct_head_done, 'ct_head_done');
  ensureBool(req.pecarn_applied, 'pecarn_applied');

  let plan;
  if (req.gcs_below_13) plan = 'continue_with_immediate_ct_review';
  else if (req.head_injury && req.mechanism_significant && req.pecarn_applied === false) plan = 'continue_with_pecarn_review';
  else if (req.head_injury && req.ct_head_done === false) plan = 'continue_with_ct_head_review';
  else plan = 'continue_with_observation';
  return { plan };
}

function funcs() { return { pews, age_dosing, pediatric_airway, pediatric_resus, pediatric_sepsis, pediatric_trauma }; }
module.exports = { funcs, CITATIONS, ValidationError };
