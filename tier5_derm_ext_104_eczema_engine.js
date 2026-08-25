// filepath: tier5_derm_ext_104_eczema_engine.js
// TIER5_DERM_EXT-104: Eczema & dermatitis
'use strict';
const CITATIONS = ['AAD_Eczema_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function classify(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['atopic','contact','seborrheic','dyshidrotic','stasis','lichen_simplex','nummular','none','other']);
  ensureNumber(req.bsa, 'bsa');
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','very_severe','none']);
  ensureBool(req.skin_type, 'skin_type');
  let plan;
  if(req.severity==='severe' || req.severity==='very_severe') plan='continue_with_systemic_then_reassess';
  else if(req.bsa>=30) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function topicals(req){
  ensureBool(req.moisturizer, 'moisturizer');
  ensureBool(req.cream, 'cream');
  ensureBool(req.steroid, 'steroid');
  ensureBool(req.tci, 'tci');
  ensureBool(req.crisaborole, 'crisaborole');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.moisturizer===false) plan='continue_with_moist_then_reassess';
  else if(req.steroid===false && req.severity_moderate) plan='continue_with_steroid_then_reassess';
  else if(req.responded===false) plan='continue_with_up_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function systemic(req){
  ensureBool(req.phototherapy, 'phototherapy');
  ensureBool(req.methotrexate, 'methotrexate');
  ensureBool(req.cyclosporine, 'cyclosporine');
  ensureBool(req.azathioprine, 'azathioprine');
  ensureBool(req.dupilumab, 'dupilumab');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.dupilumab===false && req.severe) plan='continue_with_dupil_then_reassess';
  else if(req.responded===false) plan='continue_with_switch_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function triggers(req){
  ensureBool(req.identified, 'identified');
  ensureBool(req.allergen_test, 'allergen_test');
  ensureBool(req.avoidance, 'avoidance');
  ensureBool(req.documented, 'documented');
  ensureBool(req.diary, 'diary');
  let plan;
  if(req.identified===false && req.allergen_test===false) plan='continue_with_test_then_reassess';
  else if(req.avoidance===false) plan='continue_with_avoidance_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function infection(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['bacterial','viral','fungal','eczema_herpeticum','staph','none','other']);
  ensureBool(req.culture, 'culture');
  ensureBool(req.antibiotics, 'antibiotics');
  ensureBool(req.hospitalized, 'hospitalized');
  ensureBool(req.improvement, 'improvement');
  let plan;
  if(req.type==='eczema_herpeticum' && req.hospitalized===false) plan='continue_with_admit_then_reassess';
  else if(req.culture===false && req.type!=='viral') plan='continue_with_culture_then_reassess';
  else if(req.antibiotics===false && req.type==='bacterial') plan='continue_with_abx_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function peds(req){
  ensureNumber(req.age_months, 'age_months');
  ensureBool(req.food_allergy, 'food_allergy');
  ensureBool(req.elimination, 'elimination');
  ensureBool(req.counseling, 'counseling');
  ensureBool(req.caregiver_burden, 'caregiver_burden');
  ensureBool(req.sleep, 'sleep');
  let plan;
  if(req.food_allergy && req.elimination===false) plan='continue_with_elim_then_reassess';
  else if(req.caregiver_burden) plan='continue_with_support_then_reassess';
  else if(req.sleep===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {classify,topicals,systemic,triggers,infection,peds};}
module.exports={funcs,CITATIONS,ValidationError};