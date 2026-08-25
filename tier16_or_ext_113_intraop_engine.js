// filepath: tier16_or_ext_113_intraop_engine.js
// TIER16_OR_EXT-113: Intraoperative (anesthesia, monitoring, events, timeout)
'use strict';

const CITATIONS = ['AANA_2024','AHA_OR_2024','WHO_SSC_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function intraop_anesthesia(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.anesthesia_type, 'anesthesia_type', ['general','regional_spinal','regional_epidural','regional_nerve_block','monitored_mac','local_only','combined','sedation','other']);
  ensureEnum(req.airway, 'airway', ['ett','lma','natural','mask','tracheostomy','other']);
  ensureNumber(req.duration_minutes, 'duration_minutes');
  ensureNumber(req.blood_loss_ml, 'blood_loss_ml');
  ensureNumber(req.crystalloid_ml, 'crystalloid_ml');
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureBool(req.nerve_block_done, 'nerve_block_done');

  let status;
  if (req.temperature_c < 35.5) status = 'hypothermia_under_35_5_active_warming';
  else if (req.temperature_c > 38.5) status = 'hyperthermia_review';
  else if (req.blood_loss_ml > 500) status = 'ebl_over_500_t_and_c_review';
  else if (req.duration_minutes > 240 && req.anesthesia_type === 'general') status = 'over_4h_review_bair_hugger';
  else status = 'anesthesia_appropriate';
  return { status, type: req.anesthesia_type };
}

function intraop_monitoring(req) {
  ensureStr(req.case_id, 'case_id');
  ensureBool(req.asa_standard_monitor, 'asa_standard_monitor');
  ensureBool(req.arterial_line, 'arterial_line');
  ensureBool(req.central_line, 'central_line');
  ensureBool(req.foley, 'foley');
  ensureNumber(req.end_tidal_co2_mmhg, 'etco2_mmhg');
  ensureNumber(req.map_mmhg, 'map_mmhg');
  ensureNumber(req.temp_monitor, 'temp_monitor');
  ensureBool(req.bis_monitor_used, 'bis_monitor_used');

  let status;
  if (!req.asa_standard_monitor) status = 'asa_standard_monitor_required';
  else if (!req.temp_monitor) status = 'temp_monitor_required_aana';
  else if (req.arterial_line && req.map_mmhg < 60) status = 'arterial_line_low_map_intervention';
  else if (req.bis_monitor_used && req.end_tidal_co2_mmhg < 25) status = 'low_etco2_review_hyperventilation';
  else if (!req.foley && req.duration_minutes > 120) status = 'no_foley_over_2h_add';
  else status = 'monitoring_appropriate';
  return { status, monitored: true };
}

function intraop_timeout(req) {
  ensureStr(req.case_id, 'case_id');
  ensureBool(req.team_members_introduced, 'team_intro');
  ensureBool(req.patient_identity_verified, 'patient_id_verified');
  ensureBool(req.procedure_verified, 'procedure_verified');
  ensureBool(req.site_verified, 'site_verified');
  ensureBool(req.antibiotic_within_60min, 'antibiotic_timing');
  ensureBool(req.essential_imaging_displayed, 'imaging_displayed');
  ensureBool(req.anticoag_review_done, 'anticoag_review');
  ensureBool(req.airway_plan_reviewed, 'airway_plan');

  let status;
  if (!req.team_intro) status = 'team_introduction_required';
  else if (!req.patient_id_verified) status = 'patient_id_verification_required';
  else if (!req.procedure_verified) status = 'procedure_verification_required';
  else if (!req.site_verified) status = 'site_verification_required_jcaho';
  else if (!req.antibiotic_timing) status = 'antibiotic_within_60_min_required_ssc';
  else if (!req.essential_imaging_displayed && req.imaging_implied) status = 'imaging_displayed_required_ssc';
  else if (!req.anticoag_review) status = 'anticoag_review_required';
  else if (!req.airway_plan) status = 'airway_plan_review_required';
  else status = 'timeout_complete';
  return { status, timeout: req.case_id };
}

function intraop_events(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.event_type, 'event_type', ['none','cardiac_arrest','anaphylaxis','massive_hemorrhage','malignant_hyperthermia','laryngospasm','bronchospasm','hypotension_severe','desaturation','fire','retained_object','wrong_site_caught','other']);
  ensureBool(req.crash_cart_called, 'crash_cart_called');
  ensureBool(req.event_resolved, 'event_resolved');
  ensureNumber(req.time_to_resolution_min, 'time_to_resolve_min');

  let status;
  if (req.event_type === 'malignant_hyperthermia') status = 'mh_emergency_dantrolene_activate';
  else if (req.event_type === 'cardiac_arrest') status = 'cardiac_arrest_acls_activate';
  else if (req.event_type === 'fire') status = 'fire_protocol_activate';
  else if (req.event_type === 'massive_hemorrhage') status = 'mtp_activate_blood_bank';
  else if (req.event_type === 'anaphylaxis') status = 'anaphylaxis_epinephrine_im';
  else if (!req.event_resolved) status = 'event_in_progress';
  else if (req.event_resolved) status = 'event_resolved_documented';
  else status = 'no_events';
  return { status, event: req.event_type };
}

function intraop_sponge_count(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.sponges_initial, 'sponges_initial');
  ensureNumber(req.sponges_used, 'sponges_used');
  ensureNumber(req.sponges_remaining, 'sponges_remaining');
  ensureNumber(req.needles_initial, 'needles_initial');
  ensureNumber(req.needles_remaining, 'needles_remaining');
  ensureNumber(req.instruments_remaining, 'instruments_remaining');
  ensureBool(req.counts_correct, 'counts_correct');

  let status;
  if (!req.counts_correct) status = 'count_discrepancy_xray_immediate';
  else if (req.sponges_initial !== req.sponges_used + req.sponges_remaining) status = 'sponge_count_mismatch_review';
  else if (req.needles_initial !== req.needles_remaining) status = 'needle_count_mismatch_review';
  else status = 'counts_reconciled';
  return { status, correct: req.counts_correct };
}

function funcs() { return { intraop_anesthesia, intraop_monitoring, intraop_timeout, intraop_events, intraop_sponge_count }; }
module.exports = { funcs, CITATIONS, ValidationError };