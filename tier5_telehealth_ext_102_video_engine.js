// filepath: tier5_telehealth_ext_102_video_engine.js
// TIER5_TELEHEALTH_EXT-102: Video visits
'use strict';
const CITATIONS = ['Video_Visit_2020','Telehealth_Video_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pre_visit(req){
  ensureBool(req.appointment_confirmed, 'appointment_confirmed');
  ensureBool(req.technology_tested, 'technology_tested');
  ensureBool(req.intake_completed, 'intake_completed');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.referral_uploaded, 'referral_uploaded');
  let plan;
  if(req.technology_tested===false) plan='continue_with_test_then_reassess';
  else if(req.intake_completed===false) plan='continue_with_complete_then_reassess';
  else if(req.consent_signed===false) plan='continue_with_consent_then_reassess';
  else if(req.referral_uploaded===false) plan='continue_with_upload_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function connection(req){
  ensureBool(req.video_works, 'video_works');
  ensureBool(req.audio_works, 'audio_works');
  ensureBool(req.shared_screen, 'shared_screen');
  ensureBool(req.chat_works, 'chat_works');
  ensureBool(req.bandwidth_adequate, 'bandwidth_adequate');
  let plan;
  if(req.video_works===false && req.audio_works===false) plan='continue_with_phone_then_reassess';
  else if(req.audio_works===false) plan='continue_with_phone_then_reassess';
  else if(req.bandwidth_adequate===false) plan='continue_with_connect_then_reassess';
  else if(req.shared_screen===false) plan='continue_with_share_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exam(req){
  ensureBool(req.visual_assessment, 'visual_assessment');
  ensureBool(req.guidance_provided, 'guidance_provided');
  ensureBool(req.patient_self_palpation, 'patient_self_palpation');
  ensureBool(req.vital_signs_provided, 'vital_signs_provided');
  ensureBool(req.home_device_data, 'home_device_data');
  let plan;
  if(req.visual_assessment===false) plan='continue_with_camera_check_then_reassess';
  else if(req.guidance_provided===false) plan='continue_with_guide_then_reassess';
  else if(req.vital_signs_provided===false) plan='continue_with_provide_then_reassess';
  else if(req.home_device_data===false) plan='continue_with_collect_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prescribing(req){
  ensureBool(req.licensure_verified, 'licensure_verified');
  ensureBool(req.prescription_appropriate, 'prescription_appropriate');
  ensureBool(req.drug_interaction_checked, 'drug_interaction_checked');
  ensureBool(req.state_license, 'state_license');
  ensureBool(req.controlled_substance, 'controlled_substance');
  let plan;
  if(req.licensure_verified===false) plan='continue_with_verify_then_reassess';
  else if(req.state_license===false) plan='continue_with_license_then_reassess';
  else if(req.drug_interaction_checked===false) plan='continue_with_check_then_reassess';
  else if(req.controlled_substance) plan='continue_with_inperson_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reminders(req){
  ensureBool(req.reminder_24h, 'reminder_24h');
  ensureBool(req.reminder_1h, 'reminder_1h');
  ensureBool(req.links_sent, 'links_sent');
  ensureBool(req.instructions_sent, 'instructions_sent');
  ensureBool(req.tech_support_available, 'tech_support_available');
  let plan;
  if(req.reminder_24h===false) plan='continue_with_send_then_reassess';
  else if(req.links_sent===false) plan='continue_with_send_then_reassess';
  else if(req.instructions_sent===false) plan='continue_with_send_then_reassess';
  else if(req.tech_support_available===false) plan='continue_with_provide_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function after(req){
  ensureBool(req.visit_summary_sent, 'visit_summary_sent');
  ensureBool(req.prescription_sent, 'prescription_sent');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  ensureBool(req.satisfaction_survey, 'satisfaction_survey');
  ensureBool(req.billing_completed, 'billing_completed');
  let plan;
  if(req.visit_summary_sent===false) plan='continue_with_send_then_reassess';
  else if(req.prescription_sent===false) plan='continue_with_send_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.billing_completed===false) plan='continue_with_complete_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pre_visit,connection,exam,prescribing,reminders,after};}
module.exports={funcs,CITATIONS,ValidationError};
