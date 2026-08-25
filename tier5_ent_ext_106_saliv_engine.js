// filepath: tier5_ent_ext_106_saliv_engine.js
// TIER5_ENT_EXT-106: Salivary & facial trauma
'use strict';
const CITATIONS = ['AAO_HN_Trauma_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function salivary(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['sialolith','sialadenitis','mucocele','sjögren','mass','benign_tumor','malignant_tumor','none','other']);
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.fna_done, 'fna_done');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.condition==='malignant_tumor' && req.fna_done===false) plan='continue_with_fna_then_reassess';
  else if(req.sialolith && req.surgery_planned===false) plan='continue_with_sialendoscopy_then_reassess';
  else if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function facial_trauma(req){
  ensureBool(req.fx_present, 'fx_present');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['mandible','maxilla','zygoma','frontal','orbital','nasal','complex','none','other']);
  ensureBool(req.airway, 'airway');
  ensureBool(req.hemorrhage, 'hemorrhage');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.airway===false) plan='continue_with_airway_then_reassess';
  else if(req.hemorrhage) plan='continue_with_cautery_then_reassess';
  else if(req.fx_present && req.imaging===false) plan='continue_with_ct_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function facial_nerve(req){
  ensureStr(req.branch, 'branch');
  ensureEnum(req.branch, 'branch', ['frontal','zygomatic','buccal','marginal','cervical','all','none','unknown']);
  ensureStr(req.grade, 'grade');
  ensureEnum(req.grade, 'grade', ['i','ii','iii','iv','v','vi','unknown']);
  ensureBool(req.complete, 'complete');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.recovery, 'recovery');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.grade==='vi') plan='continue_with_refer_then_reassess';
  else if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function smell_loss(req){
  ensureBool(req.anosmia, 'anosmia');
  ensureNumber(req.duration_days, 'duration_days');
  ensureBool(req.workup, 'workup');
  ensureBool(req.smell_training, 'smell_training');
  ensureBool(req.improvement, 'improvement');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.smell_training===false) plan='continue_with_training_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tinnitus(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['subjective','objective','pulsatile','musical','none','other']);
  ensureBool(req.workup, 'workup');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.cause_found, 'cause_found');
  ensureBool(req.therapy, 'therapy');
  let plan;
  if(req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.type==='pulsatile' && req.imaging===false) plan='continue_with_mra_then_reassess';
  else if(req.therapy===false) plan='continue_with_therapy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function oral_cavity(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['leukoplakia','erythroplakia','lichen_planus','aphthous','mucositis','infection','tumor','other','none']);
  ensureBool(req.biopsy, 'biopsy');
  ensureBool(req.dysplasia, 'dysplasia');
  ensureBool(req.referral, 'referral');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.condition==='leukoplakia' && req.biopsy===false) plan='continue_with_biopsy_then_reassess';
  else if(req.dysplasia && req.referral===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {salivary,facial_trauma,facial_nerve,smell_loss,tinnitus,oral_cavity};}
module.exports={funcs,CITATIONS,ValidationError};