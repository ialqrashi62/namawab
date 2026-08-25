// filepath: tier5_dental_ext_105_oral_engine.js
// TIER5_DENTAL_EXT-105: Oral surgery
'use strict';

const CITATIONS = [
  'AAOMS_Parameters_of_Care_2023',
  'Bali_Anesthesia_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function extraction(req) {
  ensureStr(req.tooth_number_fdi, 'tooth_number_fdi');
  ensureBool(req.non_restorable, 'non_restorable');
  ensureBool(req.periodontally_hopeless, 'periodontally_hopeless');
  ensureNumber(req.root_length_remaining_mm, 'root_length_remaining_mm');
  ensureBool(req.surgical_extraction_required, 'surgical_extraction_required');

  let decision;
  if (!req.non_restorable && !req.periodontally_hopeless) decision = 'continue_with_retain_tooth_review';
  else if (req.root_length_remaining_mm < 8) decision = 'continue_with_review_then_implant';
  else if (req.surgical_extraction_required) decision = 'continue_with_surgical_extraction_review';
  else decision = 'continue_with_simple_extraction_review';
  return { decision };
}

function impacted_third_molar(req) {
  ensureStr(req.pell_gregory_class, 'pell_gregory_class');
  ensureEnum(req.pell_gregory_class, 'pell_gregory_class', ['class_1_high','class_2_medial','class_3_low_impacted','class_a_distal','class_b_mesial','class_c_horizontal']);
  ensureNumber(req.age, 'age');
  ensureBool(req.pericoronitis_present, 'pericoronitis_present');
  ensureBool(req.pathology_associated, 'pathology_associated');

  let plan;
  if (req.pathology_associated) plan = 'continue_with_surgical_removal';
  else if (req.pericoronitis_present) plan = 'continue_with_surgical_extraction_review';
  else if (req.age >= 35) plan = 'continue_with_risk_assessment_then_review';
  else if (req.pell_gregory_class === 'class_c_horizontal') plan = 'continue_with_surgical_extraction_review';
  else plan = 'continue_with_review_then_monitor';
  return { plan };
}

function biopsy(req) {
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['tongue','buccal_mucosa','floor_of_mouth','palate','gingiva','lip','salivary_gland_region','lymph_node']);
  ensureNumber(req.lesion_size_mm, 'lesion_size_mm');
  ensureBool(req.ulceration_present, 'ulceration_present');
  ensureBool(req.induration_present, 'induration_present');
  ensureBool(req.duration_over_2_weeks, 'duration_over_2_weeks');

  let recommendation;
  if (req.lesion_size_mm >= 10 && (req.ulceration_present || req.induration_present)) recommendation = 'urgent_biopsy_then_continue';
  else if (req.duration_over_2_weeks) recommendation = 'continue_with_biopsy_review';
  else if (req.site === 'floor_of_mouth' && req.ulceration_present) recommendation = 'continue_with_biopsy_review';
  else recommendation = 'continue_with_review';
  return { recommendation };
}

function facial_trauma(req) {
  ensureStr(req.fracture_site, 'fracture_site');
  ensureEnum(req.fracture_site, 'fracture_site', ['mandibular_body','mandibular_angle','condyle','maxilla_lefort_i','maxilla_lefort_ii','maxilla_lefort_iii','zygoma','orbital_floor','nasal']);
  ensureBool(req.open_reduction_planned, 'open_reduction_planned');
  ensureBool(req.maxillomandibular_fixation, 'maxillomandibular_fixation');
  ensureNumber(req.hours_since_trauma, 'hours_since_trauma');

  let plan;
  if (req.open_reduction_planned && req.maxillomandibular_fixation) plan = 'continue_with_orif_with_mm_fixation_review';
  else if (req.maxillomandibular_fixation) plan = 'continue_with_closed_reduction_then_mm_fixation';
  else if (req.hours_since_trauma <= 24 && req.fracture_site === 'condyle') plan = 'continue_with_conservative_review';
  else plan = 'continue_with_review';
  return { plan };
}

function orthognathic_surgery(req) {
  ensureBool(req.skeletal_discrepancy_confirmed, 'skeletal_discrepancy_confirmed');
  ensureNumber(req.age, 'age');
  ensureBool(req.growth_complete, 'growth_complete');
  ensureStr(req.procedure, 'procedure');
  ensureEnum(req.procedure, 'procedure', ['lefort_i_maxillary_advancement','lefort_i_impaction','bilateral_sagittal_split','genio_plasty','segmental_maxillary','mandibular_setback']);
  ensureBool(req.presurgical_orthodontics_done, 'presurgical_orthodontics_done');

  let recommendation;
  if (!req.growth_complete) recommendation = 'continue_with_review_then_defer';
  else if (!req.presurgical_orthodontics_done) recommendation = 'continue_with_orthodontic_preparation_review';
  else if (req.skeletal_discrepancy_confirmed) recommendation = 'continue_with_orthognathic_surgery_review';
  else recommendation = 'continue_with_review';
  return { recommendation };
}

function distraction(req) {
  ensureBool(req.alveolar_ridge_height_required, 'alveolar_ridge_height_required');
  ensureNumber(req.required_height_increase_mm, 'required_height_increase_mm');
  ensureBool(req.mandibular_distraction_planned, 'mandibular_distraction_planned');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.consolidation_period_adequate, 'consolidation_period_adequate');

  let plan;
  if (req.required_height_increase_mm >= 5 && req.mandibular_distraction_planned) plan = 'continue_with_distraction_review';
  else if (req.alveolar_ridge_height_required && req.consolidation_period_adequate === false) plan = 'continue_with_consolidation_review';
  else if (req.smoker) plan = 'continue_with_smoking_cessation_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { extraction, impacted_third_molar, biopsy, facial_trauma, orthognathic_surgery, distraction }; }
module.exports = { funcs, CITATIONS, ValidationError };
