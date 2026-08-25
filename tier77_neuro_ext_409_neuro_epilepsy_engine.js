// filepath: tier77_neuro_ext_409_neuro_epilepsy_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function epilepsy_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.seizure_type, 'st', ['focal','focal_to_bilateral','generalized','unknown','other','tonic_clonic','absence']);
  ensureNum(req.episode_count, 'ec');
  ensureStr(req.last_seizure, 'ls');
  ensureStr(req.triggers, 'tr');
  ensureNum(req.duration_years, 'dy');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.medications, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function seizure_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.seizure_type, 'st', ['focal','focal_to_bilateral','generalized','unknown','other','tonic_clonic','absence']);
  ensureEnum(req.ilae_classification, 'ic', ['focal_aware','focal_impaired_awareness','generalized_motor','generalized_non_motor','unknown','other']);
  ensureStr(req.eeg_status, 'es');
  ensureBool(req.imaging_done, 'id');
  ensureStr(req.provoking_factors, 'pf');
  ensureStr(req.frequency, 'freq');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function aed_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.aed_medication, 'aedm', ['levetiracetam','lamotrigine','valproate','carbamazepine','topiramate','lacosamide','perampanel','brivaracetam','phenytoin','other','unknown']);
  ensureNum(req.aed_dose, 'aed');
  ensureNum(req.aed_level_ng_ml, 'aedl');
  ensureEnum(req.seizure_frequency, 'sf', ['seizure_free','monthly','weekly','daily','multiple_daily','unknown','other']);
  ensureEnum(req.side_effects, 'se', ['none','mild','moderate','severe','unknown','other']);
  ensureBool(req.adherent, 'adh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}
function eeg_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.eeg_findings, 'ef', ['normal','epileptiform_left_temporal','epileptiform_right_temporal','generalized_slow','focal_slow','status','other','abnormal_non_epileptiform','abnormal']);
  ensureBool(req.activations_done, 'ad');
  ensureStr(req.impression, 'imp');
  ensureNum(req.duration_minutes, 'dm');
  ensureBool(req.sleep_deprived, 'sd');
  ensureStr(req.location, 'loc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function epilepsy_surgery_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.drug_resistant, 'dr');
  ensureNum(req.failed_aed_count, 'fac');
  ensureStr(req.localization, 'loc');
  ensureEnum(req.surgical_eligibility, 'se', ['candidate','not_candidate','under_evaluation','declined','unknown','other']);
  ensureBool(req.wada_planned, 'wp');
  ensureBool(req.intracranial_eeg_planned, 'iep');
  ensureEnum(req.surgical_procedure, 'sp', ['none','temporal_resection','extratemporal_resection','hemispherectomy','corpus_callosotomy','rns','vns','laser_ablation','mri_guided_laser','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { epilepsy_initial, seizure_classification, aed_management, eeg_review, epilepsy_surgery_eval }; }
module.exports = { funcs, ValidationError };