// filepath: tier5_derm_ext_101_gen_engine.js
// TIER5_DERM_EXT-101: General dermatology & lesions
'use strict';
const CITATIONS = ['AAD_General_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function lesion(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['nevus','seborrheic_keratosis','cyst','lipoma','wart','molluscum','keloid','dermatofibroma','actinic_keratosis','skin_tag','bcc','scc','melanoma','unknown','other']);
  ensureStr(req.abcde, 'abcde');
  ensureEnum(req.abcde, 'abcde', ['benign','atypical','suspicious','highly_suspicious','unknown']);
  ensureBool(req.biopsy_needed, 'biopsy_needed');
  ensureBool(req.patient_concern, 'patient_concern');
  let plan;
  if(req.abcde==='highly_suspicious') plan='continue_with_excision_then_reassess';
  else if(req.biopsy_needed && req.abcde==='suspicious') plan='continue_with_biopsy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rash(req){
  ensureStr(req.morphology, 'morphology');
  ensureEnum(req.morphology, 'morphology', ['macular','papular','vesicular','pustular','bullous','urticarial','desquamating','petechial','nodular','plaque','mixed','other','unknown']);
  ensureBool(req.distribution, 'distribution');
  ensureBool(req.acute, 'acute');
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.mucosal, 'mucosal');
  let plan;
  if(req.mucosal && req.acute) plan='continue_with_emergent_then_reassess';
  else if(req.systemic) plan='continue_with_review_then_reassess';
  else if(req.distribution===false) plan='continue_with_exam_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pruritus(req){
  ensureBool(req.generalized, 'generalized');
  ensureBool(req.localized, 'localized');
  ensureBool(req.night_bothers, 'night_bothers');
  ensureBool(req.skin_changes, 'skin_changes');
  ensureBool(req.workup, 'workup');
  ensureBool(req.treatment, 'treatment');
  let plan;
  if(req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.treatment===false) plan='continue_with_treat_then_reassess';
  else if(req.night_bothers) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function allergy(req){
  ensureBool(req.contact, 'contact');
  ensureBool(req.urticaria, 'urticaria');
  ensureBool(req.anaphylaxis, 'anaphylaxis');
  ensureBool(req.testing, 'testing');
  ensureBool(req.avoidance, 'avoidance');
  ensureBool(req.immunotherapy, 'immunotherapy');
  let plan;
  if(req.anaphylaxis) plan='continue_with_epi_then_reassess';
  else if(req.testing===false) plan='continue_with_test_then_reassess';
  else if(req.avoidance===false) plan='continue_with_avoidance_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function psoriasis(req){
  ensureNumber(req.bsa, 'bsa');
  ensureBool(req.severity, 'severity');
  ensureBool(req.topical, 'topical');
  ensureBool(req.phototherapy, 'phototherapy');
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.biological, 'biological');
  let plan;
  if(req.bsa>=10 && req.biological===false) plan='continue_with_bio_then_reassess';
  else if(req.bsa>=3 && req.phototherapy===false) plan='continue_with_ptx_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function autoimmune_blister(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['pemphigus','bullous_pem','pem','dherpet','linear_iga','porphyria','epidermolysis','other','unknown']);
  ensureBool(req.skin_biopsy, 'skin_biopsy');
  ensureBool(req.immunofluorescence, 'immunofluorescence');
  ensureBool(req.serology, 'serology');
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.steroid_started, 'steroid_started');
  let plan;
  if(req.skin_biopsy===false) plan='continue_with_biopsy_then_reassess';
  else if(req.immunofluorescence===false) plan='continue_with_dif_then_reassess';
  else if(req.steroid_started===false) plan='continue_with_steroid_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {lesion,rash,pruritus,allergy,psoriasis,autoimmune_blister};}
module.exports={funcs,CITATIONS,ValidationError};