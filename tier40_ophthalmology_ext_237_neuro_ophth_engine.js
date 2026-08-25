// filepath: tier40_ophthalmology_ext_237_neuro_ophth_engine.js
// TIER40_OPHTHALMOLOGY-237: Neuro-ophthalmology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function optic_neuritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.eye, 'eye', ['left','right','bilateral','other']);
  ensureEnum(req.mri_lesion, 'mri', ['periventricular','juxtacortical','infratentorial','spinal_cord','none','normal','other']);
  ensureStr(req.visual_acuity, 'va');
  ensureBool(req.iv_steroid_given, 'iv');
  ensureEnum(req.recovery, 'rec', ['excellent','improving','partial','stable','poor','unknown']);
  let status;
  if (req.eye === 'bilateral') status = 'bilateral_neuritis_nmosd_mog_review';
  else if (req.mri_lesion !== 'none' && req.mri_lesion !== 'normal' && req.recovery === 'excellent') status = 'ms_risk_dmt_refer_neuro';
  else if (req.iv_steroid_given === false) status = 'iv_steroid_initiate_for_neuritis';
  else if (req.recovery === 'poor') status = 'poor_recovery_consider_chronic_neuritis';
  else status = 'optic_neuritis_review';
  return { status, va: req.visual_acuity };
}

function papilledema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.bilateral, 'bil');
  ensureEnum(req.ct_venogram, 'ctv', ['normal','sinus_thrombosis','stenosis','mass','other']);
  ensureNumber(req.intracranial_pressure, 'icp');
  ensureEnum(req.treatment, 'rx', ['observation','acetazolamide','topiramate','furosemide','weight_loss','optic_nerve_sheath_fenestration','vp_shunt','combination','none','other']);
  ensureBool(req.weight_management, 'wt');
  let status;
  if (req.intracranial_pressure >= 35 && req.treatment === 'observation') status = 'severely_elevated_icp_urgent_treatment';
  else if (req.ct_venogram === 'sinus_thrombosis' && req.treatment === 'observation') status = 'sinus_thrombosis_anticoagulate';
  else if (req.weight_management === false && req.bilateral) status = 'weight_management_idiopathic_ii';
  else status = 'papilledema_review';
  return { status, icp: req.intracranial_pressure };
}

function visual_field_defect(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['bitemporal_hemianopia','homonymous_hemianopia','altitudinal','central_scotoma','arcuate','generalized_depression','junctional','other']);
  ensureEnum(req.mri_pituitary, 'mri', ['normal','macroadenoma','microadenoma','craniopharyngioma','glioma','stroke','unknown','not_done','other']);
  ensureEnum(req.hormonal_workup, 'horm', ['pending','normal','acromegaly','cushing','hyperprolactinemia','hypopituitarism','multiple','completed','other']);
  ensureBool(req.refer_neurosurgery, 'ref');
  let status;
  if (req.type === 'bitemporal_hemianopia' && req.mri_pituitary === 'macroadenoma' && req.hormonal_workup !== 'completed') status = 'macroadenoma_urgent_workup_refer';
  else if (req.type === 'homonymous_hemianopia') status = 'homonymous_hemianopia_stroke_workup';
  else if (req.refer_neurosurgery === false && req.mri_pituitary === 'macroadenoma') status = 'macroadenoma_neurosurgery_refer';
  else status = 'visual_field_review';
  return { status, t: req.type };
}

function double_vision(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['binocular','monocular','transient','persistent','other']);
  ensureEnum(req.onset, 'onset', ['acute','subacute','chronic','intermittent','unknown','other']);
  ensureEnum(req.cranial_nerve, 'cn', ['iii','iv','vi','multiple','internuclear','other']);
  ensureBool(req.pupil_involving, 'pupil');
  ensureEnum(req.aneurysm_workup, 'aneu', ['none','mra','cta','angiography','pending','complete','other']);
  let status;
  if (req.cranial_nerve === 'iii' && req.pupil_involving) status = 'pupil_involving_cn3_aneurysm_urgent_imaging';
  else if (req.cranial_nerve === 'vi' && req.onset === 'acute') status = 'acute_cn6_palsy_stroke_tumor_review';
  else if (req.cranial_nerve === 'iii' && req.pupil_involving === false && req.aneurysm_workup === 'none') status = 'pupil_sparing_cn3_microvascular_likely';
  else status = 'double_vision_review';
  return { status, t: req.type };
}

function anterior_ischemic_optic_neuropathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.eye, 'eye', ['left','right','bilateral','other']);
  ensureEnum(req.type, 'type', ['arteritic','non_arteritic','other']);
  ensureNumber(req.esr, 'esr');
  ensureBool(req.prednisone_started, 'pred');
  ensureNumber(req.dose_mg, 'dose');
  ensureBool(req.biopsy_temporal_artery_planned, 'biopsy');
  let status;
  if (req.type === 'arteritic' && req.prednisone_started === false) status = 'gca_arteritic_iv_steroids_immediate';
  else if (req.esr >= 70 && req.prednisone_started && req.dose_mg < 40) status = 'high_esr_steroid_dose_increase';
  else if (req.type === 'arteritic' && req.prednisone_started && req.biopsy_temporal_artery_planned === false) status = 'arteritic_aion_tab_2_weeks';
  else if (req.type === 'non_arteritic' && req.prednisone_started) status = 'non_arteritic_steroid_no_benefit_review';
  else status = 'aion_review';
  return { status, t: req.type };
}

function funcs() { return { optic_neuritis, papilledema, visual_field_defect, double_vision, anterior_ischemic_optic_neuropathy }; }
module.exports = { funcs, ValidationError };