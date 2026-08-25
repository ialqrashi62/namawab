'use strict';
// TIER4_NEPH_EXT-106: Glomerulonephritis - nephrotic vs nephritic
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_GN_2021', 'Banff_2019'];

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
  ensureNumber(req.proteinuria_g_day, 'proteinuria_g_day');
  ensureNumber(req.hematuria, 'hematuria');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.albumin, 'albumin');
  ensureBool(req.dm, 'dm');
  ensureBool(req.htn, 'htn');

  const nephrotic = req.proteinuria_g_day >= 3.5 && req.albumin < 3;
  const nephritic = req.hematuria > 50 && req.creatinine > 1.5;
  const mixed = nephrotic && nephritic;
  let syndrome = 'neither';
  if (mixed) syndrome = 'mixed';
  else if (nephrotic) syndrome = 'nephrotic';
  else if (nephritic) syndrome = 'nephritic';

  const likely_cause = syndrome === 'nephrotic' ? 'minimal_change_or_membranous_or_focal_segmental_or_diabetic_or_amyloid' :
    syndrome === 'nephritic' ? 'iga_nephropathy_or_post_infectious_or_anti_gbm_or_lupus_nephritis_or_anca_vasculitis' :
      'consider_tubular_disease_or_isolated_proteinuria';
  const referral = (nephrotic || nephritic) ? 'urgent_nephrology_referral_for_biopsy' : 'pcp_followup_lifestyle_rea';
  return {
    proteinuria_g_day: req.proteinuria_g_day,
    hematuria: req.hematuria,
    syndrome,
    likely_cause,
    referral,
    citations: CITATIONS,
  };
}

function biopsy(req) {
  ensureStr(req.syndrome, 'syndrome'); // nephrotic | nephritic | mixed
  ensureNumber(req.proteinuria_g_day, 'proteinuria_g_day');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.albumin, 'albumin');
  ensureBool(req.dm, 'dm');
  ensureBool(req.systemic_lupus, 'systemic_lupus');
  ensureBool(req.anca_positive, 'anca_positive');
  ensureBool(req.anti_gbm_positive, 'anti_gbm_positive');
  ensureNumber(req.egfr, 'egfr');

  const biopsy_indicated = req.syndrome === 'nephrotic' && (req.proteinuria_g_day > 4 || req.creatinine > 2 || req.albumin < 2.5) ||
    req.syndrome === 'nephritic' && (req.creatinine > 2 || req.anca_positive || req.anti_gbm_positive || req.systemic_lupus) ||
    req.syndrome === 'mixed' ||
    (req.dm === false && req.proteinuria_g_day > 1);

  return {
    biopsy_indicated,
    syndrome: req.syndrome,
    urgency: req.anca_positive || req.anti_gbm_positive || req.creatinine > 4 ? 'emergent' : 'urgent_outpatient',
    pre_biopsy_workup: ['complement_c3_c4', 'anca', 'anti_gbm', 'serology_hep_b_hep_c_hiv', 'serum_immunoelectrophoresis', 'renal_ultrasound'],
    citations: CITATIONS,
  };
}

module.exports = { classify, biopsy, CITATIONS, ValidationError };