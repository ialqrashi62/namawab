// filepath: tier5_pall_care_ext_106_goals_engine.js
// TIER5_PALL_CARE_EXT-106: Advance care planning (goals of care, code status, MOLST/POLST)
'use strict';
const CITATIONS = ['AHA_ACP_2017','NHPCO_Standards_2021','NQF_ACP_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function goals_care_discussion(req){
  ensureNumber(req.days_diagnosis, 'days_diagnosis');
  ensureBool(req.prognosis_disclosed, 'prognosis_disclosed');
  ensureStr(req.patient_understanding, 'patient_understanding');
  ensureEnum(req.patient_understanding, 'patient_understanding', ['curative','chronic_with_curative','chronic_without_curative','life_limiting','end_of_life','uncertain']);
  ensureBool(req.family_present, 'family_present');
  ensureBool(req.substitute_decision_maker_present, 'substitute_decision_maker_present');
  let plan;
  if(req.patient_understanding==='curative' && req.prognosis_disclosed===false) plan='continue_with_prognosis_disclosure_then_reassess';
  else if(req.family_present===false && req.substitute_decision_maker_present===false) plan='continue_with_family_meeting_then_reassess';
  else if(req.patient_understanding==='uncertain') plan='continue_with_discussion_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function code_status(req){
  ensureStr(req.status, 'status');
  ensureEnum(req.status, 'status', ['full_code','dnr_dni','dnr_intubation','dnr_chest_compressions','cmo','and_dnr','partial_dni','partial_chest_compressions']);
  ensureBool(req.documented_in_chart, 'documented_in_chart');
  ensureBool(req.witness_signed, 'witness_signed');
  ensureBool(req.family_agreed, 'family_agreed');
  ensureNumber(req.days_documented, 'days_documented');
  let plan;
  if(!req.documented_in_chart) plan='continue_with_documentation_then_reassess';
  else if(!req.witness_signed) plan='continue_with_witness_then_reassess';
  else if(req.days_documented>=30) plan='continue_with_rediscussion_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function molst_polst(req){
  ensureBool(req.molst_signed, 'molst_signed');
  ensureBool(req.molst_reviewed_recently, 'molst_reviewed_recently');
  ensureStr(req.code_section, 'code_section');
  ensureStr(req.medical_section, 'medical_section');
  ensureStr(req.artificial_nutrition, 'artificial_nutrition');
  ensureBool(req.sdm_identified, 'sdm_identified');
  let plan;
  if(req.molst_signed===false) plan='continue_with_discussion_then_reassess';
  else if(req.molst_reviewed_recently===false) plan='continue_with_review_then_reassess';
  else if(req.sdm_identified===false) plan='continue_with_sdm_identification_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function proxy_decision(req){
  ensureBool(req.proxy_designated, 'proxy_designated');
  ensureStr(req.proxy_relationship, 'proxy_relationship');
  ensureBool(req.proxy_witness, 'proxy_witness');
  ensureBool(req.proxy_aware_of_wishes, 'proxy_aware_of_wishes');
  ensureBool(req.alternate_proxy_designated, 'alternate_proxy_designated');
  let plan;
  if(req.proxy_designated===false) plan='continue_with_discussion_then_reassess';
  else if(req.proxy_aware_of_wishes===false) plan='continue_with_discussion_with_proxy_then_reassess';
  else if(req.alternate_proxy_designated===false) plan='continue_with_alternate_designation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function conflict_resolution(req){
  ensureStr(req.conflict_type, 'conflict_type');
  ensureEnum(req.conflict_type, 'conflict_type', ['family_vs_patient','family_vs_team','team_vs_patient','sd_overlapping','cultural_disagreement']);
  ensureBool(req.family_meeting_done, 'family_meeting_done');
  ensureBool(req.ethics_consult_done, 'ethics_consult_done');
  ensureBool(req.spiritual_support_involved, 'spiritual_support_involved');
  ensureBool(req.palliative_care_consulted, 'palliative_care_consulted');
  let plan;
  if(req.family_meeting_done===false) plan='continue_with_meeting_then_reassess';
  else if(req.ethics_consult_done===false) plan='continue_with_ethics_consult_then_reassess';
  else if(req.spiritual_support_involved===false) plan='continue_with_spiritual_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function document_review(req){
  ensureNumber(req.last_review_months, 'last_review_months');
  ensureBool(req.patient_still_capable, 'patient_still_capable');
  ensureBool(req.advance_directive_signed, 'advance_directive_signed');
  ensureBool(req.documented_goals_revisit, 'documented_goals_revisit');
  ensureBool(req.physician_signature, 'physician_signature');
  ensureBool(req.revisit_done, 'revisit_done');
  let plan;
  if(req.advance_directive_signed===false) plan='continue_with_documentation_then_reassess';
  else if(req.last_review_months>=12) plan='continue_with_revisit_then_reassess';
  else if(req.documented_goals_revisit===false) plan='continue_with_documented_revisit_then_reassess';
  else if(req.physician_signature===false) plan='continue_with_signature_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {goals_care_discussion,code_status,molst_polst,proxy_decision,conflict_resolution,document_review};}
module.exports={funcs,CITATIONS,ValidationError};
