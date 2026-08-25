// filepath: tier5_pharm_ext_106_onc_engine.js
// TIER5_PHARMACOLOGY_EXT-106: Oncology pharmacy
'use strict';
const CITATIONS = ['ASCO_Pharm_2020','NCCN_Pharm_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function emesis(req){
  ensureStr(req.risk, 'risk');
  ensureEnum(req.risk, 'risk', ['minimal','low','moderate','high','unknown']);
  ensureBool(req.premeds_given, 'premeds_given');
  ensureBool(req.breakthrough, 'breakthrough');
  ensureBool(req.rescue_plan, 'rescue_plan');
  ensureBool(req.monitoring, 'monitoring');
  let plan;
  if(req.risk==='high' && req.premeds_given===false) plan='continue_with_premed_then_reassess';
  else if(req.breakthrough && req.rescue_plan===false) plan='continue_with_rescue_then_reassess';
  else if(req.monitoring===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chemo_dose(req){
  ensureNumber(req.bsa, 'bsa');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureBool(req.dose_reduced, 'dose_reduced');
  ensureBool(req.reduction_documented, 'reduction_documented');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.dose_reduced && req.reduction_documented===false) plan='continue_with_documentation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function extravasation(req){
  ensureStr(req.vesicant, 'vesicant');
  ensureEnum(req.vesicant, 'vesicant', ['none','anthracycline','taxane','vinca','oxaliplatin','cisplatin','mitomycin','other']);
  ensureBool(req.iv_assessed, 'iv_assessed');
  ensureBool(req.warm_cold, 'warm_cold');
  ensureBool(req.dexrazoxane, 'dexrazoxane');
  ensureBool(req.extravasation_protocol, 'extravasation_protocol');
  let plan;
  if(req.iv_assessed===false) plan='continue_with_assess_then_reassess';
  else if(req.vesicant!=='none' && req.extravasation_protocol===false) plan='continue_with_protocol_then_reassess';
  else if(req.vesicant==='anthracycline' && req.dexrazoxane===false) plan='continue_with_dexrazoxane_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function supportive(req){
  ensureBool(req.growth_factor, 'growth_factor');
  ensureBool(req.g_csf_appropriate, 'g_csf_appropriate');
  ensureBool(req.antiemetic, 'antiemetic');
  ensureBool(req.mouth_care, 'mouth_care');
  ensureBool(req.diet, 'diet');
  let plan;
  if(req.growth_factor && req.g_csf_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.mouth_care===false) plan='continue_with_mouth_care_then_reassess';
  else if(req.diet===false) plan='continue_with_diet_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function toxicity(req){
  ensureBool(req.neutropenia, 'neutropenia');
  ensureBool(req.febrile_neutropenia, 'febrile_neutropenia');
  ensureBool(req.mucositis, 'mucositis');
  ensureBool(req.hand_foot, 'hand_foot');
  ensureBool(req.neuropathy, 'neuropathy');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.febrile_neutropenia && req.managed===false) plan='continue_with_emergent_then_reassess';
  else if(req.hand_foot && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.neuropathy) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function adherence(req){
  ensureBool(req.taking, 'taking');
  ensureBool(req.barriers, 'barriers');
  ensureBool(req.oral_counseling, 'oral_counseling');
  ensureBool(req.call_education, 'call_education');
  ensureBool(req.refills_planned, 'refills_planned');
  let plan;
  if(req.taking===false) plan='continue_with_barriers_then_reassess';
  else if(req.barriers) plan='continue_with_address_then_reassess';
  else if(req.oral_counseling===false) plan='continue_with_counsel_then_reassess';
  else if(req.refills_planned===false) plan='continue_with_refill_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {emesis,chemo_dose,extravasation,supportive,toxicity,adherence};}
module.exports={funcs,CITATIONS,ValidationError};