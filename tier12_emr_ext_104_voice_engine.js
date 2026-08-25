// filepath: tier12_emr_ext_104_voice_engine.js
// TIER12_EMR_EXT-104: Voice transcription & ambient AI scribe
'use strict';

const CITATIONS = ['HIPAA_VOICE_2024','FDA_AI_SCRIBE_2024','AHIMA_AMBIENT_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function voice_capture(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.consent, 'consent', ['explicit_recording','ambient_consent','one_party','two_party_required','declined']);
  ensureNumber(req.duration_seconds, 'duration_seconds');
  ensureEnum(req.environment, 'environment', ['exam_room','office','telehealth','emergency','operating','procedural','bedside','group_therapy','home_visit','public_space','other']);
  ensureBool(req.phi_protected, 'phi_protected');

  let capture_status;
  if (req.consent === 'declined') capture_status = 'consent_declined_no_capture';
  else if (req.consent === 'two_party_required' && !req.phi_protected) capture_status = 'two_party_consent_phi_scrubbing_required';
  else if (req.duration_seconds > 7200) capture_status = 'over_2h_split_recording';
  else if (req.environment === 'public_space') capture_status = 'public_space_high_rer_review';
  else capture_status = 'capture_eligible';
  return { capture_status, consent: req.consent, environment: req.environment };
}

function voice_transcribe(req) {
  ensureStr(req.audio_id, 'audio_id');
  ensureNumber(req.wer_percent, 'wer_percent');
  ensureEnum(req.engine, 'engine', ['whisper_medical','amazon_transcribe_medical','azure_speech','google_healthcare_speech','nuance_dmo','vendors_healthcare','generic_speech_to_text','other']);
  ensureNumber(req.duration_seconds, 'duration_seconds');
  ensureEnum(req.speaker_count, 'speaker_count', ['one','two','three','four_plus','unknown','mixed']);
  ensureBool(req.has_phi_tokenization, 'has_phi_tokenization');

  let transcription_status;
  if (req.wer_percent >= 30) transcription_status = 'high_wer_review_audio_quality';
  else if (req.speaker_count === 'four_plus' && !req.has_phi_tokenization) transcription_status = 'multiple_speakers_phi_tokenization_required';
  else if (req.engine === 'generic_speech_to_text' && req.duration_seconds > 60) transcription_status = 'use_medical_grade_engine_for_medical_content';
  else transcription_status = 'transcription_complete';
  return { transcription_status, wer: req.wer_percent, engine: req.engine };
}

function voice_ambient_summary(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureNumber(req.subjective_words, 'subjective_words');
  ensureNumber(req.objective_words, 'objective_words');
  ensureNumber(req.assessment_words, 'assessment_words');
  ensureNumber(req.plan_words, 'plan_words');
  ensureNumber(req.unrelated_words, 'unrelated_words');
  ensureEnum(req.confidence_band, 'confidence_band', ['high_above_85','medium_70_to_85','low_below_70','not_assessed']);

  let summary_status;
  const clinical_words = req.subjective_words + req.objective_words + req.assessment_words + req.plan_words;
  const total_words = clinical_words + req.unrelated_words;
  const clinical_ratio = total_words > 0 ? clinical_words / total_words : 0;
  if (req.confidence_band === 'low_below_70') summary_status = 'low_confidence_human_review_required';
  else if (clinical_ratio < 0.3) summary_status = 'low_clinical_signal_review_recording';
  else if (clinical_ratio >= 0.8 && req.confidence_band === 'high_above_85') summary_status = 'high_quality_ready_for_signature';
  else summary_status = 'ambient_summary_ready_for_review';
  return { summary_status, clinical_ratio: Math.round(clinical_ratio * 1000) / 10, confidence: req.confidence_band };
}

function voice_phi_redact(req) {
  ensureStr(req.transcript_id, 'transcript_id');
  ensureNumber(req.phi_instances_detected, 'phi_instances_detected');
  ensureNumber(req.phi_instances_redacted, 'phi_instances_redacted');
  ensureEnum(req.method, 'method', ['regex_pattern','ml_ner','context_window','manual','combined','mask_then_restore','none','other']);
  ensureBool(req.residual_phi_check, 'residual_phi_check');

  let redact_status;
  if (req.phi_instances_detected === 0) redact_status = 'no_phi_detected';
  else if (req.phi_instances_redacted < req.phi_instances_detected) redact_status = 'incomplete_redaction_' + (req.phi_instances_detected - req.phi_instances_redacted) + '_remaining';
  else if (!req.residual_phi_check) redact_status = 'residual_phi_verification_required';
  else redact_status = 'phi_redaction_complete';
  return { redact_status, detected: req.phi_instances_detected, redacted: req.phi_instances_redacted };
}

function voice_to_note(req) {
  ensureStr(req.transcript_id, 'transcript_id');
  ensureEnum(req.target_note_type, 'target_note_type', ['progress','h_and_p','consult','discharge','procedure','operative','nursing','behavioral','urgent_visit','preventive','other']);
  ensureNumber(req.edit_distance, 'edit_distance');
  ensureNumber(req.facts_extracted, 'facts_extracted');
  ensureBool(req.provider_approved, 'provider_approved');
  ensureBool(req.attestation_signature_added, 'attestation_signature_added');

  let note_status;
  if (!req.provider_approved) note_status = 'awaiting_provider_approval';
  else if (req.provider_approved && !req.attestation_signature_added) note_status = 'approved_pending_attestation';
  else if (req.facts_extracted < 5) note_status = 'low_fact_density_review_extraction';
  else if (req.edit_distance > 50) note_status = 'high_edit_distance_review_human';
  else note_status = 'note_ready_for_signing';
  return { note_status, target_note: req.target_note_type, facts: req.facts_extracted };
}

function funcs() { return { voice_capture, voice_transcribe, voice_ambient_summary, voice_phi_redact, voice_to_note }; }
module.exports = { funcs, CITATIONS, ValidationError };