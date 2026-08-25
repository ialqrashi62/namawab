// filepath: tier5_prehospital_ext_103_trauma_engine.js
// TIER5_PREHOSPITAL_EXT-103: Trauma triage
'use strict';
const CITATIONS = ['PHTLS_2020','ATLS_2018','CDC_FieldTriage_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function mechanism(req){
  ensureStr(req.mechanism, 'mechanism');
  ensureEnum(req.mechanism, 'mechanism', ['mvc','motorcycle','pedestrian','fall','penetrating','crush','burn','blast','stabbing','gsw','fall_height','other']);
  ensureNumber(req.delta_v, 'delta_v');
  ensureBool(req.ejection, 'ejection');
  ensureBool(req.rollover, 'rollover');
  ensureNumber(req.fall_height_ft, 'fall_height_ft');
  ensureBool(req.co_occupant_died, 'co_occupant_died');
  let plan;
  if(req.mechanism==='gsw' || req.mechanism==='stabbing') plan='continue_with_trauma_center_then_reassess';
  else if(req.ejection) plan='continue_with_trauma_center_then_reassess';
  else if(req.fall_height_ft>=20) plan='continue_with_trauma_center_then_reassess';
  else if(req.co_occupant_died) plan='continue_with_trauma_center_then_reassess';
  else if(req.delta_v>=40) plan='continue_with_trauma_center_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anatomy(req){
  ensureBool(req.penetrating_trauma, 'penetrating_trauma');
  ensureBool(req.head_trauma, 'head_trauma');
  ensureBool(req.chest_trauma, 'chest_trauma');
  ensureBool(req.abdominal_trauma, 'abdominal_trauma');
  ensureBool(req.pelvic_trauma, 'pelvic_trauma');
  ensureBool(req.flail_chest, 'flail_chest');
  ensureBool(req.amputation, 'amputation');
  let plan;
  if(req.penetrating_trauma) plan='continue_with_trauma_center_then_reassess';
  else if(req.amputation) plan='continue_with_trauma_center_then_reassess';
  else if(req.flail_chest) plan='continue_with_trauma_center_then_reassess';
  else if(req.pelvic_trauma) plan='continue_with_trauma_center_then_reassess';
  else if(req.head_trauma) plan='continue_with_trauma_center_then_reassess';
  else plan='continue_with_review_then_reassess';
  return {plan};
}
function vitals_cdc(req){
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.gcs_total, 'gcs_total');
  ensureBool(req.needs_trauma_center, 'needs_trauma_center');
  let plan;
  if(req.systolic_bp<90) plan='continue_with_trauma_center_then_reassess';
  else if(req.heart_rate>120) plan='continue_with_trauma_center_then_reassess';
  else if(req.respiratory_rate<10 || req.respiratory_rate>29) plan='continue_with_trauma_center_then_reassess';
  else if(req.gcs_total<14) plan='continue_with_trauma_center_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function special(req){
  ensureBool(req.elderly, 'elderly');
  ensureBool(req.children, 'children');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.bleeding_disorder, 'bleeding_disorder');
  ensureBool(req.anticoagulant, 'anticoagulant');
  ensureBool(req.comorbidities, 'comorbidities');
  let plan;
  if(req.elderly && req.bleeding_disorder) plan='continue_with_trauma_center_then_reassess';
  else if(req.anticoagulant) plan='continue_with_trauma_center_then_reassess';
  else if(req.children) plan='continue_with_pediatric_tc_then_reassess';
  else if(req.pregnant) plan='continue_with_ob_tc_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stop(req){
  ensureBool(req.bleeding_controlled, 'bleeding_controlled');
  ensureBool(req.tourniquet, 'tourniquet');
  ensureBool(req.chest_seal, 'chest_seal');
  ensureBool(req.aortic_occlusion, 'aortic_occlusion');
  ensureBool(req.dressing_done, 'dressing_done');
  let plan;
  if(req.bleeding_controlled===false) plan='continue_with_tourniquet_then_reassess';
  else if(req.tourniquet===false) plan='continue_with_tourniquet_then_reassess';
  else if(req.chest_seal===false) plan='continue_with_seal_then_reassess';
  else if(req.dressing_done===false) plan='continue_with_dress_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function destination(req){
  ensureBool(req.trauma_center_available, 'trauma_center_available');
  ensureNumber(req.distance_trauma, 'distance_trauma');
  ensureNumber(req.distance_local, 'distance_local');
  ensureBool(req.air_transport, 'air_transport');
  ensureBool(req.bypass_appropriate, 'bypass_appropriate');
  let plan;
  if(req.bypass_appropriate && req.trauma_center_available) plan='continue_with_bypass_then_reassess';
  else if(req.air_transport) plan='continue_with_air_then_reassess';
  else if(req.distance_trauma-req.distance_local>30) plan='continue_with_local_then_reassess';
  else if(req.trauma_center_available) plan='continue_with_trauma_then_reassess';
  else plan='continue_with_local_then_reassess';
  return {plan};
}
function funcs(){return {mechanism,anatomy,vitals_cdc,special,stop,destination};}
module.exports={funcs,CITATIONS,ValidationError};
