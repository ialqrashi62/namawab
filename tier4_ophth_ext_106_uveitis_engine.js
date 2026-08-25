'use strict';
// TIER4_OPHTH_EXT-106: Uveitis - anterior + posterior
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAO_Uveitis_2019'];

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

function classify(req) {
  ensureStr(req.location, 'location'); // anterior | intermediate | posterior | panuveitis
  ensureBool(req.cells, 'cells');
  ensureBool(req.photophobia, 'photophobia');
  ensureBool(req.floaters, 'floaters');
  ensureBool(req.vision_loss, 'vision_loss');
  ensureBool(req.systemic_inflammatory, 'systemic_inflammatory');
  ensureBool(req.infectious, 'infectious');
  ensureBool(req.bilateral, 'bilateral');

  const chronic = req.bilateral && req.systemic_inflammatory || req.location === 'posterior';
  return {
    location: req.location,
    severity: req.vision_loss ? 'severe' : req.floaters ? 'moderate' : 'mild',
    chronic,
    likely_etiology: req.infectious ? 'infectious_evaluate_tb_syphilis_herpes_toxoplasmosis' :
      req.systemic_inflammatory ? 'autoimmune_hla_b27_arthritis_or_sarcoid_or_behcet' :
        'idiopathic',
    workup: ['cbc', 'ana_anca_hla_b27', 'chest_xray', 'syphilis_tb_hiv', 'ace'],
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureStr(req.location, 'location');
  ensureStr(req.severity, 'severity');
  ensureBool(req.chronic, 'chronic');
  ensureBool(req.infectious_cause, 'infectious_cause');

  const topical_steroid = req.location === 'anterior' ? 'prednisolone_acetate_1pct_q1h_then_taper' : 'systemic_steroid_or_immunosuppressant';
  const cycloplegic = req.location === 'anterior' ? 'cyclopentolate_1pct_bid_to_tid' : 'not_typically_needed';
  const chronic_immunosuppression = req.chronic && !req.infectious_cause ? 'methotrexate_or_mycophenolate_or_biologic_adalimumab' : 'evaluate_underlying';
  return {
    topical_steroid,
    cycloplegic,
    chronic_immunosuppression,
    biological_agents: 'adalimumab_for_non_infectious_uveitis',
    monitoring: 'q1_2_weeks_until_quiet_then_q1_3_months',
    citations: CITATIONS,
  };
}

module.exports = { classify, treat, CITATIONS, ValidationError };