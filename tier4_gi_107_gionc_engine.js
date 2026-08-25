'use strict';
// TIER4_GI-107 GI Oncology
const CITATIONS = [
  { id: 'NCCN-CRC-2024', source: 'NCCN Colorectal Cancer', year: 2024 },
  { id: 'NCCN-Gastric-2024', source: 'NCCN Gastric Cancer', year: 2024 }
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
function crcStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const t = ensureNumber(input, 't_stage', 1, 4);
  const n = ensureNumber(input, 'n_stage', 0, 2);
  const m = ensureNumber(input, 'm_stage', 0, 1);
  const msi = ensureEnum(input, 'msi_status', ['mss', 'msi_l', 'msi_h', 'pending']);
  const ras = ensureEnum(input, 'ras', ['wild', 'mutated', 'unknown', 'pending']);
  const stage = (m === 1) ? 'stage_4' : (t >= 3 || n >= 1) ? 'stage_3' : 'stage_1_to_2';
  const therapy = (stage === 'stage_4') ? 'systemic_chemo_targeted_immunotherapy' :
    (stage === 'stage_3') ? 'surgery_then_adjuvant_chemo' : 'surgery_consider_organ_preservation';
  const msi_h_role = (msi === 'msi_h') ? 'consider_neoadjuvant_pembro' : 'continued_review';
  return {
    module: 'tier4_gi_107_crc',
    patient_id: patientId,
    t,
    n,
    m,
    msi,
    ras,
    stage,
    therapy,
    msi_h_role,
    monitoring: 'q3mo_cea_q1y_ct_q1y_colonoscopy',
    citations: CITATIONS
  };
}
function gastricCancer(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const location = ensureEnum(input, 'location', ['proximal', 'body', 'distal', 'gej', 'linitis_plastica']);
  const typ = ensureEnum(input, 'lauren', ['intestinal', 'diffuse', 'mixed']);
  const her2 = ensureEnum(input, 'her2', ['positive', 'negative', 'pending']);
  const ctdna = ensureEnum(input, 'ctdna', ['positive', 'negative', 'pending']);
  const therapy = (typ === 'intestinal') ? 'oxaliplatin_5fu_capecitabine_then_surgery' :
    (typ === 'diffuse') ? 'capecitabine_oxaliplatin_trastuzumab_if_her2' :
    'multi_modality_per_tumor_board';
  return {
    module: 'tier4_gi_107_gastric',
    patient_id: patientId,
    location,
    lauren: typ,
    her2,
    ctdna,
    therapy,
    monitoring: 'q3mo_endoscopic_q6mo_ct',
    citations: CITATIONS
  };
}
function hccSurveillance(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stage = ensureEnum(input, 'bc_stage', ['0', 'A', 'B', 'C', 'D']);
  const cp = ensureEnum(input, 'child_pugh', ['A', 'B', 'C']);
  const mvi = input.macrovascular_invasion === true;
  const afp = ensureNumber(input, 'afp_ng_ml', 0, 1000000);
  const therapy = (stage === '0' || stage === 'A_same_Milan') ? 'resection_or_liver_transplant' :
    (stage === 'A' || stage === 'B') ? 'ablation_or_resection' :
    (stage === 'C' || mvi) ? 'transarterial_chemo_then_systemic' :
    'systemic_lenvatinib_or_atezolizumab_bevacizumab';
  return {
    module: 'tier4_gi_107_hcc',
    patient_id: patientId,
    bclc_stage: stage,
    child_pugh: cp,
    mvi,
    afp,
    therapy,
    monitoring: 'q3mo_imaging_afp',
    citations: CITATIONS
  };
}
module.exports = {
  crcStaging,
  gastricCancer,
  hccSurveillance,
  CITATIONS,
  ValidationError
};
