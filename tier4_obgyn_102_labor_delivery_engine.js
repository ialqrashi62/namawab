'use strict';
// TIER4_OBGYN-102 Labor & Delivery
const CITATIONS = [
  { id: 'ACOG-LD-2024', source: 'ACOG Safe Prevention Primary Cesarean', year: 2024 },
  { id: 'NICHD-2008', source: 'NICHD Workshop on Partogram', year: 2008 }
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
function friedmanCurve(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const parity = ensureEnum(input, 'parity', ['nulliparous', 'multiparous']);
  const cervix_cm_start = ensureNumber(input, 'cervix_cm_initial', 0, 10);
  const cervix_cm_now = ensureNumber(input, 'cervix_cm_current', 0, 10);
  const hours_in_labor = ensureNumber(input, 'hours_in_labor', 0, 100);
  const effacement = ensureNumber(input, 'effacement_pct', 0, 100);
  const station = ensureNumber(input, 'fetal_station', -5, 5);
  const descent_rate = (cervix_cm_now - cervix_cm_start) / Math.max(hours_in_labor, 0.1);
  const arrest_dilation = parity === 'nulliparous' ?
    (cervix_cm_now >= 6 && hours_in_labor >= 4 && effacement >= 90 && descent_rate < 1.2) :
    (cervix_cm_now >= 6 && hours_in_labor >= 4 && descent_rate < 1.5);
  const arrest_descent = (station < 0 && hours_in_labor >= 3 && effacement >= 90) ? true : false;
  const recommendation = (arrest_dilation || arrest_descent) ? 'consider_cesarean_after_oxytocin_adequacy' : 'expectant_p_continue';
  return {
    module: 'tier4_obgyn_102_friedman',
    patient_id: patientId,
    parity,
    cervix_cm_start,
    cervix_cm_now,
    hours_in_labor,
    descent_rate,
    arrest_dilation,
    arrest_descent,
    recommendation,
    citations: CITATIONS
  };
}
function fetalMonitoring(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const baseline = ensureNumber(input, 'fhr_baseline', 0, 250);
  const variability = ensureNumber(input, 'fhr_variability', 0, 50);
  const accelerations = ensureNumber(input, 'accelerations_count', 0, 50);
  const late_decels = ensureNumber(input, 'late_decelerations_count', 0, 50);
  const variable_decels = ensureNumber(input, 'variable_decelerations_count', 0, 50);
  let category = 'category_1';
  if (baseline < 110 || variability < 5 || late_decels > 0) category = 'category_3';
  else if (variability < 6 || late_decels > 0 || variable_decels > 0) category = 'category_2';
  const intervention = {
    category_1: 'continue_monitoring',
    category_2: 'intrauterine_resuscitation_positioning_fluid_o2_discontinue_oxytocin_recheck',
    category_3: 'immediate_resuscitation_consider_emergent_delivery'
  };
  return {
    module: 'tier4_obgyn_102_fetal_monitor',
    patient_id: patientId,
    fhr: { baseline, variability, accelerations, late_decels, variable_decels },
    category,
    intervention: intervention[category],
    citations: CITATIONS
  };
}
function induction(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bishop = ensureNumber(input, 'bishop_score', 0, 13);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const indication = ensureEnum(input, 'indication', ['postdates', 'elective', 'preeclampsia', 'gdm', 'oligohydramnios', 'iugr', 'mat_request', 'fetal_demise']);
  const favorable = bishop >= 6;
  const mechanical = favorable ? 'transcervical_foley_or_dilapan_with_2_to_4h_placement'
    : 'cervical_ripening_misoprostol_25mcg_q2_or_dinoprostone_pessary';
  const pitocin = favorable ? 'oxytocin_2_mu_min_increment_q15min' : 'delay_until_cervix_favorable';
  return {
    module: 'tier4_obgyn_102_induction',
    patient_id: patientId,
    indication,
    bishop_score: bishop,
    favorable,
    cervical_ripening: mechanical,
    pitocin_protocol: pitocin,
    timing: 'expect_12_to_24h_cervical_ripening_then_augmentation',
    citations: CITATIONS
  };
}
module.exports = {
  friedmanCurve,
  fetalMonitoring,
  induction,
  CITATIONS,
  ValidationError
};
