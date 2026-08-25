// filepath: tier5_cardiology_ext_102_stress_engine.js
// TIER5_CARDIOLOGY_EXT-102: Stress testing
'use strict';
const CITATIONS = ['ACC_Stress_2021','ASNC_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['chest_pain','dyspnea','preop_cardiac_risk','post_mi_risk','post_revascularization','asx_screen','arrhythmia','syncope','valvular','cardiomyopathy','other','none']);
  ensureBool(req.likely_to_change, 'likely_to_change');
  ensureBool(req.baseline_ecg_normal, 'baseline_ecg_normal');
  ensureBool(req.can_exercise, 'can_exercise');
  let plan;
  if(req.can_exercise===false) plan='continue_with_pharm_then_reassess';
  else if(req.baseline_ecg_normal===false) plan='continue_with_imaging_then_reassess';
  else if(req.likely_to_change===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function contraindications(req){
  ensureBool(req.acute_mi, 'acute_mi');
  ensureBool(req.unstable_angina, 'unstable_angina');
  ensureBool(req.severe_aortic_stenosis, 'severe_aortic_stenosis');
  ensureBool(req.uncontrolled_htn, 'uncontrolled_htn');
  ensureBool(req.decompensated_hf, 'decompensated_hf');
  ensureBool(req.recent_pe, 'recent_pe');
  let plan;
  if(req.acute_mi) plan='continue_with_abort_then_reassess';
  else if(req.unstable_angina) plan='continue_with_abort_then_reassess';
  else if(req.decompensated_hf) plan='continue_with_abort_then_reassess';
  else if(req.recent_pe) plan='continue_with_abort_then_reassess';
  else if(req.uncontrolled_htn) plan='continue_with_treat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function protocol(req){
  ensureStr(req.protocol, 'protocol');
  ensureEnum(req.protocol, 'protocol', ['bruce','modified_bruce','naughton','balke','ramp','dobutamine','adenosine','dipyridamole','regadenoson','none']);
  ensureBool(req.max_hr_achieved, 'max_hr_achieved');
  ensureNumber(req.target_hr, 'target_hr');
  ensureNumber(req.achieved_hr, 'achieved_hr');
  ensureBool(req.test_adequate, 'test_adequate');
  let plan;
  if(req.test_adequate===false) plan='continue_with_inadequate_then_reassess';
  else if(req.achieved_hr<req.target_hr*0.85) plan='continue_with_submaximal_then_reassess';
  else if(req.max_hr_achieved===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function results(req){
  ensureBool(req.st_changes, 'st_changes');
  ensureNumber(req.st_depression_max, 'st_depression_max');
  ensureBool(req.chest_pain, 'chest_pain');
  ensureBool(req.ekg_changes, 'ekg_changes');
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.arrhythmia, 'arrhythmia');
  let plan;
  if(req.st_changes && req.chest_pain) plan='continue_with_positive_then_reassess';
  else if(req.st_depression_max>=2) plan='continue_with_positive_then_reassess';
  else if(req.hypotension) plan='continue_with_terminate_then_reassess';
  else if(req.arrhythmia) plan='continue_with_terminate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function recovery(req){
  ensureNumber(req.recovery_minutes, 'recovery_minutes');
  ensureBool(req.symptoms_resolved, 'symptoms_resolved');
  ensureBool(req.ekg_normalized, 'ekg_normalized');
  ensureBool(req.hr_normalized, 'hr_normalized');
  ensureBool(req.bp_stable, 'bp_stable');
  let plan;
  if(req.symptoms_resolved===false) plan='continue_with_extend_then_reassess';
  else if(req.ekg_normalized===false) plan='continue_with_extend_then_reassess';
  else if(req.hr_normalized===false) plan='continue_with_extend_then_reassess';
  else if(req.bp_stable===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.shock, 'shock');
  ensureBool(req.lvf, 'lvf');
  ensureBool(req.heart_block, 'heart_block');
  ensureBool(req.afib_onset, 'afib_onset');
  ensureBool(req.cardiac_arrest, 'cardiac_arrest');
  let plan;
  if(req.cardiac_arrest) plan='continue_with_bls_then_reassess';
  else if(req.shock) plan='continue_with_treat_then_reassess';
  else if(req.lvf) plan='continue_with_treat_then_reassess';
  else if(req.heart_block) plan='continue_with_pace_then_reassess';
  else if(req.afib_onset) plan='continue_with_rate_control_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,contraindications,protocol,results,recovery,complications};}
module.exports={funcs,CITATIONS,ValidationError};
