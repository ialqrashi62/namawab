'use strict';
// TIER4_RAD_EXT2-106: Pediatric imaging - radiation dose
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['Image_Gently', 'ACR_SPR_Peds_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function dose(req) {
  ensureStr(req.examination, 'examination'); // ct_head | ct_chest | ct_abdomen | fluoroscopy | plain_xray
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.weight_kg, 'weight_kg');

  let dose_mgy;
  if (req.examination === 'ct_head') dose_mgy = req.age_years < 1 ? 30 : req.age_years < 6 ? 25 : 35;
  else if (req.examination === 'ct_chest') dose_mgy = req.age_years < 1 ? 5 : req.age_years < 6 ? 8 : 10;
  else if (req.examination === 'ct_abdomen') dose_mgy = req.age_years < 1 ? 8 : req.age_years < 6 ? 10 : 15;
  else dose_mgy = req.examination === 'fluoroscopy' ? 5 : 0.1;
  return {
    examination: req.examination,
    age_years: req.age_years,
    dose_mgy,
    technique: 'image_gently_pediatric_weight_based_protocols',
    justification: 'benefits_must_outweigh_radiation_risk_consider_alternative_us_or_mri',
    alara_applied: true,
    citations: CITATIONS,
  };
}

function exam_choice(req) {
  ensureStr(req.suspected, 'suspected'); // intracranial | pulmonary | abdominal | appendicitis | fracture
  ensureNumber(req.age_years, 'age_years');

  let first_line;
  if (req.suspected === 'intracranial') first_line = req.age_years < 2 ? 'mri_preferred_or_us_first' : 'ct_head_preferred';
  else if (req.suspected === 'pulmonary') first_line = 'cxr_first_then_ct_if_needed';
  else if (req.suspected === 'abdominal' || req.suspected === 'appendicitis') first_line = req.age_years < 5 ? 'us_preferred' : 'ct_if_us_equivocal';
  else first_line = 'plain_xray_then_ct_for_complex_fractures';
  return {
    first_line,
    avoid: req.suspected === 'appendicitis' ? 'delayed_imaging_consider_serial_us' : 'no_specific_avoidance',
    sedation: req.age_years < 6 && req.suspected === 'intracranial' ? 'consider_pediatric_anesthesia_consult_for_mri' : 'no_sedation',
    citations: CITATIONS,
  };
}

module.exports = { dose, exam_choice, CITATIONS, ValidationError };