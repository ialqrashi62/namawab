// filepath: tier5_nephrology_ext_103_aki_engine.js
// TIER5_NEPHROLOGY_EXT-103: AKI
'use strict';
const CITATIONS = ['KDIGO_AKI_2012'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function staging(req){
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.baseline_creatinine, 'baseline_creatinine');
  ensureNumber(req.urine_output_ml_kg_hr, 'urine_output_ml_kg_hr');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['risk','injury','failure','loss','esrd','stage_1','stage_2','stage_3']);
  ensureBool(req.contrast_exposure, 'contrast_exposure');
  let plan;
  if(req.creatinine>=4) plan='continue_with_dialysis_then_reassess';
  else if(req.urine_output_ml_kg_hr<0.3) plan='continue_with_urgent_then_reassess';
  else if(req.contrast_exposure) plan='continue_with_hydrate_then_reassess';
  else plan='continue_with_monitor_then_reassess';
  return {plan};
}
function etiology(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['prerenal','intrinsic_rhabdo','intrinsic_ati','intrinsic_glomerular','intrinsic_interstitial','postrenal','mixed','unknown']);
  ensureBool(req.ultrasound_done, 'ultrasound_done');
  ensureBool(req.fen_ratio, 'fen_ratio');
  ensureBool(req.workup_complete, 'workup_complete');
  let plan;
  if(req.type==='postrenal' && req.ultrasound_done===false) plan='continue_with_imaging_then_reassess';
  else if(req.workup_complete===false) plan='continue_with_workup_then_reassess';
  else if(req.type==='intrinsic_rhabdo') plan='continue_with_fluids_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fluids(req){
  ensureNumber(req.intake_ml, 'intake_ml');
  ensureNumber(req.output_ml, 'output_ml');
  ensureNumber(req.balance_24h, 'balance_24h');
  ensureBool(req.fluid_overload, 'fluid_overload');
  ensureBool(req.responsive, 'responsive');
  let plan;
  if(req.fluid_overload) plan='continue_with_diuresis_then_reassess';
  else if(req.responsive===false) plan='continue_with_rpt_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nephrotoxins(req){
  ensureBool(req.aminoglycoside, 'aminoglycoside');
  ensureBool(req.vancomycin, 'vancomycin');
  ensureBool(req.nsaid, 'nsaid');
  ensureBool(req.contrast, 'contrast');
  ensureBool(req.dose_adjusted, 'dose_adjusted');
  let plan;
  if(req.contrast) plan='continue_with_prophylaxis_then_reassess';
  else if(req.nsaid) plan='continue_with_discontinue_then_reassess';
  else if(req.aminoglycoside && req.dose_adjusted===false) plan='continue_with_dose_then_reassess';
  else if(req.vancomycin && req.dose_adjusted===false) plan='continue_with_trough_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rrt(req){
  ensureBool(req.urgent_indications, 'urgent_indications');
  ensureBool(req.refractory_acidosis, 'refractory_acidosis');
  ensureBool(req.refractory_hyperkalemia, 'refractory_hyperkalemia');
  ensureBool(req.fluid_overload_refractory, 'fluid_overload_refractory');
  ensureBool(req.uremic_complications, 'uremic_complications');
  let plan;
  if(req.urgent_indications) plan='continue_with_start_rrt_then_reassess';
  else if(req.uremic_complications) plan='continue_with_start_then_reassess';
  else if(req.refractory_hyperkalemia) plan='continue_with_start_then_reassess';
  else if(req.refractory_acidosis) plan='continue_with_start_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function recovery(req){
  ensureNumber(req.last_creatinine, 'last_creatinine');
  ensureBool(req.dialysis_dependent, 'dialysis_dependent');
  ensureBool(req.recovery_started, 'recovery_started');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.dialysis_dependent) plan='continue_with_continue_then_reassess';
  else if(req.recovery_started===false) plan='continue_with_review_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {staging,etiology,fluids,nephrotoxins,rrt,recovery};}
module.exports={funcs,CITATIONS,ValidationError};