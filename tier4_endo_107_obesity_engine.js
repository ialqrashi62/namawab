'use strict';
// TIER4_ENDO-107 Obesity & Bariatric
const CITATIONS = [
  { id: 'Obesity-Society-2024', source: 'Obesity Society Guidelines', year: 2024 }
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
function obesityClassTherapy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bmi = ensureNumber(input, 'bmi', 0, 100);
  const comorbidity = input.comorbidity === true;
  const prior_attempt = input.prior_lifestyle_failure === true;
  const cls = (bmi < 25) ? 'underweight' :
    (bmi < 30) ? 'overweight' :
    (bmi < 35) ? 'obesity_1' :
    (bmi < 40) ? 'obesity_2' : 'obesity_3';
  const therapy = (cls === 'underweight') ? 'workup_malnutrition' :
    (cls === 'overweight') ? 'lifestyle_diet_exercise' :
    (cls === 'obesity_1' && comorbidity) ? 'lifestyle_then_glp1_agonist' :
    (cls === 'obesity_2' || (cls === 'obesity_1' && prior_attempt)) ? 'glp1_agonist_then_assess' :
    (cls === 'obesity_3') ? 'glp1_agonist_then_bariatric_evaluation' :
    'lifestyle_diet_exercise_q3mo';
  return {
    module: 'tier4_endo_107_class',
    patient_id: patientId,
    bmi,
    comorbidity,
    prior_lifestyle_failure: prior_attempt,
    classification: cls,
    therapy,
    monitoring: 'q1mo_weights_q3mo_labs',
    citations: CITATIONS
  };
}
function bariatricEval(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bmi = ensureNumber(input, 'bmi', 0, 100);
  const dm = input.diabetes === true;
  const htn = input.htn === true;
  const osa = input.osa === true;
  const cv = input.cardiovascular_disease === true;
  const candidate = (bmi >= 40 || (bmi >= 35 && (dm || htn || osa || cv)));
  const procedure = (bmi >= 50 && dm) ? 'rygb_preferred' :
    (dm) ? 'rygb_or_sg' :
    (candidate) ? 'sleeve_gastrectomy_then_review' : 'not_candidate';
  return {
    module: 'tier4_endo_107_bariatric',
    patient_id: patientId,
    bmi,
    diabetes: dm,
    htn,
    osa,
    cv,
    candidate,
    procedure,
    monitoring: 'pre_op_workup_post_op_q3mo_then_q1y',
    citations: CITATIONS
  };
}
module.exports = {
  obesityClassTherapy,
  bariatricEval,
  CITATIONS,
  ValidationError
};