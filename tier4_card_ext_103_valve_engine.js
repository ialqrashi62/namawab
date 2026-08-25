'use strict';
// TIER4_CARD_EXT-103: Valve (AS severity, MR severity, intervention timing)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACC_AHA_Valve_2021', 'ESC_Valve_2021'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureEnum(v, allowed, field) {
  if (!allowed.includes(v)) throw new ValidationError(`${field} must be one of ${allowed.join('|')}`, { [field]: v });
  return v;
}

function as_severity(req) {
  ensureNumber(req.peak_velocity, 'peak_velocity');
  ensureNumber(req.mean_gradient, 'mean_gradient');
  ensureNumber(req.ava, 'ava'); // aortic valve area
  ensureBool(req.lvef_reduced, 'lvef_reduced');
  ensureBool(req.symptoms, 'symptoms');

  let severity = 'mild';
  if (req.peak_velocity >= 4 || req.mean_gradient >= 40 || req.ava <= 1) severity = 'severe';
  else if (req.peak_velocity >= 3 || req.mean_gradient >= 20 || req.ava <= 1.5) severity = 'moderate';
  else severity = 'mild';

  const low_flow_low_gradient = severity === 'severe' && req.lvef_reduced && req.peak_velocity < 4;
  const intervention = severity === 'severe' && (req.symptoms || req.lvef_reduced) ? 'savr_or_tavr_refer_heart_team' :
    severity === 'moderate' ? 'monitor_q6_months' :
    'monitor_q1_2_years';

  return {
    peak_velocity: req.peak_velocity,
    mean_gradient: req.mean_gradient,
    ava: req.ava,
    severity,
    low_flow_low_gradient,
    intervention,
    citations: CITATIONS,
  };
}

function mr_severity(req) {
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.vena_contracta, 'vena_contracta');
  ensureNumber(req.regurgitant_volume, 'regurgitant_volume');
  ensureNumber(req.regurgitant_fraction, 'regurgitant_fraction');
  ensureNumber(req.eroa, 'eroa');
  ensureBool(req.symptoms, 'symptoms');
  ensureBool(req.atrial_fibrillation, 'atrial_fibrillation');

  const severity = req.eroa >= 0.4 || req.regurgitant_volume >= 60 || req.regurgitant_fraction >= 50 ? 'severe' :
    req.eroa >= 0.3 || req.regurgitant_volume >= 45 ? 'moderate' : 'mild';
  const surgery = severity === 'severe' && (req.symptoms || req.lvef <= 60) ? 'mitral_surgery_or_teer_refer_heart_team' :
    severity === 'moderate' ? 'monitor_lvef' : 'monitor_annually';
  return {
    lvef: req.lvef,
    severity,
    primary_or_secondary: req.atrial_fibrillation ? 'likely_secondary_or_atrial' : 'primary_likely',
    surgery_indicated: surgery,
    citations: CITATIONS,
  };
}

module.exports = { as_severity, mr_severity, CITATIONS, ValidationError };