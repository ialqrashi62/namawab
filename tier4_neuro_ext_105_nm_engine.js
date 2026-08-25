'use strict';
// TIER4_NEURO_EXT-105: NM - MG, GBS, CIDP, polymyositis
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAN_MG_2020', 'AAN_GBS_2019', 'EFNS_CIDP_2021'];

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

function mg(req) {
  ensureBool(req.ocular_ptosis_or_diploia, 'ocular_ptosis_or_diploia');
  ensureBool(req.fatigability, 'fatigability');
  ensureNumber(req.repetitive_stimulation_decrement, 'repetitive_stimulation_decrement');
  ensureBool(req.achr_positive, 'achr_positive');
  ensureBool(req.musk_positive, 'musk_positive');
  ensureBool(req.thymoma, 'thymoma');
  ensureBool(req.myasthenic_crisis, 'myasthenic_crisis');
  ensureNumber(req.vital_capacity, 'vital_capacity');

  const ocular_only = req.ocular_ptosis_or_diploia && !req.fatigability;
  const generalized = req.ocular_ptosis_or_diploia && req.fatigability;
  const crisis = req.myasthenic_crisis || req.vital_capacity < 20;
  const treatment = crisis ? 'urgent_icu_ivig_or_plasmapheresis' :
    req.achr_positive ? 'pyridostigmine_plus_steroids_thymectomy_evaluation' :
      req.musk_positive ? 'pyridostigmine_avoid_d_penicillamine_steroids_for_relapse' :
        'pyridostigmine_then_immunosuppression';
  return {
    subtype: crisis ? 'myasthenic_crisis' : generalized ? 'generalized' : ocular_only ? 'ocular' : 'uncertain',
    achr_positive: req.achr_positive,
    musk_positive: req.musk_positive,
    treatment,
    monitoring: ['vital_capacity_q4h', 'edx_studies', 'repetitive_stimulation'],
    citations: CITATIONS,
  };
}

function gbs(req) {
  ensureBool(req.ascending_paralysis, 'ascending_paralysis');
  ensureNumber(req.onset_days, 'onset_days');
  ensureBool(req.areflexia, 'areflexia');
  ensureBool(req.recent_infection, 'recent_infection');
  ensureBool(req.campylobacter, 'campylobacter');
  ensureNumber(req.nerve_conduction_velocity, 'nerve_conduction_velocity');
  ensureBool(req.ventilator_required, 'ventilator_required');
  ensureNumber(req.albuminocytologic_dissociation, 'albuminocytologic_dissociation');

  const gbs_likely = req.ascending_paralysis && req.areflexia && req.onset_days <= 28;
  const treatment = gbs_likely ? 'ivig_or_plasmapheresis_within_4_weeks' : 'alternate_diagnosis';
  const variant = req.campylobacter ? 'AMAN_variant_likely' : 'AIDP_likely';
  return {
    gbs_likely,
    variant,
    treatment,
    ventilator_required: req.ventilator_required,
    monitoring: ['vital_capacity_q4h', 'swallowing_assessment', 'autonomic_monitoring'],
    citations: CITATIONS,
  };
}

function cidp(req) {
  ensureBool(req.chronic_progressive_symmetric, 'chronic_progressive_symmetric');
  ensureNumber(req.duration_months, 'duration_months');
  ensureBool(req.sensory_loss, 'sensory_loss');
  ensureNumber(req.ncv_demyelinating, 'ncv_demyelinating');
  ensureBool(req.csf_high_protein, 'csf_high_protein');

  const cidp_likely = req.chronic_progressive_symmetric && req.duration_months >= 8 && req.ncv_demyelinating && req.csf_high_protein;
  const treatment = cidp_likely ? 'ivig_or_steroids_or_immunosuppressants' : 'reassess_ncv_and_exclude_other_causes';
  return {
    cidp_likely,
    treatment,
    monitoring: ['ncv_q3_6_months', 'clinical_assessment_for_relapse'],
    citations: CITATIONS,
  };
}

module.exports = { mg, gbs, cidp, CITATIONS, ValidationError };