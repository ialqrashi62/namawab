// filepath: tier5_pall_care_ext2_106_reassess_engine.js
// TIER5_PALL_CARE_EXT2-106: Symptom reassessment
'use strict';
const CITATIONS = ['ESMO_Symptom_2020','Pall_Symptom_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pain_reassess(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureNumber(req.pain_score_24h_ago, 'pain_score_24h_ago');
  ensureStr(req.medication, 'medication');
  ensureEnum(req.medication, 'medication', ['morphine','hydromorphone','oxycodone','fentanyl','methadone','nsaid','gabapentin','acetaminophen','none']);
  ensureNumber(req.dose_change, 'dose_change');
  ensureBool(req.improvement, 'improvement');
  ensureBool(req.side_effects, 'side_effects');
  let plan;
  if(req.pain_score>=7 && req.improvement===false) plan='continue_with_increase_then_reassess';
  else if(req.side_effects) plan='continue_with_rotation_then_reassess';
  else if(req.pain_score-req.pain_score_24h_ago<2) plan='continue_with_optimize_then_reassess';
  else if(req.pain_score<=3) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dyspnea_reassess(req){
  ensureNumber(req.dyspnea_score, 'dyspnea_score');
  ensureNumber(req.rr, 'rr');
  ensureBool(req.opioid_given, 'opioid_given');
  ensureBool(req.oxygen, 'oxygen');
  ensureBool(req.fan_present, 'fan_present');
  ensureBool(req.anxiety_addressed, 'anxiety_addressed');
  let plan;
  if(req.dyspnea_score>=7 && req.opioid_given===false) plan='continue_with_opioid_then_reassess';
  else if(req.rr>=30) plan='continue_with_assess_then_reassess';
  else if(req.dyspnea_score>=4 && req.anxiety_addressed===false) plan='continue_with_anxiolytic_then_reassess';
  else if(req.oxygen) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delirium_reassess(req){
  ensureNumber(req.drs_score, 'drs_score');
  ensureBool(req.reversible_causes_addressed, 'reversible_causes_addressed');
  ensureBool(req.haloperidol_active, 'haloperidol_active');
  ensureBool(req.environment_optimized, 'environment_optimized');
  ensureBool(req.family_aware, 'family_aware');
  ensureBool(req.medication_oriented, 'medication_oriented');
  let plan;
  if(req.drs_score>=10 && req.haloperidol_active===false) plan='continue_with_medication_then_reassess';
  else if(req.reversible_causes_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.environment_optimized===false) plan='continue_with_env_then_reassess';
  else if(req.family_aware===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nausea_reassess(req){
  ensureNumber(req.nausea_score, 'nausea_score');
  ensureNumber(req.vomiting_episodes, 'vomiting_episodes');
  ensureStr(req.antiemetic, 'antiemetic');
  ensureEnum(req.antiemetic, 'antiemetic', ['ondansetron','metoclopramide','haloperidol','dexamethasone','scopolamine','prochlorperazine','olanzapine','none']);
  ensureBool(req.oral_intake, 'oral_intake');
  ensureBool(req.response, 'response');
  let plan;
  if(req.nausea_score>=4 && req.response===false) plan='continue_with_optimize_then_reassess';
  else if(req.vomiting_episodes>=3) plan='continue_with_increase_then_reassess';
  else if(req.oral_intake===false) plan='continue_with_subq_then_reassess';
  else if(req.nausea_score>=2) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function constipation(req){
  ensureNumber(req.days_since_bm, 'days_since_bm');
  ensureBool(req.bowel_program, 'bowel_program');
  ensureBool(req.stimulant_laxative, 'stimulant_laxative');
  ensureBool(req.softener, 'softener');
  ensureBool(req.enema_needed, 'enema_needed');
  ensureBool(req.symptoms_present, 'symptoms_present');
  let plan;
  if(req.days_since_bm>=3 && req.bowel_program===false) plan='continue_with_program_then_reassess';
  else if(req.symptoms_present && req.softener===false) plan='continue_with_softener_then_reassess';
  else if(req.enema_needed) plan='continue_with_enema_then_reassess';
  else if(req.days_since_bm>=2) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fatigue_reassess(req){
  ensureNumber(req.fatigue_score, 'fatigue_score');
  ensureBool(req.sleep_quality, 'sleep_quality');
  ensureBool(req.anemia_evaluated, 'anemia_evaluated');
  ensureBool(req.thyroid_evaluated, 'thyroid_evaluated');
  ensureBool(req.conservation_education, 'conservation_education');
  ensureBool(req.exercise_appropriate, 'exercise_appropriate');
  let plan;
  if(req.fatigue_score>=7 && req.anemia_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.fatigue_score>=7 && req.thyroid_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.sleep_quality===false) plan='continue_with_optimize_then_reassess';
  else if(req.conservation_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pain_reassess,dyspnea_reassess,delirium_reassess,nausea_reassess,constipation,fatigue_reassess};}
module.exports={funcs,CITATIONS,ValidationError};
