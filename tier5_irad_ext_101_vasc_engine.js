// filepath: tier5_irad_ext_101_vasc_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-101: Vascular IR
'use strict';
const CITATIONS = ['SIR_Vascular_2017','SVS_PAD_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pad(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['claudication','rest_pain','tissue_loss','acute_limb_ischemia','critical_limb_ischemia','other']);
  ensureNumber(req.abi, 'abi');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.revascularization_offered, 'revascularization_offered');
  let plan;
  if(req.stage==='acute_limb_ischemia') plan='continue_with_emergent_then_reassess';
  else if(req.stage==='critical_limb_ischemia') plan='continue_with_revasc_then_reassess';
  else if(req.abi<0.4) plan='continue_with_review_then_reassess';
  else if(req.imaging_done===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dvt(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['proximal','distal','upper_extremity','ivc_thrombus','chronic','none']);
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.anticoag, 'anticoag');
  ensureBool(req.filter, 'filter');
  ensureBool(req.lysis_needed, 'lysis_needed');
  let plan;
  if(req.bleeding && req.filter===false) plan='continue_with_filter_then_reassess';
  else if(req.type==='proximal' && req.anticoag===false) plan='continue_with_anticoag_then_reassess';
  else if(req.lysis_needed) plan='continue_with_cdt_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function angiogram(req){
  ensureStr(req.access, 'access');
  ensureEnum(req.access, 'access', ['femoral','radial','brachial','popliteal','pedal','other']);
  ensureBool(req.closure_device, 'closure_device');
  ensureBool(req.hemostasis, 'hemostasis');
  ensureBool(req.contrast_nephropathy, 'contrast_nephropathy');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.hemostasis===false) plan='continue_with_pressure_then_reassess';
  else if(req.contrast_nephropathy) plan='continue_with_hydrate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function angioplasty(req){
  ensureBool(req.balloon_used, 'balloon_used');
  ensureBool(req.stent_placed, 'stent_placed');
  ensureBool(req.success, 'success');
  ensureBool(req.dissection, 'dissection');
  ensureBool(req.flow_restored, 'flow_restored');
  let plan;
  if(req.success===false) plan='continue_with_repeat_then_reassess';
  else if(req.dissection) plan='continue_with_stent_then_reassess';
  else if(req.flow_restored===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function embolization(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['gi_bleed','hemoptysis','trauma','aneurysm','avm','tumor','postpartum','varicocele','other']);
  ensureStr(req.material, 'material');
  ensureEnum(req.material, 'material', ['coils','particles','glue','plug','gelfoam','other']);
  ensureBool(req.target_occlusion, 'target_occlusion');
  ensureBool(req.nontarget, 'nontarget');
  let plan;
  if(req.nontarget) plan='continue_with_review_then_reassess';
  else if(req.target_occlusion===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.access_site, 'access_site');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.thrombus, 'thrombus');
  ensureBool(req.contrast_allergy, 'contrast_allergy');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.thrombus) plan='continue_with_thrombolysis_then_reassess';
  else if(req.access_site && req.managed===false) plan='continue_with_repair_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_manage_then_reassess';
  else if(req.contrast_allergy) plan='continue_with_steroid_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pad,dvt,angiogram,angioplasty,embolization,complications};}
module.exports={funcs,CITATIONS,ValidationError};