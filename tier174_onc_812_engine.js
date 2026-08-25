// filepath: tier174_onc_812_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_staging(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.tnm, 'tn', ['Tx','T0','T1','T2','T3','T4','NA']);
  ensureStr(req.stage, 'st'); ensureEnum(req.grade, 'gr', ['I','II','III','IV','NA']);
  ensureStr(req.biomarkers, 'bm'); ensureEnum(req.imaging, 'im', ['CT','MRI','PET','none','NA']);
  ensureNum(req.metastasis_count, 'mc'); ensureEnum(req.treatment_plan, 'tp', ['surgery','chemo','radiation','combination','palliative','NA']);
  ensureStr(req.provider, 'pr');
  return { cs_id: `cs_${Date.now()}`, patient_id: req.patient_id, tnm: req.tnm, st: req.stage };
}

function path_review(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.specimen, 'sp'); ensureEnum(req.pathology, 'pa', ['adenocarcinoma','squamous','lymphoma','sarcoma','benign','NA']);
  ensureEnum(req.grade, 'gr', ['I','II','III','IV','NA']);
  ensureNum(req.margins_mm, 'mm'); ensureStr(req.biomarkers, 'bm');
  ensureNum(req.biomarkers_count, 'bc'); ensureEnum(req.recommended_treatment, 'rt', ['FOLFOX','FOLFOXIRI','chemo_radiation','targeted','none','NA']);
  ensureStr(req.provider, 'pr');
  return { pr_id: `pr_${Date.now()}`, patient_id: req.patient_id, path: req.pathology, gc: req.grade };
}

function tumor_board(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.diagnosis, 'dx');
  ensureStr(req.stage, 'st'); ensureNum(req.cases_count, 'cc');
  ensureStr(req.consensus, 'cn'); ensureNum(req.duration_min, 'du');
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { tb_id: `tb_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, cn: req.consensus };
}

function clinical_trial(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.trial_id, 'ti');
  ensureEnum(req.phase, 'ph', ['I','II','III','IV','NA']);
  ensureBool(req.eligibility_met, 'em'); ensureNum(req.enrollment_date, 'ed');
  ensureNum(req.cycles_planned, 'cp'); ensureNum(req.cycles_completed, 'cc');
  ensureNum(req.adverse_count, 'ac'); ensureStr(req.provider, 'pr');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, trial: req.trial_id, cc: req.cycles_completed };
}

function survivorship_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_since_dx, 'ms'); ensureNum(req.qol_score, 'qs');
  ensureNum(req.recurrence_risk_pct, 'rr'); ensureBool(req.surveillance_imaging, 'si');
  ensureNum(req.late_effects_score, 'le'); ensureBool(req.exercise, 'ex');
  ensureNum(req.sleep_score, 'ss'); ensureStr(req.provider, 'pr');
  return { sf_id: `sf_${Date.now()}`, patient_id: req.patient_id, qol: req.qol_score, ms: req.months_since_dx };
}

function funcs() { return { cancer_staging, path_review, tumor_board, clinical_trial, survivorship_fup }; }
module.exports = { funcs, ValidationError };