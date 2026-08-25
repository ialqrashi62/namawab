'use strict';
// TIER5_GENOMICS_EXT-105: Newborn screening interpretation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['HRSA_NBS_2018', 'ACMG_ACT_2006'];

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

function interpret(req) {
  ensureStr(req.condition, 'condition'); // pku | ch | cah | galactosemia | msud | sickle_cell | ccfd | scid | hearing
  ensureBool(req.abnormal_screen, 'abnormal_screen');
  ensureNumber(req.days_life, 'days_life');
  ensureBool(req.family_history, 'family_history');

  let action;
  if (!req.abnormal_screen) action = 'no_immediate_action';
  else if (req.condition === 'pku' || req.condition === 'ch' || req.condition === 'cah' || req.condition === 'galactosemia' || req.condition === 'msud') {
    action = 'urgent_referral_subspecialist_within_24h_dietary_or_medication_intervention';
  } else if (req.condition === 'sickle_cell') {
    action = 'penicillin_prophylaxis_by_2_months_pediatric_hematology';
  } else if (req.condition === 'scid') {
    action = 'immune_reconstitution_isolation_pediatric_immunology_within_24h';
  } else if (req.condition === 'hearing') {
    action = 'repeat_ahr_evaluation_then_refer_audiology';
  } else if (req.condition === 'ccfd') {
    action = 'pulmonary_clinic_followup_sweat_chloride';
  } else {
    action = 'refer_subspecialty_per_protocol';
  }
  return {
    condition: req.condition,
    abnormal_screen: req.abnormal_screen,
    days_life: req.days_life,
    action,
    family_counseling: req.family_history ? 'genetic_counseling_recommended' : 'standard',
    citations: CITATIONS,
  };
}

function timing(req) {
  ensureNumber(req.days_life, 'days_life');
  ensureStr(req.condition_category, 'condition_category'); // metabolic | endocrine | hem | immun | sensory

  const timing_map = {
    metabolic: 24,
    endocrine: 48,
    hem: 168,
    immun: 24,
    sensory: 168,
  };
  const within = req.days_life * 24;
  const target = timing_map[req.condition_category];
  return {
    within: within <= target ? 'within_target' : 'overdue',
    target_hours: target,
    actual_hours: within,
    citation: CITATIONS[0],
  };
}

module.exports = { interpret, timing, CITATIONS, ValidationError };