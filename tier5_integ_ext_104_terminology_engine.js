'use strict';
// TIER5_INTEG_EXT-104: Terminology mapping (ICD-10, SNOMED, RxNorm)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['WHO_ICD_10', 'SNOMED_CT', 'RxNorm'];

function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function icd10_to_snomed(req) {
  ensureStr(req.icd10, 'icd10');
  const map = {
    'E11.9': { snomed: '44054006', display: 'Diabetes mellitus type 2' },
    'I10': { snomed: '38341003', display: 'Essential hypertension' },
    'J45.909': { snomed: '195967001', display: 'Asthma' },
  };
  return { icd10: req.icd10, snomed: map[req.icd10] || { snomed: 'unknown', display: 'no_mapping' }, citations: CITATIONS };
}

function snomed_to_icd10(req) {
  ensureStr(req.snomed, 'snomed');
  const map = {
    '44054006': { icd10: 'E11.9', display: 'Type 2 diabetes mellitus' },
    '38341003': { icd10: 'I10', display: 'Essential hypertension' },
    '195967001': { icd10: 'J45.909', display: 'Asthma, unspecified, uncomplicated' },
  };
  return { snomed: req.snomed, icd10: map[req.snomed] || { icd10: 'unknown', display: 'no_mapping' }, citations: CITATIONS };
}

function rxnorm_drug_check(req) {
  ensureStr(req.drug_name, 'drug_name');
  ensureStr(req.dose, 'dose');
  const allowed_units = ['mg', 'mcg', 'g', 'mEq', 'units', 'mL'];
  const parsed = req.dose.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
  if (!parsed) return { drug_name: req.drug_name, dose: req.dose, valid: false, reason: 'dose_format_invalid' };
  const value = Number(parsed[1]);
  const unit = parsed[2];
  return {
    drug_name: req.drug_name,
    dose_value: value,
    dose_unit: unit,
    unit_valid: allowed_units.includes(unit),
    valid: allowed_units.includes(unit) && value > 0,
    citations: CITATIONS,
  };
}

module.exports = { icd10_to_snomed, snomed_to_icd10, rxnorm_drug_check, CITATIONS, ValidationError };