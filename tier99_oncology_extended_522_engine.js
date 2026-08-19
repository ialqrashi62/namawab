// filepath: tier99_oncology_extended_522_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tumor_board(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.specialists_present, 'sp');
  ensureBool(req.pathology_review, 'pr');
  ensureBool(req.radiology_review, 'rr');
  ensureNum(req.recommendation_count, 'rc');
  ensureEnum(req.plan, 'plan', ['surgery','chemo','radiation','combined','surveillance','supportive','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function molecular_profiling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.platform, 'pl', ['ngs','pcr','fish','ihc','other','unknown']);
  ensureNum(req.genes_tested, 'gt');
  ensureNum(req.alterations_found, 'af');
  ensureNum(req.actionable_mutations, 'am');
  ensureNum(req.tmb_score, 'tmb');
  ensureEnum(req.msi_status, 'ms', ['msi_high','msi_low','mss','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function clinical_trial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enrollment_id, 'eid');
  ensureNum(req.protocol_number, 'pn');
  ensureNum(req.phase, 'ph');
  ensureBool(req.eligibility_met, 'em');
  ensureNum(req.consent_signed, 'cs');
  ensureEnum(req.accrual_status, 'as', ['screening','enrolled','active','completed','withdrawn','other','unknown']);
  ensureNum(req.adverse_events, 'ae');
  ensureStr(req.provider, 'pr');
  return { eid: req.enrollment_id };
}
function survivorship_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.years_since_treatment, 'yst');
  ensureNum(req.recurrence_surveillance, 'rs');
  ensureNum(req.secondary_cancers, 'sc');
  ensureNum(req.late_effects_score, 'le');
  ensureNum(req.fertility_concerns, 'fc');
  ensureNum(req.psychosocial_score, 'psy');
  ensureNum(req.lifestyle_counseling, 'lc');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function hospice_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureNum(req.diagnosis, 'dx');
  ensureNum(req.prognosis_months, 'pm');
  ensureNum(req.karnofsky, 'kf');
  ensureBool(req.hospice_eligible, 'he');
  ensureNum(req.hospice_level, 'hl');
  ensureNum(req.family_agreement, 'fa');
  ensureEnum(req.disposition, 'disp', ['home_hospice','inpatient_hospice','respite','decline','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.referral_id };
}

function funcs() { return { tumor_board, molecular_profiling, clinical_trial, survivorship_followup, hospice_referral }; }
module.exports = { funcs, ValidationError };
