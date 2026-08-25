// filepath: tier37_neurology_ext_219_epilepsy_engine.js
// TIER37_NEUROLOGY-219: Epilepsy
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function epilepsy_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.seizure_type, 'sz', ['focal_aware','focal_impaired_awareness','generalized_tonic_clonic','absence','myoclonic','atonic','unknown','other']);
  ensureEnum(req.eeg_finding, 'eeg', ['normal','focal_slowing','generalized_slowing','epileptiform_focal','epileptiform_generalized','left_temporal_sharp','right_temporal_sharp','unknown','other']);
  ensureEnum(req.mri_finding, 'mri', ['normal','hippocampal_sclerosis','tumor','cavernoma','cortical_dysplasia','atrophy','glioma','other']);
  ensureNumber(req.duration_years, 'yrs');
  ensureBool(req.epilepsy_confirmed, 'conf');
  let status;
  if (req.seizure_type.includes('focal') && req.eeg_finding.includes('temporal') && req.mri_finding === 'hippocampal_sclerosis') status = 'mesial_temporal_sclerosis_surgical_candidate';
  else if (req.duration_years >= 2 && !req.epilepsy_confirmed) status = 'epilepsy_confirmation_review_dx';
  else if (req.epilepsy_confirmed && req.mri_finding === 'tumor') status = 'epilepsy_secondary_to_tumor_review';
  else if (req.eeg_finding === 'epileptiform_focal') status = 'focal_epilepsy_continue_evaluation';
  else status = 'epilepsy_review';
  return { status, sz: req.seizure_type };
}

function asm_selection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.seizure_type, 'sz', ['focal_aware','focal_impaired_awareness','generalized_tonic_clonic','absence','myoclonic','mixed']);
  ensureEnum(req.sex, 'sex', ['male','female','other']);
  ensureEnum(req.comorbid, 'comorb', ['none','depression','migraine','renal','hepatic','cardiac','multiple','other']);
  ensureEnum(req.first_drug, 'drug', ['lamotrigine','levetiracetam','carbamazepine','valproate','topiramate','oxcarbazepine','lacosamide','other']);
  ensureEnum(req.side_effects, 'se', ['none','rash','drowsiness','weight_gain','cognitive','mood','hepatotoxicity','other']);
  ensureEnum(req.response, 'resp', ['seizure_free','reduced','unchanged','worsened','unknown']);
  let status;
  if (req.side_effects === 'rash') status = 'asm_rash_urgent_evaluation';
  else if (req.seizure_type === 'generalized_tonic_clonic' && req.first_drug === 'carbamazepine') status = 'carbamazepine_worsens_generalized_review';
  else if (req.sex === 'female' && req.first_drug === 'valproate') status = 'valproate_female_teratogenicity_review';
  else if (req.response === 'seizure_free') status = 'asm_seizure_free_maintain';
  else if (req.response === 'unchanged' && req.first_drug === 'lamotrigine') status = 'lamotrigine_failure_add_second';
  else status = 'asm_selection_review';
  return { status, d: req.first_drug };
}

function status_epilepticus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.duration_min, 'dur');
  ensureEnum(req.phase, 'phase', ['early','established','refractory','super_refractory','other']);
  ensureBool(req.first_line_taken, 'first');
  ensureEnum(req.second_line, 'second', ['levetiracetam','fosphenytoin','valproate','midazolam','propofol','pentobarbital','none','other']);
  ensureBool(req.intubation, 'intub');
  ensureEnum(req.etiology, 'etio', ['medication_noncompliance','stroke','infection','metabolic','idiopathic','unknown','other']);
  let status;
  if (req.phase === 'refractory' && !req.intubation) status = 'refractory_se_intubate_anesthesia';
  else if (req.duration_min >= 30 && req.phase === 'early') status = 'se_established_progress_phase';
  else if (req.intubation && req.second_line !== 'none') status = 'intubated_se_continuous_eeg';
  else if (req.phase === 'established' && req.second_line !== 'none') status = 'se_established_treating';
  else status = 'status_epilepticus_review';
  return { status, p: req.phase };
}

function epilepsy_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['temporal_lobectomy','extra_temporal_resection','hemispherectomy','corpus_callosotomy','vns_implantation','rns_implantation','laser_ablation','none','other']);
  ensureEnum(req.mri_lesion, 'lesion', ['hippocampal_sclerosis','tumor','cortical_dysplasia','cavernoma','atrophy','none','other']);
  ensureEnum(req.eeg_focus, 'eeg', ['left_temporal','right_temporal','left_frontal','right_frontal','multifocal','bilateral','none','other']);
  ensureEnum(req.candidate, 'cand', ['ideal','reasonable','poor','not_candidate','other']);
  ensureEnum(req.engel_outcome, 'engel', ['ia','ib','ii','iii','iv','not_done','unknown','other']);
  let status;
  if (req.candidate === 'not_candidate') status = 'not_surgical_candidate';
  else if (req.mri_lesion === 'hippocampal_sclerosis' && req.eeg_focus === 'left_temporal' && req.type === 'temporal_lobectomy' && req.engel_outcome === 'ia') status = 'mts_surgery_engel_ia_optimal';
  else if (req.type === 'temporal_lobectomy' && req.engel_outcome === 'ia') status = 'surgery_engel_ia_excellent';
  else if (req.engel_outcome === 'iv') status = 'surgery_failure_review_vns';
  else status = 'epilepsy_surgery_review';
  return { status, t: req.type };
}

function eeg_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.eeg_finding, 'find', ['normal','focal_slowing','generalized_slowing','epileptiform_focal','epileptiform_generalized','burst_suppression','other']);
  ensureEnum(req.ictal_pattern, 'ictal', ['present','absent','subclinical','not_done','other']);
  ensureEnum(req.interpretation, 'interp', ['normal','epileptiform_abnormalities','encephalopathy','focal_dysfunction','other']);
  ensureEnum(req.recommendation, 'rec', ['mri_consideration','continue_observation','medication_change','video_eeg','repeat_eeg','ambulatory_eeg','none','other']);
  let status;
  if (req.interpretation === 'epileptiform_abnormalities' && req.ictal_pattern === 'subclinical') status = 'subclinical_seizures_treat';
  else if (req.eeg_finding === 'epileptiform_focal' && req.ictal_pattern === 'absent') status = 'epileptiform_focal_no_seizure_review';
  else if (req.interpretation === 'normal' && req.recommendation !== 'continue_observation') status = 'normal_eeg_observation_appropriate';
  else status = 'eeg_review_appropriate';
  return { status, i: req.interpretation };
}

function funcs() { return { epilepsy_diagnosis, asm_selection, status_epilepticus, epilepsy_surgery, eeg_review }; }
module.exports = { funcs, ValidationError };