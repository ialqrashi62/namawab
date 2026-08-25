'use strict';
// TIER4_RHEUM-102 Systemic Lupus Erythematosus (SLE)
const CITATIONS = [
  { id: 'ACR-SLE-2024', source: 'ACR/EULAR SLE Classification', year: 2024 }
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
function sledai(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const seizure = input.seizure === true ? 8 : 0;
  const psychosis = input.psychosis === true ? 8 : 0;
  const organic_brain = input.organic_brain === true ? 8 : 0;
  const visual = input.visual === true ? 8 : 0;
  const cranial_nerve = input.cranial_nerve === true ? 8 : 0;
  const headache = input.lupus_headache === true ? 8 : 0;
  const cva = input.cva === true ? 8 : 0;
  const vasculitis = input.vasculitis === true ? 8 : 0;
  const arthritis = input.arthritis === true ? 4 : 0;
  const myositis = input.myositis === true ? 4 : 0;
  const urinary = (input.urinary_casts === true ? 4 : 0) + (input.proteinuria_g === 0.5 ? 4 : (input.proteinuria_g >= 1 ? 8 : 0));
  const hematuria = input.hematuria === true ? 4 : 0;
  const pyuria = input.pyuria === true ? 4 : 0;
  const rash = (input.rash === true ? 2 : 0) + (input.alopecia === true ? 2 : 0) + (input.mucosal === true ? 2 : 0);
  const pleurisy = input.pleurisy === true ? 2 : 0;
  const pericarditis = input.pericarditis === true ? 2 : 0;
  const low_complement = (input.low_c3 === true ? 2 : 0) + (input.low_c4 === true ? 2 : 0);
  const dna = input.anti_dsdna_pos === true ? 2 : 0;
  const fever = input.fever === true ? 1 : 0;
  const total = seizure + psychosis + organic_brain + visual + cranial_nerve + headache + cva + vasculitis +
    arthritis + myositis + urinary + hematuria + pyuria + rash + pleurisy + pericarditis + low_complement + dna + fever;
  const activity = (total === 0) ? 'remission' : (total < 6) ? 'mild' : (total < 12) ? 'moderate' : 'severe';
  return {
    module: 'tier4_rheum_102_sledai',
    patient_id: patientId,
    sledai: total,
    activity,
    monitoring: 'q3mo_sledai_q3mo_labs_q1y_renal_biopsy_per_need',
    citations: CITATIONS
  };
}
function lupusNephritis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const class_type = ensureEnum(input, 'isn_class', ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'pending']);
  const crp_high = input.creatinine_rising === true;
  const therapy = (class_type === 'iii' || class_type === 'iv') ? 'mycophenolate_or_cyclophosphamide_then_steroids_then_review' :
    (class_type === 'v') ? 'mycophenolate_or_calcineurin_inhibitor_then_review' :
    (class_type === 'vi') ? 'review_for_transplant_then_dialysis' :
    'review_hydroxychloroquine_and_observation';
  return {
    module: 'tier4_rheum_102_ln',
    patient_id: patientId,
    isn_class: class_type,
    creatinine_rising: crp_high,
    therapy,
    monitoring: 'q1mo_urine_q3mo_labs_q6mo_renal_re_biopsy_per_need',
    citations: CITATIONS
  };
}
module.exports = {
  sledai,
  lupusNephritis,
  CITATIONS,
  ValidationError
};