'use strict';
// TIER4_HEM-101 Anemia Workup
const CITATIONS = [
  { id: 'UpToDate-Anemia-2024', source: 'UpToDate Anemia Workup', year: 2024 }
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
function anemiaWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const hgb = ensureNumber(input, 'hgb_g_dl', 0, 25);
  const mcv = ensureNumber(input, 'mcv_fl', 0, 200);
  const retic = ensureNumber(input, 'retic_pct', 0, 100);
  const ferritin = ensureNumber(input, 'ferritin_ng_ml', 0, 10000);
  const b12 = ensureNumber(input, 'b12_pg_ml', 0, 10000);
  const classification = (mcv < 80) ? 'microcytic' : (mcv > 100) ? 'macrocytic' : 'normocytic';
  const iron_deficiency = (ferritin < 30) ? 'iron_deficiency_likely' : 'iron_replete';
  const b12_deficiency = (b12 < 200) ? 'b12_deficiency_likely' : 'b12_replete';
  const hypoproliferative = (retic < 2) ? 'hypoproliferative' : 'hyperproliferative';
  const etiology_hint = (classification === 'microcytic' && iron_deficiency === 'iron_deficiency_likely') ? 'iron_deficiency_anemia_then_workup_gi_loss_menorrhagia' :
    (classification === 'microcytic' && iron_deficiency === 'iron_replete') ? 'thalassemia_or_anemia_chronic_disease_then_hgb_electrophoresis' :
    (classification === 'macrocytic' && b12_deficiency === 'b12_deficiency_likely') ? 'b12_or_folate_deficiency_then_antibody_test' :
    (classification === 'macrocytic') ? 'mds_aplastic_alcohol_drug_review_then_bone_marrow' :
    (classification === 'normocytic' && hypoproliferative === 'hypoproliferative') ? 'anemia_chronic_disease_or_renal_or_aplastic_then_review' :
    (classification === 'normocytic' && hypoproliferative === 'hyperproliferative') ? 'hemolysis_then_haptoglobin_ldh_retic_review' :
    'review_other';
  return {
    module: 'tier4_hem_101_workup',
    patient_id: patientId,
    hgb_g_dl: hgb,
    mcv_fl: mcv,
    retic_pct: retic,
    ferritin,
    b12,
    classification,
    iron_status: iron_deficiency,
    b12_status: b12_deficiency,
    bone_marrow_response: hypoproliferative,
    etiology_hint,
    monitoring: 'q1wk_until_response_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  anemiaWorkup,
  CITATIONS,
  ValidationError
};