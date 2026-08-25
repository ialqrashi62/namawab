'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asha: 'American Speech-Language-Hearing Association Practice Portal 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function dysphagia(input) {
  ensureObj(input, 'input');
  const oral_phase_impaired = !!input.oral_phase_impaired;
  const pharyngeal_phase_impaired = !!input.pharyngeal_phase_impaired;
  const aspiration_signs = !!input.aspiration_signs;
  const weight_loss = !!input.weight_loss;
  const pneumonia_history = !!input.pneumonia_history;
  const severity_score = (oral_phase_impaired?1:0) + (pharyngeal_phase_impaired?2:0) + (aspiration_signs?3:0) + (weight_loss?1:0) + (pneumonia_history?2:0);
  let risk;
  if (aspiration_signs || pneumonia_history) { risk = 'high_risk_npo_alternative_feeding'; }
  else if (severity_score >= 4) { risk = 'moderate_risk_thickened_liquids'; }
  else if (severity_score >= 2) { risk = 'mild_risk_therapeutic_diet'; }
  else { risk = 'low_risk_regular_diet'; }
  return { oral_phase_impaired, pharyngeal_phase_impaired, aspiration_signs, weight_loss, pneumonia_history, severity_score, risk, citations:['asha'] };
}

function aphasiaType(input) {
  ensureObj(input, 'input');
  const fluency = ensureEnum(input.fluency, ['fluent','non_fluent','unclear'], 'fluency');
  const comprehension = ensureEnum(input.comprehension, ['intact','impaired','severely_impaired'], 'comprehension');
  const repetition = ensureEnum(input.repetition, ['intact','impaired','severely_impaired'], 'repetition');
  let type;
  if (fluency === 'non_fluent' && comprehension === 'intact' && repetition === 'impaired') { type = 'broca'; }
  else if (fluency === 'fluent' && comprehension === 'impaired' && repetition === 'impaired') { type = 'wernicke'; }
  else if (fluency === 'non_fluent' && comprehension === 'severely_impaired' && repetition === 'severely_impaired') { type = 'global'; }
  else if (fluency === 'fluent' && comprehension === 'intact' && repetition === 'intact') { type = 'anomic'; }
  else { type = 'mixed_or_transcortical'; }
  return { fluency, comprehension, repetition, type };
}

module.exports = { dysphagia, aphasiaType, CITATIONS, ValidationError };
