// filepath: tier51_dermatology_ext_290_derm_neo_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function melanoma_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['superficial_spreading','nodular','lentigo_maligna','acral_lentiginous','desmoplastic']);
  ensureNum(req.breslow_mm, 'br');
  ensureStr(req.clark_level, 'cl');
  ensureStr(req.sentinel_node, 'sn');
  ensureBool(req.ulceration, 'ul');
  ensureNum(req.mitotic_rate, 'mr');
  ensureNum(req.follow_up, 'fu');
  return { type: req.type, breslow: req.breslow_mm };
}
function bcc_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['nodular','superficial','morphoeic','micronodular','infiltrative']);
  ensureStr(req.site, 'site');
  ensureNum(req.size_mm, 'sz');
  ensureBool(req.high_risk_features, 'hr');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.follow_up_months, 'fu');
  return { type: req.type, size: req.size_mm };
}
function scc_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureNum(req.size_mm, 'sz');
  ensureNum(req.depth_invasion_mm, 'depth');
  ensureBool(req.high_risk, 'hr');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.lymph_node, 'ln');
  return { site: req.site, depth: req.depth_invasion_mm };
}
function lymphoma_cutaneous(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['mfctcl_suspected','patch_stage_plaque','tumor_stage','folliculotropic','pagetoid_reticulosis','seary_syndrome']);
  ensureStr(req.stage, 'stage');
  ensureStr(req.biopsy_planned, 'bx');
  ensureStr(req.follow_up, 'fu');
  return { type: req.type, stage: req.stage };
}
function kaposi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hiv_status, 'hiv');
  ensureEnum(req.type, 'typ', ['cutaneous_patches_plaques','nodular','visceral','oral','classic_mediterranean','endemic_african']);
  ensureStr(req.chemo, 'chemo');
  ensureStr(req.follow_up, 'fu');
  return { type: req.type };
}

function funcs() { return { melanoma_skin, bcc_skin, scc_skin, lymphoma_cutaneous, kaposi }; }
module.exports = { funcs, ValidationError };