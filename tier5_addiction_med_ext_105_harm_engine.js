// filepath: tier5_addiction_med_ext_105_harm_engine.js
// TIER5_ADDICTION_MED_EXT-105: Harm reduction
'use strict';
const CITATIONS = ['HR_Principles_2020','SAMHSA_HR_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function naloxone(req){
  ensureBool(req.overdose_history, 'overdose_history');
  ensureBool(req.prescription_provided, 'prescription_provided');
  ensureBool(req.training_completed, 'training_completed');
  ensureBool(req.refills_available, 'refills_available');
  ensureBool(req.friend_aware, 'friend_aware');
  ensureBool(req.carrying, 'carrying');
  let plan;
  if(req.overdose_history && req.prescription_provided===false) plan='continue_with_prescribe_then_reassess';
  else if(req.training_completed===false) plan='continue_with_train_then_reassess';
  else if(req.refills_available===false) plan='continue_with_refills_then_reassess';
  else if(req.carrying===false) plan='continue_with_carry_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function syrp(req){
  ensureBool(req.program_aware, 'program_aware');
  ensureBool(req.needles_obtained, 'needles_obtained');
  ensureBool(req.needles_disposed, 'needles_disposed');
  ensureBool(req.wound_care_education, 'wound_care_education');
  ensureBool(req.testing_resources, 'testing_resources');
  let plan;
  if(req.program_aware===false) plan='continue_with_introduce_then_reassess';
  else if(req.needles_obtained===false) plan='continue_with_provide_then_reassess';
  else if(req.needles_disposed===false) plan='continue_with_disposal_then_reassess';
  else if(req.wound_care_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function safe_inject(req){
  ensureBool(req.injecting_safely_aware, 'injecting_safely_aware');
  ensureBool(req.rotation_sites, 'rotation_sites');
  ensureBool(req.not_alone, 'not_alone');
  ensureBool(req.test_dose, 'test_dose');
  ensureBool(req.caregiver_aware_naloxone, 'caregiver_aware_naloxone');
  let plan;
  if(req.not_alone===false) plan='continue_with_review_then_reassess';
  else if(req.test_dose===false) plan='continue_with_test_then_reassess';
  else if(req.rotation_sites===false) plan='continue_with_rotate_then_reassess';
  else if(req.caregiver_aware_naloxone===false) plan='continue_with_caregiver_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sex_hr(req){
  ensureBool(req.condom_use, 'condom_use');
  ensureBool(req.prep_access, 'prep_access');
  ensureBool(req.hiv_testing, 'hiv_testing');
  ensureBool(req.std_screening, 'std_screening');
  ensureBool(req.consent_discussed, 'consent_discussed');
  let plan;
  if(req.condom_use===false) plan='continue_with_condoms_then_reassess';
  else if(req.prep_access===false) plan='continue_with_prep_then_reassess';
  else if(req.hiv_testing===false) plan='continue_with_hiv_test_then_reassess';
  else if(req.std_screening===false) plan='continue_with_std_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function housing(req){
  ensureBool(req.stable_housing, 'stable_housing');
  ensureBool(req.shelter_options, 'shelter_options');
  ensureBool(req.case_management, 'case_management');
  ensureBool(req.housing_first, 'housing_first');
  ensureBool(req.support_intensity, 'support_intensity');
  let plan;
  if(req.stable_housing===false) plan='continue_with_housing_first_then_reassess';
  else if(req.shelter_options===false) plan='continue_with_options_then_reassess';
  else if(req.case_management===false) plan='continue_with_cm_then_reassess';
  else if(req.housing_first===false) plan='continue_with_introduce_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fts(req){
  ensureNumber(req.drug_test_kits, 'drug_test_kits');
  ensureBool(req.test_strips_used, 'test_strips_used');
  ensureBool(req.fentanyl_aware, 'fentanyl_aware');
  ensureBool(req.xylazine_aware, 'xylazine_aware');
  ensureBool(req.response_planned, 'response_planned');
  let plan;
  if(req.drug_test_kits<=0) plan='continue_with_supply_then_reassess';
  else if(req.test_strips_used===false) plan='continue_with_use_then_reassess';
  else if(req.fentanyl_aware===false) plan='continue_with_education_then_reassess';
  else if(req.response_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {naloxone,syrp,safe_inject,sex_hr,housing,fts};}
module.exports={funcs,CITATIONS,ValidationError};
