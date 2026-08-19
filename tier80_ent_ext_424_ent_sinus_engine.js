// filepath: tier80_ent_ext_424_ent_sinus_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sinusitis_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.sin_diagnosis, 'sd', ['acute_viral','acute_bacterial','chronic','recurrent','fungal','allergic_fungal','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureStr(req.symptoms, 'sym');
  ensureBool(req.purulent_discharge, 'pd');
  ensureNum(req.ct_lund_mackay, 'clm');
  ensureBool(req.ct_done, 'ct');
  ensureBool(req.aspirin_sensitive, 'asa');
  ensureBool(req.nasal_polyps, 'np');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function sinus_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.procedure, 'proc', ['fess','functional_endoscopic','balloon_sinuplasty','frontal_sinus','open_sinus','ethmoidectomy','sphenoidotomy','turbinate_reduction','septoplasty','other','unknown']);
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.complications, 'comp', ['none','bleeding','orbital_injury','csf_leak','infection','synechia','other']);
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function allergic_rhinitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.seasonality, 'season', ['perennial','seasonal','intermittent','persistent','unknown']);
  ensureStr(req.triggers, 'trg');
  ensureBool(req.conjunctivitis, 'conj');
  ensureBool(req.asthma, 'asth');
  ensureBool(req.skin_test_done, 'std');
  ensureStr(req.allergens, 'alg');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.immunotherapy_started, 'its');
  ensureBool(req.intranasal_steroid, 'ins');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function epistaxis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureEnum(req.location, 'loc', ['anterior','posterior','unknown','multiple','other']);
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureNum(req.duration_minutes, 'dur');
  ensureStr(req.intervention, 'intv');
  ensureBool(req.cautery_done, 'cau');
  ensureBool(req.packing_done, 'pack');
  ensureNum(req.estimated_blood_loss, 'ebl');
  ensureBool(req.hypotension, 'hypo');
  ensureBool(req.recurred, 'rec');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function nasal_endoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.tolerance, 'tol');
  ensureBool(req.findings_documented, 'fd');
  ensureStr(req.nasal_findings, 'nf');
  ensureStr(req.septum_status, 'ss');
  ensureBool(req.polyps_present, 'pp');
  ensureStr(req.drainage, 'dr');
  ensureStr(req.impression, 'imp');
  ensureEnum(req.degree_of_visibility, 'dov', ['excellent','good','fair','poor','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { sinusitis_eval, sinus_surgery, allergic_rhinitis, epistaxis, nasal_endoscopy }; }
module.exports = { funcs, ValidationError };