// filepath: tier5_addiction_med_ext_103_mat_engine.js
// TIER5_ADDICTION_MED_EXT-103: Medication-Assisted Treatment
'use strict';
const CITATIONS = ['TIP_63_2020','ASAM_MAT_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function buprenorphine(req){
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureNumber(req.days_in_treatment, 'days_in_treatment');
  ensureBool(req.urine_drug_screen_negative, 'urine_drug_screen_negative');
  ensureBool(req.cravings_reduced, 'cravings_reduced');
  ensureBool(req.use_reduced, 'use_reduced');
  ensureBool(req.stable_plasma_levels, 'stable_plasma_levels');
  let plan;
  if(req.days_in_treatment<7) plan='continue_with_stabilize_then_reassess';
  else if(req.use_reduced===false) plan='continue_with_review_then_reassess';
  else if(req.cravings_reduced===false) plan='continue_with_increase_then_reassess';
  else if(req.urine_drug_screen_negative) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function methadone(req){
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureNumber(req.days_in_treatment, 'days_in_treatment');
  ensureBool(req.take_home_doses, 'take_home_doses');
  ensureBool(req.urine_drug_screen_clean, 'urine_drug_screen_clean');
  ensureBool(req.stable_function, 'stable_function');
  ensureBool(req.counseling_attended, 'counseling_attended');
  let plan;
  if(req.days_in_treatment<30) plan='continue_with_optimize_then_reassess';
  else if(req.counseling_attended===false) plan='continue_with_counseling_then_reassess';
  else if(req.urine_drug_screen_clean===false) plan='continue_with_review_then_reassess';
  else if(req.stable_function) plan='continue_with_th_dose_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function naltrexone(req){
  ensureStr(req.form, 'form');
  ensureEnum(req.form, 'form', ['oral','injection']);
  ensureNumber(req.days_since_last_opioid, 'days_since_last_opioid');
  ensureBool(req.urine_drug_screen_negative, 'urine_drug_screen_negative');
  ensureBool(req.lft_normal, 'lft_normal');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.cravings_reduced, 'cravings_reduced');
  let plan;
  if(req.days_since_last_opioid<7) plan='continue_with_wait_then_reassess';
  else if(req.urine_drug_screen_negative===false) plan='continue_with_pause_then_reassess';
  else if(req.lft_normal===false) plan='continue_with_dc_then_reassess';
  else if(req.cravings_reduced) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function acamprosate(req){
  ensureNumber(req.days_since_last_drink, 'days_since_last_drink');
  ensureNumber(req.kidney_function, 'kidney_function');
  ensureBool(req.creatinine_normal, 'creatinine_normal');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.cravings_reduced, 'cravings_reduced');
  ensureBool(req.drinking_reduced, 'drinking_reduced');
  let plan;
  if(req.creatinine_normal===false) plan='continue_with_renal_review_then_reassess';
  else if(req.adherent===false) plan='continue_with_adherence_then_reassess';
  else if(req.drinking_reduced===false) plan='continue_with_review_then_reassess';
  else if(req.days_since_last_drink>=90) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function disulfiram(req){
  ensureNumber(req.days_since_last_drink, 'days_since_last_drink');
  ensureBool(req.lft_normal, 'lft_normal');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.reaction_history, 'reaction_history');
  ensureBool(req.consented_warned, 'consented_warned');
  ensureBool(req.monitored, 'monitored');
  let plan;
  if(req.days_since_last_drink<24) plan='continue_with_wait_then_reassess';
  else if(req.lft_normal===false) plan='continue_with_dc_then_reassess';
  else if(req.consented_warned===false) plan='continue_with_consent_then_reassess';
  else if(req.adherent===false) plan='continue_with_supervised_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function varenicline(req){
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureNumber(req.days_in_treatment, 'days_in_treatment');
  ensureBool(req.nausea, 'nausea');
  ensureBool(req.abnormal_dreams, 'abnormal_dreams');
  ensureBool(req.mood_changes, 'mood_changes');
  ensureBool(req.smoking_reduced, 'smoking_reduced');
  let plan;
  if(req.mood_changes) plan='continue_with_review_then_reassess';
  else if(req.nausea) plan='continue_with_low_dose_then_reassess';
  else if(req.smoking_reduced) plan='continue_with_observation_then_reassess';
  else if(req.days_in_treatment<14) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {buprenorphine,methadone,naltrexone,acamprosate,disulfiram,varenicline};}
module.exports={funcs,CITATIONS,ValidationError};
