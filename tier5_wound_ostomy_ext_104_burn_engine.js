// filepath: tier5_wound_ostomy_ext_104_burn_engine.js
// TIER5_WOUND_OSTOMY_EXT-104: Burn care
'use strict';
const CITATIONS = ['ABA_Burn_2018','ISBI_2018','ABLS_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assessment(req){
  ensureNumber(req.tbsa_pct, 'tbsa_pct');
  ensureStr(req.thickness, 'thickness');
  ensureEnum(req.thickness, 'thickness', ['superficial','superficial_partial','deep_partial','full_thickness','fourth_degree']);
  ensureStr(req.mechanism, 'mechanism');
  ensureEnum(req.mechanism, 'mechanism', ['thermal','chemical','electrical','radiation','friction','scald','contact']);
  ensureBool(req.inhalation_injury, 'inhalation_injury');
  ensureBool(req.circumferential, 'circumferential');
  ensureNumber(req.age, 'age');
  let plan;
  if(req.tbsa_pct>=20 || req.inhalation_injury) plan='continue_with_burn_center_then_reassess';
  else if(req.thickness==='full_thickness' || req.thickness==='fourth_degree') plan='continue_with_surgical_eval_then_reassess';
  else if(req.circumferential) plan='continue_with_escharotomy_eval_then_reassess';
  else if(req.age<5 || req.age>=60) plan='continue_with_observation_then_reassess';
  else plan='continue_with_outpatient_then_reassess';
  return {plan};
}
function resuscitation(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.tbsa_pct, 'tbsa_pct');
  ensureNumber(req.hours_since_burn, 'hours_since_burn');
  ensureNumber(req.fluid_input_total_ml, 'fluid_input_total_ml');
  ensureNumber(req.fluid_output_total_ml, 'fluid_output_total_ml');
  ensureNumber(req.urine_output_ml_per_hr, 'urine_output_ml_per_hr');
  ensureBool(req.inhalation_injury, 'inhalation_injury');
  let plan;
  if(req.urine_output_ml_per_hr<0.5 && req.hours_since_burn<24) plan='continue_with_increase_then_reassess';
  else if(req.urine_output_ml_per_hr>1.5 && req.hours_since_burn<24) plan='continue_with_decrease_then_reassess';
  else if(req.fluid_input_total_ml-req.fluid_output_total_ml>4000 && req.hours_since_burn<12) plan='continue_with_cautious_then_reassess';
  else if(req.inhalation_injury) plan='continue_with_increase_50pct_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function escharotomy(req){
  ensureBool(req.circumferential_full_thickness, 'circumferential_full_thickness');
  ensureBool(req.distal_pulses_decreased, 'distal_pulses_decreased');
  ensureBool(req.capillary_refill_prolonged, 'capillary_refill_prolonged');
  ensureBool(req.sensory_loss, 'sensory_loss');
  ensureBool(req.compartment_syndrome_signs, 'compartment_syndrome_signs');
  let plan;
  if(req.compartment_syndrome_signs) plan='continue_with_urgent_escharotomy_then_reassess';
  else if(req.distal_pulses_decreased && req.circumferential_full_thickness) plan='continue_with_escharotomy_then_reassess';
  else if(req.capillary_refill_prolonged) plan='continue_with_monitor_then_reassess';
  else if(req.sensory_loss) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dressing(req){
  ensureStr(req.burn_depth, 'burn_depth');
  ensureEnum(req.burn_depth, 'burn_depth', ['superficial','superficial_partial','deep_partial','full_thickness','fourth_degree']);
  ensureNumber(req.tbsa_pct, 'tbsa_pct');
  ensureBool(req.exudate_present, 'exudate_present');
  ensureBool(req.signs_of_infection, 'signs_of_infection');
  ensureBool(req.graft_present, 'graft_present');
  let plan;
  if(req.graft_present) plan='continue_with_graft_then_reassess';
  else if(req.signs_of_infection) plan='continue_with_topical_abx_then_reassess';
  else if(req.burn_depth==='superficial_partial') plan='continue_with_silver_then_reassess';
  else if(req.burn_depth==='deep_partial') plan='continue_with_ssd_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function infection(req){
  ensureNumber(req.temp_c, 'temp_c');
  ensureNumber(req.wbc_count, 'wbc_count');
  ensureNumber(req.crp_mg_l, 'crp_mg_l');
  ensureBool(req.local_erythema, 'local_erythema');
  ensureBool(req.purulent_drainage, 'purulent_drainage');
  ensureBool(req.graft_loss, 'graft_loss');
  ensureNumber(req.days_post_burn, 'days_post_burn');
  let plan;
  if(req.graft_loss) plan='continue_with_surgical_then_reassess';
  else if(req.temp_c>=38.5 && req.purulent_drainage) plan='continue_with_iv_abx_then_reassess';
  else if(req.crp_mg_l>100) plan='continue_with_antibiotics_then_reassess';
  else if(req.local_erythema && req.days_post_burn<7) plan='continue_with_topical_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rehabilitation(req){
  ensureBool(req.positioning_started, 'positioning_started');
  ensureBool(req.splinting, 'splinting');
  ensureBool(req.range_of_motion, 'range_of_motion');
  ensureBool(req.pressure_garment, 'pressure_garment');
  ensureBool(req.scar_management, 'scar_management');
  ensureBool(req.psychological_support, 'psychological_support');
  let plan;
  if(req.positioning_started===false) plan='continue_with_position_then_reassess';
  else if(req.range_of_motion===false) plan='continue_with_rom_then_reassess';
  else if(req.pressure_garment===false) plan='continue_with_garment_then_reassess';
  else if(req.psychological_support===false) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assessment,resuscitation,escharotomy,dressing,infection,rehabilitation};}
module.exports={funcs,CITATIONS,ValidationError};
