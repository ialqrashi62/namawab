// filepath: tier5_cardiology_ext_101_ecg_engine.js
// TIER5_CARDIOLOGY_EXT-101: ECG interpretation
'use strict';
const CITATIONS = ['AHA_ECG_2018','ACC_ECG_2020','ESC_ECG_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function rhythm(req){
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureBool(req.regular, 'regular');
  ensureBool(req.p_wave, 'p_wave');
  ensureNumber(req.pr_interval, 'pr_interval');
  ensureBool(req.qrs_follows, 'qrs_follows');
  ensureBool(req.pvc_present, 'pvc_present');
  ensureBool(req.pac_present, 'pac_present');
  let plan;
  if(req.heart_rate<40) plan='continue_with_serious_brady_then_reassess';
  else if(req.heart_rate>150) plan='continue_with_serious_tachy_then_reassess';
  else if(req.pvc_present && req.regular===false) plan='continue_with_monitor_then_reassess';
  else if(req.pac_present) plan='continue_with_observation_then_reassess';
  else if(req.regular && req.p_wave && req.qrs_follows) plan='continue_with_observation_then_reassess';
  else plan='continue_with_review_then_reassess';
  return {plan};
}
function intervals(req){
  ensureNumber(req.pr_interval, 'pr_interval');
  ensureNumber(req.qrs_duration, 'qrs_duration');
  ensureNumber(req.qtc_interval, 'qtc_interval');
  ensureStr(req.rr_interval, 'rr_interval');
  ensureNumber(req.p_axis, 'p_axis');
  ensureNumber(req.qrs_axis, 'qrs_axis');
  ensureNumber(req.t_axis, 't_axis');
  let plan;
  if(req.pr_interval>=200) plan='continue_with_av_block_then_reassess';
  else if(req.qrs_duration>=120) plan='continue_with_bundle_branch_then_reassess';
  else if(req.qtc_interval>=500) plan='continue_with_prolonged_qt_then_reassess';
  else if(req.qtc_interval<350) plan='continue_with_short_qt_then_reassess';
  else if(req.qrs_axis<-30 || req.qrs_axis>120) plan='continue_with_axis_deviation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function st_changes(req){
  ensureStr(req.lead, 'lead');
  ensureEnum(req.lead, 'lead', ['i','ii','iii','avr','avl','avf','v1','v2','v3','v4','v5','v6']);
  ensureNumber(req.st_elevation_mm, 'st_elevation_mm');
  ensureNumber(req.st_depression_mm, 'st_depression_mm');
  ensureBool(req.t_inversion, 't_inversion');
  ensureBool(req.symmetrical_t, 'symmetrical_t');
  ensureBool(req.reciprocal_changes, 'reciprocal_changes');
  let plan;
  if(req.st_elevation_mm>=2 && req.reciprocal_changes) plan='continue_with_stemi_then_reassess';
  else if(req.st_depression_mm>=1) plan='continue_with_ischemia_then_reassess';
  else if(req.t_inversion && req.symmetrical_t) plan='continue_with_ischemia_then_reassess';
  else if(req.st_elevation_mm>=1) plan='continue_with_admit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function q_waves(req){
  ensureNumber(req.q_duration, 'q_duration');
  ensureNumber(req.q_depth, 'q_depth');
  ensureBool(req.pathological, 'pathological');
  ensureBool(req.reciprocal_q, 'reciprocal_q');
  ensureStr(req.leads_involved, 'leads_involved');
  ensureEnum(req.leads_involved, 'leads_involved', ['i','ii','iii','avr','avl','avf','v1','v2','v3','v4','v5','v6','anterior','inferior','lateral','septal','posterior','multiple','none']);
  let plan;
  if(req.pathological && req.reciprocal_q) plan='continue_with_old_mi_then_reassess';
  else if(req.pathological && req.q_duration>=0.04) plan='continue_with_old_mi_then_reassess';
  else if(req.q_depth>3) plan='continue_with_old_mi_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function axis(req){
  ensureNumber(req.p_axis, 'p_axis');
  ensureNumber(req.qrs_axis, 'qrs_axis');
  ensureNumber(req.t_axis, 't_axis');
  ensureBool(req.left_axia_dev, 'left_axia_dev');
  ensureBool(req.right_axis_dev, 'right_axis_dev');
  ensureBool(req.indeterminate, 'indeterminate');
  let plan;
  if(req.left_axia_dev) plan='continue_with_lad_then_reassess';
  else if(req.right_axis_dev) plan='continue_with_rvh_then_reassess';
  else if(req.indeterminate) plan='continue_with_review_then_reassess';
  else if(req.t_axis-req.qrs_axis>45) plan='continue_with_t_abnormality_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bbb(req){
  ensureBool(req.rabbit_ears, 'rabbit_ears');
  ensureBool(req.wide_qrs, 'wide_qrs');
  ensureStr(req.lead_with_pattern, 'lead_with_pattern');
  ensureEnum(req.lead_with_pattern, 'lead_with_pattern', ['i','ii','iii','avr','avl','avf','v1','v2','v3','v4','v5','v6','none']);
  ensureBool(req.lbbb_criteria, 'lbbb_criteria');
  ensureBool(req.rbbb_criteria, 'rbbb_criteria');
  ensureBool(req.fascicular_block, 'fascicular_block');
  let plan;
  if(req.lbbb_criteria) plan='continue_with_lbbb_then_reassess';
  else if(req.rbbb_criteria) plan='continue_with_rbbb_then_reassess';
  else if(req.fascicular_block) plan='continue_with_fascicular_then_reassess';
  else if(req.wide_qrs) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {rhythm,intervals,st_changes,q_waves,axis,bbb};}
module.exports={funcs,CITATIONS,ValidationError};
