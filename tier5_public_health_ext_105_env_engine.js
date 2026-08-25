// filepath: tier5_public_health_ext_105_env_engine.js
// TIER5_PUBLIC_HEALTH_EXT-105: Environmental health
'use strict';
const CITATIONS = ['CDC_Env_2020','EPA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function water(req){
  ensureStr(req.source, 'source');
  ensureEnum(req.source, 'source', ['tap','well','bottled','recreational','surface','ground','river','lake','swimming_pool','hot_tub']);
  ensureBool(req.contamination_risk, 'contamination_risk');
  ensureBool(req.tested_recently, 'tested_recently');
  ensureBool(req.treatment_used, 'treatment_used');
  ensureBool(req.boil_advisory, 'boil_advisory');
  let plan;
  if(req.contamination_risk && req.treatment_used===false) plan='continue_with_treat_then_reassess';
  else if(req.tested_recently===false) plan='continue_with_test_then_reassess';
  else if(req.boil_advisory) plan='continue_with_advisory_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function air(req){
  ensureNumber(req.aqi, 'aqi');
  ensureBool(req.sensitive_population, 'sensitive_population');
  ensureBool(req.outdoor_advice, 'outdoor_advice');
  ensureBool(req.indoor_protection, 'indoor_protection');
  ensureBool(req.purifier_used, 'purifier_used');
  let plan;
  if(req.aqi>150) plan='continue_with_urgent_advisory_then_reassess';
  else if(req.aqi>100 && req.sensitive_population) plan='continue_with_advisory_then_reassess';
  else if(req.sensitive_population && req.indoor_protection===false) plan='continue_with_protect_then_reassess';
  else if(req.outdoor_advice===false) plan='continue_with_advise_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function food(req){
  ensureBool(req.contamination_suspected, 'contamination_suspected');
  ensureBool(req.outbreak_suspected, 'outbreak_suspected');
  ensureBool(req.inspector_called, 'inspector_called');
  ensureBool(req.samples_collected, 'samples_collected');
  ensureBool(req.establishment_closed, 'establishment_closed');
  let plan;
  if(req.outbreak_suspected && req.inspector_called===false) plan='continue_with_call_then_reassess';
  else if(req.contamination_suspected && req.samples_collected===false) plan='continue_with_sample_then_reassess';
  else if(req.establishment_closed===false && req.outbreak_suspected) plan='continue_with_close_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function lead(req){
  ensureNumber(req.lead_level, 'lead_level');
  ensureBool(req.source_identified, 'source_identified');
  ensureBool(req.remediation_done, 'remediation_done');
  ensureBool(req.followup_testing, 'followup_testing');
  ensureBool(req.developmental_screening, 'developmental_screening');
  let plan;
  if(req.lead_level>=45) plan='continue_with_chelation_then_reassess';
  else if(req.source_identified===false) plan='continue_with_investigate_then_reassess';
  else if(req.remediation_done===false) plan='continue_with_remediate_then_reassess';
  else if(req.followup_testing===false) plan='continue_with_retest_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vector(req){
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['malaria','dengue','zika','chikungunya','west_nile','lyme','rocky_mountain','plague','tularemia','leishmaniasis','ehrlichiosis','anaplasmosis','yellow_fever','japanese_encephalitis','chagas']);
  ensureBool(req.spraying_active, 'spraying_active');
  ensureBool(req.communication_issued, 'communication_issued');
  ensureBool(req.surveillance_active, 'surveillance_active');
  ensureBool(req.elimination_active, 'elimination_active');
  let plan;
  if(req.spraying_active===false) plan='continue_with_spray_then_reassess';
  else if(req.communication_issued===false) plan='continue_with_communicate_then_reassess';
  else if(req.surveillance_active===false) plan='continue_with_monitor_then_reassess';
  else if(req.elimination_active===false) plan='continue_with_eliminate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function climate(req){
  ensureBool(req.heat_advisory, 'heat_advisory');
  ensureBool(req.cold_advisory, 'cold_advisory');
  ensureBool(req.population_protected, 'population_protected');
  ensureBool(req.warning_systems, 'warning_systems');
  ensureBool(req.shelter_capacity, 'shelter_capacity');
  let plan;
  if(req.heat_advisory && req.shelter_capacity===false) plan='continue_with_shelter_then_reassess';
  else if(req.cold_advisory && req.shelter_capacity===false) plan='continue_with_shelter_then_reassess';
  else if(req.warning_systems===false) plan='continue_with_warning_then_reassess';
  else if(req.population_protected===false) plan='continue_with_protect_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {water,air,food,lead,vector,climate};}
module.exports={funcs,CITATIONS,ValidationError};
