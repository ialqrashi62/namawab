'use strict';
// TIER4_GI-105 Pancreas
const CITATIONS = [
  { id: 'IAP-2024', source: 'International Association Pancreatology', year: 2024 }
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
function acutePancreatitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const revised = ensureEnum(input, 'revised_severity', ['mild', 'moderate', 'severe']);
  const bisap = ensureNumber(input, 'bisap_score', 0, 5);
  const organ_failure = ensureEnum(input, 'organ_failure', ['none', 'transient', 'persistent']);
  const necrosis = ensureEnum(input, 'necrosis', ['none', 'sterile', 'infected']);
  const therapy = (revised === 'severe' || organ_failure === 'persistent' || necrosis === 'infected') ? 'icu_aggressive_fluid_antibiotics_necrosectomy' :
    (revised === 'moderate') ? 'iv_fluid_analgesia_advance_diet_as_tolerated' : 'supportive_oral_diet_advance_qday';
  const procedure = (necrosis === 'infected') ? 'step_up_approach_drainage_then_necrosectomy' : 'none';
  return {
    module: 'tier4_gi_105_ap',
    patient_id: patientId,
    revised_severity: revised,
    bisap,
    organ_failure,
    necrosis,
    therapy,
    procedure,
    monitoring: 'q6h_vitals_q12h_labs',
    citations: CITATIONS
  };
}
function chronicPancreatitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const etiology = ensureEnum(input, 'etiology', ['alcohol', 'hereditary', 'autoimmune', 'idiopathic', 'recurrent', 'obstructive', 'toxic', 'other']);
  const calcifications = input.calcifications === true;
  const diabetes = input.pancreatogenic_diabetes === true;
  const steatorrhea = input.steatorrhea === true;
  const therapy = {
    pain: 'analgesia_creon_pancreatic_enzymes_repeated_ercp_or_eswl',
    nutrition: 'small_frequent_meals_mct_oil',
    diabetes: 'metformin_insulin_avoid_secretagogues',
    autoimmune: 'steroids_azathioprine',
    endoscopic: 'ercp_stone_extraction_or_stenting'
  };
  return {
    module: 'tier4_gi_105_cp',
    patient_id: patientId,
    etiology,
    calcifications,
    pancreatogenic_diabetes: diabetes,
    steatorrhea,
    therapy,
    monitoring: 'q3mo_labs_q1y_imaging',
    citations: CITATIONS
  };
}
function pancreaticCystMngmnt(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cyst_type = ensureEnum(input, 'cyst_type', ['ipmn', 'mcn', 'spn', 'scn', 'pseudocyst', 'worrisome_feature', 'high_risk_stigmata', 'unknown']);
  const size_cm = ensureNumber(input, 'size_cm', 0, 30);
  const surveillance = (cyst_type === 'ipmn' && size_cm >= 1.5) ? 'mrcp_or_eus_q6mo_q1y' :
    (cyst_type === 'mcn' && size_cm >= 4) ? 'consider_resection' : 'observe_q1y';
  const surgery = (cyst_type === 'high_risk_stigmata') ? 'whipple_or_central_then_resect' : 'none';
  return {
    module: 'tier4_gi_105_cyst',
    patient_id: patientId,
    cyst_type,
    size_cm,
    surveillance,
    surgery,
    citations: CITATIONS
  };
}
module.exports = {
  acutePancreatitis,
  chronicPancreatitis,
  pancreaticCystMngmnt,
  CITATIONS,
  ValidationError
};
