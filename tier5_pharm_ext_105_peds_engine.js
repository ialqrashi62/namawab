// filepath: tier5_pharm_ext_105_peds_engine.js
// TIER5_PHARMACOLOGY_EXT-105: Pediatric pharmacology
'use strict';
const CITATIONS = ['AAP_Peds_Pharm_2020','Neofax_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function weight_dosing(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.age_months, 'age_months');
  ensureNumber(req.dose_mg_kg, 'dose_mg_kg');
  ensureNumber(req.total_dose, 'total_dose');
  ensureBool(req.double_checked, 'double_checked');
  ensureBool(req.clamped, 'clamped');
  let plan;
  if(req.double_checked===false) plan='continue_with_double_then_reassess';
  else if(req.clamped===false) plan='continue_with_max_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function developmental(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['neonate','infant','toddler','preschool','school','adolescent']);
  ensureBool(req.liver_mature, 'liver_mature');
  ensureBool(req.kidney_mature, 'kidney_mature');
  ensureBool(req.gi_motility, 'gi_motility');
  ensureBool(req.gi_absorption, 'gi_absorption');
  let plan;
  if(req.stage==='neonate' && req.liver_mature===false) plan='continue_with_caution_then_reassess';
  else if(req.stage==='neonate' && req.kidney_mature===false) plan='continue_with_caution_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function formulations(req){
  ensureStr(req.form, 'form');
  ensureEnum(req.form, 'form', ['syrup','suspension','solution','tablet','capsule','chewable','dissolving','injection','topical','inhalation','other']);
  ensureBool(req.palatable, 'palatable');
  ensureBool(req.administrable, 'administrable');
  ensureBool(req.measured_correctly, 'measured_correctly');
  ensureBool(req.caregiver_educated, 'caregiver_educated');
  let plan;
  if(req.administrable===false) plan='continue_with_review_then_reassess';
  else if(req.measured_correctly===false) plan='continue_with_measurement_then_reassess';
  else if(req.caregiver_educated===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function breast_milk(req){
  ensureBool(req.contraindicated, 'contraindicated');
  ensureBool(req.safe, 'safe');
  ensureBool(req.discussed, 'discussed');
  ensureBool(req.timing_optimized, 'timing_optimized');
  ensureBool(req.monitoring, 'monitoring');
  let plan;
  if(req.contraindicated && req.discussed===false) plan='continue_with_counsel_then_reassess';
  else if(req.safe===false) plan='continue_with_review_then_reassess';
  else if(req.timing_optimized===false) plan='continue_with_timing_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function neonatal(req){
  ensureNumber(req.postnatal_age, 'postnatal_age');
  ensureNumber(req.gestational_age, 'gestational_age');
  ensureBool(req.neonatal_dose, 'neonatal_dose');
  ensureBool(req.excretion_considered, 'excretion_considered');
  ensureBool(req.level_drawn, 'level_drawn');
  let plan;
  if(req.gestational_age<34 && req.neonatal_dose===false) plan='continue_with_neonatal_then_reassess';
  else if(req.excretion_considered===false) plan='continue_with_review_then_reassess';
  else if(req.level_drawn===false) plan='continue_with_level_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function off_label(req){
  ensureBool(req.fda_approved, 'fda_approved');
  ensureBool(req.evidence, 'evidence');
  ensureBool(req.consent, 'consent');
  ensureBool(req.safety_reasonable, 'safety_reasonable');
  ensureBool(req.specialist_input, 'specialist_input');
  let plan;
  if(req.fda_approved===false && req.evidence===false) plan='continue_with_review_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.specialist_input===false) plan='continue_with_specialist_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {weight_dosing,developmental,formulations,breast_milk,neonatal,off_label};}
module.exports={funcs,CITATIONS,ValidationError};