// filepath: tier5_infusion_ext_106_specialty_engine.js
// TIER5_INFUSION_EXT-106: Specialty infusions (biologics, enzyme replacement, gene therapy)
'use strict';
const CITATIONS = ['FDA_Biologics_2020','ASGCT_Gene_2020','NORD_ERT_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function biologic(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['infliximab','rituximab','tocilizumab','vedolizumab','ustekinumab','secukinumab','dupilumab','omalizumab','benralizumab','mepolizumab','abatacept']);
  ensureNumber(req.infusion_number, 'infusion_number');
  ensureNumber(req.minutes_to_reaction, 'minutes_to_reaction');
  ensureBool(req.premed_given, 'premed_given');
  ensureBool(req.premed_effective, 'premed_effective');
  ensureBool(req.reaction_history, 'reaction_history');
  let plan;
  if(req.minutes_to_reaction<30 && req.reaction_history) plan='continue_with_slow_then_reassess';
  else if(req.premed_effective===false) plan='continue_with_re_evaluate_then_reassess';
  else if(req.reaction_history) plan='continue_with_consider_switch_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function infusion_reaction(req){
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','life_threatening_anaphylaxis']);
  ensureNumber(req.minutes_to_reaction, 'minutes_to_reaction');
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.urticaria, 'urticaria');
  ensureBool(req.family_history_atopy, 'family_history_atopy');
  let plan;
  if(req.severity==='life_threatening_anaphylaxis') plan='continue_with_urgent_epinephrine_then_reassess';
  else if(req.severity==='severe') plan='continue_with_iv_steroid_then_reassess';
  else if(req.severity==='moderate') plan='continue_with_slow_then_reassess';
  else plan='continue_with_monitoring_then_reassess';
  return {plan};
}
function desensitization(req){
  ensureBool(req.drug_allergy_documented, 'drug_allergy_documented');
  ensureBool(req.skin_test_positive, 'skin_test_positive');
  ensureBool(req.first_dose_tolerated, 'first_dose_tolerated');
  ensureBool(req.subsequent_dose_tolerated, 'subsequent_dose_tolerated');
  ensureNumber(req.protocol_steps, 'protocol_steps');
  ensureBool(req.observation_hours_done, 'observation_hours_done');
  let plan;
  if(req.drug_allergy_documented && req.skin_test_positive===false) plan='continue_with_protocol_then_reassess';
  else if(req.observation_hours_done===false) plan='continue_with_observation_then_reassess';
  else if(req.first_dose_tolerated===false) plan='continue_with_protocol_review_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function enzyme_replacement(req){
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['gaucher','fabry','pompe','mps_i','mps_ii','mps_vi','mps_vii']);
  ensureNumber(req.infusion_number, 'infusion_number');
  ensureBool(req.adverse_reaction, 'adverse_reaction');
  ensureNumber(req.days_since_last_dose, 'days_since_last_dose');
  ensureBool(req.tolerance_improving, 'tolerance_improving');
  let plan;
  if(req.adverse_reaction) plan='continue_with_premed_then_reassess';
  else if(req.days_since_last_dose>14) plan='continue_with_timing_review_then_reassess';
  else if(req.tolerance_improving===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function gene_therapy(req){
  ensureStr(req.product, 'product');
  ensureEnum(req.product, 'product', ['luspatercept','betibeglogene','onasemnogene','tisagenlecleucel','axicabtagene','brexucabtagene','idecabtagene','lisocabtagene','valoctocogene','etranacogene','voxelotor','casgevo']);
  ensureBool(req.premed_given, 'premed_given');
  ensureNumber(req.cytokine_release_score, 'cytokine_release_score');
  ensureBool(req.icu_consult_done, 'icu_consult_done');
  ensureBool(req.insurance_approved, 'insurance_approved');
  let plan;
  if(req.cytokine_release_score>=3) plan='continue_with_tocilizumab_then_reassess';
  else if(req.icu_consult_done===false) plan='continue_with_icu_consult_then_reassess';
  else if(req.insurance_approved===false) plan='continue_with_appeals_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function infusion_clinic_ops(req){
  ensureNumber(req.chairs_occupied, 'chairs_occupied');
  ensureNumber(req.chairs_total, 'chairs_total');
  ensureNumber(req.patients_scheduled_today, 'patients_scheduled_today');
  ensureNumber(req.staff_nurses_on_duty, 'staff_nurses_on_duty');
  ensureBool(req.pharmacy_just_in_time, 'pharmacy_just_in_time');
  ensureNumber(req.avg_wait_min, 'avg_wait_min');
  let plan;
  if(req.avg_wait_min>30) plan='continue_with_optimize_then_reassess';
  else if(req.chairs_occupied>=req.chairs_total) plan='continue_with_expand_then_reassess';
  else if(req.staff_nurses_on_duty<req.chairs_occupied/4) plan='continue_with_staff_up_then_reassess';
  else if(req.pharmacy_just_in_time===false) plan='continue_with_premix_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {biologic,infusion_reaction,desensitization,enzyme_replacement,gene_therapy,infusion_clinic_ops};}
module.exports={funcs,CITATIONS,ValidationError};
