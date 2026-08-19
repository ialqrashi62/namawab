// filepath: tier147_rad_697_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['head','neck','chest','abdomen','pelvis','spine','upper_extremity','lower_extremity','cardiac','coronary_cta','cta_head','cta_neck','cta_chest','cta_abdo','cta_runoff','ct_perfusion','ct_urography','ct_enterography','ct_colonography','ct_dental','ct_temporal_bone','ct_sinus','ct_other']);
  ensureEnum(req.contrast, 'ct', ['non_contrast','oral','IV','oral_and_IV','rectal','other']);
  ensureNum(req.dose_mgy, 'ds');
  ensureNum(req.slice_mm, 'sl');
  ensureBool(req.contrast_reaction, 'cr');
  ensureEnum(req.findings_severity, 'fs', ['normal','mild','moderate','severe','critical','incidental','other']);
  ensureStr(req.indication, 'in');
  ensureStr(req.provider, 'pr');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, body_part: req.body_part, contrast: req.contrast };
}
function mri(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['brain','spine_cervical','spine_thoracic','spine_lumbar','msk_shoulder','msk_knee','msk_hip','msk_wrist','msk_ankle','abdomen','pelvis','prostate','breast','cardiac','mra_head','mra_neck','mra_abdo','mra_runoff','mrv','mr_spectroscopy','mr_perfusion','functional_mri','other']);
  ensureEnum(req.contrast, 'ct', ['non_contrast','gadolinium','gad_with_ferumoxytol','other']);
  ensureEnum(req.field_strength, 'fs', ['0.5T','1.0T','1.5T','3.0T','7.0T','unknown']);
  ensureNum(req.dose_mgy, 'ds');
  ensureBool(req.contrast_nephrogenic, 'cn');
  ensureBool(req.claustrophobia, 'cl');
  ensureStr(req.findings, 'fi');
  ensureStr(req.provider, 'pr');
  return { mr_id: `mr_${Date.now()}`, patient_id: req.patient_id, body_part: req.body_part, fs: req.field_strength };
}
function us(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['abdominal','renal','pelvic','obstetric','first_trimester','second_trimester','third_trimester','biophysical_profile','transvaginal','transrectal','thyroid','breast','vascular_carotid','vascular_arterial','vascular_venous','echo','msk','soft_tissue','Doppler','DVT','other']);
  ensureNum(req.ga_weeks, 'gw');
  ensureBool(req.fetal_heart_activity, 'fh');
  ensureNum(req.efw_grams, 'ef');
  ensureNum(req.bpd_mm, 'bp');
  ensureNum(req.ac_mm, 'ac');
  ensureEnum(req.findings, 'fi', ['normal','abnormal','follow_up','inconclusive','other']);
  ensureStr(req.provider, 'pr');
  return { us_id: `us_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function xray(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.view, 'vw', ['PA','AP','lateral','oblique','cross_table_lateral','decubitus','AP_supine','AP_erect','lateral_erect','special','portable','other']);
  ensureEnum(req.body_part, 'bp', ['chest','abdomen','pelvis','skull','cspine','tspine','lspine','shoulder','elbow','wrist','hand','hip','knee','ankle','foot','other']);
  ensureNum(req.kvp, 'kv');
  ensureNum(req.mas, 'ms');
  ensureEnum(req.findings, 'fi', ['normal','acute','chronic','acute_on_chronic','fracture','dislocation','effusion','pneumonia','mass','other']);
  ensureBool(req.portable, 'po');
  ensureStr(req.provider, 'pr');
  return { xr_id: `xry_${Date.now()}`, patient_id: req.patient_id, view: req.view, body_part: req.body_part };
}
function mammo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.view, 'vw', ['CC','MLO','ML','spot_compression','magnification','tomosynthesis','other']);
  ensureEnum(req.breast_density, 'bd', ['A_entirely_fatty','B_scattered','C_heterogeneously_dense','D_extremely_dense','unknown']);
  ensureEnum(req.birads, 'bi', ['0','1','2','3','4a','4b','4c','5','6','unknown']);
  ensureBool(req.tomosynthesis, 'to');
  ensureNum(req.num_lesions, 'nl');
  ensureEnum(req.recommendation, 'rc', ['routine','short_interval_followup','diagnostic_workup','biopsy','surgical_consult','other']);
  ensureStr(req.provider, 'pr');
  return { mm_id: `mam_${Date.now()}`, patient_id: req.patient_id, birads: req.birads, density: req.breast_density };
}

function funcs() { return { ct, mri, us, xray, mammo }; }
module.exports = { funcs, ValidationError };