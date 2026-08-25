// filepath: tier172_neu_802_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.days_since_stroke, 'ds');
  ensureNum(req.nihss_baseline, 'nb'); ensureNum(req.nihss_current, 'nc');
  ensureEnum(req.recovery, 're', ['minimal','partial','good','excellent','NA']);
  ensureNum(req.mrs_score, 'ms'); ensureBool(req.secondary_prevention, 'sp');
  ensureNum(req.fall_risk_score, 'fr'); ensureEnum(req.disposition, 'di', ['home','rehab','LTC','NA']);
  ensureStr(req.provider, 'pr');
  return { sf_id: `sf_${Date.now()}`, patient_id: req.patient_id, nihss: req.nihss_current, rec: req.recovery };
}

function epilepsy_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.seizure_type, 'st', ['focal','generalized','unknown','absence','NA']);
  ensureNum(req.seizures_30d, 's3'); ensureNum(req.aed_count, 'ac');
  ensureNum(req.aed_level_ng_ml, 'al'); ensureEnum(req.adherence, 'ad', ['excellent','good','moderate','poor','NA']);
  ensureEnum(req.aed_type, 'at', ['phenytoin','carbamazepine','valproate','levetiracetam','lamotrigine','other','NA']);
  ensureNum(req.adverse_score, 'as'); ensureStr(req.provider, 'pr');
  return { ep_id: `ep_${Date.now()}`, patient_id: req.patient_id, sz: req.seizures_30d, aed: req.aed_type };
}

function parkinson_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.hoehn_yahr, 'hy');
  ensureNum(req.udysrs_score, 'ud'); ensureNum(req.mds_updrs, 'mu');
  ensureEnum(req.medication, 'md', ['levodopa','agonist','MAOB','COMT','amantadine','combination','NA']);
  ensureNum(req.meds_count, 'mc'); ensureBool(req.dyskinesia, 'dy');
  ensureBool(req.falls_30d, 'fa'); ensureNum(req.qol_pdq39, 'ql');
  ensureStr(req.provider, 'pr');
  return { pf_id: `pf_${Date.now()}`, patient_id: req.patient_id, hy: req.hoehn_yahr, qol: req.qol_pdq39 };
}

function ms_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['RRMS','SPMS','PPMS','NA']);
  ensureNum(req.edss_score, 'ed'); ensureNum(req.relapses_30d, 'rs');
  ensureNum(req.mri_lesions_count, 'ml'); ensureNum(req.dmt_adherence, 'da');
  ensureEnum(req.dmt, 'dt', ['none','interferon','glatiramer','fingolimod','natalizumab','ocrelizumab','other','NA']);
  ensureNum(req.walking_test_25ft, 'w2'); ensureEnum(req.disposition, 'di', ['continue','modify','escalate','NA']);
  ensureStr(req.provider, 'pr');
  return { ms_id: `ms_${Date.now()}`, patient_id: req.patient_id, edss: req.edss_score, type: req.type };
}

function migraine(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.headaches_30d, 'hd');
  ensureNum(req.duration_hr, 'du'); ensureNum(req.pain_max, 'pm');
  ensureBool(req.aura, 'au'); ensureNum(req.mid_score, 'mi');
  ensureNum(req.hit6_score, 'h6'); ensureEnum(req.prophylaxis, 'pp', ['none','topiramate','amitriptyline','CGRP','beta_blocker','other','NA']);
  ensureEnum(req.acute_tx, 'at', ['NSAID','triptan','opioid','combination','other','NA']);
  ensureStr(req.provider, 'pr');
  return { mg_id: `mg_${Date.now()}`, patient_id: req.patient_id, freq: req.headaches_30d, prof: req.prophylaxis };
}

function funcs() { return { stroke_follow, epilepsy_follow, parkinson_follow, ms_follow, migraine }; }
module.exports = { funcs, ValidationError };