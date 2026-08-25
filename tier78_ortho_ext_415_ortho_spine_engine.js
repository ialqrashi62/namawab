// filepath: tier78_ortho_ext_415_ortho_spine_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function spine_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.spine_level, 'sl');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.oswestry_index, 'oi');
  ensureBool(req.red_flags, 'rf');
  ensureStr(req.neurological_exam, 'ne');
  ensureStr(req.imaging_review, 'ir');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function discectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureStr(req.level, 'lvl');
  ensureEnum(req.approach, 'ap', ['open','microscopic','tubular','endoscopic','anterior','lateral','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureBool(req.neurological_improvement, 'ni');
  ensureEnum(req.complications, 'comp', ['none','dural_tear','nerve_root_injury','infection','hematoma','recurrence','other']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.discharge_plan, 'dp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function spinal_fusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureStr(req.levels, 'lvl');
  ensureEnum(req.approach, 'ap', ['anterior','posterior','lateral','combined','tlif','plif','olif','xlif','other']);
  ensureStr(req.hardware, 'hw');
  ensureNum(req.estimated_blood_loss, 'ebl');
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.bone_graft, 'bg', ['autograft','allograft','synthetic','bmp','combo','other']);
  ensureEnum(req.complications, 'comp', ['none','infection','hardware_loosening','pseudarthrosis','adjacent_segment','other']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.rehab_plan, 'rp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function spine_fracture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.level, 'lvl');
  ensureEnum(req.fracture_type, 'ft', ['compression','burst','flexion_distraction','translational','odontoid','hangman','tl_burst','other']);
  ensureEnum(req.neurological_status, 'ns', ['intact','incomplete_cord','complete_cord','cauda_equina','conus_medullaris','other']);
  ensureBool(req.bracing_required, 'br');
  ensureBool(req.surgical_indicated, 'si');
  ensureEnum(req.tl_classification, 'tl', ['a1','a2','a3','a4','b1','b2','b3','c1','c2','c3','n0','n1','n2','n3','m1','other']);
  ensureStr(req.plan, 'plan');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function scoliosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cobb_angle, 'ca');
  ensureEnum(req.skeletal_maturity, 'sm', ['immature','mature','unknown']);
  ensureBool(req.bracing_prescribed, 'bp');
  ensureNum(req.brace_hours_per_day, 'bhd');
  ensureBool(req.surgical_discussed, 'sd');
  ensureNum(req.progression_deg_per_year, 'pdy');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureStr(req.scheduled_followup, 'sf');
  return { vid: req.visit_id };
}

function funcs() { return { spine_clinic, discectomy, spinal_fusion, spine_fracture, scoliosis }; }
module.exports = { funcs, ValidationError };