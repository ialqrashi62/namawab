// filepath: tier139_tri_665_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trial_create(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.trial_id, 'tri');
  ensureStr(req.title, 'tl');
  ensureStr(req.sponsor, 'sp');
  ensureEnum(req.phase, 'ph', ['0','1','2','3','4','observational','registry','expanded_access']);
  ensureNum(req.target_enrollment, 'te');
  ensureStr(req.inclusion, 'in');
  ensureStr(req.exclusion, 'ex');
  ensureEnum(req.status, 'st', ['draft','IRB_pending','IRB_approved','active','suspended','closed','terminated','completed']);
  return { tr_id: `tr_${Date.now()}`, trial_id: req.trial_id, phase: req.phase, status: req.status };
}
function enroll(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.trial_id, 'tr2');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.consent, 'cn', ['pending','signed','refused','withdrawn','deferred','expanded']);
  ensureNum(req.eligibility_score, 'es');
  ensureBool(req.inclusion_met, 'imm');
  ensureBool(req.exclusion_met, 'emm');
  ensureStr(req.screening_id, 'sid');
  ensureStr(req.provider, 'pr');
  return { en_id: `en_${Date.now()}`, trial_id: req.trial_id, patient_id: req.patient_id, consent: req.consent };
}
function visit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.trial_id, 'tr3');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.visit_num, 'vn');
  ensureStr(req.visit_date, 'vd');
  ensureEnum(req.visit_type, 'vt', ['screening','baseline','randomization','treatment','followup','safety','PK','PD','efficacy','unplanned']);
  ensureNum(req.adherence_pct, 'ah');
  ensureNum(req.adverse_events, 'ae');
  ensureStr(req.provider, 'pr');
  return { v_id: `v_${Date.now()}`, trial_id: req.trial_id, patient_id: req.patient_id, visit_num: req.visit_num };
}
function ae_report(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.trial_id, 'tr4');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','life_threatening','fatal']);
  ensureNum(req.ctcae_grade, 'cg');
  ensureBool(req.serious, 'sr');
  ensureBool(req.treatment_related, 'tr');
  ensureStr(req.expedited_report, 'er');
  ensureStr(req.provider, 'pr');
  return { ae_id: `ae_${Date.now()}`, trial_id: req.trial_id, severity: req.severity, ctcae: req.ctcae_grade };
}
function trial_outcome(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.trial_id, 'tr5');
  ensureEnum(req.endpoint, 'ep', ['primary','secondary','safety','PK','PD','quality_of_life','overall_survival','progression_free','response_rate','biomarker']);
  ensureStr(req.result, 'rs');
  ensureNum(req.p_value, 'pv');
  ensureBool(req.met, 'mt');
  ensureStr(req.report_path, 'rp');
  ensureStr(req.provider, 'pr');
  return { ou_id: `ou_${Date.now()}`, trial_id: req.trial_id, endpoint: req.endpoint, result: req.result, p_value: req.p_value };
}

function funcs() { return { trial_create, enroll, visit, ae_report, trial_outcome }; }
module.exports = { funcs, ValidationError };
