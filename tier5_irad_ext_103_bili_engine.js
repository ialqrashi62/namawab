// filepath: tier5_irad_ext_103_bili_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-103: Biliary/TIPS
'use strict';
const CITATIONS = ['SIR_Biliary_2017','AASLD_TIPS_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ptbd(req){
  ensureNumber(req.bilirubin, 'bilirubin');
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['malignant_obstruction','benign_stricture','bile_leak','stone','cholangitis','failed_ercp','other']);
  ensureBool(req.anticoag_safe, 'anticoag_safe');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.success, 'success');
  let plan;
  if(req.coagulopathy) plan='continue_with_correct_then_reassess';
  else if(req.indication==='cholangitis') plan='continue_with_urgent_then_reassess';
  else if(req.success===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stent(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['plastic','covered_metal','bare_metal','unknown','none']);
  ensureBool(req.deployed, 'deployed');
  ensureBool(req.patent, 'patent');
  ensureBool(req.migration, 'migration');
  ensureBool(req.removal_planned, 'removal_planned');
  let plan;
  if(req.deployed===false) plan='continue_with_review_then_reassess';
  else if(req.migration) plan='continue_with_replace_then_reassess';
  else if(req.type==='plastic' && req.removal_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tips(req){
  ensureNumber(req.meld, 'meld');
  ensureNumber(req.bilirubin, 'bilirubin');
  ensureBool(req.refractory_ascites, 'refractory_ascites');
  ensureBool(req.bleeding_varices, 'bleeding_varices');
  ensureBool(req.hepatic_encephalopathy, 'hepatic_encephalopathy');
  ensureBool(req.stent, 'stent');
  ensureBool(req.success, 'success');
  let plan;
  if(req.bleeding_varices && req.stent===false) plan='continue_with_rescue_then_reassess';
  else if(req.meld>=18 && req.success===false) plan='continue_with_review_then_reassess';
  else if(req.hepatic_encephalopathy) plan='continue_with_smaller_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function brto(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['gastric_varices','ectopic_varices','mesenteric_thrombosis','other']);
  ensureBool(req.balloon_occlusion, 'balloon_occlusion');
  ensureBool(req.sclerosant, 'sclerosant');
  ensureBool(req.complications, 'complications');
  ensureBool(req.success, 'success');
  let plan;
  if(req.success===false) plan='continue_with_repeat_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function drain(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['abscess','pseudocyst','biliary','pleural','peritoneal','renal','lymph','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.catheter, 'catheter');
  ensureBool(req.drainage_adequate, 'drainage_adequate');
  ensureBool(req.followup_imaging, 'followup_imaging');
  let plan;
  if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else if(req.drainage_adequate===false) plan='continue_with_review_then_reassess';
  else if(req.followup_imaging===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.biloma, 'biloma');
  ensureBool(req.peritonitis, 'peritonitis');
  ensureBool(req.shock, 'shock');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.shock && req.managed===false) plan='continue_with_emergent_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_angiography_then_reassess';
  else if(req.biloma) plan='continue_with_redrain_then_reassess';
  else if(req.peritonitis) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {ptbd,stent,tips,brto,drain,complications};}
module.exports={funcs,CITATIONS,ValidationError};