'use strict';
// TIER4_NEPH_EXT-101: CKD staging + KFRE + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_CKD_2024', 'KDIGO_KFRE_2021'];

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

function stage(req) {
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.albuminuria_mg, 'albuminuria_mg');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.hypertension, 'hypertension');
  ensureBool(req.proteinuria, 'proteinuria');

  let gfr_category = 'G1';
  if (req.egfr < 15) gfr_category = 'G5';
  else if (req.egfr < 30) gfr_category = 'G4';
  else if (req.egfr < 45) gfr_category = 'G3b';
  else if (req.egfr < 60) gfr_category = 'G3a';
  else if (req.egfr < 90) gfr_category = 'G2';
  const albuminuria_category = req.albuminuria_mg >= 300 ? 'A3' : req.albuminuria_mg >= 30 ? 'A2' : 'A1';
  const ckd_stage = `${gfr_category}_${albuminuria_category}`;
  const rrt_indicated = req.egfr < 15 || req.egfr < 20 && req.proteinuria;

  return {
    egfr: req.egfr,
    albuminuria_mg: req.albuminuria_mg,
    gfr_category,
    albuminuria_category,
    ckd_stage,
    rrt_indicated,
    referral: req.egfr < 30 ? 'refer_to_nephrology' : req.egfr < 60 ? 'co_manage_with_pcp' : 'pcp_followup',
    citations: CITATIONS,
  };
}

function kfre(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.albuminuria_mg, 'albuminuria_mg');
  ensureBool(req.female, 'female');

  // Simplified KFRE 2-year kidney failure risk
  const score = (req.female ? -0.2 : 0) + (req.age >= 60 ? 0.5 : 0) + (req.egfr < 30 ? 1.2 : req.egfr < 45 ? 0.7 : 0) +
    (req.albuminuria_mg >= 300 ? 1.0 : req.albuminuria_mg >= 30 ? 0.5 : 0);
  const two_year = score > 2 ? 'high_greater_than_15' :
    score > 1.2 ? 'moderate_5_15' :
    score > 0.4 ? 'low_intermediate_1_5' : 'low_less_than_1';
  return {
    age: req.age,
    egfr: req.egfr,
    albuminuria_mg: req.albuminuria_mg,
    risk_2yr: two_year,
    citations: CITATIONS,
  };
}

module.exports = { stage, kfre, CITATIONS, ValidationError };