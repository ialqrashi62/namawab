// filepath: tier5_oph_ext_102_retina_engine.js
// TIER5_OPHTHALMOLOGY_EXT-102: Retina
'use strict';
const CITATIONS = ['AAO_Retina_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function amd(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['dry','wet','none','early','intermediate','advanced']);
  ensureBool(req.drusen, 'drusen');
  ensureNumber(req.cst, 'cst');
  ensureBool(req.fluid, 'fluid');
  ensureBool(req.treatment_eligible, 'treatment_eligible');
  let plan;
  if(req.type==='wet' && req.treatment_eligible===false) plan='continue_with_anti_vegf_then_reassess';
  else if(req.fluid && req.type==='wet') plan='continue_with_anti_vegf_then_reassess';
  else if(req.type==='intermediate') plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function diabetic(req){
  ensureNumber(req.hba1c, 'hba1c');
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['none','mild','moderate','severe','pdr','csme','none']);
  ensureBool(req.fluid, 'fluid');
  ensureBool(req.laser_done, 'laser_done');
  ensureBool(req.anti_vegf, 'anti_vegf');
  let plan;
  if(req.severity==='pdr' && req.laser_done===false) plan='continue_with_laser_then_reassess';
  else if(req.fluid && req.anti_vegf===false) plan='continue_with_anti_vegf_then_reassess';
  else if(req.hba1c>=10) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rd(req){
  ensureBool(req.symptomatic, 'symptomatic');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['rhegmatogenous','tractional','exudative','none','macular']);
  ensureBool(req.macula_on, 'macula_on');
  ensureBool(req.urgent, 'urgent');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.macula_on && req.surgery_planned===false) plan='continue_with_emergent_then_reassess';
  else if(req.symptomatic && req.urgent===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anti_vegf(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['ranibizumab','aflibercept','bevacizumab','faricimab','brolucizumab','none','other']);
  ensureNumber(req.injections_count, 'injections_count');
  ensureBool(req.successful, 'successful');
  ensureBool(req.interval_extended, 'interval_extended');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.successful===false) plan='continue_with_switch_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function laser(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['prp','focal','grid','none','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.complications, 'complications');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.successful===false) plan='continue_with_review_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vitrectomy(req){
  ensureBool(req.indication, 'indication');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['ppv','25g','27g','23g','20g','none','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.complications, 'complications');
  ensureBool(req.position, 'position');
  let plan;
  if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.successful===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {amd,diabetic,rd,anti_vegf,laser,vitrectomy};}
module.exports={funcs,CITATIONS,ValidationError};