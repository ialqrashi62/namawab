// filepath: tier5_infusion_ext_101_ivaccess_engine.js
// TIER5_INFUSION_EXT-101: IV access (PICC, midline, central, port)
'use strict';
const CITATIONS = ['INS_Standards_2021','AVA_Vascular_2019','CDC_BSI_2011'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function picc(req){
  ensureBool(req.therapy_long_term, 'therapy_long_term');
  ensureBool(req.vesicant, 'vesicant');
  ensureNumber(req.duration_days_expected, 'duration_days_expected');
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureBool(req.preferred_basilic_cephalic, 'preferred_basilic_cephalic');
  ensureBool(req.ultrasound_guided, 'ultrasound_guided');
  let plan;
  if(req.duration_days_expected<7) plan='continue_with_iv_then_reassess';
  else if(req.vesicant) plan='continue_with_picc_then_reassess';
  else if(req.coagulopathy) plan='continue_with_review_then_reassess';
  else if(req.ultrasound_guided===false) plan='continue_with_ultrasound_then_reassess';
  else plan='continue_with_picc_then_reassess';
  return {plan};
}
function midline(req){
  ensureNumber(req.duration_days_expected, 'duration_days_expected');
  ensureBool(req.therapy_irritant, 'therapy_irritant');
  ensureBool(req.vesicant, 'vesicant');
  ensureBool(req.thrombosis_history, 'thrombosis_history');
  ensureBool(req.ckd_dialysis, 'ckd_dialysis');
  ensureNumber(req.days_post_op_or_admission, 'days_post_op_or_admission');
  let plan;
  if(req.vesicant) plan='continue_with_central_then_reassess';
  else if(req.thrombosis_history) plan='continue_with_review_then_reassess';
  else if(req.ckd_dialysis) plan='continue_with_avoid_then_reassess';
  else if(req.duration_days_expected>30) plan='continue_with_picc_then_reassess';
  else plan='continue_with_midline_then_reassess';
  return {plan};
}
function central(req){
  ensureStr(req.urgency, 'urgency');
  ensureEnum(req.urgency, 'urgency', ['emergent','urgent','elective']);
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['internal_jugular','subclavian','femoral','external_jugular']);
  ensureBool(req.coagulopathy, 'coagulopathy');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureBool(req.ultrasound_guided, 'ultrasound_guided');
  let plan;
  if(req.urgency==='emergent') plan='continue_with_femoral_or_ij_then_reassess';
  else if(req.coagulopathy) plan='continue_with_subclavian_or_ij_then_reassess';
  else if(req.platelet_count<50) plan='continue_with_review_then_reassess';
  else if(req.ultrasound_guided===false) plan='continue_with_ultrasound_then_reassess';
  else plan='continue_with_standard_then_reassess';
  return {plan};
}
function port(req){
  ensureNumber(req.chemo_cycles_planned, 'chemo_cycles_planned');
  ensureBool(req.long_term_chemo, 'long_term_chemo');
  ensureBool(req.needle_aversion, 'needle_aversion');
  ensureBool(req.body_image_concern, 'body_image_concern');
  ensureBool(req.swimming_desired, 'swimming_desired');
  ensureBool(req.access_difficulty_history, 'access_difficulty_history');
  let plan;
  if(req.needle_aversion || req.body_image_concern) plan='continue_with_review_then_reassess';
  else if(req.swimming_desired) plan='continue_with_picc_then_reassess';
  else if(req.long_term_chemo || req.chemo_cycles_planned>=6) plan='continue_with_port_then_reassess';
  else if(req.access_difficulty_history) plan='continue_with_port_then_reassess';
  else plan='continue_with_picc_then_reassess';
  return {plan};
}
function complications(req){
  ensureStr(req.complication, 'complication');
  ensureEnum(req.complication, 'complication', ['phlebitis','infiltration','extravasation','occlusion','infection_catheter','thrombosis','pneumothorax','line_displacement','air_embolism']);
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','life_threatening']);
  ensureBool(req.vasoactive_drug_active, 'vasoactive_drug_active');
  ensureNumber(req.days_since_access, 'days_since_access');
  let plan;
  if(req.severity==='life_threatening') plan='continue_with_urgent_removal_then_reassess';
  else if(req.severity==='severe') plan='continue_with_removal_then_reassess';
  else if(req.vasoactive_drug_active) plan='continue_with_removal_then_reassess';
  else if(req.complication==='extravasation') plan='continue_with_urgent_then_reassess';
  else plan='continue_with_treatment_then_reassess';
  return {plan};
}
function maintenance(req){
  ensureNumber(req.days_since_access, 'days_since_access');
  ensureBool(req.dressing_change_due, 'dressing_change_due');
  ensureBool(req.cap_change_due, 'cap_change_due');
  ensureBool(req.tubing_change_due, 'tubing_change_due');
  ensureBool(req.flushing_documented, 'flushing_documented');
  ensureBool(req.signs_of_infection, 'signs_of_infection');
  let plan;
  if(req.signs_of_infection) plan='continue_with_culture_then_reassess';
  else if(req.tubing_change_due) plan='continue_with_tubing_change_then_reassess';
  else if(req.dressing_change_due) plan='continue_with_dressing_change_then_reassess';
  else if(req.cap_change_due) plan='continue_with_cap_change_then_reassess';
  else if(req.flushing_documented===false) plan='continue_with_flushing_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {picc,midline,central,port,complications,maintenance};}
module.exports={funcs,CITATIONS,ValidationError};
