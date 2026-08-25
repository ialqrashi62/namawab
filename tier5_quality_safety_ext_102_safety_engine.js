// filepath: tier5_quality_safety_ext_102_safety_engine.js
// TIER5_QUALITY_SAFETY_EXT-102: Patient safety
'use strict';
const CITATIONS = ['PatientSafety_2020','WHO_PatientSafety_2020','NPSF_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function safety_culture(req){
  ensureBool(req.reporting_safety, 'reporting_safety');
  ensureBool(req.blame_free, 'blame_free');
  ensureBool(req.transparency, 'transparency');
  ensureBool(req.teamwork, 'teamwork');
  ensureBool(req.leadership_engaged, 'leadership_engaged');
  let plan;
  if(req.reporting_safety===false) plan='continue_with_culture_then_reassess';
  else if(req.blame_free===false) plan='continue_with_just_culture_then_reassess';
  else if(req.transparency===false) plan='continue_with_transparency_then_reassess';
  else if(req.leadership_engaged===false) plan='continue_with_leadership_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ihi_two_challenge(req){
  ensureBool(req.safety_concern_identified, 'safety_concern_identified');
  ensureBool(req.first_challenge_issued, 'first_challenge_issued');
  ensureBool(req.escalation_done, 'escalation_done');
  ensureBool(req.supervisor_responded, 'supervisor_responded');
  ensureBool(req.outcome_safe, 'outcome_safe');
  let plan;
  if(req.safety_concern_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.first_challenge_issued===false) plan='continue_with_challenge_then_reassess';
  else if(req.escalation_done===false) plan='continue_with_escalate_then_reassess';
  else if(req.outcome_safe===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function crew(req){
  ensureBool(req.crew_engaged, 'crew_engaged');
  ensureBool(req.roles_understood, 'roles_understood');
  ensureBool(req.callouts_used, 'callouts_used');
  ensureBool(req.read_back_used, 'read_back_used');
  ensureBool(req.handoff_standardized, 'handoff_standardized');
  let plan;
  if(req.crew_engaged===false) plan='continue_with_engage_then_reassess';
  else if(req.roles_understood===false) plan='continue_with_clarify_then_reassess';
  else if(req.read_back_used===false) plan='continue_with_read_back_then_reassess';
  else if(req.handoff_standardized===false) plan='continue_with_handoff_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function safety_rounds(req){
  ensureBool(req.rounds_conducted, 'rounds_conducted');
  ensureBool(req.leadership_present, 'leadership_present');
  ensureBool(req.findings_addressed, 'findings_addressed');
  ensureBool(req.followup_done, 'followup_done');
  ensureBool(req.action_items_tracked, 'action_items_tracked');
  let plan;
  if(req.rounds_conducted===false) plan='continue_with_conduct_then_reassess';
  else if(req.leadership_present===false) plan='continue_with_leadership_then_reassess';
  else if(req.findings_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.action_items_tracked===false) plan='continue_with_track_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function handoff(req){
  ensureBool(req.sbar_used, 'sbar_used');
  ensureBool(req.checklist_used, 'checklist_used');
  ensureBool(req.accepted_responsibility, 'accepted_responsibility');
  ensureBool(req.questions_asked, 'questions_asked');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.sbar_used===false) plan='continue_with_sbar_then_reassess';
  else if(req.checklist_used===false) plan='continue_with_checklist_then_reassess';
  else if(req.accepted_responsibility===false) plan='continue_with_accept_then_reassess';
  else if(req.documented===false) plan='continue_with_documented_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function universal_protocol(req){
  ensureBool(req.pre_op_verification, 'pre_op_verification');
  ensureBool(req.site_marked, 'site_marked');
  ensureBool(req.time_out_performed, 'time_out_performed');
  ensureBool(req.sign_out_completed, 'sign_out_completed');
  ensureBool(req.team_participated, 'team_participated');
  let plan;
  if(req.pre_op_verification===false) plan='continue_with_verify_then_reassess';
  else if(req.site_marked===false) plan='continue_with_mark_then_reassess';
  else if(req.time_out_performed===false) plan='continue_with_timeout_then_reassess';
  else if(req.sign_out_completed===false) plan='continue_with_signout_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {safety_culture,ihi_two_challenge,crew,safety_rounds,handoff,universal_protocol};}
module.exports={funcs,CITATIONS,ValidationError};
