// filepath: tier5_oph_ext_136_pedi_engine.js
// TIER5_OPH_EXT-136: Pediatric Ophthalmology / Strabismus
'use strict';
const CITATIONS = ['AAO_PPP_PEDI_2021','AAPOS_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function red_eye(req){
  ensureNumber(req.age_months, 'age_months');
  ensureEnum(req.discharge_type, 'discharge_type', ['watery','mucoid','purulent','none','other']);
  ensureBool(req.discharge_severity, 'discharge_severity');
  ensureBool(req.lid_swelling, 'lid_swelling');
  ensureEnum(req.cause, 'cause', ['viral','bacterial','allergic','blocked_duct','neonatal','foreign_body','other','unknown']);
  ensureBool(req.treatment_started, 'treatment_started');
  let plan;
  if(req.cause==='bacterial' && req.treatment_started===false) plan='continue_with_abx_then_reassess';
  else if(req.cause==='blocked_duct') plan='continue_with_massage_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function strabismus(req){
  ensureBool(req.misalignment, 'misalignment');
  ensureNumber(req.prism_diopters, 'prism_diopters');
  ensureEnum(req.type, 'type', ['esotropia','exotropia','hypertropia','hypotropia','intermittent','constant','alternating','unknown','other']);
  ensureBool(req.refraction_done, 'refraction_done');
  ensureBool(req.amblyopia_screen_done, 'amblyopia_screen_done');
  ensureBool(req.treat_observation, 'treat_observation');
  let plan;
  if(req.misalignment===true && req.prism_diopters>=15) plan='continue_with_surgery_then_reassess';
  else if(req.amblyopia_screen_done===false) plan='continue_with_screen_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function amblyopia(req){
  ensureNumber(req.age_months, 'age_months');
  ensureBool(req.refraction_checked, 'refraction_checked');
  ensureBool(req.glasses_worn, 'glasses_worn');
  ensureBool(req.occlusion_started, 'occlusion_started');
  ensureNumber(req.hours_per_day, 'hours_per_day');
  ensureBool(req.family_compliance, 'family_compliance');
  let plan;
  if(req.refraction_checked===false) plan='continue_with_refraction_then_reassess';
  else if(req.occlusion_started===false && req.age_months>=36) plan='continue_with_occlusion_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function rop(req){
  ensureNumber(req.gestational_age, 'gestational_age');
  ensureNumber(req.week_postnatal, 'week_postnatal');
  ensureEnum(req.stage, 'stage', ['none','stage_1','stage_2','stage_3','stage_4','stage_5','plus_disease','unknown','other']);
  ensureBool(req.treatment_needed, 'treatment_needed');
  ensureEnum(req.treatment, 'treatment', ['observation','laser','bevacizumab','vitrectomy','none','other','unknown']);
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.stage==='plus_disease' || req.stage==='stage_3' && req.treatment_needed===true) plan='continue_with_laser_then_reassess';
  else if(req.stage==='stage_1' || req.stage==='stage_2') plan='continue_with_observe_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function exam_anest(req){
  ensureBool(req.family_consent, 'family_consent');
  ensureBool(req.anesthesia_planned, 'anesthesia_planned');
  ensureEnum(req.reason, 'reason', ['retinoblastoma_screen','strabismus_eval','trauma','rb_unknown','other']);
  ensureBool(req.fasting_done, 'fasting_done');
  ensureBool(req.monitoring_done, 'monitoring_done');
  ensureBool(req.parents_informed, 'parents_informed');
  let plan;
  if(req.family_consent===false) plan='continue_with_consent_then_reassess';
  else if(req.anesthesia_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function pedi_fu(req){
  ensureNumber(req.months_in_care, 'months_in_care');
  ensureBool(req.vision_improvement, 'vision_improvement');
  ensureBool(req.treatment_adherent, 'treatment_adherent');
  ensureEnum(req.referral_status, 'referral_status', ['resolved','ongoing','surgery_planned','other','unknown']);
  ensureBool(req.school_function, 'school_function');
  ensureBool(req.psych_support_offered, 'psych_support_offered');
  let plan;
  if(req.referral_status==='surgery_planned') plan='continue_with_surgery_then_reassess';
  else if(req.treatment_adherent===false) plan='continue_with_barriers_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {red_eye,strabismus,amblyopia,rop,exam_anest,pedi_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
