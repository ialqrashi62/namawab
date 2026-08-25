'use strict';
// TIER4_OBGYN-105 Reproductive Endocrinology & Infertility
const CITATIONS = [
  { id: 'ASRM-2024', source: 'ASRM Practice Committee', year: 2024 }
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
function infertilityWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 60);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const cycles = ensureNumber(input, 'cycle_length_days', 0, 90);
  const ovulation_documented = input.ovulation_documented === true;
  const sperm_count = ensureNumber(input, 'sperm_count_million_ml', 0, 200);
  const workup = {
    ovulatory: ovulation_documented || cycles < 35,
    male: sperm_count < 15 ? 'abnormal_repeat_sa_then_infertility_specialist' : 'normal',
    female: {
      amh: ensureNumber(input, 'amh_ng_ml', 0, 50),
      fsh: ensureNumber(input, 'fsh_day3', 0, 50),
      antral: ensureNumber(input, 'antral_follicle_count', 0, 100)
    },
    tubal: 'hsg_or_sonohysterosalpingogram'
  };
  const recommendation = age > 35 ? 'expedited_3_to_6_months_after_workup'
    : (workup.female.amh < 1 || workup.female.fsh > 10 || workup.male.includes('abnormal')) ? 'refer_ivi_or_icsi' : 'expectant_then_ovulation_timing';
  return {
    module: 'tier4_obgyn_105_infertility',
    patient_id: patientId,
    age,
    bmi,
    workup,
    recommendation,
    citations: CITATIONS
  };
}
function pcosManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 60);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const oligomenorrhea = input.oligomenorrhea === true;
  const hyperandrogenism = input.hyperandrogenism === true;
  const polycystic_ovary = input.polycystic_ovary === true;
  const rotation = ensureEnum(input, 'rotterdam', ['classic_pcos', 'ovulatory_pcos', 'normoandrogenic_pcos']);
  const therapy = {
    lifestyle: 'weight_loss_5_10_percent',
    metformin: bmi > 25 ? 'metformin_1500mg_d_extended_release' : 'consider',
    ocp: 'first_line_off_fertility_metric',
    letrozole: 'first_line_fertility_dose_2_5_to_7_5_d',
    clomiphene: 'second_line_when_letrozole_not_effective',
    monitoring: 'glucose_q_prof_monitoring_for_diabetes_risk'
  };
  return {
    module: 'tier4_obgyn_105_pcos',
    patient_id: patientId,
    age,
    bmi,
    rotterdam: rotation,
    diagnosis_count: (oligomenorrhea ? 1 : 0) + (hyperandrogenism ? 1 : 0) + (polycystic_ovary ? 1 : 0),
    therapy,
    citations: CITATIONS
  };
}
function ivfCyclePlan(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 60);
  const amh = ensureNumber(input, 'amh_ng_ml', 0, 50);
  const afc = ensureNumber(input, 'antral_follicle_count', 0, 100);
  const protocol = ensureEnum(input, 'protocol', ['long_gnrh', 'short_gnrh', 'antagonist', 'mini', 'mild']);
  const dose = (age < 35 && amh > 2 && afc > 10) ? '150_to_225_iu' : (age >= 35 || amh < 1) ? '300_iu_max' : '225_iu';
  return {
    module: 'tier4_obgyn_105_ivf',
    patient_id: patientId,
    age,
    amh,
    afc,
    protocol,
    starting_dose: dose,
    monitoring: 'e2_eod_then_daily_from_day_5_antagonist_us_daily',
    citations: CITATIONS
  };
}
module.exports = {
  infertilityWorkup,
  pcosManagement,
  ivfCyclePlan,
  CITATIONS,
  ValidationError
};
