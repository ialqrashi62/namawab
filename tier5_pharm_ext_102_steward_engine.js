// filepath: tier5_pharm_ext_102_steward_engine.js
// TIER5_PHARMACOLOGY_EXT-102: Antimicrobial stewardship
'use strict';
const CITATIONS = ['IDSA_AMS_2016','CDC_Core_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.drug, 'drug');
  ensureStr(req.indication, 'indication');
  ensureBool(req.documented, 'documented');
  ensureBool(req.evidence_based, 'evidence_based');
  ensureBool(req.approved, 'approved');
  let plan;
  if(req.documented===false) plan='continue_with_document_then_reassess';
  else if(req.evidence_based===false) plan='continue_with_review_then_reassess';
  else if(req.approved===false) plan='continue_with_approval_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function culture(req){
  ensureBool(req.cultures_collected, 'cultures_collected');
  ensureBool(req.before_antibiotics, 'before_antibiotics');
  ensureBool(req.results_reviewed, 'results_reviewed');
  ensureBool(req.narrowed, 'narrowed');
  ensureBool(req.escalated, 'escalated');
  let plan;
  if(req.cultures_collected===false) plan='continue_with_cultures_then_reassess';
  else if(req.before_antibiotics===false) plan='continue_with_hold_then_reassess';
  else if(req.results_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.narrowed===false && req.results_reviewed) plan='continue_with_narrow_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dose_optimize(req){
  ensureNumber(req.daily_dose, 'daily_dose');
  ensureBool(req.dose_adjusted, 'dose_adjusted');
  ensureBool(req.renal_adjusted, 'renal_adjusted');
  ensureBool(req.level_drawn, 'level_drawn');
  ensureBool(req.level_in_range, 'level_in_range');
  let plan;
  if(req.renal_adjusted===false) plan='continue_with_renal_then_reassess';
  else if(req.level_drawn && req.level_in_range===false) plan='continue_with_adjust_then_reassess';
  else if(req.dose_adjusted===false) plan='continue_with_adjust_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function route_optimize(req){
  ensureStr(req.route, 'route');
  ensureEnum(req.route, 'route', ['iv','im','sc','po','pr','topical','inhaled','other']);
  ensureBool(req.switch_to_po, 'switch_to_po');
  ensureBool(req.tolerating_po, 'tolerating_po');
  ensureBool(req.eligible, 'eligible');
  let plan;
  if(req.route==='iv' && req.tolerating_po && req.eligible && req.switch_to_po===false) plan='continue_with_switch_then_reassess';
  else if(req.eligible===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function duration(req){
  ensureNumber(req.days, 'days');
  ensureBool(req.evidence_based_duration, 'evidence_based_duration');
  ensureBool(req.reviewed_daily, 'reviewed_daily');
  ensureBool(req.stop_planned, 'stop_planned');
  ensureBool(req.stopped, 'stopped');
  let plan;
  if(req.days>=7 && req.stopped===false) plan='continue_with_stop_then_reassess';
  else if(req.evidence_based_duration===false) plan='continue_with_review_then_reassess';
  else if(req.reviewed_daily===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function mdr(req){
  ensureBool(req.mdro, 'mdro');
  ensureStr(req.organism, 'organism');
  ensureBool(req.contact_precautions, 'contact_precautions');
  ensureBool(req.cohort, 'cohort');
  ensureBool(req.monitoring, 'monitoring');
  let plan;
  if(req.mdro && req.contact_precautions===false) plan='continue_with_isolate_then_reassess';
  else if(req.mdro && req.monitoring===false) plan='continue_with_culture_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,culture,dose_optimize,route_optimize,duration,mdr};}
module.exports={funcs,CITATIONS,ValidationError};