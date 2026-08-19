// filepath: tier94_pulm_sleep_494_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function osa_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.stopbang_score, 'sbs');
  ensureNum(req.a_hi, 'ahi');
  ensureNum(req.ess_score, 'ess');
  ensureNum(req.neck_circumference, 'nc');
  ensureNum(req.bmi, 'bmi');
  ensureBool(req.history_hypertension, 'htn');
  ensureEnum(req.osa_classification, 'oc', ['none','mild','moderate','severe','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cpap_titration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.titration_id, 'tid');
  ensureEnum(req.machine, 'mac', ['fixed_cpap','auto_cpap','bipap','other','unknown','none']);
  ensureNum(req.initial_pressure, 'ip');
  ensureNum(req.final_pressure, 'fp');
  ensureNum(req.ahi_after, 'ahi');
  ensureEnum(req.mask_type, 'mt', ['nasal','full_face','nasal_pillows','hybrid','other','unknown']);
  ensureNum(req.leak_score, 'ls');
  ensureNum(req.compliance_pct, 'comp');
  ensureStr(req.provider, 'pr');
  return { tid: req.titration_id };
}
function polysomnography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.sleep_efficiency, 'se');
  ensureNum(req.rem_pct, 'rc');
  ensureNum(req.n1_pct, 'n1');
  ensureNum(req.n2_pct, 'n2');
  ensureNum(req.n3_pct, 'n3');
  ensureNum(req.ahi_supine, 'ahs');
  ensureNum(req.ahi_rem, 'ar');
  ensureNum(req.arousal_index, 'ai');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function sleep_hygiene(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.caffeine_intake, 'ci');
  ensureNum(req.alcohol_intake, 'ai');
  ensureNum(req.screen_time, 'st');
  ensureNum(req.exercise_hours_week, 'ehw');
  ensureBool(req.bedtime_regular, 'br');
  ensureNum(req.sleep_duration, 'sd');
  ensureNum(req.sleep_quality_score, 'sqs');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function narcolepsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ess_score, 'ess');
  ensureNum(req.sleep_latency_min, 'slm');
  ensureBool(req.sleep_paralysis, 'sp');
  ensureBool(req.hypnagogic_hallucinations, 'hh');
  ensureBool(req.cataplexy, 'cat');
  ensureNum(req.mslt_sleep_latency, 'msl');
  ensureNum(req.mslt_soremp, 'sor');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { osa_assessment, cpap_titration, polysomnography, sleep_hygiene, narcolepsy }; }
module.exports = { funcs, ValidationError };
