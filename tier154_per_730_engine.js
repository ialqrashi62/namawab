// filepath: tier154_per_730_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function perio_exam(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pocket_depth_avg, 'pd');
  ensureNum(req.pocket_depth_max, 'pm');
  ensureEnum(req.classification, 'cl', ['health','G_gingivitis','I_mild','II_moderate','III_severe','IV_advanced','NA','unknown']);
  ensureNum(req.bleeding_on_probing_pct, 'bp');
  ensureNum(req.plaque_index, 'pi');
  ensureNum(req.gingival_recession_mm, 'gr');
  ensureNum(req.mobility_count, 'mc');
  ensureNum(req.furcation_count, 'fc');
  ensureNum(req.tooth_loss_count, 'tl');
  ensureBool(req.smoker, 'sm');
  ensureBool(req.diabetes, 'db');
  ensureStr(req.provider, 'pr');
  return { pe_id: `pex_${Date.now()}`, patient_id: req.patient_id, class: req.classification };
}
function scaling(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['prophylaxis','full_mouth_disinfection','scaling_root_planing','quads','localized','perio_maintenance','gross_debridement','NA','other']);
  ensureNum(req.quadrants, 'qd');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.bleeding_score, 'bs');
  ensureBool(req.anesthesia, 'an');
  ensureEnum(req.anesthesia_type, 'at', ['none','topical','local_infiltration','nerve_block','combination','NA']);
  ensureBool(req.local_antibiotic, 'la');
  ensureBool(req.systemic_antibiotic, 'sa');
  ensureNum(req.healing_weeks, 'hw');
  ensureEnum(req.post_op_pain, 'po', ['none','mild','moderate','severe','NA']);
  ensureStr(req.provider, 'pr');
  return { sc_id: `scr_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function surgery_perio(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['flap','osseous_surgery','GTR','bone_graft','soft_tissue_graft','connective_tissue_graft','frenectomy','crown_lengthening','gingivectomy','gingivoplasty','ridge_augmentation','sinus_lift','implant','other','NA']);
  ensureStr(req.quadrant, 'qd');
  ensureNum(req.tooth_count, 'tc');
  ensureNum(req.graft_material_ml, 'gm');
  ensureEnum(req.graft_type, 'gt', ['none','autograft','allograft','xenograft','synthetic','combination','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.sutures, 'su');
  ensureBool(req.membrane, 'mb');
  ensureNum(req.healing_weeks, 'hw');
  ensureStr(req.provider, 'pr');
  return { ps_id: `psg_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function implant(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.system, 'sy', ['Nobel_Biocare','Straumann','Zimmer_Biomet','Dentsply_Sirona','BioHorizons','MIS','Hiossen','Neodent','other','NA']);
  ensureNum(req.implant_count, 'ic');
  ensureNum(req.length_mm, 'ln');
  ensureNum(req.diameter_mm, 'dm');
  ensureEnum(req.bone_quality, 'bq', ['I_dense','II_normal','III_soft','IV_very_soft','NA']);
  ensureNum(req.torque_ncm, 'tq');
  ensureBool(req.bone_graft, 'bg');
  ensureBool(req.sinus_lift, 'sl');
  ensureNum(req.healing_months, 'hm');
  ensureBool(req.osteointegrated, 'oi');
  ensureStr(req.provider, 'pr');
  return { im_id: `imp_${Date.now()}`, patient_id: req.patient_id, count: req.implant_count };
}
function maintenance(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.recall_interval_months, 'rm');
  ensureNum(req.last_visit_days, 'lv');
  ensureBool(req.compliant, 'cm');
  ensureNum(req.pocket_depth_change, 'pc');
  ensureNum(req.bleeding_pct_change, 'bc');
  ensureEnum(req.stability, 'st', ['stable','improving','worsening','mixed','NA','unknown']);
  ensureBool(req.needs_resurgery, 'nr');
  ensureBool(req.tooth_loss_since_last, 'tl');
  ensureNum(req.tooth_loss_count, 'tc');
  ensureStr(req.provider, 'pr');
  return { mt_id: `mnt_${Date.now()}`, patient_id: req.patient_id, interval: req.recall_interval_months };
}

function funcs() { return { perio_exam, scaling, surgery_perio, implant, maintenance }; }
module.exports = { funcs, ValidationError };