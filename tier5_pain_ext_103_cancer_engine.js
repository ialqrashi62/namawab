// filepath: tier5_pain_ext_103_cancer_engine.js
// TIER5_PAIN_EXT-103: Cancer pain (WHO ladder, opioid rotation, breakthrough, side effects)
'use strict';

const CITATIONS = [
  'WHO_Analgesic_Ladder_2019',
  'ESMO_Cancer_Pain_2022',
  'NCCN_Cancer_Pain_2023',
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

function who_ladder(req) {
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureStr(req.pain_mechanism, 'pain_mechanism');
  ensureEnum(req.pain_mechanism, 'pain_mechanism', ['nociceptive','neuropathic','mixed','visceral','bone','incident_or_procedural','psychogenic_or_existential']);
  ensureNumber(req.opioid_tolerance, 'opioid_tolerance'); // current daily MED
  ensureBool(req.previous_opioid_use, 'previous_opioid_use');

  let ladder;
  if (req.pain_intensity_nrs <= 3 && !req.previous_opioid_use) ladder = 'step_1_nsaid_paracetamol_with_or_without_adjuvant';
  else if (req.pain_intensity_nrs <= 5) ladder = 'step_2_tramadol_with_adjuvant_or_low_dose_strong_opioid';
  else if (req.pain_intensity_nrs <= 6) ladder = 'step_3_strong_opioid_with_paracetamol_and_consider_adjuvant';
  else ladder = 'step_4_high_dose_strong_opioid_with_peripheral_or_neuroaxial_block_consult';

  if (req.opioid_tolerance >= 60) ladder += '_review_equianalgesic_chart_then_titrate';

  return {
    pain_intensity_nrs: req.pain_intensity_nrs,
    mechanism: req.pain_mechanism,
    ladder,
    citation: CITATIONS[0],
  };
}

function opioid_rotation(req) {
  ensureStr(req.from_drug, 'from_drug');
  ensureEnum(req.from_drug, 'from_drug', ['morphine','oxycodone','hydromorphone','fentanyl','tramadol','codeine','methadone']);
  ensureStr(req.to_drug, 'to_drug');
  ensureEnum(req.to_drug, 'to_drug', ['morphine','oxycodone','hydromorphone','fentanyl','tramadol','codeine','methadone']);
  ensureNumber(req.total_daily_dose_from, 'total_daily_dose_from');
  ensureNumber(req.from_factor, 'from_factor');
  ensureNumber(req.to_factor, 'to_factor');

  if (req.from_factor === 0 || req.to_factor === 0) throw new ValidationError('factor must be >0', 'from_factor');

  const equivalent_new_dose = (req.total_daily_dose_from * req.from_factor) / req.to_factor;
  const reduced_for_partial_tolerance = Math.round(equivalent_new_dose * 0.75 * 100) / 100;
  return {
    equivalent_new_dose,
    reduced_safe_dose: reduced_for_partial_tolerance,
    breakthrough_dose: reduced_for_partial_tolerance / 6,
    from_drug: req.from_drug,
    to_drug: req.to_drug,
    citation: CITATIONS[1],
  };
}

function breakthrough(req) {
  ensureNumber(req.total_daily_dose, 'total_daily_dose');
  ensureNumber(req.breakthrough_episodes_24h, 'breakthrough_episodes_24h');
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureStr(req.radiation_site, 'radiation_site');
  ensureEnum(req.radiation_site, 'radiation_site', ['none','emergent_recurrence_or_progression','bone_met','spinal_cord_compression','brain_met','incidental_relief_possible']);

  let approach;
  if (req.breakthrough_episodes_24h <= 1) approach = 'consider_increasing_baseline_5_to_10_percent';
  else if (req.breakthrough_episodes_24h <= 3 && req.radiation_site === 'incidental_relief_possible') approach = 'attempt_event_prevention_then_increase_baseline_dose';
  else if (req.breakthrough_episodes_24h >= 4) approach = 'increase_baseline_or_add_co_analgesic_or_consult_palliative';
  else approach = 'continue_baseline_and_breakthrough_dose_continue_daily_review';

  if (req.radiation_site === 'spinal_cord_compression') approach += '_refer_for_stereotactic_emergency';
  else if (req.radiation_site === 'emergent_recurrence_or_progression') approach += '_consult_oncology_palliative_urgent';

  return { breakthrough_episodes_24h: req.breakthrough_episodes_24h, approach, citation: CITATIONS[2] };
}

function side_effect_manage(req) {
  ensureStr(req.side_effect, 'side_effect');
  ensureEnum(req.side_effect, 'side_effect', ['nausea_vomiting','constipation','sedation','respiratory_depression','itching','neurotoxicity','hyperalgesia_delirium_seizure','renal_failure']);
  ensureBool(req.patient_history_renal_impairment, 'patient_history_renal_impairment');
  ensureNumber(req.medication, 'medication'); // 0 none, 1 simple, 2 complex

  let management;
  if (req.side_effect === 'nausea_vomiting') management = 'metoclopramide_q8_or_dexamethasone_then_ondansetron';
  else if (req.side_effect === 'constipation') management = 'senna_then_bisacodyl_then_polyethylene_glycol_or_methylnaltrexone_for_refractory';
  else if (req.side_effect === 'sedation') management = 'small_reduction_opioid_with_adjuvant_for_recalcitrant';
  else if (req.side_effect === 'respiratory_depression') management = 'stop_opioid_bag_breathing_then_naloxone_then_manage';
  else if (req.side_effect === 'itching') management = 'diphenhydramine_or_hydroxyzine_then_naloxegol';
  else if (req.side_effect === 'neurotoxicity') management = 'consider_rotation_to_fentanyl_or_methadone_or_hydromorphone_then_assess';
  else if (req.side_effect === 'hyperalgesia_delirium_seizure') management = 'rotation_to_methadone_or_buprenorphine_higher_reduction_then_reassess';
  else if (req.side_effect === 'renal_failure') management = 'rotation_to_fentanyl_or_alternative_or_palliative_dialysis_consult';

  if (req.patient_history_renal_impairment) management += '_review_dose_for_metabolite_accumulation';

  return { side_effect: req.side_effect, management, citation: CITATIONS[1] };
}

function interventional(req) {
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureStr(req.pain_pattern, 'pain_pattern');
  ensureEnum(req.pain_pattern, 'pain_pattern', ['localized_unilateral_one_dermatome','localized_interscapular_or_thoracic','diffuse_multifocal_bone','rectal_or_perineal_complex_pain_neuropathic','pancreatic_cancer_pain','advanced_head_neck_cancer']);
  ensureNumber(req.expected_survival, 'expected_survival');
  ensureBool(req.maximum_doses_of_opioids_used, 'maximum_doses_of_opioids_used');

  let approach;
  if (req.pain_pattern === 'localized_unilateral_one_dermatome' && req.expected_survival >= 3) approach = 'consider_pulsed_radio_frequency_or_neurolysis_with_interventional_specialist';
  else if (req.pain_pattern === 'localized_interscapular_or_thoracic') approach = 'intercostal_block_or_intrathecal_for_persistent';
  else if (req.pain_pattern === 'diffuse_multifocal_bone') approach = 'strontium_or_samarium_with_radiation_oncology_input';
  else if (req.pain_pattern === 'pancreatic_cancer_pain') approach = 'celiac_plexus_neurolysis_with_interventional_specialist_consult';
  else if (req.pain_pattern === 'advanced_head_neck_cancer') approach = 'spinal_peripheral_neurolysis_or_intrathecal_implant_consult_interventional_specialist';

  if (req.maximum_doses_of_opioids_used && req.expected_survival < 3) approach += '_consider_palliative_home_implant_after_patient_family_counseling';

  return { pain_intensity_nrs: req.pain_intensity_nrs, approach, expected_survival: req.expected_survival };
}

function funcs() {
  return { who_ladder, opioid_rotation, breakthrough, side_effect_manage, interventional };
}

module.exports = { funcs, CITATIONS, ValidationError };
