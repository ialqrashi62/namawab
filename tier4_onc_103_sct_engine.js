'use strict';
// TIER4_ONC-103 Stem Cell Transplant
const CITATIONS = [
  { id: 'ASTCT-2024', source: 'ASTCT Transplant Guidelines', year: 2024 }
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
function transplantType(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const indication = ensureEnum(input, 'indication', ['multiple_myeloma', 'lymphoma_relapsed', 'lymphoma_first_line_high_risk', 'leukemia_aml_cr1', 'leukemia_aml_relapsed', 'mds', 'mf', 'cml_tki_failure', 'sickle_cell', 'other']);
  const donor = ensureEnum(input, 'donor', ['autologous', 'matched_related', 'matched_unrelated', 'haplo', 'cord']);
  const age = ensureNumber(input, 'age', 0, 100);
  const comorbidity = ensureEnum(input, 'comorbidity', ['low', 'intermediate', 'high']);
  const candidate = (donor === 'autologous') ? 'autologous_indicated_per_disease' :
    (age < 70 && comorbidity !== 'high') ? 'candidate_for_allo_review' :
    'review_for_underlying_then_decide';
  const conditioning = (donor === 'autologous') ? 'melphalan_200_or_lomustine_melphalan' :
    (comorbidity === 'high' || age >= 60) ? 'reduced_intensity_flu_bu' :
    'myeloablative_bu_cy_or_flu_bu';
  return {
    module: 'tier4_onc_103_type',
    patient_id: patientId,
    indication,
    donor,
    age,
    comorbidity,
    candidate,
    conditioning,
    monitoring: 'pre_transplant_workup_post_d30_d100_d180_d365_assess',
    citations: CITATIONS
  };
}
function gvhdManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const organ = ensureEnum(input, 'organ', ['skin', 'gi', 'liver', 'lung', 'eye', 'multi']);
  const grade = ensureEnum(input, 'overall_grade', ['1', '2', '3', '4']);
  const acute = ensureEnum(input, 'type', ['acute', 'chronic', 'overlap']);
  const therapy = (grade === '4' || organ === 'lung' || organ === 'multi') ? 'iv_steroid_2mg_kg_then_ruxolitinib_or_ecalzumab' :
    (grade === '3') ? 'iv_steroid_1_to_2mg_kg_then_review' :
    (grade === '2') ? 'topical_or_oral_steroid_then_review' :
    'topical_only_monitor';
  return {
    module: 'tier4_onc_103_gvhd',
    patient_id: patientId,
    organ,
    overall_grade: grade,
    type: acute,
    therapy,
    monitoring: 'q1wk_until_resolve_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  transplantType,
  gvhdManagement,
  CITATIONS,
  ValidationError
};