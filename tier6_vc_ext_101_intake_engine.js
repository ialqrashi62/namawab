// filepath: tier6_vc_ext_101_intake_engine.js
// TIER6_VC_EXT-101: Virtual care intake (demographics, consent, technical readiness, chief complaint)
'use strict';

const CITATIONS = [
  'CDC_TELEHEALTH_2020',
  'AHA_VIRTUAL_CARE_2021',
  'ATA_PRACTICE_GUIDELINES_2022',
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

function intake_demographics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.language, 'language', ['ar','en','fr','ur','hi','bn','tl','es']);
  ensureEnum(req.device_type, 'device_type', ['smartphone','tablet','laptop','desktop','kiosk','phone_only']);
  ensureEnum(req.connectivity, 'connectivity', ['broadband','mobile_4g','mobile_3g','mobile_2g','dialup','unknown']);
  ensureBool(req.consent_to_telehealth, 'consent_to_telehealth');
  ensureBool(req.consent_to_recording, 'consent_to_recording');
  ensureBool(req.identity_verified, 'identity_verified');

  let ready;
  if (req.connectivity === 'dialup' || req.connectivity === 'mobile_2g') ready = 'audio_only_visit';
  else if (!req.consent_to_telehealth || !req.identity_verified) ready = 'cannot_proceed_visit';
  else if (req.device_type === 'phone_only') ready = 'audio_only_with_sms_education';
  else ready = 'audio_video_visit_eligible';

  return { readiness: ready, language_service: req.language, identity_verified: req.identity_verified };
}

function intake_chief_complaint(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.complaint, 'complaint');
  ensureNumber(req.duration_days, 'duration_days');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','life_threatening']);
  ensureBool(req.emergency_symptoms, 'emergency_symptoms');

  let disposition;
  if (req.emergency_symptoms || req.severity === 'life_threatening') disposition = 'refer_to_emergency_department';
  else if (req.severity === 'severe') disposition = 'same_day_video_visit';
  else if (req.severity === 'moderate') disposition = 'within_24h_video_visit';
  else disposition = 'routine_telehealth_visit';

  return { severity: req.severity, suggested_disposition: disposition, complaint: req.complaint };
}

function intake_history(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.history_format, 'history_format', ['patient_provided','caregiver_provided','interpreter_assisted','structured_questionnaire']);
  ensureNumber(req.conditions_count, 'conditions_count');
  ensureNumber(req.medications_count, 'medications_count');
  ensureNumber(req.allergies_count, 'allergies_count');
  ensureBool(req.surgeries_documented, 'surgeries_documented');
  ensureBool(req.family_history_documented, 'family_history_documented');

  let completeness;
  if (req.conditions_count > 0 && req.medications_count > 0 && req.allergies_count >= 0 && req.surgeries_documented && req.family_history_documented) completeness = 'comprehensive';
  else if (req.conditions_count > 0 && req.medications_count > 0) completeness = 'partial_minimum_required_for_med_reconciliation';
  else completeness = 'insufficient_request_clarification';

  return { completeness, conditions: req.conditions_count, meds: req.medications_count };
}

function intake_vitals_self_reported(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.has_home_bp_monitor, 'has_home_bp_monitor');
  ensureBool(req.has_home_pulse_oximeter, 'has_home_pulse_oximeter');
  ensureBool(req.has_home_scale, 'has_home_scale');
  ensureBool(req.has_home_thermometer, 'has_home_thermometer');
  ensureBool(req.weights_self_reported, 'weights_self_reported');

  const equipped = [req.has_home_bp_monitor, req.has_home_pulse_oximeter, req.has_home_scale, req.has_home_thermometer].filter(Boolean).length;
  let band;
  if (equipped === 4) band = 'fully_equipped_for_remote_monitoring';
  else if (equipped >= 2) band = 'adequately_equipped';
  else if (equipped >= 1) band = 'minimally_equipped_request_purchase';
  else band = 'unprepared_for_remote_monitoring_visit';

  return { equipment_score: equipped, band };
}

function intake_risk_stratification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.comorbidity_count, 'comorbidity_count');
  ensureEnum(req.caregiver_availability, 'caregiver_availability', ['independent','family_present','family_remote','home_health_aide','none']);
  ensureBool(req.falls_history, 'falls_history');

  let band;
  if (req.age_years >= 75 && req.comorbidity_count >= 3) band = 'high_complex_refer_to_inperson';
  else if (req.caregiver_availability === 'none' && (req.age_years >= 65 || req.comorbidity_count >= 2)) band = 'moderate_refer_to_inperson_with_care_coordination';
  else if (req.falls_history && req.age_years >= 65) band = 'moderate_home_safety_visit_recommended';
  else band = 'low_telehealth_eligible';

  return { risk_band: band, age: req.age_years };
}

function funcs() {
  return {
    intake_demographics,
    intake_chief_complaint,
    intake_history,
    intake_vitals_self_reported,
    intake_risk_stratification,
  };
}

module.exports = { funcs, CITATIONS, ValidationError };