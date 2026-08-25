'use strict';
// TIER4_OPHTH_EXT-105: Pediatric - strabismus + amblyopia
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAPOS_Peds_Ophth_2018', 'AAO_Peds_Ophth_2020'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function strabismus(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.eso_deviation, 'eso_deviation');
  ensureBool(req.exo_deviation, 'exo_deviation');
  ensureBool(req.constant, 'constant');
  ensureBool(req.intermittent, 'intermittent');
  ensureBool(req.amblyopia_risk, 'amblyopia_risk');
  ensureBool(req.family_history, 'family_history');

  const type = req.eso_deviation ? 'esotropia' : req.exo_deviation ? 'exotropia' : 'normal';
  const surgery_candidate = req.amblyopia_risk || (req.age_years < 10 && (req.constant || req.eso_deviation));
  return {
    type,
    constant: req.constant,
    intermittent: req.intermittent,
    surgery_candidate,
    treatment: surgery_candidate ? 'patching_then_surgical_alignment' : req.intermittent ? 'observe_then_surgery_if_persistent' : 'observe_annual',
    monitoring: req.amblyopia_risk ? 'q3_months' : 'q12_months',
    citations: CITATIONS,
  };
}

function amblyopia(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.visual_acuity_eye, 'visual_acuity_eye');
  ensureBool(req.refractive_error, 'refractive_error');
  ensureBool(req.strabismus, 'strabismus');
  ensureBool(req.deprivation_amblyopia, 'deprivation_amblyopia');

  const severity = req.visual_acuity_eye >= 1 ? 'mild' : req.visual_acuity_eye >= 1.5 ? 'moderate' : 'severe';
  const treatment = req.deprivation_amblyopia ? 'urgent_cataract_or_ptosis_surgery_then_patching' :
    req.refractive_error && req.age_years <= 7 ? 'full_spectacle_correction_then_patching' :
      req.strabismus ? 'patching_with_occlusion_2_6_hours_daily_then_surgery' :
        'spectacle_then_patching';
  const window = req.age_years <= 7 ? 'optimal_window_q1_month_followup' :
    req.age_years <= 12 ? 'recoverable_q3_month_followup' : 'limited_recovery_lifelong_followup';
  return {
    severity,
    treatment,
    window,
    citations: CITATIONS,
  };
}

module.exports = { strabismus, amblyopia, CITATIONS, ValidationError };