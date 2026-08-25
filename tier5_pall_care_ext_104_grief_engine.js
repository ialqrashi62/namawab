// filepath: tier5_pall_care_ext_104_grief_engine.js
// TIER5_PALL_CARE_EXT-104: Bereavement/grief
'use strict';
const CITATIONS = ['AAGL_Bereavement_2020','Hospice_Bereavement_2019','APA_Grief_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function grief_assessment(req){
  ensureNumber(req.days_since_loss, 'days_since_loss');
  ensureBool(req.functioning_impaired, 'functioning_impaired');
  ensureBool(req.depression_symptoms, 'depression_symptoms');
  ensureBool(req.suicidal_ideation, 'suicidal_ideation');
  ensureBool(req.social_isolation, 'social_isolation');
  ensureBool(req.grief_present, 'grief_present');
  let plan;
  if(req.suicidal_ideation) plan='continue_with_urgent_safety_plan_then_reassess';
  else if(req.functioning_impaired && req.days_since_loss>=30) plan='continue_with_refer_mental_health_then_reassess';
  else if(req.grief_present===false) plan='continue_with_normal_grief_then_reassess';
  else plan='continue_with_support_then_reassess';
  return {plan};
}
function grief_intervention(req){
  ensureBool(req.grief_support_offered, 'grief_support_offered');
  ensureBool(req.counseling_offered, 'counseling_offered');
  ensureBool(req.peer_support_offered, 'peer_support_offered');
  ensureBool(req.religious_ritual_offered, 'religious_ritual_offered');
  ensureBool(req.legacy_interview_done, 'legacy_interview_done');
  ensureBool(req.letter_writing_done, 'letter_writing_done');
  let plan;
  if(req.grief_support_offered===false) plan='continue_with_offer_then_reassess';
  else if(req.counseling_offered===false && req.days_since_loss>=30) plan='continue_with_offer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complicated_grief(req){
  ensureNumber(req.months_since_loss, 'months_since_loss');
  ensureBool(req.intrusive_thoughts, 'intrusive_thoughts');
  ensureBool(req.avoidance, 'avoidance');
  ensureBool(req.functioning_still_impaired, 'functioning_still_impaired');
  ensureBool(req.numbness, 'numbness');
  ensureBool(req.yearning_severe, 'yearning_severe');
  let plan;
  if(req.months_since_loss>=6 && req.functioning_still_impaired && req.intrusive_thoughts) plan='continue_with_refer_psychiatrist_then_reassess';
  else if(req.avoidance && req.numbness) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function children_grief(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.understands_loss, 'understands_loss');
  ensureBool(req.developmental_concerns, 'developmental_concerns');
  ensureBool(req.sleep_disturbance, 'sleep_disturbance');
  ensureBool(req.behavior_change, 'behavior_change');
  ensureBool(req.school_concerns, 'school_concerns');
  let plan;
  if(req.developmental_concerns) plan='continue_with_refer_specialist_then_reassess';
  else if(req.sleep_disturbance || req.behavior_change) plan='continue_with_family_support_then_reassess';
  else if(req.school_concerns) plan='continue_with_school_communication_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anticipatory_grief(req){
  ensureNumber(req.prognosis_weeks, 'prognosis_weeks');
  ensureBool(req.family_expressing_loss, 'family_expressing_loss');
  ensureBool(req.preparation_done, 'preparation_done');
  ensureBool(req.legacy_work_active, 'legacy_work_active');
  ensureBool(req.support_in_place, 'support_in_place');
  let plan;
  if(req.preparation_done===false) plan='continue_with_discuss_then_reassess';
  else if(req.legacy_work_active===false) plan='continue_with_legacy_work_then_reassess';
  else if(req.support_in_place===false) plan='continue_with_support_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staff_bereavement(req){
  ensureBool(req.staff_loss_experienced, 'staff_loss_experienced');
  ensureBool(req.staff_debrief_done, 'staff_debrief_done');
  ensureBool(req.team_support_offered, 'team_support_offered');
  ensureBool(req.ritual_done, 'ritual_done');
  ensureBool(req.individual_support_offered, 'individual_support_offered');
  let plan;
  if(req.staff_debrief_done===false) plan='continue_with_debrief_then_reassess';
  else if(req.ritual_done===false) plan='continue_with_ritual_then_reassess';
  else if(req.individual_support_offered===false) plan='continue_with_individual_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {grief_assessment,grief_intervention,complicated_grief,children_grief,anticipatory_grief,staff_bereavement};}
module.exports={funcs,CITATIONS,ValidationError};
