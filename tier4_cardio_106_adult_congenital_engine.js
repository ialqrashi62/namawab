'use strict';
// TIER4_CARDIO-106 Adult Congenital Heart Disease
const CITATIONS = [
  { id: 'AHA-ACHD-2024', source: 'AHA Adult Congenital Heart Disease', year: 2024 }
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
function achdEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const diagnosis = ensureEnum(input, 'achd_diagnosis', ['toF_repaired', 'tga_repaired', 'single_ventricle_fontan', 'cc_tga', 'asd', 'vsd', 'pda', 'ebstein', 'other', 'unknown']);
  const previous_repair = input.previous_repair === true;
  const residual_defect = input.residual_defect === true;
  const nyha = ensureNumber(input, 'nyha_class', 1, 4);
  const sp02 = ensureNumber(input, 'resting_o2_sat', 0, 100);
  const pregnancy = input.pregnant === true;
  return {
    module: 'tier4_cardio_106_achd',
    patient_id: patientId,
    diagnosis,
    previous_repair,
    residual_defect,
    nyha,
    rest_o2_sat: sp02,
    pregnancy_status: pregnancy,
    monitoring: 'achd_center_q1y_with_advanced_imaging',
    deliver_ob: previous_repair && pregnancy ? 'high_risk_ob_achd_center' : 'standard',
    citations: CITATIONS
  };
}
function fontanFollowUp(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sp02 = ensureNumber(input, 'o2_sat', 0, 100);
  const ef = ensureNumber(input, 'ventricular_ef', 0, 80);
  const ascites = input.ascites === true;
  const pleural_effusion = input.pleural_effusion === true;
  const protein_losing = ensureNumber(input, 'alpha_1_antitrypsin_clearance', 0, 100);
  const failing = (ef < 35 || ascites || pleural_effusion || sp02 < 85);
  const therapy = failing ? 'diuretic_optimization_consider_fenestration_or_transplant' : 'routine_annually';
  return {
    module: 'tier4_cardio_106_fontan',
    patient_id: patientId,
    o2_sat: sp02,
    ventricular_ef: ef,
    ascites,
    pleural_effusion,
    protein_losing: protein_losing,
    failing_fenestration: failing,
    therapy,
    monitoring: 'q6mo_echo_labs_including_alpha_1_antitrypsin',
    citations: CITATIONS
  };
}
function acyanoticLesion(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lesion = ensureEnum(input, 'lesion', ['asd', 'vsd', 'pda', 'avs', 'ps', 'pulmonary_stenosis', 'ar']);
  const qp_qs = ensureNumber(input, 'qp_qs', 0, 5);
  const symptoms = input.symptomatic === true;
  const echo = input.echo_asd_size_mm || input.echo_vsd_size_mm || input.echo_annulus_mm || 0;
  const closure = (lesion === 'asd' && (echo >= 10 || qp_qs >= 1.5 || symptoms)) ? 'transcatheter_or_surgical_closure' : 'monitor';
  return {
    module: 'tier4_cardio_106_acyanotic',
    patient_id: patientId,
    lesion,
    qp_qs,
    echo,
    closure_indicated: closure === 'monitor' ? false : true,
    therapy: closure,
    citations: CITATIONS
  };
}
module.exports = {
  achdEvaluation,
  fontanFollowUp,
  acyanoticLesion,
  CITATIONS,
  ValidationError
};
