// filepath: tier5_derm_ext_106_cosm_engine.js
// TIER5_DERM_EXT-106: Cosmetic dermatology
'use strict';
const CITATIONS = ['ASDS_Cosmetic_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function botox(req){
  ensureStr(req.area, 'area');
  ensureEnum(req.area, 'area', ['glabellar','crow','forehead','masseter','neck','hyperhidrosis','other']);
  ensureNumber(req.units, 'units');
  ensureBool(req.allergies_reviewed, 'allergies_reviewed');
  ensureBool(req.consent, 'consent');
  ensureBool(req.photograph, 'photograph');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.allergies_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.photograph===false) plan='continue_with_photo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fillers(req){
  ensureStr(req.product, 'product');
  ensureEnum(req.product, 'product', ['ha','ca_ha','pcl','plla','pmma','none','other']);
  ensureStr(req.area, 'area');
  ensureEnum(req.area, 'area', ['lip','cheek','nasolabial','tear_trough','chin','temple','jawline','other']);
  ensureBool(req.test_patch, 'test_patch');
  ensureBool(req.consent, 'consent');
  ensureBool(req.symmetrical, 'symmetrical');
  let plan;
  if(req.test_patch===false && req.area==='lip') plan='continue_with_test_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.symmetrical===false) plan='continue_with_balance_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function laser(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['ablative','non_ablative','fractional','ipl','pigment','hair','tattoo','none','other']);
  ensureBool(req.skin_type_assessed, 'skin_type_assessed');
  ensureBool(req.test_spot, 'test_spot');
  ensureBool(req.eye_protection, 'eye_protection');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.test_spot===false) plan='continue_with_test_then_reassess';
  else if(req.eye_protection===false) plan='continue_with_eye_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pe(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['glycolic','salicylic','tca','lactic','mandelic','retinol','none','other']);
  ensureBool(req.skin_type, 'skin_type');
  ensureBool(req.patch_test, 'patch_test');
  ensureBool(req.sunscreen, 'sunscreen');
  ensureBool(req.discomfort, 'discomfort');
  let plan;
  if(req.patch_test===false) plan='continue_with_test_then_reassess';
  else if(req.sunscreen===false) plan='continue_with_sunscreen_then_reassess';
  else if(req.discomfort===false) plan='continue_with_stop_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.bruising, 'bruising');
  ensureBool(req.swelling, 'swelling');
  ensureBool(req.asymmetry, 'asymmetry');
  ensureBool(req.vascular_occlusion, 'vascular_occlusion');
  ensureBool(req.skin_necrosis, 'skin_necrosis');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.vascular_occlusion) plan='continue_with_emergent_then_reassess';
  else if(req.skin_necrosis && req.managed===false) plan='continue_with_care_then_reassess';
  else if(req.asymmetry) plan='continue_with_balance_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.satisfaction, 'satisfaction');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  ensureBool(req.maintenance, 'maintenance');
  ensureBool(req.photos, 'photos');
  ensureBool(req.next_session, 'next_session');
  let plan;
  if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.satisfaction===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {botox,fillers,laser,pe,complications,followup};}
module.exports={funcs,CITATIONS,ValidationError};