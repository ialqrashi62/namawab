// filepath: tier5_telehealth_ext_104_remote_engine.js
// TIER5_TELEHEALTH_EXT-104: Remote monitoring
'use strict';
const CITATIONS = ['RPM_2020','Telehealth_RPM_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function enrollment(req){
  ensureStr(req.program, 'program');
  ensureEnum(req.program, 'program', ['heart_failure','copd','diabetes','hypertension','post_stroke','post_mi','ckd','obesity','geriatric','general','none']);
  ensureBool(req.device_provided, 'device_provided');
  ensureBool(req.training_completed, 'training_completed');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.data_transmission_working, 'data_transmission_working');
  let plan;
  if(req.device_provided===false) plan='continue_with_provide_then_reassess';
  else if(req.training_completed===false) plan='continue_with_train_then_reassess';
  else if(req.consent_signed===false) plan='continue_with_consent_then_reassess';
  else if(req.data_transmission_working===false) plan='continue_with_verify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function data(req){
  ensureNumber(req.readings_per_day, 'readings_per_day');
  ensureBool(req.adherence_adequate, 'adherence_adequate');
  ensureBool(req.anomalies_detected, 'anomalies_detected');
  ensureBool(req.trend_analysis, 'trend_analysis');
  ensureBool(req.threshold_breached, 'threshold_breached');
  let plan;
  if(req.threshold_breached) plan='continue_with_alert_then_reassess';
  else if(req.adherence_adequate===false) plan='continue_with_remind_then_reassess';
  else if(req.anomalies_detected) plan='continue_with_review_then_reassess';
  else if(req.trend_analysis===false) plan='continue_with_analyze_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function alerts(req){
  ensureStr(req.alert_type, 'alert_type');
  ensureEnum(req.alert_type, 'alert_type', ['critical','warning','info','trend','adherence','device_malfunction','missed_reading','none']);
  ensureBool(req.patient_notified, 'patient_notified');
  ensureBool(req.clinician_notified, 'clinician_notified');
  ensureBool(req.action_taken, 'action_taken');
  ensureBool(req.alert_resolved, 'alert_resolved');
  let plan;
  if(req.alert_type==='critical' && req.clinician_notified===false) plan='continue_with_notify_then_reassess';
  else if(req.action_taken===false) plan='continue_with_action_then_reassess';
  else if(req.alert_resolved===false) plan='continue_with_followup_then_reassess';
  else if(req.patient_notified===false) plan='continue_with_notify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function devices(req){
  ensureBool(req.device_firmware_current, 'device_firmware_current');
  ensureBool(req.battery_adequate, 'battery_adequate');
  ensureBool(req.connectivity_stable, 'connectivity_stable');
  ensureBool(req.calibration_current, 'calibration_current');
  ensureBool(req.spare_available, 'spare_available');
  let plan;
  if(req.device_firmware_current===false) plan='continue_with_update_then_reassess';
  else if(req.battery_adequate===false) plan='continue_with_replace_then_reassess';
  else if(req.connectivity_stable===false) plan='continue_with_troubleshoot_then_reassess';
  else if(req.calibration_current===false) plan='continue_with_calibrate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.self_measurement, 'self_measurement');
  ensureBool(req.knows_normal_values, 'knows_normal_values');
  ensureBool(req.knows_when_to_alert, 'knows_when_to_alert');
  ensureBool(req.troubleshooting_taught, 'troubleshooting_taught');
  ensureBool(req.caregiver_trained, 'caregiver_trained');
  let plan;
  if(req.self_measurement===false) plan='continue_with_teach_then_reassess';
  else if(req.knows_normal_values===false) plan='continue_with_teach_then_reassess';
  else if(req.knows_when_to_alert===false) plan='continue_with_teach_then_reassess';
  else if(req.troubleshooting_taught===false) plan='continue_with_teach_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function outcomes(req){
  ensureBool(req.hospitalization_reduced, 'hospitalization_reduced');
  ensureBool(req.er_visit_reduced, 'er_visit_reduced');
  ensureBool(req.medication_adherence, 'medication_adherence');
  ensureBool(req.qol_improved, 'qol_improved');
  ensureBool(req.satisfaction, 'satisfaction');
  let plan;
  if(req.hospitalization_reduced===false) plan='continue_with_reassess_then_reassess';
  else if(req.medication_adherence===false) plan='continue_with_address_then_reassess';
  else if(req.qol_improved===false) plan='continue_with_address_then_reassess';
  else if(req.satisfaction===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {enrollment,data,alerts,devices,education,outcomes};}
module.exports={funcs,CITATIONS,ValidationError};
