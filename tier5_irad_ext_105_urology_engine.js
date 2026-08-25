// filepath: tier5_irad_ext_105_urology_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-105: GU interventions
'use strict';
const CITATIONS = ['SIR_GU_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pcn(req){
  ensureStr(req.side, 'side');
  ensureEnum(req.side, 'side', ['left','right','bilateral']);
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['obstruction','stone','tumor','post_obstructive','infection','other']);
  ensureBool(req.urgent, 'urgent');
  ensureBool(req.success, 'success');
  ensureBool(req.urine_cultured, 'urine_cultured');
  let plan;
  if(req.urgent && req.success===false) plan='continue_with_repeat_then_reassess';
  else if(req.urine_cultured===false) plan='continue_with_culture_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stone(req){
  ensureNumber(req.size, 'size');
  ensureNumber(req.hounsfield, 'hounsfield');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['kidney','upper_ureter','mid_ureter','lower_ureter','bladder','renal_pelvis','calyceal']);
  ensureBool(req.lithotripsy, 'lithotripsy');
  ensureBool(req.stent_placed, 'stent_placed');
  ensureBool(req.cleared, 'cleared');
  let plan;
  if(req.cleared===false && req.size>=10) plan='continue_with_pcnl_then_reassess';
  else if(req.stent_placed===false) plan='continue_with_stent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prostate(req){
  ensureNumber(req.psa, 'psa');
  ensureNumber(req.prostate_size, 'prostate_size');
  ensureBool(req.mri_done, 'mri_done');
  ensureBool(req.biopsy_done, 'biopsy_done');
  ensureBool(req.therapy, 'therapy');
  ensureStr(req.therapy_type, 'therapy_type');
  ensureEnum(req.therapy_type, 'therapy_type', ['tulep','pvp','hi_fu','focal','brachy','none','other']);
  let plan;
  if(req.biopsy_done===false) plan='continue_with_biopsy_then_reassess';
  else if(req.therapy && req.therapy_type==='none') plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function uterine(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['fibroids','adenomyosis','postpartum','pph','trauma','other']);
  ensureBool(req.fertility_desired, 'fertility_desired');
  ensureBool(req.successful, 'successful');
  ensureBool(req.bilateral, 'bilateral');
  let plan;
  if(req.fertility_desired && req.indication==='fibroids') plan='continue_with_alternative_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function varicocele(req){
  ensureStr(req.side, 'side');
  ensureEnum(req.side, 'side', ['left','right','bilateral']);
  ensureBool(req.pain, 'pain');
  ensureBool(req.infertility, 'infertility');
  ensureBool(req.embolized, 'embolized');
  ensureBool(req.recurrence, 'recurrence');
  let plan;
  if(req.embolized===false && req.infertility) plan='continue_with_embo_then_reassess';
  else if(req.recurrence) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.infection, 'infection');
  ensureBool(req.urinoma, 'urinoma');
  ensureBool(req.stent_migration, 'stent_migration');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.urinoma) plan='continue_with_redrain_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_embo_then_reassess';
  else if(req.stent_migration) plan='continue_with_replace_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pcn,stone,prostate,uterine,varicocele,complications};}
module.exports={funcs,CITATIONS,ValidationError};