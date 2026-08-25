// filepath: tier5_cardiology_ext_105_acs_engine.js
// TIER5_CARDIOLOGY_EXT-105: Acute coronary syndrome
'use strict';
const CITATIONS = ['ACC_AHA_ACS_2018','STEMI_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function presentation(req){
  ensureNumber(req.chest_pain_score, 'chest_pain_score');
  ensureNumber(req.troponin, 'troponin');
  ensureBool(req.st_elevation, 'st_elevation');
  ensureBool(req.st_depression, 'st_depression');
  ensureBool(req.t_inversion, 't_inversion');
  ensureBool(req.diaphoresis, 'diaphoresis');
  ensureBool(req.dyspnea, 'dyspnea');
  let plan;
  if(req.st_elevation && req.troponin>0.04) plan='continue_with_stemi_then_reassess';
  else if(req.st_elevation) plan='continue_with_stemi_then_reassess';
  else if(req.troponin>0.04) plan='continue_with_nstemi_then_reassess';
  else if(req.st_depression || req.t_inversion) plan='continue_with_acs_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function first_medical(req){
  ensureBool(req.mona, 'mona');
  ensureBool(req.oxygen, 'oxygen');
  ensureBool(req.nitrates, 'nitrates');
  ensureBool(req.aspirin, 'aspirin');
  ensureBool(req.iv_access, 'iv_access');
  ensureNumber(req.time_to_ecg, 'time_to_ecg');
  let plan;
  if(req.time_to_ecg>10) plan='continue_with_faster_ecg_then_reassess';
  else if(req.aspirin===false) plan='continue_with_aspirin_then_reassess';
  else if(req.iv_access===false) plan='continue_with_iv_access_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function activation(req){
  ensureBool(req.cath_team_activated, 'cath_team_activated');
  ensureBool(req.angiography_planned, 'angiography_planned');
  ensureNumber(req.door_to_balloon, 'door_to_balloon');
  ensureBool(req.fibrinolysis, 'fibrinolysis');
  ensureBool(req.icu_team_informed, 'icu_team_informed');
  let plan;
  if(req.cath_team_activated===false) plan='continue_with_activate_then_reassess';
  else if(req.door_to_balloon>90) plan='continue_with_faster_reperfusion_then_reassess';
  else if(req.angiography_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pci(req){
  ensureBool(req.dapt_initiated, 'dapt_initiated');
  ensureBool(req.statin_initiated, 'statin_initiated');
  ensureBool(req.beta_blocker, 'beta_blocker');
  ensureBool(req.acei_initiated, 'acei_initiated');
  ensureBool(req.revascularization_complete, 'revascularization_complete');
  let plan;
  if(req.dapt_initiated===false) plan='continue_with_dapt_then_reassess';
  else if(req.statin_initiated===false) plan='continue_with_statin_then_reassess';
  else if(req.beta_blocker===false) plan='continue_with_beta_blocker_then_reassess';
  else if(req.acei_initiated===false) plan='continue_with_acei_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.cardiogenic_shock, 'cardiogenic_shock');
  ensureBool(req.heart_block, 'heart_block');
  ensureBool(req.vfib, 'vfib');
  ensureBool(req.free_wall_rupture, 'free_wall_rupture');
  ensureBool(req.reinfarction, 'reinfarction');
  let plan;
  if(req.cardiogenic_shock) plan='continue_with_shock_team_then_reassess';
  else if(req.free_wall_rupture) plan='continue_with_emergent_surgery_then_reassess';
  else if(req.vfib) plan='continue_with_acl_then_reassess';
  else if(req.heart_block) plan='continue_with_pace_then_reassess';
  else if(req.reinfarction) plan='continue_with_revascularize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cardiac_rehab(req){
  ensureBool(req.rehab_referred, 'rehab_referred');
  ensureBool(req.rehab_education, 'rehab_education');
  ensureBool(req.lifestyle_counseling, 'lifestyle_counseling');
  ensureBool(req.medication_adherence, 'medication_adherence');
  ensureBool(req.smoking_cessation, 'smoking_cessation');
  let plan;
  if(req.rehab_referred===false) plan='continue_with_refer_then_reassess';
  else if(req.lifestyle_counseling===false) plan='continue_with_counsel_then_reassess';
  else if(req.medication_adherence===false) plan='continue_with_education_then_reassess';
  else if(req.smoking_cessation===false) plan='continue_with_cessation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {presentation,first_medical,activation,pci,complications,cardiac_rehab};}
module.exports={funcs,CITATIONS,ValidationError};
