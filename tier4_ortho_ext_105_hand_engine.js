'use strict';
// TIER4_ORTHO_EXT-105: Hand - carpal tunnel + trigger finger
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAHS_Carpal_2016', 'AAOS_Trigger_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function carpal_tunnel(req) {
  ensureBool(req.nocturnal_symptoms, 'nocturnal_symptoms');
  ensureBool(req.tinel_positive, 'tinel_positive');
  ensureBool(req.phalen_positive, 'phalen_positive');
  ensureBool(req.thumb_weakness, 'thumb_weakness');
  ensureBool(req.thenar_atrophy, 'thenar_atrophy');
  ensureBool(req.bilateral, 'bilateral');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.pregnant, 'pregnant');

  let severity = 'mild';
  if (req.thenar_atrophy || req.thumb_weakness) severity = 'severe';
  else if (req.tinel_positive && req.phalen_positive && req.nocturnal_symptoms) severity = 'moderate';

  let treatment;
  if (severity === 'severe') treatment = 'carpal_tunnel_release_surgical';
  else if (severity === 'moderate') treatment = 'splinting_nsaid_cortisone_injection_then_consider_surgery';
  else treatment = 'splinting_activity_modification_nerve_glide';
  if (req.pregnant) treatment = 'splinting_observation_post_partum';
  return {
    severity,
    treatment,
    surgical: severity === 'severe' ? 'open_or_endoscopic_release' : severity === 'moderate' ? 'consider_release_if_failed_conservative' : 'no_surgery',
    monitoring: severity === 'severe' ? 'q4_weeks_ncs_preop' : 'q6_8_weeks',
    citations: CITATIONS,
  };
}

function trigger_finger(req) {
  ensureBool(req.catching, 'catching');
  ensureBool(req.locking, 'locking');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.palpable_nodule, 'palpable_nodule');
  ensureBool(req.active_motion_limited, 'active_motion_limited');
  ensureNumber(req.grade, 'grade'); // 1-4

  const treatment = req.grade >= 3 ? 'steroid_injection_or_surgical_release' :
    req.grade === 2 ? 'steroid_injection_then_splint_then_consider_surgery' :
      'splint_activity_modification';
  return {
    grade: req.grade,
    treatment,
    diabetic_risk: req.diabetes,
    surgical: req.grade >= 3 ? 'open_release_a1_pulley' : 'no_surgery_typically',
    citations: CITATIONS,
  };
}

module.exports = { carpal_tunnel, trigger_finger, CITATIONS, ValidationError };