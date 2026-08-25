'use strict';
// TIER4_ORTHO_EXT-102: Knee - OA + meniscus + ACL
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAOS_OA_2021', 'AAOS_Meniscus_2018', 'AAOS_ACL_2018'];

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

function oa(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.kl_grade, 'kl_grade'); // 0-4
  ensureBool(req.morning_stiffness_30min, 'morning_stiffness_30min');
  ensureBool(req.crepitus, 'crepitus');
  ensureBool(req.varus_deformity, 'varus_deformity');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureNumber(req.bmi, 'bmi');

  let management;
  if (req.kl_grade >= 3 && req.symptomatic && req.bmi >= 30) management = 'tka_candidate_first_optimize_bmi';
  else if (req.kl_grade >= 3 && req.symptomatic) management = 'tka_candidate_with_non_op_trials';
  else if (req.kl_grade >= 1 && req.symptomatic) management = 'conservative_pt_nsaids_injection_weight_loss';
  else management = 'observe_q1_year_imaging_q3_years';
  return {
    kl_grade: req.kl_grade,
    management,
    tka_candidate: req.kl_grade >= 3 && req.symptomatic,
    non_op_trial: ['pt_6_weeks', 'nsaid_topical_oral', 'intraarticular_cortisone_or_HA'],
    citations: CITATIONS,
  };
}

function meniscus(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.locking, 'locking');
  ensureBool(req.catching, 'catching');
  ensureBool(req.swelling, 'swelling');
  ensureBool(req.mcmurray_positive, 'mcmurray_positive');
  ensureBool(req.twisting_injury, 'twisting_injury');

  const surgical = (req.locking || req.catching) && req.age < 60;
  const repair_candidate = req.age < 40 && req.twisting_injury && req.mcmurray_positive;
  return {
    surgical_candidate: surgical,
    repair_candidate,
    surgical_type: repair_candidate ? 'arthroscopic_meniscal_repair' : surgical ? 'arthroscopic_partial_meniscectomy' : 'no_surgery',
    conservative: req.age >= 60 || !req.locking && !req.catching ? ['pt', 'nsaid', 'activity_modification'] : null,
    citations: CITATIONS,
  };
}

function acl(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.active_athlete, 'active_athlete');
  ensureBool(req.pivot_injury, 'pivot_injury');
  ensureBool(req.lachman_positive, 'lachman_positive');
  ensureBool(req.arthrometer, 'arthrometer');
  ensureBool(req.mri_acl_tear, 'mri_acl_tear');
  ensureBool(req.meniscus_tear, 'meniscus_tear');

  const acl_tear = req.lachman_positive || req.arthrometer || req.mri_acl_tear;
  const reconstruction = acl_tear && (req.active_athlete || req.age < 30 || req.meniscus_tear);
  return {
    acl_tear,
    reconstruction_candidate: reconstruction,
    surgical: reconstruction ? 'arthroscopic_acl_reconstruction_with_btb_or_hamstring_autograft' : 'no_surgery_consider_bracing_and_pt',
    return_to_sport: reconstruction ? '9_to_12_months_post_op' : '3_to_6_months_with_pt',
    citations: CITATIONS,
  };
}

module.exports = { oa, meniscus, acl, CITATIONS, ValidationError };