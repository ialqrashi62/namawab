'use strict';
// TIER4_ONC-107 Lung Cancer
const CITATIONS = [
  { id: 'NCCN-NSCLC-2024', source: 'NCCN NSCLC', year: 2024 },
  { id: 'NCCN-SCLC-2024', source: 'NCCN SCLC', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function nsclcStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const t = ensureNumber(input, 't_stage', 1, 4);
  const n = ensureNumber(input, 'n_stage', 0, 3);
  const m = ensureNumber(input, 'm_stage', 0, 1);
  const driver = ensureEnum(input, 'driver_mutation', ['egfr', 'alk', 'ros1', 'braf', 'kras_g12c', 'met', 'ret', 'ntrk', 'none', 'pending']);
  const pdl1 = ensureEnum(input, 'pdl1_tps', ['lt_1', '1_to_49', 'gte_50', 'unknown', 'pending']);
  const stage = (m === 1) ? 'stage_4' : (t === 4 || n === 3) ? 'stage_3' : (t <= 2 && n <= 1) ? 'stage_1_to_2' : 'stage_3';
  const therapy = (m === 1 && driver !== 'none' && driver !== 'pending') ? `tki_for_${driver}_first_line` :
    (m === 1 && pdl1 === 'gte_50') ? 'pembrolizumab_monotherapy_or_with_chemo' :
    (m === 1) ? 'platinum_pemetrexed_pembrolizumab' :
    (stage === 'stage_3') ? 'concurrent_chemo_rt_then_io_consolidation' :
    'surgery_then_adjuvant_consider_chemo_or_io';
  return {
    module: 'tier4_onc_107_nsclc',
    patient_id: patientId,
    t,
    n,
    m,
    driver_mutation: driver,
    pdl1_tps: pdl1,
    stage,
    therapy,
    monitoring: 'q3mo_imaging_q3mo_labs_q1y_consider_brain_mri',
    citations: CITATIONS
  };
}
function sclc(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stage = ensureEnum(input, 'stage', ['limited', 'extensive', 'very_limited']);
  const brain_mets = input.brain_metastases === true;
  const ps = ensureEnum(input, 'performance_status', ['0', '1', '2', '3', '4']);
  const therapy = (stage === 'extensive' && ps !== '3' && ps !== '4') ? 'platinum_etoposide_pembro_then_review' :
    (stage === 'limited' && ps !== '3' && ps !== '4') ? 'concurrent_chemo_rt_then_pci_review' :
    'supportive_care_only';
  return {
    module: 'tier4_onc_107_sclc',
    patient_id: patientId,
    stage,
    brain_metastases: brain_mets,
    performance_status: ps,
    therapy,
    monitoring: 'q2cycle_imaging_q3mo_post',
    citations: CITATIONS
  };
}
module.exports = {
  nsclcStaging,
  sclc,
  CITATIONS,
  ValidationError
};