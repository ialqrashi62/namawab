// filepath: tier5_nephrology_ext_104_gn_engine.js
// TIER5_NEPHROLOGY_EXT-104: Glomerulonephritis
'use strict';
const CITATIONS = ['KDIGO_GN_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function presentation(req){
  ensureStr(req.syndrome, 'syndrome');
  ensureEnum(req.syndrome, 'syndrome', ['nephritic','nephrotic','rapidly_progressive','asymptomatic_hematuria','asymptomatic_proteinuria','chronic_kidney_disease','mixed','other']);
  ensureBool(req.hematuria, 'hematuria');
  ensureBool(req.dysmorphic_rbc, 'dysmorphic_rbc');
  ensureBool(req.rbc_casts, 'rbc_casts');
  ensureNumber(req.proteinuria_24h, 'proteinuria_24h');
  let plan;
  if(req.syndrome==='rapidly_progressive') plan='continue_with_biopsy_then_reassess';
  else if(req.dysmorphic_rbc && req.rbc_casts) plan='continue_with_nephritic_then_reassess';
  else if(req.proteinuria_24h>3500) plan='continue_with_nephrotic_then_reassess';
  else plan='continue_with_workup_then_reassess';
  return {plan};
}
function biopsy(req){
  ensureBool(req.indication_clear, 'indication_clear');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.uncontrolled_htn, 'uncontrolled_htn');
  ensureBool(req.single_kidney, 'single_kidney');
  ensureBool(req.consent, 'consent');
  ensureBool(req.adequate_sample, 'adequate_sample');
  let plan;
  if(req.coagulopathy) plan='continue_with_correct_then_reassess';
  else if(req.uncontrolled_htn) plan='continue_with_control_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.adequate_sample===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function immunosuppression(req){
  ensureStr(req.induction, 'induction');
  ensureEnum(req.induction, 'induction', ['steroids','cyclophosphamide','mycophenolate','calcineurin_inhibitor','rituximab','azathioprine','none','combination']);
  ensureBool(req.dose_appropriate, 'dose_appropriate');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.side_effects, 'side_effects');
  ensureBool(req.prophylaxis, 'prophylaxis');
  let plan;
  if(req.side_effects) plan='continue_with_reduce_then_reassess';
  else if(req.monitoring===false) plan='continue_with_monitor_then_reassess';
  else if(req.dose_appropriate===false) plan='continue_with_dose_then_reassess';
  else if(req.prophylaxis===false) plan='continue_with_prophylaxis_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function supportive(req){
  ensureBool(req.raas_blockade, 'raas_blockade');
  ensureBool(req.diuretic, 'diuretic');
  ensureBool(req.anti_platelet, 'anti_platelet');
  ensureBool(req.anti_coag, 'anti_coag');
  ensureBool(req.lipid_control, 'lipid_control');
  ensureBool(req.bp_controlled, 'bp_controlled');
  let plan;
  if(req.bp_controlled===false) plan='continue_with_bp_then_reassess';
  else if(req.raas_blockade===false) plan='continue_with_raas_then_reassess';
  else if(req.lipid_control===false) plan='continue_with_statin_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.proteinuria, 'proteinuria');
  ensureBool(req.remission, 'remission');
  ensureBool(req.relapse, 'relapse');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.relapse) plan='continue_with_reinduction_then_reassess';
  else if(req.remission===false) plan='continue_with_review_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transplant(req){
  ensureBool(req.referred, 'referred');
  ensureBool(req.workup_complete, 'workup_complete');
  ensureBool(req.live_donor_evaluation, 'live_donor_evaluation');
  ensureBool(req.listed, 'listed');
  ensureBool(req.scheduled, 'scheduled');
  let plan;
  if(req.workup_complete===false) plan='continue_with_workup_then_reassess';
  else if(req.live_donor_evaluation===false && req.referred) plan='continue_with_donor_then_reassess';
  else if(req.listed===false) plan='continue_with_list_then_reassess';
  else if(req.scheduled===false) plan='continue_with_schedule_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {presentation,biopsy,immunosuppression,supportive,monitoring,transplant};}
module.exports={funcs,CITATIONS,ValidationError};