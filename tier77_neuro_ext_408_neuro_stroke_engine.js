// filepath: tier77_neuro_ext_408_neuro_stroke_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.nihss_score, 'ns');
  ensureEnum(req.onset_time, 'ot', ['known_under_4_5h','known_over_4_5h','unknown_wake_up','unknown_other','last_known_well','unknown','other']);
  ensureBool(req.thrombolysis_eligible, 'te');
  ensureStr(req.ct_findings, 'ctf');
  ensureStr(req.risk_factors, 'rf');
  ensureNum(req.door_to_needle, 'dtn');
  ensureStr(req.medications, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function stroke_thrombolysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.door_to_needle_min, 'dtn');
  ensureStr(req.therapy_initiated, 'ti');
  ensureBool(req.hemorrhagic_conversion, 'hc');
  ensureNum(req.nihss_24h, 'n24');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureEnum(req.complications, 'comp', ['none','symptomatic_ich','angioedema','hemorrhage','other','mild_ich']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function stroke_post_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.day, 'day');
  ensureNum(req.nihss_score, 'ns');
  ensureBool(req.aspirin_started, 'as');
  ensureBool(req.statin_started, 'ss');
  ensureEnum(req.rehab_screen, 'rs', ['passed','failed','declined','pending','unknown','other']);
  ensureStr(req.swallow_screen, 'sw');
  ensureNum(req.bp_target_systolic, 'bts');
  ensureStr(req.mobility_assessment, 'mob');
  ensureStr(req.dvt_prophylaxis, 'dvt');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function stroke_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.rankin_score, 'rs');
  ensureNum(req.barthel_index, 'bi');
  ensureBool(req.physical_therapy_started, 'pts');
  ensureBool(req.occupational_therapy_started, 'ots');
  ensureBool(req.speech_therapy_started, 'sts');
  ensureNum(req.sessions_per_week, 'spw');
  ensureStr(req.goals, 'goals');
  ensureStr(req.family_education, 'fe');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function stroke_secondary_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.antiplatelet_started, 'as');
  ensureBool(req.statin_started, 'ss');
  ensureEnum(req.bp_target, 'bpt', ['lt130_80','lt140_90','lt150_90','individualized','unknown','other']);
  ensureBool(req.atrial_fib_anticoagulation, 'afa');
  ensureBool(req.lifestyle_counseling, 'lc');
  ensureStr(req.diet_recommendation, 'dr');
  ensureStr(req.smoking_cessation, 'sc');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { stroke_initial, stroke_thrombolysis, stroke_post_care, stroke_rehab, stroke_secondary_prevention }; }
module.exports = { funcs, ValidationError };