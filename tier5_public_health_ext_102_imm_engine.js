// filepath: tier5_public_health_ext_102_imm_engine.js
// TIER5_PUBLIC_HEALTH_EXT-102: Immunization
'use strict';
const CITATIONS = ['ACIP_2020','CDC_Imm_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function schedule(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.history_reviewed, 'history_reviewed');
  ensureBool(req.allergies_screened, 'allergies_screened');
  ensureBool(req.contraindications, 'contraindications');
  ensureBool(req.consent_obtained, 'consent_obtained');
  ensureBool(req.previous_doses, 'previous_doses');
  let plan;
  if(req.history_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.allergies_screened===false) plan='continue_with_screen_then_reassess';
  else if(req.contraindications) plan='continue_with_defer_then_reassess';
  else if(req.consent_obtained===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vaccinate(req){
  ensureStr(req.vaccine, 'vaccine');
  ensureEnum(req.vaccine, 'vaccine', ['dtap','tdap','td','mmr','varicella','hpv','hepatitis_b','hepatitis_a','yellow_fever','typhoid','japanese_encephalitis','rabies','bcg','influenza','covid_19','rsv','pneumococcal','meningococcal','hib','polio','rotavirus','shingles','shingrix','none']);
  ensureNumber(req.dose, 'dose');
  ensureStr(req.route, 'route');
  ensureEnum(req.route, 'route', ['im','sq','oral','intranasal','intradermal','none']);
  ensureBool(req.technique_correct, 'technique_correct');
  ensureBool(req.site_documented, 'site_documented');
  ensureBool(req.lot_recorded, 'lot_recorded');
  let plan;
  if(req.technique_correct===false) plan='continue_with_educate_then_reassess';
  else if(req.site_documented===false) plan='continue_with_document_then_reassess';
  else if(req.lot_recorded===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function observe(req){
  ensureNumber(req.minutes_observed, 'minutes_observed');
  ensureBool(req.adverse_event, 'adverse_event');
  ensureBool(req.epinephrine_available, 'epinephrine_available');
  ensureBool(req.anaphylaxis_drill, 'anaphylaxis_drill');
  ensureBool(req.documented_followup, 'documented_followup');
  let plan;
  if(req.minutes_observed<15) plan='continue_with_observe_then_reassess';
  else if(req.adverse_event) plan='continue_with_manage_then_reassess';
  else if(req.epinephrine_available===false) plan='continue_with_obtain_then_reassess';
  else if(req.documented_followup===false) plan='continue_with_documented_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function school(req){
  ensureNumber(req.immunizations_complete, 'immunizations_complete');
  ensureNumber(req.required_count, 'required_count');
  ensureBool(req.exemption_documented, 'exemption_documented');
  ensureBool(req.school_communicated, 'school_communicated');
  ensureBool(req.catch_up_plan, 'catch_up_plan');
  let plan;
  if(req.immunizations_complete<req.required_count) plan='continue_with_catchup_then_reassess';
  else if(req.exemption_documented) plan='continue_with_review_then_reassess';
  else if(req.school_communicated===false) plan='continue_with_communicate_then_reassess';
  else if(req.catch_up_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function travel(req){
  ensureStr(req.destination, 'destination');
  ensureBool(req.counseled, 'counseled');
  ensureBool(req.required_vaccines_given, 'required_vaccines_given');
  ensureBool(req.recommended_vaccines_given, 'recommended_vaccines_given');
  ensureBool(req.malaria_prophylaxis, 'malaria_prophylaxis');
  ensureBool(req.travel_consultation, 'travel_consultation');
  let plan;
  if(req.travel_consultation===false) plan='continue_with_consult_then_reassess';
  else if(req.required_vaccines_given===false) plan='continue_with_give_then_reassess';
  else if(req.malaria_prophylaxis===false) plan='continue_with_prophylaxis_then_reassess';
  else if(req.counseled===false) plan='continue_with_counsel_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function registry(req){
  ensureBool(req.state_registry, 'state_registry');
  ensureBool(req.cdc_registry, 'cdc_registry');
  ensureBool(req.international_registry, 'international_registry');
  ensureBool(req.consent_obtained, 'consent_obtained');
  ensureBool(req.data_accurate, 'data_accurate');
  let plan;
  if(req.consent_obtained===false) plan='continue_with_consent_then_reassess';
  else if(req.state_registry===false) plan='continue_with_state_then_reassess';
  else if(req.cdc_registry===false) plan='continue_with_cdc_then_reassess';
  else if(req.data_accurate===false) plan='continue_with_verify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {schedule,vaccinate,observe,school,travel,registry};}
module.exports={funcs,CITATIONS,ValidationError};
