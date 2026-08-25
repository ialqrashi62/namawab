// filepath: tier25_rehab_ext_161_neuro_engine.js
// TIER25_REHAB-161: Neurorehab (stroke, TBI, SCI)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function nih_stroke(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.loc_questions, 'loc');
  ensureNumber(req.loc_commands, 'loc_cmd');
  ensureNumber(req.best_gaze, 'gaze');
  ensureNumber(req.visual_fields, 'vf');
  ensureNumber(req.facial_palsy, 'face');
  ensureNumber(req.motor_arm_left, 'motor_al');
  ensureNumber(req.motor_arm_right, 'motor_ar');
  ensureNumber(req.motor_leg_left, 'motor_ll');
  ensureNumber(req.motor_leg_right, 'motor_lr');
  ensureNumber(req.limb_ataxia, 'ataxia');
  ensureNumber(req.sensory, 'sens');
  ensureNumber(req.best_language, 'lang');
  ensureNumber(req.neglect, 'neglect');
  const total = req.loc_questions + req.loc_commands + req.best_gaze + req.visual_fields + req.facial_palsy + req.motor_arm_left + req.motor_arm_right + req.motor_leg_left + req.motor_leg_right + req.limb_ataxia + req.sensory + req.best_language + req.neglect;
  let status;
  if (total === 0) status = 'nihss_zero_no_deficit';
  else if (total <= 4) status = 'nihss_minor_stroke';
  else if (total <= 15) status = 'nihss_moderate_stroke';
  else if (total <= 20) status = 'nihss_moderate_severe_stroke';
  else status = 'nihss_severe_stroke';
  return { status, total };
}

function coma_recovery(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.crs_r_level, 'crs_r_level', ['none','auditory','visual','motor','oromotor','communication','arousal','other']);
  ensureNumber(req.days_since_injury, 'days');
  ensureBool(req.follows_command, 'cmd');
  ensureEnum(req.diagnosis, 'diagnosis', ['tbi_traumatic','tbi_anoxic','stroke','encephalitis','other']);
  let status;
  if (req.days_since_injury < 28 && req.crs_r_level === 'none') status = 'acute_subacute_recovery_continue';
  else if (req.follows_command) status = 'follows_commands_emerging_minimally_conscious';
  else if (req.crs_r_level === 'communication') status = 'crsr_emerged_minimally_conscious_state';
  else status = 'crsr_assessed';
  return { status, level: req.crs_r_level };
}

function sci_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.injury_level, 'injury_level', ['c1','c2','c3','c4','c5','c6','c7','c8','t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','t11','t12','l1','l2','l3','l4','l5','s1','s2','s3','s4','s5','unknown','other']);
  ensureEnum(req.ais_grade, 'ais_grade', ['a_complete','b_sensory_incomplete','c_motor_incomplete_low','d_motor_incomplete_high','e_normal','unknown','other']);
  ensureNumber(req.days_since_injury, 'days');
  ensureBool(req.pressure_injury_present, 'pi');
  let status;
  if (req.ais_grade === 'a_complete' && req.days_since_injury < 30) status = 'acute_ais_a_full_rehab_plan';
  else if (req.injury_level === 'c4' && req.days_since_injury > 30) status = 'high_cervical_review_vent_wean';
  else if (req.pressure_injury_present) status = 'pi_prevention_required_review_cushion_turning';
  else status = 'sci_assessment_appropriate';
  return { status, level: req.injury_level };
}

function dysphagia(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.dysphagia_severity, 'dysphagia_severity', ['normal','mild','moderate','severe','profound','unknown','other']);
  ensureEnum(req.aspiration_risk, 'aspiration_risk', ['low','moderate','high','very_high','unknown','other']);
  ensureEnum(req.diet_texture, 'diet_texture', ['regular','soft','minced','puree','npo','liquids_thin','liquids_nectar','liquids_honey','liquids_pudding','mixed','other']);
  ensureBool(req.cough_reflex, 'cough');
  ensureBool(req.swallow_study_done, 'study');
  let status;
  if (req.dysphagia_severity === 'profound' && req.diet_texture !== 'npo') status = 'profound_dysphagia_npo_required';
  else if (req.aspiration_risk === 'very_high' && !req.swallow_study_done) status = 'very_high_aspiration_swallow_study_required';
  else if (!req.cough_reflex) status = 'absent_cough_silent_aspiration_review';
  else status = 'dysphagia_managed';
  return { status, severity: req.dysphagia_severity };
}

function balance_train(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.balance_phase, 'balance_phase', ['static_sitting','dynamic_sitting','static_standing','dynamic_standing','tandem','single_leg','foam','tilt_board','gait','advanced','other']);
  ensureNumber(req.berg_score, 'berg');
  ensureNumber(req.falls_30d, 'falls');
  ensureBool(req.use_aid, 'aid');
  ensureNumber(req.duration_min, 'duration');
  let status;
  if (req.berg_score < 20) status = 'low_berg_high_fall_risk_supervised';
  else if (req.falls_30d > 2 && !req.use_aid) status = 'multiple_falls_aid_required';
  else if (req.duration_min < 15) status = 'short_session_increase_duration';
  else status = 'balance_training_appropriate';
  return { status, berg: req.berg_score };
}

const CITATIONS = { AHA_STROKE_2024: 'AHA Stroke 2024', CRS_R_2024: 'CRS-R 2024', AANS_SCI_2024: 'AANS SCI 2024' };

function funcs() { return { nih_stroke, coma_recovery, sci_assess, dysphagia, balance_train }; }
module.exports = { funcs, CITATIONS, ValidationError };