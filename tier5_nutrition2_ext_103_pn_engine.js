// filepath: tier5_nutrition2_ext_103_pn_engine.js
// TIER5_NUTRITION2_EXT-103: Parenteral nutrition compounding
'use strict';
const CITATIONS = ['ASPEN_PN_2017','USP_797_2019','ESPEN_PN_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pn_macronutrients(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.kcal_target, 'kcal_target');
  ensureNumber(req.protein_g_target, 'protein_g_target');
  ensureNumber(req.fluid_target_ml, 'fluid_target_ml');
  ensureNumber(req.dextrose_pct, 'dextrose_pct');
  ensureNumber(req.lipid_pct, 'lipid_pct');
  let plan;
  if(req.kcal_target<req.weight_kg*20) plan='continue_with_low_calorie_then_reassess';
  else if(req.kcal_target>req.weight_kg*35) plan='continue_with_overfeeding_then_reassess';
  else if(req.protein_g_target<req.weight_kg*1.2) plan='continue_with_protein_adequate_then_reassess';
  else plan='continue_with_standard_compounding';
  return {plan};
}
function pn_micronutrients(req){
  ensureNumber(req.zinc_mg, 'zinc_mg');
  ensureNumber(req.copper_mg, 'copper_mg');
  ensureNumber(req.selenium_mcg, 'selenium_mcg');
  ensureBool(req.chromium_present, 'chromium_present');
  ensureBool(req.manganese_present, 'manganese_present');
  ensureBool(req.iron_present, 'iron_present');
  let plan;
  if(req.copper_mg>2 && req.biliary_obstructed) plan='continue_with_copper_review_then_reassess';
  else if(req.selenium_mcg<60) plan='continue_with_supplement_then_reassess';
  else plan='continue_with_standard_compounding';
  return {plan};
}
function pn_compound(req){
  ensureNumber(req.total_volume_ml, 'total_volume_ml');
  ensureNumber(req.final_osmolality, 'final_osmolality');
  ensureBool(req.lipid_combined, 'lipid_combined');
  ensureBool(req.iv_filter_used, 'iv_filter_used');
  ensureBool(req.tpn_order_clarity, 'tpn_order_clarity');
  ensureBool(req.aseptic_technique, 'aseptic_technique');
  let plan;
  if(!req.aseptic_technique) plan='continue_with_re_evaluate_then_reassess';
  else if(!req.tpn_order_clarity) plan='continue_with_clarify_order_then_reassess';
  else if(req.lipid_combined && req.iv_filter_used===false) plan='continue_with_use_filter_then_reassess';
  else if(req.final_osmolality>900 && req.peripheral_only) plan='continue_with_central_access_then_reassess';
  else plan='continue_with_compound_then_dispense';
  return {plan};
}
function pn_monitoring(req){
  ensureNumber(req.blood_glucose, 'blood_glucose');
  ensureNumber(req.triglycerides, 'triglycerides');
  ensureNumber(req.bun, 'bun');
  ensureBool(req.liver_enzymes_elevated, 'liver_enzymes_elevated');
  ensureNumber(req.weight_kg, 'weight_kg');
  let plan;
  if(req.blood_glucose>=180) plan='continue_with_insulin_protocol_then_reassess';
  else if(req.triglycerides>=500) plan='continue_with_reduce_lipid_then_reassess';
  else if(req.liver_enzymes_elevated) plan='continue_with_pn_review_then_reassess';
  else if(req.bun>=80) plan='continue_with_reassess_overfeeding';
  else plan='continue_with_standard_monitoring';
  return {plan};
}
function cyclic_pn(req){
  ensureNumber(req.cycle_hours, 'cycle_hours');
  ensureNumber(req.taper_hours, 'taper_hours');
  ensureBool(req.glucose_stable, 'glucose_stable');
  ensureBool(req.tolerated, 'tolerated');
  ensureNumber(req.kcal_total, 'kcal_total');
  let plan;
  if(req.cycle_hours>16) plan='continue_with_shorten_cycle_then_reassess';
  else if(req.glucose_stable===false) plan='continue_with_glucose_review_then_reassess';
  else if(req.tolerated===false) plan='continue_with_slower_taper_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transition_to_enteral(req){
  ensureNumber(req.days_on_pn, 'days_on_pn');
  ensureNumber(req.enteral_intake_pct, 'enteral_intake_pct');
  ensureBool(req.gi_functioning, 'gi_functioning');
  ensureBool(req.electrolyte_stable, 'electrolyte_stable');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  let plan;
  if(req.enteral_intake_pct>=60 && req.gi_functioning && req.electrolyte_stable) plan='continue_with_decrease_pn_then_reassess';
  else if(req.gi_functioning===false) plan='continue_with_pn_continue_then_reassess';
  else plan='continue_with_gradual_transition_then_reassess';
  return {plan};
}
function funcs(){return {pn_macronutrients,pn_micronutrients,pn_compound,pn_monitoring,cyclic_pn,transition_to_enteral};}
module.exports={funcs,CITATIONS,ValidationError};
