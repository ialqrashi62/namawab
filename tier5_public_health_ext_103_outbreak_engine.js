// filepath: tier5_public_health_ext_103_outbreak_engine.js
// TIER5_PUBLIC_HEALTH_EXT-103: Outbreak investigation
'use strict';
const CITATIONS = ['CDC_Outbreak_2020','Outbreak_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function detection(req){
  ensureNumber(req.cases_count, 'cases_count');
  ensureNumber(req.baseline_count, 'baseline_count');
  ensureStr(req.pathogen, 'pathogen');
  ensureBool(req.unusual_present, 'unusual_present');
  ensureBool(req.clustered_geo, 'clustered_geo');
  ensureBool(req.clustered_time, 'clustered_time');
  let plan;
  if(req.cases_count>req.baseline_count*2) plan='continue_with_investigate_then_reassess';
  else if(req.unusual_present) plan='continue_with_investigate_then_reassess';
  else if(req.clustered_geo && req.clustered_time) plan='continue_with_investigate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hypothesis(req){
  ensureBool(req.source_identified, 'source_identified');
  ensureBool(req.vehicle_identified, 'vehicle_identified');
  ensureBool(req.transmission_identified, 'transmission_identified');
  ensureBool(req.case_definition, 'case_definition');
  ensureBool(req.population_defined, 'population_defined');
  let plan;
  if(req.case_definition===false) plan='continue_with_define_then_reassess';
  else if(req.population_defined===false) plan='continue_with_define_then_reassess';
  else if(req.source_identified===false) plan='continue_with_investigate_then_reassess';
  else if(req.transmission_identified===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function epi_curve(req){
  ensureNumber(req.days_since_first, 'days_since_first');
  ensureBool(req.curve_generated, 'curve_generated');
  ensureBool(req.pattern_recognized, 'pattern_recognized');
  ensureBool(req.common_source_identified, 'common_source_identified');
  ensureBool(req.propagation_assessed, 'propagation_assessed');
  let plan;
  if(req.curve_generated===false) plan='continue_with_generate_then_reassess';
  else if(req.pattern_recognized===false) plan='continue_with_review_then_reassess';
  else if(req.common_source_identified===false) plan='continue_with_investigate_then_reassess';
  else if(req.propagation_assessed===false) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function control(req){
  ensureBool(req.source_controlled, 'source_controlled');
  ensureBool(req.transmission_blocked, 'transmission_blocked');
  ensureBool(req.prophylaxis_distributed, 'prophylaxis_distributed');
  ensureBool(req.population_protected, 'population_protected');
  ensureBool(req.monitoring_active, 'monitoring_active');
  let plan;
  if(req.source_controlled===false) plan='continue_with_control_then_reassess';
  else if(req.transmission_blocked===false) plan='continue_with_block_then_reassess';
  else if(req.prophylaxis_distributed===false) plan='continue_with_distribute_then_reassess';
  else if(req.monitoring_active===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function lab(req){
  ensureBool(req.specimens_collected, 'specimens_collected');
  ensureBool(req.lab_testing_initiated, 'lab_testing_initiated');
  ensureBool(req.wgs_performed, 'wgs_performed');
  ensureBool(req.subtyping_done, 'subtyping_done');
  ensureBool(req.relatedness_determined, 'relatedness_determined');
  let plan;
  if(req.specimens_collected===false) plan='continue_with_collect_then_reassess';
  else if(req.lab_testing_initiated===false) plan='continue_with_test_then_reassess';
  else if(req.subtyping_done===false) plan='continue_with_subtype_then_reassess';
  else if(req.relatedness_determined===false) plan='continue_with_analyze_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function closeout(req){
  ensureBool(req.exit_strategy, 'exit_strategy');
  ensureBool(req.surveillance_continued, 'surveillance_continued');
  ensureBool(req.report_published, 'report_published');
  ensureBool(req.lessons_learned, 'lessons_learned');
  ensureBool(req.recommendations, 'recommendations');
  let plan;
  if(req.exit_strategy===false) plan='continue_with_exit_then_reassess';
  else if(req.surveillance_continued===false) plan='continue_with_continue_then_reassess';
  else if(req.report_published===false) plan='continue_with_publish_then_reassess';
  else if(req.recommendations===false) plan='continue_with_recommend_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {detection,hypothesis,epi_curve,control,lab,closeout};}
module.exports={funcs,CITATIONS,ValidationError};
