'use strict';
// TIER4_NEPH_EXT-102: Dialysis adequacy + modality
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_HD_2019', 'KDIGO_PD_2020', 'KDOQI_HD_2006'];

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

function hd_adequacy(req) {
  ensureNumber(req.urr, 'urr');
  ensureNumber(req.kt_v, 'kt_v');
  ensureNumber(req.session_hours, 'session_hours');
  ensureNumber(req.frequency_per_week, 'frequency_per_week');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.residual_renal_function, 'residual_renal_function');

  const adequate_ktv = req.kt_v >= 1.2;
  const adequate_urr = req.urr >= 65;
  const adequate = adequate_ktv && adequate_urr;
  return {
    kt_v: req.kt_v,
    urr: req.urr,
    session_hours: req.session_hours,
    frequency_per_week: req.frequency_per_week,
    adequate,
    recommendation: adequate ? 'continue_current_prescription' : req.frequency_per_week < 3 ? 'increase_frequency_to_3_per_week' :
      req.session_hours < 4 ? 'extend_session_to_4_hours' : 'review_blood_flow_dialyzer_size',
    citations: CITATIONS,
  };
}

function modality(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.heart_failure, 'heart_failure');
  ensureBool(req.ascites, 'ascites');
  ensureBool(req.catheter_present, 'catheter_present');
  ensureBool(req.avf_present, 'avf_present');
  ensureBool(req.independent_lifestyle, 'independent_lifestyle');
  ensureBool(req.home_suitable, 'home_suitable');

  const pd_favored = req.independent_lifestyle && req.home_suitable && !req.heart_failure && !req.ascites;
  const hd_favored = req.heart_failure || req.ascites || !req.home_suitable || req.catheter_present;
  const recommendation = pd_favored ? 'peritoneal_dialysis_first' :
    hd_favored ? 'hemodialysis_via_avf_or_catheter' :
    req.avf_present ? 'in_center_hemodialysis_via_avf' : 'urgent_vascular_access_evaluation';

  return {
    age: req.age,
    egfr: req.egfr,
    recommendation,
    modality: pd_favored ? 'pd' : 'hd',
    citations: CITATIONS,
  };
}

module.exports = { hd_adequacy, modality, CITATIONS, ValidationError };