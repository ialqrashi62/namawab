'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aafp_motiv: 'AAFP Motivational Interviewing 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function motivationalInterview(input) {
  ensureObj(input, 'input');
  const readiness = ensureNumber(input.readiness, 'readiness');
  const importance = ensureNumber(input.importance, 'importance');
  const confidence = ensureNumber(input.confidence, 'confidence');
  const planned_action = !!input.planned_action;
  const avg = (readiness + importance + confidence) / 3;
  let plan;
  if (avg >= 7) { plan = 'high_motivation_action_plan'; }
  else if (avg >= 4) { plan = 'build_motivation_explore_values'; }
  else { plan = 'permission_to_change_meet_again'; }
  return { readiness, importance, confidence, planned_action, average_motivation: Math.round(avg*10)/10, plan };
}

function behaviorChange(input) {
  ensureObj(input, 'input');
  const stage = ensureEnum(input.stage, ['precontemplation','contemplation','preparation','action','maintenance','relapse'], 'stage');
  const stage_plan = {
    precontemplation: 'raise_awareness_personalize_risk',
    contemplation: 'explore_ambivalence_elicit_change_talk',
    preparation: 'develop_action_plan_set_goals',
    action: 'reinforce_steps_address_barriers',
    maintenance: 'review_triggers_plan_relapse',
    relapse: 'normalize_recidivism_re_engage'
  };
  return { stage, plan: stage_plan[stage] };
}

module.exports = { motivationalInterview, behaviorChange, CITATIONS, ValidationError };
