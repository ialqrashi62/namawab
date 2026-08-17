// filepath: tier52_rehabilitation_ext_295_rehab_slp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dysphagia_swallow(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stroke_phase, 'sp', ['acute','subacute','chronic','post_surgical','progressive_neuro']);
  ensureStr(req.mbbs, 'mbbs');
  ensureStr(req.fees, 'fees');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { mbbs: req.mbbs };
}
function aphasia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['broca','wernicke','conduction','global','transcortical_motor','transcortical_sensory','anomic','primary_progressive']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','global_severe']);
  ensureNum(req.wab_aq, 'wab');
  ensureStr(req.therapy_focus, 'tf');
  ensureStr(req.progress, 'prog');
  ensureBool(req.home_program, 'hp');
  return { type: req.type, wab_aq: req.wab_aq };
}
function apraxia_of_speech(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','mild_moderate','moderate','moderate_severe','severe']);
  ensureNum(req.articulatory_accuracy_pct, 'aa');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.response, 'resp');
  ensureNum(req.follow_up_weeks, 'fu');
  return { severity: req.severity };
}
function voice_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.condition, 'cond', ['muscle_tension_dysphonia','vocal_nodules','vocal_paralysis','pvf','spasmodic_dysphonia','presbylarynx','functional']);
  ensureNum(req.vhi_score, 'vhi');
  ensureStr(req.therapy_focus, 'tf');
  ensureNum(req.sessions_completed, 'sc');
  ensureEnum(req.response, 'resp', ['improving','stable','plateau','worsening']);
  return { vhi: req.vhi_score };
}
function trach_speaking_valve(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.trach_type, 'tt', ['cuffed','cuffless','fenestrated']);
  ensureStr(req.valve_placement, 'vp');
  ensureNum(req.tolerated_duration_min, 'td');
  ensureBool(req.phonation, 'phon');
  ensureNum(req.follow_up, 'fu');
  return { trach_type: req.trach_type };
}

function funcs() { return { dysphagia_swallow, aphasia, apraxia_of_speech, voice_therapy, trach_speaking_valve }; }
module.exports = { funcs, ValidationError };