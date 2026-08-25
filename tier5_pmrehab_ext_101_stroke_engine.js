// filepath: tier5_pmrehab_ext_101_stroke_engine.js
// TIER5_PMREHAB_EXT-101: Stroke rehab (FIM, dysphagia, mobility, neglect, return-to-drive)
'use strict';
const CITATIONS = ['AHA_Stroke_Rehab_2016','ASHA_Dysphagia_2021','NHF_Stroke_BP_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function fim(req){
  ensureNumber(req.fim_score, 'fim_score');
  ensureNumber(req.weeks_post_stroke, 'weeks_post_stroke');
  ensureBool(req.dysphagia_present, 'dysphagia_present');
  ensureBool(req.dysarthria_present, 'dysarthria_present');
  ensureNumber(req.age, 'age');
  let plan;
  if(req.fim_score<36) plan='severe_disability_then_maximum_assist_3_to_4_hour_therapy';
  else if(req.fim_score<72) plan='moderate_then_2_to_3_hour_therapy_with_discharge_planning';
  else if(req.fim_score<100) plan='mild_then_1_to_2_hour_therapy_with_community_reintegration';
  else plan='minimal_then_continue_therapy_with_home_program';
  if(req.dysphagia_present) plan+='_with_modified_dysphagia_diet';
  if(req.age>=75) plan+='_consider_lower_intensity_with_safety_focus';
  return {plan};
}
function dysphagia_screen(req){
  ensureBool(req.guss_pass, 'guss_pass');
  ensureBool(req.yns_pass, 'yns_pass');
  ensureBool(req.cough_on_swallow, 'cough_on_swallow');
  ensureNumber(req.thin_liquid_passed, 'thin_liquid_passed'); // 0 no 1 yes
  ensureBool(req.voice_change_present, 'voice_change_present');
  ensureBool(req.aspiration_history, 'aspiration_history');
  let decision;
  if(req.guss_pass===false || req.cough_on_swallow) decision='failed_screen_then_refer_modified_barium_swallow_study';
  else if(req.voice_change_present) decision='failed_then_instrumental_swallow_assessment';
  else if(req.aspiration_history) decision='failed_then_refer_speech_therapy_with_diet_modification';
  else decision='passed_then_continue_with_standard_diet';
  return {decision};
}
function mobility_rehab(req){
  ensureNumber(req.fac_score, 'fac_score');
  ensureNumber(req.sit_to_stand_seconds, 'sit_to_stand_seconds');
  ensureNumber(req.tug_seconds, 'tug_seconds');
  ensureNumber(req.gait_speed_m_per_s, 'gait_speed_m_per_s');
  ensureBool(req.fall_history, 'fall_history');
  let plan;
  if(req.fac_score<=2) plan='wheelchair_then_continue_standing_program';
  else if(req.tug_seconds>=14) plan='high_fall_risk_then_supervised_gait_training';
  else if(req.gait_speed_m_per_s<0.4) plan='home_then_progression_to_community';
  else if(req.gait_speed_m_per_s<0.8) plan='community_then_outpatient_therapy';
  else plan='independent_then_community_then_return_to_driving_evaluation';
  if(req.fall_history) plan+='_fall_prevention_program';
  return {plan};
}
function neglect_unilateral(req){
  ensureBool(req.line_bisection_off, 'line_bisection_off');
  ensureBool(req.star_cancellation_missing, 'star_cancellation_missing');
  ensureBool(req.dressing_impact, 'dressing_impact');
  ensureNumber(req.weeks_post_stroke, 'weeks_post_stroke');
  ensureBool(req.adl_impact_severe, 'adl_impact_severe');
  let plan;
  if(req.weeks_post_stroke<4 && req.adl_impact_severe) plan='acute_then_prism_adaptation_with_visual_scanning_training';
  else if(req.line_bisection_off && req.star_cancellation_missing) plan='visuospatial_then_visual_scanning_with_task_specific_training';
  else if(req.dressing_impact) plan='top_down_with_environmental_cues';
  else plan='continue_with_observation_then_reassess_in_4_weeks';
  return {plan};
}
function return_to_drive(req){
  ensureNumber(req.brac_score, 'brac_score');
  ensureBool(req.visual_field_defect, 'visual_field_defect');
  ensureBool(req.neglect_present, 'neglect_present');
  ensureBool(req.seizure_history, 'seizure_history');
  ensureNumber(req.months_seizure_free, 'months_seizure_free');
  let plan;
  if(req.brac_score<3) plan='not_eligible_then_on_road_evaluation_pending';
  else if(req.visual_field_defect || req.neglect_present) plan='fail_then_off_road_assessment_then_refer_vision_rehab';
  else if(req.seizure_history && req.months_seizure_free<6) plan='defer_then_reassess_after_6_months_seizure_free';
  else plan='continue_with_simulator_then_on_road_evaluation';
  return {plan};
}
function cognition_rehab(req){
  ensureNumber(req.moca_score, 'moca_score');
  ensureNumber(req.tmt_b_seconds, 'tmt_b_seconds');
  ensureBool(req.memory_complaint, 'memory_complaint');
  ensureBool(req.executive_dysfunction, 'executive_dysfunction');
  ensureBool(req.aphasia_present, 'aphasia_present');
  let plan;
  if(req.moca_score<20) plan='moderate_then_cognitive_rehab_with_compensatory_strategies';
  else if(req.tmt_b_seconds>180) plan='executive_then_metacognitive_strategy_training';
  else if(req.memory_complaint) plan='memory_then_visual_imagery_with_internal_strategy_training';
  else if(req.aphasia_present) plan='language_then_refer_speech_therapy_with_intensive_treatment';
  else plan='continue_with_observation_then_reassess_in_3_months';
  return {plan};
}
function funcs(){return {fim,dysphagia_screen,mobility_rehab,neglect_unilateral,return_to_drive,cognition_rehab};}
module.exports={funcs,CITATIONS,ValidationError};
