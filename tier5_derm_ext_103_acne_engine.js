// filepath: tier5_derm_ext_103_acne_engine.js
// TIER5_DERM_EXT-103: Acne & rosacea
'use strict';
const CITATIONS = ['AAD_Acne_2016','AAD_Rosacea_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function classify(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['comedonal','papular','pustular','nodulocystic','conglobata','fulminans','none','other']);
  ensureBool(req.severity, 'severity');
  ensureNumber(req.count, 'count');
  ensureBool(req.scarring, 'scarring');
  ensureBool(req.face_trunk, 'face_trunk');
  let plan;
  if(req.scarring && req.type==='nodulocystic') plan='continue_with_isotretinoin_then_reassess';
  else if(req.type==='conglobata' || req.type==='fulminans') plan='continue_with_referral_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function topicals(req){
  ensureBool(req.retinoid, 'retinoid');
  ensureBool(req.benzoyl, 'benzoyl');
  ensureBool(req.antibiotic, 'antibiotic');
  ensureBool(req.salicylic, 'salicylic');
  ensureBool(req.combination, 'combination');
  ensureBool(req.irritation, 'irritation');
  let plan;
  if(req.combination===false) plan='continue_with_combination_then_reassess';
  else if(req.irritation) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function systemic(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['oral_antibiotic','hormonal','isotretinoin','spironolactone','none','other']);
  ensureBool(req.contraindicated, 'contraindicated');
  ensureBool(req.ipledge, 'ipledge');
  ensureBool(req.birth_control, 'birth_control');
  ensureBool(req.labs, 'labs');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.type==='isotretinoin' && req.ipledge===false) plan='continue_with_ipledge_then_reassess';
  else if(req.labs===false) plan='continue_with_labs_then_reassess';
  else if(req.contraindicated) plan='continue_with_review_then_reassess';
  else if(req.responded===false) plan='continue_with_switch_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function scarring(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['icepick','boxcar','rolling','hypertrophic','keloid','atrophic','none','other']);
  ensureBool(req.laser, 'laser');
  ensureBool(req.subcision, 'subcision');
  ensureBool(req.fillers, 'fillers');
  ensureBool(req.tca_cross, 'tca_cross');
  let plan;
  if(req.type==='icepick' && req.tca_cross===false) plan='continue_with_tca_then_reassess';
  else if(req.type==='rolling' && req.subcision===false) plan='continue_with_subcision_then_reassess';
  else if(req.type==='keloid' && req.laser===false) plan='continue_with_laser_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rosacea(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['erythematotelangiectatic','papulopustular','phymatous','ocular','none','other']);
  ensureBool(req.triggers_identified, 'triggers_identified');
  ensureBool(req.antibiotic, 'antibiotic');
  ensureBool(req.ivermectin, 'ivermectin');
  ensureBool(req.brimonidine, 'brimonidine');
  let plan;
  if(req.triggers_identified===false) plan='continue_with_review_then_reassess';
  else if(req.type==='papulopustular' && req.ivermectin===false) plan='continue_with_ivermectin_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureBool(req.improvement, 'improvement');
  ensureBool(req.adverse, 'adverse');
  ensureBool(req.adherent, 'adherent');
  ensureBool(req.mood, 'mood');
  ensureBool(req.photos, 'photos');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.adverse) plan='continue_with_review_then_reassess';
  else if(req.mood===false) plan='continue_with_assess_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {classify,topicals,systemic,scarring,rosacea,monitoring};}
module.exports={funcs,CITATIONS,ValidationError};