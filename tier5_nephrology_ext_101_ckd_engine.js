// filepath: tier5_nephrology_ext_101_ckd_engine.js
// TIER5_NEPHROLOGY_EXT-101: CKD staging & management
'use strict';
const CITATIONS = ['KDIGO_CKD_2012','KDIGO_2024'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function stage(req){
  ensureNumber(req.gfr, 'gfr');
  ensureBool(req.kidney_damage, 'kidney_damage');
  ensureNumber(req.albuminuria, 'albuminuria');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['g1','g2','g3a','g3b','g4','g5','g5d']);
  ensureBool(req.dialysis_initiated, 'dialysis_initiated');
  let plan;
  if(req.dialysis_initiated) plan='continue_with_dialysis_then_reassess';
  else if(req.gfr<15) plan='continue_with_prepare_then_reassess';
  else if(req.gfr<30) plan='continue_with_renal_clinic_then_reassess';
  else if(req.gfr<60) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function albuminuria(req){
  ensureNumber(req.alb_creat_ratio, 'alb_creat_ratio');
  ensureStr(req.category, 'category');
  ensureEnum(req.category, 'category', ['a1','a2','a3']);
  ensureBool(req.urine_collected, 'urine_collected');
  ensureBool(req.confirmed, 'confirmed');
  ensureBool(req.first_morning, 'first_morning');
  let plan;
  if(req.alb_creat_ratio>300) plan='continue_with_nephroprotection_then_reassess';
  else if(req.alb_creat_ratio>30) plan='continue_with_raas_then_reassess';
  else if(req.confirmed===false) plan='continue_with_repeat_then_reassess';
  else if(req.first_morning===false) plan='continue_with_first_morning_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function progression(req){
  ensureNumber(req.gfr_slope, 'gfr_slope');
  ensureNumber(req.baseline_gfr, 'baseline_gfr');
  ensureNumber(req.current_gfr, 'current_gfr');
  ensureBool(req.rapid_decline, 'rapid_decline');
  ensureBool(req.referral_needed, 'referral_needed');
  let plan;
  if(req.rapid_decline) plan='continue_with_urgent_referral_then_reassess';
  else if(req.gfr_slope<-5) plan='continue_with_referral_then_reassess';
  else if(req.referral_needed) plan='continue_with_referral_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bp(req){
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.dbp, 'dbp');
  ensureBool(req.ace_inhibitor, 'ace_inhibitor');
  ensureBool(req.ARB, 'ARB');
  ensureBool(req.diuretic, 'diuretic');
  ensureBool(req.target_met, 'target_met');
  let plan;
  if(req.sbp>=180 || req.dbp>=120) plan='continue_with_hypertensive_emergency_then_reassess';
  else if(req.target_met===false) plan='continue_with_titrate_then_reassess';
  else if(req.ace_inhibitor===false && req.ARB===false) plan='continue_with_raas_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function metabolic(req){
  ensureNumber(req.bicarb, 'bicarb');
  ensureNumber(req.potassium, 'potassium');
  ensureNumber(req.phosphate, 'phosphate');
  ensureNumber(req.pth, 'pth');
  ensureBool(req.alkali_therapy, 'alkali_therapy');
  ensureBool(req.phosphate_binder, 'phosphate_binder');
  let plan;
  if(req.potassium>=6) plan='continue_with_urgent_then_reassess';
  else if(req.potassium>=5) plan='continue_with_diet_then_reassess';
  else if(req.bicarb<22) plan='continue_with_alkali_then_reassess';
  else if(req.phosphate>1.5) plan='continue_with_binder_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anemia(req){
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.tsat, 'tsat');
  ensureBool(req.esa_initiated, 'esa_initiated');
  ensureBool(req.iron_repletion, 'iron_repletion');
  ensureBool(req.target_hgb_met, 'target_hgb_met');
  let plan;
  if(req.hgb<8) plan='continue_with_transfuse_then_reassess';
  else if(req.hgb<10) plan='continue_with_esa_then_reassess';
  else if(req.tsat<20) plan='continue_with_iron_then_reassess';
  else if(req.target_hgb_met===false) plan='continue_with_adjust_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {stage,albuminuria,progression,bp,metabolic,anemia};}
module.exports={funcs,CITATIONS,ValidationError};