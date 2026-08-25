// filepath: tier5_endoscopy_ext_104_bronch_engine.js
// TIER5_ENDOSCOPY_EXT-104: Bronchoscopy
'use strict';
const CITATIONS = ['ACCP_Bronch_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['mass_suspicion','hemoptysis','interstitial_lung_disease','infection_workup','foreign_body','airway_obstruction','therapeutic','stent','lavage','biopsy','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.consent, 'consent');
  ensureBool(req.recent_imaging_reviewed, 'recent_imaging_reviewed');
  let plan;
  if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.recent_imaging_reviewed===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function approach(req){
  ensureStr(req.scope, 'scope');
  ensureEnum(req.scope, 'scope', ['flexible_therapeutic','flexible_diagnostic','rigid','hybrid','ebus','linear_ebus','radial_ebus','navigational','none']);
  ensureBool(req.airway_examined, 'airway_examined');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.complications) plan='continue_with_rescue_then_reassess';
  else if(req.airway_examined===false) plan='continue_with_examine_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bal(req){
  ensureBool(req.bal_performed, 'bal_performed');
  ensureNumber(req.bal_volume, 'bal_volume');
  ensureNumber(req.bal_return, 'bal_return');
  ensureBool(req.culture_sent, 'culture_sent');
  ensureBool(req.cell_count, 'cell_count');
  ensureBool(req.diagnostic, 'diagnostic');
  let plan;
  if(req.bal_performed && req.culture_sent===false) plan='continue_with_culture_then_reassess';
  else if(req.diagnostic===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function biopsy(req){
  ensureBool(req.ebus_tbna_performed, 'ebus_tbna_performed');
  ensureNumber(req.stations_sampled, 'stations_sampled');
  ensureBool(req.rose, 'rose');
  ensureBool(req.adequate_sample, 'adequate_sample');
  ensureBool(req.followup_pathology, 'followup_pathology');
  let plan;
  if(req.ebus_tbna_performed && req.rose===false) plan='continue_with_rose_then_reassess';
  else if(req.adequate_sample===false) plan='continue_with_repeat_then_reassess';
  else if(req.followup_pathology===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function therapeutic(req){
  ensureBool(req.bleeding_controlled, 'bleeding_controlled');
  ensureBool(req.stent_placed, 'stent_placed');
  ensureBool(req.debulking, 'debulking');
  ensureBool(req.airway_patent, 'airway_patent');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.airway_patent===false) plan='continue_with_stent_then_reassess';
  else if(req.complications) plan='continue_with_rescue_then_reassess';
  else if(req.stent_placed) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post(req){
  ensureBool(req.recovery_complete, 'recovery_complete');
  ensureBool(req.cxr_done, 'cxr_done');
  ensureBool(req.pneumothorax, 'pneumothorax');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.pneumothorax) plan='continue_with_chest_tube_then_reassess';
  else if(req.bleeding) plan='continue_with_monitor_then_reassess';
  else if(req.cxr_done===false) plan='continue_with_cxr_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,approach,bal,biopsy,therapeutic,post};}
module.exports={funcs,CITATIONS,ValidationError};