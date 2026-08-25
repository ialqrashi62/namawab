'use strict';
// TIER4_GI-108 Endoscopy
const CITATIONS = [
  { id: 'ASGE-2024', source: 'American Society GI Endoscopy', year: 2024 }
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
function polypRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const count = ensureNumber(input, 'polyp_count', 0, 100);
  const size_max = ensureNumber(input, 'largest_polyp_mm', 0, 100);
  const histology = ensureEnum(input, 'histology', ['adenoma', 'serrated', 'villous', 'tv_ad', 'cancer', 'hyperplastic', 'other']);
  const cumulative = (count >= 5 || size_max >= 10 || histology === 'villous' || histology === 'tv_ad' || histology === 'cancer') ? 'high_risk' : 'low_risk';
  const surveillance = (cumulative === 'high_risk') ? '3_year_colonoscopy' : '5_to_10_year_colonoscopy';
  return {
    module: 'tier4_gi_108_polyp',
    patient_id: patientId,
    polyp_count: count,
    largest_polyp_mm: size_max,
    histology,
    syndrome: 'sporadic_review_family_history',
    surveillance,
    citations: CITATIONS
  };
}
function giBleedingTriage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'presentation', ['hematemesis', 'melena', 'hematochezia', 'coffee_ground', 'occult']);
  const hr = ensureNumber(input, 'heart_rate', 0, 250);
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const hgb = ensureNumber(input, 'hemoglobin', 0, 25);
  const rockall = ensureNumber(input, 'rockall_score', 0, 11);
  const therapy = (hr > 100 || sbp < 100 || hgb < 7) ? 'resuscitation_typed_cross_then_urgent_endoscopy' :
    (rockall >= 3) ? 'urgent_endoscopy_within_24h' : 'elective_endoscopy_within_72h';
  return {
    module: 'tier4_gi_108_bleeding',
    patient_id: patientId,
    presentation: type,
    heart_rate: hr,
    sbp,
    hemoglobin: hgb,
    rockall_score: rockall,
    therapy,
    monitoring: 'q_post_endoscopy_then_q3mo',
    citations: CITATIONS
  };
}
function eusFn(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const indication = ensureEnum(input, 'indication', ['subepithelial_lesion', 'cyst_growth', 'biliary_access', 'pancreas_mass', 'cancer_staging', 'eus_guided_fna', 'eus_guided_drainage']);
  const therapy = {
    subepithelial_lesion: 'fna_or_fnb_coring',
    cyst_growth: 'fnb_with_molecular_analysis',
    biliary_access: 'eus_guided_drainage_or_ercp',
    pancreas_mass: 'fnb_then_stage_then_surgery',
    cancer_staging: 'stage_t_n_then_treatment',
    eus_guided_fna: 'fna_obtain_tissue_diagnosis',
    eus_guided_drainage: 'walled_off_necrosis_drainage_lumen_apposing_metal_stent'
  };
  return {
    module: 'tier4_gi_108_eus',
    patient_id: patientId,
    indication,
    therapy: therapy[indication],
    citations: CITATIONS
  };
}
module.exports = {
  polypRisk,
  giBleedingTriage,
  eusFn,
  CITATIONS,
  ValidationError
};
