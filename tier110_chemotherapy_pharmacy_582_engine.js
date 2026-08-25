// filepath: tier110_chemotherapy_pharmacy_582_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function regimen_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.regimen_id, 'rid');
  ensureStr(req.regimen, 'reg');
  ensureNum(req.cycle, 'cy');
  ensureNum(req.day, 'dy');
  ensureNum(req.bsa, 'bsa');
  ensureEnum(req.calculation_method, 'cm', ['bsa','auc','weight','fixed','other','unknown']);
  ensureNum(req.doses, 'ds');
  ensureStr(req.provider, 'pr');
  return { rid: req.regimen_id };
}
function dose_calculation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dose_id, 'did');
  ensureStr(req.medication, 'med');
  ensureNum(req.calculated_dose_mg, 'cd');
  ensureNum(req.actual_dose_mg, 'ad');
  ensureNum(req.adjustment_pct, 'ap');
  ensureBool(req.cap_applied, 'ca');
  ensureBool(req.renal_adjustment, 'ra');
  ensureStr(req.provider, 'pr');
  return { did: req.dose_id };
}
function premedication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.premed_id, 'pid');
  ensureStr(req.medications, 'meds');
  ensureNum(req.admin_time_min, 'atm');
  ensureEnum(req.emesis_risk, 'er', ['minimal','low','moderate','high','other','unknown']);
  ensureEnum(req.response, 'resp', ['no_nausea','mild_nausea','moderate_nausea','severe_nausea','vomiting','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.premed_id };
}
function toxicity_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.monitor_id, 'mid');
  ensureNum(req.cycle, 'cy');
  ensureNum(req.neutrophil_count, 'nc');
  ensureNum(req.platelet_count, 'pc');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.bilirubin, 'br');
  ensureNum(req.toxicity_grade, 'tg');
  ensureStr(req.provider, 'pr');
  return { mid: req.monitor_id };
}
function cycle_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.cycle, 'cy');
  ensureNum(req.day, 'dy');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','not_assessed','other','unknown']);
  ensureNum(req.dose_reduction_pct, 'drp');
  ensureNum(req.delay_days, 'dd');
  ensureBool(req.next_cycle_approved, 'nca');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}

function funcs() { return { regimen_protocol, dose_calculation, premedication, toxicity_monitoring, cycle_assessment }; }
module.exports = { funcs, ValidationError };