// filepath: tier5_labauto_ext_101_pre_engine.js
// TIER5_LAB_AUTOMATION_EXT-101: Pre-analytical
'use strict';
const CITATIONS = ['CLSI_Pre_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function order(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['cbc','bmp','cmp','lipid','tsh','hba1c','coag','ua','cxr','ct','mri','echo','ekg','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.consent, 'consent');
  ensureBool(req.duplicates_checked, 'duplicates_checked');
  let plan;
  if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.duplicates_checked===false) plan='continue_with_check_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function specimen(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['serum','plasma','whole_blood','urine','csf','stool','sputum','tissue','swab','other']);
  ensureStr(req.tube, 'tube');
  ensureEnum(req.tube, 'tube', ['red','yellow','purple','green','blue','navy','gray','urine_cup','sterile_cup','plain','other','none']);
  ensureBool(req.labeled, 'labeled');
  ensureBool(req.adequate_volume, 'adequate_volume');
  ensureBool(req.hemolyzed, 'hemolyzed');
  ensureBool(req.lipemic, 'lipemic');
  let plan;
  if(req.labeled===false) plan='continue_with_relabel_then_reassess';
  else if(req.adequate_volume===false) plan='continue_with_redraw_then_reassess';
  else if(req.hemolyzed) plan='continue_with_redraw_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transport(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['room','refrigerated','frozen','protected_light','special','other']);
  ensureNumber(req.time_to_lab_minutes, 'time_to_lab_minutes');
  ensureBool(req.timely, 'timely');
  ensureBool(req.cold_chain, 'cold_chain');
  let plan;
  if(req.timely===false) plan='continue_with_redraw_then_reassess';
  else if(req.cold_chain===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function accession(req){
  ensureBool(req.received, 'received');
  ensureBool(req.centrifuged, 'centrifuged');
  ensureBool(req.aliquoted, 'aliquoted');
  ensureBool(req.stored, 'stored');
  ensureBool(req.critical_value_notified, 'critical_value_notified');
  let plan;
  if(req.received===false) plan='continue_with_track_then_reassess';
  else if(req.stored===false) plan='continue_with_store_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rejection(req){
  ensureStr(req.reason, 'reason');
  ensureEnum(req.reason, 'reason', ['hemolyzed','lipemic','icteric','insufficient_volume','mislabeled','unlabeled','broken','leaked','expired','wrong_tube','temperature_breach','other','none']);
  ensureBool(req.redrawn, 'redrawn');
  ensureBool(req.reordered, 'reordered');
  ensureBool(req.notified, 'notified');
  let plan;
  if(req.reason!=='none' && req.redrawn===false && req.reordered===false) plan='continue_with_rec_then_reassess';
  else if(req.notified===false) plan='continue_with_notify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tracking(req){
  ensureNumber(req.tat_minutes, 'tat_minutes');
  ensureBool(req.within_tat, 'within_tat');
  ensureBool(req.escalated, 'escalated');
  ensureBool(req.barcode, 'barcode');
  ensureBool(req.audit, 'audit');
  let plan;
  if(req.within_tat===false && req.escalated===false) plan='continue_with_escalate_then_reassess';
  else if(req.barcode===false) plan='continue_with_barcode_then_reassess';
  else if(req.audit===false) plan='continue_with_audit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {order,specimen,transport,accession,rejection,tracking};}
module.exports={funcs,CITATIONS,ValidationError};