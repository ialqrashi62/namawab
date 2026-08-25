// filepath: tier175_ent_817_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sinusitis_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['acute','chronic','recurrent','NA']);
  ensureNum(req.duration_days, 'du'); ensureBool(req.polyps_present, 'pp');
  ensureNum(req.ct_score, 'cs'); ensureEnum(req.treatment, 'tr', ['observation','spray','antibiotic','surgery','NA']);
  ensureBool(req.antibiotic_used, 'au'); ensureBool(req.surgery_planned, 'sp');
  ensureStr(req.provider, 'pr');
  return { se_id: `se_${Date.now()}`, patient_id: req.patient_id, type: req.type, cs: req.ct_score };
}

function hearing_aid_fit(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.audiogram_pta, 'ap');
  ensureNum(req.speech_discrimination, 'sd'); ensureEnum(req.type, 'ty', ['CIC','ITC','ITE','BTE','RIC','NA']);
  ensureNum(req.feedback_count, 'fc'); ensureEnum(req.comfort, 'co', ['excellent','good','fair','poor','NA']);
  ensureNum(req.benefit_score, 'bs'); ensureNum(req.followup_months, 'fu');
  ensureStr(req.provider, 'pr');
  return { haf_id: `haf_${Date.now()}`, patient_id: req.patient_id, type: req.type, bs: req.benefit_score };
}

function tinnitus_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.thi_score, 'th'); ensureEnum(req.laterality, 'lt', ['left','right','bilateral','NA']);
  ensureEnum(req.pitch, 'pi', ['high','medium','low','variable','NA']);
  ensureEnum(req.hearing_loss, 'hl', ['none','mild','moderate','severe','NA']);
  ensureEnum(req.treatment, 'tr', ['none','CBT','sound_therapy','medication','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { te_id: `te_${Date.now()}`, patient_id: req.patient_id, thi: req.thi_score, ip: req.improvement_pct };
}

function vertigo_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.dhi_score, 'dh');
  ensureEnum(req.diagnosis, 'dx', ['BPPV','vestibular_neuritis','meniere','migraine','other','NA']);
  ensureNum(req.duration_min, 'du'); ensureEnum(req.treatment, 'tr', ['Epley','VRT','medication','observation','NA']);
  ensureEnum(req.response, 're', ['good','partial','poor','NA']);
  ensureEnum(req.balance_test, 'bt', ['normal','abnormal','NA']);
  ensureStr(req.provider, 'pr');
  return { ve_id: `ve_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, dh: req.dhi_score };
}

function voice_disorder(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['nodules','polyps','paralysis','spasmodic','functional','other','NA']);
  ensureNum(req.vhi_score, 'vs'); ensureEnum(req.treatment, 'tr', ['none','voice_therapy','surgery','botox','NA']);
  ensureNum(req.sessions_completed, 'sc'); ensureNum(req.improvement_pct, 'ip');
  ensureEnum(req.disposition, 'di', ['continue','discharge','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { vd_id: `vd_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, ip: req.improvement_pct };
}

function funcs() { return { sinusitis_eval, hearing_aid_fit, tinnitus_eval, vertigo_eval, voice_disorder }; }
module.exports = { funcs, ValidationError };