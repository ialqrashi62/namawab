// filepath: tier85_pain_ext_451_pain_rehab_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pt_ot(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.discipline, 'dc', ['pt','ot','pt_ot','other','unknown']);
  ensureNum(req.sessions_per_week, 'spw');
  ensureNum(req.session_duration_min, 'sdm');
  ensureEnum(req.exercise_type, 'et', ['strengthening','flexibility','endurance','aerobic','balance','combined','other']);
  ensureNum(req.home_program_compliance, 'hpc');
  ensureNum(req.progress_score, 'ps');
  ensureStr(req.functional_goals, 'fg');
  ensureNum(req.pain_score, 'pns');
  ensureEnum(req.discharge_plan, 'dp', ['continue','then_dc','dc','refer','self_managed']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function tens(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.frequency_hz, 'fh');
  ensureNum(req.pulse_width_us, 'pw');
  ensureStr(req.electrode_placement, 'ep');
  ensureNum(req.session_duration_min, 'sdm');
  ensureNum(req.sessions_per_week, 'spw');
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureBool(req.sleep_improvement, 'si');
  ensureBool(req.medication_reduction, 'mr');
  ensureEnum(req.complications, 'comp', ['none','skin_irritation','burn','allergic','muscle_fatigue','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function biofeedback(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.modality, 'mod', ['emg','temperature','gsr','heart_rate','hrv','other']);
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.stress_reduction_score, 'srs');
  ensureNum(req.muscle_tension_reduction, 'mtr');
  ensureNum(req.anxiety_score, 'as');
  ensureNum(req.home_practice_compliance, 'hpc');
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function work_hardening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.program_duration_weeks, 'pdw');
  ensureNum(req.weekly_hours, 'wh');
  ensureNum(req.physical_capacity_score, 'pcs');
  ensureNum(req.functional_capacity_score, 'fcs');
  ensureEnum(req.return_to_work_plan, 'rtwp', ['modified_duty','full_duty','restricted','off_work','gradual_return']);
  ensureNum(req.job_match_score, 'jms');
  ensureEnum(req.discharge_recommendation, 'drec', ['rtw','disability','vocational_rehab','refer','continue']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function functional_restoration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.program, 'prog', ['intensive','standard','light','modular','other']);
  ensureNum(req.program_duration_weeks, 'pdw');
  ensureNum(req.weekly_hours, 'wh');
  ensureNum(req.initial_function, 'if');
  ensureNum(req.final_function, 'ff');
  ensureNum(req.pain_score_change, 'psc');
  ensureNum(req.return_to_work_pct, 'rtw');
  ensureEnum(req.discharge_plan, 'dp', ['rtw_full_duty','modified_duty','vocational','disability','other']);
  ensureEnum(req.complications, 'comp', ['none','flare_up','drop_out','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { pt_ot, tens, biofeedback, work_hardening, functional_restoration }; }
module.exports = { funcs, ValidationError };