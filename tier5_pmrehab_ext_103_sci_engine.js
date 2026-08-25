// filepath: tier5_pmrehab_ext_103_sci_engine.js
// TIER5_PMREHAB_EXT-103: SCI rehab (ASIA, neurogenic bladder/bowel, DVT, spasticity)
'use strict';
const CITATIONS = ['AANS_ASIA_2019','Paralyzed_Veterans_Bowel_2018','NASCIC_Spasticity_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function asia_assess(req){
  ensureNumber(req.motor_score, 'motor_score');
  ensureNumber(req.sensory_score, 'sensory_score');
  ensureStr(req.injury_level, 'injury_level');
  ensureEnum(req.injury_level, 'injury_level', ['c1','c2','c3','c4','c5','c6','c7','c8','t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','t11','t12','l1','l2','l3','l4','l5','s1','s2','s3','s4','s5']);
  ensureBool(req.complete_injury, 'complete_injury');
  let severity;
  if(req.complete_injury) severity='asia_a_then_full_rehab_with_discharge_planning';
  else if(req.motor_score>50) severity='asia_d_then_community_ambulation_potential';
  else if(req.motor_score>20) severity='asia_c_then_assistive_devices_with_standing_program';
  else if(req.motor_score>0) severity='asia_b_then_sensorimotor_with_function_outcomes';
  else severity='asia_a_complete_then_discharge_planning';
  return {severity};
}
function bladder(req){
  ensureBool(req.catheter_indwelling, 'catheter_indwelling');
  ensureBool(req.ic_done, 'ic_done');
  ensureBool(req.utis_per_year_above_3, 'utis_per_year_above_3');
  ensureBool(req.detrusor_overactivity, 'detrusor_overactivity');
  ensureNumber(req.post_void_residual_ml, 'post_void_residual_ml');
  let plan;
  if(req.catheter_indwelling===false && req.ic_done===false && req.post_void_residual_ml>=300) plan='start_ic_then_reassess';
  else if(req.catheter_indwelling===false && req.ic_done===false) plan='continue_with_voiding_trial_then_reassess';
  else if(req.utis_per_year_above_3) plan='review_catheter_protocol_with_urology';
  else if(req.detrusor_overactivity) plan='anticholinergic_with_urology_follow_up';
  else plan='continue_with_current_protocol_then_reassess';
  return {plan};
}
function bowel(req){
  ensureNumber(req.bowel_program_days, 'bowel_program_days');
  ensureBool(req.autonomic_dysreflexia_history, 'autonomic_dysreflexia_history');
  ensureBool(req.diet_optimized, 'diet_optimized');
  ensureBool(req.stool_softeners_used, 'stool_softeners_used');
  ensureBool(req.digital_stimulation_needed, 'digital_stimulation_needed');
  let plan;
  if(req.autonomic_dysreflexia_history) plan='adr_protocol_review_then_refer_sci_rehab';
  else if(req.bowel_program_days>=60) plan='continue_with_program_then_reassess_in_30_days';
  else if(!req.diet_optimized) plan='optimize_fiber_then_reassess';
  else if(!req.stool_softeners_used) plan='initiate_softeners_then_reassess';
  else if(req.digital_stimulation_needed) plan='continue_stimulation_then_reassess';
  else plan='continue_with_standard_program';
  return {plan};
}
function dvt_prevention(req){
  ensureNumber(req.days_post_injury, 'days_post_injury');
  ensureBool(req.motor_complete, 'motor_complete');
  ensureBool(req.anticoagulation_active, 'anticoagulation_active');
  ensureNumber(req.leg_circumference_diff_cm, 'leg_circumference_diff_cm');
  ensureBool(req.bleed_risk_high, 'bleed_risk_high');
  let plan;
  if(req.days_post_injury<14 && req.motor_complete && req.anticoagulation_active===false) plan='initiate_lmwh_then_reassess_in_3_months';
  else if(req.leg_circumference_diff_cm>=3) plan='dvt_suspected_then_doppler_then_treat';
  else if(req.bleed_risk_high) plan='continue_mechanical_prophylaxis_then_reassess';
  else plan='continue_with_current_regimen_then_reassess';
  return {plan};
}
function spasticity(req){
  ensureNumber(req.mas_score, 'mas_score');
  ensureBool(req.contracture_present, 'contracture_present');
  ensureBool(req.oral_meds_tried, 'oral_meds_tried');
  ensureBool(req.botulinum_toxin_candidate, 'botulinum_toxin_candidate');
  ensureBool(req.intrathecal_pump_consideration, 'intrathecal_pump_consideration');
  let plan;
  if(req.contracture_present) plan='refer_orthopedic_with_possible_serial_casting';
  else if(req.mas_score>=3 && req.oral_meds_tried===false) plan='initiate_baclofen_with_pt';
  else if(req.mas_score>=3 && req.oral_meds_tried) plan='refer_for_botulinum_toxin_injection';
  else if(req.intrathecal_pump_consideration) plan='refer_pm_and_r_for_intrathecal_evaluation';
  else plan='continue_with_stretching_with_reassess_in_4_weeks';
  return {plan};
}
function wheelchair_seating(req){
  ensureNumber(req.pressure_injury_stage, 'pressure_injury_stage');
  ensureBool(req.postural_asymmetry, 'postural_asymmetry');
  ensureBool(req.independent_propulsion, 'independent_propulsion');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.custom_seat_cushion, 'custom_seat_cushion');
  let plan;
  if(req.pressure_injury_stage>=2) plan='wound_care_then_offload_within_24_hours';
  else if(req.postural_asymmetry) plan='postural_assessment_then_custom_seating';
  else if(req.custom_seat_cushion===false) plan='refer_seating_clinic_for_cushion';
  else if(req.weight_kg>=120) plan='heavy_duty_wheelchair_then_refer_seating';
  else plan='continue_with_current_equipment_then_reassess_in_12_months';
  return {plan};
}
function funcs(){return {asia_assess,bladder,bowel,dvt_prevention,spasticity,wheelchair_seating};}
module.exports={funcs,CITATIONS,ValidationError};
