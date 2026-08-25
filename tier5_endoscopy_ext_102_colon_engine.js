// filepath: tier5_endoscopy_ext_102_colon_engine.js
// TIER5_ENDOSCOPY_EXT-102: Colonoscopy
'use strict';
const CITATIONS = ['ASGE_Colon_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['screening','surveillance','bleeding','ibd','diarrhea','abdominal_pain','anemia','mass','polyp_fup','familial','obstruction','fulguration','other']);
  ensureBool(req.adequate_bowel, 'adequate_bowel');
  ensureBool(req.family_hx, 'family_hx');
  let plan;
  if(req.adequate_bowel===false) plan='continue_with_reschedule_then_reassess';
  else if(req.indication==='bleeding') plan='continue_with_urgent_then_reassess';
  else if(req.family_hx) plan='continue_with_younger_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function preparation(req){
  ensureStr(req.score, 'score');
  ensureEnum(req.score, 'score', ['excellent','good','fair','poor','inadequate','unsatisfactory']);
  ensureBool(req.documented, 'documented');
  ensureBool(req.fluid_intake, 'fluid_intake');
  ensureBool(req.completed, 'completed');
  let plan;
  if(req.score==='inadequate' || req.score==='poor') plan='continue_with_reschedule_then_reassess';
  else if(req.completed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function intubation(req){
  ensureNumber(req.terminal_ileum, 'terminal_ileum');
  ensureNumber(req.depth, 'depth');
  ensureBool(req.complete, 'complete');
  ensureBool(req.circumferential, 'circumferential');
  ensureNumber(req.withdrawal_time, 'withdrawal_time');
  let plan;
  if(req.complete===false) plan='continue_with_review_then_reassess';
  else if(req.withdrawal_time<6) plan='continue_with_slower_then_reassess';
  else if(req.terminal_ileum<1) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function polyps(req){
  ensureNumber(req.number, 'number');
  ensureNumber(req.max_size, 'max_size');
  ensureStr(req.morphology, 'morphology');
  ensureEnum(req.morphology, 'morphology', ['pedunculated','sessile','flat','depressed','mixed','none']);
  ensureBool(req.removed, 'removed');
  ensureBool(req.retrieved, 'retrieved');
  ensureBool(req.site_tattoo, 'site_tattoo');
  let plan;
  if(req.number>10 && req.retrieved===false) plan='continue_with_retrieve_then_reassess';
  else if(req.max_size>=20 && req.removed===false) plan='continue_with_refer_then_reassess';
  else if(req.removed===false) plan='continue_with_remove_then_reassess';
  else if(req.site_tattoo===false && req.morphology==='flat') plan='continue_with_tattoo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pathology(req){
  ensureBool(req.benign, 'benign');
  ensureBool(req.adenoma, 'adenoma');
  ensureBool(req.hgd_cancer, 'hgd_cancer');
  ensureBool(req.fulguration, 'fulguration');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.hgd_cancer) plan='continue_with_surgery_refer_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_followup_then_reassess';
  else if(req.fulguration===false) plan='continue_with_fulguration_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.post_polypectomy, 'post_polypectomy');
  ensureBool(req.cardiorespiratory, 'cardiorespiratory');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.post_polypectomy && req.managed===false) plan='continue_with_clip_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.cardiorespiratory) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,preparation,intubation,polyps,pathology,complications};}
module.exports={funcs,CITATIONS,ValidationError};