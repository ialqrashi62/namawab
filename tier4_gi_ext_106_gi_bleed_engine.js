'use strict';
// TIER4_GI_EXT-106: GI Bleed - upper vs lower + risk
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACG_UGIB_2021', 'ESGE_LGIB'];

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

function localize(req) {
  ensureBool(req.hematemesis, 'hematemesis');
  ensureBool(req.melena, 'melena');
  ensureBool(req.hematochezia, 'hematochezia');
  ensureBool(req.coffee_ground_ngtube, 'coffee_ground_ngtube');
  ensureNumber(req.bun, 'bun');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.hemoglobin, 'hemoglobin');
  ensureBool(req.bristol_stool_bright_red, 'bristol_stool_bright_red');

  const bun_cr_ratio = req.bun / Math.max(0.1, req.creatinine);
  const upper = req.hematemesis || req.coffee_ground_ngtube || req.melena || bun_cr_ratio >= 30;
  const lower = !upper && req.hematochezia || req.bristol_stool_bright_red;
  return {
    localization: upper ? 'upper_gastrointestinal' : lower ? 'lower_gastrointestinal' : 'uncertain',
    bun_cr_ratio,
    hemoglobin: req.hemoglobin,
    initial_action: upper ? 'urgent_egd_within_24h_if_high_risk_or_hemodynamic_compromise_immediate' :
      lower ? 'ct_angiography_or_colonoscopy_after_stabilization' : 'ngtube_lavage_then_egd',
    citations: CITATIONS,
  };
}

function risk(req) {
  ensureNumber(req.hemoglobin, 'hemoglobin');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureBool(req.active_bleeding, 'active_bleeding');
  ensureBool(req.liver_disease, 'liver_disease');
  ensureBool(req.cardiac_comorbidity, 'cardiac_comorbidity');
  ensureNumber(req.bun, 'bun');

  const score = (req.sbp < 100 ? 1 : 0) + (req.heart_rate > 100 ? 1 : 0) + (req.hemoglobin < 10 ? 1 : 0) +
    (req.bun > 25 ? 1 : 0) + (req.liver_disease ? 1 : 0) + (req.cardiac_comorbidity ? 1 : 0) +
    (req.active_bleeding ? 1 : 0);
  const risk = score >= 4 ? 'high' : score >= 2 ? 'moderate' : 'low';
  return {
    glasgow_blatchford_score_partial: score,
    risk,
    next: risk === 'high' ? 'transfusion_egd_within_12h_icu' :
      risk === 'moderate' ? 'egd_within_24h' :
        'outpatient_workup_consider_discharge_if_no_active_bleeding',
    citations: CITATIONS,
  };
}

module.exports = { localize, risk, CITATIONS, ValidationError };