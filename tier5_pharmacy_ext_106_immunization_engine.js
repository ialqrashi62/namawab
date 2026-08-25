// filepath: tier5_pharmacy_ext_106_immunization_engine.js
// TIER5_PHARMACY_EXT-106: Immunization (eligibility, schedule, catch-up, pregnancy, post-exposure)
'use strict';

const CITATIONS = [
  'CDC_Adult_Vaccine_Schedule_2023',
  'AAP_Pediatrics_2023',
  'WHO_SAGE_Vaccines_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function immunization_eligibility(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.vaccine, 'vaccine');
  ensureEnum(req.vaccine, 'vaccine', ['influenza','covid','tdap','pneumococcal_polysaccharide','pneumococcal_conjugate','varicella','mmr','hpv9','haemophilus_type_b','rotavirus','hepatitis_a_adult','hepatitis_b_adult','hepatitis_b_3dose_pediatric','meningococcal_acwy','meningococcal_b','rabies_pre_exposure','yellow_fever','chikungunya','rabies_post_exposure','japanese_encephalitis','cholera']);
  ensureNumber(req.dose_priority_index, 'dose_priority_index');
  ensureBool(req.chronic_conditions_eg_immunocompromised, 'chronic_conditions_eg_immunocompromised');
  ensureBool(req.pregnancy_or_breastfeeding, 'pregnancy_or_breastfeeding');

  let action;
  if (req.vaccine === 'varicella' && (req.pregnancy_or_breastfeeding || req.chronic_conditions_eg_immunocompromised)) action = 'defer_varicella_until_resolution_of_pregnancy_or_follow_gastroenterology_specialist';
  else if (req.vaccine === 'mmr' && (req.pregnancy_or_breastfeeding)) action = 'defer_mmr_until_pregnancy_resolves';
  else if (req.vaccine === 'influenza' && req.chronic_conditions_eg_immunocompromised) action = 'administer_high_dose_or_adjuvanted_influenza_annually_no_live_vaccination_required';
  else if (req.dose_priority_index >= 1) action = 'priority_offered_for_specialist_review_then_administration';
  else action = 'administer_per_protocol';
  return { vaccine: req.vaccine, action };
}

function catch_up_vaccine(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.record_reviewed, 'record_reviewed');
  ensureNumber(req.missed_doses_count, 'missed_doses_count');
  ensureBool(req.allow_accelerated_schedule, 'allow_accelerated_schedule');

  let plan;
  if (req.missed_doses_count >= 3 && req.allow_accelerated_schedule) plan = 'accelerated_3_dose_then_reassess_in_2_months';
  else if (req.missed_doses_count >= 1) plan = 'continue_standard_catch_up_with_minimum_4_weeks_between_doses';
  else plan = 'no_catch_up_required';

  if (req.record_reviewed === false) plan += '_first_review_record_then_plan_catch_up';
  return { plan };
}

function pregnancy_vaccine(req) {
  ensureStr(req.vaccine, 'vaccine');
  ensureEnum(req.vaccine, 'vaccine', ['tdap','influenza_quadrivalent','covid','hepatitis_b','pneumococcal_polysaccharide','meningococcal_acwy','rabies_post_exposure','japanese_encephalitis','varicella','mmr','hpv9']);
  ensureNumber(req.trimester, 'trimester');
  ensureBool(req.breastfeeding, 'breastfeeding');

  let recommendation;
  if (req.vaccine === 'tdap' && req.trimester === 3) recommendation = 'administer_tdap_in_third_trimester_each_pregnancy_then_record_antipertussis_antibody_persistence';
  else if (req.vaccine === 'influenza_quadrivalent') recommendation = 'administer_quadrivalent_in_november_to_february_regardless_of_pregnancy';
  else if (['varicella','mmr'].includes(req.vaccine)) recommendation = 'defer_live_vaccines_until_postpartum';
  else if (req.vaccine === 'hpv9') recommendation = 'defer_until_postpartum_or_until_breastfeeding_resolves';
  else recommendation = 'consider_benefits_vs_risks_then_offer_per_ob_recommendation';
  return { recommendation };
}

function post_exposure(req) {
  ensureStr(req.exposure, 'exposure');
  ensureEnum(req.exposure, 'exposure', ['hepatitis_b','hepatitis_a','tetanus','rabies','varicella','measles','chickenpox','hiv','anthrax_baa']);
  ensureNumber(req.hours_since_exposure, 'hours_since_exposure');
  ensureBool(req.prior_vaccination_complete, 'prior_vaccination_complete');

  let plan;
  if (req.exposure === 'rabies' && req.hours_since_exposure > 0) plan = 'high_risk_rabies_ig_with_dose_0_3_5_7_14_28_days_completed';
  else if (req.exposure === 'hepatitis_b' && !req.prior_vaccination_complete) plan = 'hbv_immunoglobulin_with_active_immunization_with_completion_at_0_1_2_months';
  else if (req.exposure === 'tetanus' && !req.prior_vaccination_complete) plan = 'tetanus_immunoglobulin_with_active_immunization_finally_tdap_at_4_weeks_then_completed';
  else if (req.exposure === 'measles' && req.hours_since_exposure <= 96) plan = 'measles_immune_globulin_with_close_contact_review';
  else if (req.exposure === 'varicella' && req.hours_since_exposure <= 96) plan = 'varicella_zoster_immune_globulin_if_eligible';
  else if (req.exposure === 'hiv') plan = 'hiv_pep_rapid_test_then_protocol';
  else plan = 'consider_post_exposure_prophylaxis_then_review_followup';
  return { plan };
}

function immune_titer(req) {
  ensureStr(req.vaccine, 'vaccine');
  ensureEnum(req.vaccine, 'vaccine', ['hepatitis_b_anti_hbs','measles','rubella','varicella','mumps','dtp_diphtheria_tetanus_pertussis','hep_b_3dose_pediatric']);
  ensureNumber(req.titer_value, 'titer_value');
  ensureNumber(req.threshold_protective, 'threshold_protective');

  let status;
  if (req.titer_value >= req.threshold_protective) status = 'protective';
  else if (req.titer_value >= req.threshold_protective / 2) status = 'low_potential_revaccinate_then_re-check';
  else status = 'non_immune_vaccinate_series_then_re_check';
  return { status };
}

function funcs() { return { immunization_eligibility, catch_up_vaccine, pregnancy_vaccine, post_exposure, immune_titer }; }
module.exports = { funcs, CITATIONS, ValidationError };
