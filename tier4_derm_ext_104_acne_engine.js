'use strict';
// TIER4_DERM_EXT-104: Acne severity + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAD_Acne_2018', 'AAD_Acne_2024'];

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
  ensureNumber(req.comedones, 'comedones');
  ensureNumber(req.inflammatory, 'inflammatory');
  ensureNumber(req.nodulocystic, 'nodulocystic');
  ensureBool(req.scarring, 'scarring');
  ensureBool(req.female, 'female');
  ensureBool(req.pcos_features, 'pcos_features');

  let severity = 'mild';
  if (req.nodulocystic >= 5 || req.scarring) severity = 'severe';
  else if (req.inflammatory >= 20 || req.comedones >= 30) severity = 'moderate';
  return {
    severity,
    comedonal: req.comedones >= 20 && req.inflammatory < 10,
    inflammatory: req.inflammatory >= 20,
    nodulocystic: req.nodulocystic >= 5,
    scarring: req.scarring,
    pcos_screening: req.female && req.pcos_features ? 'evaluate_pcos_with_labs' : 'no_pcos_workup',
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureStr(req.severity, 'severity');
  ensureBool(req.scarring, 'scarring');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.isotretinoin_eligible, 'isotretinoin_eligible');

  let first_line;
  if (req.severity === 'severe' || req.scarring) first_line = 'oral_isotretinoin_with_ipledge_program';
  else if (req.severity === 'moderate') first_line = 'topical_retinoid_plus_benzoyl_peroxide_plus_topical_or_oral_antibiotic';
  else first_line = 'topical_retinoid_with_benzoyl_peroxide';
  if (req.pregnant) first_line = 'avoid_isotretinoin_use_erythromycin_or_clindamycin';
  return {
    first_line,
    maintenance: 'topical_retinoid',
    ipledge_required: req.severity === 'severe' || req.scarring,
    follow_up: req.severity === 'severe' ? 'q4_weeks' : 'q8_12_weeks',
    citations: CITATIONS,
  };
}

module.exports = { classify, treatment, CITATIONS, ValidationError };