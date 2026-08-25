// filepath: tier5_ed_ext_101_triage_engine.js
// TIER5_ED_EXT-101: Triage (ESI, vitals, chief complaint, acuity)
'use strict';

const CITATIONS = [
  'ESI_Implementation_2012',
  'ATS_Guidelines_2023',
  'ENA_Triage_Standards_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function esi(req) {
  ensureBool(req.requires_life_saving_intervention, 'requires_life_saving_intervention');
  ensureBool(req.high_risk_situation, 'high_risk_situation');
  ensureBool(req.confused_lethargic_disoriented, 'confused_lethargic_disoriented');
  ensureBool(req.severe_pain_or_distress, 'severe_pain_or_distress');
  ensureNumber(req.expected_resources_count, 'expected_resources_count');
  ensureNumber(req.vital_sign_abnormality_count, 'vital_sign_abnormality_count');

  let esi_level;
  if (req.requires_life_saving_intervention) esi_level = 1;
  else if (req.high_risk_situation || req.confused_lethargic_disoriented || req.severe_pain_or_distress || req.vital_sign_abnormality_count >= 2) esi_level = 2;
  else if (req.expected_resources_count >= 2) esi_level = 3;
  else if (req.expected_resources_count === 1) esi_level = 4;
  else esi_level = 5;
  return { esi_level };
}

function vital_sign_assessment(req) {
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.spo2_pct, 'spo2_pct');
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureNumber(req.age_years, 'age_years');

  let warning;
  if (req.spo2_pct < 90) warning = 'critical_hypoxia_then_immediate_intervention';
  else if (req.systolic_bp < 90) warning = 'critical_hypotension_then_immediate_intervention';
  else if (req.respiratory_rate > 30 || req.respiratory_rate < 8) warning = 'critical_rr_then_immediate_intervention';
  else if (req.heart_rate_bpm >= 130) warning = 'severe_tachy_then_urgent_review';
  else if (req.temperature_c >= 39.5) warning = 'severe_pyrexia_then_urgent_review';
  else warning = 'continue_with_standard_triage';
  return { warning };
}

function chief_complaint(req) {
  ensureStr(req.complaint, 'complaint');
  ensureEnum(req.complaint, 'complaint', ['chest_pain','abdominal_pain','shortness_of_breath','headache','fever','trauma','altered_mental_status','back_pain','gi_bleed','psychiatric','syncope','weakness']);
  ensureNumber(req.duration_hours, 'duration_hours');
  ensureNumber(req.pain_score_0_10, 'pain_score_0_10');
  ensureBool(req.sudden_onset, 'sudden_onset');

  let priority;
  if (['chest_pain','shortness_of_breath','altered_mental_status','gi_bleed'].includes(req.complaint) && req.sudden_onset) priority = 'immediate_or_esi_2';
  else if (req.complaint === 'chest_pain' && req.pain_score_0_10 >= 7) priority = 'urgent_then_continue';
  else if (req.pain_score_0_10 >= 8) priority = 'urgent_then_continue';
  else if (req.complaint === 'headache' && req.sudden_onset) priority = 'urgent_then_continue';
  else priority = 'continue_with_standard_triage';
  return { priority };
}

function acuity_assessment(req) {
  ensureStr(req.zone, 'zone');
  ensureEnum(req.zone, 'zone', ['resus','major_treatment','minor_treatment','fast_track','observation']);
  ensureNumber(req.los_minutes_target, 'los_minutes_target');
  ensureNumber(req.current_los_minutes, 'current_los_minutes');
  ensureNumber(req.esi_level, 'esi_level');
  ensureBool(req.bed_available, 'bed_available');

  let plan;
  if (!req.bed_available) plan = 'continue_with_boarding_review';
  else if (req.esi_level <= 2 && req.zone === 'resus') plan = 'continue_with_resus_pathway';
  else if (req.current_los_minutes > req.los_minutes_target * 2) plan = 'consider_fast_track_or_observation';
  else plan = 'continue_with_standard_zone';
  return { plan };
}

function pain_score(req) {
  ensureNumber(req.pain_score, 'pain_score');
  ensureNumber(req.age, 'age');
  ensureBool(req.verbal_response, 'verbal_response');
  ensureBool(req.nonverbal_communication, 'nonverbal_communication');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['chest','abdomen','back','head','limbs','multiple','unknown']);

  let intervention;
  if (req.pain_score >= 7) intervention = 'consider_opioid_or_iv_analgesia_then_review';
  else if (req.pain_score >= 4) intervention = 'consider_oral_analgesia';
  else if (req.pain_score >= 1) intervention = 'consider_oral_analgesia_or_reassurance';
  else intervention = 'no_analgesia_required';
  return { intervention };
}

function triage_disposition(req) {
  ensureNumber(req.esi_level, 'esi_level');
  ensureBool(req.lab_imaging_required, 'lab_imaging_required');
  ensureBool(req.admission_required, 'admission_required');
  ensureBool(req.specialist_consult, 'specialist_consult');
  ensureNumber(req.wait_time_minutes, 'wait_time_minutes');

  let disposition;
  if (req.esi_level === 1) disposition = 'resus_then_immediate_intervention';
  else if (req.esi_level === 2) disposition = 'major_treatment_or_immediate_review';
  else if (req.admission_required) disposition = 'consider_inpatient_admission';
  else if (req.specialist_consult) disposition = 'specialist_consult_then_decision';
  else if (req.lab_imaging_required) disposition = 'continue_with_diagnostics_then_reassess';
  else if (req.wait_time_minutes >= 60) disposition = 'reassess_for_fast_track';
  else disposition = 'continue_with_standard_triage';
  return { disposition };
}

function funcs() { return { esi, vital_sign_assessment, chief_complaint, acuity_assessment, pain_score, triage_disposition }; }
module.exports = { funcs, CITATIONS, ValidationError };
