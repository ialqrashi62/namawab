// filepath: tier5_pall_care_ext2_103_comfort_engine.js
// TIER5_PALL_CARE_EXT2-103: Comfort measures
'use strict';
const CITATIONS = ['NCP_2020','Hospice_Comfort_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function comfort_order(req){
  ensureBool(req.pain_meds_optimized, 'pain_meds_optimized');
  ensureBool(req.dyspnea_controlled, 'dyspnea_controlled');
  ensureBool(req.delirium_addressed, 'delirium_addressed');
  ensureBool(req.nausea_controlled, 'nausea_controlled');
  ensureBool(req.agitation_managed, 'agitation_managed');
  ensureBool(req.labs_discontinued, 'labs_discontinued');
  let plan;
  if(req.pain_meds_optimized===false) plan='continue_with_optimize_then_reassess';
  else if(req.dyspnea_controlled===false) plan='continue_with_address_then_reassess';
  else if(req.delirium_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.labs_discontinued===false) plan='continue_with_discontinue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioids(req){
  ensureNumber(req.current_dose_mge, 'current_dose_mge');
  ensureNumber(req.breakthrough_doses, 'breakthrough_doses');
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.bowel_program, 'bowel_program');
  ensureBool(req.sedation_tolerated, 'sedation_tolerated');
  ensureBool(req.family_education, 'family_education');
  ensureBool(req.respiratory_depression, 'respiratory_depression');
  let plan;
  if(req.pain_score>=4 && req.breakthrough_doses>=3) plan='continue_with_increase_then_reassess';
  else if(req.bowel_program===false) plan='continue_with_program_then_reassess';
  else if(req.respiratory_depression) plan='continue_with_reduce_then_reassess';
  else if(req.family_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function agitation(req){
  ensureBool(req.reversible_causes_addressed, 'reversible_causes_addressed');
  ensureBool(req.haloperidol, 'haloperidol');
  ensureBool(req.benzodiazepine, 'benzodiazepine');
  ensureBool(req.environmental_measures, 'environmental_measures');
  ensureBool(req.family_education, 'family_education');
  ensureBool(req.experiences_of_patient, 'experiences_of_patient');
  let plan;
  if(req.reversible_causes_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.haloperidol===false && req.benzodiazepine===false) plan='continue_with_trial_then_reassess';
  else if(req.environmental_measures===false) plan='continue_with_environment_then_reassess';
  else if(req.family_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dyspnea(req){
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureBool(req.spo2_low, 'spo2_low');
  ensureBool(req.opioid_optimized, 'opioid_optimized');
  ensureBool(req.benzodiazepine, 'benzodiazepine');
  ensureBool(req.fan, 'fan');
  ensureBool(req.positioning, 'positioning');
  ensureBool(req.anxiety_addressed, 'anxiety_addressed');
  let plan;
  if(req.respiratory_rate>=30) plan='continue_with_urgent_then_reassess';
  else if(req.opioid_optimized===false) plan='continue_with_opioid_then_reassess';
  else if(req.benzodiazepine===false) plan='continue_with_anxiolytic_then_reassess';
  else if(req.anxiety_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delirium_terminal(req){
  ensureBool(req.reversible_evaluated, 'reversible_evaluated');
  ensureBool(req.haloperidol_trial, 'haloperidol_trial');
  ensureBool(req.env_modification, 'env_modification');
  ensureBool(req.family_education, 'family_education');
  ensureBool(req.medication_overload, 'medication_overload');
  let plan;
  if(req.medication_overload) plan='continue_with_review_then_reassess';
  else if(req.reversible_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.haloperidol_trial===false) plan='continue_with_trial_then_reassess';
  else if(req.env_modification===false) plan='continue_with_env_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function non_pharm(req){
  ensureBool(req.music_therapy, 'music_therapy');
  ensureBool(req.massage, 'massage');
  ensureBool(req.reiki, 'reiki');
  ensureBool(req.aromatherapy, 'aromatherapy');
  ensureBool(req.spiritual_care, 'spiritual_care');
  ensureBool(req.family_presence, 'family_presence');
  let plan;
  if(req.family_presence===false) plan='continue_with_invite_then_reassess';
  else if(req.spiritual_care===false) plan='continue_with_offer_then_reassess';
  else if(req.music_therapy===false) plan='continue_with_offer_then_reassess';
  else if(req.massage===false) plan='continue_with_offer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {comfort_order,opioids,agitation,dyspnea,delirium_terminal,non_pharm};}
module.exports={funcs,CITATIONS,ValidationError};
