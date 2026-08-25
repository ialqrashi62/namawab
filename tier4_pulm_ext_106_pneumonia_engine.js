'use strict';
// TIER4_PULM_EXT-106: Pneumonia CURB-65 + severity
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['BTS_Pneumonia_2014', 'ATS_IDSA_2019', 'IDSA_Pneumonia_2022'];

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

function curb65(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.urea, 'urea');
  ensureNumber(req.resp_rate, 'resp_rate');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.diastolic_below_60, 'diastolic_below_60');
  ensureBool(req.confusion, 'confusion');

  const age_score = req.age >= 65 ? 1 : 0;
  const urea_score = req.urea >= 7 ? 1 : 0;
  const rr_score = req.resp_rate >= 30 ? 1 : 0;
  const sbp_score = req.sbp < 90 || req.diastolic_below_60 ? 1 : 0;
  const confusion_score = req.confusion ? 1 : 0;
  const score = age_score + urea_score + rr_score + sbp_score + confusion_score;

  let disposition;
  if (score <= 1) disposition = 'outpatient_treatment';
  else if (score === 2) disposition = 'consider_inpatient_or_short_stay';
  else disposition = 'urgent_hospitalization_consider_icu';

  return {
    age: req.age,
    score,
    components: { age_score, urea_score, rr_score, sbp_score, confusion_score },
    disposition,
    citations: CITATIONS,
  };
}

function severity(req) {
  ensureStr(req.type, 'type'); // cap | hap | vap | aspiration
  ensureNumber(req.oxygenation_index, 'oxygenation_index');
  ensureBool(req.vasopressors, 'vasopressors');
  ensureBool(req.mechanical_ventilation, 'mechanical_ventilation');
  ensureBool(req.immunocompromised, 'immunocompromised');

  let severity = 'mild';
  if (req.mechanical_ventilation || req.vasopressors || req.oxygenation_index < 200) severity = 'severe';
  else if (req.immunocompromised || req.oxygenation_index < 300) severity = 'moderate';
  return {
    type: req.type,
    severity,
    oxygenation_index: req.oxygenation_index,
    severe: severity === 'severe',
    treatment_intensity: severity === 'severe' ? 'icu_ards_protocol' : severity === 'moderate' ? 'inpatient_close_monitoring' : 'outpatient',
    citations: CITATIONS,
  };
}

module.exports = { curb65, severity, CITATIONS, ValidationError };