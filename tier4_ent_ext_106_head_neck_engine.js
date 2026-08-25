'use strict';
// TIER4_ENT_EXT-106 Head & Neck Cancer
const CITATIONS = ['NCCN_Head_Neck_Cancer','AHNS_Guidelines'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function neckMassWorkup(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const duration_weeks = ensureNumber(input.duration_weeks, 'duration_weeks');
  const smoker = !!input.smoker;
  const hpv_associated = !!input.hpv_associated;
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  let suspicion = 'low';
  if (smoker && duration_weeks >= 3) suspicion = 'high_suspicion_malignancy';
  else if (duration_weeks >= 2 || hpv_associated) suspicion = 'moderate';
  return { duration_weeks, smoker, hpv_associated, size_cm, suspicion, workup: ['fna_biopsy','ct_neck_with_contrast','hpv_p16_testing_if_tonsil_base_of_tongue'], citations: CITATIONS };
}

function tonsilCancerStaging(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const t_stage = ensureEnum(input.t_stage || 't1', ['t1','t2','t3','t4a','t4b'], 't_stage');
  const n_stage = ensureEnum(input.n_stage || 'n0', ['n0','n1','n2a','n2b','n2c','n3'], 'n_stage');
  const m_stage = ensureEnum(input.m_stage || 'm0', ['m0','m1'], 'm_stage');
  const hpv_positive = !!input.hpv_positive;
  let overall_stage = 'stage_i';
  if (t_stage === 't3' || t_stage === 't4a') overall_stage = hpv_positive ? 'stage_ii_iii' : 'stage_iii_iva';
  if (t_stage === 't4b' || m_stage === 'm1') overall_stage = 'stage_ivb_or_ivc';
  return { t_stage, n_stage, m_stage, hpv_positive, overall_stage, citations: CITATIONS };
}

module.exports = { neckMassWorkup, tonsilCancerStaging, CITATIONS, ValidationError };