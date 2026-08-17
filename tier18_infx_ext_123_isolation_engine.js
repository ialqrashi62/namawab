// filepath: tier18_infx_ext_123_isolation_engine.js
// TIER18_INFX_EXT-123: Isolation precautions (standard, contact, droplet, airborne)
'use strict';

const CITATIONS = ['CDC_ISOLATION_2024','WHO_IPC_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function isolation_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.pathogen_suspected, 'pathogen_suspected', ['none','sars_cov_2','influenza','tb_active','measles','varicella','mrsa','vre','c_diff','meningococcal','pertussis','other']);
  ensureBool(req.cough, 'cough');
  ensureBool(req.fever, 'fever');
  ensureBool(req.diarrhea, 'diarrhea');
  ensureBool(req.vesicular_rash, 'vesicular_rash');
  ensureBool(req.draining_wound, 'draining_wound');
  ensureEnum(req.patient_setting, 'patient_setting', ['private_room','shared_room','cohorting','outpatient','ed','icu','not_admitted','other']);

  let status;
  if (req.pathogen_suspected === 'tb_active') status = 'airborne_isolation_required_aIIcu';
  else if (req.pathogen_suspected === 'measles' || req.pathogen_suspected === 'varicella') status = 'airborne_plus_contact_aIIcu';
  else if (req.pathogen_suspected === 'influenza' || req.pathogen_suspected === 'meningococcal' || req.pathogen_suspected === 'pertussis') status = 'droplet_precautions';
  else if (req.pathogen_suspected === 'c_diff' || req.pathogen_suspected === 'mrsa' || req.pathogen_suspected === 'vre') status = 'contact_precautions';
  else if (req.vesicular_rash) status = 'vesicular_rash_review_varicella_airborne';
  else if (req.draining_wound) status = 'draining_wound_contact_standard';
  else if (req.patient_setting === 'shared_room' && req.pathogen_suspected !== 'none') status = 'private_room_required_not_shared';
  else status = 'standard_precautions_only';
  return { status, setting: req.patient_setting };
}

function isolation_ppe(req) {
  ensureStr(req.task_id, 'task_id');
  ensureEnum(req.isolation_type, 'isolation_type', ['standard','contact','droplet','airborne','protective','enteric','neutropenic','other']);
  ensureBool(req.gloves_worn, 'gloves');
  ensureBool(req.gown_worn, 'gown');
  ensureBool(req.mask_worn, 'mask');
  ensureBool(req.n95_worn, 'n95');
  ensureBool(req.eye_protection_worn, 'eye');
  ensureBool(req.hand_hygiene_before, 'hh_before');
  ensureBool(req.hand_hygiene_after, 'hh_after');
  ensureNumber(req.compliance_score_pct, 'compliance_pct');

  let status;
  if (req.isolation_type === 'airborne' && !req.n95_worn) status = 'airborne_requires_n95_blocking';
  else if (req.isolation_type === 'droplet' && !req.mask_worn) status = 'droplet_requires_surgical_mask';
  else if (req.isolation_type === 'contact' && (!req.gloves_worn || !req.gown_worn)) status = 'contact_requires_gloves_and_gown';
  else if (!req.hand_hygiene_before || !req.hand_hygiene_after) status = 'hand_hygiene_required_before_and_after';
  else if (req.compliance_score_pct < 90) status = 'compliance_under_90_review';
  else status = 'ppe_compliant';
  return { status, score: req.compliance_score_pct };
}

function isolation_room(req) {
  ensureStr(req.room_id, 'room_id');
  ensureEnum(req.room_type, 'room_type', ['standard_private','standard_shared','contact_private','airborne_aIIcu','protective','cohort','negative_pressure','positive_pressure','other']);
  ensureNumber(req.pressure_pa, 'pressure_pa');
  ensureNumber(req.ach, 'ach');
  ensureBool(req.private_bathroom, 'private_bathroom');
  ensureBool(req.dedicated_equipment, 'dedicated_equipment');
  ensureEnum(req.last_check_date, 'last_check_date', ['within_24h','within_7d','within_30d','over_30d','never','other']);

  let status;
  if (req.room_type === 'airborne_aIIcu' && req.pressure_pa >= 0) status = 'aIIcu_requires_negative_pressure';
  else if (req.room_type === 'airborne_aIIcu' && req.ach < 12) status = 'airborne_requires_12_plus_ach';
  else if (!req.private_bathroom && req.room_type === 'contact_private') status = 'contact_private_requires_private_bath';
  else if (!req.dedicated_equipment && req.room_type === 'contact_private') status = 'contact_private_dedicated_equipment_required';
  else if (req.last_check_date === 'over_30d') status = 'pressure_check_overdue';
  else status = 'isolation_room_appropriate';
  return { status, room: req.room_id };
}

function isolation_signage(req) {
  ensureStr(req.room_id, 'room_id');
  ensureEnum(req.sign_type, 'sign_type', ['none','standard','contact','droplet','airborne','protective','enteric','neutropenic','other']);
  ensureBool(req.sign_posted, 'sign_posted');
  ensureBool(req.door_closed, 'door_closed');
  ensureBool(req.ppe_at_door, 'ppe_at_door');
  ensureBool(req.visitor_log_at_door, 'visitor_log');
  ensureBool(req.visitors_restricted, 'visitors_restricted');

  let status;
  if (!req.sign_posted) status = 'sign_required_at_door';
  else if (!req.door_closed && req.sign_type === 'airborne') status = 'airborne_door_must_stay_closed';
  else if (!req.ppe_at_door && ['contact','droplet','airborne'].includes(req.sign_type)) status = 'ppe_required_at_door';
  else if (req.sign_type === 'airborne' && !req.visitors_restricted) status = 'airborne_restrict_visitors';
  else status = 'signage_compliant';
  return { status, sign: req.sign_type };
}

function isolation_discontinue(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.discontinue_basis, 'discontinue_basis', ['time_based','culture_based','symptom_based','clinical_judgement','negative_test_required','other']);
  ensureNumber(req.days_since_positive, 'days_since_positive');
  ensureBool(req.negative_test_result, 'negative_test');
  ensureBool(req.symptom_resolution, 'symptom_resolved');
  ensureBool(req.antibiotic_course_completed, 'antibiotic_completed');

  let status;
  if (req.discontinue_basis === 'culture_based' && !req.negative_test_result) status = 'culture_required_negative_to_dc';
  else if (req.discontinue_basis === 'symptom_based' && !req.symptom_resolution) status = 'symptoms_not_resolved_keep_isolation';
  else if (!req.antibiotic_course_completed && req.discontinue_basis === 'clinical_judgement') status = 'antibiotic_incomplete_review';
  else status = 'isolation_can_be_discontinued';
  return { status, basis: req.discontinue_basis };
}

function funcs() { return { isolation_assess, isolation_ppe, isolation_room, isolation_signage, isolation_discontinue }; }
module.exports = { funcs, CITATIONS, ValidationError };