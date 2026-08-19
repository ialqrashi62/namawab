// filepath: tier86_card_ext_456_card_rehab_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cr_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.referral_diagnosis, 'rd', ['post_mi','post_pci','post_cabg','heart_failure','stable_angina','valve_repair','transplant','other','unknown']);
  ensureNum(req.enrollment_weeks, 'ew');
  ensureNum(req.initial_6mwt_m, 'i6m');
  ensureEnum(req.exercise_capacity, 'ec', ['reduced','limited','preserved','high','unknown','other']);
  ensureEnum(req.risk_stratification, 'rs', ['low','moderate','high','very_high','unknown']);
  ensureNum(req.initial_session_count, 'isc');
  ensureEnum(req.cr_program, 'crp', ['standard_36','extended','maintenance','home_based','other','unknown']);
  ensureNum(req.baseline_qol_score, 'bqs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cr_phase2(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.phase, 'phase', ['phase_1','phase_2','phase_3','phase_4','other']);
  ensureNum(req.session_count, 'sc');
  ensureNum(req.week_in_program, 'wip');
  ensureNum(req.exercise_minute_capacity, 'emc');
  ensureNum(req.borg_score, 'bs');
  ensureEnum(req.bp_response, 'br', ['adequate','exaggerated','flat','hypotensive','hypertensive','unknown']);
  ensureNum(req.hr_max_reached, 'hmr');
  ensureNum(req.attendance_pct, 'ap');
  ensureNum(req.progress_score, 'ps');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cr_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.discharge_weeks, 'dw');
  ensureNum(req.final_6mwt_m, 'f6m');
  ensureEnum(req.exercise_capacity, 'ec', ['improved','maintained','limited','reduced','unknown','other']);
  ensureNum(req.sessions_attended, 'sa');
  ensureBool(req.program_completion, 'pc');
  ensureNum(req.qol_score_change, 'qsc');
  ensureBool(req.long_term_exercise_plan, 'ltep');
  ensureBool(req.self_managed_exercise, 'sme');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cr_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.months_post_dc, 'mpd');
  ensureBool(req.exercise_adherence, 'ea');
  ensureNum(req.sessions_per_week, 'spw');
  ensureEnum(req.intensity, 'int', ['low','moderate','vigorous','mixed','unknown']);
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.lipid_ldl, 'lldl');
  ensureBool(req.rehab_support_referral_needed, 'rsrn');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cr_outcomes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.study_period_months, 'spm');
  ensureNum(req.participants_count, 'pc');
  ensureNum(req.completion_pct, 'cpct');
  ensureNum(req.improvement_score, 'is');
  ensureNum(req.rehospitalization_pct, 'rhp');
  ensureNum(req.mortality_pct, 'mp');
  ensureNum(req.patient_satisfaction, 'psat');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.improvement_summary, 'iss');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { cr_initial, cr_phase2, cr_discharge, cr_followup, cr_outcomes }; }
module.exports = { funcs, ValidationError };