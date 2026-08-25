// filepath: tier5_dental_ext_101_endodontic_engine.js
// TIER5_DENTAL_EXT-101: Endodontics
'use strict';

const CITATIONS = [
  'AAE_Endodontic_Diagnosis_2023',
  'ESE_Quality_Guidelines_2022',
  'AAP_Pulp_Therapy_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pulp_vitality(req) {
  ensureNumber(req.cold_response_seconds, 'cold_response_seconds');
  ensureNumber(req.heat_response_seconds, 'heat_response_seconds');
  ensureBool(req.spontaneous_pain, 'spontaneous_pain');
  ensureBool(req.lingering_cold_pain_over_30s, 'lingering_cold_pain_over_30s');
  ensureBool(req.percussion_tender, 'percussion_tender');

  let diagnosis;
  if (req.spontaneous_pain && req.lingering_cold_pain_over_30s && req.percussion_tender) diagnosis = 'irreversible_pulpitis_symptomatic_then_rct';
  else if (req.cold_response_seconds === 0 && req.heat_response_seconds === 0) diagnosis = 'necrotic_pulp_then_rct';
  else if (req.lingering_cold_pain_over_30s) diagnosis = 'reversible_then_consider_protective_restoration';
  else if (req.cold_response_seconds < 5 && req.percussion_tender === false) diagnosis = 'normal_pulp_then_routine';
  else diagnosis = 'continue_with_review';
  return { diagnosis };
}

function root_canal_treatment(req) {
  ensureStr(req.tooth_number_fdi, 'tooth_number_fdi');
  ensureBool(req.single_root, 'single_root');
  ensureBool(req.curved_root, 'curved_root');
  ensureNumber(req.working_length_mm, 'working_length_mm');
  ensureBool(req.adequate_obturation_length, 'adequate_obturation_length');
  ensureBool(req.naocl_used, 'naocl_used');

  let protocol;
  if (!req.adequate_obturation_length) protocol = 'consider_re_obturation_with_review';
  else if (req.curved_root) protocol = 'consider_niti_instruments_with_review';
  else if (req.single_root && req.naocl_used) protocol = 'continue_with_standard_protocol';
  else protocol = 'continue_with_multi_root_protocol';
  return { protocol };
}

function apicoectomy(req) {
  ensureNumber(req.lesion_size_mm, 'lesion_size_mm');
  ensureBool(req.persistent_periapical_lesion_post_rct, 'persistent_periapical_lesion_post_rct');
  ensureBool(req.over_filled_root_canal, 'over_filled_root_canal');
  ensureBool(req.anatomical_proximity_to_ian, 'anatomical_proximity_to_ian');
  ensureBool(req.sutures_planned, 'sutures_planned');

  let recommendation;
  if (req.lesion_size_mm >= 10) recommendation = 'consider_continue_with_apicoectomy';
  else if (req.persistent_periapical_lesion_post_rct) recommendation = 'continue_with_apicoectomy_review';
  else if (req.anatomical_proximity_to_ian) recommendation = 'review_with_ct_then_continue';
  else recommendation = 'continue_with_standard_follow_up';
  return { recommendation };
}

function retreatment(req) {
  ensureBool(req.previous_rct_present, 'previous_rct_present');
  ensureNumber(req.time_since_original_rct_years, 'time_since_original_rct_years');
  ensureBool(req.short_obturation_or_missed_canal_suspected, 'short_obturation_or_missed_canal_suspected');
  ensureBool(req.crown_removed_or_sectioned, 'crown_removed_or_sectioned');

  let plan;
  if (!req.previous_rct_present) plan = 'continue_with_initial_rct_then_review';
  else if (req.short_obturation_or_missed_canal_suspected) plan = 'continue_with_orthograde_retreatment';
  else if (req.time_since_original_rct_years >= 5) plan = 'consider_apical_surgery_or_retreatment';
  else if (!req.crown_removed_or_sectioned) plan = 'consider_crown_removal_then_retreatment';
  else plan = 'continue_with_retreatment';
  return { plan };
}

function perforation(req) {
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['furcation','strip','crestal','apical','root']);
  ensureBool(req.mta_used_for_repair, 'mta_used_for_repair');
  ensureBool(req.contamination_present, 'contamination_present');
  ensureNumber(req.size_mm, 'size_mm');
  ensureNumber(req.time_since_perforation_hours, 'time_since_perforation_hours');

  let recommendation;
  if (req.location === 'furcation' && req.size_mm >= 3) recommendation = 'continue_with_review_then_extract';
  else if (req.mta_used_for_repair && req.size_mm < 3) recommendation = 'continue_with_mta_repair_review';
  else if (req.contamination_present && req.time_since_perforation_hours > 24) recommendation = 'continue_with_repair_review_then_extract';
  else recommendation = 'continue_with_immediate_repair_review';
  return { recommendation };
}

function dental_trauma(req) {
  ensureStr(req.injury_type, 'injury_type');
  ensureEnum(req.injury_type, 'injury_type', ['enamel_fracture','enamel_dentin_fracture','crown_fracture_pulp_exposure','root_fracture','lateral_luxation','extrusive_luxation','intrusive_luxation','avulsion']);
  ensureNumber(req.time_since_injury_hours, 'time_since_injury_hours');
  ensureBool(req.tooth_in_mouth_or_stored, 'tooth_in_mouth_or_stored');
  ensureBool(req.root_development_complete, 'root_development_complete');
  ensureStr(req.tooth_type, 'tooth_type');
  ensureEnum(req.tooth_type, 'tooth_type', ['primary','permanent']);

  let advice;
  if (req.injury_type === 'avulsion' && req.tooth_type === 'permanent' && req.time_since_injury_hours <= 1) advice = 're-implant_then_splint_with_review';
  else if (req.injury_type === 'avulsion' && req.tooth_type === 'permanent' && req.time_since_injury_hours > 1) advice = 'continue_with_re-implantation_then_pulp_review';
  else if (req.injury_type === 'intrusive_luxation') advice = 'continue_with_surgical_or_orthodontic_review';
  else if (req.injury_type === 'avulsion' && req.tooth_type === 'primary') advice = 'continue_with_review_then_do_not_re-implant';
  else if (req.injury_type === 'crown_fracture_pulp_exposure') advice = 'continue_with_pulp_therapy_review';
  else advice = 'continue_with_review';
  return { advice };
}

function funcs() { return { pulp_vitality, root_canal_treatment, apicoectomy, retreatment, perforation, dental_trauma }; }
module.exports = { funcs, CITATIONS, ValidationError };
