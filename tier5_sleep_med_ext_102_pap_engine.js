// filepath: tier5_sleep_med_ext_102_pap_engine.js
// TIER5_SLEEP_MED_EXT-102: PAP (Positive Airway Pressure) therapies
'use strict';
const CITATIONS = ['AASM_PAP_2019','ERS_PAP_2011'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function init(req){
  ensureStr(req.pap_type, 'pap_type');
  ensureEnum(req.pap_type, 'pap_type', ['cpap','bilevel','auto_cpap','auto_bilevel','asv','avaps']);
  ensureNumber(req.pressure_cm_h2o, 'pressure_cm_h2o');
  ensureNumber(req.epap_cm_h2o, 'epap_cm_h2o');
  ensureNumber(req.ipap_cm_h2o, 'ipap_cm_h2o');
  ensureBool(req.mask_fit_confirmed, 'mask_fit_confirmed');
  ensureBool(req.education_provided, 'education_provided');
  let plan;
  if(req.mask_fit_confirmed===false) plan='continue_with_mask_refit_then_reassess';
  else if(req.education_provided===false) plan='continue_with_education_then_reassess';
  else if(req.pap_type==='asv' && req.pressure_cm_h2o>15) plan='continue_with_review_then_reassess';
  else plan='continue_with_download_then_reassess';
  return {plan};
}
function adherence(req){
  ensureNumber(req.days_used, 'days_used');
  ensureNumber(req.days_measured, 'days_measured');
  ensureNumber(req.avg_hours_per_night, 'avg_hours_per_night');
  ensureBool(req.compliance_met, 'compliance_met');
  ensureBool(req.barriers_identified, 'barriers_identified');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.compliance_met===false) plan='continue_with_intervention_then_reassess';
  else if(req.avg_hours_per_night<4) plan='continue_with_adherence_then_reassess';
  else if(req.barriers_identified) plan='continue_with_resolve_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function troubleshooting(req){
  ensureStr(req.issue, 'issue');
  ensureEnum(req.issue, 'issue', ['mask_leak','dry_mouth','nasal_congestion','aerophagia','claustrophobia','skin_irritation','noisy','pressure_intolerance','rainout','rain_out_noise']);
  ensureBool(req.mask_refit_attempted, 'mask_refit_attempted');
  ensureBool(req.humidifier_added, 'humidifier_added');
  ensureBool(req.ramp_used, 'ramp_used');
  let plan;
  if(req.issue==='mask_leak' && req.mask_refit_attempted===false) plan='continue_with_refit_then_reassess';
  else if(req.issue==='dry_mouth' && req.humidifier_added===false) plan='continue_with_humidifier_then_reassess';
  else if(req.issue==='pressure_intolerance' && req.ramp_used===false) plan='continue_with_ramp_then_reassess';
  else if(req.issue==='claustrophobia') plan='continue_with_alternative_mask_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function efficacy(req){
  ensureNumber(req.ahi_on_pap, 'ahi_on_pap');
  ensureNumber(req.ahi_baseline, 'ahi_baseline');
  ensureNumber(req.epworth_on_pap, 'epworth_on_pap');
  ensureBool(req.residual_events_addressed, 'residual_events_addressed');
  ensureBool(req.titration_optimized, 'titration_optimized');
  let plan;
  if(req.ahi_on_pap>=10) plan='continue_with_optimize_then_reassess';
  else if(req.ahi_on_pap-req.ahi_baseline<-30) plan='continue_with_observation_then_reassess';
  else if(req.residual_events_addressed===false) plan='continue_with_review_then_reassess';
  else if(req.titration_optimized===false) plan='continue_with_titration_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function alternatives(req){
  ensureStr(req.clinical_scenario, 'clinical_scenario');
  ensureEnum(req.clinical_scenario, 'clinical_scenario', ['pap_failure','pes','central_apnea','position_dependent','non_adherent','claustrophobic','anatomic_obstruction','high_pressure_needed']);
  ensureBool(req.mad_tried, 'mad_tried');
  ensureBool(req.position_therapy, 'position_therapy');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.surgery_consulted, 'surgery_consulted');
  let plan;
  if(req.clinical_scenario==='pes' && req.surgery_consulted===false) plan='continue_with_ent_then_reassess';
  else if(req.clinical_scenario==='pap_failure' && req.mad_tried===false) plan='continue_with_mad_then_reassess';
  else if(req.clinical_scenario==='position_dependent' && req.position_therapy===false) plan='continue_with_position_therapy_then_reassess';
  else if(req.weight_loss===false && req.clinical_scenario==='non_adherent') plan='continue_with_weight_loss_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function download(req){
  ensureNumber(req.hours_per_night, 'hours_per_night');
  ensureNumber(req.ahi, 'ahi');
  ensureNumber(req.leak_l_min, 'leak_l_min');
  ensureNumber(req.percent_nights_used, 'percent_nights_used');
  ensureBool(req.clinically_reviewed, 'clinically_reviewed');
  ensureBool(req.action_plan_updated, 'action_plan_updated');
  let plan;
  if(req.hours_per_night<4) plan='continue_with_review_then_reassess';
  else if(req.ahi>=10) plan='continue_with_adjust_then_reassess';
  else if(req.leak_l_min>24) plan='continue_with_mask_review_then_reassess';
  else if(req.clinically_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {init,adherence,troubleshooting,efficacy,alternatives,download};}
module.exports={funcs,CITATIONS,ValidationError};
