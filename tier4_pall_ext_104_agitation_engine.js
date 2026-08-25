'use strict';
// TIER4_PALL_EXT-104 Agitation / Delirium (palliative)
const CITATIONS = ['NCCN_Palliative_Delirium','AGS_Delirium_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function terminalAgitationAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const hours_since_terminal = ensureNumber(input.hours_since_terminal || 0, 'hours_since_terminal');
  const pickering = !!input.pickering;
  const moaning = !!input.moaning;
  const restlessness = !!input.restlessness;
  const signals = [];
  if (pickering) signals.push('pickering');
  if (moaning) signals.push('moaning');
  if (restlessness) signals.push('restlessness');
  const score = signals.length;
  let assessment = 'no_terminal_agitation';
  if (score >= 2) assessment = 'terminal_agitation_treat';
  const treat_immediately = hours_since_terminal <= 24 && score >= 2;
  return { hours_since_terminal, signals, score, assessment, treat_immediately, citations: CITATIONS };
}

function palliativeDeliriumManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const subtype = ensureEnum(input.subtype || 'hypoactive', ['hypoactive','hyperactive','mixed'], 'subtype');
  const reversible_causes_evaluated = !!input.reversible_causes_evaluated;
  let treatment = ['non_pharm_reorientation_familiar_visitors_glasses_hearing_aids'];
  if (!reversible_causes_evaluated) treatment.push('evaluate_medications_infection_constipation_urinary_retention');
  if (subtype === 'hyperactive' || subtype === 'mixed') {
    treatment.push('haloperidol_0_5_to_2mg_sc_or_iv_q4h');
    if (input.refractory) treatment.push('add_olanzapine_5mg_sublingual_or_sc');
  }
  return { subtype, reversible_causes_evaluated, treatment, citations: CITATIONS };
}

module.exports = { terminalAgitationAssessment, palliativeDeliriumManagement, CITATIONS, ValidationError };