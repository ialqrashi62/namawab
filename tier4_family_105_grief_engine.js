'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aafp_grief: 'AAFP Bereavement Care 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function bereavementStage(input) {
  ensureObj(input, 'input');
  const months_since = ensureNumber(input.months_since, 'months_since');
  const denial = !!input.denial;
  const anger = !!input.anger;
  const bargaining = !!input.bargaining;
  const depression = !!input.depression;
  const acceptance = !!input.acceptance;
  const intrusive_memories = !!input.intrusive_memories;
  let stage;
  if (months_since < 1) { stage = 'normal_initial_impact'; }
  else if (months_since < 6) { stage = 'acute_grief'; }
  else if (months_since < 12) { stage = 'integrated_grief'; }
  else { stage = 'restored_equilibrium'; }
  const complications = (intrusive_memories && months_since >= 6) ? 'consider_ptsd' : 'normal_process';
  return { months_since, denial, anger, bargaining, depression, acceptance, intrusive_memories, stage, complications };
}

function bereavementSupport(input) {
  ensureObj(input, 'input');
  const grief_intensity = ensureNumber(input.grief_intensity, 'grief_intensity');
  const social_support = ensureNumber(input.social_support, 'social_support');
  const suicidal_ideation = !!input.suicidal_ideation;
  const prior_psych_history = !!input.prior_psych_history;
  let plan;
  if (suicidal_ideation) { plan = 'urgent_psych'; }
  else if (grief_intensity >= 8 && social_support <= 3) { plan = 'support_group_counseling'; }
  else if (prior_psych_history) { plan = 'monitor_psych_referral_if_worsening'; }
  else { plan = 'routine_bereavement_followup'; }
  return { grief_intensity, social_support, suicidal_ideation, prior_psych_history, plan };
}

module.exports = { bereavementStage, bereavementSupport, CITATIONS, ValidationError };
