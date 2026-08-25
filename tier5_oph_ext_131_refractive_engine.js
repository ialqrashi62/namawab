// filepath: tier5_oph_ext_131_refractive_engine.js
// TIER5_OPH_EXT-131: Refractive Surgery (LASIK/PRK/SMILE/ICL)
'use strict';
const CITATIONS = ['AAO_REFR_2021','FDA_LASIK_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function screening(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.sphere, 'sphere');
  ensureNumber(req.cylinder, 'cylinder');
  ensureNumber(req.pachymetry, 'pachymetry');
  ensureBool(req.topo_normal, 'topo_normal');
  ensureBool(req.dry_eye_present, 'dry_eye_present');
  let plan;
  if(req.age<18) plan='continue_with_defer_then_reassess';
  else if(req.topo_normal===false) plan='continue_with_screening_formal_then_reassess';
  else if(req.pachymetry<480) plan='continue_with_pachymetry_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function lasik(req){
  ensureNumber(req.sphere, 'sphere');
  ensureNumber(req.cylinder, 'cylinder');
  ensureNumber(req.pachymetry, 'pachymetry');
  ensureBool(req.femtosecond_available, 'femtosecond_available');
  ensureBool(req.slit_lamp_clear, 'slit_lamp_clear');
  ensureBool(req.flap_plan_ok, 'flap_plan_ok');
  let plan;
  if(req.pachymetry<500) plan='continue_with_prk_then_reassess';
  else if(req.slit_lamp_clear===false) plan='continue_with_treatment_first_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function prk(req){
  ensureNumber(req.sphere, 'sphere');
  ensureNumber(req.cylinder, 'cylinder');
  ensureNumber(req.pachymetry, 'pachymetry');
  ensureEnum(req.treatment_zone, 'treatment_zone', ['6','7','8','9','other']);
  ensureBool(req.mmc_used, 'mmc_used');
  ensureBool(req.profile_complete, 'profile_complete');
  let plan;
  if(req.pachymetry<450) plan='continue_with_review_then_reassess';
  else if(req.mmc_used===false && req.pachymetry<550) plan='continue_with_mmc_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function icl(req){
  ensureNumber(req.sphere, 'sphere');
  ensureNumber(req.al, 'al');
  ensureNumber(req.acd, 'acd');
  ensureBool(req.endothelial_ok, 'endothelial_ok');
  ensureBool(req.iol_size_planned, 'iol_size_planned');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.acd<2.8) plan='continue_with_size_review_then_reassess';
  else if(req.endothelial_ok===false) plan='continue_with_referral_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function smile(req){
  ensureNumber(req.sphere, 'sphere');
  ensureNumber(req.cylinder, 'cylinder');
  ensureEnum(req.sphere_range, 'sphere_range', ['low','moderate','high','unknown']);
  ensureBool(req.topo_normal, 'topo_normal');
  ensureBool(req.cap_intact, 'cap_intact');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.sphere_range==='high' || req.cylinder>5) plan='continue_with_lasik_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function refractive_fu(req){
  ensureNumber(req.weeks_post_op, 'weeks_post_op');
  ensureNumber(req.sphere_after, 'sphere_after');
  ensureNumber(req.cylinder_after, 'cylinder_after');
  ensureBool(req.enhancement_needed, 'enhancement_needed');
  ensureBool(req.dry_eye_treated, 'dry_eye_treated');
  ensureBool(req.satisfaction, 'satisfaction');
  ensureBool(req.stabilization_documented, 'stabilization_documented');
  let plan;
  if(req.enhancement_needed===true && req.stabilization_documented===false) plan='continue_with_reassess_then_reassess';
  else if(req.dry_eye_treated===false) plan='continue_with_treatment_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {screening,lasik,prk,icl,smile,refractive_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
