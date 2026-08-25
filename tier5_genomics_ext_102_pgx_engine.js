'use strict';
// TIER5_GENOMICS_EXT-102: Pharmacogenomics (PGx) - CPIC guidelines
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['CPIC_2024', 'DPWG_2023', 'PharmGKB'];

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

function clopidogrel(req) {
  ensureStr(req.cyp2c19, 'cyp2c19'); // um | rm | nm | pm
  ensureStr(req.drug, 'drug');
  ensureBool(req.acs, 'acs');
  ensureBool(req.pci, 'pci');

  let recommendation;
  if (req.cyp2c19 === 'pm' || req.cyp2c19 === 'rm') {
    recommendation = 'avoid_clopidogrel_use_prasugrel_or_ticagrelor_with_dose_per_cpic';
  } else if (req.cyp2c19 === 'nm') {
    recommendation = 'clopidogrel_normal_label_use';
  } else {
    recommendation = 'clopidogrel_um_normal_metabolizer_default';
  }
  return {
    cyp2c19: req.cyp2c19,
    recommendation,
    alternative: req.cyp2c19 === 'pm' || req.cyp2c19 === 'rm' ? 'prasugrel_or_ticagrelor' : 'clopidogrel_ok',
    citations: CITATIONS,
  };
}

function warfarin(req) {
  ensureStr(req.vkorc1, 'vkorc1'); // aa | ag | gg
  ensureStr(req.cyp2c9, 'cyp2c9'); // *1/*1 | *1/*2 | *1/*3 | *2/*2 | *2/*3 | *3/*3
  ensureNumber(req.age, 'age');
  ensureNumber(req.height_cm, 'height_cm');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.asian, 'asian');
  ensureBool(req.african_american, 'african_american');

  const vkorc1_factor = req.vkorc1 === 'aa' ? -0.6137 : req.vkorc1 === 'ag' ? -0.3068 : 0;
  let cyp2c9_factor = 0;
  if (req.cyp2c9 === '*1/*2') cyp2c9_factor = -0.5211;
  else if (req.cyp2c9 === '*1/*3') cyp2c9_factor = -0.9357;
  else if (req.cyp2c9 === '*2/*2') cyp2c9_factor = -0.9357;
  else if (req.cyp2c9 === '*2/*3') cyp2c9_factor = -1.6154;
  else if (req.cyp2c9 === '*3/*3') cyp2c9_factor = -1.8026;
  const dose = (5.6044 + vkorc1_factor + cyp2c9_factor - 0.2614 * req.age) ;
  return {
    vkorc1: req.vkorc1,
    cyp2c9: req.cyp2c9,
    predicted_dose_mg_week: Math.max(7, dose).toFixed(2),
    initial_dose_per_protocol: 'start_at_predicted_dose_adjust_per_inr',
    citations: CITATIONS,
  };
}

function codeine(req) {
  ensureStr(req.cyp2d6, 'cyp2d6'); // um | rm | nm | im | pm
  ensureBool(req.pediatric, 'pediatric');
  ensureNumber(req.age, 'age');
  ensureBool(req.pain_chronic, 'pain_chronic');

  const avoid = req.cyp2d6 === 'um' || req.cyp2d6 === 'pm' || req.pediatric && req.cyp2d6 !== 'nm';
  return {
    cyp2d6: req.cyp2d6,
    codeine_recommendation: avoid ? 'avoid_use_morphine_or_hydrocodone_alternative' : 'codeine_acceptable_per_label',
    pediatric_warning: req.pediatric && req.cyp2d6 === 'pm' ? 'contraindicated_risk_of_respiratory_depression' : 'not_applicable',
    citations: CITATIONS,
  };
}

module.exports = { clopidogrel, warfarin, codeine, CITATIONS, ValidationError };