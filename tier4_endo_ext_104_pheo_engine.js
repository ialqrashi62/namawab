'use strict';
// TIER4_ENDO_EXT-104: Pheochromocytoma - workup + surgical prep
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['Endocrine_Society_Pheo_2014'];

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

function workup(req) {
  ensureNumber(req.plasma_metanephrine, 'plasma_metanephrine');
  ensureNumber(req.urine_metanephrine, 'urine_metanephrine');
  ensureNumber(req.normetanephrine, 'normetanephrine');
  ensureBool(req.episodic_headache, 'episodic_headache');
  ensureBool(req.palpitations, 'palpitations');
  ensureBool(req.diaphoresis, 'diaphoresis');
  ensureBool(req.paroxysmal_htn, 'paroxysmal_htn');

  const symptoms = [req.episodic_headache, req.palpitations, req.diaphoresis].filter(Boolean).length;
  const positive_screen = req.plasma_metanephrine > 4 || req.urine_metanephrine > 4 || req.normetanephrine > 4;
  return {
    positive_screen,
    clinical_suspicion: symptoms >= 2 || req.paroxysmal_htn,
    confirmatory_test: positive_screen ? 'repeat_test_after_2_weeks_or_clonidine_suppression_test' : 'no_pheochromocytoma_workup_complete',
    next_step: positive_screen ? 'ct_abdomen_or_mri_with_or_without_mibg' : 'investigate_alternatives',
    citations: CITATIONS,
  };
}

function preop(req) {
  ensureBool(req.diagnosed, 'diagnosed');
  ensureBool(req.alpha_blockade_started, 'alpha_blockade_started');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.tachycardia, 'tachycardia');

  const alpha_target_days = 7;
  const ready_for_surgery = req.alpha_blockade_started && req.sbp < 140 && !req.tachycardia;
  return {
    ready_for_surgery,
    duration: req.alpha_blockade_started ? 'continue_alpha_blockade_then_add_beta_blocker_if_tachycardia_then_surgery' : 'start_alpha_blockade_phenoxybenzamine_or_doxazosin_7_to_14_days_preop',
    volume: req.alpha_blockade_started ? 'liberal_sodium_and_fluid_intake' : 'maintain_normal_sodium_fluid',
    intraop_risk: 'hypertensive_crisis_intraop_mgmt_with_phentolamine_or_nitroprusside',
    citations: CITATIONS,
  };
}

module.exports = { workup, preop, CITATIONS, ValidationError };