'use strict';
// TIER4_RAD_EXT2-104: MSK - fracture + effusion + dislocation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAOS_MSK_2018', 'ACR_MSK_2019'];

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

function fracture(req) {
  ensureStr(req.location, 'location'); // wrist | hip | ankle | vertebra | long_bone
  ensureBool(req.displaced, 'displaced');
  ensureBool(req.open, 'open');
  ensureNumber(req.age, 'age');
  ensureBool(req.neurovascular_compromise, 'neurovascular_compromise');

  let classification;
  if (req.open) classification = 'open_fracture_orthopedic_emergency';
  else if (req.neurovascular_compromise) classification = 'fracture_with_neurovascular_compromise_emergent';
  else if (req.displaced) classification = 'displaced_fracture_reduction_required';
  else if (req.location === 'hip') classification = 'hip_fracture_admit_surgical';
  else if (req.location === 'vertebra' && req.age >= 65) classification = 'compression_fracture_evaluate_surgical';
  else classification = 'non_displaced_cast_or_splint';
  return {
    location: req.location,
    classification,
    imaging: 'plain_xray_2_views_plus_orthogonal_ct_if_surgical_planning',
    antibiotics: req.open ? 'iv_antibiotics_within_1h' : 'pre_op_only',
    surgical_consult: classification.startsWith('open') || classification.startsWith('fracture_with') || classification.startsWith('displaced') || classification.startsWith('hip') || classification.startsWith('compression') ? 'urgent' : 'routine',
    follow_up: 'xray_q7_10_days_for_displacement_check',
    citations: CITATIONS,
  };
}

function joint_effusion(req) {
  ensureBool(req.traumautic_effusion, 'traumautic_effusion');
  ensureBool(req.hemarthrosis, 'hemarthrosis');
  ensureBool(req.septic, 'septic');
  ensureNumber(req.fluid_volume_ml, 'fluid_volume_ml');

  let recommendation;
  if (req.septic) recommendation = 'emergent_aspiration_gram_stain_culture_cell_count_then_iv_abx';
  else if (req.hemarthrosis) recommendation = 'aspiration_with_hemophilia_protocol_if_known_then_imaging';
  else if (req.traumautic_effusion && req.fluid_volume_ml >= 50) recommendation = 'aspiration_for_symptom_control_then_imaging_mri_for_internal_derangement';
  else recommendation = 'observation_with_serial_exams_imaging_per_clinical_judgment';
  return {
    recommendation,
    septic_workup: req.septic ? 'synovial_wbc_50k_or_pmn_70_percent_implies_septic' : 'no_septic_workup',
    imaging: req.traumautic_effusion ? 'mri_within_2_weeks_if_persistent' : 'xray_first',
    citations: CITATIONS,
  };
}

module.exports = { fracture, joint_effusion, CITATIONS, ValidationError };