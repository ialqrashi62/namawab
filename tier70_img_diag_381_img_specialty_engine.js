// filepath: tier70_img_diag_381_img_specialty_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cardiac_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['echo_complete','echo_limited','echo_tte','echo_tte_w_bubble','echo_stress','echo_dobutamine','echo_treadmill','mri_cardiac','ccta','mr_angiography','cardiac_pet','myocardial_perfusion','muga','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureEnum(req.wall_motion, 'wm', ['normal','mild_global_hypokinesis','mild_regional_hypokinesis','moderate_hypokinesis','severe_hypokinesis','akinetic','dyskinetic','aneurysmal','hyperkinetic','other']);
  ensureEnum(req.valve_function, 'vf', ['normal','mild_mitral_regurg','moderate_mitral_regurg','severe_mitral_regurg','mild_aortic_stenosis','moderate_aortic_stenosis','severe_aortic_stenosis','aortic_regurg','tricuspid_regurg','multiple','other']);
  ensureBool(req.pericardial_effusion, 'pe');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureStr(req.signed_at, 'sa');
  return { ef: req.ef_pct };
}
function neuro_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['mri_brain','mri_spine','ct_head','ct_perfusion','cta_head_neck','mrv_brain','mra_neck','fMRI','pet_brain','spect_brain','other']);
  ensureBool(req.tumor_present, 'tp');
  ensureBool(req.stroke_signs, 'ss');
  ensureEnum(req.white_matter_changes, 'wmc', ['none','mild','moderate','severe','unknown','fazekas_1','fazekas_2','fazekas_3','not_applicable','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureStr(req.signed_at, 'sa');
  ensureEnum(req.comparison_study, 'cs', ['none','prior_3m','prior_6m','prior_1y','prior_2y','multiple','other']);
  return { exam: req.exam_type };
}
function musculoskeletal_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['knee_mri','shoulder_mri','hip_mri','ankle_mri','elbow_mri','wrist_mri','spine_mri','foot_mri','bone_xray','joint_xray','joint_ct','musculoskeletal_pet','other']);
  ensureEnum(req.joint, 'joint', ['right_knee','left_knee','right_shoulder','left_shoulder','right_hip','left_hip','right_ankle','left_ankle','right_elbow','left_elbow','right_wrist','left_wrist','cervical','thoracic','lumbar','none','other']);
  ensureEnum(req.injury_type, 'it', ['acl_tear','mcl_tear','meniscus_tear','rotator_cuff_tear','labral_tear','fracture','dislocation','sprain','strain','effusion','normal','multiple','other']);
  ensureEnum(req.ligaments_status, 'ls', ['intact','partial_tear','complete_tear','acl_ruptured','mcl_ruptured','not_visualized','not_applicable','multiple','other']);
  ensureEnum(req.cartilage_status, 'cs', ['intact','thinned','grade_1','grade_2','grade_3','grade_4','focal_defect','not_visualized','not_applicable','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureStr(req.signed_at, 'sa');
  return { injury: req.injury_type };
}
function interventional_radiology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.procedure_type, 'pt', ['biopsy_ct_guided','biopsy_us_guided','biopsy_mri_guided','drainage','ablation','embolization','angioplasty','stent','thrombolysis','vertebroplasty','radiofrequency_ablation','chemoembolization','cryoablation','other']);
  ensureStr(req.target, 'target');
  ensureEnum(req.needle_approach, 'na', ['anterior','posterior','lateral','inferior','superior','medial','cranial','caudal','other']);
  ensureNum(req.specimens_collected, 'sc');
  ensureEnum(req.complications, 'comp', ['none','bleeding','pneumothorax','infection','pain','incomplete_procedure','arterial_injury','nerve_injury','contrast_reaction','other','multiple']);
  ensureStr(req.provider, 'pr');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.signed_at, 'sa');
  return { procedure: req.procedure_type };
}
function breast_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['mammo_screening','mammo_diagnostic','us_breast','mri_breast','biopsy_stereotactic','biopsy_us','biopsy_mri','galactogram','tomosynthesis','other']);
  ensureNum(req.birads_category, 'bc');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.findings, 'find');
  ensureBool(req.callback_required, 'cr');
  ensureEnum(req.family_history, 'fh', ['positive','negative','unknown','unknown_gene','brca_positive','strong','moderate','other']);
  ensureStr(req.provider, 'pr');
  ensureStr(req.signed_at, 'sa');
  return { birads: req.birads_category };
}

function funcs() { return { cardiac_imaging, neuro_imaging, musculoskeletal_imaging, interventional_radiology, breast_imaging }; }
module.exports = { funcs, ValidationError };