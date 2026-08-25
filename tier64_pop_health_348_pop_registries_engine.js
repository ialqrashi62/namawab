// filepath: tier64_pop_health_348_pop_registries_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diabetes_registry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.registry_type, 'rt', ['diabetes_type1','diabetes_type2','gestational','secondary','pre_diabetes','at_risk']);
  ensureStr(req.enrollment_date, 'ed');
  ensureNum(req.last_a1c, 'a1c');
  ensureStr(req.last_a1c_date, 'lad');
  ensureStr(req.complications, 'comp');
  ensureBool(req.active, 'act');
  ensureStr(req.next_due, 'nd');
  return { type: req.registry_type };
}
function hypertension_registry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.registry_type, 'rt');
  ensureStr(req.avg_bp, 'abp');
  ensureEnum(req.control_status, 'cs', ['controlled','uncontrolled','untreated','resistant','white_coat','masked']);
  ensureNum(req.medication_adherence, 'ma');
  ensureNum(req.follow_up_months, 'fum');
  ensureBool(req.active, 'act');
  return { bp: req.avg_bp };
}
function ckd_registry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.registry_type, 'rt');
  ensureNum(req.egfr, 'egfr');
  ensureEnum(req.proteinuria, 'pu', ['normal','mild','moderate','severe','nephrotic']);
  ensureBool(req.nephrology_referral, 'nr');
  ensureStr(req.kdigo_category, 'kc');
  ensureBool(req.active, 'act');
  return { egfr: req.egfr };
}
function asthma_registry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.registry_type, 'rt');
  ensureNum(req.act_score, 'act');
  ensureStr(req.controller_med, 'cm');
  ensureNum(req.er_visits_year, 'er');
  ensureEnum(req.step_therapy, 'st', ['step_1','step_2','step_3','step_4','step_5','step_6']);
  ensureBool(req.active, 'act');
  return { act: req.act_score };
}
function heart_failure_registry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.registry_type, 'rt', ['hfref','hfpef','hfmrEF','transitional','advanced','recovered']);
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.nyha_class, 'nc');
  ensureStr(req.gdmt, 'gdmt');
  ensureBool(req.active, 'act');
  ensureStr(req.device, 'dev');
  return { ef: req.ef_pct };
}

function funcs() { return { diabetes_registry, hypertension_registry, ckd_registry, asthma_registry, heart_failure_registry }; }
module.exports = { funcs, ValidationError };