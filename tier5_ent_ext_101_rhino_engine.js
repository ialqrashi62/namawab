// filepath: tier5_ent_ext_101_rhino_engine.js
// TIER5_ENT_EXT-101: Rhinology & sinus
'use strict';
const CITATIONS = ['AAO_Rhino_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function sinusitis(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['acute_bact','chronic','recurrent','fungal','none','other']);
  ensureNumber(req.duration_days, 'duration_days');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.intranasal_meds, 'intranasal_meds');
  ensureBool(req.antibiotics, 'antibiotics');
  let plan;
  if(req.type==='acute_bact' && req.antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.duration_days>=90 && req.imaging===false) plan='continue_with_ct_then_reassess';
  else if(req.type==='chronic' && req.intranasal_meds===false) plan='continue_with_intranasal_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function allergies(req){
  ensureBool(req.seasonal, 'seasonal');
  ensureBool(req.perennial, 'perennial');
  ensureBool(req.medication, 'medication');
  ensureBool(req.food, 'food');
  ensureBool(req.testing_done, 'testing_done');
  ensureBool(req.immunotherapy, 'immunotherapy');
  let plan;
  if(req.testing_done===false) plan='continue_with_test_then_reassess';
  else if(req.medication && req.immunotherapy===false) plan='continue_with_immunotherapy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nasal_obstruction(req){
  ensureStr(req.cause, 'cause');
  ensureEnum(req.cause, 'cause', ['septal_deviation','turbinate','polyps','mass','choanal_atresia','foreign_body','none','other']);
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.medical_therapy, 'medical_therapy');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.surgery_planned && req.imaging===false) plan='continue_with_ct_then_reassess';
  else if(req.medical_therapy===false) plan='continue_with_medical_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function polyps(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['0','1','2','3','4','none']);
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.steroid_treated, 'steroid_treated');
  ensureBool(req.surgery_planned, 'surgery_planned');
  ensureBool(req.respond_to_steroid, 'respond_to_steroid');
  let plan;
  if(req.stage==='3' || req.stage==='4') plan='continue_with_surgery_then_reassess';
  else if(req.respond_to_steroid===false && req.surgery_planned===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function epistaxis(req){
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','recurrent','none']);
  ensureBool(req.anterior_source, 'anterior_source');
  ensureBool(req.posterior_source, 'posterior_source');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.controlled, 'controlled');
  ensureBool(req.packing, 'packing');
  let plan;
  if(req.severity==='severe' && req.controlled===false) plan='continue_with_cautery_then_reassess';
  else if(req.coagulopathy) plan='continue_with_correct_then_reassess';
  else if(req.recurrent) plan='continue_with_workup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function function_eval(req){
  ensureBool(req.smell_loss, 'smell_loss');
  ensureNumber(req.sniffin_score, 'sniffin_score');
  ensureBool(req.taste_loss, 'taste_loss');
  ensureBool(req.workup, 'workup');
  ensureBool(req.recovery, 'recovery');
  ensureBool(req.smell_training, 'smell_training');
  let plan;
  if(req.smell_loss && req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.smell_loss && req.smell_training===false) plan='continue_with_training_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {sinusitis,allergies,nasal_obstruction,polyps,epistaxis,function_eval};}
module.exports={funcs,CITATIONS,ValidationError};