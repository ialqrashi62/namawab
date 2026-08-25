// filepath: tier5_ger_ext_116_polypharm_engine.js
// TIER5_GER_EXT-116: Polypharmacy / Beers Criteria / Deprescribing
'use strict';
const CITATIONS = ['AGS_BEERS_2023','STOPP_START_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function brown_bag(req){
  ensureNumber(req.total_meds, 'total_meds');
  ensureNumber(req.prescribed, 'prescribed');
  ensureNumber(req.otc_supplements, 'otc_supplements');
  ensureBool(req.list_updated, 'list_updated');
  ensureBool(req.adherence_review, 'adherence_review');
  ensureBool(req.carrier_used, 'carrier_used');
  let plan;
  if(req.total_meds>=10) plan='continue_with_polypharm_review_then_reassess';
  else if(req.otc_supplements>=3) plan='continue_with_supplement_review_then_reassess';
  else plan='continue_with_maintain_then_reassess';
  return {plan};
}
function beers(req){
  ensureNumber(req.beers_count, 'beers_count');
  ensureBool(req.beers_high_risk, 'beers_high_risk');
  ensureEnum(req.category_high, 'category_high', ['anticholinergic','benzo','benzodiazepine','z_drug','opiate','antipsychotic','sulfonylurea','nsaid','none','other']);
  ensureBool(req.replacement_planned, 'replacement_planned');
  ensureBool(req.taper_planned, 'taper_planned');
  ensureBool(req.monitoring_planned, 'monitoring_planned');
  let plan;
  if(req.beers_high_risk===true && req.monitoring_planned===false) plan='continue_with_plan_then_reassess';
  else if(req.taper_planned===false) plan='continue_with_taper_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function deprescribing(req){
  ensureBool(req.indications_reviewed, 'indications_reviewed');
  ensureNumber(req.meds_to_deprescribe, 'meds_to_deprescribe');
  ensureBool(req.patient_consent, 'patient_consent');
  ensureEnum(req.taper_speed, 'taper_speed', ['rapid','slow','gradual','other','n_a']);
  ensureBool(req.withdrawal_monitored, 'withdrawal_monitored');
  ensureBool(req.rebound_monitored, 'rebound_monitored');
  let plan;
  if(req.indications_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.withdrawal_monitored===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function renal_dose(req){
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.crcl, 'crcl');
  ensureBool(req.dose_adjusted, 'dose_adjusted');
  ensureBool(req.contraindicated_med_reviewed, 'contraindicated_med_reviewed');
  ensureBool(req.labs_recheck, 'labs_recheck');
  ensureBool(req.contrast_averted, 'contrast_averted');
  let plan;
  if(req.egfr<30 && req.dose_adjusted===false) plan='continue_with_adjust_then_reassess';
  else if(req.contraindicated_med_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function adherence_tool(req){
  ensureEnum(req.tool, 'tool', ['pillbox','blister','mar_chart','caregiver','app','none','other']);
  ensureNumber(req.doses_per_day, 'doses_per_day');
  ensureBool(req.adherence_improved, 'adherence_improved');
  ensureBool(req.simplification_done, 'simplification_done');
  ensureBool(req.missed_doses_addressed, 'missed_doses_addressed');
  ensureBool(req.medication_review_trigger, 'medication_review_trigger');
  let plan;
  if(req.doses_per_day>=4 && req.simplification_done===false) plan='continue_with_combine_then_reassess';
  else if(req.tool==='none') plan='continue_with_tool_initiation_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function pharm_review_fu(req){
  ensureNumber(req.weeks_post_review, 'weeks_post_review');
  ensureNumber(req.meds_after, 'meds_after');
  ensureBool(req.adv_events_monitored, 'adv_events_monitored');
  ensureBool(req.taper_completed, 'taper_completed');
  ensureBool(req.new_problem_recognized, 'new_problem_recognized');
  ensureEnum(req.quality_score, 'quality_score', ['worsened','stable','improving','significant_improvement']);
  let plan;
  if(req.quality_score==='significant_improvement' || req.meds_after<5) plan='continue_with_continue_then_reassess';
  else if(req.taper_completed===false) plan='continue_with_continue_taper_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}

function funcs(){return {brown_bag,beers,deprescribing,renal_dose,adherence_tool,pharm_review_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
