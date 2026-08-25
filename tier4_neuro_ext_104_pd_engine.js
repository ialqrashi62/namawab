'use strict';
// TIER4_NEURO_EXT-104: Parkinsons Disease - UPDRS + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['MDS_PD_2015', 'AAN_PD_2022'];

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
  ensureBool(req.resting_tremor, 'resting_tremor');
  ensureBool(req.bradykinesia, 'bradykinesia');
  ensureBool(req.rigidity, 'rigidity');
  ensureBool(req.postural_instability, 'postural_instability');
  ensureBool(req.asymmetric_onset, 'asymmetric_onset');
  ensureBool(req.dopamine_response, 'dopamine_response');
  ensureBool(req.smell_loss, 'smell_loss');
  ensureBool(req.rem_sleep_behavior, 'rem_sleep_behavior');
  ensureBool(req.autonomic_dysfunction, 'autonomic_dysfunction');
  ensureBool(req.family_history, 'family_history');

  const mds_criteria = (req.resting_tremor || req.bradykinesia || req.rigidity) && (req.smell_loss || req.rem_sleep_behavior || req.autonomic_dysfunction || req.asymmetric_onset || req.dopamine_response || req.family_history);
  const classic_pd = req.bradykinesia && (req.resting_tremor || req.rigidity) && req.asymmetric_onset && req.dopamine_response;
  return {
    mds_clinical_criteria_met: mds_criteria,
    classic_pd: classic_pd,
    tremor_dominant: req.resting_tremor && !req.postural_instability,
    postural_instability_gait: req.postural_instability && !req.resting_tremor,
    mixed: req.resting_tremor && req.postural_instability,
    workup: ['mri_brain', 'dat_scan_if_uncertain', 'trial_of_levodopa'],
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.motor_symptoms, 'motor_symptoms');
  ensureBool(req.cognitive_decline, 'cognitive_decline');
  ensureBool(req.psychosis, 'psychosis');
  ensureBool(req.orthostatic, 'orthostatic');
  ensureNumber(req.updrs, 'updrs');
  ensureBool(req.employment, 'employment');

  let first_line;
  if (req.age >= 65 || req.cognitive_decline) first_line = 'levodopa_carbidopa';
  else if (req.employment && req.motor_symptoms) first_line = 'dopamine_agonist_pramipexole_or_ropinirole';
  else first_line = 'levodopa_or_maob_rasagiline';
  if (req.psychosis) first_line += '_with_caution_avoid_antipsychotics_except_quetiapine_or_clozapine';
  return {
    age: req.age,
    updrs: req.updrs,
    first_line,
    nonpharmacologic: ['exercise', 'physical_therapy', 'occupational_therapy', 'speech_therapy'],
    advanced_options: ['deep_brain_stimulation', 'levodopa_carbidopa_intestinal_gel', 'apomorphine_pump'],
    citations: CITATIONS,
  };
}

module.exports = { classify, treat, CITATIONS, ValidationError };