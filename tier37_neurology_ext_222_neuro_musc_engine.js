// filepath: tier37_neurology_ext_222_neuro_musc_engine.js
// TIER37_NEUROLOGY-222: Neuromuscular
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function als_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.als_fRS_baseline, 'frs');
  ensureEnum(req.site_onset, 'site', ['limb','bulbar','respiratory','limb_bulbar','thoracic','other']);
  ensureEnum(req.emg_finding, 'emg', ['active_denervation','chronic_denervation','both','normal','inconclusive','other']);
  ensureEnum(req.diagnosis, 'dx', ['definite_als','probable_als','possible_als','suspected_als','flail_arm','flail_leg','progressive_bulbar_palsy','other']);
  ensureBool(req.riluzole_started, 'ril');
  let status;
  if (req.diagnosis === 'definite_als' && !req.riluzole_started) status = 'definite_als_start_riluzole_edavarone';
  else if (req.als_fRS_baseline < 30) status = 'advanced_als_palliative_discuss';
  else if (req.diagnosis === 'definite_als' && req.riluzole_started) status = 'als_standard_therapy_initiated';
  else if (req.site_onset === 'respiratory') status = 'respiratory_onset_als_poor_prognosis';
  else status = 'als_review';
  return { status, dx: req.diagnosis };
}

function myasthenia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.achr_ab, 'ab', ['positive','negative','seronegative','musk_positive','ldrp_positive','other']);
  ensureEnum(req.symptoms, 'sym', ['ocular_only','ocular_limb','limb_only','bulbar','respiratory','generalized','other']);
  ensureEnum(req.myasthenia_severity, 'sev', ['mild','moderate','severe','crisis','remission','other']);
  ensureEnum(req.treatment, 'rx', ['pyridostigmine','pyridostigmine_steroid','immunosuppression','ivig','plasmapheresis','thymectomy','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','poor','worsening','unknown']);
  let status;
  if (req.myasthenia_severity === 'crisis') status = 'myasthenic_crisis_ivig_plasmapheresis';
  else if (req.symptoms === 'respiratory') status = 'myasthenia_respiratory_consider_icu';
  else if (req.treatment === 'pyridostigmine' && req.response === 'good') status = 'pyridostigmine_responding_maintain';
  else if (req.ab === 'positive' && req.symptoms !== 'ocular_only' && req.response === 'poor') status = 'seropositive_refractory_immunosuppression';
  else status = 'myasthenia_review';
  return { status, s: req.symptoms };
}

function peripheral_neuropathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['diabetic','idiopathic','cidp','gbs','hereditary','toxic','vitamin_deficiency','inflammatory','autoimmune','other']);
  ensureEnum(req.emg_ncs, 'emg', ['sensorimotor_axonal','pure_motor','pure_sensory','demyelinating','mixed','normal','other']);
  ensureNumber(req.diabetes_duration_years, 'dm_yrs');
  ensureEnum(req.pain_treatment, 'pain', ['gabapentin','pregabalin','duloxetine','tramadol','opioids','none','other']);
  ensureBool(req.balance_review, 'balance');
  let status;
  if (req.type === 'gbs' && req.emg_ncs === 'demyelinating') status = 'gbs_demyelinating_ivig_urgent';
  else if (req.type === 'cidp' && req.pain_treatment !== 'none') status = 'cidp_ivig_steroids_first';
  else if (req.diabetes_duration_years >= 10 && req.type === 'diabetic') status = 'long_diabetic_neuropathy_glycemic_optimize';
  else if (!req.balance_review) status = 'balance_falls_review_required';
  else status = 'neuropathy_review';
  return { status, t: req.type };
}

function muscular_dystrophy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['duchenne','becker','limb_girdle','facioscapulohumeral','myotonic','congenital','other']);
  ensureEnum(req.genetic_test, 'gen', ['positive_deletion','positive_duplication','positive_point','negative','pending','not_done','other']);
  ensureBool(req.ambulatory, 'amb');
  ensureEnum(req.steroid_treatment, 'steroid', ['prednisone','deflazacort','none','other']);
  ensureBool(req.cardiac_screening, 'cardiac');
  let status;
  if (req.type === 'duchenne' && req.ambulatory && req.steroid_treatment === 'none') status = 'duchenne_ambulatory_start_steroid';
  else if (!req.cardiac_screening) status = 'muscular_dystrophy_cardiac_screening_required';
  else if (req.type === 'myotonic' && req.steroid_treatment !== 'none') status = 'myotonic_steroid_caution_review';
  else if (req.ambulatory === false && req.cardiac_screening) status = 'non_ambulatory_respiratory_cardiac_screen';
  else status = 'muscular_dystrophy_review';
  return { status, t: req.type };
}

function autonomic_dysfunction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.symptoms, 'sym', ['orthostatic_intolerance','syncope','heat_intolerance','bladder_dysfunction','bowel_dysfunction','sexual_dysfunction','multiple','other']);
  ensureNumber(req.bp_drop, 'bp_drop');
  ensureBool(req.heart_rate_variability, 'hrv');
  ensureEnum(req.tilt_table, 'tilt', ['positive','negative','inconclusive','not_done','other']);
  ensureEnum(req.treatment, 'rx', ['midodrine','fludrocortisone','midodrine_fludrocortisone','iv_fluid','compression_garments','salt_increase','none','other']);
  let status;
  if (req.symptoms === 'syncope' && req.bp_drop >= 40) status = 'syncope_severe_orthostatic_review';
  else if (req.bp_drop >= 20 && req.treatment === 'none') status = 'orthostatic_initiate_midodrine';
  else if (req.tilt_table === 'positive' && req.treatment === 'midodrine_fludrocortisone') status = 'autonomic_combination_therapy';
  else if (!req.heart_rate_variability) status = 'hrv_abnormal_autonomic_dysfunction_review';
  else status = 'autonomic_review';
  return { status, s: req.symptoms };
}

function funcs() { return { als_diagnosis, myasthenia, peripheral_neuropathy, muscular_dystrophy, autonomic_dysfunction }; }
module.exports = { funcs, ValidationError };