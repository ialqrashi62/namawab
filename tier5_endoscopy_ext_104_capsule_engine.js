// filepath: tier5_endoscopy_ext_104_capsule_engine.js
// TIER5_ENDOSCOPY_EXT-104: Capsule endoscopy
'use strict';
const CITATIONS = ['ASGE_Capsule_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['obscure_gi_bleed','suspected_crohn','suspected_sb_tumor','celiac_dx','sb_polyps','ulcer','malabsorption','angiodysplasia','other']);
  ensureBool(req.prior_egd_colon, 'prior_egd_colon');
  ensureBool(req.pacemaker, 'pacemaker');
  let plan;
  if(req.prior_egd_colon===false) plan='continue_with_standard_then_reassess';
  else if(req.pacemaker) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prep(req){
  ensureStr(req.score, 'score');
  ensureEnum(req.score, 'score', ['adequate','fair','poor','inadequate']);
  ensureBool(req.simethicone, 'simethicone');
  ensureBool(req.fasting, 'fasting');
  ensureBool(req.prokinetics, 'prokinetics');
  let plan;
  if(req.score==='inadequate' || req.score==='poor') plan='continue_with_repeat_then_reassess';
  else if(req.fasting===false) plan='continue_with_fast_then_reassess';
  else if(req.prokinetics===false && req.score!=='adequate') plan='continue_with_prokinetic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function findings(req){
  ensureBool(req.angiodysplasia, 'angiodysplasia');
  ensureBool(req.mass, 'mass');
  ensureBool(req.ulcer, 'ulcer');
  ensureBool(req.bleeding_active, 'bleeding_active');
  ensureBool(req.crohns, 'crohns');
  ensureBool(req.normal, 'normal');
  let plan;
  if(req.bleeding_active) plan='continue_with_emergent_then_reassess';
  else if(req.mass) plan='continue_with_refer_then_reassess';
  else if(req.crohns) plan='continue_with_mri_then_reassess';
  else if(req.angiodysplasia) plan='continue_with_aps_then_reassess';
  else if(req.normal) plan='continue_with_observation_then_reassess';
  else plan='continue_with_review_then_reassess';
  return {plan};
}
function retention(req){
  ensureNumber(req.location, 'location');
  ensureBool(req.symptoms, 'symptoms');
  ensureBool(req.crohns_stricture, 'crohns_stricture');
  ensureBool(req.surgical_history, 'surgical_history');
  ensureBool(req.retrieved, 'retrieved');
  let plan;
  if(req.retrieved===false) plan='continue_with_refer_then_reassess';
  else if(req.symptoms) plan='continue_with_patency_capsule_then_reassess';
  else if(req.crohns_stricture) plan='continue_with_patency_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.workup_complete, 'workup_complete');
  ensureBool(req.aps_therapy, 'aps_therapy');
  ensureBool(req.surgical_referral, 'surgical_referral');
  ensureBool(req.imaging_planned, 'imaging_planned');
  ensureBool(req.biopsies_planned, 'biopsies_planned');
  let plan;
  if(req.surgical_referral) plan='continue_with_refer_then_reassess';
  else if(req.aps_therapy===false && req.workup_complete) plan='continue_with_aps_then_reassess';
  else if(req.imaging_planned===false) plan='continue_with_imaging_then_reassess';
  else if(req.biopsies_planned===false) plan='continue_with_bx_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function record(req){
  ensureNumber(req.life_battery, 'life_battery');
  ensureNumber(req.sb_transit, 'sb_transit');
  ensureBool(req.complete_record, 'complete_record');
  ensureBool(req.excellent_view, 'excellent_view');
  ensureBool(req.landmarks, 'landmarks');
  let plan;
  if(req.complete_record===false) plan='continue_with_review_then_reassess';
  else if(req.landmarks===false) plan='continue_with_repeat_then_reassess';
  else if(req.excellent_view===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,prep,findings,retention,followup,record};}
module.exports={funcs,CITATIONS,ValidationError};