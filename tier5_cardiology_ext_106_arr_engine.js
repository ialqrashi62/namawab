// filepath: tier5_cardiology_ext_106_arr_engine.js
// TIER5_CARDIOLOGY_EXT-106: Arrhythmias
'use strict';
const CITATIONS = ['ACC_AHA_AF_2023','ESC_AF_2020','SVT_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function afib(req){
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureBool(req.irregular, 'irregular');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureNumber(req.cha2ds2_vasc, 'cha2ds2_vasc');
  ensureNumber(req.has_bled, 'has_bled');
  ensureBool(req.anticoagulation_initiated, 'anticoagulation_initiated');
  let plan;
  if(req.symptomatic && req.heart_rate>150) plan='continue_with_urgent_then_reassess';
  else if(req.cha2ds2_vasc>=2 && req.anticoagulation_initiated===false) plan='continue_with_anticoagulate_then_reassess';
  else if(req.heart_rate>110) plan='continue_with_rate_control_then_reassess';
  else if(req.symptomatic) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function aflutter(req){
  ensureBool(req.cavotricuspid_dependent, 'cavotricuspid_dependent');
  ensureBool(req.left_atrial, 'left_atrial');
  ensureBool(req.ablation_planned, 'ablation_planned');
  ensureBool(req.anticoagulated, 'anticoagulated');
  ensureBool(req.rate_controlled, 'rate_controlled');
  let plan;
  if(req.cavotricuspid_dependent && req.ablation_planned===false) plan='continue_with_ablation_then_reassess';
  else if(req.left_atrial && req.ablation_planned===false) plan='continue_with_ablation_then_reassess';
  else if(req.anticoagulated===false) plan='continue_with_anticoagulate_then_reassess';
  else if(req.rate_controlled===false) plan='continue_with_rate_control_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function svt(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['avnrt','avrt','atrial','junctional','inappropriate_sinus','automatic','reentrant']);
  ensureBool(req.hemodynamic_stable, 'hemodynamic_stable');
  ensureBool(req.vagal_maneuver_tried, 'vagal_maneuver_tried');
  ensureBool(req.adenosine_given, 'adenosine_given');
  ensureBool(req.ablation_planned, 'ablation_planned');
  let plan;
  if(req.hemodynamic_stable===false) plan='continue_with_cardiovert_then_reassess';
  else if(req.vagal_maneuver_tried===false) plan='continue_with_vagal_then_reassess';
  else if(req.adenosine_given===false) plan='continue_with_adenosine_then_reassess';
  else if(req.ablation_planned===false) plan='continue_with_ablation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vt(req){
  ensureBool(req.vt_known, 'vt_known');
  ensureBool(req.stable, 'stable');
  ensureBool(req.shock_able, 'shock_able');
  ensureBool(req.ablation_done, 'ablation_done');
  ensureBool(req.icd_placed, 'icd_placed');
  ensureBool(req.amiodarone_used, 'amiodarone_used');
  let plan;
  if(req.stable===false) plan='continue_with_cardiovert_then_reassess';
  else if(req.stable && req.amiodarone_used===false) plan='continue_with_amiodarone_then_reassess';
  else if(req.icd_placed===false) plan='continue_with_icd_then_reassess';
  else if(req.ablation_done===false) plan='continue_with_ablation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function brady(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['sinus','junctional','av_block_1','av_block_2_mob1','av_block_2_mob2','av_block_3','pacer_failure','medication_induced']);
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.atropine_given, 'atropine_given');
  ensureBool(req.pacing_needed, 'pacing_needed');
  ensureBool(req.medications_reversed, 'medications_reversed');
  let plan;
  if(req.symptomatic && req.pacing_needed) plan='continue_with_pace_then_reassess';
  else if(req.type==='av_block_3') plan='continue_with_pace_then_reassess';
  else if(req.type==='av_block_2_mob2') plan='continue_with_pace_then_reassess';
  else if(req.medications_reversed===false && req.type==='medication_induced') plan='continue_with_reverse_then_reassess';
  else if(req.atropine_given===false) plan='continue_with_atropine_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ablation(req){
  ensureBool(req.ep_consulted, 'ep_consulted');
  ensureBool(req.pre_procedure_imaging, 'pre_procedure_imaging');
  ensureBool(req.anticoagulation_status, 'anticoagulation_status');
  ensureBool(req.consent_obtained, 'consent_obtained');
  ensureBool(req.success_outcome, 'success_outcome');
  let plan;
  if(req.ep_consulted===false) plan='continue_with_consult_then_reassess';
  else if(req.pre_procedure_imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.consent_obtained===false) plan='continue_with_consent_then_reassess';
  else if(req.anticoagulation_status===false) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {afib,aflutter,svt,vt,brady,ablation};}
module.exports={funcs,CITATIONS,ValidationError};
