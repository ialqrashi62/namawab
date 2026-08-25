// filepath: tier5_sleep_med_ext_106_peds_engine.js
// TIER5_SLEEP_MED_EXT-106: Pediatric sleep
'use strict';
const CITATIONS = ['AASM_Pediatric_2016','Pediatric_Sleep_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function peds_assessment(req){
  ensureNumber(req.age_years, 'age_years');
  ensureStr(req.sleep_concern, 'sleep_concern');
  ensureEnum(req.sleep_concern, 'sleep_concern', ['snoring','behavioral_insomnia','night_wakings','sleep_onset_delay','parasomnias','daytime_sleepiness','restless_sleep','sleep_apnea']);
  ensureNumber(req.bedtime_hour, 'bedtime_hour');
  ensureNumber(req.wake_hour, 'wake_hour');
  ensureNumber(req.total_sleep_hr, 'total_sleep_hr');
  ensureBool(req.school_problems, 'school_problems');
  let plan;
  if(req.sleep_concern==='sleep_apnea' || req.sleep_concern==='snoring') plan='continue_with_sleep_study_then_reassess';
  else if(req.total_sleep_hr<req.age_years<6 ? 11 : 10) plan='continue_with_extension_then_reassess';
  else if(req.sleep_concern==='behavioral_insomnia') plan='continue_with_extinction_then_reassess';
  else if(req.school_problems) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sleep_schedule(req){
  ensureBool(req.consistent_bedtime, 'consistent_bedtime');
  ensureBool(req.consistent_waketime, 'consistent_waketime');
  ensureBool(req.consistency_weekday_weekend, 'consistency_weekday_weekend');
  ensureBool(req.calm_routine, 'calm_routine');
  ensureBool(req.no_screens, 'no_screens');
  ensureBool(req.exposure_to_light_morning, 'exposure_to_light_morning');
  let plan;
  if(req.consistent_bedtime===false) plan='continue_with_consistent_bedtime_then_reassess';
  else if(req.no_screens===false) plan='continue_with_screens_then_reassess';
  else if(req.calm_routine===false) plan='continue_with_routine_then_reassess';
  else if(req.exposure_to_light_morning===false) plan='continue_with_light_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function night_wakings(req){
  ensureNumber(req.wakings_per_night, 'wakings_per_night');
  ensureBool(req.parental_response, 'parental_response');
  ensureBool(req.self_soothing, 'self_soothing');
  ensureBool(req.consistent_response, 'consistent_response');
  ensureBool(req.feeding_associated, 'feeding_associated');
  ensureBool(req.night_terrors, 'night_terrors');
  let plan;
  if(req.night_terrors) plan='continue_with_parasomnia_eval_then_reassess';
  else if(req.self_soothing===false) plan='continue_with_teach_then_reassess';
  else if(req.feeding_associated) plan='continue_with_wean_then_reassess';
  else if(req.consistent_response===false) plan='continue_with_consistency_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function apnea_tonsil(req){
  ensureStr(req.tonil_size, 'tonil_size');
  ensureEnum(req.tonil_size, 'tonil_size', ['grade_0','grade_1','grade_2','grade_3','grade_4']);
  ensureNumber(req.aahi, 'aahi');
  ensureBool(req.behavioral_problems, 'behavioral_problems');
  ensureBool(req.failure_to_thrive, 'failure_to_thrive');
  ensureBool(req.t_and_a_done, 't_and_a_done');
  let plan;
  if(req.tonil_size==='grade_3' || req.tonil_size==='grade_4') plan='continue_with_refer_t_and_a_then_reassess';
  else if(req.aahi>=10) plan='continue_with_sleep_med_consult_then_reassess';
  else if(req.behavioral_problems) plan='continue_with_evaluate_then_reassess';
  else if(req.t_and_a_done===false && req.tonil_size==='grade_2') plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sleep_meds(req){
  ensureStr(req.medication, 'medication');
  ensureEnum(req.medication, 'medication', ['none','melatonin','clonidine','trazodone','diphenhydramine','chloral_hydrate','risperidone','gabapentin']);
  ensureBool(req.efficacy, 'efficacy');
  ensureBool(req.behavioral_therapy, 'behavioral_therapy');
  ensureBool(req.side_effects, 'side_effects');
  ensureNumber(req.duration_days, 'duration_days');
  let plan;
  if(req.medication==='none' && req.behavioral_therapy===false) plan='continue_with_behavioral_then_reassess';
  else if(req.efficacy===false) plan='continue_with_discontinue_then_reassess';
  else if(req.side_effects) plan='continue_with_review_then_reassess';
  else if(req.duration_days>=30) plan='continue_with_attempt_dc_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function school_performance(req){
  ensureNumber(req.school_grade, 'school_grade');
  ensureBool(req.adequate_sleep, 'adequate_sleep');
  ensureBool(req.attention_problems, 'attention_problems');
  ensureBool(req.behavior_problems, 'behavior_problems');
  ensureBool(req.adhd_evaluated, 'adhd_evaluated');
  ensureBool(req.accommodations, 'accommodations');
  let plan;
  if(req.adequate_sleep===false) plan='continue_with_sleep_then_reassess';
  else if(req.attention_problems && req.adhd_evaluated===false) plan='continue_with_adhd_evaluation_then_reassess';
  else if(req.behavior_problems) plan='continue_with_evaluate_then_reassess';
  else if(req.accommodations===false) plan='continue_with_school_liaison_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {peds_assessment,sleep_schedule,night_wakings,apnea_tonsil,sleep_meds,school_performance};}
module.exports={funcs,CITATIONS,ValidationError};
