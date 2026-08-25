'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aua_male: 'AUA Optimal Evaluation of Male Infertility 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function semenAnalysis(input) {
  ensureObj(input, 'input');
  const volume_ml = ensureNumber(input.volume_ml, 'volume_ml');
  const concentration_m_per_ml = ensureNumber(input.concentration_m_per_ml, 'concentration_m_per_ml');
  const motility_pct = ensureNumber(input.motility_pct, 'motility_pct');
  const morphology_pct = ensureNumber(input.morphology_pct, 'morphology_pct');
  const total_count = volume_ml * concentration_m_per_ml;
  let interpretation;
  if (total_count < 1) { interpretation = 'azoospermia_severe_oligospermia'; }
  else if (total_count < 5) { interpretation = 'severe_oligospermia'; }
  else if (motility_pct < 40) { interpretation = 'asthenozoospermia'; }
  else if (morphology_pct < 4) { interpretation = 'teratozoospermia'; }
  else { interpretation = 'normal_semen_analysis'; }
  return { volume_ml, concentration_m_per_ml, motility_pct, morphology_pct, total_count_m: total_count, interpretation, citations:['aua_male'] };
}

function varicocele(input) {
  ensureObj(input, 'input');
  const grade = ensureEnum(input.grade, ['subclinical','i','ii','iii'], 'grade');
  const abnormal_semen = !!input.abnormal_semen;
  const symptomatic = !!input.symptomatic;
  const testicular_atrophy = !!input.testicular_atrophy;
  let treatment;
  if (abnormal_semen && (symptomatic || testicular_atrophy)) { treatment = 'microsurgical_varicocelectomy'; }
  else if (abnormal_semen) { treatment = 'shared_decision_observation_vs_repair'; }
  else if (symptomatic) { treatment = 'microsurgical_varicocelectomy_pain'; }
  else { treatment = 'observation'; }
  return { grade, abnormal_semen, symptomatic, testicular_atrophy, treatment };
}

module.exports = { semenAnalysis, varicocele, CITATIONS, ValidationError };
