// filepath: tier5_psych_ext_112_therapy_engine.js
// TIER5_PSYCH_EXT-112: Psychotherapy Modalities
'use strict';
const CITATIONS = ['APA_PSYCHOTHERAPY_2020','NICE_PSYCHOTHERAPY_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cbt(req){
  ensureNumber(req.sessions_completed, 'sessions_completed');
  ensureEnum(req.format, 'format', ['individual','group','family','couple','online','self_help','other']);
  ensureBool(req.thought_records, 'thought_records');
  ensureBool(req.behavioral_activation, 'behavioral_activation');
  ensureNumber(req.target_symptoms_score, 'target_symptoms_score');
  ensureBool(req.homework_adherent, 'homework_adherent');
  let plan;
  if(req.sessions_completed<8 && req.target_symptoms_score>=15) plan='continue_with_intensify_then_reassess';
  else if(req.homework_adherent===false) plan='continue_with_homework_barriers_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function emdr(req){
  ensureBool(req.consent, 'consent');
  ensureNumber(req.phase_completed, 'phase_completed');
  ensureNumber(req.suds_baseline, 'suds_baseline');
  ensureNumber(req.suds_current, 'suds_current');
  ensureBool(req.target_recalled, 'target_recalled');
  ensureBool(req.distress_tolerated, 'distress_tolerated');
  let plan;
  if(req.suds_current>req.suds_baseline || req.suds_current>=8) plan='continue_with_containment_then_reassess';
  else if(req.suds_current<=3) plan='continue_with_installation_then_reassess';
  else plan='continue_with_processing_then_reassess';
  return {plan};
}
function dbt(req){
  ensureBool(req.mindfulness_practice, 'mindfulness_practice');
  ensureBool(req.distress_tolerance, 'distress_tolerance');
  ensureBool(req.emotion_regulation, 'emotion_regulation');
  ensureBool(req.interpersonal_effectiveness, 'interpersonal_effectiveness');
  ensureNumber(req.frequency_skills_group, 'frequency_skills_group');
  ensureBool(req.phone_coaching, 'phone_coaching');
  let plan;
  if(req.frequency_skills_group<1) plan='continue_with_group_referral_then_reassess';
  else if(req.phone_coaching===false) plan='continue_with_phone_coach_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function mi(req){
  ensureNumber(req.stage_change, 'stage_change');
  ensureBool(req.engaged, 'engaged');
  ensureBool(req.discrepancy_evoked, 'discrepancy_evoked');
  ensureBool(req.autonomy_supported, 'autonomy_supported');
  ensureBool(req.self_efficacy, 'self_efficacy');
  ensureBool(req.followed_through, 'followed_through');
  let plan;
  if(req.stage_change>=5) plan='continue_with_action_plan_then_reassess';
  else if(req.engaged===false) plan='continue_with_engagement_then_reassess';
  else plan='continue_with_elicit_then_reassess';
  return {plan};
}
function family(req){
  ensureBool(req.all_engaged, 'all_engaged');
  ensureBool(req.conflict_addressed, 'conflict_addressed');
  ensureNumber(req.sessions_total, 'sessions_total');
  ensureBool(req.communication_improvement, 'communication_improvement');
  ensureBool(req.solution_focused_goals, 'solution_focused_goals');
  ensureBool(req.identified_conflicts, 'identified_conflicts');
  let plan;
  if(req.all_engaged===false) plan='continue_with_engagement_then_reassess';
  else if(req.communication_improvement===false) plan='continue_with_intensify_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function group(req){
  ensureNumber(req.sessions_attended, 'sessions_attended');
  ensureBool(req.curriculum_aligned, 'curriculum_aligned');
  ensureBool(req.peer_interaction, 'peer_interaction');
  ensureBool(req.cohesion_score, 'cohesion_score');
  ensureBool(req.outside_support, 'outside_support');
  ensureEnum(req.outcome_status, 'outcome_status', ['worsening','stable','improving','recovered']);
  let plan;
  if(req.sessions_attended<6 && req.outcome_status==='worsening') plan='continue_with_barriers_then_reassess';
  else if(req.cohesion_score===false) plan='continue_with_process_group_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {cbt,emdr,dbt,mi,family,group};}
module.exports = {funcs, CITATIONS, ValidationError};
