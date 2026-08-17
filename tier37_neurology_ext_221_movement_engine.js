// filepath: tier37_neurology_ext_221_movement_engine.js
// TIER37_NEUROLOGY-221: Movement disorders
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function parkinson_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.tremor, 'tremor', ['none','resting_tremor_left','resting_tremor_right','resting_tremor_bilateral','postural_tremor','kinetic_tremor','other']);
  ensureBool(req.rigidity, 'rigidity');
  ensureBool(req.bradykinesia, 'brady');
  ensureBool(req.postural_instability, 'pi');
  ensureNumber(req.age_at_onset, 'age');
  ensureEnum(req.diagnosis, 'dx', ['idiopathic_pd','parkinsonism_unspecified','atypical_psp','atypical_msa','atypical_cbd','drug_induced','vascular','other']);
  let status;
  if (req.bradykinesia && req.rigidity && (req.tremor !== 'none' && req.tremor !== 'kinetic_tremor')) status = 'pd_classic_trinity_fulfilled';
  else if (req.postural_instability && req.age_at_onset < 60) status = 'early_pi_atypical_parkinsonism_review';
  else if (req.diagnosis === 'atypical_psp') status = 'psp_refer_movement_disorder_specialist';
  else if (req.diagnosis === 'drug_induced') status = 'drug_induced_review_medication';
  else status = 'pd_review_appropriate';
  return { status, dx: req.diagnosis };
}

function deep_brain_stimulation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.target, 'target', ['stn','gpi','vim','zona_incerta','other']);
  ensureEnum(req.indication, 'ind', ['motor_fluctuations','dyskinesia','tremor','dystonia','epilepsy','ocd','other']);
  ensureNumber(req.duration_years_pd, 'yrs_pd');
  ensureEnum(req.response_pre, 'pre', ['wearing_off','dyskinesia','on_off','tremor_refractory','other']);
  ensureEnum(req.response_post, 'post', ['excellent','good','moderate','minimal','worsened','unknown']);
  ensureEnum(req.complication, 'comp', ['none','hemorrhage','infection','lead_breakage','worsening_cognition','hardware_related','other']);
  let status;
  if (req.complication === 'hemorrhage') status = 'dbs_hemorrhage_urgent_review';
  else if (req.complication === 'infection') status = 'dbs_infection_explant_review';
  else if (req.response_post === 'excellent' || req.response_post === 'good') status = 'dbs_optimal_response';
  else if (req.response_post === 'worsened') status = 'dbs_worsening_programming_review';
  else status = 'dbs_review_appropriate';
  return { status, p: req.response_post };
}

function essential_tremor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.tremor_type, 'type', ['kinetic','postural','resting','intention','mixed','other']);
  ensureBool(req.family_history, 'fhx');
  ensureBool(req.alcohol_response, 'alc');
  ensureBool(req.propranolol_trial, 'prop');
  ensureEnum(req.response, 'resp', ['excellent','good','partial','poor','none','unknown']);
  let status;
  if (req.tremor_type === 'resting') status = 'resting_tremor_review_pd_diagnostic';
  else if (req.alcohol_response && req.family_history && req.response === 'excellent') status = 'essential_tremor_classic';
  else if (req.propranolol_trial && req.response === 'poor') status = 'propranolol_failure_primidone_topiramate';
  else if (req.tremor_type === 'intention') status = 'intention_tremor_review_cerebellar';
  else status = 'et_review';
  return { status, t: req.tremor_type };
}

function dystonia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['cervical','cranial','axial','limb','generalized','segmental','task_specific','other']);
  ensureNumber(req.age_at_onset, 'age');
  ensureBool(req.botox_treatment, 'botox');
  ensureBool(req.deep_brain_stimulation, 'dbs');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  let status;
  if (req.type === 'generalized' && req.dbs === false) status = 'generalized_dystonia_dbs_evaluate';
  else if (req.botox_treatment && req.response === 'excellent') status = 'botox_response_optimal';
  else if (req.response === 'poor' && req.botox_treatment) status = 'botox_failure_oral_medication';
  else if (req.age_at_onset < 30 && req.type === 'generalized') status = 'early_onset_dystonia_genetic_review';
  else status = 'dystonia_review';
  return { status, t: req.type };
}

function ataxia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['cerebellar','sensory','vestibular','mixed','unknown','other']);
  ensureEnum(req.mri_finding, 'mri', ['normal','cerebellar_atrophy','brainstem_atrophy','white_matter','infarct','other']);
  ensureEnum(req.genetic_test, 'gen', ['friedreich_positive','friedreich_negative','sca_panel_positive','sca_panel_negative','pending','not_done','other']);
  ensureEnum(req.progression, 'prog', ['slow','moderate','rapid','unknown']);
  ensureBool(req.rehab, 'rehab');
  let status;
  if (req.genetic_test === 'friedreich_positive') status = 'friedreich_ataxia_genetic_counsel';
  else if (req.mri_finding === 'cerebellar_atrophy' && !req.rehab) status = 'cerebellar_atrophy_refer_rehab';
  else if (req.progression === 'rapid') status = 'rapid_progression_review_neurodegenerative';
  else status = 'ataxia_review';
  return { status, t: req.type };
}

function funcs() { return { parkinson_diagnosis, deep_brain_stimulation, essential_tremor, dystonia, ataxia }; }
module.exports = { funcs, ValidationError };