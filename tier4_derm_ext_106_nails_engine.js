'use strict';
// TIER4_DERM_EXT-106: Nails - onychomycosis + paronychia
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAD_Onycho_2013', 'AAD_Paronychia_2018'];

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

function onycho(req) {
  ensureNumber(req.nail_count, 'nail_count');
  ensureBool(req.distal_subungual, 'distal_subungual');
  ensureBool(req.white_superficial, 'white_superficial');
  ensureBool(req.proximal_subungual, 'proximal_subungual');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.immunocompromised, 'immunocompromised');

  const treatment = req.diabetes || req.immunocompromised || req.nail_count >= 3 ? 'systemic_terbinafine_or_itraconazole_with_liver_function' :
    req.nail_count < 3 ? 'topical_ciclopirox_or_efinaconazole' : 'topical_plus_oral_consideration';
  return {
    onychomycosis: req.distal_subungual || req.white_superficial || req.proximal_subungual,
    type: req.white_superficial ? 'white_superficial' : req.proximal_subungual ? 'proximal_subungual' : 'distal_subungual',
    treatment,
    liver_function: req.diabetes || req.immunocompromised ? 'pre_and_during_treatment' : 'baseline',
    duration: '6_weeks_fingernails_to_12_weeks_toenails',
    citations: CITATIONS,
  };
}

function paronychia(req) {
  ensureBool(req.acute, 'acute');
  ensureBool(req.pus_present, 'pus_present');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.ingrown_nail, 'ingrown_nail');
  ensureBool(req.chronic, 'chronic');
  ensureBool(req.systemic_symptoms, 'systemic_symptoms');

  const treatment = req.pus_present ? 'incision_and_drainage_with_packing' :
    req.ingrown_nail ? 'partial_nail_avulsion_with_phphenol_ablation' :
      'warm_soaks_with_topical_or_oral_antibiotic_covering_staph';
  const iv_abx = req.diabetes && req.systemic_symptoms;
  return {
    paronychia: true,
    acute: req.acute,
    chronic: req.chronic,
    treatment,
    iv_antibiotics: iv_abx,
    surgical_referral: req.ingrown_nail || req.pus_present,
    citations: CITATIONS,
  };
}

module.exports = { onycho, paronychia, CITATIONS, ValidationError };