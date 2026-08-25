// filepath: tier5_nephrology_ext_102_dialysis_engine.js
// TIER5_NEPHROLOGY_EXT-102: Dialysis
'use strict';
const CITATIONS = ['KDOQI_HD_2020','ISPD_PD_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function adequacy(req){
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['hd','hemodiafiltration','pd_capd','pd_apd','home_hd','short_daily','nocturnal']);
  ensureNumber(req.urr, 'urr');
  ensureNumber(req.kt_v, 'kt_v');
  ensureBool(req.adequate, 'adequate');
  ensureBool(req.review_needed, 'review_needed');
  let plan;
  if(req.adequate===false) plan='continue_with_optimize_then_reassess';
  else if(req.kt_v<1.2) plan='continue_with_review_then_reassess';
  else if(req.urr<65) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function access(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['avf','avg','tunneled_catheter','non_tunneled_catheter','pd_catheter','none','unknown']);
  ensureBool(req.working, 'working');
  ensureBool(req.infection_signs, 'infection_signs');
  ensureBool(req.fistula_murmur, 'fistula_murmur');
  ensureBool(req.dysfunction, 'dysfunction');
  let plan;
  if(req.infection_signs) plan='continue_with_treat_then_reassess';
  else if(req.working===false) plan='continue_with_revision_then_reassess';
  else if(req.dysfunction) plan='continue_with_imaging_then_reassess';
  else if(req.type==='non_tunneled_catheter') plan='continue_with_tunnel_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.cramps, 'cramps');
  ensureBool(req.headache, 'headache');
  ensureBool(req.nausea, 'nausea');
  ensureBool(req.air_embolism, 'air_embolism');
  ensureBool(req.dialyzer_reaction, 'dialyzer_reaction');
  let plan;
  if(req.air_embolism) plan='continue_with_emergent_then_reassess';
  else if(req.dialyzer_reaction) plan='continue_with_change_dialyzer_then_reassess';
  else if(req.hypotension) plan='continue_with_adjust_then_reassess';
  else if(req.cramps) plan='continue_with_fluid_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dry_weight(req){
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.edema, 'edema');
  ensureNumber(req.dry_weight, 'dry_weight');
  ensureBool(req.at_goal, 'goal');
  ensureBool(req.cramping_dialysis, 'cramping_dialysis');
  ensureBool(req.hypotension_dialysis, 'hypotension_dialysis');
  let plan;
  if(req.hypotension_dialysis && req.cramping_dialysis) plan='continue_with_increase_then_reassess';
  else if(req.hypotension_dialysis) plan='continue_with_increase_then_reassess';
  else if(req.edema>=2) plan='continue_with_decrease_then_reassess';
  else if(req.at_goal===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function peritonitis(req){
  ensureBool(req.cloudy_effluent, 'cloudy_effluent');
  ensureBool(req.abdominal_pain, 'abdominal_pain');
  ensureBool(req.fever, 'fever');
  ensureNumber(req.wbc_effluent, 'wbc_effluent');
  ensureBool(req.culture_collected, 'culture_collected');
  ensureBool(req.empiric_antibiotics, 'empiric_antibiotics');
  let plan;
  if(req.cloudy_effluent && req.abdominal_pain) plan='continue_with_peritonitis_then_reassess';
  else if(req.wbc_effluent>100) plan='continue_with_peritonitis_then_reassess';
  else if(req.empiric_antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.culture_collected===false) plan='continue_with_culture_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prescription(req){
  ensureNumber(req.duration_hours, 'duration_hours');
  ensureNumber(req.frequency_per_week, 'frequency_per_week');
  ensureNumber(req.dialysate_prescription, 'dialysate_prescription');
  ensureBool(req.individualized, 'individualized');
  ensureBool(req.reviewed, 'reviewed');
  let plan;
  if(req.frequency_per_week<3) plan='continue_with_increase_then_reassess';
  else if(req.individualized===false) plan='continue_with_individualize_then_reassess';
  else if(req.reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {adequacy,access,complications,dry_weight,peritonitis,prescription};}
module.exports={funcs,CITATIONS,ValidationError};