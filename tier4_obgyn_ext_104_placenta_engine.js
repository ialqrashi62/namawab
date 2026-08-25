'use strict';
// TIER4_OBGYN_EXT-104: Placenta previa + accreta spectrum
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Placenta_2020', 'SMFM_Previa_2017'];

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

function previa(req) {
  ensureStr(req.type, 'type'); // complete | partial | marginal | low_lying
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.bleeding_active, 'bleeding_active');
  ensureNumber(req.previous_csection, 'previous_csection');

  const accreta_risk = req.type === 'complete' && req.previous_csection >= 1;
  const delivery = req.type === 'complete' ? 'scheduled_csection_at_34_to_37_weeks_with_accreta_team' :
    req.type === 'partial' ? 'csection_at_37_weeks_or_labor_per_presentation' :
      req.type === 'marginal' ? 'consider_vbac_or_csection_at_37_weeks' : 'trial_of_labor_reassess_ultrasound';
  return {
    type: req.type,
    accreta_risk: accreta_risk,
    delivery_timing: req.bleeding_active ? 'deliver_immediately_with_steroids' : delivery,
    antepartum_monitoring: req.bleeding_active ? 'inpatient_with_steroids' : 'pelvic_rest_avoid_intercourse_outpatient_us_q3_4_weeks',
    rbc_prepared: req.type === 'complete' ? 'crossmatch_and_prepare_4_to_6_units' : 'crossmatch_and_prepare_2_units',
    citations: CITATIONS,
  };
}

function accreta(req) {
  ensureStr(req.severity, 'severity'); // accreta | increta | percreta
  ensureBool(req.previous_csection, 'previous_csection');
  ensureBool(req.placenta_previa, 'placenta_previa');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.bleeding_active, 'bleeding_active');

  const delivery = req.severity === 'percreta' ? 'scheduled_csection_at_32_to_34_weeks_with_urology_and_gynecologic_oncology' :
    req.severity === 'increta' ? 'scheduled_csection_at_34_to_36_weeks' :
      'scheduled_csection_at_34_to_37_weeks';
  return {
    severity: req.severity,
    delivery_timing: delivery,
    surgical_team: 'multidisciplinary_accreta_team_with_gyn_onc_and_interventional_radiology',
    consent: 'possible_hysterectomy_massive_transfusion_icu_admission',
    monitoring: req.bleeding_active ? 'inpatient' : 'outpatient_us_q4_weeks_until_delivery',
    citations: CITATIONS,
  };
}

module.exports = { previa, accreta, CITATIONS, ValidationError };