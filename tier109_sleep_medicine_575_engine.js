// filepath: tier109_sleep_medicine_575_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sleep_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other','unknown']);
  ensureBool(req.daytime_impairment, 'di');
  ensureNum(req.sleep_hours, 'sh');
  ensureNum(req.epworth_score, 'es');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function polysomnography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.psg_id, 'pid');
  ensureStr(req.study_date, 'sd');
  ensureNum(req.ahi, 'ahi');
  ensureNum(req.min_spo2, 'ms');
  ensureNum(req.total_sleep_time, 'tst');
  ensureNum(req.sleep_efficiency, 'se');
  ensureEnum(req.diagnosis, 'dx', ['none','mild_osa','moderate_osa','severe_osa','central_osa','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.psg_id };
}
function cpap_titration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.titration_id, 'tid');
  ensureEnum(req.device, 'dv', ['cpap','bipap','apap','other','unknown']);
  ensureNum(req.pressure_cm, 'pc');
  ensureEnum(req.mask_type, 'mt', ['nasal','full_face','nasal_pillows','other','unknown']);
  ensureNum(req.ahi_post, 'ap');
  ensureNum(req.compliance, 'comp');
  ensureNum(req.hours_per_night, 'hpn');
  ensureStr(req.provider, 'pr');
  return { tid: req.titration_id };
}
function insomnia_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.treatment_id, 'tid');
  ensureEnum(req.type, 'tp', ['cbt_i','medication','sleep_restriction','relaxation','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.sessions, 'ss');
  ensureEnum(req.response, 'resp', ['complete','partial','none','worsening','other','unknown']);
  ensureNum(req.sleep_efficiency_change, 'sec');
  ensureStr(req.provider, 'pr');
  return { tid: req.treatment_id };
}
function sleep_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.followup_id, 'fid');
  ensureNum(req.weeks_since_diagnosis, 'wsd');
  ensureNum(req.treatment_adherence, 'ta');
  ensureNum(req.symptom_improvement, 'si');
  ensureNum(req.ahi_recheck, 'ar');
  ensureNum(req.epworth_recheck, 'er');
  ensureStr(req.provider, 'pr');
  return { fid: req.followup_id };
}

function funcs() { return { sleep_assessment, polysomnography, cpap_titration, insomnia_treatment, sleep_followup }; }
module.exports = { funcs, ValidationError };