// filepath: tier167_spe_780_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function speech_evaluation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.disorder_type, 'dt', ['articulation','fluency','voice','language','apraxia','aphasia','NA']);
  ensureNum(req.score_baseline, 'sb'); ensureNum(req.score_current, 'sc');
  ensureBool(req.dysphagia, 'dy'); ensureBool(req.dysphonia, 'dn');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','profound','NA']);
  ensureEnum(req.disposition, 'di', ['continue','monitor','discharge','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { se_id: `se_${Date.now()}`, patient_id: req.patient_id, type: req.disorder_type, severity: req.severity };
}

function speech_therapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.sessions_30d, 's3');
  ensureNum(req.session_min, 'sm'); ensureEnum(req.method, 'mt', ['individual','group','teletherapy','NA']);
  ensureNum(req.score_baseline, 'sb'); ensureNum(req.score_current, 'sc');
  ensureNum(req.improvement_pct, 'ip'); ensureEnum(req.disposition, 'di', ['continue','discharge','escalate','NA']);
  ensureStr(req.provider, 'pr');
  return { st_id: `st_${Date.now()}`, patient_id: req.patient_id, sessions: req.sessions_30d, imp: req.improvement_pct };
}

function voice_therapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['nodules','polyps','paralysis','spasmodic','functional','NA']);
  ensureNum(req.f0_hz, 'f0'); ensureNum(req.shing_ratio_pct, 'sh');
  ensureNum(req.sessions_30d, 's3'); ensureBool(req.voice_rest_compliant, 'vr');
  ensureNum(req.improvement_pct, 'ip'); ensureEnum(req.disposition, 'di', ['continue','discharge','surgery','NA']);
  ensureStr(req.provider, 'pr');
  return { vt_id: `vt_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, imp: req.improvement_pct };
}

function swallowing(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.phase, 'ph', ['oral','pharyngeal','esophageal','mixed','NA']);
  ensureNum(req.dysphagia_severity, 'ds'); ensureBool(req.aspiration_risk, 'ar');
  ensureEnum(req.diet_mod, 'dm', ['regular','soft','puree','liquid','NPO','NA']);
  ensureNum(req.timed_swallow_test, 'ts'); ensureBool(req.vfs_done, 'vf');
  ensureEnum(req.disposition, 'di', ['continue','upgrade','downgrade','NA']);
  ensureStr(req.provider, 'pr');
  return { sw_id: `sw_${Date.now()}`, patient_id: req.patient_id, phase: req.phase, severity: req.dysphagia_severity };
}

function pediatric_speech(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.expressive_words, 'ew');
  ensureNum(req.receptive_words, 'rw'); ensureEnum(req.milestone, 'ms', ['delayed','normal','advanced','NA']);
  ensureBool(req.autism_screening, 'as'); ensureBool(req.hearing_test, 'ht');
  ensureNum(req.sessions_30d, 's3'); ensureNum(req.improvement_pct, 'ip');
  ensureStr(req.provider, 'pr');
  return { ps_id: `ps_${Date.now()}`, patient_id: req.patient_id, expr: req.expressive_words, mil: req.milestone };
}

function funcs() { return { speech_evaluation, speech_therapy, voice_therapy, swallowing, pediatric_speech }; }
module.exports = { funcs, ValidationError };