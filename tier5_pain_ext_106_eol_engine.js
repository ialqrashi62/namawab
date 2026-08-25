// filepath: tier5_pain_ext_106_eol_engine.js
// TIER5_PAIN_EXT-106: EOL symptom management (nausea, bowel, mouth, resp, anxiety)
'use strict';

const CITATIONS = [
  'NCCN_Palliative_Symptom_2023',
  'ESMO_Palliative_Symptoms_2015',
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

function nausea(req) {
  ensureStr(req.cause, 'cause');
  ensureEnum(req.cause, 'cause', ['chemotherapy','opioid','bowel_obstruction','cranial_tumor_or_leptomeningeal','delayed_gastric_emptying','unidentified_or_psychogenic']);
  ensureNumber(req.frequency_per_day, 'frequency_per_day');
  ensureNumber(req.dehydration, 'dehydration'); // 0..2
  ensureBool(req.no_oral_intake, 'no_oral_intake');

  let treatment;
  if (req.cause === 'chemotherapy') treatment = '5HT3_antagonist_then_metoclopramide_and_dexamethasone';
  else if (req.cause === 'opioid') treatment = 'metoclopramide_q8_then_Haldol_then_olanzapine_low_dose';
  else if (req.cause === 'bowel_obstruction') treatment = 'olanzapine_alone_or_dexamethasone_with_subcutaneous_route_and_nasogastric_decompression_for_palliative_relief';
  else if (req.cause === 'cranial_tumor_or_leptomeningeal') treatment = 'dexamethasone_then_5HT3_antagonist';
  else if (req.cause === 'delayed_gastric_emptying') treatment = 'metoclopramide_q6_strictly_minus_8_or_alternative_motility_agent';
  else if (req.cause === 'unidentified_or_psychogenic') treatment = 'olanzapine_or_haldol_then_cbt_for_psychological';

  if (req.dehydration >= 2 || req.no_oral_intake) treatment += '_switch_to_subcutaneous_route';
  return { cause: req.cause, treatment, citation: CITATIONS[0] };
}

function bowel_obstruction(req) {
  ensureNumber(req.days_since_flatus, 'days_since_flatus');
  ensureNumber(req.days_since_bowel, 'days_since_bowel');
  ensureBool(req.gross_ascites_or_mass, 'gross_ascites_or_mass');
  ensureBool(req.patient_settled_for_palliative, 'patient_settled_for_palliative');
  ensureBool(req.already_decompressed_with_ngt, 'already_decompressed_with_ngt');

  let approach;
  if (req.patient_settled_for_palliative && req.days_since_flatus >= 2) approach = 'medical_management_without_ngt_then_subcutaneous_route_metoclopramide_salicylate';
  else if (req.already_decompressed_with_ngt) approach = 'continue_ngt_continue_subcutaneous_route_then_reassess_in_24h_or_surgical_consultation';
  else if (req.gross_ascites_or_mass) approach = 'initial_ngt_decompression_then_palliative_consult_for_medical_or_surgical_opt';
  else approach = 'short_term_ngt_then_reassess_with_imaging_and_surgical_referral';

  return {
    flatus_days: req.days_since_flatus,
    bowel_days: req.days_since_bowel,
    approach,
    citation: CITATIONS[1],
  };
}

function oral_care(req) {
  ensureBool(req.xerostomia, 'xerostomia');
  ensureBool(req.stomatitis, 'stomatitis');
  ensureBool(req.candida, 'candida');
  ensureBool(req.dysphagia_with_texture_puree_required, 'dysphagia_with_texture_puree_required');
  ensureNumber(req.performance_status_pps, 'performance_status_pps');

  let plan;
  if (req.stomatitis && req.candida) plan = 'fluconazole_or_nystatin_plus_chlorhexidine_swab_then_re_evaluate_in_3_days';
  else if (req.xerostomia) plan = 'pilocarpine_or_artificial_saliva_regular_moist_swabs_with_dry_mouth_diet';
  else if (req.dysphagia_with_texture_puree_required) plan = 'speech_therapy_assessment_and_pureed_diet_with_thickened_liquids_per_clinical_concern';
  else if (req.stomatitis) plan = 'warm_saline_or_glucose_saline_rinse_then_topical_lidocaine_with_chlorhexidine_swab';
  else plan = 'regular_saliva_swab_with_sugar_free_hydration_routine_for_dysphagia';

  if (req.performance_status_pps <= 30) plan += '_meticulous_oral_comfort_education_to_caregiver';

  return {
    plan,
    xerostomia_present: req.xerostomia,
    stomatitis_present: req.stomatitis,
  };
}

function respiratory_congestion(req) {
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureBool(req.noisy_upper_airway_mucus, 'noisy_upper_airway_mucus');
  ensureBool(req.comfort_position_right, 'comfort_position_right');
  ensureBool(req.infection_or_pulmonary_pathology, 'infection_or_pulmonary_pathology');

  let action;
  if (req.noisy_upper_airway_mucus && !req.infection_or_pulmonary_pathology) action = 'consider_glycopyrrolate_or_scopolamine_for_reduction';
  else if (req.noisy_upper_airway_mucus) action = 'palliative_aspiration_or_glycopyrrolate_with_antibiotics_for_comfort';
  else if (req.infection_or_pulmonary_pathology) action = 'continue_treatment_then_reassess';
  else action = 'supportive_comfort_only';

  if (req.comfort_position_right) action += '_with_comfortable_positioning';

  return { respiratory_rate: req.respiratory_rate, action };
}

function antianxiety(req) {
  ensureNumber(req.coping_pct, 'coping_pct');
  ensureNumber(req.existential_distress_score, 'existential_distress_score');
  ensureBool(req.active_distress_visible_to_family, 'active_distress_visible_to_family');
  ensureBool(req.family_support_present, 'family_support_present');
  ensureBool(req.spiritual_care_referral_made, 'spiritual_care_referral_made');

  let approach;
  if (req.existential_distress_score >= 8 && req.active_distress_visible_to_family) approach = 'urgent_palliative_palliative_care_daily_with_integrated_chaplaincy';
  else if (req.existential_distress_score >= 5) approach = 'supportive_communication_then_consult_palliative_and_chaplaincy';
  else if (req.existential_distress_score >= 2) approach = 'review_and_help_address_coping_then_palliative_visit';
  else approach = 'continue_support_and_encourage_family_engagement';

  if (req.spiritual_care_referral_made) approach += '_continue_spiritual_care_path';
  if (!req.family_support_present) approach += '_review_family_resources_then_consider_home_care';
  return { coping_pct: req.coping_pct, existential_distress_score: req.existential_distress_score, approach };
}

function funcs() {
  return { nausea, bowel_obstruction, oral_care, respiratory_congestion, antianxiety };
}

module.exports = { funcs, CITATIONS, ValidationError };
