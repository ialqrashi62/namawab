// filepath: tier5_pall_care_ext2_104_eol_engine.js
// TIER5_PALL_CARE_EXT2-104: End of life
'use strict';
const CITATIONS = ['EOL_2020','Last_Days_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function dying_recognition(req){
  ensureNumber(req.days_since_decline, 'days_since_decline');
  ensureBool(req.bed_bound, 'bed_bound');
  ensureBool(req.po_intake, 'po_intake');
  ensureBool(req.coma, 'coma');
  ensureBool(req.agonal_breathing, 'agonal_breathing');
  ensureBool(req.decreased_responsiveness, 'decreased_responsiveness');
  ensureBool(req.pulse_weak, 'pulse_weak');
  let plan;
  if(req.days_since_decline<3) plan='continue_with_observation_then_reassess';
  else if(req.agonal_breathing) plan='continue_with_comfort_then_reassess';
  else if(req.po_intake===false) plan='continue_with_subq_then_reassess';
  else if(req.bed_bound) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function eol_care(req){
  ensureBool(req.comfort_only, 'comfort_only');
  ensureBool(req.medications_subq, 'medications_subq');
  ensureBool(req.skin_mouth_care, 'skin_mouth_care');
  ensureBool(req.family_present, 'family_present');
  ensureBool(req.legacy_work, 'legacy_work');
  ensureBool(req.spiritual_care, 'spiritual_care');
  let plan;
  if(req.comfort_only===false) plan='continue_with_review_then_reassess';
  else if(req.medications_subq===false) plan='continue_with_subq_then_reassess';
  else if(req.skin_mouth_care===false) plan='continue_with_care_then_reassess';
  else if(req.family_present===false) plan='continue_with_invite_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function signs(req){
  ensureBool(req.breathing_changes, 'breathing_changes');
  ensureBool(req.mottling, 'mottling');
  ensureBool(req.terminal_edema, 'terminal_edema');
  ensureBool(req.decreased_urine, 'decreased_urine');
  ensureBool(req.restlessness, 'restlessness');
  ensureBool(req.vision_like, 'vision_like');
  let plan;
  if(req.breathing_changes && req.mottling) plan='continue_with_family_briefing_then_reassess';
  else if(req.terminal_edema) plan='continue_with_comfort_then_reassess';
  else if(req.restlessness) plan='continue_with_medication_then_reassess';
  else if(req.vision_like) plan='continue_with_reassure_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function family_call(req){
  ensureBool(req.signs_explained, 'signs_explained');
  ensureBool(req.family_present, 'family_present');
  ensureBool(req.out_of_town_notified, 'out_of_town_notified');
  ensureBool(req.out_of_country_notified, 'out_of_country_notified');
  ensureBool(req.clergy_available, 'clergy_available');
  ensureBool(req.child_briefed, 'child_briefed');
  let plan;
  if(req.family_present===false) plan='continue_with_notify_then_reassess';
  else if(req.out_of_town_notified===false) plan='continue_with_contact_then_reassess';
  else if(req.signs_explained===false) plan='continue_with_explain_then_reassess';
  else if(req.clergy_available===false) plan='continue_with_contact_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vigil(req){
  ensureBool(req.sitting_with_patient, 'sitting_with_patient');
  ensureBool(req.comfort_measures, 'comfort_measures');
  ensureBool(req.dying_with_dignity, 'dying_with_dignity');
  ensureBool(req.staff_support, 'staff_support');
  ensureBool(req.family_supported, 'family_supported');
  let plan;
  if(req.dying_with_dignity===false) plan='continue_with_review_then_reassess';
  else if(req.comfort_measures===false) plan='continue_with_assess_then_reassess';
  else if(req.family_supported===false) plan='continue_with_support_then_reassess';
  else if(req.staff_support===false) plan='continue_with_charge_nurse_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pronouncement(req){
  ensureNumber(req.minutes_no_pulse, 'minutes_no_pulse');
  ensureNumber(req.minutes_no_breath, 'minutes_no_breath');
  ensureNumber(req.minutes_no_heartbeat, 'minutes_no_heartbeat');
  ensureBool(req.physician_called, 'physician_called');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.minutes_no_pulse<5) plan='continue_with_wait_then_reassess';
  else if(req.physician_called===false) plan='continue_with_call_then_reassess';
  else if(req.family_informed===false) plan='continue_with_inform_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {dying_recognition,eol_care,signs,family_call,vigil,pronouncement};}
module.exports={funcs,CITATIONS,ValidationError};
