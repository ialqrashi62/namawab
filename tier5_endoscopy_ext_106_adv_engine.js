// filepath: tier5_endoscopy_ext_106_adv_engine.js
// TIER5_ENDOSCOPY_EXT-106: Advanced therapeutic endoscopy
'use strict';
const CITATIONS = ['ASGE_Advanced_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function bleed(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['variceal','peptic_ulcer','mallory_weiss','angiodysplasia','dieulafoy','tumor','diverticular','other']);
  ensureBool(req.banding, 'banding');
  ensureBool(req.thermal_coag, 'thermal_coag');
  ensureBool(req.epi_injection, 'epi_injection');
  ensureBool(req.clip_placed, 'clip_placed');
  ensureBool(req.hemostasis, 'hemostasis');
  let plan;
  if(req.hemostasis===false) plan='continue_with_repeat_then_reassess';
  else if(req.type==='variceal' && req.banding===false) plan='continue_with_band_then_reassess';
  else if(req.type==='peptic_ulcer' && req.thermal_coag===false) plan='continue_with_coag_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dilation(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['balloon','savory','maloney','eush','cre','achalasia','benign_stricture','malignant_stricture','other']);
  ensureNumber(req.size, 'size');
  ensureBool(req.success, 'success');
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.success===false) plan='continue_with_repeat_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stent(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['esophageal','duodenal','colonic','biliary','pancreatic','airway','other','none']);
  ensureBool(req.covered, 'covered');
  ensureBool(req.deployed_correctly, 'deployed_correctly');
  ensureBool(req.patent, 'patent');
  ensureBool(req.migration_risk, 'migration_risk');
  let plan;
  if(req.deployed_correctly===false) plan='continue_with_repeat_then_reassess';
  else if(req.patent===false) plan='continue_with_revision_then_reassess';
  else if(req.migration_risk) plan='continue_with_fix_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function enteral(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['peg','peg_j','pej','button','gastrostomy','jejunostomy','other']);
  ensureBool(req.fasting, 'fasting');
  ensureBool(req.successful, 'successful');
  ensureBool(req.abx_given, 'abx_given');
  ensureBool(req.tube_position, 'tube_position');
  let plan;
  if(req.tube_position===false) plan='continue_with_reposition_then_reassess';
  else if(req.abx_given===false) plan='continue_with_abx_then_reassess';
  else if(req.fasting===false) plan='continue_with_fast_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function entoscopy(req){
  ensureStr(req.enteroscope, 'enteroscope');
  ensureEnum(req.enteroscope, 'enteroscope', ['push','balloon_assisted','spiral','single','double','none']);
  ensureBool(req.depth, 'depth');
  ensureBool(req.findings, 'findings');
  ensureBool(req.intervention, 'intervention');
  ensureBool(req.markers_placed, 'markers_placed');
  let plan;
  if(req.findings===false) plan='continue_with_review_then_reassess';
  else if(req.markers_placed===false && req.findings) plan='continue_with_markers_then_reassess';
  else if(req.intervention===false && req.findings) plan='continue_with_intervention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.aspiration, 'aspiration');
  ensureBool(req.cardiorespiratory, 'cardiorespiratory');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.aspiration) plan='continue_with_protocol_then_reassess';
  else if(req.cardiorespiratory) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {bleed,dilation,stent,enteral,entoscopy,complications};}
module.exports={funcs,CITATIONS,ValidationError};