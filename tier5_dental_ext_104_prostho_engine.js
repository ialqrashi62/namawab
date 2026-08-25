// filepath: tier5_dental_ext_104_prostho_engine.js
// TIER5_DENTAL_EXT-104: Prosthodontics
'use strict';

const CITATIONS = [
  'ACP_Prosthodontic_Guidelines_2023',
  'ITI_Implant_2022',
  'McCracken_RPD_Principles',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function fpd(req) {
  ensureStr(req.span, 'span');
  ensureEnum(req.span, 'span', ['single_unit','two_unit','three_unit','long_span_more_than_three','cantilever']);
  ensureBool(req.anterior_location, 'anterior_location');
  ensureBool(req.molar_location, 'molar_location');
  ensureBool(req.implant_vs_natural_abutment, 'implant_vs_natural_abutment');
  ensureNumber(req.cantilever_distance_mm, 'cantilever_distance_mm');

  let recommendation;
  if (req.span === 'long_span_more_than_three' && req.molar_location) recommendation = 'continue_with_implant_review';
  else if (req.span === 'cantilever' && req.cantilever_distance_mm > 12) recommendation = 'continue_with_review_then_shorten';
  else if (req.span === 'single_unit' && req.implant_vs_natural_abutment) recommendation = 'continue_with_implant_crown';
  else recommendation = 'continue_with_fpd_review';
  return { recommendation };
}

function rpd(req) {
  ensureNumber(req.remaining_teeth_count, 'remaining_teeth_count');
  ensureStr(req.kennedy_class, 'kennedy_class');
  ensureEnum(req.kennedy_class, 'kennedy_class', ['class_i_bilateral_posterior','class_ii_unilateral_posterior','class_iii_unilateral_edentulous','class_iv_anterior_edentulous']);
  ensureBool(req.acrylic_or_cast_metal, 'acrylic_or_cast_metal');
  ensureBool(req.clasp_designed, 'clasp_designed');

  let plan;
  if (req.remaining_teeth_count < 6) plan = 'continue_with_complete_denture_review';
  else if (req.kennedy_class === 'class_iii_unilateral_edentulous' && req.acrylic_or_cast_metal === false) plan = 'continue_with_cobalt_chromium_review';
  else if (req.kennedy_class === 'class_i_bilateral_posterior') plan = 'continue_with_cobalt_chromium_review';
  else plan = 'continue_with_standard_rpd_review';
  if (!req.clasp_designed) plan += '_design_clasp';
  return { plan };
}

function complete_denture(req) {
  ensureBool(req.edentulous_maxilla, 'edentulous_maxilla');
  ensureBool(req.edentulous_mandible, 'edentulous_mandible');
  ensureNumber(req.residual_ridge_height_mm, 'residual_ridge_height_mm');
  ensureBool(req.adequate_denture_base, 'adequate_denture_base');
  ensureBool(req.soft_relining_planned, 'soft_relining_planned');
  ensureNumber(req.patient_age, 'patient_age');

  let recommendation;
  if (req.residual_ridge_height_mm < 10) recommendation = 'continue_with_implant_overdenture_review';
  else if (req.soft_relining_planned) recommendation = 'continue_with_soft_reline_review';
  else if (req.patient_age >= 75) recommendation = 'continue_with_easy_grip_denture_review';
  else recommendation = 'continue_with_standard_denture_review';
  return { recommendation };
}

function implant_overdenture(req) {
  ensureBool(req.mandibular_overdenture_planned, 'mandibular_overdenture_planned');
  ensureNumber(req.implant_count, 'implant_count');
  ensureBool(req.bar_attachment, 'bar_attachment');
  ensureBool(req.locator_attachment, 'locator_attachment');
  ensureNumber(req.residual_ridge_height_mm, 'residual_ridge_height_mm');

  let plan;
  if (req.implant_count >= 4 && req.bar_attachment) plan = 'continue_with_bar_review';
  else if (req.implant_count === 2 && req.locator_attachment) plan = 'continue_with_locator_review';
  else if (req.implant_count < 2) plan = 'consider_additional_implant_then_continue';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function all_on_four(req) {
  ensureBool(req.edentulous_or_soon_to_be, 'edentulous_or_soon_to_be');
  ensureNumber(req.bone_height_mm, 'bone_height_mm');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.diabetic_uncontrolled, 'diabetic_uncontrolled');
  ensureNumber(req.opposing_dentition, 'opposing_dentition'); // 1 dentate, 0 edentulous

  let decision;
  if (!req.edentulous_or_soon_to_be) decision = 'continue_with_partial_review';
  else if (req.smoker || req.diabetic_uncontrolled) decision = 'continue_with_review_then_medical_optimization';
  else if (req.bone_height_mm < 8) decision = 'consider_zygomatic_or_bone_graft_review';
  else decision = 'continue_with_all_on_4_protocol';
  return { decision };
}

function maxillofacial_prosth(req) {
  ensureStr(req.defect_type, 'defect_type');
  ensureEnum(req.defect_type, 'defect_type', ['palatal_obturator','orbital','nasal','auricular','mandibular_resection','cranioplasty_combined']);
  ensureBool(req.malignancy_related, 'malignancy_related');
  ensureBool(req.implant_retained, 'implant_retained');
  ensureNumber(req.healing_completed_months, 'healing_completed_months');

  let plan;
  if (req.malignancy_related && req.healing_completed_months < 6) plan = 'continue_with_post_surgical_review';
  else if (req.implant_retained && req.defect_type === 'orbital') plan = 'continue_with_implant_retained_orbital';
  else if (req.defect_type === 'palatal_obturator') plan = 'continue_with_obturator_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { fpd, rpd, complete_denture, implant_overdenture, all_on_four, maxillofacial_prosth }; }
module.exports = { funcs, CITATIONS, ValidationError };
