// filepath: tier35_rheumatology_ext_209_lupus_engine.js
// TIER35_RHEUMATOLOGY-209: SLE/Lupus
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sle_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.malar_rash, 'malar');
  ensureBool(req.photosensitivity, 'photo');
  ensureBool(req.oral_ulcers, 'ulcer');
  ensureBool(req.arthritis, 'arth');
  ensureBool(req.serositis, 'sero');
  ensureBool(req.renal, 'renal');
  ensureBool(req.ana_positive, 'ana');
  ensureNumber(req.anti_dsdna, 'dsdna');
  let status;
  if (req.renal && req.anti_dsdna >= 30) status = 'lupus_nephritis_suspected_biopsy';
  else if (req.malar_rash && req.photosensitivity && req.ana_positive) status = 'sle_diagnosed_classified';
  else if (req.anti_dsdna >= 200 && req.arthritis && req.ana_positive) status = 'high_dsdna_sle_review';
  else if (req.ana_positive && req.anti_dsdna < 30 && !req.malar_rash) status = 'ana_positive_dsdna_low_review_uctd';
  else status = 'sle_classification_review';
  return { status, ds: req.anti_dsdna };
}

function sle_disease_activity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sledai, 'sledai');
  ensureNumber(req.crp, 'crp');
  ensureNumber(req.anti_dsdna, 'dsdna');
  ensureNumber(req.c3, 'c3');
  ensureNumber(req.c4, 'c4');
  ensureEnum(req.flare_status, 'flare', ['remission','low','moderate','severe','very_severe','other']);
  ensureBool(req.treatment_needed, 'tx');
  let status;
  if (req.sledai >= 12) status = 'severe_flare_aggressive_treatment';
  else if (req.sledai >= 6 && req.sledai < 12 && req.treatment_needed) status = 'moderate_flare_optimize_immunosuppression';
  else if (req.sledai < 4 && !req.treatment_needed) status = 'remission_maintain';
  else if (req.c3 < 50 && req.anti_dsdna >= 100) status = 'complement_low_dsdna_high_active';
  else status = 'sle_activity_review';
  return { status, s: req.sledai };
}

function sle_renal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.proteinuria_g, 'prot');
  ensureNumber(req.creatinine, 'cr');
  ensureEnum(req.biopsy_class, 'cls', ['i','ii','iii','iv','v','vi','iii_v','iv_v','other','not_done']);
  ensureEnum(req.induction, 'ind', ['mycophenolate','cyclophosphamide','azathioprine','calcineurin_inhibitor','combination','none','other']);
  ensureEnum(req.response, 'resp', ['complete','partial','refractory','unknown']);
  ensureBool(req.hematuria, 'hema');
  let status;
  if (req.biopsy_class === 'iv' && req.creatinine > 2) status = 'class_iv_high_cr_aggressive_induction';
  else if (req.biopsy_class === 'v' && req.proteinuria_g >= 3) status = 'class_v_membranous_aggressive_immunosuppression';
  else if (req.response === 'refractory') status = 'refractory_nephritis_review_biologic';
  else if (req.hematuria && req.biopsy_class === 'not_done') status = 'active_urine_sediment_biopsy_indicated';
  else status = 'sle_renal_review';
  return { status, cls: req.biopsy_class };
}

function sle_neuropsychiatric(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.presentation, 'pres', ['seizure','psychosis','stroke','cognitive_dysfunction','headache','mood_disorder','demyelination','other']);
  ensureEnum(req.mri_findings, 'mri', ['normal','vasculitis','white_matter','infarct','atrophy','other']);
  ensureBool(req.csf_normal, 'csf');
  ensureNumber(req.anti_ribosomal_p, 'ribo');
  ensureBool(req.immunosuppression_intensified, 'imm');
  let status;
  if (req.presentation === 'psychosis' && !req.immunosuppression_intensified) status = 'npsle_psychosis_urgent_steroids';
  else if (req.presentation === 'stroke' && req.mri_findings === 'vasculitis') status = 'npsle_stroke_aggressive_anticoagulation';
  else if (req.presentation === 'seizure' && req.immunosuppression_intensified) status = 'npsle_seizure_treated_continue';
  else status = 'npsle_review_appropriate';
  return { status, pres: req.presentation };
}

function sle_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.pregnancy, 'wk');
  ensureBool(req.anti_ro_positive, 'ro');
  ensureBool(req.anti_la_positive, 'la');
  ensureBool(req.active_disease, 'active');
  ensureBool(req.medications_compatible, 'med_safe');
  ensureBool(req.monitoring_4_weeks, 'mon');
  let status;
  if (req.active_disease) status = 'active_sle_pregnancy_high_risk_review';
  else if (req.anti_ro_positive && req.anti_la_positive) status = 'neonatal_lupus_risk_fetal_monitoring';
  else if (!req.medications_compatible) status = 'incompatible_meds_review_obgyn_rheum';
  else if (req.monitoring_4_weeks && req.medications_compatible) status = 'sle_pregnancy_stable_continue';
  else status = 'sle_pregnancy_review';
  return { status, wk: req.pregnancy };
}

function funcs() { return { sle_classification, sle_disease_activity, sle_renal, sle_neuropsychiatric, sle_pregnancy }; }
module.exports = { funcs, ValidationError };