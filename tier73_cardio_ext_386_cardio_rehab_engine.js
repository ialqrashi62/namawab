// filepath: tier73_cardio_ext_386_cardio_rehab_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cardiac_rehab_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureEnum(req.diagnosis, 'dx', ['nstem','stem','pci','cabg','stable_angina','heart_failure','valve_surgery','vad','transplant','other','high_risk_cad','atrial_fib','post_afib_ablation']);
  ensureStr(req.referral_date, 'rd');
  ensureEnum(req.phase, 'phase', ['1','2','3','4','1_inpatient','2_outpatient','3_maintenance','4_long_term','phase_1','phase_2','phase_3','phase_4']);
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high','unknown']);
  ensureStr(req.initial_visit_date, 'ivd');
  ensureNum(req.peak_vo2, 'pv');
  ensureBool(req.muscle_strength_assessed, 'msa');
  ensureStr(req.goals_set, 'gs');
  ensureStr(req.barriers, 'bar');
  ensureNum(req.program_duration_weeks, 'pdw');
  return { phase: req.phase };
}
function exercise_prescription(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prescription_id, 'pid');
  ensureEnum(req.modality, 'mod', ['treadmill','bike','elliptical','rowing','arm_ergometer','strength','flexibility','aquatic','walking','cycling','circuit','other']);
  ensureEnum(req.intensity, 'int', ['low','moderate','vigorous','high','very_light','light','low_mod','mod_vigorous','other']);
  ensureNum(req.target_hr, 'thr');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.frequency_per_week, 'fpw');
  ensureEnum(req.progression, 'prog', ['gradual','aggressive','maintenance','regression','rehab_initiation','rapid','none','other']);
  ensureStr(req.warnings, 'warn');
  ensureEnum(req.rescue_meds_available, 'rma', ['none','nitroglycerin','aspirin','albuterol','epinephrine','defibrillator','oxygen','multiple','other']);
  ensureStr(req.signed_by, 'sb');
  ensureNum(req.next_review, 'nr');
  return { modality: req.modality };
}
function cardiac_rehab_progress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prescription_id, 'pid');
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.sessions_goal, 'sg');
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.current_vo2, 'cv');
  ensureNum(req.vo2_baseline, 'vb');
  ensureBool(req.pain_free, 'pf');
  ensureEnum(req.medication_changes, 'mc', ['none','entresto','beta_bloker','mra','sglt2','statin','other','statin_change','diuretic','multiple']);
  ensureEnum(req.goal_progress, 'gp', ['on_track','behind','ahead','stalled','completed','regressing','completed_with_caveats','other']);
  ensureStr(req.next_review_date, 'nrd');
  ensureStr(req.provider, 'pr');
  return { completed: req.sessions_completed };
}
function cardiac_rehab_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.discharge_id, 'did');
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.program_duration_weeks, 'pdw');
  ensureBool(req.met_goals, 'mg');
  ensureNum(req.vo2_improvement_pct, 'vip');
  ensureEnum(req.maintenance_plan, 'mp', ['home_exercise','community_program','gym_3x_week','self_directed','structured','maintenance_phase','long_term_program','other']);
  ensureBool(req.community_program_referred, 'cpr');
  ensureStr(req.risk_reduction_strategies, 'rrs');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.discharge_provider, 'dp');
  return { vo2_imp: req.vo2_improvement_pct };
}
function remote_cardiac_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.monitor_id, 'mid');
  ensureEnum(req.device, 'dev', ['bluetooth_bp_monitor','smartwatch','implanted_loop_recorder','weight_scale','implanted_hemodynamic','wearable_ecg','arterial_line','pulse_ox','remote_pacemaker','other']);
  ensureNum(req.readings_per_week, 'rpw');
  ensureNum(req.adherence_pct, 'ap');
  ensureStr(req.avg_bp, 'abp');
  ensureNum(req.alert_events, 'ae');
  ensureBool(req.provider_reviewed, 'prev');
  ensureStr(req.action_taken, 'at');
  ensureNum(req.next_review, 'nr');
  ensureEnum(req.platform, 'plat', ['hf_engage','myChart','bumble','heart_failure_home','spencer','other','virtual_visits','meda','telehealth','zoom','none']);
  return { mid: req.monitor_id };
}

function funcs() { return { cardiac_rehab_intake, exercise_prescription, cardiac_rehab_progress, cardiac_rehab_discharge, remote_cardiac_monitoring }; }
module.exports = { funcs, ValidationError };