// filepath: tier5_ger_ext_115_dementia_engine.js
// TIER5_GER_EXT-115: Dementia / Cognitive Disorders
'use strict';
const CITATIONS = ['APA_DEMENTIA_2020','Lancet_Comm_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function workup(req){
  ensureEnum(req.suspected_type, 'suspected_type', ['alzheimer','vascular','lewy_body','ftd','parkinson','mixed','pseudodementia','mci','other','unknown']);
  ensureBool(req.neuropsych_done, 'neuropsych_done');
  ensureBool(req.brain_imaging_done, 'brain_imaging_done');
  ensureBool(req.labs_done, 'labs_done');
  ensureBool(req.reversible_causes_excluded, 'reversible_causes_excluded');
  ensureBool(req.caregiver_present, 'caregiver_present');
  let plan;
  if(req.reversible_causes_excluded===false) plan='continue_with_reverse_first_then_reassess';
  else if(req.caregiver_present===false) plan='continue_with_informant_interview_then_reassess';
  else plan='continue_with_diagnosis_formulation_then_reassess';
  return {plan};
}
function stages(req){
  ensureEnum(req.cdr, 'cdr', ['none','q1','mci','mild','moderate','severe','very_severe','terminal']);
  ensureBool(req.adl_help_needed, 'adl_help_needed');
  ensureBool(req.behavioral_symptoms, 'behavioral_symptoms');
  ensureBool(req.wandering, 'wandering');
  ensureBool(req.sundowning, 'sundowning');
  ensureBool(req.disinhibition, 'disinhibition');
  let plan;
  if(req.cdr==='severe' || req.cdr==='very_severe') plan='continue_with_full_care_then_reassess';
  else if(req.behavioral_symptoms===true) plan='continue_with_psychoactive_review_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function medications(req){
  ensureEnum(req.cholinesterase_inhibitor, 'cholinesterase_inhibitor', ['donepezil','rivastigmine','galantamine','none','other']);
  ensureEnum(req.memantine, 'memantine', ['yes','no','other']);
  ensureBool(req.contraindicated_anticholinergic, 'contraindicated_anticholinergic');
  ensureBool(req.behavioral_meds_minimized, 'behavioral_meds_minimized');
  ensureBool(req.adherence_help, 'adherence_help');
  ensureBool(req.caregiver_understanding, 'caregiver_understanding');
  let plan;
  if(req.contraindicated_anticholinergic===true) plan='continue_with_dc_anticholin_then_reassess';
  else if(req.behavioral_meds_minimized===false) plan='continue_with_nonpharm_first_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function safety(req){
  ensureBool(req.wandering_risk, 'wandering_risk');
  ensureBool(req.driving_evaluated, 'driving_evaluated');
  ensureBool(req.medication_lock, 'medication_lock');
  ensureBool(req.environment_safe, 'environment_safe');
  ensureBool(req.meal_setup, 'meal_setup');
  ensureBool(req.financial_protections, 'financial_protections');
  let plan;
  if(req.wandering_risk===true && req.environment_safe===false) plan='continue_with_safety_plan_then_reassess';
  else if(req.medication_lock===false) plan='continue_with_med_lock_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function bpsd(req){
  ensureEnum(req.behavior_type, 'behavior_type', ['agitation','aggression','apathy','psychosis','depression','sleep','wandering','other']);
  ensureNumber(req.frequency_per_week, 'frequency_per_week');
  ensureBool(req.triggers_identified, 'triggers_identified');
  ensureBool(req.nonpharm_tried, 'nonpharm_tried');
  ensureBool(req.pharm_indicated, 'pharm_indicated');
  ensureBool(req.behavior_charted, 'behavior_charted');
  let plan;
  if(req.behavior_type==='psychosis' && req.pharm_indicated===true) plan='continue_with_cautious_pharm_then_reassess';
  else if(req.nonpharm_tried===false) plan='continue_with_nonpharm_first_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function dementia_fu(req){
  ensureNumber(req.months_since_dx, 'months_since_dx');
  ensureEnum(req.progression, 'progression', ['stable','slow','rapid','fluctuating','unknown']);
  ensureBool(req.caregiver_burden, 'caregiver_burden');
  ensureEnum(req.residence, 'residence', ['home','memory_care','nursing','other']);
  ensureBool(req.advanced_directive_done, 'advanced_directive_done');
  ensureBool(req.hospice_referred, 'hospice_referred');
  let plan;
  if(req.progression==='rapid') plan='continue_with_palliative_consult_then_reassess';
  else if(req.caregiver_burden===true) plan='continue_with_respite_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}

function funcs(){return {workup,stages,medications,safety,bpsd,dementia_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
