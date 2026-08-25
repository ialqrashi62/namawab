'use strict';
// TIER4_INFECT_EXT-105: COVID severity and treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['NIH_COVID_2024', 'WHO_COVID_2023', 'IDSA_COVID_2023'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function severity(req) {
  ensureNumber(req.spo2, 'spo2');
  ensureNumber(req.resp_rate, 'resp_rate');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.icu, 'icu');
  ensureBool(req.ventilator, 'ventilator');
  ensureBool(req.immunocompromised, 'immunocompromised');
  ensureNumber(req.age, 'age');

  const severe = req.spo2 < 94 || req.resp_rate >= 30 || req.icu || req.ventilator || req.heart_rate > 125;
  const moderate = !severe && (req.dyspnea || req.spo2 >= 94 && req.spo2 < 95 || req.immunocompromised || req.age >= 65);
  const mild = !severe && !moderate;

  return {
    spo2: req.spo2,
    resp_rate: req.resp_rate,
    severe,
    moderate,
    mild,
    classification: severe ? 'severe' : moderate ? 'moderate' : 'mild',
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureStr(req.classification, 'classification'); // mild | moderate | severe
  ensureNumber(req.age, 'age');
  ensureBool(req.immunocompromised, 'immunocompromised');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.ckd, 'ckd');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.symptoms_days, 'symptoms_days');
  ensureBool(req.hypoxemia, 'hypoxemia');

  let antivirals, steroids, monitoring;
  if (req.classification === 'mild') {
    antivirals = req.symptoms_days <= 5 ? 'nirmatrelvir_ritonavir_if_high_risk' : 'no_antiviral_benefit_outside_window';
    steroids = 'not_indicated';
    monitoring = 'symptom_tracking_pulse_ox_home';
  } else if (req.classification === 'moderate') {
    antivirals = req.symptoms_days <= 5 ? 'remdesivir_or_nirmatrelvir_ritonavir' : 'remdesivir_3_to_5_days';
    steroids = req.hypoxemia ? 'dexamethasone_6mg_daily_10_days' : 'not_routinely_indicated';
    monitoring = 'inpatient_or_close_outpatient_pulse_ox';
  } else {
    antivirals = 'remdesivir_5_days';
    steroids = 'dexamethasone_6mg_daily_10_days';
    monitoring = 'icu_ards_protocol_thromboembolism_prophylaxis';
  }
  const antiviral_renal = req.ckd && req.egfr < 30 && antivirals.startsWith('nirmatrelvir');
  return {
    classification: req.classification,
    antivirals: antiviral_renal ? 'avoid_nirmatrelvir_use_remdesivir' : antivirals,
    steroids,
    monitoring,
    anticoagulation: req.classification !== 'mild' ? 'thromboprophylaxis_with_lmwh' : 'ambulation',
    citations: CITATIONS,
  };
}

module.exports = { severity, treat, CITATIONS, ValidationError };