// filepath: tier160_rs_753_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trial(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.trial_id, 'ti');
  ensureStr(req.trial_name, 'tn');
  ensureEnum(req.phase, 'ph', ['I','Ia','Ib','II','IIa','IIb','III','IIIa','IIIb','IV','feasibility','pilot','observational','registry','expanded_access','NA']);
  ensureEnum(req.status, 'st', ['screening','enrolled','active','completed','withdrawn','screen_failed','ineligible','declined','lost_to_followup','NA','other']);
  ensureNum(req.consent_date, 'cd');
  ensureNum(req.enrollment_date, 'ed');
  ensureNum(req.visits_completed, 'vc');
  ensureNum(req.visits_planned, 'vp');
  ensureEnum(req.arm, 'ar', ['treatment','placebo','control','comparator','dose_finding','cohort','single_arm','cross_over','NA']);
  ensureNum(req.adverse_events_count, 'ae');
  ensureBool(req.serious_adverse_event, 'sa');
  ensureStr(req.provider, 'pr');
  return { tr_id: `trl_${Date.now()}`, trial_id: req.trial_id, phase: req.phase };
}
function cohort(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.cohort_id, 'ci');
  ensureStr(req.name, 'nm');
  ensureEnum(req.type, 'tp', ['retrospective','prospective','both','cross_sectional','case_control','case_series','case_report','NA','other']);
  ensureNum(req.patient_count, 'pc');
  ensureEnum(req.inclusion, 'in', ['age','sex','diagnosis','lab_criteria','imaging','genetic','medication','procedure','comorbidity','NA','other','combination']);
  ensureNum(req.inclusion_count, 'ic');
  ensureNum(req.exclusion_count, 'ec');
  ensureNum(req.consent_count, 'cc');
  ensureEnum(req.ethics_status, 'es', ['approved','pending','amendment','expired','closed','rejected','NA']);
  ensureNum(req.last_review, 'lr');
  ensureStr(req.provider, 'pr');
  return { co_id: `crt_${Date.now()}`, cohort_id: req.cohort_id, count: req.patient_count };
}
function registry(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.registry_id, 'ri');
  ensureStr(req.name, 'nm');
  ensureEnum(req.condition, 'cn', ['AMI','stroke','HF','diabetes','cancer','CKD','COPD','asthma','CF','IBD','rheumatoid','epilepsy','parkinsons','multiple_sclerosis','cystic_fibrosis','organ_transplant','device','rare_disease','other','NA']);
  ensureNum(req.enrolled_count, 'ec');
  ensureNum(req.active_count, 'ac');
  ensureNum(req.completed_count, 'cc');
  ensureEnum(req.funding, 'fu', ['government','industry','foundation','institutional','mixed','other','NA']);
  ensureNum(req.first_patient_date, 'fp');
  ensureNum(req.last_patient_date, 'lp');
  ensureNum(req.publications_count, 'pc');
  ensureBool(req.data_use_agreement, 'du');
  ensureStr(req.provider, 'pr');
  return { rg_id: `rgy_${Date.now()}`, registry_id: req.registry_id, count: req.enrolled_count };
}
function iomt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.device_type, 'dt', ['smart_pill','ingestible_sensor','wearable_patch','continuous_monitor','smart_inhaler','smart_insulin_pen','smart_insulin_pump','smart_pillbox','connected_glucose_meter','other','NA']);
  ensureStr(req.device_id, 'di');
  ensureNum(req.data_points_30d, 'dp');
  ensureNum(req.battery_pct, 'bp');
  ensureBool(req.connected, 'cn');
  ensureBool(req.alert_sent, 'as');
  ensureNum(req.last_sync_min, 'ls');
  ensureBool(req.firmware_updated, 'fu');
  ensureNum(req.usage_days, 'ud');
  ensureEnum(req.disposition, 'di2', ['active','deactivated','lost','broken','replaced','returned','NA','other']);
  ensureStr(req.provider, 'pr');
  return { io_id: `iom_${Date.now()}`, patient_id: req.patient_id, device: req.device_type };
}
function ehr_config(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.module, 'mo');
  ensureEnum(req.action, 'ac', ['install','configure','update','uninstall','migrate','audit','rebuild','test','NA','other']);
  ensureStr(req.environment, 'en');
  ensureStr(req.version, 've');
  ensureNum(req.start_time, 'st');
  ensureNum(req.end_time, 'et');
  ensureBool(req.successful, 'su');
  ensureNum(req.users_affected, 'ua');
  ensureNum(req.duration_min, 'du');
  ensureBool(req.rollback, 'rb');
  ensureStr(req.provider, 'pr');
  return { ec_id: `ehr_${Date.now()}`, module: req.module, action: req.action };
}

function funcs() { return { trial, cohort, registry, iomt, ehr_config }; }
module.exports = { funcs, ValidationError };