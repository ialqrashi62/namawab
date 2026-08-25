// filepath: tier76_endo_ext_405_endo_adrenal_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function adrenal_incidentaloma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.finding_id, 'fid');
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.imaging_characteristics, 'ic', ['lipid_rich','lipid_poor','indeterminate','mixed','calcified','hemorrhagic','cystic','other']);
  ensureBool(req.hormonal_workup_complete, 'hwc');
  ensureBool(req.pheochromocytoma_ruled_out, 'pro');
  ensureNum(req.aldosterone_renin_ratio, 'arr');
  ensureNum(req.cortisol_post_dex_suppression, 'cpds');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { fid: req.finding_id };
}
function adrenal_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureStr(req.symptoms, 'sym');
  ensureNum(req.plasma_metanephrines, 'pm');
  ensureNum(req['24h_urine_metanephrines'], '24um');
  ensureNum(req.aldosterone_plasma, 'ap');
  ensureNum(req.plasma_renin, 'pr');
  ensureNum(req.cortisol_am, 'ca');
  ensureNum(req.dex_suppression_test, 'dst');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { wid: req.workup_id };
}
function adrenal_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureStr(req.procedure, 'proc');
  ensureEnum(req.side, 'side', ['right','left','bilateral','right_partial','left_partial','unknown','other']);
  ensureStr(req.indication, 'ind');
  ensureEnum(req.surgical_approach, 'sa', ['laparoscopic','open','robotic','retroperitoneal','thoracoabdominal','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','organ_injury','cardiac_event','thromboembolism','death','other']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.post_op_followup, 'pof');
  return { sid: req.surgery_id };
}
function cushings_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureStr(req.suspicion, 'sus');
  ensureNum(req.late_night_salivary_cortisol, 'lnsc');
  ensureNum(req.dex_suppression_test, 'dst');
  ensureNum(req.acth_level, 'al');
  ensureStr(req.imaging_ordered, 'io');
  ensureStr(req.exogenous_steroid_history, 'esh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { wid: req.workup_id };
}
function adrenal_insufficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.am_cortisol, 'ac');
  ensureNum(req.acth_stimulation_test, 'ast');
  ensureNum(req.duration_years, 'dy');
  ensureStr(req.current_meds, 'cm');
  ensureBool(req.stress_dose_reviewed, 'sdr');
  ensureBool(req.emergency_injection_prescribed, 'eip');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { adrenal_incidentaloma, adrenal_workup, adrenal_surgery, cushings_workup, adrenal_insufficiency }; }
module.exports = { funcs, ValidationError };