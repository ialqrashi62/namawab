// filepath: tier5_nephrology_ext_106_ped_engine.js
// TIER5_NEPHROLOGY_EXT-106: Pediatric nephrology
'use strict';
const CITATIONS = ['IPNA_Peds_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function uti(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['cystitis','pyelonephritis','asymptomatic_bacteriuria','recurrent_uti','febrile_uti','afebrile_uti']);
  ensureBool(req.febrile, 'febrile');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.prophylaxis, 'prophylaxis');
  ensureNumber(req.age_months, 'age_months');
  let plan;
  if(req.type==='pyelonephritis' && req.febrile && req.age_months<24) plan='continue_with_us_then_reassess';
  else if(req.recurrent_uti && req.imaging_done===false) plan='continue_with_us_then_reassess';
  else if(req.type==='pyelonephritis') plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vesicoureteral(req){
  ensureStr(req.grade, 'grade');
  ensureEnum(req.grade, 'grade', ['i','ii','iii','iv','v','unknown']);
  ensureBool(req.bilateral, 'bilateral');
  ensureBool(req.prophylaxis, 'prophylaxis');
  ensureBool(req.surgical_referral, 'surgical_referral');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.grade==='iv' || req.grade==='v') plan='continue_with_surgery_then_reassess';
  else if(req.bilateral && req.grade==='iii') plan='continue_with_surgery_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nephrotic(req){
  ensureBool(req.steroid_responsive, 'steroid_responsive');
  ensureBool(req.steroid_dependent, 'steroid_dependent');
  ensureBool(req.steroid_resistant, 'steroid_resistant');
  ensureBool(req.frequent_relapser, 'frequent_relapser');
  ensureBool(req.biopsy_needed, 'biopsy_needed');
  ensureBool(req.albumin_infused, 'albumin_infused');
  let plan;
  if(req.steroid_resistant && req.biopsy_needed===false) plan='continue_with_biopsy_then_reassess';
  else if(req.steroid_dependent) plan='continue_with_steroid_sparing_then_reassess';
  else if(req.albumin_infused===false) plan='continue_with_albumin_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hemolytic_uremic(req){
  ensureBool(req.microangiopathic_anemia, 'microangiopathic_anemia');
  ensureBool(req.schistocytes, 'schistocytes');
  ensureBool(req.thrombocytopenia, 'thrombocytopenia');
  ensureBool(req.renal_impairment, 'renal_impairment');
  ensureBool(req.dialysis_needed, 'dialysis_needed');
  ensureBool(req.plasmapheresis_needed, 'plasmapheresis_needed');
  let plan;
  if(req.dialysis_needed) plan='continue_with_dialysis_then_reassess';
  else if(req.plasmapheresis_needed) plan='continue_with_plasmapheresis_then_reassess';
  else if(req.thrombocytopenia && req.schistocytes) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function growth(req){
  ensureNumber(req.height_z, 'height_z');
  ensureNumber(req.weight_z, 'weight_z');
  ensureBool(req.growth_failure, 'growth_failure');
  ensureBool(req.nutritional_support, 'nutritional_support');
  ensureBool(req.gh_therapy, 'gh_therapy');
  let plan;
  if(req.growth_failure && req.nutritional_support===false) plan='continue_with_nutrition_then_reassess';
  else if(req.height_z<-2 && req.gh_therapy===false) plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transplantation(req){
  ensureBool(req.referred, 'referred');
  ensureBool(req.workup_complete, 'workup_complete');
  ensureBool(req.live_donor_evaluation, 'live_donor_evaluation');
  ensureBool(req.listed, 'listed');
  ensureBool(req.scheduled, 'scheduled');
  let plan;
  if(req.workup_complete===false) plan='continue_with_workup_then_reassess';
  else if(req.live_donor_evaluation===false) plan='continue_with_donor_then_reassess';
  else if(req.listed===false) plan='continue_with_list_then_reassess';
  else if(req.scheduled===false) plan='continue_with_schedule_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {uti,vesicoureteral,nephrotic,hemolytic_uremic,growth,transplantation};}
module.exports={funcs,CITATIONS,ValidationError};