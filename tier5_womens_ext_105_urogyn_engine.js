// filepath: tier5_womens_ext_105_urogyn_engine.js
// TIER5_WOMENS_EXT-105: Urogynecology (incontinence, prolapse, recurrent UTI, fistula)
'use strict';
const CITATIONS = ['AUGS_UI_2019','AUGS_POP_2019','ICS_Terminology_2023'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function stress_incontinence(req){
  ensureBool(req.cough_leakage, 'cough_leakage');
  ensureNumber(req.pad_weight_test_g, 'pad_weight_test_g');
  ensureNumber(req.vlpp, 'vlpp'); // Valsalva leak point pressure
  ensureBool(req.pelvic_floor_weakness, 'pelvic_floor_weakness');
  ensureBool(req.prior_surgery, 'prior_surgery');
  let plan;
  if(req.pelvic_floor_weakness && req.vlpp>90) plan='pt_then_reassess_with_pessary_consideration';
  else if(req.vlpp<60) plan='sling_then_refer_urogyn';
  else if(req.cough_leakage && req.pad_weight_test_g>=10) plan='consider_midurethral_sling_then_refer';
  else plan='continue_with_pelvic_floor_pt_with_3_month_reassessment';
  if(req.prior_surgery) plan='complex_then_refer_urogyn';
  return {plan};
}
function urge_incontinence(req){
  ensureNumber(req.urgency_episodes_per_day, 'urgency_episodes_per_day');
  ensureBool(req.nocturia_present, 'nocturia_present');
  ensureBool(req.fluid_intake_excessive, 'fluid_intake_excessive');
  ensureBool(req.uti_present, 'uti_present');
  ensureBool(req.conservative_tried, 'conservative_tried');
  let plan;
  if(req.uti_present) plan='treat_uti_first_then_reassess';
  else if(req.conservative_tried===false) plan='bladder_training_then_fluid_management_with_reassess';
  else if(req.urgency_episodes_per_day>=3) plan='antimuscarinic_or_beta3_agonist_then_reassess';
  else plan='continue_with_lifestyle_then_reassess';
  if(req.nocturia_present) plan+='_consider_desmopressin_evaluation';
  return {plan};
}
function prolapse(req){
  ensureNumber(req.stage, 'stage');
  ensureBool(req.bulge_symptomatic, 'bulge_symptomatic');
  ensureNumber(req.parity, 'parity');
  ensureBool(req.estrogen_status, 'estrogen_status');
  ensureBool(req.prior_prolapse_surgery, 'prior_prolapse_surgery');
  let plan;
  if(req.stage>=3 && req.bulge_symptomatic) plan='pessary_or_surgical_repair_then_refer_urogyn';
  else if(req.stage===2 && req.bulge_symptomatic) plan='pessary_then_pt_then_reassess';
  else if(req.stage===1) plan='continue_with_pt_then_pessary_if_progression';
  else plan='continue_with_observation';
  if(req.prior_prolapse_surgery) plan='recurrence_then_refer_urogyn';
  return {plan};
}
function recurrent_uti(req){
  ensureNumber(req.episodes_per_year, 'episodes_per_year');
  ensureBool(req.post_coital, 'post_coital');
  ensureBool(req.estrogen_deficiency, 'estrogen_deficiency');
  ensureBool(req.anatomic_abnormality, 'anatomic_abnormality');
  ensureBool(req.catheter_present, 'catheter_present');
  let plan;
  if(req.anatomic_abnormality) plan='imaging_then_refer_urogyn_with_surgical_correction';
  else if(req.post_coital && req.episodes_per_year>=3) plan='post_coital_antibiotic_prophylaxis';
  else if(req.estrogen_deficiency) plan='topical_estrogen_then_reassess';
  else if(req.catheter_present) plan='catheter_removal_then_culture';
  else plan='methenamine_or_cranberry_with_behavioral_modification';
  return {plan};
}
function fistula(req){
  ensureNumber(req.type, 'type'); // 1 vesicovaginal 2 ureterovaginal 3 rectovaginal 4 urethrovaginal
  ensureBool(req.continuous_leakage, 'continuous_leakage');
  ensureNumber(req.days_post_op_or_delivery, 'days_post_op_or_delivery');
  ensureBool(req.malignancy_related, 'malignancy_related');
  ensureBool(req.radiation_history, 'radiation_history');
  let plan;
  if(req.continuous_leakage && req.days_post_op_or_delivery<7) plan='catheter_drainage_then_reassess_in_6_weeks';
  else if(req.type===1) plan='vesicovaginal_then_repair_then_refer_urogyn';
  else if(req.malignancy_related || req.radiation_history) plan='complex_then_refer_urogyn_and_oncology';
  else plan='continue_with_imaging_then_refer_urogyn';
  return {plan};
}
function pessary(req){
  ensureNumber(req.stage, 'stage');
  ensureBool(req.sexually_active, 'sexually_active');
  ensureNumber(req.age, 'age');
  ensureBool(req.estrogen_use, 'estrogen_use');
  ensureBool(req.success_with_ring, 'success_with_ring');
  let plan;
  if(req.stage>=3 && req.success_with_ring) plan='continue_with_ring_then_reassess_every_3_months';
  else if(req.stage>=3 && req.estrogen_use===false) plan='initiate_topical_estrogen_then_reassess_fitting';
  else if(req.sexually_active) plan='ring_then_reassess_with_patient_preference';
  else plan='continue_with_observation_then_refer_if_discomfort';
  return {plan};
}
function funcs(){return {stress_incontinence,urge_incontinence,prolapse,recurrent_uti,fistula,pessary};}
module.exports={funcs,CITATIONS,ValidationError};
