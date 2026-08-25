// filepath: tier5_oph_ext_103_glau_engine.js
// TIER5_OPHTHALMOLOGY_EXT-103: Glaucoma
'use strict';
const CITATIONS = ['AAO_Glaucoma_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function iop(req){
  ensureNumber(req.iop, 'iop');
  ensureStr(req.eye, 'eye');
  ensureEnum(req.eye, 'eye', ['od','os','ou','unknown']);
  ensureNumber(req.pachymetry, 'pachymetry');
  ensureNumber(req.target_iop, 'target_iop');
  ensureBool(req.above_target, 'above_target');
  let plan;
  if(req.iop>=30) plan='continue_with_urgent_then_reassess';
  else if(req.above_target) plan='continue_with_medication_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function optic_disc(req){
  ensureNumber(req.cdr, 'cdr');
  ensureBool(req.notching, 'notching');
  ensureBool(req.hemorrhage, 'hemorrhage');
  ensureBool(req.rnf_loss, 'rnf_loss');
  ensureBool(req.progression, 'progression');
  let plan;
  if(req.progression) plan='continue_with_escalate_then_reassess';
  else if(req.rnf_loss) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function visual_field(req){
  ensureNumber(req.md, 'md');
  ensureNumber(req.psd, 'psd');
  ensureBool(req.reliable, 'reliable');
  ensureBool(req.progression, 'progression');
  ensureBool(req.oct_correlated, 'oct_correlated');
  let plan;
  if(req.progression) plan='continue_with_escalate_then_reassess';
  else if(req.reliable===false) plan='continue_with_repeat_then_reassess';
  else if(req.oct_correlated===false) plan='continue_with_oct_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function medication(req){
  ensureBool(req.prostaglandin, 'prostaglandin');
  ensureBool(req.beta_blocker, 'beta_blocker');
  ensureBool(req.alpha_agonist, 'alpha_agonist');
  ensureBool(req.carbonic_anhydrase, 'carbonic_anhydrase');
  ensureBool(req.compliance, 'compliance');
  ensureBool(req.target_met, 'target_met');
  let plan;
  if(req.target_met===false) plan='continue_with_add_then_reassess';
  else if(req.compliance===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function laser(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['slt','alt','ltp','none','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.complications, 'complications');
  ensureBool(req.iop_reduced, 'iop_reduced');
  let plan;
  if(req.iop_reduced===false) plan='continue_with_medication_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function surgery(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['trabeculectomy','tube','migs','cyclodestruction','none','other']);
  ensureBool(req.target_pressure, 'target_pressure');
  ensureBool(req.success, 'success');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.target_pressure===false) plan='continue_with_medication_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {iop,optic_disc,visual_field,medication,laser,surgery};}
module.exports={funcs,CITATIONS,ValidationError};