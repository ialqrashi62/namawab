'use strict';
// TIER4_NEPH_EXT-103: Transplant eligibility + donor type
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_Transplant_2020', 'Banff_2019'];

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

function recipient(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.cardiac_disease, 'cardiac_disease');
  ensureBool(req.active_malignancy, 'active_malignancy');
  ensureBool(req.active_infection, 'active_infection');
  ensureBool(req.substance_use, 'substance_use');
  ensureBool(req.non_adherence_history, 'non_adherence_history');
  ensureBool(req.sensitized, 'sensitized');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.dialysis, 'dialysis');

  const eligible = !req.active_malignancy && !req.active_infection && req.bmi < 40 && req.age >= 18 && req.age <= 75;
  const absolute_exclusions = [];
  if (req.active_malignancy) absolute_exclusions.push('active_malignancy');
  if (req.active_infection) absolute_exclusions.push('active_infection');
  const relative_exclusions = [];
  if (req.bmi >= 40) relative_exclusions.push('morbid_obesity');
  if (req.cardiac_disease) relative_exclusions.push('cardiac_optimization_needed');
  if (req.substance_use) relative_exclusions.push('substance_use_treatment');
  if (req.non_adherence_history) relative_exclusions.push('adherence_support');

  return {
    age: req.age,
    eligible,
    absolute_exclusions,
    relative_exclusions,
    egfr: req.egfr,
    pre_emptive_possible: !req.dialysis && req.egfr < 20,
    sensitization: req.sensitized ? 'high_calculate_cpra' : 'low',
    citations: CITATIONS,
  };
}

function donor(req) {
  ensureStr(req.donor_type, 'donor_type'); // living_related | living_unrelated | deceased_dbd | deceased_dcd
  ensureNumber(req.donor_age, 'donor_age');
  ensureNumber(req.donor_egfr, 'donor_egfr');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.hypertension, 'hypertension');
  ensureBool(req.proteinuria, 'proteinuria');

  let quality;
  if (req.donor_age >= 60 || req.donor_egfr < 60 || req.diabetes && req.hypertension || req.proteinuria) {
    quality = 'extended_criteria';
  } else if (req.donor_age >= 50 || req.donor_egfr < 90 || req.hypertension) {
    quality = 'standard';
  } else {
    quality = 'ideal';
  }
  const recipient_match = req.donor_type === 'living_related' ? 'preferred_for_hla_match' :
    req.donor_type === 'deceased_dbd' ? 'standard_deceased' :
    req.donor_type === 'deceased_dcd' ? 'acceptable_with_caution' :
    'consider_living_unrelated';
  return {
    donor_type: req.donor_type,
    donor_age: req.donor_age,
    quality,
    recipient_match,
    citations: CITATIONS,
  };
}

module.exports = { recipient, donor, CITATIONS, ValidationError };