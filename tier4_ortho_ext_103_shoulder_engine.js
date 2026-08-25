'use strict';
// TIER4_ORTHO_EXT-103: Shoulder - rotator cuff + frozen shoulder
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAOS_Rotator_2018', 'AAOS_Frozen_2019'];

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

function rotator_cuff(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.pain_with_overhead, 'pain_with_overhead');
  ensureBool(req.weakness_abduction, 'weakness_abduction');
  ensureBool(req.weakness_external_rotation, 'weakness_external_rotation');
  ensureBool(req.drop_arm, 'drop_arm');
  ensureBool(req.full_thickness_tear_mri, 'full_thickness_tear_mri');
  ensureBool(req.acute_tear, 'acute_tear');

  const full_tear = req.full_thickness_tear_mri;
  const surgical_candidate = full_tear && (req.acute_tear || req.age < 65 && req.weakness_abduction);
  return {
    full_thickness_tear: full_tear,
    surgical_candidate,
    surgical: surgical_candidate ? 'arthroscopic_rotator_cuff_repair' : 'no_surgery',
    conservative: ['pt_8_12_weeks', 'nsaid', 'subacromial_steroid_injection', 'activity_modification'],
    citations: CITATIONS,
  };
}

function frozen_shoulder(req) {
  ensureNumber(req.duration_months, 'duration_months');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.loss_external_rotation, 'loss_external_rotation');
  ensureBool(req.no_injury, 'no_injury');
  ensureBool(req.pain_rest, 'pain_rest');
  ensureNumber(req.rom_active_abd, 'rom_active_abd');

  const stage = req.duration_months <= 6 ? 'freezing_painful' :
    req.duration_months <= 12 ? 'frozen_stiff' : 'thawing_recovery';
  return {
    stage,
    rom_active_abduction_degrees: req.rom_active_abd,
    diagnosis: req.loss_external_rotation && req.no_injury && req.pain_rest,
    treatment: stage === 'freezing_painful' ? 'nsaid_intraarticular_steroid_gentle_rom' :
      stage === 'frozen_stiff' ? 'aggressive_pt_stretching' :
        'continue_pt_maintenance_program',
    predictors_diabetes: req.diabetes,
    monitoring: 'q4_weeks_until_resolution',
    citations: CITATIONS,
  };
}

module.exports = { rotator_cuff, frozen_shoulder, CITATIONS, ValidationError };