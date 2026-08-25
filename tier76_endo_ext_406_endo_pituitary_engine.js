// filepath: tier76_endo_ext_406_endo_pituitary_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pituitary_incidentaloma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.finding_id, 'fid');
  ensureNum(req.size_mm, 'sm');
  ensureEnum(req.imaging_type, 'it', ['mri','ct','pet','mra','other']);
  ensureBool(req.hormonal_workup_complete, 'hwc');
  ensureNum(req.prolactin, 'prl');
  ensureNum(req.igf1, 'igf1');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.acth, 'acth');
  ensureBool(req.visual_field_defect, 'vfd');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { fid: req.finding_id };
}
function pituitary_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.prolactin, 'prl');
  ensureNum(req.igf1, 'igf1');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.acth, 'acth');
  ensureNum(req.cortisol_am, 'cor');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.lh, 'lh');
  ensureEnum(req.test_type, 'tt', ['full_pituitary','selective','initial','followup','other']);
  ensureBool(req.menstrual_irregularity, 'mi');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function prolactinoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.prolactin_level, 'pl');
  ensureNum(req.tumor_size_mm, 'tsm');
  ensureEnum(req.treatment, 'tx', ['cabergoline','bromocriptine','surgery','radiation','observation','combo','other','none']);
  ensureBool(req.responsive_to_dopamine_agonist, 'rda');
  ensureBool(req.visual_field_defect, 'vfd');
  ensureBool(req.bromocriptine_tried, 'bct');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function acromegaly(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.igf1_level, 'il');
  ensureEnum(req.gh_suppression_test, 'gst', ['failed','passed','inconclusive','not_done','other']);
  ensureNum(req.tumor_size_mm, 'tsm');
  ensureBool(req.surgical_intervention_planned, 'sip');
  ensureBool(req['pre_op_oct_rehab'], 'poo');
  ensureStr(req.cardiac_screening, 'cs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pituitary_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.approach, 'ap', ['endoscopic_transsphenoidal','microscopic_transsphenoidal','transcranial','endoscopic_extended','other','redo','minimally_invasive']);
  ensureBool(req.resection_complete, 'rc');
  ensureBool(req.csf_leak_post_op, 'csf');
  ensureBool(req.diabetes_insipidus_temporary, 'dit');
  ensureEnum(req.complications, 'comp', ['none','bleeding','csf_leak','meningitis','visual_loss','stroke','death','other']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}

function funcs() { return { pituitary_incidentaloma, pituitary_function, prolactinoma, acromegaly, pituitary_surgery }; }
module.exports = { funcs, ValidationError };