// filepath: tier52_rehabilitation_ext_294_rehab_ot_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function adl_training(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.area, 'ar', ['bathing_dressing','toileting','feeding','grooming','functional_mobility','home_management']);
  ensureEnum(req.level_assistance, 'la', ['dependent','max_assist','mod_assist','min_assist','contact_guard','set_up','independent']);
  ensureStr(req.goal, 'gl');
  ensureEnum(req.progress, 'pr', ['rapid','steady','slow','plateau']);
  ensureNum(req.discharge_weeks, 'dw');
  return { area: req.area, progress: req.progress };
}
function hand_therapy_upper_limb(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.condition, 'cond');
  ensureNum(req.weeks_post_op, 'wpo');
  ensureStr(req.rom_wrist, 'rom');
  ensureNum(req.grip_strength_kg, 'gs');
  ensureEnum(req.edema, 'ed', ['none','mild','moderate','severe']);
  ensureStr(req.therapy, 'tx');
  return { rom: req.rom_wrist, grip: req.grip_strength_kg };
}
function cognitive_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cognition_domain, 'cd', ['memory_attention','executive_function','visuospatial','language','social_cognition','mixed']);
  ensureNum(req.mmse, 'mmse');
  ensureStr(req.deficits, 'def');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['improving','stable','plateau','worsening']);
  return { mmse: req.mmse };
}
function splinting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.splint_type, 'st', ['resting_hand_splint','wrist_cock_up','thumb_spica','ulnar_gutter','long_arm','dynamic','static_progressive']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.fabrication_date, 'fd');
  ensureStr(req.wear_schedule, 'ws');
  ensureNum(req.follow_up_weeks, 'fu');
  return { splint_type: req.splint_type };
}
function work_hardening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.program_weeks, 'pw');
  ensureStr(req.simulated_duties, 'sd');
  ensureBool(req.fce_passed, 'fce');
  ensureEnum(req.return_to_work, 'rtw', ['full_unrestricted','full_with_restrictions','modified_duties','off_work','vocational_rehab_referred']);
  ensureStr(req.outcome, 'out');
  return { program_weeks: req.program_weeks };
}

function funcs() { return { adl_training, hand_therapy_upper_limb, cognitive_rehab, splinting, work_hardening }; }
module.exports = { funcs, ValidationError };