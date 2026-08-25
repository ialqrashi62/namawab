// filepath: tier5_derm_ext_102_inf_engine.js
// TIER5_DERM_EXT-102: Skin infections
'use strict';
const CITATIONS = ['AAD_Infection_2018','IDSA_SSTI_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cellulitis(req){
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','necrotizing','other']);
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.borders, 'borders');
  ensureBool(req.marks, 'marks');
  ensureBool(req.antibiotics, 'antibiotics');
  ensureBool(req.culture, 'culture');
  let plan;
  if(req.severity==='necrotizing') plan='continue_with_emergent_then_reassess';
  else if(req.severity==='severe') plan='continue_with_iv_then_reassess';
  else if(req.culture===false && req.systemic) plan='continue_with_culture_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function abscess(req){
  ensureBool(req.fluctuant, 'fluctuant');
  ensureBool(req.drainage, 'drainage');
  ensureBool(req.culture, 'culture');
  ensureBool(req.antibiotics, 'antibiotics');
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.recurrent, 'recurrent');
  let plan;
  if(req.fluctuant && req.drainage===false) plan='continue_with_i_d_then_reassess';
  else if(req.systemic && req.antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.recurrent) plan='continue_with_workup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fungal(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['tinea_corporis','tinea_pedis','tinea_cruris','tinea_unguium','tinea_capitis','candidiasis','pityriasis','other','unknown']);
  ensureBool(req.koh, 'koh');
  ensureBool(req.culture, 'culture');
  ensureBool(req.topical, 'topical');
  ensureBool(req.oral, 'oral');
  ensureBool(req.response, 'response');
  let plan;
  if(req.type==='tinea_capitis' && req.oral===false) plan='continue_with_oral_then_reassess';
  else if(req.koh===false) plan='continue_with_koh_then_reassess';
  else if(req.response===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function viral(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['hsv','zoster','hpv','molluscum','coxsackie','measles','dengue','chickenpox','other','unknown']);
  ensureBool(req.diagnosed, 'diagnosed');
  ensureBool(req.acyclovir, 'acyclovir');
  ensureBool(req.pain_management, 'pain_management');
  ensureBool(req.referral, 'referral');
  ensureBool(req.eye_involvement, 'eye_involvement');
  let plan;
  if(req.type==='zoster' && req.acyclovir===false) plan='continue_with_acyclovir_then_reassess';
  else if(req.eye_involvement) plan='continue_with_oph_refer_then_reassess';
  else if(req.pain_management===false) plan='continue_with_pain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function parasitic(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['scabies','lice','leishmaniasis','myiasis','cutaneous_larva','other','unknown']);
  ensureBool(req.diagnosed, 'diagnosed');
  ensureBool(req.contacts, 'contacts');
  ensureBool(req.treatment, 'treatment');
  ensureBool(req.environment, 'environment');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.contacts===false) plan='continue_with_contacts_then_reassess';
  else if(req.treatment===false) plan='continue_with_treat_then_reassess';
  else if(req.environment===false) plan='continue_with_env_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function wound(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['surgical','traumatic','diabetic','venous','arterial','pressure','other','unknown']);
  ensureBool(req.clean, 'clean');
  ensureBool(req.documented, 'documented');
  ensureBool(req.improving, 'improving');
  ensureBool(req.infection, 'infection');
  ensureBool(req.healing, 'healing');
  let plan;
  if(req.infection) plan='continue_with_review_then_reassess';
  else if(req.healing===false && req.improving===false) plan='continue_with_wound_care_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {cellulitis,abscess,fungal,viral,parasitic,wound};}
module.exports={funcs,CITATIONS,ValidationError};