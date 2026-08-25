'use strict';
// TIER4_GI_EXT-102: IBD - UC vs Crohn + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ECCO_UC_2023', 'ECCO_Crohn_2023', 'AGA_IBD_2020'];

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
  ensureStr(req.type, 'type'); // uc | cd | indeterminate
  ensureNumber(req.mayo_score, 'mayo_score'); // 0-12 for UC
  ensureNumber(req.cday_score, 'cday_score'); // crohn's disease activity
  ensureBool(req.rectal_bleeding, 'rectal_bleeding');
  ensureBool(req.perianal_disease, 'perianal_disease');
  ensureBool(req.skip_lesions, 'skip_lesions');
  ensureBool(req.stricturing, 'stricturing');
  ensureBool(req.penetrating, 'penetrating');

  let severity = 'remission';
  if (req.type === 'uc') severity = req.mayo_score >= 10 ? 'severe' : req.mayo_score >= 6 ? 'moderate' : req.mayo_score >= 3 ? 'mild' : 'remission';
  else if (req.type === 'cd') severity = req.cday_score >= 450 ? 'severe' : req.cday_score >= 220 ? 'moderate' : req.cday_score > 150 ? 'mild' : 'remission';

  const phenotype = req.stricturing && req.penetrating ? 'B3_stricturing_penetrating' :
    req.stricturing ? 'B2_stricturing' :
      req.penetrating ? 'B3_penetrating' :
        req.perianal_disease ? 'B3p_perianal' : 'B1_inflammatory';
  return {
    type: req.type,
    severity,
    phenotype,
    perianal: req.perianal_disease,
    workup: req.type === 'indeterminate' ? ['colonoscopy_with_biopsy', 'mri_enterography', 'fecal_calprotectin'] : [],
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureStr(req.type, 'type');
  ensureStr(req.severity, 'severity');
  ensureBool(req.corticosteroid_dependent, 'corticosteroid_dependent');
  ensureBool(req.fistulizing, 'fistulizing');
  ensureBool(req.pregnant, 'pregnant');

  const maintenance = req.type === 'uc' ? 'mesalamine_or_vedolizumab_or_ustekinumab' :
    'azathioprine_or_methotrexate_or_biologic_vedolizumab_ustekinumab_adalimumab';
  const rescue = req.severity === 'severe' ? 'iv_steroids_then_infliximab_or_cyclosporine' :
    req.severity === 'moderate' ? 'prednisone_burst_then_taper_consider_biologic' :
      'topical_or_oral_5asa_budesonide';
  if (req.pregnant) maintenance = 'continue_safe_maintenance_avoid_methotrexate';
  return {
    rescue,
    maintenance,
    surgery: req.fistulizing ? 'consider_seton_or_diverting_ostomy' : req.severity === 'severe' ? 'colectomy_evaluation' : 'no_surgery',
    monitoring: ['fecal_calprotectin_q3_months', 'colonoscopy_surveillance'],
    citations: CITATIONS,
  };
}

module.exports = { classify, treatment, CITATIONS, ValidationError };