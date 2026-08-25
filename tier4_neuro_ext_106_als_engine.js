'use strict';
// TIER4_NEURO_EXT-106: ALS diagnosis + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['EFNS_ALS_2012', 'AAN_ALS_2020', 'NICE_ALS_2020'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function classify(req) {
  ensureBool(req.upper_motor_neuron, 'upper_motor_neuron');
  ensureBool(req.lower_motor_neuron, 'lower_motor_neuron');
  ensureNumber(req.regions_involved, 'regions_involved');
  ensureBool(req.progressive, 'progressive');
  ensureBool(req.sensory_loss, 'sensory_loss');
  ensureBool(req.cognitive_impairment, 'cognitive_impairment');
  ensureBool(req.family_history, 'family_history');

  const definite = req.upper_motor_neuron && req.lower_motor_neuron && req.regions_involved >= 3 && req.progressive && !req.sensory_loss;
  const probable = req.upper_motor_neuron && req.lower_motor_neuron && req.regions_involved >= 2 && req.progressive && !req.sensory_loss;
  const possible = req.upper_motor_neuron && req.lower_motor_neuron && req.regions_involved >= 1 && req.progressive && !req.sensory_loss;
  return {
    classification: definite ? 'definite' : probable ? 'probable' : possible ? 'possible' : 'not_als',
    upper_motor_neuron: req.upper_motor_neuron,
    lower_motor_neuron: req.lower_motor_neuron,
    regions: req.regions_involved,
    cognitive_impairment: req.cognitive_impairment,
    workup: ['emg_ncv', 'mri_brain_cervical', 'rule_out_other_motor_neuron_disease'],
    citations: CITATIONS,
  };
}

function manage(req) {
  ensureNumber(req.fvc_pct, 'fvc_pct');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.dysphagia, 'dysphagia');
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.communication_difficult, 'communication_difficult');

  const riluzole_indicated = req.fvc_pct >= 60;
  const edaravone_eligible = req.fvc_pct >= 80 && req.weight_kg >= 50;
  const bipap_threshold = req.fvc_pct < 50 || req.dyspnea;
  return {
    fvc_pct: req.fvc_pct,
    riluzole: riluzole_indicated,
    edaravone: edaravone_eligible,
    bipap: bipap_threshold,
    feeding: req.dysphagia ? 'peg_tube_evaluation' : 'maintain_oral_with_thickening_agents',
    communication: req.communication_difficult ? 'augmentative_communication_evaluation' : 'monitor',
    multidisciplinary: ['neurology', 'pulmonology', 'gastroenterology', 'nutrition', 'pt', 'ot', 'slp'],
    citations: CITATIONS,
  };
}

module.exports = { classify, manage, CITATIONS, ValidationError };