// filepath: tier5_nephrology_ext_105_htn_engine.js
// TIER5_NEPHROLOGY_EXT-105: Renal HTN & electrolytes
'use strict';
const CITATIONS = ['KDIGO_BP_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function htn_classify(req){
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.dbp, 'dbp');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['normal','elevated','stage_1','stage_2','hypertensive_crisis','hypertensive_urgency','hypertensive_emergency','white_coat','masked']);
  ensureBool(req.renovascular_suspected, 'renovascular_suspected');
  let plan;
  if(req.stage==='hypertensive_emergency') plan='continue_with_iv_then_reassess';
  else if(req.stage==='hypertensive_urgency') plan='continue_with_oral_then_reassess';
  else if(req.renovascular_suspected) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function secondary(req){
  ensureBool(req.renal_artery_stenosis, 'renal_artery_stenosis');
  ensureBool(req.primary_aldosteronism, 'primary_aldosteronism');
  ensureBool(req.cushing, 'cushing');
  ensureBool(req.pheo, 'pheo');
  ensureBool(req.workup_initiated, 'workup_initiated');
  let plan;
  if(req.pheo) plan='continue_with_alpha_block_then_reassess';
  else if(req.workup_initiated===false) plan='continue_with_workup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function treatment(req){
  ensureBool(req.lifestyle, 'lifestyle');
  ensureBool(req.ace_inhibitor, 'ace_inhibitor');
  ensureBool(req.ARB, 'ARB');
  ensureBool(req.ccb, 'ccb');
  ensureBool(req.diuretic, 'diuretic');
  ensureBool(req.target_met, 'target_met');
  let plan;
  if(req.target_met===false) plan='continue_with_add_then_reassess';
  else if(req.lifestyle===false) plan='continue_with_lifestyle_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function electrolytes(req){
  ensureNumber(req.sodium, 'sodium');
  ensureNumber(req.potassium, 'potassium');
  ensureNumber(req.chloride, 'chloride');
  ensureNumber(req.bicarb, 'bicarb');
  ensureNumber(req.magnesium, 'magnesium');
  ensureBool(req.corrected, 'corrected');
  let plan;
  if(req.potassium>=6 || req.potassium<2.5) plan='continue_with_urgent_then_reassess';
  else if(req.sodium<125 || req.sodium>155) plan='continue_with_correct_then_reassess';
  else if(req.magnesium<1.5) plan='continue_with_replete_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function acidbase(req){
  ensureNumber(req.ph, 'ph');
  ensureNumber(req.pco2, 'pco2');
  ensureNumber(req.bicarb, 'bicarb');
  ensureNumber(req.anion_gap, 'anion_gap');
  ensureStr(req.disorder, 'disorder');
  ensureEnum(req.disorder, 'disorder', ['none','metabolic_acidosis','respiratory_acidosis','metabolic_alkalosis','respiratory_alkalosis','mixed','other']);
  let plan;
  if(req.ph<7.2) plan='continue_with_emergent_then_reassess';
  else if(req.disorder==='metabolic_acidosis') plan='continue_with_correct_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nephrolithiasis(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','unknown']);
  ensureBool(req.hydration, 'hydration');
  ensureBool(req.diet_modified, 'diet_modified');
  ensureBool(req.workup_complete, 'workup_complete');
  ensureBool(req.recurrent, 'recurrent');
  let plan;
  if(req.workup_complete===false) plan='continue_with_workup_then_reassess';
  else if(req.recurrent && req.diet_modified===false) plan='continue_with_diet_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {htn_classify,secondary,treatment,electrolytes,acidbase,nephrolithiasis};}
module.exports={funcs,CITATIONS,ValidationError};