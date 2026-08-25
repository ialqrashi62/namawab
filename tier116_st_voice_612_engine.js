// filepath: tier116_st_voice_612_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function articulation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.sound, 'snd');
  ensureNum(req.accuracy_pre, 'ap');
  ensureNum(req.accuracy_post, 'apo');
  ensureNum(req.trials, 'tri');
  ensureEnum(req.cueing, 'cug', ['none','minimal','moderate','maximal','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function language_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['receptive','expressive','mixed','other','unknown']);
  ensureEnum(req.modality, 'md', ['play_based','tablet','flashcards','conversation','book','other','unknown']);
  ensureNum(req.targets, 'tgt');
  ensureNum(req.accuracy_pre, 'ap');
  ensureNum(req.accuracy_post, 'apo');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function voice_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.voice_type, 'vt', ['dysphonia','aphonia','puberphonia','paradoxical','functional','organic','other','unknown']);
  ensureNum(req.tasks, 'tsk');
  ensureNum(req.baseline_hz, 'bh');
  ensureNum(req.target_hz, 'th');
  ensureNum(req.perceived_effort, 'pe');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function cognitive_communication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.area, 'ar', ['attention','memory','executive','social','pragmatic','other','unknown']);
  ensureNum(req.tasks, 'tsk');
  ensureNum(req.score_pre, 'sp');
  ensureNum(req.score_post, 'spo');
  ensureEnum(req.compensation_strategy, 'cs', ['external_memory','internal_strategy','environmental','combined','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function dysphagia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.diet_level, 'dl', ['thin','nectar','honey','pudding','npo','other','unknown']);
  ensureNum(req.trial_count, 'tc');
  ensureNum(req.aspiration_signs, 'as');
  ensureEnum(req.penetration, 'pn', ['shallow','deep','silent','no','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { articulation, language_therapy, voice_therapy, cognitive_communication, dysphagia }; }
module.exports = { funcs, ValidationError };