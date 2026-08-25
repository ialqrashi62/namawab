'use strict';
// TIER4_NEURO-105 Headache
const CITATIONS = [
  { id: 'AHS-2024', source: 'American Headache Society', year: 2024 }
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
function migraineClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const attacks = ensureNumber(input, 'attacks_per_month', 0, 30);
  const headache_days = ensureNumber(input, 'headache_days_per_month', 0, 30);
  const with_aura = input.with_aura === true;
  const severity = ensureNumber(input, 'pain_peaks_score', 0, 10);
  const subtype = attacks >= 4 && headache_days < 15 ? 'episodic_migraine' :
    (headache_days >= 15 ? 'chronic_migraine' : 'low_frequency_episodic');
  const preventive = (headache_days >= 4 || severity >= 7) ? 'consider_preventive' : 'acute_only';
  return {
    module: 'tier4_neuro_105_migraine',
    patient_id: patientId,
    subtype,
    with_aura,
    attacks_per_month: attacks,
    headache_days_per_month: headache_days,
    severity,
    preventive_indicated: preventive === 'consider_preventive',
    acute: 'triptan_or_ditan_or_gebapentin_class_medication',
    preventive: 'topiramate_or_propranolol_or_cgrp_monoclonal_or_ajovy',
    citations: CITATIONS
  };
}
function triptanChoice(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const coronary = input.coronary_disease === true;
  const pregnancy = input.pregnant === true;
  const hemiplegic = input.hemiplegic_migraine === true;
  const basilar = input.basilar_migraine === true;
  const contraindication = coronary || hemiplegic || basilar;
  const choice = contraindication ? 'contraindicated_recommended_acetaminophen_nsaid_or_ditan_lasmiditan' : 'sumatriptan_rizatriptan_eletriptan_or_almotriptan';
  const at = input.early_treatment === true;
  return {
    module: 'tier4_neuro_105_triptan',
    patient_id: patientId,
    coronary_disease: coronary,
    pregnancy,
    hemiplegic,
    basilar,
    contraindication,
    choice,
    early_treatment: at,
    dose: 'sumatriptan_50_to_100mg_po_or_rizatriptan_10mg_po_or_6mg_sc',
    citations: CITATIONS
  };
}
function clusterHeadache(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const duration_min = ensureNumber(input, 'attack_duration_min', 0, 240);
  const frequency = ensureNumber(input, 'attacks_per_day', 0, 20);
  const ipsilateral = input.ipsilateral === true;
  const autonomic = input.autonomic === true;
  const restlessness = input.restlessness === true;
  const therapy = {
    acute: 'high_flow_o2_12_to_15_l_min_then_sumtriptan_6mg_sc',
    bridge: 'prednisone_60mg_5d_taper',
    preventive: 'verapamil_240_to_480mg_d',
    onabotulinumtoxin_a: 'chronic_only_under_iv_observation',
    galcanezumab: 'episodic_cluster_indicated'
  };
  return {
    module: 'tier4_neuro_105_cluster',
    patient_id: patientId,
    duration_min,
    attacks_per_day: frequency,
    ipsilateral,
    autonomic,
    restlessness,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  migraineClassification,
  triptanChoice,
  clusterHeadache,
  CITATIONS,
  ValidationError
};
