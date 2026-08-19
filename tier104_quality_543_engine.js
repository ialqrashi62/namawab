// filepath: tier104_quality_543_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function accreditation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.accreditation_body, 'ab', ['jcaho','ccla','iso','cap','other','unknown']);
  ensureEnum(req.type, 'tp', ['hospital','clinic','lab','home_care','other','unknown']);
  ensureEnum(req.status, 'st', ['pre_survey','surveyed','deferred','denied','accredited','other','unknown']);
  ensureNum(req.deficiencies, 'def');
  ensureEnum(req.action_plan, 'ap', ['pending','in_progress','completed','not_required','other','unknown']);
  ensureStr(req.next_survey_date, 'nsd');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function cms_metrics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric_id, 'mid');
  ensureStr(req.metric_name, 'mn');
  ensureNum(req.observed_rate, 'or');
  ensureNum(req.expected_rate, 'er');
  ensureNum(req.excess_ratio, 'exr');
  ensureNum(req.denominator, 'den');
  ensureStr(req.provider, 'pr');
  return { mid: req.metric_id };
}
function value_based_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureStr(req.measure, 'me');
  ensureNum(req.target, 'tg');
  ensureNum(req.actual, 'ac');
  ensureEnum(req.value_benchmark, 'vb', ['above','at','below','unknown','other']);
  ensureNum(req.improvement_score, 'is');
  ensureStr(req.provider, 'pr');
  return { cid: req.contract_id };
}
function patient_experience(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.survey_id, 'sid');
  ensureNum(req.nps_score, 'nps');
  ensureNum(req.mean_score, 'ms');
  ensureNum(req.response_rate, 'rr');
  ensureNum(req.complaints, 'comp');
  ensureNum(req.compliments, 'com');
  ensureStr(req.provider, 'pr');
  return { sid: req.survey_id };
}
function hospital_scorecard(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureEnum(req.domain, 'dm', ['safety','quality','efficiency','finance','workforce','experience','other','unknown']);
  ensureNum(req.composite_score, 'cs');
  ensureNum(req.mortality_observed, 'mo');
  ensureNum(req.mortality_expected, 'me');
  ensureNum(req.complications, 'comp');
  ensureNum(req.readmission, 'rea');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}

function funcs() { return { accreditation, cms_metrics, value_based_care, patient_experience, hospital_scorecard }; }
module.exports = { funcs, ValidationError };
