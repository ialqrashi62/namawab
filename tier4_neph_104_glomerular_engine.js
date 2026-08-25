'use strict';
// TIER4_NEPH-104 Glomerular Disease
const CITATIONS = [
  { id: 'KDIGO-GN-2024', source: 'KDIGO Glomerular Diseases', year: 2024 }
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
function nephroticSyndrome(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const proteinuria = ensureNumber(input, 'proteinuria_g_24h', 0, 50);
  const albumin = ensureNumber(input, 'serum_albumin', 0, 6);
  const edema = input.edema === true;
  const dyslipidemia = input.dyslipidemia === true;
  const syndrome = (proteinuria >= 3.5 && albumin <= 3.0 && edema) ? 'nephrotic' : 'not_nephrotic';
  const workup = (syndrome === 'nephrotic') ? 'serology_anena_screen_then_renal_biopsy_if_appropriate' : 'proteinuria_workup';
  const therapy = (syndrome === 'nephrotic') ? 'ace_inhibitor_diuretic_statins_then_immunosuppression_per_biopsy' : 'cause_specific_therapy';
  return {
    module: 'tier4_neph_104_ns',
    patient_id: patientId,
    proteinuria_g_24h: proteinuria,
    serum_albumin: albumin,
    edema,
    dyslipidemia,
    syndrome,
    workup,
    therapy,
    citations: CITATIONS
  };
}
function rapidProgressiveGn(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const gfr_drop = ensureNumber(input, 'gfr_drop_pct', 0, 100);
  const hematuria = input.dysmorphic_hematuria === true;
  const active_urine = input.active_urinary_sediment === true;
  const rpgn = (gfr_drop >= 30 && hematuria && active_urine) ? 'rpgn_likely' :
    (gfr_drop >= 20) ? 'rpgn_possible' : 'not_rpgn';
  const plan = (rpgn === 'rpgn_likely') ? 'urgent_anena_screen_renal_biopsy_within_2wk' :
    (rpgn === 'rpgn_possible') ? 'expedited_workup_biopsy_within_4wk' : 'standard_workup';
  return {
    module: 'tier4_neph_104_rpgn',
    patient_id: patientId,
    gfr_drop_pct: gfr_drop,
    dysmorphic_hematuria: hematuria,
    active_urinary_sediment: active_urine,
    classification: rpgn,
    plan,
    citations: CITATIONS
  };
}
module.exports = {
  nephroticSyndrome,
  rapidProgressiveGn,
  CITATIONS,
  ValidationError
};