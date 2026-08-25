// filepath: tier5_hh_ext_122_hospice_engine.js
// TIER5_HH_EXT-122: Hospice Home Care
'use strict';
const CITATIONS = ['NHPCO_2020','CMS_HOSPICE_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function eligibility(req){
  ensureEnum(req.diagnosis_category, 'diagnosis_category', ['cancer','dementia','heart','lung','kidney','liver','neuro','hiv','other']);
  ensureNumber(req.prognosis_months, 'prognosis_months');
  ensureBool(req.functional_decline, 'functional_decline');
  ensureBool(req.consent_hospice, 'consent_hospice');
  ensureBool(req.family_consent, 'family_consent');
  ensureBool(req.phdn_signed, 'phdn_signed');
  let plan;
  if(req.consent_hospice===false) plan='continue_with_discuss_then_reassess';
  else if(req.prognosis_months>12) plan='continue_with_palliative_then_reassess';
  else if(req.phdn_signed===false) plan='continue_with_sign_phdn_then_reassess';
  else plan='continue_with_admit_then_reassess';
  return {plan};
}
function admission(req){
  ensureEnum(req.level_of_care, 'level_of_care', ['routine_home','continuous_home','general_inpatient','respite','inpatient','other']);
  ensureBool(req.nursing_assessment, 'nursing_assessment');
  ensureBool(req.medication_reconciled, 'medication_reconciled');
  ensureBool(req.dme_arranged, 'dme_arranged');
  ensureBool(req.family_oriented, 'family_oriented');
  ensureBool(req.emergency_plan, 'emergency_plan');
  let plan;
  if(req.nursing_assessment===false) plan='continue_with_nursing_then_reassess';
  else if(req.emergency_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_initiate_visits_then_reassess';
  return {plan};
}
function symptom(req){
  ensureEnum(req.symptom, 'symptom', ['pain','dyspnea','nausea','constipation','agitation','confusion','anxiety','wounds','other']);
  ensureNumber(req.severity, 'severity');
  ensureBool(req.assessed, 'assessed');
  ensureBool(req.nonpharm, 'nonpharm');
  ensureBool(req.pharm, 'pharm');
  ensureBool(req.reassessment, 'reassessment');
  let plan;
  if(req.severity>=7) plan='continue_with_intense_intervention_then_reassess';
  else if(req.reassessment===false) plan='continue_with_reassess_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function visits(req){
  ensureEnum(req.discipline, 'discipline', ['rn','md','sw','chaplain','aide','volunteer','other']);
  ensureNumber(req.visits_week, 'visits_week');
  ensureBool(req.frequency_appropriate, 'frequency_appropriate');
  ensureBool(req.documentation, 'documentation');
  ensureBool(req.caregiver_engagement, 'caregiver_engagement');
  ensureBool(req.barriers_addressed, 'barriers_addressed');
  let plan;
  if(req.frequency_appropriate===false) plan='continue_with_freq_review_then_reassess';
  else if(req.barriers_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function bereavement(req){
  ensureStr(req.relationship, 'relationship');
  ensureBool(req.contact_offered, 'contact_offered');
  ensureBool(req.contact_accepted, 'contact_accepted');
  ensureNumber(req.grief_followup_months, 'grief_followup_months');
  ensureBool(req.group_referred, 'group_referred');
  ensureBool(req.resources_provided, 'resources_provided');
  let plan;
  if(req.contact_accepted===false) plan='continue_with_offer_then_reassess';
  else if(req.resources_provided===false) plan='continue_with_resources_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function hospice_fu(req){
  ensureNumber(req.weeks_in_hospice, 'weeks_in_hospice');
  ensureBool(req.symptoms_controlled, 'symptoms_controlled');
  ensureEnum(req.discharge_status, 'discharge_status', ['alive','deceased','transferred','revoked','extended','other']);
  ensureBool(req.level_of_care_reviewed, 'level_of_care_reviewed');
  ensureBool(req.caregiver_burden_addressed, 'caregiver_burden_addressed');
  ensureBool(req.physician_signed, 'physician_signed');
  let plan;
  if(req.discharge_status==='deceased') plan='continue_with_bereavement_then_reassess';
  else if(req.level_of_care_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {eligibility,admission,symptom,visits,bereavement,hospice_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
