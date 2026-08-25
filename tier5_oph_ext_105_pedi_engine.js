// filepath: tier5_oph_ext_105_pedi_engine.js
// TIER5_OPHTHALMOLOGY_EXT-105: Pediatric & Strabismus
'use strict';
const CITATIONS = ['AAO_PedsOph_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function screening(req){
  ensureNumber(req.age_months, 'age_months');
  ensureStr(req.test, 'test');
  ensureEnum(req.test, 'test', ['red_reflex','photoscreen','autorefraction','visual_acuity','cover','none','other']);
  ensureBool(req.pass, 'pass');
  ensureBool(req.followup, 'followup');
  ensureBool(req.referred, 'referred');
  let plan;
  if(req.pass===false && req.referred===false) plan='continue_with_refer_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function amblyopia(req){
  ensureBool(req.unilateral, 'unilateral');
  ensureNumber(req.va_difference, 'va_difference');
  ensureBool(req.patching_compliance, 'patching_compliance');
  ensureBool(req.improvement, 'improvement');
  ensureBool(req.treatment_success, 'treatment_success');
  ensureBool(req.recurrence, 'recurrence');
  let plan;
  if(req.recurrence) plan='continue_with_retreat_then_reassess';
  else if(req.treatment_success===false) plan='continue_with_review_then_reassess';
  else if(req.patching_compliance===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function strabismus(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['esotropia','exotropia','hypertropia','hypotropia','intermittent','constant','none','other']);
  ensureNumber(req.prism_diopters, 'prism_diopters');
  ensureBool(req.binocular, 'binocular');
  ensureBool(req.surgery_needed, 'surgery_needed');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.surgery_needed && req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else if(req.binocular===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function retinoblastoma(req){
  ensureBool(req.leukocoria, 'leukocoria');
  ensureBool(req.strabismus, 'strabismus');
  ensureBool(req.family_hx, 'family_hx');
  ensureBool(req.bilateral, 'bilateral');
  ensureBool(req.referred, 'referred');
  ensureBool(req.exam_under_anesthesia, 'exam_under_anesthesia');
  let plan;
  if(req.leukocoria && req.referred===false) plan='continue_with_refer_then_reassess';
  else if(req.exam_under_anesthesia===false && req.referred) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cong_cataract(req){
  ensureBool(req.diagnosed, 'diagnosed');
  ensureBool(req.bilateral, 'bilateral');
  ensureBool(req.surgery_planned, 'surgery_planned');
  ensureBool(req.timeline, 'timeline');
  ensureBool(req.ioL_planned, 'ioL_planned');
  ensureBool(req.amblyopia_risk, 'amblyopia_risk');
  let plan;
  if(req.diagnosed && req.surgery_planned===false) plan='continue_with_surgery_then_reassess';
  else if(req.amblyopia_risk && req.timeline===false) plan='continue_with_urgent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.compliance, 'compliance');
  ensureBool(req.glasses_worn, 'glasses_worn');
  ensureBool(req.attendance, 'attendance');
  ensureBool(req.outcome, 'outcome');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.compliance===false) plan='continue_with_counsel_then_reassess';
  else if(req.outcome===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {screening,amblyopia,strabismus,retinoblastoma,cong_cataract,followup};}
module.exports={funcs,CITATIONS,ValidationError};