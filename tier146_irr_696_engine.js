// filepath: tier146_irr_696_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function biopsy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.target, 'ta', ['liver','lung','kidney','breast','lymph_node','thyroid','bone','soft_tissue','pancreas','spleen','adrenal','prostate','other']);
  ensureEnum(req.modality, 'mo', ['CT','US','MRI','fluoro','PET','stereotactic','other']);
  ensureNum(req.needle_gauge, 'ng');
  ensureNum(req.passes, 'ps');
  ensureNum(req.core_length_cm, 'cl');
  ensureBool(req.adequacy, 'ad');
  ensureBool(req.complications, 'cp');
  ensureStr(req.provider, 'pr');
  return { bi_id: `biy_${Date.now()}`, patient_id: req.patient_id, target: req.target, modality: req.modality };
}
function drain(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lc', ['pleural','peritoneal','pericardial','abscess','biliary','nephrostomy','chest','abdominal','pelvic','joint','other']);
  ensureNum(req.catheter_size_fr, 'cs');
  ensureNum(req.drainage_ml_initial, 'di');
  ensureNum(req.drainage_ml_24h, 'd24');
  ensureBool(req.pigtail, 'pg');
  ensureBool(req.successful, 'su');
  ensureBool(req.reaccumulation, 'ra');
  ensureStr(req.provider, 'pr');
  return { dr_id: `drn_${Date.now()}`, patient_id: req.patient_id, location: req.location, drainage: req.drainage_ml_initial };
}
function angio(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.vessel, 'vs', ['cerebral','carotid','aortic','renal','mesenteric','iliac','femoral','popliteal','subclavian','brachial','pulmonary','coronary','other']);
  ensureEnum(req.indication, 'in', ['aneurysm_embolization','AVM','bleed','stenosis','thrombosis','tumor_embo','preop','mapping','trauma','other']);
  ensureNum(req.contrast_ml, 'cn');
  ensureNum(req.fluoro_min, 'fm');
  ensureNum(req.dose_mgy, 'ds');
  ensureEnum(req.access, 'ac', ['femoral','radial','brachial','jugular','subclavian','other']);
  ensureStr(req.provider, 'pr');
  return { ag_id: `ang_${Date.now()}`, patient_id: req.patient_id, vessel: req.vessel, indication: req.indication };
}
function tace(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['HCC','liver_metastases','renal_tumor','other']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureNum(req.num_tumors, 'nt');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown']);
  ensureEnum(req.bclc_stage, 'bc', ['0','A','B','C','D','unknown']);
  ensureEnum(req.embolization_agent, 'ea', ['doxorubicin_DEB','irinotecan_DEB','Y90','Lipiodol','PVA','beads','other']);
  ensureNum(req.response_mRECIST, 'mr');
  ensureStr(req.provider, 'pr');
  return { tc_id: `tce_${Date.now()}`, patient_id: req.patient_id, indication: req.indication, child: req.child_pugh };
}
function radiofrequency(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.target, 'ta', ['liver','lung','kidney','bone','thyroid','adrenal','breast','prostate','other']);
  ensureNum(req.lesion_size_cm, 'ls');
  ensureNum(req.num_lesions, 'nl');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.max_temp_c, 'mt');
  ensureNum(req.kw_used, 'kw');
  ensureBool(req.complete_ablation, 'ca');
  ensureBool(req.complications, 'cp');
  ensureStr(req.provider, 'pr');
  return { rf_id: `rfq_${Date.now()}`, patient_id: req.patient_id, target: req.target, size: req.lesion_size_cm };
}

function funcs() { return { biopsy, drain, angio, tace, radiofrequency }; }
module.exports = { funcs, ValidationError };