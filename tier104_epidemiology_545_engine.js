// filepath: tier104_epidemiology_545_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function disease_surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.disease, 'dis');
  ensureNum(req.cases_count, 'cc');
  ensureNum(req.incidence_rate, 'ir');
  ensureEnum(req.trend, 'tr', ['increasing','stable','decreasing','outbreak','other','unknown']);
  ensureNum(req.high_risk_groups, 'hrg');
  ensureBool(req.public_health_alert, 'pha');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}
function outbreak_investigation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.investigation_id, 'iid');
  ensureStr(req.pathogen, 'pat');
  ensureStr(req.setting, 'set');
  ensureNum(req.cases_count, 'cc');
  ensureNum(req.controls, 'ctrl');
  ensureNum(req.attack_rate, 'ar');
  ensureBool(req.source_identified, 'si');
  ensureStr(req.provider, 'pr');
  return { iid: req.investigation_id };
}
function vaccine_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.record_id, 'rid');
  ensureStr(req.vaccine, 'vac');
  ensureNum(req.coverage_pct, 'cp');
  ensureNum(req.herd_immunity_threshold, 'hit');
  ensureNum(req.at_risk_populations, 'arp');
  ensureNum(req.outbreak_risk, 'or');
  ensureStr(req.provider, 'pr');
  return { rid: req.record_id };
}
function screening_program(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.program_id, 'pid');
  ensureStr(req.program, 'prog');
  ensureNum(req.target_population, 'tp');
  ensureNum(req.screened, 'sc');
  ensureNum(req.detection_rate, 'dr');
  ensureNum(req.follow_up_compliance, 'fuc');
  ensureStr(req.provider, 'pr');
  return { pid: req.program_id };
}
function registry_data(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.registry_id, 'rid');
  ensureStr(req.registry, 'reg');
  ensureNum(req.cases_enrolled, 'ce');
  ensureNum(req.completeness_pct, 'cp');
  ensureNum(req.data_quality_score, 'dqs');
  ensureNum(req.follow_up_years, 'fuy');
  ensureStr(req.provider, 'pr');
  return { rid: req.registry_id };
}

function funcs() { return { disease_surveillance, outbreak_investigation, vaccine_tracking, screening_program, registry_data }; }
module.exports = { funcs, ValidationError };
