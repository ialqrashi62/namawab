'use strict';
// TIER4_PULM_EXT-104: Obstructive Sleep Apnea - STOP-BANG + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AASM_OSA_2017', 'STOP_BANG'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function screen(req) {
  ensureBool(req.snoring, 'snoring');
  ensureBool(req.tired, 'tired');
  ensureBool(req.observed_stop_breathing, 'observed_stop_breathing');
  ensureBool(req.high_blood_pressure, 'high_blood_pressure');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.age, 'age');
  ensureBool(req.male, 'male');
  ensureNumber(req.neck_cm, 'neck_cm');

  const score = (req.snoring ? 1 : 0) + (req.tired ? 1 : 0) + (req.observed_stop_breathing ? 1 : 0) +
    (req.high_blood_pressure ? 1 : 0) + (req.bmi > 35 ? 1 : 0) + (req.age > 50 ? 1 : 0) +
    (req.male ? 1 : 0) + (req.neck_cm > 40 ? 1 : 0);

  const risk = score >= 5 ? 'high' : score >= 3 ? 'intermediate' : 'low';
  return {
    score,
    risk,
    recommendation: risk === 'high' ? 'polysomnography_or_home_sleep_test' :
      risk === 'intermediate' ? 'home_sleep_test_or_consider_polysomnography' :
        'lifestyle_modification_only',
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureNumber(req.ahi, 'ahi');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.supine_dependent, 'supine_dependent');
  ensureBool(req.cpap_adherent, 'cpap_adherent');

  let primary;
  if (req.ahi >= 30) primary = 'cpap_first_line';
  else if (req.ahi >= 15) primary = 'cpap_or_oral_appliance_or_surgery';
  else primary = 'lifestyle_modification_weight_loss';
  if (req.supine_dependent) primary += '_plus_positional_therapy';
  const alternatives = [];
  if (req.bmi >= 35) alternatives.push('bariatric_surgery_evaluation');
  if (!req.cpap_adherent) alternatives.push('oral_appliance_hypoglossal_nerve_stimulation');
  return {
    ahi: req.ahi,
    primary,
    alternatives,
    followup: 'cpap_download_q1_year_pcp_q3_months',
    citations: CITATIONS,
  };
}

module.exports = { screen, treatment, CITATIONS, ValidationError };