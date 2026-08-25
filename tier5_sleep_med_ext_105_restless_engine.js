// filepath: tier5_sleep_med_ext_105_restless_engine.js
// TIER5_SLEEP_MED_EXT-105: Restless Legs / movement disorders
'use strict';
const CITATIONS = ['IRLSSG_2014','AASM_Movement_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function rls_severity(req){
  ensureNumber(req.irlssg_score, 'irlssg_score');
  ensureBool(req.urge_to_move, 'urge_to_move');
  ensureBool(req.worse_at_rest, 'worse_at_rest');
  ensureBool(req.relief_with_movement, 'relief_with_movement');
  ensureBool(req.evening_onset, 'evening_onset');
  ensureNumber(req.ferritin_ng_ml, 'ferritin_ng_ml');
  let plan;
  if(req.irlssg_score>=31) plan='continue_with_severe_then_reassess';
  else if(req.irlssg_score>=21) plan='continue_with_moderate_then_reassess';
  else if(req.ferritin_ng_ml<75) plan='continue_with_iron_then_reassess';
  else if(req.irlssg_score>=11) plan='continue_with_mild_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rls_treatment(req){
  ensureNumber(req.ferritin_ng_ml, 'ferritin_ng_ml');
  ensureBool(req.iron_supplementation, 'iron_supplementation');
  ensureBool(req.dopamine_agonist, 'dopamine_agonist');
  ensureBool(req.alpha_2_delta_ligand, 'alpha_2_delta_ligand');
  ensureBool(req.response, 'response');
  ensureBool(req.augmentation, 'augmentation');
  let plan;
  if(req.ferritin_ng_ml<75 && req.iron_supplementation===false) plan='continue_with_iron_then_reassess';
  else if(req.augmentation) plan='continue_with_review_then_reassess';
  else if(req.response===false) plan='continue_with_optimize_then_reassess';
  else if(req.dopamine_agonist===false && req.alpha_2_delta_ligand===false) plan='continue_with_initiate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rbd(req){
  ensureBool(req.violent_dreams, 'violent_dreams');
  ensureBool(req.dream_enactment, 'dream_enactment');
  ensureBool(req.video_psg, 'video_psg');
  ensureBool(req.alpha_synucleinopathy, 'alpha_synucleinopathy');
  ensureBool(req.clonazepam_trial, 'clonazepam_trial');
  ensureBool(req.melatonin_trial, 'melatonin_trial');
  let plan;
  if(req.dream_enactment && req.video_psg===false) plan='continue_with_psg_then_reassess';
  else if(req.alpha_synucleinopathy) plan='continue_with_neuro_review_then_reassess';
  else if(req.clonazepam_trial===false && req.melatonin_trial===false) plan='continue_with_trial_then_reassess';
  else if(req.response===false) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function plm(req){
  ensureNumber(req.plm_index, 'plm_index');
  ensureBool(req.plms_with_arousal, 'plms_with_arousal');
  ensureBool(req.disrupting_sleep, 'disrupting_sleep');
  ensureBool(req.ferritin_checked, 'ferritin_checked');
  ensureBool(req.dopamine_agonist, 'dopamine_agonist');
  ensureBool(req.caffeine_reduction, 'caffeine_reduction');
  let plan;
  if(req.plm_index>=15 && req.disrupting_sleep) plan='continue_with_treatment_then_reassess';
  else if(req.ferritin_checked===false) plan='continue_with_ferritin_then_reassess';
  else if(req.caffeine_reduction===false) plan='continue_with_reduce_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bruxism(req){
  ensureBool(req.grinding_noises, 'grinding_noises');
  ensureBool(req.morning_awareness, 'morning_awareness');
  ensureBool(req.tooth_wear, 'tooth_wear');
  ensureBool(req.mouth_guard, 'mouth_guard');
  ensureBool(req.stress_management, 'stress_management');
  ensureBool(req.tmd_present, 'tmd_present');
  let plan;
  if(req.mouth_guard===false) plan='continue_with_guard_then_reassess';
  else if(req.stress_management===false) plan='continue_with_stress_then_reassess';
  else if(req.tmd_present) plan='continue_with_dental_then_reassess';
  else if(req.tooth_wear) plan='continue_with_dental_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rls_prevention(req){
  ensureBool(req.iron_optimized, 'iron_optimized');
  ensureBool(req.caffeine_reduced, 'caffeine_reduced');
  ensureBool(req.alcohol_reduced, 'alcohol_reduced');
  ensureBool(req.exercise_regular, 'exercise_regular');
  ensureBool(req.medication_reviewed, 'medication_reviewed');
  ensureBool(req.check_antidepressants, 'check_antidepressants');
  let plan;
  if(req.iron_optimized===false) plan='continue_with_iron_then_reassess';
  else if(req.caffeine_reduced===false) plan='continue_with_reduce_then_reassess';
  else if(req.alcohol_reduced===false) plan='continue_with_reduce_then_reassess';
  else if(req.check_antidepressants===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {rls_severity,rls_treatment,rbd,plm,bruxism,rls_prevention};}
module.exports={funcs,CITATIONS,ValidationError};
