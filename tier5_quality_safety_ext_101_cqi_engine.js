// filepath: tier5_quality_safety_ext_101_cqi_engine.js
// TIER5_QUALITY_SAFETY_EXT-101: Continuous quality improvement
'use strict';
const CITATIONS = ['CQI_2020','IHI_CQI_2020','Lean_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pdca(req){
  ensureStr(req.phase, 'phase');
  ensureEnum(req.phase, 'phase', ['plan','do','check','act','sustain','new_cycle']);
  ensureBool(req.objective_set, 'objective_set');
  ensureBool(req.intervention_identified, 'intervention_identified');
  ensureBool(req.data_collected, 'data_collected');
  ensureBool(req.changes_implemented, 'changes_implemented');
  ensureBool(req.effectiveness_evaluated, 'effectiveness_evaluated');
  let plan;
  if(req.phase==='plan' && req.objective_set===false) plan='continue_with_set_objective_then_reassess';
  else if(req.phase==='do' && req.intervention_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.phase==='check' && req.data_collected===false) plan='continue_with_collect_then_reassess';
  else if(req.phase==='act' && req.changes_implemented===false) plan='continue_with_implement_then_reassess';
  else if(req.effectiveness_evaluated===false) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function aim(req){
  ensureStr(req.aim, 'aim');
  ensureNumber(req.baseline_pct, 'baseline_pct');
  ensureNumber(req.target_pct, 'target_pct');
  ensureNumber(req.days_to_target, 'days_to_target');
  ensureBool(req.smart_aim, 'smart_aim');
  ensureBool(req.stakeholder_aligned, 'stakeholder_aligned');
  let plan;
  if(req.smart_aim===false) plan='continue_with_refine_then_reassess';
  else if(req.stakeholder_aligned===false) plan='continue_with_align_then_reassess';
  else if(req.target_pct===req.baseline_pct) plan='continue_with_set_target_then_reassess';
  else if(req.days_to_target<30) plan='continue_with_extend_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function measures(req){
  ensureStr(req.measure_type, 'measure_type');
  ensureEnum(req.measure_type, 'measure_type', ['outcome','process','balancing','structural','patient_reported','none']);
  ensureBool(req.numerator_defined, 'numerator_defined');
  ensureBool(req.denominator_defined, 'denominator_defined');
  ensureBool(req.data_source_identified, 'data_source_identified');
  ensureBool(req.baseline_measured, 'baseline_measured');
  ensureBool(req.operational_definition, 'operational_definition');
  let plan;
  if(req.numerator_defined===false) plan='continue_with_define_then_reassess';
  else if(req.denominator_defined===false) plan='continue_with_define_then_reassess';
  else if(req.operational_definition===false) plan='continue_with_define_then_reassess';
  else if(req.data_source_identified===false) plan='continue_with_identify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tests(req){
  ensureNumber(req.pdsa_cycle, 'pdsa_cycle');
  ensureBool(req.test_small, 'test_small');
  ensureBool(req.observation_documented, 'observation_documented');
  ensureBool(req.prediction_documented, 'prediction_documented');
  ensureBool(req.learning_applied, 'learning_applied');
  ensureBool(req.widening, 'widening');
  let plan;
  if(req.test_small===false) plan='continue_with_small_scale_then_reassess';
  else if(req.observation_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.prediction_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.learning_applied===false) plan='continue_with_apply_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function spread(req){
  ensureBool(req.ready_to_spread, 'ready_to_spread');
  ensureBool(req.replication_plan, 'replication_plan');
  ensureBool(req.adaptation_considered, 'adaptation_considered');
  ensureBool(req.sustainability_addressed, 'sustainability_addressed');
  ensureBool(req.stakeholders_engaged, 'stakeholders_engaged');
  let plan;
  if(req.ready_to_spread===false) plan='continue_with_mature_then_reassess';
  else if(req.replication_plan===false) plan='continue_with_plan_then_reassess';
  else if(req.adaptation_considered===false) plan='continue_with_consider_then_reassess';
  else if(req.sustainability_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dashboard(req){
  ensureBool(req.kpi_defined, 'kpi_defined');
  ensureBool(req.real_time_data, 'real_time_data');
  ensureBool(req.visual_display, 'visual_display');
  ensureBool(req.accessible_to_team, 'accessible_to_team');
  ensureBool(req.act_on_data, 'act_on_data');
  let plan;
  if(req.kpi_defined===false) plan='continue_with_define_then_reassess';
  else if(req.real_time_data===false) plan='continue_with_pipeline_then_reassess';
  else if(req.visual_display===false) plan='continue_with_display_then_reassess';
  else if(req.act_on_data===false) plan='continue_with_act_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pdca,aim,measures,tests,spread,dashboard};}
module.exports={funcs,CITATIONS,ValidationError};
