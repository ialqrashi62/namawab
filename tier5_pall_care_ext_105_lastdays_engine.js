// filepath: tier5_pall_care_ext_105_lastdays_engine.js
// TIER5_PALL_CARE_EXT-105: Last days of life (terminal care, dying process, dignity)
'use strict';
const CITATIONS = ['NHPCO_Standards_2021','Fast_Dying_2020','Lancet_Last_Days_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function dying_process(req){
  ensureBool(req.cheyne_stokes, 'cheyne_stokes');
  ensureBool(req.delirium_terminal, 'delirium_terminal');
  ensureBool(req.mottling, 'mottling');
  ensureBool(req.respiratory_changes, 'respiratory_changes');
  ensureNumber(req.bp_systolic, 'bp_systolic');
  ensureBool(req.family_present_at_bedside, 'family_present_at_bedside');
  let plan;
  if(req.cheyne_stokes && req.family_present_at_bedside===false) plan='continue_with_family_call_then_reassess';
  else if(req.delirium_terminal) plan='continue_with_haloperidol_then_reassess';
  else if(req.bp_systolic<80) plan='continue_with_review_goals_then_reassess';
  else plan='continue_with_comfort_measures_then_reassess';
  if(req.mottling) plan+='_explain_to_family';
  return {plan};
}
function terminal_symptoms(req){
  ensureBool(req.dyspnea_severe, 'dyspnea_severe');
  ensureBool(req.congestion, 'congestion');
  ensureBool(req.pain_severe, 'pain_severe');
  ensureBool(req.nausea, 'nausea');
  ensureBool(req.agitation_severe, 'agitation_severe');
  let plan;
  if(req.dyspnea_severe) plan='continue_with_morphine_then_reassess';
  else if(req.congestion) plan='continue_with_scopolamine_then_reassess';
  else if(req.pain_severe) plan='continue_with_opioid_then_reassess';
  else if(req.agitation_severe) plan='continue_with_antispychotic_then_reassess';
  else if(req.nausea) plan='continue_with_antiemetic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function withdrawal_care(req){
  ensureBool(req.ventilator_withdrawal, 'ventilator_withdrawal');
  ensureBool(req.dialysis_withdrawal, 'dialysis_withdrawal');
  ensureBool(req.feeding_tube_withdrawal, 'feeding_tube_withdrawal');
  ensureBool(req.palliative_sedation, 'palliative_sedation');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.comfort_plan, 'comfort_plan');
  let plan;
  if(req.ventilator_withdrawal && req.family_informed===false) plan='continue_with_family_meeting_then_reassess';
  else if(req.comfort_plan===false) plan='continue_with_comfort_plan_then_reassess';
  else if(req.palliative_sedation) plan='continue_with_protocol_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dignity_care(req){
  ensureBool(req.religious_ritual_planned, 'religious_ritual_planned');
  ensureBool(req.family_presence_continuous, 'family_presence_continuous');
  ensureBool(req.personal_care_complete, 'personal_care_complete');
  ensureBool(req.comfortable_position, 'comfortable_position');
  ensureBool(req.legacy_work_done, 'legacy_work_done');
  ensureBool(req.environment_peaceful, 'environment_peaceful');
  let plan;
  if(req.religious_ritual_planned===false) plan='continue_with_ritual_then_reassess';
  else if(req.personal_care_complete===false) plan='continue_with_personal_care_then_reassess';
  else if(req.comfortable_position===false) plan='continue_with_position_review_then_reassess';
  else if(req.environment_peaceful===false) plan='continue_with_environment_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post_mortem(req){
  ensureNumber(req.hours_since_death, 'hours_since_death');
  ensureBool(req.autopsy_planned, 'autopsy_planned');
  ensureBool(req.organ_donation_discussed, 'organ_donation_discussed');
  ensureBool(req.family_acknowledged, 'family_acknowledged');
  ensureBool(req.death_certificate_completed, 'death_certificate_completed');
  ensureBool(req.cultural_practices_followed, 'cultural_practices_followed');
  let plan;
  if(req.autopsy_planned===false) plan='continue_with_discuss_then_reassess';
  else if(req.organ_donation_discussed===false) plan='continue_with_donation_conversation_then_reassess';
  else if(req.death_certificate_completed===false) plan='continue_with_certificate_then_reassess';
  else if(req.cultural_practices_followed===false) plan='continue_with_cultural_practices_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vigil_care(req){
  ensureBool(req.bedside_nurse_present, 'bedside_nurse_present');
  ensureNumber(req.visit_frequency_hours, 'visit_frequency_hours');
  ensureBool(req.mouth_care_done, 'mouth_care_done');
  ensureBool(req.skin_care_done, 'skin_care_done');
  ensureBool(req.position_changed_recently, 'position_changed_recently');
  ensureBool(req.family_supported, 'family_supported');
  let plan;
  if(req.mouth_care_done===false) plan='continue_with_mouth_care_then_reassess';
  else if(req.position_changed_recently===false) plan='continue_with_reposition_then_reassess';
  else if(req.family_supported===false) plan='continue_with_family_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {dying_process,terminal_symptoms,withdrawal_care,dignity_care,post_mortem,vigil_care};}
module.exports={funcs,CITATIONS,ValidationError};
