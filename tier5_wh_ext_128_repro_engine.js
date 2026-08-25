// filepath: tier5_wh_ext_128_repro_engine.js
// TIER5_WH_EXT-128: Reproductive Endocrinology / IVF
'use strict';
const CITATIONS = ['ASRM_PB_2020','ESHRE_REI'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function infertility_workup(req){
  ensureNumber(req.cycle_length, 'cycle_length');
  ensureBool(req.ovulation_confirmed, 'ovulation_confirmed');
  ensureBool(req.semen_analysis, 'semen_analysis');
  ensureBool(req.tubal_patent, 'tubal_patent');
  ensureNumber(req.trial_months, 'trial_months');
  ensureEnum(req.cause_suspected, 'cause_suspected', ['anovulation','male_factor','tubal','endometriosis','uterine','unexplained','combined','unknown','other']);
  let plan;
  if(req.trial_months>=12 && req.ovulation_confirmed===true) plan='continue_with_specialist_then_reassess';
  else if(req.cause_suspected==='anovulation') plan='continue_with_ovulation_induction_then_reassess';
  else plan='continue_with_basic_workup_then_reassess';
  return {plan};
}
function ivf_cycle(req){
  ensureEnum(req.protocol, 'protocol', ['long','short','antagonist','mild','natural','other','unknown']);
  ensureNumber(req.eggs_retrieved, 'eggs_retrieved');
  ensureNumber(req.eggs_fertilized, 'eggs_fertilized');
  ensureNumber(req.days_stim, 'days_stim');
  ensureBool(req.ohss_monitored, 'ohss_monitored');
  ensureEnum(req.outcome, 'outcome', ['cleaved','blast','transfer','freeze','arrest','other','unknown']);
  let plan;
  if(req.ohss_monitored===false) plan='continue_with_ohss_then_reassess';
  else if(req.outcome==='arrest') plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function embryology(req){
  ensureNumber(req.day_3_count, 'day_3_count');
  ensureNumber(req.blastocyst_count, 'blastocyst_count');
  ensureEnum(req.grade, 'grade', ['good','fair','poor','mixed','unknown','other']);
  ensureEnum(req.plan, 'plan', ['transfer_d3','transfer_d5','freeze_all','discard','pgd_known','donate','other','unknown']);
  ensureBool(req.consent_for_freeze, 'consent_for_freeze');
  ensureBool(req.pgd_ordered, 'pgd_ordered');
  let plan;
  if(req.consent_for_freeze===false && req.plan==='freeze_all') plan='continue_with_consent_then_reassess';
  else if(req.pgd_ordered===true && req.plan!=='pgd_known') plan='continue_with_revise_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function transfer(req){
  ensureNumber(req.endometrial_thickness, 'endometrial_thickness');
  ensureEnum(req.transfer_type, 'transfer_type', ['fresh','frozen','donor','split','other','unknown']);
  ensureNumber(req.embryos_transferred, 'embryos_transferred');
  ensureEnum(req.quality, 'quality', ['top','good','fair','poor','mixed','unknown','other']);
  ensureBool(req.luteal_support, 'luteal_support');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.endometrial_thickness<7) plan='continue_with_thicken_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_transfer_then_reassess';
  return {plan};
}
function ivf_fu(req){
  ensureNumber(req.days_post_transfer, 'days_post_transfer');
  ensureNumber(req.beta_hcg, 'beta_hcg');
  ensureEnum(req.outcome, 'outcome', ['negative','biochemical','ectopic','singleton','twins','multiple','sab','tab','unknown','other']);
  ensureBool(req.preterm_risk_reviewed, 'preterm_risk_reviewed');
  ensureBool(req.psych_support_offered, 'psych_support_offered');
  ensureBool(req.continuity_planned, 'continuity_planned');
  let plan;
  if(req.outcome==='ectopic') plan='continue_with_emergent_then_reassess';
  else if(req.outcome==='negative' || req.outcome==='tab') plan='continue_with_counseling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function repro_fu(req){
  ensureNumber(req.cycles_attempted, 'cycles_attempted');
  ensureBool(req.counseling_done, 'counseling_done');
  ensureBool(req.financial_counseling, 'financial_counseling');
  ensureBool(req.options_explored, 'options_explored');
  ensureBool(req.alternatives_offered, 'alternatives_offered');
  ensureBool(req.shared_decision, 'shared_decision');
  let plan;
  if(req.shared_decision===false) plan='continue_with_sdm_then_reassess';
  else if(req.cycles_attempted>=3 && req.options_explored===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {infertility_workup,ivf_cycle,embryology,transfer,ivf_fu,repro_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
