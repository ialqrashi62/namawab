'use strict';
// TIER4_OPHTH_EXT-101: Cataract - severity + surgery timing
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAO_Cataract_2016', 'AAO_Peds_Cataract'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function assess(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.visual_acuity, 'visual_acuity');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.steroid_use, 'steroid_use');
  ensureBool(req.symptoms_glare, 'symptoms_glare');
  ensureBool(req.symptoms_decreased_vision, 'symptoms_decreased_vision');
  ensureBool(req.trauma, 'trauma');
  ensureBool(req.congenital, 'congenital');
  ensureBool(req.driver, 'driver');

  const severity = req.visual_acuity >= 1 ? 'severe' : req.visual_acuity >= 0.5 ? 'moderate' : 'mild';
  let surgery_indicated;
  if (req.congenital) surgery_indicated = 'urgent_to_prevent_amblyopia';
  else if (req.trauma) surgery_indicated = 'urgent_trauma';
  else if (req.driver && req.visual_acuity >= 0.5) surgery_indicated = 'high_priority_for_function';
  else if (req.symptoms_glare || req.symptoms_decreased_vision) surgery_indicated = 'consider_surgery_per_functional_impact';
  else surgery_indicated = 'observe_q6_months';
  return {
    age: req.age,
    severity,
    surgery_indicated,
    visual_acuity: req.visual_acuity,
    symptomatic: req.symptoms_glare || req.symptoms_decreased_vision,
    secondary_cause: req.diabetes || req.steroid_use || req.trauma || req.congenital,
    citations: CITATIONS,
  };
}

function surgical(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.glaucoma, 'glaucoma');
  ensureBool(req.uveitis, 'uveitis');
  ensureBool(req.anti_platelet, 'anti_platelet');
  ensureBool(req.anti_coag, 'anti_coag');
  ensureBool(req.cardiac_stent, 'cardiac_stent');

  const iol_choice = req.diabetes ? 'monofocal_iol' : req.glaucoma ? 'monofocal_iol' : req.uveitis ? 'monofocal_iol' : 'toric_if_astigmatism_present_or_multifocal';
  const stop_anti = req.anti_platelet ? 'continue_aspirin_for_stroke_history_stop_clopidogrel_5_7_days' :
    req.anti_coag && req.cardiac_stent ? 'continue_anticoagulation_per_cardiologist' :
      'standard_preop_protocol';
  return {
    surgery_type: 'phacoemulsification_with_iol_implant',
    iol_choice,
    stop_anti,
    preop: ['iol_master_biometry', 'specular_microscopy', 'topography'],
    postop: ['antibiotic_steroid_drops', 'followup_q1_day_1_week_1_month'],
    citations: CITATIONS,
  };
}

module.exports = { assess, surgical, CITATIONS, ValidationError };