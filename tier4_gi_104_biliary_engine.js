'use strict';
// TIER4_GI-104 Biliary
const CITATIONS = [
  { id: 'ESGE-2024', source: 'European Society GI Endoscopy', year: 2024 }
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
function choledocholithiasis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cbd_diameter_mm = ensureNumber(input, 'cbd_diameter_mm', 0, 30);
  const bilirubin = ensureNumber(input, 'total_bilirubin', 0, 60);
  const alk_phos = ensureNumber(input, 'alk_phos', 0, 2000);
  const fever = input.fever === true;
  const choc = input.charcot_triad === true;
  const therapy = (choc || fever) ? 'urgent_ercp_with_stone_extraction' :
    (cbd_diameter_mm >= 10 || bilirubin > 4) ? 'ercp_with_sphincterotomy' : 'mrcp_or_eus_then_ercp';
  return {
    module: 'tier4_gi_104_choledocholithiasis',
    patient_id: patientId,
    cbd_diameter_mm,
    bilirubin,
    alk_phos,
    fever,
    charcot_triad: choc,
    therapy,
    monitoring: 'q_post_ercp_lfts_q1y',
    citations: CITATIONS
  };
}
function acuteCholecystitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tokyo_grade = ensureEnum(input, 'tokyo_grade', ['I', 'II', 'III']);
  const murphy = input.murphy_sign === true;
  const wbc = ensureNumber(input, 'wbc', 0, 50000);
  const surgery = (tokyo_grade === 'I' || tokyo_grade === 'II') ? 'laparoscopic_cholecystectomy_within_72h' :
    (tokyo_grade === 'III') ? 'urgent_cholecystectomy_or_pct_then_delayed' : 'medical_management_then_elective';
  return {
    module: 'tier4_gi_104_cholecystitis',
    patient_id: patientId,
    tokyo_grade,
    murphy,
    wbc,
    surgery,
    monitoring: 'q_post_op_labs_q4wk',
    citations: CITATIONS
  };
}
function primarySclerosingCholangitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const alp = ensureNumber(input, 'alk_phos', 0, 2000);
  const fibroscan = ensureNumber(input, 'fibroscan_kpa', 0, 75);
  const mayo_risk = ensureEnum(input, 'mayo_risk', ['low', 'intermediate', 'high']);
  const surveillance = (mayo_risk !== 'low') ? 'mrcp_or_ercp_q_year_surveillance_cholangiocarcinoma' : 'q1y_labs_mrcp';
  return {
    module: 'tier4_gi_104_psc',
    patient_id: patientId,
    alp,
    fibroscan_kpa: fibroscan,
    mayo_risk,
    surveillance,
    monitoring: 'q1y_q3mo_labs',
    citations: CITATIONS
  };
}
module.exports = {
  choledocholithiasis,
  acuteCholecystitis,
  primarySclerosingCholangitis,
  CITATIONS,
  ValidationError
};
