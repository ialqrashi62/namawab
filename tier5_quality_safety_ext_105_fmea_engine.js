// filepath: tier5_quality_safety_ext_105_fmea_engine.js
// TIER5_QUALITY_SAFETY_EXT-105: FMEA
'use strict';
const CITATIONS = ['FMEA_2020','HFMEA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function scope(req){
  ensureStr(req.process, 'process');
  ensureBool(req.boundaries_defined, 'boundaries_defined');
  ensureBool(req.stakeholders_engaged, 'stakeholders_engaged');
  ensureBool(req.prior_knowledge_used, 'prior_knowledge_used');
  ensureBool(req.data_sources_identified, 'data_sources_identified');
  let plan;
  if(req.boundaries_defined===false) plan='continue_with_define_then_reassess';
  else if(req.stakeholders_engaged===false) plan='continue_with_engage_then_reassess';
  else if(req.data_sources_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.prior_knowledge_used===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function steps(req){
  ensureBool(req.steps_identified, 'steps_identified');
  ensureBool(req.sequence_correct, 'sequence_correct');
  ensureBool(req.gaps_identified, 'gaps_identified');
  ensureBool(req.flowchart_created, 'flowchart_created');
  ensureBool(req.validated_by_team, 'validated_by_team');
  let plan;
  if(req.steps_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.sequence_correct===false) plan='continue_with_validate_then_reassess';
  else if(req.gaps_identified===false) plan='continue_with_gap_analyze_then_reassess';
  else if(req.flowchart_created===false) plan='continue_with_create_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function scoring(req){
  ensureNumber(req.severity, 'severity');
  ensureNumber(req.occurrence, 'occurrence');
  ensureNumber(req.detectability, 'detectability');
  ensureNumber(req.rpn, 'rpn');
  ensureBool(req.threshold_defined, 'threshold_defined');
  ensureBool(req.high_rpn_flagged, 'high_rpn_flagged');
  let plan;
  if(req.severity===0 || req.occurrence===0 || req.detectability===0) plan='continue_with_score_then_reassess';
  else if(req.rpn!==req.severity*req.occurrence*req.detectability) plan='continue_with_calc_then_reassess';
  else if(req.threshold_defined===false) plan='continue_with_threshold_then_reassess';
  else if(req.high_rpn_flagged===false) plan='continue_with_flag_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function mitigation(req){
  ensureBool(req.per_failure_action, 'per_failure_action');
  ensureBool(req.responsible_assigned, 'responsible_assigned');
  ensureBool(req.due_date_set, 'due_date_set');
  ensureBool(req.expected_rpn, 'expected_rpn');
  ensureBool(req.action_taken, 'action_taken');
  let plan;
  if(req.per_failure_action===false) plan='continue_with_plan_then_reassess';
  else if(req.responsible_assigned===false) plan='continue_with_assign_then_reassess';
  else if(req.due_date_set===false) plan='continue_with_set_then_reassess';
  else if(req.expected_rpn===false) plan='continue_with_target_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function outcomes(req){
  ensureBool(req.action_implemented, 'action_implemented');
  ensureBool(req.new_rpn_measured, 'new_rpn_measured');
  ensureBool(req.reduction_achieved, 'reduction_achieved');
  ensureBool(req.replicated, 'replicated');
  ensureBool(req.continue_monitoring, 'continue_monitoring');
  let plan;
  if(req.action_implemented===false) plan='continue_with_implement_then_reassess';
  else if(req.new_rpn_measured===false) plan='continue_with_remeasure_then_reassess';
  else if(req.reduction_achieved===false) plan='continue_with_reassess_then_reassess';
  else if(req.continue_monitoring===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reporting(req){
  ensureBool(req.score_documented, 'score_documented');
  ensureBool(req.matrix_visualized, 'matrix_visualized');
  ensureBool(req.leadership_informed, 'leadership_informed');
  ensureBool(req.staff_briefed, 'staff_briefed');
  ensureBool(req.lessons_shared, 'lessons_shared');
  let plan;
  if(req.score_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.matrix_visualized===false) plan='continue_with_visualize_then_reassess';
  else if(req.leadership_informed===false) plan='continue_with_inform_then_reassess';
  else if(req.lessons_shared===false) plan='continue_with_share_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {scope,steps,scoring,mitigation,outcomes,reporting};}
module.exports={funcs,CITATIONS,ValidationError};
