// filepath: tier167_aud_779_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function audiometry(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.pta_right, 'pr');
  ensureNum(req.pta_left, 'pl'); ensureEnum(req.type, 'ty', ['normal','conductive','sensorineural','mixed','NA']);
  ensureNum(req.word_recognition_right, 'wr'); ensureNum(req.word_recognition_left, 'wl');
  ensureNum(req.tinnitus_severity, 'ts'); ensureEnum(req.disposition, 'di', ['normal','monitor','HA','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { au_id: `au_${Date.now()}`, patient_id: req.patient_id, type: req.type, pta: req.pta_right };
}

function hearing_aid(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['BTE','ITE','ITC','CIC','IIC','NA']);
  ensureNum(req.battery_days, 'bd'); ensureNum(req.days_used, 'du');
  ensureNum(req.feedback_complaints, 'fc'); ensureEnum(req.comfort, 'co', ['excellent','good','fair','poor','NA']);
  ensureNum(req.benefit_score, 'bs'); ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { ha_id: `ha_${Date.now()}`, patient_id: req.patient_id, type: req.type, days: req.days_used };
}

function tinnitus(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.thi_score, 'th');
  ensureEnum(req.laterality, 'lt', ['left','right','bilateral','NA']);
  ensureEnum(req.pitch, 'pi', ['high','medium','low','variable','NA']);
  ensureNum(req.duration_months, 'du'); ensureEnum(req.treatment, 'tr', ['none','CBT','sound_therapy','medication','combination','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { tn_id: `tn_${Date.now()}`, patient_id: req.patient_id, score: req.thi_score, imp: req.improvement_pct };
}

function vestibular(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.dhi_score, 'dh');
  ensureEnum(req.diagnosis, 'dx', ['BPPV','vestibular_neuritis','meniere','labyrinthitis','migraine','other','NA']);
  ensureNum(req.hit_score_right, 'hr'); ensureNum(req.hit_score_left, 'hl');
  ensureNum(req.fall_risk, 'fr'); ensureEnum(req.treatment, 'tr', ['Epley','VRT','medication','surgery','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { vs_id: `vs_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, imp: req.improvement_pct };
}

function cochlear(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.pta_pre, 'pp');
  ensureNum(req.pta_post, 'po'); ensureNum(req.disability_pct, 'dp');
  ensureEnum(req.candidate, 'ca', ['excellent','good','fair','poor','NA']);
  ensureEnum(req.device, 'de', ['unilateral','bilateral','hybrid','NA']);
  ensureNum(req.rehab_sessions, 'rs'); ensureEnum(req.outcome, 'ot', ['excellent','good','fair','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { cl_id: `cl_${Date.now()}`, patient_id: req.patient_id, gain: req.pta_pre - req.pta_post, outcome: req.outcome };
}

function funcs() { return { audiometry, hearing_aid, tinnitus, vestibular, cochlear }; }
module.exports = { funcs, ValidationError };