// filepath: tier5_wound_ostomy_ext_102_stoma_engine.js
// TIER5_WOUND_OSTOMY_EXT-102: Stoma/ostomy care
'use strict';
const CITATIONS = ['WOCN_Stoma_2017','ASCRS_2018','ECN_Stoma_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function marking(req){
  ensureStr(req.stoma_type, 'stoma_type');
  ensureEnum(req.stoma_type, 'stoma_type', ['colostomy','ileostomy','urostomy','jejunostomy','gastrostomy','tracheostomy']);
  ensureBool(req.surgeon_consulted, 'surgeon_consulted');
  ensureBool(req.skin_condition_assessed, 'skin_condition_assessed');
  ensureBool(req.abdominal_contour_assessed, 'abdominal_contour_assessed');
  ensureBool(req.beltline_avoided, 'beltline_avoided');
  ensureNumber(req.bmi, 'bmi');
  let plan;
  if(req.surgeon_consulted===false) plan='continue_with_consult_then_reassess';
  else if(req.beltline_avoided===false) plan='continue_with_relocate_then_reassess';
  else if(req.bmi>=35) plan='continue_with_challenges_then_reassess';
  else plan='continue_with_proceed_then_reassess';
  return {plan};
}
function appliance(req){
  ensureStr(req.stoma_type, 'stoma_type');
  ensureEnum(req.stoma_type, 'stoma_type', ['colostomy','ileostomy','urostomy','jejunostomy','gastrostomy','tracheostomy']);
  ensureStr(req.output_type, 'output_type');
  ensureEnum(req.output_type, 'output_type', ['formed','semi_formed','liquid','mucous','urine','saliva']);
  ensureBool(req.skin_integrity, 'skin_integrity');
  ensureBool(req.stoma_protrudes, 'stoma_protrudes');
  ensureNumber(req.stoma_height_cm, 'stoma_height_cm');
  ensureBool(req.retracted, 'retracted');
  let plan;
  if(req.retracted) plan='continue_with_convex_then_reassess';
  else if(req.stoma_height_cm<1) plan='continue_with_convex_then_reassess';
  else if(req.output_type==='liquid') plan='continue_with_drainable_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function complications(req){
  ensureStr(req.complication, 'complication');
  ensureEnum(req.complication, 'complication', ['peristomal_skin_breakdown','retraction','prolapse','stenosis','hernia','necrosis','mucocutaneous_separation','high_output','dehydration','obstruction','ischemia']);
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureBool(req.urgent_attention, 'urgent_attention');
  ensureBool(req.educator_consulted, 'educator_consulted');
  let plan;
  if(req.complication==='necrosis' && req.days_post_op<5) plan='continue_with_urgent_then_reassess';
  else if(req.complication==='ischemia') plan='continue_with_urgent_then_reassess';
  else if(req.urgent_attention) plan='continue_with_urgent_then_reassess';
  else if(req.educator_consulted===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.independent_pouch_change, 'independent_pouch_change');
  ensureBool(req.independent_skin_care, 'independent_skin_care');
  ensureBool(req.independent_emptying, 'independent_emptying');
  ensureBool(req.knows_signs_of_complications, 'knows_signs_of_complications');
  ensureBool(req.dietary_education, 'dietary_education');
  ensureBool(req.supply_resupply_plan, 'supply_resupply_plan');
  let plan;
  if(req.independent_pouch_change===false) plan='continue_with_teach_then_reassess';
  else if(req.knows_signs_of_complications===false) plan='continue_with_teach_then_reassess';
  else if(req.supply_resupply_plan===false) plan='continue_with_supply_then_reassess';
  else if(req.dietary_education===false) plan='continue_with_diet_teach_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reversal(req){
  ensureNumber(req.days_since_stoma, 'days_since_stoma');
  ensureBool(req.underlying_disease_resolved, 'underlying_disease_resolved');
  ensureBool(req.anastomosis_intact, 'anastomosis_intact');
  ensureBool(req.nutritional_status, 'nutritional_status');
  ensureBool(req.psychological_readiness, 'psychological_readiness');
  ensureBool(req.stoma_site_healed, 'stoma_site_healed');
  let plan;
  if(req.underlying_disease_resolved===false) plan='continue_with_delay_then_reassess';
  else if(req.anastomosis_intact===false) plan='continue_with_imaging_then_reassess';
  else if(req.nutritional_status===false) plan='continue_with_repletion_then_reassess';
  else if(req.psychological_readiness===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_scheduling_then_reassess';
  return {plan};
}
function irrigation(req){
  ensureStr(req.stoma_type, 'stoma_type');
  ensureEnum(req.stoma_type, 'stoma_type', ['colostomy','ileostomy','urostomy','jejunostomy','gastrostomy','tracheostomy']);
  ensureBool(req.sigmoid_colon_intact, 'sigmoid_colon_intact');
  ensureBool(req.regular_bowel_pattern, 'regular_bowel_pattern');
  ensureBool(req.manual_dexterity, 'manual_dexterity');
  ensureBool(req.education_completed, 'education_completed');
  let plan;
  if(req.stoma_type!=='colostomy') plan='continue_with_not_eligible_then_reassess';
  else if(req.sigmoid_colon_intact===false) plan='continue_with_not_eligible_then_reassess';
  else if(req.manual_dexterity===false) plan='continue_with_caregiver_then_reassess';
  else if(req.education_completed===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {marking,appliance,complications,education,reversal,irrigation};}
module.exports={funcs,CITATIONS,ValidationError};
