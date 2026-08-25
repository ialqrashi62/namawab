'use strict';
// TIER4_HEM-106 Coagulopathy (DIC, Coagulopathy reversal)
const CITATIONS = [
  { id: 'ISTH-DIC-2024', source: 'ISTH DIC Guidelines', year: 2024 }
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
function dicScore(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const plt = ensureNumber(input, 'platelet_count', 0, 500);
  const d_dimer = ensureNumber(input, 'd_dimer', 0, 100);
  const fibrinogen = ensureNumber(input, 'fibrinogen_g_l', 0, 10);
  const pt_prolongation = ensureNumber(input, 'pt_prolongation_sec', 0, 100);
  let score = 0;
  if (plt >= 50 && plt <= 100) score += 1;
  else if (plt < 50) score += 2;
  if (d_dimer >= 4 && d_dimer <= 8) score += 2;
  else if (d_dimer > 8) score += 3;
  if (fibrinogen < 1 && fibrinogen >= 0.5) score += 1;
  else if (fibrinogen < 0.5) score += 2;
  if (pt_prolongation >= 3 && pt_prolongation <= 6) score += 1;
  else if (pt_prolongation > 6) score += 2;
  const stage = (score >= 5) ? 'overt_dic' : 'non_overt_dic';
  const therapy = (stage === 'overt_dic') ? 'treat_underlying_cause_then_ffp_plt_cryo_if_bleeding_then_review' : 'monitor_then_treat_underlying_then_recheck';
  return {
    module: 'tier4_hem_106_dic',
    patient_id: patientId,
    platelet_count: plt,
    d_dimer,
    fibrinogen_g_l: fibrinogen,
    pt_prolongation_sec: pt_prolongation,
    score,
    stage,
    therapy,
    monitoring: 'q4_to_6h_labs_q24h_reassess',
    citations: CITATIONS
  };
}
module.exports = {
  dicScore,
  CITATIONS,
  ValidationError
};