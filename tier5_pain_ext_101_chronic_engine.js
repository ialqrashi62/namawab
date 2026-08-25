// filepath: tier5_pain_ext_101_chronic_engine.js
// TIER5_PAIN_EXT-101: Chronic pain: biopsychosocial, function, opioids safety, multimodal
'use strict';

const CITATIONS = [
  'CDC_Chronic_Pain_2023',
  'IASP_Pain_2020',
  'OKTA_Opioid_Crisis_2019',
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

function biopsychosocial(req) {
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureNumber(req.bpi_interference_score, 'bpi_interference_score');
  ensureNumber(req.phq9_total, 'phq9_total');
  ensureNumber(req.pcs_score, 'pcs_score'); // pain catastrophizing 0..52
  ensureNumber(req.sit_lead_work_function_pct, 'sit_lead_work_function_pct');
  if (req.pain_intensity_nrs < 0 || req.pain_intensity_nrs > 10) throw new ValidationError('nrs 0..10', 'pain_intensity_nrs');

  let diagnosis_pattern;
  if (req.duration_weeks > 12 && req.bpi_interference_score >= 5) diagnosis_pattern = 'chronic_high_impact_pain';
  else if (req.duration_weeks > 12) diagnosis_pattern = 'chronic_pain_low_impact';
  else if (req.duration_weeks > 4) diagnosis_pattern = 'subacute_pain';
  else diagnosis_pattern = 'acute_pain';

  let psych_layer;
  if (req.phq9_total >= 10) psych_layer = 'moderate_depression_cbt_and_pharma';
  else if (req.pcs_score >= 30) psych_layer = 'high_catastrophizing_cbt_pain_neuropsychology';
  else if (req.phq9_total >= 5) psych_layer = 'mild_distress_education_self_management';
  else psych_layer = 'no_psychological_intervention_needed';

  return {
    diagnosis_pattern,
    psych_layer,
    sit_lead_work_function_pct: req.sit_lead_work_function_pct,
    citation: CITATIONS[1],
  };
}

function functional_outcome(req) {
  ensureNumber(req.promis_physical_function_t, 'promis_physical_function_t');
  ensureNumber(req.pdi_score, 'pdi_score'); // pain disability index
  ensureNumber(req.oswestry_or_ndi, 'oswestry_or_ndi');
  ensureNumber(req.walking_distance_min, 'walking_distance_min');
  ensureBool(req.returned_to_work, 'returned_to_work');

  let composite;
  composite = (req.promis_physical_function_t * 0.4) + ((1 - req.pdi_score / 100) * 25) + ((1 - req.oswestry_or_ndi / 100) * 25) + (req.walking_distance_min * 0.5);

  let goal_recommendation;
  if (req.returned_to_work) goal_recommendation = 'maintain_continued_pm_rehab';
  else if (composite >= 60) goal_recommendation = 'consider_rtow_or_part_time_modified_duties_in_8_weeks';
  else if (composite >= 40) goal_recommendation = 'graded_return_with_optimized_rehab_then_review_8_weeks';
  else if (composite >= 20) goal_recommendation = 'slow_intensity_build_focus_strength_then_walking';
  else goal_recommendation = 'supportive_palliative_then_rehab';
  return { composite: Math.round(composite * 10) / 10, goal_recommendation, citation: CITATIONS[0] };
}

function pharmacologic_choice(req) {
  ensureStr(req.pain_type, 'pain_type');
  ensureEnum(req.pain_type, 'pain_type', ['nociceptive','neuropathic_radicular','mixed','central_sensitization','cancer_related','visceral']);
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureBool(req.kidney_disease, 'kidney_disease');
  ensureBool(req.substance_use_history, 'substance_use_history');
  ensureNumber(req.qtc_baseline_ms, 'qtc_baseline_ms');

  let firstline;
  if (req.pain_type === 'nociceptive') firstline = 'paracetamol_or_nsaid_skeletal_or_topical_nsaid_with_omeprazole';
  else if (req.pain_type === 'neuropathic_radicular') firstline = 'gabapentin_or_lyrica_or_tricyclic_for_noradrenergic_supplementation';
  else if (req.pain_type === 'central_sensitization') firstline = 'low_dose_tricyclic_ssnri_duloxetine';
  else if (req.pain_type === 'cancer_related') firstline = 'step_3_opioids_per_who_ladder_with_palliative_consult';
  else if (req.pain_type === 'visceral') firstline = 'oxycodone_or_hydromorphone_for_severe_oow_with_docusate_senna';
  else firstline = 'combination_tramadol_acetaminophen_for_moderate_pain_step_2';

  if (req.pain_intensity_nrs >= 7) firstline += '_plus_short_course_strong_opioid';
  if (req.kidney_disease) firstline = 'preferred_per_nephrology_review_avoid_nsaid_or_dose_adjust_gabapentin';
  if (req.substance_use_history) firstline = 'non_opioid_first_with_pain_psychology_forensic_referral';
  if (req.qtc_baseline_ms > 470) firstline = 'avoid_tricyclic_substitute_ssnri';

  return { pain_type: req.pain_type, firstline, citation: CITATIONS[0] };
}

function multimodal_rehab(req) {
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureNumber(req.diagnosis_age_months, 'diagnosis_age_months');
  ensureBool(req.injection_intervention_done, 'injection_intervention_done');
  ensureNumber(req.psychotherapy_visits_completed, 'psychotherapy_visits_completed');
  ensureBool(req.works_with_specialty_team, 'works_with_specialty_team');

  let plan;
  if (req.injection_intervention_done) plan = 'continue_pt_with_injections_at_intervals_then_review';
  else if (req.pain_intensity_nrs <= 4 && req.psychotherapy_visits_completed >= 4 && req.works_with_specialty_team) plan = 'cbt_then_graceful_promotion_of_functional_goals_maintaining_medical_management';
  else if (req.pain_intensity_nrs >= 7) plan = 'consider_injection_or_implantable_neuromodulation_or_directed_analgesic_pump';
  else plan = 'general_pain_clinic_multimodal_then_psychological_cbt';

  if (req.diagnosis_age_months > 6) plan += '_chronic_recurrent_consider_pain_rehabilitation_program_3_to_6_weeks';

  return {
    plan,
    visits_completed: req.psychotherapy_visits_completed,
    multi_team: req.works_with_specialty_team,
    citation: CITATIONS[2],
  };
}

function step_care(req) {
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureNumber(req.weeks_under_treatment, 'weeks_under_treatment');
  ensureStr(req.medication_strength, 'medication_strength');
  ensureEnum(req.medication_strength, 'medication_strength', ['step_1_paracetamol_or_nsaid','step_2_tramadol_or_combination','step_3_strong_opioid']);
  ensureBool(req.side_effect_intolerable, 'side_effect_intolerable');
  ensureBool(req.goals_met_pct, 'goals_met_pct');

  let signal;
  if (req.medication_strength === 'step_1_paracetamol_or_nsaid' && req.pain_intensity_nrs >= 4 && req.weeks_under_treatment >= 4) signal = 'step_2_candidate';
  else if (req.medication_strength === 'step_2_tramadol_or_combination' && req.pain_intensity_nrs >= 4 && req.weeks_under_treatment >= 6) signal = 'step_3_candidate';
  else if (req.side_effect_intolerable) signal = 'add_adjuvant_or_specialty_pain_consult';
  else if (req.pain_intensity_nrs <= 3) signal = 'continue_monitoring_consider_step_down';
  else signal = 'review_initially_then_continue_then_add_if_4_weeks';

  return { signal, weeks_under_treatment: req.weeks_under_treatment, medication_strength: req.medication_strength };
}

function funcs() {
  return { biopsychosocial, functional_outcome, pharmacologic_choice, multimodal_rehab, step_care };
}

module.exports = { funcs, CITATIONS, ValidationError };
