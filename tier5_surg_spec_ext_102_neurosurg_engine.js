// filepath: tier5_surg_spec_ext_102_neurosurg_engine.js
// TIER5_SURG_SPEC_EXT-102: Neurosurgery (craniotomy, spine, tumor, vascular, trauma)
'use strict';
const CITATIONS = ['AANS_Craniotomy_2020','NASS_Spine_2021','AANS_Trauma_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function crainiotomy_indication(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['tumor_resection','evacuation_hematoma','vascular_clipping','abscess_drainage','biopsy','cyst_fenestration','endoscopic']);
  ensureNumber(req.gcs, 'gcs');
  ensureNumber(req.mass_effect_mm, 'mass_effect_mm');
  ensureNumber(req.midline_shift_mm, 'midline_shift_mm');
  ensureBool(req.symptomatic, 'symptomatic');
  let plan;
  if(req.indication==='evacuation_hematoma' && req.gcs<=8) plan='urgent_then_craniotomy_with_evacuation';
  else if(req.indication==='tumor_resection' && req.mass_effect_mm>=5) plan='continue_with_resection_with_neuro_navigation';
  else if(req.indication==='vascular_clipping') plan='continue_with_clipping_with_angiography';
  else plan='continue_with_planned_approach';
  if(req.midline_shift_mm>=5) plan+='_urgent_surgical_review';
  return {plan};
}
function spine_surgery(req){
  ensureStr(req.pathology, 'pathology');
  ensureEnum(req.pathology, 'pathology', ['disc_herniation','spinal_stenosis','spondylolisthesis','fracture','tumor','infection','deformity']);
  ensureNumber(req.levels_involved, 'levels_involved');
  ensureBool(req.myelopathy_signs, 'myelopathy_signs');
  ensureBool(req.cauda_equina_signs, 'cauda_equina_signs');
  ensureBool(req.conservative_failed, 'conservative_failed');
  let plan;
  if(req.cauda_equina_signs) plan='urgent_then_decompression_within_24_hours';
  else if(req.myelopathy_signs) plan='continue_with_surgical_decompression_with_refer';
  else if(req.conservative_failed===false) plan='continue_with_conservative_management_then_reassess';
  else if(req.pathology==='fracture') plan='continue_with_fracture_review_with_bracing_or_surgical_fixation';
  else plan='continue_with_decompression_with_fusion';
  return {plan};
}
function tumor_resection(req){
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['supratentorial_convexity','supratentorial_deep','supratentorial_skull_base','infratentorial','brainstem','spinal_intradural','spinal_extradural','pituitary']);
  ensureNumber(req.tumor_size_cm, 'tumor_size_cm');
  ensureNumber(req.kps, 'kps');
  ensureBool(req.eloquent_cortex, 'eloquent_cortex');
  ensureBool(req.symptoms_present, 'symptoms_present');
  let plan;
  if(req.kps>=80 && req.tumor_size_cm>=3) plan='continue_with_resection_with_neuro_navigation';
  else if(req.eloquent_cortex) plan='continue_with_awake_craniotomy_with_neuro_monitoring';
  else if(req.location==='pituitary') plan='continue_with_endoscopic_with_refer';
  else plan='continue_with_planned_approach';
  if(req.kps<70) plan+='_consider_palliative_approach';
  return {plan};
}
function vascular(req){
  ensureStr(req.pathology, 'pathology');
  ensureEnum(req.pathology, 'pathology', ['aneurysm','avm','moyamoya','cavernoma','dural_avf']);
  ensureNumber(req.size_mm, 'size_mm');
  ensureBool(req.recent_hemorrhage, 'recent_hemorrhage');
  ensureBool(req.eloquent_location, 'eloquent_location');
  ensureNumber(req.spetzler_martin, 'spetzler_martin');
  let plan;
  if(req.pathology==='aneurysm' && req.recent_hemorrhage) plan='urgent_then_clipping_or_coiling';
  else if(req.pathology==='avm' && req.spetzler_martin<=3) plan='continue_with_resection_with_angiography';
  else if(req.pathology==='avm' && req.spetzler_martin>=4) plan='continue_with_staged_embo_then_surgery';
  else if(req.pathology==='moyamoya') plan='continue_with_revascularization_with_bypass';
  else plan='continue_with_observation_with_review';
  return {plan};
}
function trauma(req){
  ensureNumber(req.gcs, 'gcs');
  ensureNumber(req.hematoma_size_mm, 'hematoma_size_mm');
  ensureNumber(req.midline_shift_mm, 'midline_shift_mm');
  ensureBool(req.pupils_reactive, 'pupils_reactive');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.evacuation_indicated, 'evacuation_indicated');
  let plan;
  if(req.gcs<=8 && req.midline_shift_mm>=5) plan='urgent_then_craniotomy_with_evacuation';
  else if(req.coagulopathy) plan='continue_with_factor_reversal_then_reassess';
  else if(req.evacuation_indicated===false) plan='continue_with_observation_with_serial_imaging';
  else plan='continue_with_planned_surgical_approach';
  return {plan};
}
function postop_neuro(req){
  ensureNumber(req.gcs, 'gcs');
  ensureNumber(req.pupil_reactivity, 'pupil_reactivity'); // 0 both 1 one 2 none
  ensureNumber(req.drain_output_ml_24h, 'drain_output_ml_24h');
  ensureBool(req.new_deficit, 'new_deficit');
  ensureBool(req.seizure, 'seizure');
  ensureNumber(req.sodium_mmol_l, 'sodium_mmol_l');
  let plan;
  if(req.new_deficit || req.seizure) plan='continue_with_imaging_then_reassess';
  else if(req.sodium_mmol_l<=135 || req.sodium_mmol_l>=150) plan='continue_with_sodium_management_then_reassess';
  else if(req.drain_output_ml_24h>=300) plan='continue_with_imaging_then_reassess_for_repeat';
  else plan='continue_with_standard_postop_protocol';
  return {plan};
}
function funcs(){return {crainiotomy_indication,spine_surgery,tumor_resection,vascular,trauma,postop_neuro};}
module.exports={funcs,CITATIONS,ValidationError};
