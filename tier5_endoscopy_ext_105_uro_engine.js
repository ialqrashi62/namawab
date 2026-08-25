// filepath: tier5_endoscopy_ext_105_uro_engine.js
// TIER5_ENDOSCOPY_EXT-105: Urologic endoscopy
'use strict';
const CITATIONS = ['AUA_Cysto_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cysto(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['hematuria','recurrent_uti','bladder_cancer_surveillance','voiding_dysfunction','foreign_body','intravesical_therapy','stent_removal','stricture','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.consent, 'consent');
  ensureBool(req.urine_culture, 'urine_culture');
  let plan;
  if(req.urine_culture===false) plan='continue_with_culture_then_reassess';
  else if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function findings(req){
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','mass','stones','stricture','foreign_body','trabeculation','hemorrhagic_cystitis','other']);
  ensureBool(req.biopsies_taken, 'biopsies_taken');
  ensureBool(req.therapeutic_performed, 'therapeutic_performed');
  let plan;
  if(req.findings==='mass') plan='continue_with_pathology_then_reassess';
  else if(req.findings==='stones') plan='continue_with_extract_then_reassess';
  else if(req.biopsies_taken===false && req.findings==='mass') plan='continue_with_biopsy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ureteroscopy(req){
  ensureBool(req.stone_visualized, 'stone_visualized');
  ensureNumber(req.stone_size, 'stone_size');
  ensureBool(req.laser_used, 'laser_used');
  ensureBool(req.basket_used, 'basket_used');
  ensureBool(req.stent_placed, 'stent_placed');
  ensureBool(req.steinstrasse, 'steinstrasse');
  let plan;
  if(req.stone_visualized && req.stent_placed===false) plan='continue_with_stent_then_reassess';
  else if(req.steinstrasse) plan='continue_with_intervention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function biopsy(req){
  ensureBool(req.cold_cup, 'cold_cup');
  ensureBool(req.transurethral_resection, 'transurethral_resection');
  ensureBool(req.fluorescence_used, 'fluorescence_used');
  ensureBool(req.adequate_sample, 'adequate_sample');
  ensureBool(req.pathology_sent, 'pathology_sent');
  let plan;
  if(req.adequate_sample===false) plan='continue_with_repeat_then_reassess';
  else if(req.pathology_sent===false) plan='continue_with_pathology_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.uti, 'uti');
  ensureBool(req.stricture, 'stricture');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_repair_then_reassess';
  else if(req.stricture) plan='continue_with_dilation_then_reassess';
  else if(req.uti && req.managed===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_irrigate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post(req){
  ensureBool(req.urine_clear, 'urine_clear');
  ensureBool(req.discharged, 'discharged');
  ensureBool(req.followup_planned, 'followup_planned');
  ensureBool(req.results_communicated, 'results_communicated');
  let plan;
  if(req.urine_clear===false) plan='continue_with_irrigation_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else if(req.results_communicated===false) plan='continue_with_communicate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {cysto,findings,ureteroscopy,biopsy,complications,post};}
module.exports={funcs,CITATIONS,ValidationError};