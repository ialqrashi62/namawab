// filepath: tier6_vc_ext_104_async_care_engine.js
// TIER6_VC_EXT-104: Asynchronous virtual care (e-consult, store-and-forward, photo review, message triage, second opinion)
'use strict';

const CITATIONS = ['ATA_ASYNC_2021','AHA_ECON_2020'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function async_econsult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.requesting_provider, 'requesting_provider');
  ensureStr(req.specialty, 'specialty');
  ensureStr(req.question, 'question');
  ensureNumber(req.target_response_hours, 'target_response_hours');
  ensureEnum(req.priority, 'priority', ['routine','urgent','emergent']);

  let sla;
  if (req.priority === 'emergent') sla = 'phone_handoff_within_1h';
  else if (req.priority === 'urgent') sla = 'response_within_24h';
  else sla = 'response_within_72h';

  return { sla, specialty: req.specialty, priority: req.priority };
}

function async_store_forward(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.image_type, 'image_type', ['derm','wound','eye','radiograph','ecg','mri','ct','pathology','retinal_photo','oral']);
  ensureStr(req.image_url, 'image_url');
  ensureStr(req.clinical_context, 'clinical_context');
  ensureNumber(req.days_to_review, 'days_to_review');

  let queue;
  if (req.image_type === 'ecg' || req.image_type === 'radiograph') queue = 'rapid_review_within_24h';
  else if (req.days_to_review <= 1) queue = 'priority_review';
  else queue = 'routine_review_queue';

  return { queue, image_type: req.image_type };
}

function async_photo_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.body_part, 'body_part', ['face','eye','skin','wound','rash','throat','extremity','scalp','mouth','genital']);
  ensureBool(req.photo_quality_adequate, 'photo_quality_adequate');
  ensureStr(req.history_provided, 'history_provided');
  ensureNumber(req.previous_similar_episodes, 'previous_similar_episodes');

  let recommendation;
  if (!req.photo_quality_adequate) recommendation = 'request_better_quality_photo_with_lighting_and_scale';
  else if (req.previous_similar_episodes === 0) recommendation = 'first_occurrence_full_dermatology_video_visit_recommended';
  else if (req.body_part === 'eye') recommendation = 'urgent_ophthalmology_video_visit';
  else recommendation = 'asynchronous_review_only';

  return { recommendation, body_part: req.body_part };
}

function async_message_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.channel, 'channel', ['portal','sms','email','app']);
  ensureEnum(req.urgency_self_reported, 'urgency_self_reported', ['low','medium','high','emergency']);
  ensureStr(req.message_body, 'message_body');
  ensureBool(req.attachment_included, 'attachment_included');

  let triage;
  if (req.urgency_self_reported === 'emergency') triage = 'immediate_escalate_to_clinical_team_and_call_patient';
  else if (req.urgency_self_reported === 'high') triage = 'clinical_review_within_4h';
  else if (req.urgency_self_reported === 'medium') triage = 'clinical_review_within_24h';
  else triage = 'administrative_review_within_72h';

  return { triage_band: triage, channel: req.channel };
}

function async_second_opinion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.original_diagnosis, 'original_diagnosis');
  ensureStr(req.specialty_requested, 'specialty_requested');
  ensureNumber(req.records_attached, 'records_attached');
  ensureBool(req.pathology_included, 'pathology_included');

  let action;
  if (req.records_attached < 3) action = 'request_additional_records_before_opinion';
  else if (req.pathology_included) action = 'comprehensive_pathology_review_path';
  else action = 'standard_second_opinion_review';

  return { recommendation: action, specialty: req.specialty_requested };
}

function funcs() { return { async_econsult, async_store_forward, async_photo_review, async_message_triage, async_second_opinion }; }
module.exports = { funcs, CITATIONS, ValidationError };