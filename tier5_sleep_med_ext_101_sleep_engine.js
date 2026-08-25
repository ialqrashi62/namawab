// filepath: tier5_sleep_med_ext_101_sleep_engine.js
// TIER5_SLEEP_MED_EXT-101: Sleep disorders evaluation
'use strict';
const CITATIONS = ['AASM_ICSD3_2014','AASM_Scoring_2020','ESRS_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function initial_assessment(req){
  ensureNumber(req.epworth_score, 'epworth_score');
  ensureNumber(req.isi_score, 'isi_score');
  ensureBool(req.snoring, 'snoring');
  ensureBool(req.witnessed_apnea, 'witnessed_apnea');
  ensureBool(req.excessive_daytime_sleepiness, 'excessive_daytime_sleepiness');
  ensureBool(req.morning_headache, 'morning_headache');
  ensureNumber(req.bmi, 'bmi');
  let plan;
  if(req.epworth_score>=16) plan='continue_with_titration_then_reassess';
  else if(req.isi_score>=22) plan='continue_with_severe_insomnia_then_reassess';
  else if(req.witnessed_apnea || req.bmi>=35) plan='continue_with_sleep_study_then_reassess';
  else if(req.epworth_score>=10) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sleep_study(req){
  ensureStr(req.study_type, 'study_type');
  ensureEnum(req.study_type, 'study_type', ['home_sleep_apnea_test','attended_polysomnography','split_night','mslt','mwt']);
  ensureNumber(req.aahi, 'aahi');
  ensureNumber(req.odi, 'odi');
  ensureNumber(req.min_sao2, 'min_sao2');
  ensureBool(req.supine_predominant, 'supine_predominant');
  ensureBool(req.rem_predominant, 'rem_predominant');
  let plan;
  if(req.aahi>=30) plan='continue_with_severe_osah_then_reassess';
  else if(req.aahi>=15) plan='continue_with_moderate_osah_then_reassess';
  else if(req.aahi>=5) plan='continue_with_mild_osah_then_reassess';
  else if(req.min_sao2<80) plan='continue_with_oxygen_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cpap(req){
  ensureNumber(req.cpap_pressure_cm_h2o, 'cpap_pressure_cm_h2o');
  ensureNumber(req.ahi_on_cpap, 'ahi_on_cpap');
  ensureNumber(req.hours_per_night_use, 'hours_per_night_use');
  ensureBool(req.mask_fit_good, 'mask_fit_good');
  ensureBool(req.leak_acceptable, 'leak_acceptable');
  ensureBool(req.adherent, 'adherent');
  let plan;
  if(req.ahi_on_cpap>=10) plan='continue_with_optimize_then_reassess';
  else if(req.hours_per_night_use<4) plan='continue_with_adherence_then_reassess';
  else if(req.mask_fit_good===false) plan='continue_with_mask_refit_then_reassess';
  else if(req.adherent===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function insomnia(req){
  ensureNumber(req.sleep_onset_latency_min, 'sleep_onset_latency_min');
  ensureNumber(req.wake_after_sleep_min, 'wake_after_sleep_min');
  ensureNumber(req.total_sleep_time_hr, 'total_sleep_time_hr');
  ensureBool(req.cbt_i_initiated, 'cbt_i_initiated');
  ensureBool(req.sleep_hygiene_practiced, 'sleep_hygiene_practiced');
  ensureBool(req.medication_overuse, 'medication_overuse');
  let plan;
  if(req.cbt_i_initiated===false) plan='continue_with_cbt_i_then_reassess';
  else if(req.medication_overuse) plan='continue_with_taper_then_reassess';
  else if(req.sleep_onset_latency_min>=30) plan='continue_with_therapy_then_reassess';
  else if(req.total_sleep_time_hr<6) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function circadian(req){
  ensureStr(req.disorder_type, 'disorder_type');
  ensureEnum(req.disorder_type, 'disorder_type', ['dsps','asps','non_24','jet_lag','shift_work','irregular_sleep_wake']);
  ensureNumber(req.sleep_onset_hour, 'sleep_onset_hour');
  ensureNumber(req.wake_hour, 'wake_hour');
  ensureBool(req.light_therapy_done, 'light_therapy_done');
  ensureBool(req.melatonin_used, 'melatonin_used');
  let plan;
  if(req.disorder_type==='dsps') plan='continue_with_chronotherapy_then_reassess';
  else if(req.disorder_type==='shift_work') plan='continue_with_modafinil_then_reassess';
  else if(req.light_therapy_done===false) plan='continue_with_light_then_reassess';
  else if(req.melatonin_used===false) plan='continue_with_melatonin_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function parasomnia(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['rem_sleep_behavior','nrem_sleepwalking','night_terrors','sleep_talking','sleep_paralysis','sleep_terrors','confusional_arousal','recurrent_isolated_sleep_paralysis']);
  ensureBool(req.self_injury, 'self_injury');
  ensureBool(req.bed_partner_injury, 'bed_partner_injury');
  ensureBool(req.sleep_study_done, 'sleep_study_done');
  ensureBool(req.clonazepam_trial, 'clonazepam_trial');
  let plan;
  if(req.self_injury) plan='continue_with_safety_evaluation_then_reassess';
  else if(req.type==='rem_sleep_behavior') plan='continue_with_clonazepam_then_reassess';
  else if(req.sleep_study_done===false) plan='continue_with_psg_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {initial_assessment,sleep_study,cpap,insomnia,circadian,parasomnia};}
module.exports={funcs,CITATIONS,ValidationError};
