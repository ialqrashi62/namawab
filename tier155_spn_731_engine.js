// filepath: tier155_spn_731_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function disc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.level, 'lv', ['cervical','thoracic','lumbosacral','l4_5','l5_s1','c5_6','c6_7','multilevel']);
  ensureEnum(req.type, 'tp', ['herniation','bulge','degeneration','sequestration','extrusion','protrusion','NA']);
  ensureNum(req.size_mm, 'sz');
  ensureEnum(req.side, 'si', ['central','paracentral_left','paracentral_right','foraminal_left','foraminal_right','far_lateral_left','far_lateral_right','bilateral','NA']);
  ensureNum(req.pain_radicular, 'pr');
  ensureNum(req.motor_deficit, 'md');
  ensureNum(req.sensory_deficit, 'sd');
  ensureNum(req.mri_signal, 'ms');
  ensureBool(req.conservative_trial, 'ct');
  ensureEnum(req.response, 'rs', ['improved','no_change','worsening','pending','NA']);
  ensureStr(req.provider, 'pr');
  return { dc_id: `dsc_${Date.now()}`, patient_id: req.patient_id, level: req.level };
}
function fusion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.approach, 'ap', ['anterior_ALIF','lateral_LLIF','posterior_PLIF','TLIF','XLIF','OLIF','360_fusion','MIS','endoscopic','NA']);
  ensureEnum(req.level, 'lv', ['cervical','thoracic','lumbosacral','l4_5','l5_s1','c5_6','c6_7','multilevel','NA']);
  ensureNum(req.levels, 'ls');
  ensureNum(req.graft_material_ml, 'gm');
  ensureEnum(req.graft_type, 'gt', ['none','autograft_bone','allograft','BMP','synthetic','stem_cells','combination','NA']);
  ensureEnum(req.hardware, 'hw', ['pedicle_screws','lateral_plate','cage','rods','cervical_plate','combination','NA']);
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureEnum(req.approach_access, 'aa', ['open','minimally_invasive','endoscopic','robotic','NA']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { fn_id: `fsn_${Date.now()}`, patient_id: req.patient_id, approach: req.approach };
}
function deformity(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.condition, 'cn', ['scoliosis','kyphosis','scheuermann','spondylolisthesis','flatback','ankylosing_spondylitis','post_trauma','adult_deformity','NA']);
  ensureNum(req.cobb_angle, 'ca');
  ensureNum(req.sva_mm, 'sv');
  ensureNum(req.pelvic_tilt, 'pt');
  ensureNum(req.sacral_slope, 'ss');
  ensureEnum(req.srs_classification, 'sc', ['thoracic','thoracolumbar','lumbar','double_major','triple','NA','unknown']);
  ensureEnum(req.surgical_plan, 'sp', ['posterior_only','anterior_posterior','growing_rods','tether','fusion','osteotomy','NA']);
  ensureNum(req.planned_levels, 'pl');
  ensureNum(req.estimated_blood_loss, 'eb');
  ensureNum(req.planned_correction_degrees, 'pc');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { df_id: `dfm_${Date.now()}`, patient_id: req.patient_id, condition: req.condition };
}
function tumor_spine(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lc', ['vertebral_body','posterior_element','intradural_extramedullary','intramedullary','epidural','paraspinal','NA']);
  ensureEnum(req.pathology, 'pa', ['metastasis','primary_bone','meningioma','schwannoma','glioma','lymphoma','myeloma','plasmacytoma','GCT','other','NA']);
  ensureEnum(req.treatment, 'tr', ['en_bloc','intralesional','separation_surgery','SBRT','conventional_RT','chemo','observation','other','NA']);
  ensureNum(req.levels_instrumented, 'li');
  ensureBool(req.spinal_cord_compression, 'sc');
  ensureNum(req.frankel_score, 'fs');
  ensureBool(req.stabilization, 'st');
  ensureBool(req.reconstruction, 'rc');
  ensureNum(req.ebl_ml, 'eb');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { ts_id: `tsp_${Date.now()}`, patient_id: req.patient_id, pathology: req.pathology };
}
function outcome_spine(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.od_score, 'od');
  ensureNum(req.vas_back, 'vb');
  ensureNum(req.vas_leg, 'vl');
  ensureNum(req.oswestry_score, 'os');
  ensureNum(req.complications, 'cp');
  ensureNum(req.revision_surgery, 'rs');
  ensureNum(req.prom_score, 'pr');
  ensureNum(req.satisfaction, 'sa');
  ensureNum(req.months_post_op, 'mp');
  ensureBool(req.recovery_achieved, 'ra');
  ensureStr(req.provider, 'pr');
  return { os_id: `spo_${Date.now()}`, patient_id: req.patient_id, od: req.od_score };
}

function funcs() { return { disc, fusion, deformity, tumor_spine, outcome_spine }; }
module.exports = { funcs, ValidationError };