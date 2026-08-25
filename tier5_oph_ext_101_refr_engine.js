// filepath: tier5_oph_ext_101_refr_engine.js
// TIER5_OPHTHALMOLOGY_EXT-101: Refraction & vision
'use strict';
const CITATIONS = ['AAO_Refraction_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function va(req){
  ensureNumber(req.va_od, 'va_od');
  ensureNumber(req.va_os, 'va_os');
  ensureStr(req.distance, 'distance');
  ensureEnum(req.distance, 'distance', ['far','near','intermediate','both','unknown']);
  ensureBool(req.with_correction, 'with_correction');
  ensureBool(req.pinhole_improvement, 'pinhole_improvement');
  let plan;
  if(req.va_od<0.1 || req.va_os<0.1) plan='continue_with_low_vision_then_reassess';
  else if(req.pinhole_improvement) plan='continue_with_refraction_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function refraction(req){
  ensureNumber(req.sphere_od, 'sphere_od');
  ensureNumber(req.cylinder_od, 'cylinder_od');
  ensureNumber(req.axis_od, 'axis_od');
  ensureNumber(req.sphere_os, 'sphere_os');
  ensureNumber(req.cylinder_os, 'cylinder_os');
  ensureNumber(req.axis_os, 'axis_os');
  ensureBool(req.bva_improved, 'bva_improved');
  let plan;
  if(req.bva_improved===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prescribe(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['single_vision','bifocal','progressive','reader','contact','none','other']);
  ensureBool(req.work_appropriate, 'used');
  ensureBool(req.driving_appropriate, 'driving');
  ensureBool(req.cosmetic_acceptable, 'cosmetic');
  let plan;
  if(req.driving_appropriate===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function low_vision(req){
  ensureBool(req.va_20_200, 'va_20_200');
  ensureBool(req.field_loss, 'field_loss');
  ensureBool(req.work_impact, 'work_impact');
  ensureBool(req.adl_impact, 'adl_impact');
  ensureBool(req.aid_referred, 'aid_referred');
  let plan;
  if(req.aid_referred===false) plan='continue_with_refer_then_reassess';
  else if(req.adl_impact) plan='continue_with_evaluation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function peds(req){
  ensureNumber(req.age_months, 'age_months');
  ensureBool(req.amblyopia_risk, 'amblyopia_risk');
  ensureBool(req.strabismus, 'strabismus');
  ensureBool(req.fixation_test, 'fixation_test');
  ensureBool(req.referred, 'referred');
  let plan;
  if(req.amblyopia_risk && req.referred===false) plan='continue_with_refer_then_reassess';
  else if(req.strabismus && req.referred===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function contact(req){
  ensureBool(req.first_time, 'first_time');
  ensureBool(req.training, 'training');
  ensureBool(req.complications, 'complications');
  ensureBool(req.followup, 'followup');
  ensureBool(req.tolerating, 'tolerating');
  let plan;
  if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.first_time && req.training===false) plan='continue_with_training_then_reassess';
  else if(req.tolerating===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {va,refraction,prescribe,low_vision,peds,contact};}
module.exports={funcs,CITATIONS,ValidationError};