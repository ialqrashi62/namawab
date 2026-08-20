// filepath: tier166_psy_776_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psych_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.phq9_score, 'pq');
  ensureNum(req.gad7_score, 'g7'); ensureNum(req.pcl5_score, 'p5');
  ensureEnum(req.psychosis, 'ps', ['none','mild','moderate','severe','NA']);
  ensureEnum(req.cognitive, 'co', ['intact','mild_impairment','moderate','severe','NA']);
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','imminent','NA']);
  ensureEnum(req.disposition, 'di', ['outpatient','referral','crisis','inpatient','NA']);
  ensureBool(req.safety_plan, 'sp'); ensureStr(req.provider, 'pr');
  return { pe_id: `pe_${Date.now()}`, patient_id: req.patient_id, phq: req.phq9_score, risk: req.risk_level };
}

function psychotherapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.modality, 'mo', ['CBT','DBT','ACT','psychodynamic','IPT','family','group','NA']);
  ensureNum(req.sessions_30d, 's3'); ensureNum(req.session_min, 'sm');
  ensureEnum(req.frequency, 'fq', ['weekly','biweekly','triweekly','monthly','as_needed','NA']);
  ensureNum(req.score_baseline, 'sb'); ensureNum(req.score_current, 'sc');
  ensureNum(req.improvement_pct, 'ip'); ensureEnum(req.adherence, 'ad', ['excellent','good','moderate','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { pt_id: `pt_${Date.now()}`, patient_id: req.patient_id, modality: req.modality, imp: req.improvement_pct };
}

function psych_pharm(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.drug_class, 'dc', ['SSRI','SNRI','MAOI','TCA','atypical','mood_stabilizer','stimulant','benzodiazepine','NA']);
  ensureStr(req.drug_name, 'dn'); ensureNum(req.dose_mg, 'ds');
  ensureNum(req.days_on_med, 'do'); ensureNum(req.score_baseline, 'sb');
  ensureNum(req.score_current, 'sc'); ensureBool(req.adverse_effects, 'ae');
  ensureEnum(req.adherence, 'ad', ['excellent','good','moderate','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { pp_id: `pp_${Date.now()}`, patient_id: req.patient_id, drug: req.drug_name, imp: req.score_baseline - req.score_current };
}

function substance_use(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.substance, 'sb', ['alcohol','tobacco','opioid','cannabis','stimulant','benzodiazepine','polysubstance','NA']);
  ensureNum(req.audit_c_score, 'ac'); ensureNum(req.dast_score, 'ds');
  ensureNum(req.days_used_30d, 'du'); ensureEnum(req.severity, 'sv', ['none','mild','moderate','severe','NA']);
  ensureBool(req.treatment_engaged, 'te'); ensureEnum(req.treatment_type, 'tt', ['none','CBT','MAT','12step','inpatient','combination','NA']);
  ensureNum(req.days_clean, 'dc'); ensureStr(req.provider, 'pr');
  return { su_id: `su_${Date.now()}`, patient_id: req.patient_id, sub: req.substance, clean: req.days_clean };
}

function behavioral_health_crisis(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.crisis_type, 'ct', ['suicidal','homicidal','psychosis','panic','substance_withdrawal','other','NA']);
  ensureNum(req.risk_score, 'rs'); ensureBool(req.safety_plan, 'sp');
  ensureBool(req.means_restricted, 'mr'); ensureEnum(req.disposition, 'di', ['discharged','crisis_unit','inpatient','referral','NA']);
  ensureNum(req.followup_days, 'fd'); ensureEnum(req.referral, 're', ['none','therapy','psych','social','multiple','NA']);
  ensureStr(req.provider, 'pr');
  return { bc_id: `bc_${Date.now()}`, patient_id: req.patient_id, type: req.crisis_type, risk: req.risk_score };
}

function funcs() { return { psych_eval, psychotherapy, psych_pharm, substance_use, behavioral_health_crisis }; }
module.exports = { funcs, ValidationError };