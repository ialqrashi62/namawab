// filepath: tier35_rheumatology_ext_212_spine_engine.js
// TIER35_RHEUMATOLOGY-212: Spondyloarthritis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ankylosing_spondylitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureBool(req.sacroiliac_inflammation, 'si');
  ensureEnum(req.hla_b27, 'hla', ['positive','negative','not_done']);
  ensureNumber(req.basdai, 'basdai');
  ensureBool(req.spinal_fusion_present, 'fusion');
  let status;
  if (req.hla_b27 === 'positive' && req.sacroiliac_inflammation && req.basdai >= 4) status = 'as_active_biologic_indicated';
  else if (req.spinal_fusion_present) status = 'as_advanced_fusion_disease';
  else if (req.basdai < 2 && req.sacroiliac_inflammation) status = 'as_low_disease_activity';
  else if (req.age > 45 && !req.sacroiliac_inflammation) status = 'late_onset_as_review';
  else status = 'as_review_appropriate';
  return { status, age: req.age };
}

function axial_spondyloarthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.imaging, 'img', ['mri_positive','mri_negative','xray_positive','xray_negative','equivocal','other']);
  ensureEnum(req.symptoms, 'sym', ['inflammatory_back_pain','mechanical_back_pain','mixed','other']);
  ensureEnum(req.nsaids_response, 'nsaid', ['excellent','good','partial','poor','none','unknown']);
  ensureBool(req.biologic_indicated, 'bio');
  let status;
  if (req.imaging === 'mri_positive' && req.nsaids_response === 'poor' && req.biologic_indicated) status = 'axspa_biologic_tnf_initiate';
  else if (req.imaging === 'mri_positive' && req.symptoms === 'inflammatory_back_pain') status = 'axspa_classified';
  else if (req.nsaids_response === 'excellent' && !req.biologic_indicated) status = 'axspa_nsaid_response_maintain';
  else if (req.imaging === 'xray_negative' && req.imaging === 'mri_negative') status = 'axspa_imaging_negative_review';
  else status = 'axspa_review_appropriate';
  return { status, img: req.imaging };
}

function psoriatic_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.psoriasis_severity, 'psor', ['mild','moderate','severe','unknown']);
  ensureNumber(req.joint_count, 'jc');
  ensureBool(req.axial_involvement, 'axial');
  ensureEnum(req.biologic_started, 'bio', ['none','secukinumab','adalimumab','etanercept','ustekinumab','guselkumab','ixekizumab','risankizumab','other']);
  ensureEnum(req.response, 'resp', ['remission','partial','stable','worsening','unknown']);
  let status;
  if (req.psoriasis_severity === 'severe' && req.joint_count >= 5 && req.biologic_started === 'none') status = 'severe_psa_initiate_biologic';
  else if (req.axial_involvement && req.response === 'worsening') status = 'axial_psa_worsening_switch';
  else if (req.response === 'remission' && req.biologic_started !== 'none') status = 'psa_remission_maintain';
  else if (req.joint_count < 3 && req.biologic_started === 'none') status = 'oligoarticular_psa_nsaid_review';
  else status = 'psa_review_appropriate';
  return { status, j: req.joint_count };
}

function reactive_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.trigger, 'trig', ['gi_infection','gu_infection','respiratory','unknown','other']);
  ensureBool(req.oligoarticular, 'oligo');
  ensureBool(req.urethritis, 'ureth');
  ensureBool(req.conjunctivitis, 'conj');
  ensureEnum(req.chronicity, 'chr', ['acute','subacute','chronic','unknown']);
  ensureEnum(req.treatment, 'rx', ['nsaids','steroids','dmards','biologic','combination','none','other']);
  let status;
  if (req.chronicity === 'chronic' && req.treatment === 'nsaids') status = 'chronic_reactive_escalate_dmards';
  else if (req.chronicity === 'acute' && req.treatment === 'nsaids') status = 'acute_reactive_nsaid_appropriate';
  else if (req.chronicity === 'acute' && req.treatment === 'dmards') status = 'acute_reactive_dmards_premature';
  else status = 'reactive_arthritis_review';
  return { status, c: req.chronicity };
}

function enteropathic_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ibd_type, 'type', ['crohns','uc','ibd_unspecified']);
  ensureBool(req.peripheral_arthritis, 'peri');
  ensureBool(req.spondylitis, 'spon');
  ensureBool(req.flare_synced, 'sync');
  ensureEnum(req.treatment, 'rx', ['nsaids','steroids','tnf_inhibitor','ustekinumab','risankizumab','combination','none','other']);
  let status;
  if (req.flare_synced && req.treatment === 'nsaids') status = 'flare_synced_nsaid_alone_treat_ibd';
  else if (req.spondylitis && req.treatment !== 'tnf_inhibitor') status = 'spondylitis_tnf_indicated';
  else if (req.treatment === 'nsaids' && req.ibd_type === 'crohns') status = 'nsaid_crohns_exacerbation_risk';
  else status = 'enteropathic_review';
  return { status, t: req.treatment };
}

function funcs() { return { ankylosing_spondylitis, axial_spondyloarthritis, psoriatic_arthritis, reactive_arthritis, enteropathic_arthritis }; }
module.exports = { funcs, ValidationError };