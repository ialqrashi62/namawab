'use strict';
// TIER4_NEURO_EXT-101: Seizure classification and management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ILAE_2017', 'AAN_Seizure_2018'];

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
  ensureBool(req.loss_of_consciousness, 'loss_of_consciousness');
  ensureBool(req.tonic_clonic_motor, 'tonic_clonic_motor');
  ensureBool(req.automatisms, 'automatisms');
  ensureBool(req.focal_onset, 'focal_onset');
  ensureBool(req.focal_impaired_awareness, 'focal_impaired_awareness');
  ensureBool(req.no_motor_manifestations, 'no_motor_manifestations');
  ensureNumber(req.duration_seconds, 'duration_seconds');
  ensureBool(req.postictal_confusion, 'postictal_confusion');
  ensureBool(req.status_epilepticus, 'status_epilepticus');

  let type;
  if (req.status_epilepticus) type = 'status_epilepticus';
  else if (req.focal_onset && req.tonic_clonic_motor) type = 'focal_to_bilateral_tonic_clonic';
  else if (req.focal_onset && req.focal_impaired_awareness) type = 'focal_impaired_awareness';
  else if (req.focal_onset && req.no_motor_manifestations) type = 'focal_aware_no_motor';
  else if (!req.focal_onset && req.tonic_clonic_motor && req.loss_of_consciousness) type = 'generalized_tonic_clonic';
  else if (!req.focal_onset && req.automatisms) type = 'generalized_absence';
  else type = 'unclassified';

  return {
    type,
    focal_onset: req.focal_onset,
    duration_seconds: req.duration_seconds,
    loss_of_consciousness: req.loss_of_consciousness,
    status_epilepticus: req.status_epilepticus,
    workup: req.focal_onset ? ['mri_brain', 'eeg', 'labs'] : ['eeg', 'labs'],
    citations: CITATIONS,
  };
}

function manage(req) {
  ensureStr(req.type, 'type');
  ensureBool(req.first_seizure, 'first_seizure');
  ensureBool(req.focal_onset, 'focal_onset');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.hepatic, 'hepatic');
  ensureBool(req.renal, 'renal');

  const treatment = req.type === 'status_epilepticus' ? 'lorazepam_then_fosphenytoin_or_levetiracetam_or_valproate' :
    req.focal_onset ? 'levetiracetam_or_lamotrigine_or_lacosamide' :
      req.pregnant ? 'levetiracetam_safe_in_pregnancy' :
        'ethosuximide_for_absence_or_valproate_or_lamotrigine_or_levetiracetam';

  const avoid = [];
  if (req.pregnant) avoid.push('avoid_valproate_phenytoin_topiramate');
  if (req.hepatic) avoid.push('avoid_valproate_carbamazepine_phenytoin');
  if (req.renal) avoid.push('dose_adjustment_of_levetiracetam');

  return {
    treatment,
    avoid,
    first_seizure_no_treatment: req.first_seizure,
    driving_restriction: 'per_local_law_typically_3_6_months_seizure_free',
    citations: CITATIONS,
  };
}

module.exports = { classify, manage, CITATIONS, ValidationError };