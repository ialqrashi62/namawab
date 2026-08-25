// filepath: tier16_or_ext_114_postop_engine.js
// TIER16_OR_EXT-114: Postoperative/PACU (recovery, pain, PONV, complications)
'use strict';

const CITATIONS = ['ASA_PACU_2024','PROSPECT_2023','APSF_2023'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pacu_aldehyde(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.aldrete_score, 'aldrete_score');
  ensureEnum(req.aldrete_status, 'aldrete_status', ['incomplete','at_8_to_9','at_10','passing_for_discharge','not_passed','other']);
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.spo2_pct, 'spo2_pct');
  ensureNumber(req.minutes_in_pacu, 'minutes_in_pacu');
  ensureEnum(req.consciousness, 'consciousness', ['awake_oriented','arousable','unresponsive','confused','other']);

  let status;
  if (req.aldrete_status === 'not_passed') status = 'not_passed_extended_pacu';
  else if (req.spo2_pct < 92) status = 'hypoxia_supplemental_o2';
  else if (req.temperature_c < 36) status = 'hypothermia_active_warming';
  else if (req.consciousness === 'unresponsive') status = 'unresponsive_review';
  else if (req.minutes_in_pacu > 120) status = 'over_2h_in_pacu_review_discharge';
  else status = 'pacu_stable';
  return { status, score: req.aldrete_score };
}

function pacu_pain(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.nrs_score, 'nrs_score');
  ensureNumber(req.faces_scale, 'faces_scale');
  ensureEnum(req.pain_severity, 'pain_severity', ['none','mild','moderate','severe','worst','unable_to_assess','other']);
  ensureEnum(req.pain_type, 'pain_type', ['somatic','visceral','neuropathic','mixed','not_applicable','other']);
  ensureBool(req.neuroaxial_anesthesia, 'neuroaxial');
  ensureNumber(req.last_analgesic_min, 'last_analgesic_min');

  let status;
  if (req.pain_severity === 'severe' && req.last_analgesic_min > 30) status = 'severe_pain_no_analgesia_30min';
  else if (req.pain_severity === 'severe') status = 'severe_pain_multimodal_review';
  else if (req.pain_severity === 'moderate') status = 'moderate_pain_optimize';
  else status = 'pain_controlled';
  return { status, severity: req.pain_severity };
}

function pacu_ponv(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.apfel_score, 'apfel_score');
  ensureBool(req.antiemetic_given, 'antiemetic_given');
  ensureEnum(req.antiemetic_count, 'antiemetic_count', ['none','one','two','three_plus','not_required','other']);
  ensureEnum(req.ponv_severity, 'ponv_severity', ['none','mild','moderate','severe','retching','vomiting','other']);
  ensureNumber(req.minutes_in_pacu, 'minutes_in_pacu');

  let status;
  if (req.ponv_severity === 'severe' && req.antiemetic_count === 'one') status = 'severe_ponv_add_second_antiemetic';
  else if (req.ponv_severity === 'vomiting' && !req.antiemetic_given) status = 'vomiting_no_treatment_give_now';
  else if (req.apfel_score >= 3 && req.antiemetic_count === 'none') status = 'high_apfel_prophylaxis_given';
  else status = 'ponv_managed';
  return { status, ponv: req.ponv_severity };
}

function pacu_discharge(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.aldrete_score, 'aldrete_score');
  ensureNumber(req.pacu_minutes, 'pacu_minutes');
  ensureEnum(req.disposition, 'disposition', ['home','home_with_care','floor','telemetry','stepdown','icu','obs_unit','transfer_to_other_facility','other']);
  ensureBool(req.responsible_adult, 'responsible_adult');
  ensureBool(req.pain_controlled, 'pain_controlled');
  ensureBool(req.ponv_controlled, 'ponv_controlled');

  let status;
  if (req.disposition === 'home' && !req.responsible_adult) status = 'home_discharge_requires_responsible_adult';
  else if (!req.pain_controlled) status = 'pain_not_controlled_delay_discharge';
  else if (!req.ponv_controlled) status = 'ponv_not_controlled_delay_discharge';
  else if (req.aldrete_score < 9) status = 'aldrete_below_9_extended_pacu';
  else if (req.disposition === 'home') status = 'home_discharge_appropriate';
  else status = 'discharge_to_unit_appropriate';
  return { status, disposition: req.disposition };
}

function pacu_complications(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.complication, 'complication', ['none','bleeding','hematoma','respiratory_depression','airway_obstruction','hypotension','arrhythmia','surgical_site_issue','delirium_emergence','hypothermia','malignant_hyperthermia_residual','other']);
  ensureNumber(req.complication_severity, 'complication_severity');
  ensureBool(req.return_to_or, 'return_to_or');
  ensureBool(req.transfer_to_higher_level, 'transfer_higher_level');

  let status;
  if (req.complication === 'malignant_hyperthermia_residual') status = 'residual_mh_continue_dantrolene';
  else if (req.return_to_or) status = 'return_to_or_documented';
  else if (req.transfer_higher_level) status = 'transfer_to_icu_stepdown';
  else if (req.complication_severity >= 3) status = 'severe_complication_review';
  else if (req.complication === 'none') status = 'no_complications';
  else status = 'complication_managed';
  return { status, comp: req.complication };
}

function funcs() { return { pacu_aldehyde, pacu_pain, pacu_ponv, pacu_discharge, pacu_complications }; }
module.exports = { funcs, CITATIONS, ValidationError };