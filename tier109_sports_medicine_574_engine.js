// filepath: tier109_sports_medicine_574_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sports_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.sport, 'sp');
  ensureStr(req.injury, 'inj');
  ensureEnum(req.severity, 'sev', ['grade_1','grade_2','grade_3','complete_tear','mild','moderate','severe','other','unknown']);
  ensureEnum(req.side, 'sd', ['right','left','bilateral','midline','other','unknown']);
  ensureEnum(req.imaging, 'img', ['mri','ct','xray','ultrasound','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function injury_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.treatment_id, 'tid');
  ensureStr(req.injury, 'inj');
  ensureEnum(req.treatment, 'tx', ['reconstruction','repair','restoration','rehabilitation','conservative','other','unknown']);
  ensureEnum(req.approach, 'app', ['arthroscopic','open','minimally_invasive','percutaneous','other','unknown']);
  ensureStr(req.graft, 'gr');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.provider, 'pr');
  return { tid: req.treatment_id };
}
function rehabilitation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rehab_id, 'rid');
  ensureEnum(req.phase, 'ph', ['phase_1','phase_2','phase_3','phase_4','maintenance','other','unknown']);
  ensureNum(req.weeks_post_op, 'wpo');
  ensureNum(req.rom_degrees, 'rom');
  ensureNum(req.strength_pct, 'sp');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.adherence, 'adh');
  ensureStr(req.provider, 'pr');
  return { rid: req.rehab_id };
}
function return_to_play(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.clearance_id, 'cid');
  ensureNum(req.weeks_post_injury, 'wpi');
  ensureEnum(req.functional_tests, 'ft', ['y_balance','hop_test','isokinetic','functional_screen','other','unknown']);
  ensureNum(req.test_score, 'ts');
  ensureNum(req.cle_physician, 'cp');
  ensureNum(req.clearance_pct, 'clp');
  ensureStr(req.provider, 'pr');
  return { cid: req.clearance_id };
}
function concussion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.concussion_id, 'cid');
  ensureStr(req.mechanism, 'mech');
  ensureBool(req.loss_of_consciousness, 'loc');
  ensureStr(req.symptoms, 'sym');
  ensureNum(req.scat_score, 'sc');
  ensureEnum(req.return_protocol, 'rp', ['graduated','conservative','aggressive','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.concussion_id };
}

function funcs() { return { sports_assessment, injury_treatment, rehabilitation, return_to_play, concussion }; }
module.exports = { funcs, ValidationError };