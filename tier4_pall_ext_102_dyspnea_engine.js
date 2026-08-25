'use strict';
// TIER4_PALL_EXT-102 Dyspnea
const CITATIONS = ['NCCN_Palliative_Dyspnea','ERS_Dyspnea_Palliative'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function dyspneaSeverity(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const rest_dyspnea = !!input.rest_dyspnea;
  const minimal_activity_dyspnea = !!input.minimal_activity_dyspnea;
  const spo2 = ensureNumber(input.spo2, 'spo2');
  let severity = 'mild';
  if (rest_dyspnea || spo2 < 88) severity = 'severe';
  else if (minimal_activity_dyspnea) severity = 'moderate';
  return { rest_dyspnea, minimal_activity_dyspnea, spo2, severity, citations: CITATIONS };
}

function dyspneaManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const severity = (input.severity || 'mild');
  const reversible_causes_evaluated = !!input.reversible_causes_evaluated;
  const opioid_appropriate = !!input.opioid_appropriate;
  let interventions = ['positioning','fan_airflow_to_face','relaxation_breathing'];
  if (severity !== 'mild') interventions.push('opioid_morphine_oral_or_subcutaneous_2_5_to_5mg_prn');
  if (!reversible_causes_evaluated) interventions.push('evaluate_reversible_causes_transudate_bronchospasm_anxiety');
  if (opioid_appropriate) interventions.push('titrate_opioid_per_response');
  return { severity, interventions, citations: CITATIONS };
}

module.exports = { dyspneaSeverity, dyspneaManagement, CITATIONS, ValidationError };