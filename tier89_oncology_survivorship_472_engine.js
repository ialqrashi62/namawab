// filepath: tier89_oncology_survivorship_472_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function survivorship_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureStr(req.cancer_type, 'ct');
  ensureNum(req.days_since_treatment, 'dst');
  ensureBool(req.treatment_summary_done, 'tsd');
  ensureBool(req.recurrence_monitoring, 'rm');
  ensureNum(req.next_screening_weeks, 'nsw');
  ensureNum(req.late_effects_score, 'le');
  ensureEnum(req.care_coordinator, 'cc', ['assigned','pending','declined','self','other','unknown']);
  ensureBool(req.health_promotion, 'hp');
  ensureBool(req.fertility_counseling, 'fc');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function late_effects(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.years_since_treatment, 'yst');
  ensureEnum(req.cardiotoxicity, 'card', ['none','ef_decline','arrhythmia','heart_failure','ischemia','other','unknown']);
  ensureEnum(req.neuropathy, 'neur', ['none','sensory','motor','autonomic','mixed','other','unknown']);
  ensureEnum(req.renal_dysfunction, 'ren', ['none','mild','moderate','severe','dialysis','other','unknown']);
  ensureEnum(req.cognitive_changes, 'cog', ['none','mild','moderate','severe','other','unknown']);
  ensureBool(req.second_malignancy_screening, 'sms');
  ensureNum(req.screening_uptodate, 'sut');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function screening_recurrence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['breast','colon','prostate','lung','lymphoma','leukemia','cervical','melanoma','other','unknown']);
  ensureNum(req.last_screening_days, 'lsd');
  ensureBool(req.imaging_done, 'id');
  ensureBool(req.tumor_marker_done, 'tmd');
  ensureNum(req.tumor_marker_value, 'tmv');
  ensureBool(req.symptoms_review, 'sr');
  ensureBool(req.new_concerns, 'nc');
  ensureEnum(req.outcome, 'out', ['no_recurrence','suspicious','confirmed_recurrence','pending_workup','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function lifestyle_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.smoking_cessation, 'sc');
  ensureBool(req.alcohol_cessation, 'ac');
  ensureNum(req.exercise_minutes_week, 'ex');
  ensureEnum(req.diet_quality, 'dq', ['poor','fair','good','excellent','other','unknown']);
  ensureNum(req.sleep_hours, 'sl');
  ensureNum(req.stress_score, 'st');
  ensureBool(req.weight_management, 'wm');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.blood_pressure, 'bp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function followup_schedule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.months_since_treatment, 'mst');
  ensureNum(req.next_visit_months, 'nvm');
  ensureNum(req.imaging_interval_months, 'iim');
  ensureNum(req.lab_interval_months, 'lim');
  ensureBool(req.telemedicine_available, 'ta');
  ensureNum(req.compliance_score, 'cmp');
  ensureEnum(req.barriers, 'bar', ['transport','financial','work','family','language','symptoms','other','none','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { survivorship_plan, late_effects, screening_recurrence, lifestyle_counseling, followup_schedule }; }
module.exports = { funcs, ValidationError };
