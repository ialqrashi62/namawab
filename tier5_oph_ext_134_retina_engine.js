// filepath: tier5_oph_ext_134_retina_engine.js
// TIER5_OPH_EXT-134: Retina / Vitreous
'use strict';
const CITATIONS = ['AAO_PPP_RETINA_2020','RS_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function screening(req){
  ensureStr(req.eye, 'eye');
  ensureEnum(req.eye, 'eye', ['od','os','ou']);
  ensureNumber(req.bcva, 'bcva');
  ensureBool(req.diabetic, 'diabetic');
  ensureBool(req.myopia_high, 'myopia_high');
  ensureEnum(req.urgency, 'urgency', ['routine','within_week','urgent','emergent']);
  let plan;
  if(req.urgency==='emergent' || req.urgency==='urgent') plan='continue_with_same_day_then_reassess';
  else if(req.diabetic===true) plan='continue_with_dilated_then_reassess';
  else plan='continue_with_routine_then_reassess';
  return {plan};
}
function amd(req){
  ensureEnum(req.type, 'type', ['dry','wet','early','intermediate','advanced','geographic','unknown']);
  ensureBool(req.oct_done, 'oct_done');
  ensureBool(req.found_drusen, 'found_drusen');
  ensureNumber(req.cst, 'cst');
  ensureBool(req.fluid, 'fluid');
  ensureBool(req.treat_indicated, 'treat_indicated');
  let plan;
  if(req.type==='wet' && req.treat_indicated===true) plan='continue_with_anti_vegf_then_reassess';
  else if(req.type==='wet' && req.treat_indicated===false) plan='continue_with_recheck_then_reassess';
  else plan='continue_with_followup_then_reassess';
  return {plan};
}
function anti_vegf(req){
  ensureEnum(req.drug, 'drug', ['ranibizumab','aflibercept','bevacizumab','faricimab','brolucizumab','other','unknown']);
  ensureNumber(req.injections_so_far, 'injections_so_far');
  ensureNumber(req.cst, 'cst');
  ensureBool(req.retina_attached, 'retina_attached');
  ensureBool(req.complications, 'complications');
  ensureBool(req.induction_complete, 'induction_complete');
  let plan;
  if(req.complications===true && req.retina_attached===false) plan='continue_with_surgery_consult_then_reassess';
  else if(req.cst>=300) plan='continue_with_treat_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function rd(req){
  ensureStr(req.eye, 'eye');
  ensureEnum(req.eye, 'eye', ['od','os','ou']);
  ensureEnum(req.type, 'type', ['rhegmatogenous','tractional','exudative','combined','macular_off','macular_on','unknown','other']);
  ensureBool(req.macula_on, 'macula_on');
  ensureBool(req.pneumatic_offered, 'pneumatic_offered');
  ensureBool(req.vitrectomy_scheduled, 'vitrectomy_scheduled');
  ensureBool(req.scleral_buckle_scheduled, 'scleral_buckle_scheduled');
  let plan;
  if(req.type==='rhegmatogenous' && req.macula_on===true) plan='continue_with_urgent_repair_then_reassess';
  else if(req.type==='tractional') plan='continue_with_pp_vit_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function laser(req){
  ensureEnum(req.laser, 'laser', ['pdr','macular','focal','grid','panretinal','laser_dr','dr_slitlamp','retinopexy','other','unknown']);
  ensureBool(req.target_documented, 'target_documented');
  ensureBool(req.consent, 'consent');
  ensureBool(req.topical_anesthetic, 'topical_anesthetic');
  ensureBool(req.endolasper_ok, 'endolasper_ok');
  ensureBool(req.post_laser_pack, 'post_laser_pack');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.target_documented===false) plan='continue_with_doc_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function retina_fu(req){
  ensureNumber(req.weeks_in_care, 'weeks_in_care');
  ensureBool(req.symptom_change, 'symptom_change');
  ensureBool(req.imaging_recent, 'imaging_recent');
  ensureBool(req.iol_ok, 'iol_ok');
  ensureEnum(req.vision_status, 'vision_status', ['improving','stable','worsening','unknown']);
  ensureBool(req.education_done, 'education_done');
  let plan;
  if(req.vision_status==='worsening') plan='continue_with_eval_then_reassess';
  else if(req.imaging_recent===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {screening,amd,anti_vegf,rd,laser,retina_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
