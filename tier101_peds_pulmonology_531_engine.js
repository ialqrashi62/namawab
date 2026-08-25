// filepath: tier101_peds_pulmonology_531_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function asthma_peds(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.asthma_severity, 'as', ['intermittent','mild','moderate','severe','unknown','other','none']);
  ensureEnum(req.controller, 'cont', ['ics','ltra','biologics','combination','none','other','unknown']);
  ensureNum(req.reliever, 'rel');
  ensureNum(req.exacerbations_12mo, 'e12');
  ensureNum(req.act_score, 'act');
  ensureNum(req.step, 'st');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function cf_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.fev1_pred, 'fev1');
  ensureNum(req.fvc_pred, 'fvc');
  ensureNum(req.exacerbations_12mo, 'e12');
  ensureEnum(req.infections, 'inf', ['none','pa','sa','mrsa','h_influenzae','other','unknown']);
  ensureBool(req.modulator_therapy, 'mt');
  ensureNum(req.bmi_percentile, 'bmi');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function bronchopulmonary_dysplasia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.oxygen_weaning, 'ow', ['in_progress','weaned','on_supplemental','unclear','other','unknown','none']);
  ensureNum(req.current_oxygen_pct, 'co');
  ensureNum(req.cpap_days, 'cd');
  ensureEnum(req.weight_gain, 'wg', ['appropriate','slow','failure_to_thrive','other','unknown','none']);
  ensureEnum(req.neurodevelopment, 'nd', ['normal','at_risk','delayed','follow_up','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function sleep_peds(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.ahi, 'ahi');
  ensureNum(req.min_spo2, 'ms');
  ensureEnum(req.etiology, 'et', ['adenotonsillar','obesity','craniofacial','neuromuscular','idiopathic','other','unknown','none']);
  ensureEnum(req.treatment, 'tx', ['watchful_waiting','adenotonsillectomy','cpap','weight_loss','combination','other','unknown','none']);
  ensureNum(req.reassess_months, 'rm');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function peds_bronchoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.findings, 'fd', ['normal','mucus_plugging','airway_compression','foreign_body','tumor','infection','other','unknown']);
  ensureNum(req.bal_cell_count, 'bcc');
  ensureNum(req.biopsies_taken, 'bt');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { asthma_peds, cf_followup, bronchopulmonary_dysplasia, sleep_peds, peds_bronchoscopy }; }
module.exports = { funcs, ValidationError };
