// filepath: tier5_labauto_ext_104_micro_engine.js
// TIER5_LAB_AUTOMATION_EXT-104: Microbiology automation
'use strict';
const CITATIONS = ['ASM_Micro_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function culture(req){
  ensureStr(req.source, 'source');
  ensureEnum(req.source, 'source', ['blood','urine','sputum','stool','wound','csf','sterile_fluid','tissue','other']);
  ensureBool(req.gram_done, 'gram_done');
  ensureNumber(req.incubation_hours, 'incubation_hours');
  ensureBool(req.preliminary, 'preliminary');
  ensureBool(req.final, 'final');
  let plan;
  if(req.source==='blood' && req.gram_done===false) plan='continue_with_gram_then_reassess';
  else if(req.incubation_hours<24 && req.final) plan='continue_with_extend_then_reassess';
  else if(req.preliminary===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function id(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['maldi_tof','vitek2','micro_scan','bd_phonix','biochem','other','none']);
  ensureBool(req.id_complete, 'id_complete');
  ensureBool(req.confidence_high, 'confidence_high');
  ensureBool(req.verified, 'verified');
  let plan;
  if(req.id_complete===false) plan='continue_with_review_then_reassess';
  else if(req.confidence_high===false) plan='continue_with_verify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ast(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['broth_microdilution','disk_diffusion','gradient_strip','vitek2','micro_scan','bd_phonix','other','none']);
  ensureBool(req.ast_complete, 'ast_complete');
  ensureBool(req.mecA_done, 'mecA_done');
  ensureBool(req.carbapenem_resist, 'carbapenem_resist');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.ast_complete===false) plan='continue_with_complete_then_reassess';
  else if(req.mecA_done===false) plan='continue_with_mecA_then_reassess';
  else if(req.carbapenem_resist) plan='continue_with_confirm_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function blood_cx(req){
  ensureBool(req.set_done, 'set_done');
  ensureNumber(req.set_count, 'set_count');
  ensureBool(req.aerobic_bottle, 'aerobic_bottle');
  ensureBool(req.anaerobic_bottle, 'anaerobic_bottle');
  ensureBool(req.first_drawn, 'first_drawn');
  ensureBool(req.monitored, 'monitored');
  let plan;
  if(req.set_count<2) plan='continue_with_second_set_then_reassess';
  else if(req.aerobic_bottle===false || req.anaerobic_bottle===false) plan='continue_with_complete_then_reassess';
  else if(req.monitored===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staining(req){
  ensureBool(req.gram, 'gram');
  ensureBool(req.acid_fast, 'acid_fast');
  ensureBool(req.fungal, 'fungal');
  ensureBool(req.interpretation_done, 'interpretation_done');
  ensureBool(req.clinical_correlation, 'clinical_correlation');
  let plan;
  if(req.gram===false && req.acid_fast===false && req.fungal===false) plan='continue_with_review_then_reassess';
  else if(req.interpretation_done===false) plan='continue_with_interpret_then_reassess';
  else if(req.clinical_correlation===false) plan='continue_with_correlate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reporting(req){
  ensureBool(req.critical_value_called, 'critical_value_called');
  ensureBool(req.communicated, 'communicated');
  ensureBool(req.interpretive_comment, 'interpretive_comment');
  ensureBool(req.saved, 'saved');
  ensureBool(req.sent_to_ehr, 'sent_to_ehr');
  let plan;
  if(req.critical_value_called===false) plan='continue_with_call_then_reassess';
  else if(req.communicated===false) plan='continue_with_communicate_then_reassess';
  else if(req.sent_to_ehr===false) plan='continue_with_ehr_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {culture,id,ast,blood_cx,staining,reporting};}
module.exports={funcs,CITATIONS,ValidationError};