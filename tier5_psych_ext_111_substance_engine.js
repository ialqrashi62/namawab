// filepath: tier5_psych_ext_111_substance_engine.js
// TIER5_PSYCH_EXT-111: Substance Use Disorders
'use strict';
const CITATIONS = ['DSM5_SUBSTANCE_2022','ASAM_CRITERIA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function screen(req){
  ensureNumber(req.audit_c_score, 'audit_c_score');
  ensureNumber(req.dast_score, 'dast_score');
  ensureNumber(req.heavy_drinking_days, 'heavy_drinking_days');
  ensureStr(req.substance_primary, 'substance_primary');
  ensureEnum(req.substance_primary, 'substance_primary', ['alcohol','opioid','benzo','stimulant','cannabis','hallucinogen','inhalant','tobacco','multi','none','other']);
  ensureBool(req.use_disorder_symptoms, 'use_disorder_symptoms');
  let plan;
  if(req.audit_c_score>=20) plan='continue_with_treatment_then_reassess';
  else if(req.dast_score>=3 && req.use_disorder_symptoms===true) plan='continue_with_assessment_then_reassess';
  else plan='continue_with_brief_intervention_then_reassess';
  return {plan};
}
function detox(req){
  ensureEnum(req.substance, 'substance', ['alcohol','opioid','benzo','stimulant','multi','other']);
  ensureBool(req.withdrawal_severity, 'withdrawal_severity');
  ensureEnum(req.level_of_care, 'level_of_care', ['outpatient','ambulatory','ip_residential','hospital','other']);
  ensureBool(req.meds_indicated, 'meds_indicated');
  ensureBool(req.monitoring_capable, 'monitoring_capable');
  ensureBool(req.cointox_risk, 'cointox_risk');
  let plan;
  if(req.level_of_care==='hospital' && req.withdrawal_severity===true) plan='continue_with_hospital_admit_then_reassess';
  else if(req.meds_indicated===true) plan='continue_with_med_then_reassess';
  else plan='continue_with_supervision_then_reassess';
  return {plan};
}
function relapse_prev(req){
  ensureBool(req.relapse_warning_signs, 'relapse_warning_signs');
  ensureBool(req.craving_present, 'craving_present');
  ensureBool(req.triggers_identified, 'triggers_identified');
  ensureBool(req.coping_skills, 'coping_skills');
  ensureBool(req.support_system, 'support_system');
  ensureNumber(req.days_sober, 'days_sober');
  let plan;
  if(req.craving_present===true && req.coping_skills===false) plan='continue_with_intensify_skill_training_then_reassess';
  else if(req.days_sober<7) plan='continue_with_close_fu_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function mat(req){
  ensureEnum(req.substance, 'substance', ['opioid','alcohol','other']);
  ensureEnum(req.medication, 'medication', ['methadone','buprenorphine','naltrexone','acamprosate','disulfiram','nalmefene','extended_naltrexone','other','none']);
  ensureBool(req.dose_optimized, 'dose_optimized');
  ensureBool(req.adherence_ok, 'adherence_ok');
  ensureBool(req.labs_current, 'labs_current');
  ensureBool(req.psychosocial_support, 'psychosocial_support');
  let plan;
  if(req.substance==='opioid' && req.dose_optimized===false) plan='continue_with_optimize_then_reassess';
  else if(req.adherence_ok===false) plan='continue_with_address_adherence_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function overdose_prev(req){
  ensureNumber(req.previous_overdoses, 'previous_overdoses');
  ensureBool(req.naloxone_provided, 'naloxone_provided');
  ensureBool(req.witness_alone, 'witness_alone');
  ensureBool(req.fentanyl_exposure, 'fentanyl_exposure');
  ensureEnum(req.threshold_risk, 'threshold_risk', ['low','moderate','high','very_high']);
  ensureBool(req.family_educated, 'family_educated');
  let plan;
  if(req.threshold_risk==='very_high' || req.previous_overdoses>=3) plan='continue_with_intensive_then_reassess';
  else if(req.naloxone_provided===false) plan='continue_with_provide_naloxone_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function substance_fu(req){
  ensureNumber(req.weeks_in_recovery, 'weeks_in_recovery');
  ensureBool(req.substance_use_detected, 'substance_use_detected');
  ensureBool(req.labs_improving, 'labs_improving');
  ensureBool(req.attendance, 'attendance');
  ensureEnum(req.stable_score, 'stable_score', ['unstable','variance','stable','thriving']);
  ensureBool(req.co_occurring_tx, 'co_occurring_tx');
  let plan;
  if(req.substance_use_detected===true) plan='continue_with_restart_then_reassess';
  else if(req.stable_score==='stable' || req.stable_score==='thriving') plan='continue_with_continue_then_reassess';
  else plan='continue_with_intensify_then_reassess';
  return {plan};
}

function funcs(){return {screen,detox,relapse_prev,mat,overdose_prev,substance_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
