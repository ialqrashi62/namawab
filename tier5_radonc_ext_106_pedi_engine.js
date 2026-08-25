// filepath: tier5_radonc_ext_106_pedi_engine.js
// TIER5_RADIONC_EXT-106: Pediatric radiation oncology
'use strict';
const CITATIONS = ['COG_PedsRT_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['medulloblastoma','ependymoma','gbm','atrt','dnet','low_grade_glioma','craniopharyngioma','neuroblastoma','wilms','rhabdomyosarcoma','ewing','osteosarcoma','leukemia','lymphoma','retinoblastoma','other','unknown']);
  ensureNumber(req.age_months, 'age_months');
  ensureBool(req.consent, 'consent');
  ensureBool(req.assent, 'assent');
  ensureBool(req.mdt, 'mdt');
  let plan;
  if(req.age_months<36 && req.diagnosis==='medulloblastoma') plan='continue_with_review_then_reassess';
  else if(req.mdt===false) plan='continue_with_review_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sedation(req){
  ensureBool(req.anesthesia_planned, 'anesthesia_planned');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['moderate','deep','general','topical','none','other']);
  ensureBool(req.fasting, 'fasting');
  ensureBool(req.airway, 'airway');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.parent_present, 'parent_present');
  let plan;
  if(req.fasting===false && req.type==='general') plan='continue_with_reschedule_then_reassess';
  else if(req.airway===false) plan='continue_with_review_then_reassess';
  else if(req.monitoring===false) plan='continue_with_review_then_reassess';
  else if(req.parent_present===false) plan='continue_with_family_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function craniospinal(req){
  ensureBool(req.planning, 'planning');
  ensureBool(req.craniospinal, 'craniospinal');
  ensureNumber(req.craniospinal_dose, 'craniospinal_dose');
  ensureNumber(req.fossa_boost, 'fossa_boost');
  ensureBool(req.junction_shifts, 'junction_shifts');
  ensureBool(req.long_term_fu, 'long_term_fu');
  ensureBool(req.growth_reserve, 'growth_reserve');
  let plan;
  if(req.craniospinal===false) plan='continue_with_plan_then_reassess';
  else if(req.junction_shifts===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function proton(req){
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.simulation, 'simulation');
  ensureBool(req.treatment, 'treatment');
  ensureBool(req.beam_modulated, 'beam_modulated');
  ensureBool(req.range_uncertainty, 'range_uncertainty');
  ensureBool(req.anesthesia, 'anesthesia');
  let plan;
  if(req.candidate===false) plan='continue_with_review_then_reassess';
  else if(req.range_uncertainty===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function late_effects(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['cognitive','endocrine','musculoskeletal','cardiac','pulmonary','secondary_cancer','growth','fertility','psychosocial','other','unknown']);
  ensureBool(req.screening, 'screening');
  ensureBool(req.hormone_replacement, 'hormone_replacement');
  ensureBool(req.cognitive_rehab, 'cognitive_rehab');
  ensureBool(req.survivorship, 'survivorship');
  ensureBool(req.family_support, 'family_support');
  let plan;
  if(req.type==='secondary_cancer') plan='continue_with_surveillance_then_reassess';
  else if(req.screening===false) plan='continue_with_screening_then_reassess';
  else if(req.survivorship===false) plan='continue_with_survivorship_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function survivorship(req){
  ensureNumber(req.years_since, 'years_since');
  ensureBool(req.late_effects_monitored, 'late_effects_monitored');
  ensureBool(req.secondary_cancer_screening, 'secondary_cancer_screening');
  ensureBool(req.qol, 'qol');
  ensureBool(req.education, 'education');
  ensureBool(req.transition, 'transition');
  let plan;
  if(req.late_effects_monitored===false) plan='continue_with_monitor_then_reassess';
  else if(req.secondary_cancer_screening===false) plan='continue_with_screen_then_reassess';
  else if(req.transition===false && req.years_since>=5) plan='continue_with_transition_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,sedation,craniospinal,proton,late_effects,survivorship};}
module.exports={funcs,CITATIONS,ValidationError};