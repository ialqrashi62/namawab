// filepath: tier5_public_health_ext_101_comm_engine.js
// TIER5_PUBLIC_HEALTH_EXT-101: Communicable disease
'use strict';
const CITATIONS = ['CDC_Comm_2020','WHO_Comm_2020','Red_Book_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function diagnosis(req){
  ensureStr(req.pathogen, 'pathogen');
  ensureEnum(req.pathogen, 'pathogen', ['sars_cov_2','influenza','rsv','tb','hiv','hepatitis_b','hepatitis_c','measles','mumps','varicella','pertussis','meningococcus','staph_aureus','c_diff','cdiff','mrsa','vre','other','streptococcus','pneumococcus','chlamydia','gonorrhea','syphilis','malaria','dengue','ebola','cholera','typhoid']);
  ensureBool(req.lab_confirmed, 'lab_confirmed');
  ensureBool(req.clinical_diagnosis, 'clinical_diagnosis');
  ensureBool(req.epi_link, 'epi_link');
  ensureBool(req.treatment_initiated, 'treatment_initiated');
  ensureBool(req.notification_required, 'notification_required');
  let plan;
  if(req.lab_confirmed===false && req.clinical_diagnosis===false) plan='continue_with_test_then_reassess';
  else if(req.notification_required && req.notification_required===false) plan='continue_with_notify_then_reassess';
  else if(req.treatment_initiated===false) plan='continue_with_initiate_then_reassess';
  else if(req.epi_link) plan='continue_with_trace_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function notification(req){
  ensureBool(req.local_health_dept, 'local_health_dept');
  ensureBool(req.state_health_dept, 'state_health_dept');
  ensureBool(req.cdc_notified, 'cdc_notified');
  ensureBool(req.who_notified, 'who_notified');
  ensureBool(req.timeframe_within, 'timeframe_within');
  ensureBool(req.data_accurate, 'data_accurate');
  let plan;
  if(req.local_health_dept===false) plan='continue_with_notify_then_reassess';
  else if(req.timeframe_within===false) plan='continue_with_expedite_then_reassess';
  else if(req.data_accurate===false) plan='continue_with_verify_then_reassess';
  else if(req.cdc_notified) plan='continue_with_cdc_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function contact(req){
  ensureNumber(req.contacts_identified, 'contacts_identified');
  ensureNumber(req.contacts_reached, 'contacts_reached');
  ensureBool(req.contacts_tested, 'contacts_tested');
  ensureBool(req.contacts_quarantined, 'contacts_quarantined');
  ensureBool(req.prophylaxis_provided, 'prophylaxis_provided');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.contacts_reached<req.contacts_identified) plan='continue_with_reach_then_reassess';
  else if(req.prophylaxis_provided===false) plan='continue_with_provide_then_reassess';
  else if(req.contacts_tested===false) plan='continue_with_test_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function isolation(req){
  ensureStr(req.isolation_type, 'isolation_type');
  ensureEnum(req.isolation_type, 'isolation_type', ['standard','contact','droplet','airborne','enteric','protective','reverse','standard_plus','strict']);
  ensureBool(req.appropriate_isolation, 'appropriate_isolation');
  ensureBool(req.ppe_available, 'ppe_available');
  ensureBool(req.visitor_restricted, 'visitor_restricted');
  ensureBool(req.room_appropriate, 'room_appropriate');
  ensureBool(req.transportation_safe, 'transportation_safe');
  let plan;
  if(req.appropriate_isolation===false) plan='continue_with_initiate_then_reassess';
  else if(req.ppe_available===false) plan='continue_with_obtain_then_reassess';
  else if(req.room_appropriate===false) plan='continue_with_reassign_then_reassess';
  else if(req.transportation_safe===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function treatment(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['acyclovir','valacyclovir','oseltamivir','baloxavir','remdesivir','molnupiravir','nirmatrelvir','ritonavir','penicillin','amoxicillin','azithromycin','ceftriaxone','cefepime','vancomycin','daptomycin','linezolid','levofloxacin','moxifloxacin','meropenem','ertapenem','isoniazid','rifampin','pyrazinamide','ethambutol','d4t','tenofovir','dolutegravir','artemether','lumefantrine','none']);
  ensureNumber(req.days_to_treatment, 'days_to_treatment');
  ensureBool(req.drug_resistance_evaluated, 'drug_resistance_evaluated');
  ensureBool(req.adherence_education, 'adherence_education');
  ensureBool(req.response_documented, 'response_documented');
  let plan;
  if(req.drug_resistance_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.days_to_treatment>3) plan='continue_with_expedite_then_reassess';
  else if(req.adherence_education===false) plan='continue_with_educate_then_reassess';
  else if(req.response_documented===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post(req){
  ensureNumber(req.days_of_isolation, 'days_of_isolation');
  ensureBool(req.symptoms_resolved, 'symptoms_resolved');
  ensureBool(req.test_negative, 'test_negative');
  ensureBool(req.clearance_workup, 'clearance_workup');
  ensureBool(req.followup_letter, 'followup_letter');
  let plan;
  if(req.test_negative===false) plan='continue_with_continue_isolation_then_reassess';
  else if(req.symptoms_resolved===false) plan='continue_with_reassess_then_reassess';
  else if(req.clearance_workup===false) plan='continue_with_workup_then_reassess';
  else if(req.followup_letter===false) plan='continue_with_letter_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {diagnosis,notification,contact,isolation,treatment,post};}
module.exports={funcs,CITATIONS,ValidationError};
