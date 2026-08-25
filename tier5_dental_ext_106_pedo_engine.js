// filepath: tier5_dental_ext_106_pedo_engine.js
// TIER5_DENTAL_EXT-106: Pediatric dentistry
'use strict';

const CITATIONS = [
  'AAPD_Pediatric_Guidelines_2023',
  'AAP_Fluoride_Guidelines_2014',
  'ADA_Sealant_Guidelines_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function early_childhood_caries(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.dmft_score, 'dmft_score');
  ensureStr(req.feeding_pattern, 'feeding_pattern');
  ensureEnum(req.feeding_pattern, 'feeding_pattern', ['breast_only','bottle_milk','bottle_juice','breast_plus_bottle','mixed_diet']);
  ensureBool(req.fluoride_exposure_documented, 'fluoride_exposure_documented');
  ensureBool(req.parent_supervised_brushing, 'parent_supervised_brushing');

  let recommendation;
  if (req.dmft_score >= 4) recommendation = 'continue_with_full_rehab_under_ga_review';
  else if (req.dmft_score >= 1) recommendation = 'continue_with_restorative_review';
  else if (req.feeding_pattern === 'bottle_juice') recommendation = 'continue_with_counseling_review';
  else if (!req.parent_supervised_brushing) recommendation = 'continue_with_OH_counseling';
  else recommendation = 'continue_with_routine_review';
  return { recommendation };
}

function fluoride(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.water_fluoride_ppm, 'water_fluoride_ppm');
  ensureEnum(req.water_fluoride_ppm, 'water_fluoride_ppm', ['less_than_0_3','0_3_to_0_7','greater_than_0_7']);
  ensureBool(req.topical_fluoride_acceptable, 'topical_fluoride_acceptable');
  ensureBool(req.supplemental_fluoride_acceptable, 'supplemental_fluoride_acceptable');

  let advice;
  if (req.age < 3) advice = 'consider_smear_fluoride_toothpaste_only';
  else if (req.age < 6 && req.topical_fluoride_acceptable) advice = 'continue_with_pea_sized_fluoride';
  else if (req.water_fluoride_ppm === 'less_than_0_3' && req.supplemental_fluoride_acceptable) advice = 'continue_with_supplemental_fluoride_review';
  else advice = 'continue_with_topical_fluoride_review';
  return { advice };
}

function sealant(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.deep_pits_fissures, 'deep_pits_fissures');
  ensureBool(req.prior_decay_in_tooth, 'prior_decay_in_tooth');
  ensureStr(req.tooth_type, 'tooth_type');
  ensureEnum(req.tooth_type, 'tooth_type', ['permanent_molar','primary_molar','premolar','permanent_incisor']);
  ensureBool(req.saliva_controlled_with_isolation, 'saliva_controlled_with_isolation');

  let decision;
  if (req.prior_decay_in_tooth) decision = 'continue_with_rather_restore_than_sealant';
  else if (req.deep_pits_fissures && req.tooth_type === 'permanent_molar') decision = 'continue_with_sealant_review';
  else if (req.saliva_controlled_with_isolation === false) decision = 'consider_resin_infiltration_review';
  else decision = 'continue_with_review';
  return { decision };
}

function pulp_therapy(req) {
  ensureStr(req.tooth_type, 'tooth_type');
  ensureEnum(req.tooth_type, 'tooth_type', ['primary_molar','primary_incisor','permanent_young_with_open_apex']);
  ensureBool(req.pulp_capping_with_cdt, 'pulp_capping_with_cdt');
  ensureBool(req.pulpotomy_planned, 'pulpotomy_planned');
  ensureBool(req.pulpectomy_planned, 'pulpectomy_planned');
  ensureNumber(req.root_resorption_pct, 'root_resorption_pct');

  let plan;
  if (req.tooth_type === 'permanent_young_with_open_apex' && req.pulp_capping_with_cdt) plan = 'continue_with_apexogenesis_review';
  else if (req.pulpotomy_planned && req.tooth_type === 'primary_molar') plan = 'continue_with_pulpotomy_review';
  else if (req.pulpectomy_planned && req.tooth_type === 'primary_incisor') plan = 'continue_with_pulpectomy_review';
  else if (req.root_resorption_pct >= 50) plan = 'consider_extraction_review';
  else plan = 'continue_with_review';
  return { plan };
}

function space_maintainer(req) {
  ensureBool(req.primary_tooth_lost_prematurely, 'primary_tooth_lost_prematurely');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['upper_anterior','upper_posterior','lower_anterior','lower_posterior']);
  ensureNumber(req.age, 'age');
  ensureBool(req.successor_present_on_xray, 'successor_present_on_xray');

  let decision;
  if (!req.primary_tooth_lost_prematurely) decision = 'no_space_maintainer_required';
  else if (!req.successor_present_on_xray) decision = 'continue_with_xray_then_review';
  else if (req.location === 'lower_posterior') decision = 'continue_with_lingual_arch_review';
  else if (req.location === 'upper_posterior') decision = 'continue_with_nance_or_distal_shoe_review';
  else decision = 'continue_with_removable_review';
  return { decision };
}

function behavior(req) {
  ensureStr(req.frankl_scale, 'frankl_scale');
  ensureEnum(req.frankl_scale, 'frankl_scale', ['definitely_negative','negative','positive','definitely_positive']);
  ensureNumber(req.age, 'age');
  ensureBool(req.parent_present_in_op, 'parent_present_in_op');
  ensureBool(req.tell_show_done, 'tell_show_done');
  ensureBool(req.ga_planned, 'ga_planned');

  let strategy;
  if (req.frankl_scale === 'definitely_negative' && req.age < 6) strategy = 'consider_protective_stabilization_review';
  else if (req.frankl_scale === 'negative' && req.tell_show_done === false) strategy = 'continue_with_tell_show_review';
  else if (req.parent_present_in_op) strategy = 'continue_with_parent_presence_review';
  else if (req.ga_planned) strategy = 'continue_with_ga_review';
  else strategy = 'continue_with_review';
  return { strategy };
}

function funcs() { return { early_childhood_caries, fluoride, sealant, pulp_therapy, space_maintainer, behavior }; }
module.exports = { funcs, CITATIONS, ValidationError };
