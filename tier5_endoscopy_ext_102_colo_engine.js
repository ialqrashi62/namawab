// filepath: tier5_endoscopy_ext_102_colo_engine.js
// TIER5_ENDOSCOPY_EXT-102: Colonoscopy
'use strict';
const CITATIONS = ['USMSTF_Colo_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['screening','surveillance','positive_fit','rectal_bleeding','anemia','weight_loss','change_in_bowel_habits','ibd_followup','mass_suspicion','therapeutic','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.bowel_prep_assessed, 'bowel_prep_assessed');
  let plan;
  if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.bowel_prep_assessed===false) plan='continue_with_prep_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prep(req){
  ensureStr(req.boston_score, 'boston_score');
  ensureEnum(req.boston_score, 'boston_score', ['excellent','good','fair','poor','inadequate','unknown']);
  ensureBool(req.split_prep, 'split_prep');
  ensureBool(req.adequate, 'adequate');
  ensureBool(req.repeat_needed, 'repeat_needed');
  let plan;
  if(req.adequate===false && req.repeat_needed) plan='continue_with_repeat_then_reassess';
  else if(req.adequate===false) plan='continue_with_extend_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function polyp(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['hyperplastic','adenoma','serrated','inflammatory','cancer','lymphoma','hamartoma','mixed','none','unknown']);
  ensureNumber(req.count, 'count');
  ensureNumber(req.size_mm, 'size_mm');
  ensureBool(req.removed, 'removed');
  ensureBool(req.pedunculated, 'pedunculated');
  ensureBool(req.advanced_features, 'advanced_features');
  let plan;
  if(req.removed===false && req.size_mm>=10) plan='continue_with_emr_then_reassess';
  else if(req.advanced_features) plan='continue_with_refer_then_reassess';
  else if(req.removed===false) plan='continue_with_remove_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function insertion(req){
  ensureNumber(req.intubation_time, 'intubation_time');
  ensureNumber(req.withdrawal_time, 'withdrawal_time');
  ensureBool(req.cecum_reached, 'cecum_reached');
  ensureBool(req.terminal_ileum_reached, 'terminal_ileum_reached');
  ensureBool(req.complete_exam, 'complete_exam');
  let plan;
  if(req.cecum_reached===false) plan='continue_with_review_then_reassess';
  else if(req.withdrawal_time<6) plan='continue_with_slower_then_reassess';
  else if(req.complete_exam===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.post_polypectomy_syndrome, 'post_polypectomy_syndrome');
  ensureBool(req.cardiopulmonary, 'cardiopulmonary');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgical_then_reassess';
  else if(req.post_polypectomy_syndrome) plan='continue_with_antibiotics_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_clip_then_reassess';
  else if(req.cardiopulmonary) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','polyps','cancer','ibd','angiodysplasia','colitis','hemorrhoids','diverticulosis','other']);
  ensureBool(req.surveillance_interval_set, 'surveillance_interval_set');
  ensureBool(req.results_communicated, 'results_communicated');
  ensureBool(req.pathology_followed_up, 'pathology_followed_up');
  let plan;
  if(req.surveillance_interval_set===false) plan='continue_with_set_then_reassess';
  else if(req.results_communicated===false) plan='continue_with_communicate_then_reassess';
  else if(req.pathology_followed_up===false) plan='continue_with_pathology_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,prep,polyp,insertion,complications,followup};}
module.exports={funcs,CITATIONS,ValidationError};