// filepath: tier58_research_ext_323_res_trial_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function clinical_trial_enroll(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'trial');
  ensureEnum(req.phase, 'ph', ['phase_1','phase_2','phase_3','phase_4','pilot','feasibility']);
  ensureStr(req.arm, 'arm');
  ensureEnum(req.eligibility, 'elig', ['met','not_met','partially_met','pending_review']);
  ensureBool(req.consent_signed, 'cs');
  ensureStr(req.enrollment_date, 'ed');
  ensureBool(req.randomized, 'rnd');
  return { trial: req.trial_id, arm: req.arm };
}
function clinical_trial_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'trial');
  ensureStr(req.visit, 'vis');
  ensureEnum(req.adherence, 'adh', ['good','partial','poor','missed']);
  ensureNum(req.ae_grade, 'ae');
  ensureEnum(req.status, 'stat', ['on_study','completed','withdrawn','lost_to_followup','deceased']);
  ensureBool(req.next_visit_planned, 'nvp');
  return { trial: req.trial_id };
}
function clinical_trial_closeout(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'trial');
  ensureEnum(req.completion_reason, 'cr', ['protocol_complete','premature_termination_safety','premature_termination_futility','premature_termination_sponsor','subject_withdrew']);
  ensureBool(req.final_visit_done, 'fv');
  ensureBool(req.data_complete, 'dc');
  ensureBool(req.sponsor_closeout_submitted, 'scs');
  return { trial: req.trial_id };
}
function adverse_event_reporting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'trial');
  ensureStr(req.ae_term, 'aet');
  ensureEnum(req.causality, 'cau', ['unrelated','unlikely','possible','probable','definitely_related','possibly_related']);
  ensureBool(req.expected, 'exp');
  ensureBool(req.reported_to_sponsor, 'rsp');
  ensureBool(req.reported_to_irb, 'rirb');
  return { ae_term: req.ae_term };
}
function protocol_deviation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'trial');
  ensureEnum(req.deviation_type, 'dt', ['visit_window_violation','inclusion_violation','exclusion_violation','consent_omission','dose_modification_violation','other']);
  ensureEnum(req.severity, 'sev', ['minor','major','critical']);
  ensureStr(req.impact_on_safety, 'ios');
  ensureBool(req.documented, 'doc');
  ensureBool(req.reported_to_sponsor, 'rsp');
  return { deviation: req.deviation_type };
}

function funcs() { return { clinical_trial_enroll, clinical_trial_followup, clinical_trial_closeout, adverse_event_reporting, protocol_deviation }; }
module.exports = { funcs, ValidationError };