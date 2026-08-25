// filepath: tier5_forensic_ext_102_sa_engine.js
// TIER5_FORENSIC_EXT-102: Sexual assault (history, exam, specimens, safety, HIV/PEP)
'use strict';

const CITATIONS = [
  'WHO_SA_Clinical_2019',
  'CDC_STI_TX_2021',
  'FSH_SA_2018',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sa_history(req) {
  ensureNumber(req.time_since_event_hours, 'time_since_event_hours');
  ensureNumber(req.assailant_type, 'assailant_type'); // 0 stranger, 1 known
  ensureNumber(req.types_of_contact, 'types_of_contact'); // 0 vaginal only, 1 anal, 2 oral, others
  ensureBool(req.prior_consent_required, 'prior_consent_required');
  ensureBool(req.prior_sexual_history_recorded, 'prior_sexual_history_recorded');
  ensureNumber(req.consent_age_years_patient, 'consent_age_years_patient');

  let triage;
  if (req.time_since_event_hours < 72 && req.consent_age_years_patient < 18) triage = 'red_urgent_safeguarding_eval_collection_within_72h_pep_required';
  else if (req.time_since_event_hours < 72) triage = 'red_urgent_pep_within_72h_then_forensic_collection_and_followup';
  else if (req.time_since_event_hours < 168) triage = 'urgent_collection_within_one_week_then_safety_assessment';
  else if (req.consent_age_years_patient < 18) triage = 'refer_to_child_protection_with_specialist_then_documentation';
  else triage = 'routine_comprehensive_care_then_safety_disclosure';

  if (!req.prior_consent_required) triage = 'follow_up_visit_to_obtain_consent_thoroughly';

  return { triage };
}

function sa_exam(req) {
  ensureBool(req.genital_injury_present, 'genital_injury_present');
  ensureBool(req.anogenital_signs_documented, 'anogenital_signs_documented');
  ensureBool(req.urine_toxicology_screen_done, 'urine_toxicology_screen_done');
  ensureNumber(req.examination_quality_score, 'examination_quality_score');
  ensureNumber(req.anoscopy_done, 'anoscopy_done');
  ensureNumber(req.colposcopy_done, 'colposcopy_done');

  let quality;
  if (req.examination_quality_score >= 8 && req.anoscopy_done >= 1 && req.colposcopy_done >= 1 && req.urine_toxicology_screen_done && req.anogenital_signs_documented) quality = 'optimal_examination_with_forensic_appropriate_imaging';
  else if (req.anogenital_signs_documented && req.examination_quality_score >= 6) quality = 'adequate_examination_documentation_through_specialty';
  else if (req.urine_toxicology_screen_done) quality = 'minimal_documentation_with_toxicology_review_then_follow_up';
  else quality = 'consider_re_examine_or_refer_to_specialist_safeguarding_then_revisit_complete_history';

  return { examination_quality: quality };
}

function sa_specimens(req) {
  ensureBool(req.sample_collection_within_120h, 'sample_collection_within_120h');
  ensureStr(req.specimens_collected, 'specimens_collected');
  ensureEnum(req.specimens_collected, 'specimens_collected', ['vaginal_forensic_v2_naat','cervical_swab','anal_swab','oral_swab','pubic_hair_samples','saliva_swab_to_compare_str_dna','reference_dna','toxicology_urine','toxicology_blood_all_chains_of_custody']);
  ensureBool(req.written_documented_chain_of_custody, 'written_documented_chain_of_custody');
  ensureNumber(req.specimen_count, 'specimen_count');

  let verdict;
  if (!req.sample_collection_within_120h) verdict = 'specimens_outside_window_review_for_partial_recovery';
  else if (!req.written_documented_chain_of_custody) verdict = 'chain_of_custody_documented_with_tamper_evident_seals';
  else if (req.specimen_count >= 6) verdict = 'comprehensive_collection_complete_with_chain_audit';
  else if (req.specimen_count >= 3) verdict = 'standard_collection_done_review_for_completeness';
  else verdict = 'insufficient_specimens_consider_extending_collection';

  return { verdict };
}

function sa_safety(req) {
  ensureBool(req.danger_present_now, 'danger_present_now');
  ensureStr(req.living_with_perpetrator_status, 'living_with_perpetrator_status');
  ensureEnum(req.living_with_perpetrator_status, 'living_with_perpetrator_status', ['no','yes_with_children','yes_alone','unknown_to_provider']);
  ensureBool(req.children_in_home, 'children_in_home');
  ensureBool(req.weapon_history, 'weapon_history');
  ensureBool(req.safe_to_return, 'safe_to_return');

  let plan;
  if (req.danger_present_now) plan = 'urgent_refer_to_safe_house_then_police';
  else if (!req.safe_to_return) plan = 'safe_house_or_family_or_friends_avoid_returning_home';
  else if (req.children_in_home) plan = 'consult_cps_or_social_work_for_pediatric_referral_or_legal_advocacy';
  else if (req.weapon_history) plan = 'safe_storage_of_weapons_with_petitioner_or_volunteer';
  else if (req.living_with_perpetrator_status === 'no') plan = 'safety_plan_completed_then_followup_call_in_2_4_weeks';

  return { plan };
}

function sa_prophylaxis(req) {
  ensureNumber(req.time_since_event_hours, 'time_since_event_hours');
  ensureBool(req.hiv_pre_exposure_prophylaxis_required, 'hiv_pre_exposure_prophylaxis_required');
  ensureBool(req.hbv_immune, 'hbv_immune');
  ensureBool(req.pregnancy_positive, 'pregnancy_positive');
  ensureBool(req.antibiotic_choices_review, 'antibiotic_choices_review');
  ensureNumber(req.antibiotic_adverse_reaction_history_score, 'antibiotic_adverse_reaction_history_score');

  let pep_action;
  if (req.time_since_event_hours <= 72 && req.hiv_pre_exposure_prophylaxis_required) pep_action = 'initiate_3_drug_pep_emtricitabine_tenofovir_darunavir_within_72h_and_continue_4_weeks';
  else if (req.time_since_event_hours > 72 && req.time_since_event_hours <= 168 && req.hiv_pre_exposure_prophylaxis_required) pep_action = 'consider_pep_within_one_week_only_if_high_risk_then_follow_7_to_14_days';
  else if (req.hiv_pre_exposure_prophylaxis_required) pep_action = 'window_closed_monitor_then_test_at_4_6_weeks_then_re_check_in_3m';

  let hep_action;
  if (!req.hbv_immune) hep_action = 'start_hbv_vaccination_with_or_without_hbig_if_perpetrator_high_risk';
  else hep_action = 'vaccination_not_required_reevaluate_in_post_exposure_prophylaxis_setting';

  let antibiotic_choices_review;
  if (req.antibiotic_choices_review && req.pregnancy_positive) antibiotic_choices_review = 'pregnancy_safe_ceftriaxone_im_doxy_with_or_metronidazole_avoid_fluoroquinolones';
  else if (req.antibiotic_choices_review) antibiotic_choices_review = 'ceftriaxone_im_or_azithromycin_per_latest_sti_treatment_guidelines';
  else antibiotic_choices_review = 'not_required_yet';

  if (req.antibiotic_adverse_reaction_history_score >= 5) antibiotic_choices_review += '_evaluate_penicillin_or_cephalosporin_allergy_then_test_dose_with_supervision';
  return { pep_action, hep_action, antibiotic_choices_review };
}

function funcs() { return { sa_history, sa_exam, sa_specimens, sa_safety, sa_prophylaxis }; }
module.exports = { funcs, CITATIONS, ValidationError };
