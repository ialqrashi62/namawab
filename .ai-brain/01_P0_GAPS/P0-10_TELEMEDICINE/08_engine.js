/**
 * Telemedicine — Engine
 */

'use strict';

const CITATIONS = { MOH_TM: 'MoH Saudi Telemedicine 2024', CBAHI: 'CBAHI Telehealth' };

function sessionInitialization(input) {
  const { patient_id, provider_id, session_type, encryption_method } = input;
  const session_id = `TMS-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const token = `JWT-${Math.random().toString(36).slice(2, 20)}`;
  return {
    session_id,
    patient_id,
    provider_id,
    session_type,
    encryption: encryption_method || 'DTLS-SRTP_AES256',
    jwt_token: token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ice_servers: [{ urls: 'stun:stun.namaMedical.sa:3478' }, { urls: 'turn:turn.namaMedical.sa:3478', credential: '__CHANGE_ME__' }],
    citation: CITATIONS.MOH_TM,
  };
}

function vitalSignsStream(input) {
  const { session_id, patient_id, vital_signs } = input;
  const vs = vital_signs;
  const alerts = [];
  if (vs.spo2 && vs.spo2 < 92) alerts.push('LOW_SPO2');
  if (vs.heart_rate && (vs.heart_rate < 50 || vs.heart_rate > 120)) alerts.push('HR_ABNORMAL');
  if (vs.systolic_bp && (vs.systolic_bp < 90 || vs.systolic_bp > 180)) alerts.push('BP_CRITICAL');
  return { session_id, patient_id, vital_signs: vs, alerts, timestamp: new Date().toISOString() };
}

function asyncConsultRequest(input) {
  const { patient_id, provider_id, chief_complaint, urgency, attachments } = input;
  const request_id = `TMC-${Date.now()}`;
  return {
    request_id,
    patient_id, provider_id,
    chief_complaint, urgency,
    expected_response_hours: urgency === 'urgent' ? 1 : urgency === 'high' ? 4 : 24,
    attachments_count: (attachments || []).length,
    status: 'queued',
  };
}

function ePrescribeFromTele(input) {
  const { session_id, drug_name, dose, frequency, duration, prescriber_id } = input;
  return {
    prescription_id: `RXT-${Date.now()}`,
    session_id,
    drug_name, dose, frequency, duration,
    prescriber_id,
    electronically_signed: true,
    issued_at: new Date().toISOString(),
    citation: CITATIONS.CBAHI,
  };
}

function followUpScheduling(input) {
  const { session_id, follow_up_in_days, reason, urgency } = input;
  const scheduled_date = new Date(Date.now() + follow_up_in_days * 24 * 60 * 60 * 1000);
  return {
    follow_up_id: `FU-${Date.now()}`,
    session_id,
    scheduled_date: scheduled_date.toISOString(),
    reason, urgency,
    type: urgency === 'urgent' ? 'video' : 'phone',
  };
}

function sessionRecordingConsent(input) {
  const { session_id, patient_consent, recording_reason, expires_in_days } = input;
  return {
    session_id,
    recording_consent: patient_consent,
    reason: recording_reason,
    retention_days: expires_in_days || 30,
    expires_at: new Date(Date.now() + (expires_in_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
    citation: CITATIONS.MOH_TM,
  };
}

module.exports = {
  sessionInitialization, vitalSignsStream, asyncConsultRequest,
  ePrescribeFromTele, followUpScheduling, sessionRecordingConsent,
  CITATIONS,
};