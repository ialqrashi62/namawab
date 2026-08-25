// filepath: tier5_labauto_ext_102_chem_engine.js
// TIER5_LAB_AUTOMATION_EXT-102: Chemistry automation
'use strict';
const CITATIONS = ['CLSI_Chemistry_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function analyzer(req){
  ensureStr(req.analyzer, 'analyzer');
  ensureEnum(req.analyzer, 'analyzer', ['roche_cobas','abbott_architect','beckman_dx','siemens_atellica','olympus','horiba','other','unknown']);
  ensureNumber(req.throughput_per_hour, 'throughput_per_hour');
  ensureBool(req.calibrated, 'calibrated');
  ensureBool(req.qc_passed, 'qc_passed');
  let plan;
  if(req.calibrated===false) plan='continue_with_calibrate_then_reassess';
  else if(req.qc_passed===false) plan='continue_with_qc_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function qc(req){
  ensureBool(req.two_levels, 'two_levels');
  ensureNumber(req.sd_level1, 'sd_level1');
  ensureNumber(req.sd_level2, 'sd_level2');
  ensureBool(req.within_range, 'within_range');
  ensureBool(req.trend_reviewed, 'trend_reviewed');
  ensureBool(req.corrective, 'corrective');
  let plan;
  if(req.within_range===false && req.corrective===false) plan='continue_with_correct_then_reassess';
  else if(req.trend_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function calibration(req){
  ensureBool(req.calibrated, 'calibrated');
  ensureNumber(req.last_cal_days, 'last_cal_days');
  ensureBool(req.calibration_validators, 'calibration_validators');
  ensureBool(req.outcome_match, 'outcome_match');
  ensureBool(req.scheduled, 'scheduled');
  let plan;
  if(req.last_cal_days>90) plan='continue_with_recalibrate_then_reassess';
  else if(req.calibration_validators===false) plan='continue_with_run_then_reassess';
  else if(req.outcome_match===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function critical(req){
  ensureNumber(req.critical_value, 'critical_value');
  ensureBool(req.verified, 'verified');
  ensureBool(req.notified, 'notified');
  ensureBool(req.readback, 'readback');
  ensureNumber(req.time_to_notify, 'time_to_notify');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.notified===false) plan='continue_with_notify_then_reassess';
  else if(req.readback===false) plan='continue_with_readback_then_reassess';
  else if(req.time_to_notify>30) plan='continue_with_faster_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delta(req){
  ensureNumber(req.previous, 'previous');
  ensureNumber(req.current, 'current');
  ensureNumber(req.delta_pct, 'delta_pct');
  ensureBool(req.flag, 'flag');
  ensureBool(req.investigated, 'investigated');
  ensureBool(req.explained, 'explained');
  let plan;
  if(req.flag && req.investigated===false) plan='continue_with_investigate_then_reassess';
  else if(req.flag && req.explained===false) plan='continue_with_explain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reference(req){
  ensureNumber(req.low, 'low');
  ensureNumber(req.high, 'high');
  ensureBool(req.age_appropriate, 'age_appropriate');
  ensureBool(req.sex_appropriate, 'sex_appropriate');
  ensureBool(req.flag_outliers, 'flag_outliers');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.age_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.sex_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {analyzer,qc,calibration,critical,delta,reference};}
module.exports={funcs,CITATIONS,ValidationError};