// filepath: tier5_hh_ext_123_palliative_engine.js
// TIER5_HH_EXT-123: Community Palliative Care
'use strict';
const CITATIONS = ['NCP_PAL_2018','NICE_PAL_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function consult(req){
  ensureStr(req.referral_diagnosis, 'referral_diagnosis');
  ensureEnum(req.referral_reason, 'referral_reason', ['pain','dyspnea','delirium','depression','spiritual','goals_of_care','advanced_care','other']);
  ensureNumber(req.who_function, 'who_function');
  ensureBool(req.consent, 'consent');
  ensureBool(req.advance_directive_review, 'advance_directive_review');
  ensureBool(req.family_meeting_needed, 'family_meeting_needed');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.advance_directive_review===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_consult_then_reassess';
  return {plan};
}
function pain(req){
  ensureNumber(req.score, 'score');
  ensureEnum(req.type, 'type', ['nociceptive','neuropathic','mixed','breakthrough','procedural','incident','other','unknown']);
  ensureBool(req.scheduled_dose, 'scheduled_dose');
  ensureBool(req.prn_ordered, 'prn_ordered');
  ensureBool(req.bowel_program, 'bowel_program');
  ensureBool(req.adjuvants_tried, 'adjuvants_tried');
  let plan;
  if(req.score>=7) plan='continue_with_urgent_then_reassess';
  else if(req.bowel_program===false && req.scheduled_dose===true) plan='continue_with_bowel_program_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function goals(req){
  ensureBool(req.values_explored, 'values_explored');
  ensureBool(req.surrogate_identified, 'surrogate_identified');
  ensureEnum(req.code_status_choice, 'code_status_choice', ['full','dnr','limited','comfort','undecided','unknown']);
  ensureBool(req.document_signed, 'document_signed');
  ensureBool(req.providers_informed, 'providers_informed');
  ensureBool(req.family_meeting_done, 'family_meeting_done');
  let plan;
  if(req.surrogate_identified===false) plan='continue_with_designate_then_reassess';
  else if(req.document_signed===false) plan='continue_with_sign_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function symp_nonpain(req){
  ensureEnum(req.symptom, 'symptom', ['dyspnea','delirium','nausea','constipation','agitation','insomnia','depression','other']);
  ensureNumber(req.severity, 'severity');
  ensureBool(req.nonpharm, 'nonpharm');
  ensureBool(req.pharm_intervention, 'pharm_intervention');
  ensureBool(req.reassessed, 'reassessed');
  ensureBool(req.education_provided, 'education_provided');
  let plan;
  if(req.severity>=7) plan='continue_with_intense_then_reassess';
  else if(req.reassessed===false) plan='continue_with_reassess_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function care_coordination(req){
  ensureBool(req.primary_care_coord, 'primary_care_coord');
  ensureBool(req.subspecialty_coord, 'subspecialty_coord');
  ensureBool(req.home_care_coord, 'home_care_coord');
  ensureBool(req.hospice_transition, 'hospice_transition');
  ensureBool(req.community_resources, 'community_resources');
  ensureBool(req.tcm_completed, 'tcm_completed');
  let plan;
  if(req.primary_care_coord===false) plan='continue_with_pcp_coord_then_reassess';
  else if(req.community_resources===false) plan='continue_with_resources_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function palliative_fu(req){
  ensureNumber(req.months_in_program, 'months_in_program');
  ensureBool(req.symptoms_improved, 'symptoms_improved');
  ensureBool(req.quality_of_life, 'quality_of_life');
  ensureEnum(req.transition_status, 'transition_status', ['continuing','hospice','discharged','deceased','other']);
  ensureBool(req.caregiver_burden_addressed, 'caregiver_burden_addressed');
  ensureBool(req.advance_directive_updated, 'advance_directive_updated');
  let plan;
  if(req.transition_status==='hospice') plan='continue_with_handoff_then_reassess';
  else if(req.advance_directive_updated===false) plan='continue_with_update_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {consult,pain,goals,symp_nonpain,care_coordination,palliative_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
