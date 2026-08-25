// filepath: tier5_surg_spec_ext_106_pedsurg_engine.js
// TIER5_SURG_SPEC_EXT-106: Pediatric surgery (NEC, gastroschisis, hernia, appendectomy)
'use strict';
const CITATIONS = ['APSA_Peds_Surg_2019','PAPS_2020','JPS_Standards_2022'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function nec(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.bell_stage, 'bell_stage');
  ensureBool(req.pneumatosis_present, 'pneumatosis_present');
  ensureBool(req.pneumoperitoneum, 'pneumoperitoneum');
  ensureBool(req.thrombocytopenia, 'thrombocytopenia');
  ensureBool(req.metabolic_acidosis, 'metabolic_acidosis');
  let plan;
  if(req.pneumoperitoneum) plan='surgical_then_peritoneal_drain_with_resection';
  else if(req.bell_stage>=2) plan='medical_then_npo_with_antibiotics_evaluate_for_surgery';
  else if(req.bell_stage===1) plan='medical_then_npo_with_serial_abdominal_xr';
  else plan='continue_with_feeding_then_reassess';
  if(req.thrombocytopenia && req.metabolic_acidosis) plan+='_consider_surgical_consult';
  return {plan};
}
function gastroschisis(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.silo_placement_done, 'silo_placement_done');
  ensureNumber(req.days_of_life, 'days_of_life');
  ensureBool(req.associated_anomalies, 'associated_anomalies');
  ensureNumber(req.bowel_dilation_mm, 'bowel_dilation_mm');
  let plan;
  if(req.silo_placement_done===false && req.days_of_life<1) plan='urgent_then_silo_with_serial_reduction';
  else if(req.bowel_dilation_mm>=15) plan='continue_with_slow_reduction_then_surgical_closure';
  else if(req.associated_anomalies) plan='full_workup_then_surgical_consult';
  else plan='continue_with_primary_closure';
  if(req.gestational_age_weeks<34) plan+='_consider_delayed_closure';
  return {plan};
}
function hernia(req){
  ensureNumber(req.age_months, 'age_months');
  ensureStr(req.side, 'side');
  ensureEnum(req.side, 'side', ['right','left','bilateral','umbilical','epigastric','femoral']);
  ensureBool(req.incarcerated, 'incarcerated');
  ensureBool(req.reducible, 'reducible');
  ensureNumber(req.premature, 'premature'); // 0 term 1 preterm
  let plan;
  if(req.incarcerated && req.reducible===false) plan='urgent_then_surgical_exploration';
  else if(req.incarcerated) plan='emergent_reduction_then_surgical_repair_within_24_to_48_hours';
  else if(req.side==='inguinal' && req.premature===1) plan='referral_then_repair_before_discharge';
  else if(req.side==='inguinal') plan='continue_with_observation_then_referral_at_6_months';
  else if(req.side==='umbilical' && req.age_months>=24) plan='continue_then_repair_at_4_to_5_years';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function appendectomy(req){
  ensureNumber(req.alvarado_score, 'alvarado_score');
  ensureBool(req.us_performed, 'us_performed');
  ensureBool(req.ct_performed, 'ct_performed');
  ensureBool(req.perforation_signs, 'perforation_signs');
  ensureBool(req.laparoscopic_planned, 'laparoscopic_planned');
  ensureNumber(req.weight_kg, 'weight_kg');
  let plan;
  if(req.perforation_signs) plan='urgent_then_iv_antibiotics_with_surgical_consult';
  else if(req.alvarado_score>=7) plan='proceed_to_surgery_with_antibiotics';
  else if(req.alvarado_score>=5 && (req.us_performed || req.ct_performed)) plan='review_imaging_then_proceed_per_protocol';
  else plan='continue_with_observation_then_repeat_assessment';
  if(req.weight_kg<10) plan+='_consider_open_approach';
  if(req.laparoscopic_planned) plan+='_laparoscopic';
  return {plan};
}
function pyloric_stenosis(req){
  ensureNumber(req.age_weeks, 'age_weeks');
  ensureNumber(req.us_pyloric_thickness_mm, 'us_pyloric_thickness_mm');
  ensureNumber(req.us_pyloric_length_cm, 'us_pyloric_length_cm');
  ensureBool(req.projectile_vomiting, 'projectile_vomiting');
  ensureBool(req.oliguria, 'oliguria');
  ensureNumber(req.bicarbonate_mmol_l, 'bicarbonate_mmol_l');
  let plan;
  if(req.us_pyloric_thickness_mm>=4 && req.us_pyloric_length_cm>=1.6) plan='continue_with_iv_fluid_correction_then_pyloromyotomy';
  else if(req.projectile_vomiting===false) plan='continue_with_workup';
  else plan='continue_with_imaging_then_reassess';
  if(req.bicarbonate_mmol_l>=30) plan+='_correct_metabolic_alkalosis_first';
  if(req.oliguria) plan+='_bolus_iv_fluids';
  return {plan};
}
function cholangiopathy(req){
  ensureNumber(req.direct_bilirubin_mg_dl, 'direct_bilirubin_mg_dl');
  ensureBool(req.acholic_stool, 'acholic_stool');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.kasai_done, 'kasai_done');
  ensureNumber(req.weeks_post_kasai, 'weeks_post_kasai');
  ensureBool(req.synthetic_dysfunction, 'synthetic_dysfunction');
  let plan;
  if(req.acholic_stool && req.direct_bilirubin_mg_dl>=2) plan='urgent_then_refer_pediatric_surgery_for_kasai';
  else if(req.kasai_done && req.synthetic_dysfunction) plan='refer_for_transplant_evaluation';
  else if(req.kasai_done && req.weeks_post_kasai<4) plan='continue_with_postop_then_reassess_in_4_weeks';
  else plan='continue_with_workup_then_refer';
  return {plan};
}
function funcs(){return {nec,gastroschisis,hernia,appendectomy,pyloric_stenosis,cholangiopathy};}
module.exports={funcs,CITATIONS,ValidationError};
