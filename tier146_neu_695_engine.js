// filepath: tier146_neu_695_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function craniotomy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['tumor_resection','aneurysm_clip','AVM_resection','hematoma_evacuation','trauma_decompression','tumor_biopsy','skull_base','transsphenoidal','awake_craniotomy','other']);
  ensureEnum(req.approach, 'ap', ['pterional','frontal','parietal','temporal','occipital','suboccipital','retrosigmoid','transsphenoidal','interhemispheric','awake','minimally_invasive','other']);
  ensureNum(req.duration_hr, 'dh');
  ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.position, 'po', ['supine','prone','lateral_decubitus','sitting','park_bench','three_quarter_prone','other']);
  ensureBool(req.neuronavigation, 'nn');
  ensureBool(req.awake, 'aw');
  ensureNum(req.gcs_post, 'gp');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { cr_id: `crn_${Date.now()}`, patient_id: req.patient_id, indication: req.indication, approach: req.approach };
}
function spine_op(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['ACDF','PCDF','laminectomy','laminoplasty','discectomy','fusion','foraminotomy','kyphoplasty','vertebroplasty','spinal_cord_stim','decompression','stabilization','MIS','other']);
  ensureNum(req.levels, 'lv');
  ensureEnum(req.cervical_thoracic_lumbar, 'ct', ['cervical','thoracic','lumbar','sacral','multilevel','cervicothoracic','thoracolumbar','lumbosacral','occipitocervical']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureNum(req.motor_evoked, 'me');
  ensureBool(req.neuromonitoring, 'nm');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { sp_id: `spn_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure, levels: req.levels };
}
function vp_shunt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['VPS','LPS','VA_shunt','VP_with_anti_siphon','programmable','fixed_pressure','cyst_peritoneal','other']);
  ensureNum(req.opening_pressure, 'op');
  ensureNum(req.drainage_amount_ml, 'da');
  ensureBool(req.revision, 'rv');
  ensureNum(req.shunt_series, 'ss');
  ensureEnum(req.indication, 'in', ['NPH','hydrocephalus','pseudotumor','intracranial_hypertension','post_hemorrhagic','post_infectious','tumor','congenital','other']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { vs_id: `vps_${Date.now()}`, patient_id: req.patient_id, type: req.type, opening_pressure: req.opening_pressure };
}
function intracranial_monitor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['EVD','ICP_bolt','Licox','microdialysis','jugular_bulb','other']);
  ensureNum(req.opening_pressure, 'op');
  ensureNum(req.max_pressure_24h, 'mp');
  ensureNum(req.min_pressure_24h, 'mn');
  ensureEnum(req.treatment_threshold, 'th', ['10','15','20','25','30','other']);
  ensureNum(req.drainage_ml, 'dm');
  ensureNum(req.days_in_place, 'di');
  ensureEnum(req.infection, 'in', ['none','suspected','confirmed','other']);
  ensureStr(req.provider, 'pr');
  return { im_id: `icm_${Date.now()}`, patient_id: req.patient_id, type: req.type, max_pressure: req.max_pressure_24h };
}
function skull_base(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.approach, 'ap', ['transsphenoidal','translabyrinthine','retrosigmoid','presigmoid','frontotemporal_orbitozygomatic','subtemporal','transpetrous','transclival','endoscopic_endonasal','other']);
  ensureEnum(req.indication, 'in', ['pituitary_adenoma','craniopharyngioma','meningioma','schwannoma','chordoma','aneurysm','CSF_leak','other']);
  ensureNum(req.duration_hr, 'dh');
  ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.csf_leak_repair, 'cl');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { sb_id: `skb_${Date.now()}`, patient_id: req.patient_id, approach: req.approach, indication: req.indication };
}

function funcs() { return { craniotomy, spine_op, vp_shunt, intracranial_monitor, skull_base }; }
module.exports = { funcs, ValidationError };