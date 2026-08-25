// filepath: tier5_wh_ext_126_maternal_engine.js
// TIER5_WH_EXT-126: Maternal-Fetal Medicine
'use strict';
const CITATIONS = ['SMFM_PB_2020','ACOG_MFM_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function high_risk_intake(req){
  ensureStr(req.maternal_history, 'maternal_history');
  ensureEnum(req.maternal_history, 'maternal_history', ['gdm','pre_eclampsia','preterm','iugr','recurrent_loss','autoimmune','thrombophilia','obesity','age_35','multifetal','preexisting_dm','hypertension','cardiac','renal','other','unknown']);
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureBool(req.referred, 'referred');
  ensureBool(req.mfm_consult, 'mfm_consult');
  ensureBool(req.care_plan_drafted, 'care_plan_drafted');
  let plan;
  if(req.mfm_consult===false) plan='continue_with_mfm_consult_then_reassess';
  else if(req.care_plan_drafted===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function preeclampsia(req){
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureNumber(req.bp_systolic, 'bp_systolic');
  ensureNumber(req.bp_diastolic, 'bp_diastolic');
  ensureBool(req.proteinuria, 'proteinuria');
  ensureEnum(req.severity, 'severity', ['mild','severe','eclampsia','hellp','unknown']);
  ensureBool(req.magnesium_started, 'magnesium_started');
  let plan;
  if(req.severity==='severe' || req.severity==='eclampsia' || req.severity==='hellp') plan='continue_with_admission_then_reassess';
  else if(req.magnesium_started===false && req.gestational_weeks<34) plan='continue_with_mag_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function gdm_screen(req){
  ensureEnum(req.test, 'test', ['gct','ogtt_1hr','ogtt_2hr','ogtt_3hr','glucose','a1c','other','unknown']);
  ensureNumber(req.value, 'value');
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureBool(req.diet_counseling, 'diet_counseling');
  ensureBool(req.glucose_monitoring, 'glucose_monitoring');
  ensureEnum(req.diagnosis, 'diagnosis', ['gdm','type2_dm','pregestational','normal','inconclusive','other','unknown']);
  let plan;
  if(req.diagnosis==='gdm' && req.diet_counseling===false) plan='continue_with_diet_then_reassess';
  else if(req.glucose_monitoring===false) plan='continue_with_monitoring_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function iugr(req){
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureNumber(req.efw_grams, 'efw_grams');
  ensureNumber(req.percentile, 'percentile');
  ensureEnum(req.doppler_ua, 'doppler_ua', ['normal','absent','reversed','unknown','other']);
  ensureBool(req.surveillance_increased, 'surveillance_increased');
  ensureBool(req.delivery_discussed, 'delivery_discussed');
  let plan;
  if(req.doppler_ua==='reversed' || req.percentile<3) plan='continue_with_admission_then_reassess';
  else if(req.percentile<10 && req.surveillance_increased===false) plan='continue_with_surveillance_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function multifetal(req){
  ensureEnum(req.chorionicity, 'chorionicity', ['mc_dc','mc_mc','dc_dc','dc_mc','unknown','other']);
  ensureNumber(req.fetus_count, 'fetus_count');
  ensureNumber(req.gestational_weeks, 'gestational_weeks');
  ensureBool(req.ttts_screen, 'ttts_screen');
  ensureBool(req.cervical_length_ok, 'cervical_length_ok');
  ensureBool(req.surveillance_intense, 'surveillance_intense');
  let plan;
  if(req.ttts_screen===false && req.chorionicity==='mc_mc') plan='continue_with_ttts_then_reassess';
  else if(req.cervical_length_ok===false) plan='continue_with_cl_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function mfm_fu(req){
  ensureNumber(req.weeks_in_care, 'weeks_in_care');
  ensureBool(req.complications, 'complications');
  ensureBool(req.delivery_planning_done, 'delivery_planning_done');
  ensureBool(req.anth_consents_signed, 'anth_consents_signed');
  ensureBool(req.neonatal_consult_done, 'neonatal_consult_done');
  ensureBool(req.handoff_smooth, 'handoff_smooth');
  let plan;
  if(req.complications===true) plan='continue_with_admission_then_reassess';
  else if(req.delivery_planning_done===false) plan='continue_with_planning_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {high_risk_intake,preeclampsia,gdm_screen,iugr,multifetal,mfm_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
