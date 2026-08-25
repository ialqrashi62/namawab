// filepath: tier5_pharm_ext_104_tox_engine.js
// TIER5_PHARMACOLOGY_EXT-104: Toxicology & overdose
'use strict';
const CITATIONS = ['Goldfrank_2019','Haddad_2022'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function toxidrome(req){
  ensureStr(req.syndrome, 'syndrome');
  ensureEnum(req.syndrome, 'syndrome', ['sympathomimetic','anticholinergic','cholinergic','opiate','sedative_hypnotic','serotonin','nms','alcohol','withdrawal','none','other']);
  ensureBool(req.vital_signs_reviewed, 'vital_signs_reviewed');
  ensureBool(req.mental_status, 'mental_status');
  ensureBool(req.pupils, 'pupils');
  ensureBool(req.skin, 'skin');
  let plan;
  if(req.vital_signs_reviewed===false) plan='continue_with_vitals_then_reassess';
  else if(req.mental_status===false) plan='continue_with_mental_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exposure(req){
  ensureStr(req.route, 'route');
  ensureEnum(req.route, 'route', ['oral','inhalation','iv','im','transdermal','contact','bites','envenomation','parenteral','other']);
  ensureNumber(req.time_since, 'time_since');
  ensureNumber(req.amount, 'amount');
  ensureStr(req.intent, 'intent');
  ensureEnum(req.intent, 'intent', ['suicidal','homicidal','recreational','unintentional','occupational','environmental','unknown','other','none']);
  ensureBool(req.contamination_risk, 'contamination_risk');
  let plan;
  if(req.contamination_risk) plan='continue_with_decon_then_reassess';
  else if(req.intent==='suicidal') plan='continue_with_psych_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function antidotes(req){
  ensureBool(req.antidote_needed, 'antidote_needed');
  ensureStr(req.antidote, 'antidote');
  ensureEnum(req.antidote, 'antidote', ['none','activated_charcoal','naloxone','flumazenil','atropine','pralidoxime','physostigmine','n_acetylcysteine','thiamine','deferoxamine','ethanol','fomepizole','other']);
  ensureBool(req.dosed, 'dosed');
  ensureBool(req.response, 'response');
  let plan;
  if(req.antidote_needed && req.dosed===false) plan='continue_with_dose_then_reassess';
  else if(req.dosed && req.response===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function labs(req){
  ensureBool(req.cbc, 'cbc');
  ensureBool(req.bmp, 'bmp');
  ensureBool(req.osmolar_gap, 'osmolar_gap');
  ensureBool(req.anion_gap, 'anion_gap');
  ensureBool(req.salicylate_level, 'salicylate_level');
  ensureBool(req.ethanol_level, 'ethanol_level');
  ensureBool(req.drug_screen, 'drug_screen');
  let plan;
  if(req.anion_gap===false) plan='continue_with_ag_then_reassess';
  else if(req.osmolar_gap===false) plan='continue_with_osm_then_reassess';
  else if(req.drug_screen===false) plan='continue_with_screen_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function elimination(req){
  ensureBool(req.dialysis_consulted, 'dialysis_consulted');
  ensureBool(req.hemodialysis, 'hemodialysis');
  ensureBool(req.crrt, 'crrt');
  ensureBool(req.continuous, 'continuous');
  ensureBool(req.urine_alkalinization, 'urine_alkalinization');
  ensureBool(req.activated_charcoal, 'activated_charcoal');
  let plan;
  if(req.dialysis_consulted===false) plan='continue_with_consult_then_reassess';
  else if(req.hemodialysis===false && req.crrt===false && req.dialysis_consulted) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.bp, 'bp');
  ensureNumber(req.temp, 'temp');
  ensureBool(req.mental_watch, 'mental_watch');
  ensureBool(req.disposition, 'disposition');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.mental_watch===false) plan='continue_with_watch_then_reassess';
  else if(req.disposition===false) plan='continue_with_dispo_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {toxidrome,exposure,antidotes,labs,elimination,monitoring};}
module.exports={funcs,CITATIONS,ValidationError};