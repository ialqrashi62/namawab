'use strict';
// TIER4_OBGYN-103 Maternal Fetal Medicine
const CITATIONS = [
  { id: 'SMFM-2024', source: 'Society Maternal Fetal Medicine', year: 2024 }
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
function iugrMonitoring(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const efw_percentile = ensureNumber(input, 'efw_percentile', 0, 100);
  const doppler_umbilical = ensureNumber(input, 'umbilical_artery_pi', 0, 5);
  const doppler_mca = ensureNumber(input, 'mca_pi', 0, 5);
  const doppler_ductus = ensureNumber(input, 'ductus_venosus_pi', 0, 5);
  const absent_end_diastolic = (doppler_umbilical > 1.5) || input.absent_end_diastolic === true;
  const reversed_flow = input.reversed_ua === true;
  let diagnosis = 'small_constitutionally_normal';
  if (efw_percentile < 10) diagnosis = 'fetal_growth_restriction';
  if (absent_end_diastolic) diagnosis = 'iugr_abnormal_doppler';
  if (reversed_flow) diagnosis = 'iugr_reversed_ua_high_risk';
  const monitoring = {
    ultrasound_q2wk: efw_percentile < 10,
    doppler_q1wk: absent_end_diastolic,
    admission: reversed_flow || ga_weeks >= 32 ? 'consider_admission' : 'outpatient',
    delivery_timing: reversed_flow ? 'lor_30w_depends_on_ga' : (absent_end_diastolic ? '34_37w' : '37_38w')
  };
  return {
    module: 'tier4_obgyn_103_iugr',
    patient_id: patientId,
    diagnosis,
    labs: { efw_percentile, umbilical_artery_pi: doppler_umbilical, mca_pi: doppler_mca, ductus_venosus_pi: doppler_ductus },
    monitoring,
    citations: CITATIONS
  };
}
function fetalAnomalyWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const anomaly = ensureEnum(input, 'anomaly', ['anencephaly', 'spina_bifida', 'omphalocele', 'gastroschisis', 'cdh', 'critical_heart', 'renal_agenesis', 'skeletal_dysplasia', 'twin_twin_transfusion', 'hydrops', 'hydrocephalus']);
  const invasive = ensureEnum(input, 'invasive_test', ['none', 'cv_s', 'amniocentesis', 'chorionic_villi', 'mfm_referral']);
  const genetic = ensureEnum(input, 'genetic_counseling', ['offered', 'declined', 'scheduled', 'completed']);
  const delivery_plan = {
    anencephaly: 'perinatal_palliative_care',
    spina_bifida: 'cesarean_avoid_injury_fetal_surgery_candidate',
    omphalocele: 'cesarean_avoid_sac_rupture',
    gastroschisis: 'serial_doppler_planned_preterm_delivery',
    cdh: 'planned_tertiary_inhaled_no_newborn_bag',
    critical_heart: 'planned_tertiary_inhaled_prostaglandin_ductus',
    renal_agenesis: 'palliative_consider_lethal_renalpulmonary',
    skeletal_dysplasia: 'cephalocentesis_consideration_vs_elective',
    twin_twin_transfusion: 'amniocentesis_laser_ablation',
    hydrops: 'refer_center_fetal_therapy',
    hydrocephalus: 'cephalocentesis_or_vp_shunt_postnatal'
  };
  return {
    module: 'tier4_obgyn_103_anomaly',
    patient_id: patientId,
    anomaly,
    invasive_test: invasive,
    genetic_counseling: genetic,
    delivery_plan: delivery_plan[anomaly],
    citations: CITATIONS
  };
}
module.exports = {
  iugrMonitoring,
  fetalAnomalyWorkup,
  CITATIONS,
  ValidationError
};
