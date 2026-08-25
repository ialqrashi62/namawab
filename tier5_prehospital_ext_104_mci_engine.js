// filepath: tier5_prehospital_ext_104_mci_engine.js
// TIER5_PREHOSPITAL_EXT-104: Mass Casualty Incident
'use strict';
const CITATIONS = ['MCI_2020','START_Triage_2020','SALT_Triage_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function triage(req){
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.mental_status, 'mental_status');
  ensureBool(req.perfusion, 'perfusion');
  ensureBool(req.ambulatory, 'ambulatory');
  ensureBool(req.following_commands, 'following_commands');
  let plan;
  if(req.ambulatory) plan='continue_with_minor_then_reassess';
  else if(req.respiratory_rate>30) plan='continue_with_immediate_then_reassess';
  else if(req.perfusion===false) plan='continue_with_immediate_then_reassess';
  else if(req.mental_status<8) plan='continue_with_immediate_then_reassess';
  else if(req.following_commands) plan='continue_with_delayed_then_reassess';
  else plan='continue_with_expectant_then_reassess';
  return {plan};
}
function incident_command(req){
  ensureBool(req.ic_established, 'ic_established');
  ensureBool(req.safety_officer, 'safety_officer');
  ensureBool(req.liaison_officer, 'liaison_officer');
  ensureBool(req.public_info_officer, 'public_info_officer');
  ensureBool(req.planning_chief, 'planning_chief');
  ensureBool(req.logistics_chief, 'logistics_chief');
  let plan;
  if(req.ic_established===false) plan='continue_with_establish_then_reassess';
  else if(req.safety_officer===false) plan='continue_with_assign_then_reassess';
  else if(req.liaison_officer===false) plan='continue_with_assign_then_reassess';
  else if(req.logistics_chief===false) plan='continue_with_assign_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staging(req){
  ensureBool(req.staging_area, 'staging_area');
  ensureBool(req.treatment_area, 'treatment_area');
  ensureBool(req.loading_zone, 'loading_zone');
  ensureBool(req.morgue_area, 'morgue_area');
  ensureBool(req.public_access_controlled, 'public_access_controlled');
  let plan;
  if(req.staging_area===false) plan='continue_with_designate_then_reassess';
  else if(req.treatment_area===false) plan='continue_with_designate_then_reassess';
  else if(req.loading_zone===false) plan='continue_with_designate_then_reassess';
  else if(req.morgue_area===false) plan='continue_with_reassess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function communication(req){
  ensureBool(req.communication_plan, 'communication_plan');
  ensureBool(req.radio_assignments, 'radio_assignments');
  ensureBool(req.cell_enabled, 'cell_enabled');
  ensureBool(req.runners_assigned, 'runners_assigned');
  ensureBool(req.hospital_notified, 'hospital_notified');
  let plan;
  if(req.hospital_notified===false) plan='continue_with_notify_then_reassess';
  else if(req.communication_plan===false) plan='continue_with_develop_then_reassess';
  else if(req.radio_assignments===false) plan='continue_with_assign_then_reassess';
  else if(req.runners_assigned===false) plan='continue_with_assign_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function resources(req){
  ensureNumber(req.beds_needed, 'beds_needed');
  ensureNumber(req.beds_confirmed, 'beds_confirmed');
  ensureBool(req.ambulance_count, 'ambulance_count');
  ensureBool(req.helicopter_count, 'helicopter_count');
  ensureBool(req.blood_products, 'blood_products');
  ensureBool(req.hospital_evacuation, 'hospital_evacuation');
  let plan;
  if(req.beds_needed>req.beds_confirmed) plan='continue_with_notify_then_reassess';
  else if(req.ambulance_count===false) plan='continue_with_call_then_reassess';
  else if(req.helicopter_count===false) plan='continue_with_call_then_reassess';
  else if(req.blood_products===false) plan='continue_with_authorize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function demobilization(req){
  ensureBool(req.all_patients_transported, 'all_patients_transported');
  ensureBool(req.scene_clear, 'scene_clear');
  ensureBool(req.equipment_returned, 'equipment_returned');
  ensureBool(req.staff_debriefed, 'staff_debriefed');
  ensureBool(req.reports_completed, 'reports_completed');
  let plan;
  if(req.all_patients_transported===false) plan='continue_with_continue_then_reassess';
  else if(req.scene_clear===false) plan='continue_with_clear_then_reassess';
  else if(req.staff_debriefed===false) plan='continue_with_debrief_then_reassess';
  else if(req.reports_completed===false) plan='continue_with_complete_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {triage,incident_command,staging,communication,resources,demobilization};}
module.exports={funcs,CITATIONS,ValidationError};
