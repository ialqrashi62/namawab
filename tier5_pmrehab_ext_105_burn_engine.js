// filepath: tier5_pmrehab_ext_105_burn_engine.js
// TIER5_PMREHAB_EXT-105: Burn rehab (TBSA, ROM, hypertrophic scar, positioning, return)
'use strict';
const CITATIONS = ['ABA_Burn_2018','ISBI_2018','JBCR_Scars_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function tbsa_assess(req){
  ensureNumber(req.tbsa_pct, 'tbsa_pct');
  ensureNumber(req.age, 'age');
  ensureBool(req.inhalation_injury, 'inhalation_injury');
  ensureBool(req.full_thickness_present, 'full_thickness_present');
  ensureStr(req.burn_mechanism, 'burn_mechanism');
  ensureEnum(req.burn_mechanism, 'burn_mechanism', ['thermal_scald','thermal_contact','thermal_flame','chemical','electrical','radiation','friction']);
  let severity;
  if(req.tbsa_pct>=40 || (req.inhalation_injury && req.tbsa_pct>=20)) severity='severe_then_burn_center_referral';
  else if(req.tbsa_pct>=20 || req.full_thickness_present) severity='moderate_then_burn_center_with_rehab';
  else if(req.tbsa_pct>=10) severity='mild_moderate_then_outpatient_with_rehab';
  else severity='mild_then_outpatient_follow_up';
  if(req.age<=4 || req.age>=60) severity+='_consider_age_risk';
  return {severity};
}
function rom_mgmt(req){
  ensureNumber(req.joint_rom_degrees, 'joint_rom_degrees');
  ensureNumber(req.normal_rom_degrees, 'normal_rom_degrees');
  ensureBool(req.contracture_present, 'contracture_present');
  ensureBool(req.splinting_done, 'splinting_done');
  ensureNumber(req.weeks_post_burn, 'weeks_post_burn');
  let plan;
  if(req.contracture_present) plan='refer_plastic_surgery_with_splinting_intensification';
  else if(req.joint_rom_degrees<=(req.normal_rom_degrees*0.5) && req.weeks_post_burn<=8) plan='intensify_pt_with_serial_splinting';
  else if(req.joint_rom_degrees<=(req.normal_rom_degrees*0.8)) plan='continue_with_active_pt';
  else plan='continue_with_home_program_then_reassess';
  if(req.splinting_done===false && req.weeks_post_burn<=12) plan+='_consider_splinting';
  return {plan};
}
function hypertrophic_scar(req){
  ensureBool(req.scar_present, 'scar_present');
  ensureNumber(req.scar_thickness_mm, 'scar_thickness_mm');
  ensureBool(req.scar_redness, 'scar_redness');
  ensureBool(req.pressure_garment_worn, 'pressure_garment_worn');
  ensureBool(req.silicone_gel_used, 'silicone_gel_used');
  ensureNumber(req.months_post_burn, 'months_post_burn');
  let plan;
  if(req.scar_thickness_mm>=5 && req.pressure_garment_worn===false) plan='initiate_pressure_garment_23_24_hours_per_day';
  else if(req.scar_redness && req.silicone_gel_used===false) plan='initiate_silicone_gel_with_pressure';
  else if(req.months_post_burn<12) plan='continue_with_combined_pressure_and_silicone';
  else plan='consider_laser_therapy_then_reassess';
  return {plan};
}
function positioning(req){
  ensureStr(req.affected_area, 'affected_area');
  ensureEnum(req.affected_area, 'affected_area', ['neck','axilla','elbow','hand','hip','knee','ankle','face']);
  ensureBool(req.anti_contracture_position_used, 'anti_contracture_position_used');
  ensureBool(req.splint_in_place, 'splint_in_place');
  ensureBool(req.skin_breakdown, 'skin_breakdown');
  let plan;
  if(req.skin_breakdown) plan='reassess_splint_with_wound_care';
  else if(req.anti_contracture_position_used===false) plan='initiate_anti_contracture_positioning';
  else if(req.splint_in_place===false) plan='initiate_splinting_with_24_hour_protocol';
  else plan='continue_with_positioning_with_reassess';
  return {plan};
}
function return_to_work(req){
  ensureNumber(req.weeks_post_burn, 'weeks_post_burn');
  ensureBool(req.scars_mature, 'scars_mature');
  ensureBool(req.heat_intolerance, 'heat_intolerance');
  ensureBool(req.heavy_lifting_required, 'heavy_lifting_required');
  ensureBool(req.employer_accommodations, 'employer_accommodations');
  let plan;
  if(req.weeks_post_burn<8) plan='too_early_then_continue_rehab_with_return_in_8_weeks';
  else if(req.scars_mature===false) plan='continue_scar_management_then_reassess';
  else if(req.heat_intolerance) plan='workplace_accommodations_with_cooling_measures';
  else if(req.heavy_lifting_required) plan='gradual_return_with_modified_duties';
  else plan='continue_with_full_return_then_reassess';
  if(req.employer_accommodations===false) plan+='_vocational_rehab_consultation';
  return {plan};
}
function pruritus(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.gabapentin_tried, 'gabapentin_tried');
  ensureBool(req.antihistamine_tried, 'antihistamine_tried');
  ensureBool(req.scar_massage_done, 'scar_massage_done');
  ensureBool(req.moisturizer_regular, 'moisturizer_regular');
  let plan;
  if(req.pain_score>=7 && req.gabapentin_tried===false) plan='initiate_gabapentin_with_antihistamine';
  else if(req.gabapentin_tried && req.pain_score>=7) plan='refer_pain_clinic_then_reassess';
  else if(req.scar_massage_done===false) plan='initiate_scar_massage_then_reassess';
  else if(req.moisturizer_regular===false) plan='continue_moisturizer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {tbsa_assess,rom_mgmt,hypertrophic_scar,positioning,return_to_work,pruritus};}
module.exports={funcs,CITATIONS,ValidationError};
