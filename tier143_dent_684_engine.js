// filepath: tier143_dent_684_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tooth_chart(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.tooth_id, 'ti');
  ensureNum(req.tooth_number, 'tn');
  ensureEnum(req.condition, 'cn', ['healthy','caries','filled','crown','root_canal','missing','implant','fracture','mobility','rotated','intruded','other']);
  ensureEnum(req.surface, 'sf', ['mesial','distal','occlusal','buccal','lingual','incisal','cervical','multiple','full']);
  ensureNum(req.depth, 'dp');
  ensureBool(req.symptomatic, 'sm');
  ensureStr(req.provider, 'pr');
  return { tc_id: `tc_${Date.now()}`, patient_id: req.patient_id, tooth: req.tooth_number, condition: req.condition };
}
function period(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pocket_4mm, 'p4');
  ensureNum(req.pocket_5mm, 'p5');
  ensureNum(req.pocket_6mm, 'p6');
  ensureNum(req.pocket_7mm_plus, 'p7');
  ensureNum(req.bleeding_pct, 'bp');
  ensureNum(req.plaque_pct, 'pp');
  ensureNum(req.recession, 'rc');
  ensureEnum(req.stage, 'st', ['0','1','2','3','4_grave','stable','maintenance','other']);
  ensureEnum(req.grade, 'gd', ['A','B','C','other']);
  ensureStr(req.provider, 'pr');
  return { pd_id: `pd_${Date.now()}`, patient_id: req.patient_id, stage: req.stage, grade: req.grade };
}
function caries(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.tooth_id, 'ti2');
  ensureEnum(req.severity, 'sv', ['incipient','moderate','deep','pulpal','arrested','recurrent','other']);
  ensureEnum(req.surface_loc, 'sl', ['pit_fissure','proximal','cervical','root','smooth','other']);
  ensureBool(req.symptomatic, 'sm');
  ensureStr(req.treatment, 'tr');
  ensureStr(req.provider, 'pr');
  return { ca_id: `ca_${Date.now()}`, patient_id: req.patient_id, tooth: req.tooth_id, severity: req.severity };
}
function ortho(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.malocclusion, 'mo', ['class_I','class_II_div_1','class_II_div_2','class_III','open_bite','deep_bite','crossbite','spacing','crowding','other']);
  ensureNum(req.treatment_months, 'tm');
  ensureEnum(req.appliance, 'ap', ['braces','invisalign','lingual','headgear','expander','retainer','herbst','twin_block','other']);
  ensureBool(req.elastic, 'el');
  ensureNum(req.progress_pct, 'pp');
  ensureStr(req.provider, 'pr');
  return { or_id: `or_${Date.now()}`, patient_id: req.patient_id, months: req.treatment_months, progress: req.progress_pct };
}
function implant(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.position, 'po');
  ensureEnum(req.system, 'sy', ['Straumann','Nobel','Astra_Tech','Zimmer','Biohorizons','Ankylos','MIS','other']);
  ensureNum(req.diameter_mm, 'dm');
  ensureNum(req.length_mm, 'lm');
  ensureEnum(req.stage, 'st', ['planned','placed','osseointegration','loading','restoration','failed','salvage','maintenance']);
  ensureNum(req.bone_density, 'bd');
  ensureStr(req.provider, 'pr');
  return { im_id: `im_${Date.now()}`, patient_id: req.patient_id, position: req.position, system: req.system };
}

function funcs() { return { tooth_chart, period, caries, ortho, implant }; }
module.exports = { funcs, ValidationError };
