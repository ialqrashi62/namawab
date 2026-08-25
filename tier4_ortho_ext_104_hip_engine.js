'use strict';
// TIER4_ORTHO_EXT-104: Hip - OA + fracture risk
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAOS_OA_2021', 'USPSTF_Fracture_2018', 'FRAX'];

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
  ensureBool(req.groin_pain, 'groin_pain');
  ensureBool(req.si_tenderness, 'si_tenderness');
  ensureBool(req.rotation_loss, 'rotation_loss');
  ensureBool(req.xray_oa, 'xray_oa');
  ensureBool(req.activity_limitation, 'activity_limitation');
  ensureNumber(req.hoos, 'hoos');

  const surgical = req.xray_oa && req.activity_limitation && req.hoos < 50;
  return {
    hip_oa_likely: req.groin_pain && req.rotation_loss && req.xray_oa,
    tha_candidate: surgical,
    surgical: surgical ? 'total_hip_arthroplasty_anterior_or_posterior_approach' : 'no_surgery',
    conservative: ['pt', 'nsaid', 'intraarticular_steroid', 'activity_modification', 'weight_loss'],
    differential: req.si_tenderness ? ['si_joint_dysfunction', 'gluteus_tendinopathy'] : null,
    citations: CITATIONS,
  };
}

function fracture_risk(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.female, 'female');
  ensureBool(req.menopause, 'menopause');
  ensureBool(req.glucocorticoid, 'glucocorticoid');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.alcohol, 'alcohol');
  ensureBool(req.parent_hip_fracture, 'parent_hip_fracture');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.frax_score, 'frax_score');

  const risk = req.frax_score >= 20 ? 'high' : req.frax_score >= 10 ? 'intermediate' : 'low';
  return {
    frax_score: req.frax_score,
    risk,
    treatment: risk === 'high' ? 'bisphosphonate_or_denosumab_or_romosozumab' :
      risk === 'intermediate' ? 'consider_treatment_with_risk_factors' : 'lifestyle_modification_vitamin_d_calcium_exercise',
    dxa_recommended: req.age >= 65 || req.female && req.menopause || req.glucocorticoid,
    citations: CITATIONS,
  };
}

module.exports = { oa, fracture_risk, CITATIONS, ValidationError };