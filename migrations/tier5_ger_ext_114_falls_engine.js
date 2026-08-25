// filepath: tier5_ger_ext_114_falls_engine.js
// TIER5_GER_EXT-114: Falls Prevention
'use strict';
const CITATIONS = ['CDC_STEDI_2020','AGS_FALLS_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function risk_screen(req){
  ensureNumber(req.falls_last_year, 'falls_last_year');
  ensureNumber(req.age, 'age');
  ensureBool(req.gait_disorder, 'gait_disorder');
  ensureBool(req.balance_disorder, 'balance_disorder');
  ensureBool(req.incontinence, 'incontinence');
  ensureBool(req.orthostatic_checked, 'orthostatic_checked');
  let plan;
  if(req.falls_last_year>=2) plan='continue_with_high_risk_pathway_then_reassess';
  else if(req.falls_last_year>=1) plan='continue_with_moderate_risk_pathway_then_reassess';
  else plan='continue_with_prevention_then_reassess';
  return {plan};
}
function circ_check(req){
  ensureBool(req.postural_bp_checked, 'postural_bp_checked');
  ensureNumber(req.sbp_drop, 'sbp_drop');
  ensureEnum(req.findings, 'findings', ['normal','orthostatic','severe_orthostatic','unknown','other']);
  ensureBool(req.cardiac_eval, 'cardiac_eval');
  ensureBool(req.hydration_reviewed, 'hydration_reviewed');
  ensureBool(req.meds_reviewed, 'meds_reviewed');
  let plan;
  if(req.findings==='severe_orthostatic' || req.sbp_drop>=20) plan='continue_with_cardiology_then_reassess';
  else if(req.findings==='orthostatic') plan='continue_with_hydration_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function home_safety(req){
  ensureBool(req.assessment_done, 'assessment_done');
  ensureBool(req.lighting_fixes, 'lighting_fixes');
  ensureBool(req.bathroom_grab_bars, 'bathroom_grab_bars');
  ensureBool(req.ramps_installed, 'ramps_installed');
  ensureBool(req.rugs_removed, 'rugs_removed');
  ensureBool(req.pet_underfoot, 'pet_underfoot');
  let plan;
  if(req.assessment_done===false) plan='continue_with_ot_home_visit_then_reassess';
  else if(req.bathroom_grab_bars===false) plan='continue_with_install_grab_bars_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function exercise(req){
  ensureEnum(req.program, 'program', ['otago','tai_chi','balance_pt','gait_training','community','none','other']);
  ensureBool(req.adherent, 'adherent');
  ensureNumber(req.sessions_per_week, 'sessions_per_week');
  ensureBool(req.progress_documented, 'progress_documented');
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.falls_recurrence, 'falls_recurrence');
  let plan;
  if(req.adherent===false || req.sessions_per_week<2) plan='continue_with_barriers_then_reassess';
  else if(req.falls_recurrence===true) plan='continue_with_intensify_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function post_fall(req){
  ensureBool(req.lay_witness, 'lay_witness');
  ensureBool(req.able_to_get_up, 'able_to_get_up');
  ensureBool(req.injury_suspected, 'injury_suspected');
  ensureEnum(req.imaging, 'imaging', ['none','xr','ct','mri','other']);
  ensureBool(req.medic_review_post, 'medic_review_post');
  ensureBool(req.medical_workup, 'medical_workup');
  let plan;
  if(req.injury_suspected===true && req.imaging==='none') plan='continue_with_imaging_then_reassess';
  else if(req.able_to_get_up===false) plan='continue_with_long_lie_protocol_then_reassess';
  else plan='continue_with_followup_then_reassess';
  return {plan};
}
function fall_followup(req){
  ensureNumber(req.weeks_post_fall, 'weeks_post_fall');
  ensureBool(req.treatment_targeted, 'treatment_targeted');
  ensureBool(req.home_mitigation, 'home_mitigation');
  ensureEnum(req.functional_status, 'functional_status', ['returned_to_baseline','improving','stable','declined','unknown']);
  ensureBool(req.bone_health_review, 'bone_health_review');
  ensureBool(req.fear_of_falling, 'fear_of_falling');
  let plan;
  if(req.functional_status==='declined') plan='continue_with_rehab_then_reassess';
  else if(req.fear_of_falling===true) plan='continue_with_cbt_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}

function funcs(){return {risk_screen,circ_check,home_safety,exercise,post_fall,fall_followup};}
module.exports = {funcs, CITATIONS, ValidationError};
