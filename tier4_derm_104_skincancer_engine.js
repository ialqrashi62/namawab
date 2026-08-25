'use strict';
// TIER4_DERM-104 Skin Cancer & Melanoma
const CITATIONS = [
  { id: 'NCCN-Melanoma', source: 'NCCN Guidelines - Melanoma', year: 2024 },
  { id: 'NCCN-BCC-SCC', source: 'NCCN Guidelines - Basal Cell Squamous Cell', year: 2024 }
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
function melanomaAbcde(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const asymmetry = input.asymmetry === true;
  const border_irregular = input.border_irregular === true;
  const color_variegation = input.color_variegation === true;
  const diameter_mm = ensureNumber(input, 'diameter_mm', 0, 100);
  const evolution = input.evolution === true;
  const total_score = (asymmetry ? 1 : 0) + (border_irregular ? 1 : 0) + (color_variegation ? 1 : 0) +
    (diameter_mm >= 6 ? 1 : 0) + (evolution ? 1 : 0);
  const suspicion = total_score >= 3 || diameter_mm >= 10;
  const next_step = suspicion ? 'excisional_biopsy_2mm_margin_full_thickness' : 'dermatoscopy_3_month_followup';
  return {
    module: 'tier4_derm_104_melanoma',
    patient_id: patientId,
    abcde_score: total_score,
    suspicion,
    next_step,
    dermoscopy: 'rhinoncotic_pattern_blue_white_veil_regression',
    citations: CITATIONS
  };
}
function bccManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const location = ensureEnum(input, 'location', ['h_zone_face', 'low_risk_face', 'trunk', 'extremities']);
  const diameter_mm = ensureNumber(input, 'diameter_mm', 0, 200);
  const subtype = ensureEnum(input, 'histologic_subtype', ['nodular', 'superficial', 'morpheaform', 'infiltrative', 'micronodular']);
  const high_risk = location === 'h_zone_face' || subtype === 'morpheaform' || subtype === 'infiltrative' || diameter_mm >= 20;
  const therapy = high_risk ? 'Mohs_micrographic_surgery'
    : (subtype === 'superficial' ? 'imiquimod_5_cre_x6wk_or_photodynamic' : 'standard_excision_4mm_margin');
  return {
    module: 'tier4_derm_104_bcc',
    patient_id: patientId,
    location,
    histologic_subtype: subtype,
    diameter_mm,
    high_risk,
    therapy,
    follow_up: 'baseline_3_to_6_months_then_annual',
    citations: CITATIONS
  };
}
function melanomaStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const breslow_mm = ensureNumber(input, 'breslow_thickness_mm', 0, 50);
  const ulceration = input.ulceration === true;
  const mitoses = ensureNumber(input, 'mitoses_per_mm2', 0, 100);
  const nodes = ensureNumber(input, 'sentinel_node_count', 0, 10);
  const nodes_positive = ensureNumber(input, 'sentinel_node_positive', 0, 10);
  const metastasis = ensureEnum(input, 'metastasis', ['none', 'in_transit', 'regional_nodes', 'distant']);
  let t_stage = 'T1';
  if (breslow_mm >= 4) t_stage = 'T4';
  else if (breslow_mm >= 2) t_stage = 'T3';
  else if (breslow_mm >= 1) t_stage = 'T2';
  const a_stage = ulceration ? 'b' : 'a';
  const therapy = breslow_mm < 1 ? 'wide_local_excision_1cm_margin'
    : breslow_mm < 2 ? 'wide_local_excision_1_to_2cm'
    : (breslow_mm >= 2 ? 'wide_local_excision_2cm_plus_sentinel_node_biopsy' : 'observe');
  return {
    module: 'tier4_derm_104_melanoma_stage',
    patient_id: patientId,
    t_stage: t_stage + a_stage,
    breslow_mm,
    ulceration,
    nodes,
    metastasis,
    therapy,
    citations: CITATIONS
  };
}
function sccManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const high_risk_features = input.immunosuppression === true || input.rapid_growth === true || input.neuro_invasion === true;
  const location = ensureEnum(input, 'location', ['h_zone_face', 'low_risk_face', 'trunk', 'extremities']);
  const diameter_mm = ensureNumber(input, 'diameter_mm', 0, 200);
  const therapy = high_risk_features || location === 'h_zone_face' ? 'Mohs_micrographic_surgery'
    : 'standard_excision_5mm_margin';
  return {
    module: 'tier4_derm_104_scc',
    patient_id: patientId,
    high_risk_features,
    therapy,
    follow_up: 'baseline_3_to_6_months_then_annual',
    citations: CITATIONS
  };
}
module.exports = {
  melanomaAbcde,
  bccManagement,
  melanomaStaging,
  sccManagement,
  CITATIONS,
  ValidationError
};
