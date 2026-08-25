// filepath: tier6_vc_ext_102_visit_engine.js
// TIER6_VC_EXT-102: Virtual care visit management (scheduling, room, recording, e-prescribe, follow-up)
'use strict';

const CITATIONS = [
  'AHA_TELEHEALTH_2021',
  'ATA_RECORDING_2022',
  'NCPDP_EPRESCRIBE_2020',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function visit_schedule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.visit_type, 'visit_type', ['initial','follow_up','urgent','chronic','behavioral','specialty','post_discharge']);
  ensureEnum(req.modality, 'modality', ['video','audio_only','asynchronous','store_and_forward']);
  ensureNumber(req.duration_min, 'duration_min');
  ensureBool(req.timezone_aware, 'timezone_aware');

  let scheduling;
  if (req.modality === 'store_and_forward' && req.visit_type === 'specialty') scheduling = 'queue_for_specialty_review_target_72h';
  else if (req.modality === 'asynchronous' && req.visit_type === 'urgent') scheduling = 'urgent_queue_target_4h';
  else if (req.modality === 'video' && !req.timezone_aware) scheduling = 'request_timezone_confirmation';
  else scheduling = 'scheduled_real_time_visit';

  return { scheduling_recommendation: scheduling, visit_type: req.visit_type, modality: req.modality };
}

function visit_room(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.room_state, 'room_state', ['waiting','provider_joined','patient_joined','both_joined','in_progress','ended','technical_issue','abandoned']);
  ensureBool(req.audio_working, 'audio_working');
  ensureBool(req.video_working, 'video_working');
  ensureNumber(req.latency_ms, 'latency_ms');

  let quality;
  if (req.room_state === 'abandoned' || req.room_state === 'technical_issue') quality = 'reschedule_required';
  else if (!req.audio_working && !req.video_working) quality = 'no_communication_fallback_to_phone';
  else if (req.latency_ms > 500) quality = 'high_latency_consider_audio_only';
  else if (!req.video_working) quality = 'audio_only_proceed';
  else if (req.latency_ms <= 200) quality = 'high_quality_proceed';
  else quality = 'acceptable_quality';

  return { quality_band: quality, audio: req.audio_working, video: req.video_working };
}

function visit_recording(req) {
  ensureStr(req.visit_id, 'visit_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.consent_for_recording, 'consent_for_recording');
  ensureBool(req.consent_for_storage, 'consent_for_storage');
  ensureEnum(req.storage_location, 'storage_location', ['ehr','patient_portal','encrypted_vault','third_party','decline']);
  ensureNumber(req.retention_days, 'retention_days');

  let policy;
  if (!req.consent_for_recording) policy = 'no_recording_proceed';
  else if (!req.consent_for_storage) policy = 'recording_disabled_at_end_of_visit';
  else if (req.storage_location === 'third_party' && req.retention_days > 365) policy = 'third_party_storage_reduce_retention_to_365';
  else if (req.storage_location === 'decline') policy = 'recording_off';
  else policy = 'recording_enabled_with_retention';

  return { recording_policy: policy, retention_days: req.retention_days };
}

function visit_eprescribe(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureStr(req.medication, 'medication');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureEnum(req.frequency, 'frequency', ['qd','bid','tid','qid','q4h','q6h','q8h','q12h','prn','qhs','qam','qpm']);
  ensureNumber(req.duration_days, 'duration_days');
  ensureBool(req.controlled_substance, 'controlled_substance');
  ensureEnum(req.epcs_enabled, 'epcs_enabled', ['yes','no','pending']);

  let action;
  if (req.controlled_substance && req.epcs_enabled !== 'yes') action = 'block_controlled_require_epcs_two_factor';
  else if (req.duration_days > 90 && !req.controlled_substance) action = 'standard_send_to_pharmacy';
  else if (req.duration_days > 30) action = 'standard_send_to_pharmacy_with_refill_check';
  else action = 'standard_send_to_pharmacy';

  return { action, epcs: req.epcs_enabled, controlled: req.controlled_substance };
}

function visit_follow_up(req) {
  ensureStr(req.visit_id, 'visit_id');
  ensureEnum(req.disposition, 'disposition', ['resolved','refer_to_specialist','in_person_follow_up','ed_referral','labs_imaging_ordered','continue_telehealth','schedule_procedure']);
  ensureNumber(req.follow_up_days, 'follow_up_days');
  ensureBool(req.patient_understanding_confirmed, 'patient_understanding_confirmed');
  ensureEnum(req.communication_method, 'communication_method', ['patient_portal','sms','email','phone','mail']);

  let plan;
  if (!req.patient_understanding_confirmed) plan = 're_teach_back_required';
  else if (req.disposition === 'ed_referral') plan = 'coordinate_ed_handoff_with_patient_and_ed_team';
  else if (req.follow_up_days <= 7) plan = 'short_term_follow_up_with_active_monitoring';
  else if (req.follow_up_days <= 30) plan = 'routine_follow_up';
  else plan = 'long_term_follow_up_with_self_management_plan';

  return { follow_up_plan: plan, days: req.follow_up_days, method: req.communication_method };
}

function funcs() {
  return { visit_schedule, visit_room, visit_recording, visit_eprescribe, visit_follow_up };
}

module.exports = { funcs, CITATIONS, ValidationError };