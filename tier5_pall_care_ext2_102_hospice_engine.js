// filepath: tier5_pall_care_ext2_102_hospice_engine.js
// TIER5_PALL_CARE_EXT2-102: Hospice eligibility/enrollment
'use strict';
const CITATIONS = ['CMS_Hospice_2020','NHPCO_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function eligibility(req){
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['cancer','heart_failure','copd','dementia','stroke','als','liver_failure','renal_failure','hiv','frailty','other']);
  ensureNumber(req.prognosis_months, 'prognosis_months');
  ensureBool(req.functional_decline, 'functional_decline');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.hospitalizations, 'hospitalizations');
  ensureBool(req.consent_to_enroll, 'consent_to_enroll');
  let plan;
  if(req.prognosis_months>6) plan='continue_with_reassess_then_reassess';
  else if(req.consent_to_enroll===false) plan='continue_with_discuss_then_reassess';
  else if(req.prognosis_months<3) plan='continue_with_eligible_then_reassess';
  else if(req.functional_decline) plan='continue_with_eligible_then_reassess';
  else plan='continue_with_review_then_reassess';
  return {plan};
}
function enrollment(req){
  ensureBool(req.certification_done, 'certification_done');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.family_meeting, 'family_meeting');
  ensureBool(req.attending_physician_orders, 'attending_physician_orders');
  ensureBool(req.hospice_provider_chosen, 'hospice_provider_chosen');
  ensureBool(req.insurance_verified, 'insurance_verified');
  let plan;
  if(req.certification_done===false) plan='continue_with_certify_then_reassess';
  else if(req.consent_signed===false) plan='continue_with_consent_then_reassess';
  else if(req.insurance_verified===false) plan='continue_with_verify_then_reassess';
  else if(req.hospice_provider_chosen===false) plan='continue_with_select_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function levels_care(req){
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['routine_home','continuous_home','general_inpatient','respite','inpatient_respite']);
  ensureBool(req.caregiver_available, 'caregiver_available');
  ensureBool(req.symptoms_controlled, 'symptoms_controlled');
  ensureBool(req.crisis_event, 'crisis_event');
  ensureBool(req.caregiver_burden, 'caregiver_burden');
  let plan;
  if(req.level==='continuous_home' && req.crisis_event===false) plan='continue_with_routine_then_reassess';
  else if(req.level==='general_inpatient' && req.symptoms_controlled===false) plan='continue_with_gip_then_reassess';
  else if(req.caregiver_burden) plan='continue_with_respite_then_reassess';
  else if(req.caregiver_available===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function recertification(req){
  ensureNumber(req.days_since_enrollment, 'days_since_enrollment');
  ensureBool(req.decline_documented, 'decline_documented');
  ensureBool(req.face_to_face_done, 'face_to_face_done');
  ensureBool(req.symptom_burden, 'symptom_burden');
  ensureBool(req.care_needs, 'care_needs');
  let plan;
  if(req.days_since_enrollment<90) plan='continue_with_initial_then_reassess';
  else if(req.face_to_face_done===false) plan='continue_with_visit_then_reassess';
  else if(req.decline_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.care_needs===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function discharge(req){
  ensureStr(req.reason, 'reason');
  ensureEnum(req.reason, 'reason', ['patient_choice','condition_improved','moved','insurance_change','revoked','decertified','transfer','died','other']);
  ensureBool(req.discharge_planning, 'discharge_planning');
  ensureBool(req.transition_countinuity, 'transition_countinuity');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.hospice_resumed, 'hospice_resumed');
  let plan;
  if(req.reason==='revoked' && req.hospice_resumed===false) plan='continue_with_resume_eligibility_then_reassess';
  else if(req.discharge_planning===false) plan='continue_with_plan_then_reassess';
  else if(req.family_informed===false) plan='continue_with_inform_then_reassess';
  else if(req.transition_countinuity===false) plan='continue_with_countinuity_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bereavement(req){
  ensureNumber(req.days_since_death, 'days_since_death');
  ensureBool(req.family_assessed, 'family_assessed');
  ensureBool(req.bereavement_services_offered, 'bereavement_services_offered');
  ensureBool(req.individual_support, 'individual_support');
  ensureBool(req.group_support, 'group_support');
  ensureBool(req.specific_loss_addressed, 'specific_loss_addressed');
  let plan;
  if(req.family_assessed===false) plan='continue_with_assess_then_reassess';
  else if(req.bereavement_services_offered===false) plan='continue_with_offer_then_reassess';
  else if(req.specific_loss_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.individual_support===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {eligibility,enrollment,levels_care,recertification,discharge,bereavement};}
module.exports={funcs,CITATIONS,ValidationError};
