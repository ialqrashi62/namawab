// filepath: tier165_eth_774_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consent_capacity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.mmse_score, 'ms');
  ensureNum(req.moca_score, 'mc'); ensureBool(req.diagnosis, 'dx');
  ensureNum(req.aid_capacity, 'ac'); ensureEnum(req.overall, 'oa', ['full','partial','lacking','NA']);
  ensureNum(req.assessor, 'as'); ensureBool(req.improvement, 'im');
  ensureNum(req.reassess_days, 'rd'); ensureStr(req.provider, 'pr');
  return { cc_id: `cc_${Date.now()}`, patient_id: req.patient_id, capacity: req.overall, mmse: req.mmse_score };
}

function end_of_life_ethics(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['cancer','CHF','COPD','dementia','ALS','HIV','other','NA']);
  ensureBool(req.competent, 'cp'); ensureEnum(req.wishes, 'wi', ['aggressive','limited','comfort','NA']);
  ensureBool(req.advance_directive, 'ad'); ensureNum(req.family_count, 'fc');
  ensureEnum(req.consensus, 'cn', ['full','partial','conflict','NA']);
  ensureEnum(req.ethic_consult, 'ec', ['none','requested','completed','NA']);
  ensureStr(req.provider, 'pr');
  return { el_id: `el_${Date.now()}`, patient_id: req.patient_id, wishes: req.wishes, consensus: req.consensus };
}

function refusal_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.treatment_refused, 'tr', ['surgery','medication','transfusion','vaccination','life_support','other','NA']);
  ensureBool(req.competent, 'cp'); ensureEnum(req.decision_maker, 'dm', ['self','family','surrogate','court','NA']);
  ensureNum(req.discussion_hours, 'dh'); ensureBool(req.understands_risk, 'ur');
  ensureEnum(req.alternatives_offered, 'ao', ['none','some','comprehensive','NA']);
  ensureEnum(req.documented, 'dc', ['comprehensive','minimal','verbal','NA']);
  ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, patient_id: req.patient_id, refused: req.treatment_refused, competent: req.competent };
}

function research_ethics(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.study_type, 'st', ['observational','interventional','genetic','data','behavioral','other','NA']);
  ensureBool(req.consent, 'cn'); ensureNum(req.consent_version, 'cv');
  ensureEnum(req.ethics_review, 'er', ['approved','conditional','pending','rejected','NA']);
  ensureBool(req.compensation, 'co'); ensureEnum(req.compensation_type, 'ct', ['none','cash','voucher','medical','NA']);
  ensureNum(req.withdraw_days, 'wd'); ensureBool(req.cohort_minimal_risk, 'mr');
  ensureStr(req.provider, 'pr');
  return { re_id: `re_${Date.now()}`, patient_id: req.patient_id, study: req.study_type, review: req.ethics_review };
}

function resource_allocation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.resource_type, 'rt', ['ICU_bed','organ','medication','specialist','vaccine','other','NA']);
  ensureNum(req.priority_score, 'ps'); ensureNum(req.urgency, 'ur');
  ensureEnum(req.allocation_method, 'am', ['first_come','severity','lottery','combined','NA']);
  ensureBool(req.consensus_panel, 'cp'); ensureNum(req.waiting_days, 'wd');
  ensureEnum(req.outcome, 'ot', ['allocated','denied','deferred','NA']);
  ensureStr(req.provider, 'pr');
  return { ra_id: `ra_${Date.now()}`, patient_id: req.patient_id, resource: req.resource_type, outcome: req.outcome };
}

function funcs() { return { consent_capacity, end_of_life_ethics, refusal_care, research_ethics, resource_allocation }; }
module.exports = { funcs, ValidationError };