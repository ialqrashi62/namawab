// filepath: tier5_pain_ext_104_headache_engine.js
// TIER5_PAIN_EXT-104: Headache disorders (migraine, tension, cluster, red flags, prevention)
'use strict';

const CITATIONS = [
  'AHS_Migraine_2021',
  'ICHD3_Headache_2018',
  'AAN_Tension_Headache',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function classify(req) {
  ensureNumber(req.attacks_last_3m, 'attacks_last_3m');
  ensureNumber(req.duration_per_attack_hours, 'duration_per_attack_hours');
  ensureBool(req.unilateral, 'unilateral');
  ensureBool(req.pulsatile_quality, 'pulsatile_quality');
  ensureBool(req.nausea_vomiting, 'nausea_vomiting');
  ensureBool(req.photo_or_phonophobia, 'photo_or_phonophobia');
  ensureBool(req.autonomic_symptoms_present, 'autonomic_symptoms_present');
  ensureNumber(req.peak_severity_nrs, 'peak_severity_nrs');

  const migraine_features = [req.unilateral, req.pulsatile_quality, req.nausea_vomiting, req.photo_or_phonophobia].filter(Boolean).length;
  const episodic_or_chronic = req.attacks_last_3m >= 15 ? 'chronic' : 'episodic';

  let classification;
  if (migraine_features >= 2 && req.duration_per_attack_hours >= 4) classification = 'migraine_' + episodic_or_chronic;
  else if (req.autonomic_symptoms_present && req.duration_per_attack_hours <= 3) classification = 'cluster_headache';
  else if (migraine_features <= 1) classification = 'tension_type_headache';
  else classification = 'undifferentiated_headache';

  return { classification, episodic_or_chronic, migraine_features, citation: CITATIONS[1] };
}

function red_flags(req) {
  ensureBool(req.sudden_thunderclap, 'sudden_thunderclap');
  ensureBool(req.first_worst_headache, 'first_worst_headache');
  ensureBool(req.focal_neuro_deficit, 'focal_neuro_deficit');
  ensureBool(req.fever_neck_stiffness, 'fever_neck_stiffness');
  ensureBool(req.papilledema, 'papilledema');
  ensureBool(req.new_onset_after_age_50, 'new_onset_after_age_50');
  ensureBool(req.neck_pain_positional, 'neck_pain_positional');
  ensureBool(req.confusion, 'confusion');

  const positives = [req.sudden_thunderclap, req.first_worst_headache, req.focal_neuro_deficit, req.fever_neck_stiffness, req.papilledema, req.new_onset_after_age_50, req.neck_pain_positional, req.confusion].filter(Boolean).length;

  let urgency;
  if (req.sudden_thunderclap || req.focal_neuro_deficit || req.fever_neck_stiffness || req.confusion) urgency = 'red_emergent_imaging_within_30_minutes_or_lp_if_no_finding';
  else if (req.papilledema) urgency = 'urgent_imaging_within_24h';
  else if (req.first_worst_headache || req.neck_pain_positional || req.new_onset_after_age_50) urgency = 'urgent_imaging_within_48h';
  else if (positives >= 2) urgency = 'review_imaging_72h';
  else if (positives === 1) urgency = 'discuss_imaging_within_2_weeks';
  else urgency = 'no_emergent_imaging_required';
  return { red_flag_count: positives, urgency };
}

function abortive(req) {
  ensureNumber(req.peak_pain_nrs, 'peak_pain_nrs');
  ensureNumber(req.attacks_per_month, 'attacks_per_month');
  ensureBool(req.thunderclap_feature, 'thunderclap_feature');
  ensureStr(req.medication_history, 'medication_history');
  ensureEnum(req.medication_history, 'medication_history', ['triptan_responsive','triptan_failure','not_yet_tried','overuse_risk']);

  let approach;
  if (req.attacks_per_month > 10 && req.medication_history === 'overuse_risk') approach = 'treatment_overuse_review_withdrawal_or_supervised_plan';
  else if (req.medication_history === 'triptan_failure' && req.peak_pain_nrs >= 7) approach = 'try_alternate_route_dh_opioid_consider_2nd_line_anti_emetic_then_refer';
  else if (req.medication_history === 'triptan_responsive') approach = 'sumatriptan_or_rizatriptan_early_within_60_min';
  else if (req.thunderclap_feature) approach = 'this_is_not_migraine_imaging_then_assess';
  else approach = 'nsaid_or_aspirin_then_triptan_with_antiemetic_consider_dexamethasone_for_recurrence_prevention';

  return { attack_abortive_plan: approach, peak_pain_nrs: req.peak_pain_nrs };
}

function preventive(req) {
  ensureNumber(req.headaches_per_month, 'headaches_per_month');
  ensureNumber(req.days_with_high_disability_per_month, 'days_with_high_disability_per_month');
  ensureBool(req.responded_to_topiramate_try, 'responded_to_topiramate_try');
  ensureBool(req.responded_to_propranolol, 'responded_to_propranolol');
  ensureBool(req.responded_to_tricyclic, 'responded_to_tricyclic');
  ensureStr(req.drug_class, 'drug_class');
  ensureEnum(req.drug_class, 'drug_class', ['topiramate','propranolol','amitriptyline','ssnri_duloxetine','cgrp_antagonist','cgrp_receptor_modulator','onabotulinum']);

  if (req.headaches_per_month < 4) return { plan: 'no_preventive_recommended_abortive_maintenance', citation: CITATIONS[0] };

  return {
    plan: 'consider_or_optimize_drug_class_specialist_supervised_plan',
    candidate_drug_class: req.drug_class,
    additional_candidates: req.responded_to_topiramate_try && req.responded_to_propranolol ? 'CGRP_antagonist_or_onabotulinum_consult_neurology' : 'review_responded_to_other_classes',
    citation: CITATIONS[0],
  };
}

function pediatric(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.school_days_lost_past_3m, 'school_days_lost_past_3m');
  ensureStr(req.first_choice, 'first_choice');
  ensureEnum(req.first_choice, 'first_choice', ['ibuprofen','naproxen','sumatriptan','rizatriptan','propranolol','topiramate']);
  ensureBool(req.family_history_migraine, 'family_history_migraine');

  let verdict;
  if (req.age_years < 6) verdict = 'consult_pediatric_neurology_limited_data_for_first_line_meds';
  else if (req.age_years >= 6 && ['ibuprofen','naproxen'].includes(req.first_choice)) verdict = 'acceptable_for_pediatrics_use_per_weight';
  else if (req.age_years >= 12 && req.first_choice === 'sumatriptan') verdict = 'consider_triptan_use_age_12_plus';
  else if (req.age_years >= 12 && req.first_choice === 'rizatriptan') verdict = 'consider_rizatriptan_use_age_6_plus';
  else if (req.first_choice === 'topiramate' && req.age_years >= 12) verdict = 'monitor_cognitive_side_effects_for_topiramate_in_young';
  else verdict = 'refer_to_pediatric_neurology_or_specialty_clinic';

  return {
    age_years: req.age_years,
    school_days_lost: req.school_days_lost_past_3m,
    recommendation: verdict,
    family_history: req.family_history_migraine,
  };
}

function funcs() {
  return { classify, red_flags, abortive, preventive, pediatric };
}

module.exports = { funcs, CITATIONS, ValidationError };
