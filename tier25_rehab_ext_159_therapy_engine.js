// filepath: tier25_rehab_ext_159_therapy_engine.js
// TIER25_REHAB-159: Therapy plan, PT/OT/SLP
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pt_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sessions_per_week, 'sessions');
  ensureNumber(req.duration_weeks, 'weeks');
  ensureEnum(req.discipline, 'discipline', ['orthopedic','neurologic','cardiac','pulmonary','pediatric','geriatric','sports','wound','lymphedema','vestibular','amputee','aquatic','general','other']);
  ensureEnum(req.goal, 'goal', ['mobility','strength','balance','endurance','pain_reduction','flexibility','coordination','return_to_sport','return_to_work','other']);
  ensureBool(req.home_exercise_program, 'hep');
  let status;
  if (req.sessions_per_week < 2) status = 'less_than_2x_week_add_sessions_or_hep';
  else if (req.duration_weeks < 4) status = 'short_episode_review_goals';
  else if (!req.home_exercise_program) status = 'hep_required_for_progress';
  else status = 'pt_plan_appropriate';
  return { status, sessions: req.sessions_per_week };
}

function ot_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.focus, 'focus', ['adl','iadl','fine_motor','visual_perceptual','cognitive','sensory','feeding','dressing','work_hardening','driving','other']);
  ensureNumber(req.sessions_per_week, 'sessions');
  ensureBool(req.assistive_device_prescribed, 'device');
  ensureEnum(req.setting, 'setting', ['acute_inpatient','rehab_inpatient','snf','outpatient','home_health','day_treatment','community','school','other']);
  ensureBool(req.family_training, 'family');
  let status;
  if (req.focus === 'driving' && !req.assistive_device_prescribed) status = 'driving_assessment_with_drs';
  else if (!req.family_training && req.setting === 'rehab_inpatient') status = 'family_training_required';
  else status = 'ot_plan_appropriate';
  return { status, focus: req.focus };
}

function slp_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.diagnosis, 'diagnosis', ['aphasia','dysarthria','apraxia','dysphagia','cognitive_communication','voice','fluency','other']);
  ensureBool(req.swallow_study_done, 'swallow');
  ensureNumber(req.sessions_per_week, 'sessions');
  ensureBool(req.tracheostomy, 'tracheostomy');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','profound','other']);
  let status;
  if (req.diagnosis === 'dysphagia' && !req.swallow_study_done) status = 'dysphagia_swallow_study_required';
  else if (req.severity === 'severe' && req.sessions_per_week < 3) status = 'severe_frequent_sessions_required';
  else status = 'slp_plan_appropriate';
  return { status, dx: req.diagnosis };
}

function discharge_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.disposition, 'disposition', ['home_independent','home_with_family','home_with_home_health','snf','ltc','rehab_inpatient','assisted_living','other']);
  ensureNumber(req.los_days, 'los');
  ensureBool(req.family_educated, 'family');
  ensureBool(req.durable_equipment_arranged, 'dme');
  ensureBool(req.home_assessment_done, 'home_assess');
  ensureNumber(req.fim_score, 'fim');
  let status;
  if (req.disposition === 'home_independent' && req.fim_score < 80) status = 'fim_low_for_independent_home';
  else if (req.disposition === 'home_with_family' && !req.family_educated) status = 'family_education_required';
  else if (!req.durable_equipment_arranged) status = 'dme_arrange_before_discharge';
  else if (!req.home_assessment_done && req.disposition !== 'rehab_inpatient') status = 'home_assessment_recommended';
  else status = 'discharge_plan_appropriate';
  return { status, disposition: req.disposition };
}

function progress(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.days_since_start, 'days');
  ensureNumber(req.fim_baseline, 'fim_base');
  ensureNumber(req.fim_current, 'fim_curr');
  ensureBool(req.goal_met, 'goal_met');
  ensureEnum(req.barrier, 'barrier', ['none','pain','fatigue','cognitive','behavioral','medical_instability','social','language','transportation','equipment','other']);
  let status;
  const gain = req.fim_current - req.fim_baseline;
  if (req.goal_met) status = 'goal_met_progress_to_next_phase';
  else if (gain < 5 && req.days_since_start > 14) status = 'minimal_gain_review_barriers';
  else if (req.barrier !== 'none') status = 'barrier_identified_address_rehab_plan';
  else status = 'progress_appropriate';
  return { status, gain };
}

const CITATIONS = { APTA_PT_2024: 'APTA PT 2024', AOTA_OT_2024: 'AOTA OT 2024', ASHA_SLP_2024: 'ASHA SLP 2024' };

function funcs() { return { pt_plan, ot_plan, slp_plan, discharge_plan, progress }; }
module.exports = { funcs, CITATIONS, ValidationError };