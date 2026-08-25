// filepath: tier42_psychiatry_ext_246_substance_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function alcohol_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.audit_score, 'audit');
  ensureStr(req.pattern, 'pat');
  ensureEnum(req.dt_risk, 'dtrisk', ['low','moderate','high','very_high']);
  ensureNum(req.ciwa_score, 'ciwa');
  ensureEnum(req.intervention, 'int', ['brief_intervention','outpatient_detox','inpatient_detox','detox_rehab_referral','naltrexone']);
  const sev = req.audit_score >= 20 ? 'likely_dependence' : req.audit_score >= 8 ? 'hazardous' : 'low_risk';
  return { severity: sev, intervention: req.intervention };
}
function opioid_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.duration_years, 'dur');
  ensureBool(req.iv_use, 'iv');
  ensureStr(req.last_use, 'lu');
  ensureBool(req.methadone_maintenance, 'mm');
  ensureNum(req.overdose_history, 'od');
  ensureBool(req.naloxone_prescribed, 'nal');
  return { status: 'monitored', maintenance: req.methadone_maintenance, naloxone: req.naloxone_prescribed };
}
function cannabis_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.frequency, 'freq', ['daily','weekly','monthly','occasional','none']);
  ensureNum(req.duration_years, 'dur');
  ensureEnum(req.impact, 'imp', ['none','mild','moderate','functional','severe']);
  ensureEnum(req.cessation_plan, 'ces', ['none','gradual_reduction','abrupt_cessation','referral_addiction_counseling','residential']);
  return { impact: req.impact, cessation_plan: req.cessation_plan };
}
function stimulant_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.substance, 'sub');
  ensureEnum(req.frequency, 'freq', ['daily','weekly','monthly','occasional','none']);
  ensureEnum(req.complications, 'comp', ['none','none_yet','cardiovascular','psychiatric','weight_loss','overdose']);
  ensureEnum(req.intervention, 'int', ['none','matrix_model_therapy','cbt','cm','residential','inpatient_detox']);
  ensureEnum(req.monitoring, 'mon', ['none','urine_drug_screen','weekly','monthly']);
  return { intervention: req.intervention, monitoring: req.monitoring };
}
function sedative_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureNum(req.dose_mg, 'dose');
  ensureNum(req.duration_years, 'dur');
  ensureEnum(req.taper_plan, 'tap', ['none','gradual_5_percent_week','gradual_10_percent_week','substitution_long_acting','inpatient_detox']);
  ensureEnum(req.monitoring, 'mon', ['none','weekly_assessment','biweekly','monthly']);
  return { taper_plan: req.taper_plan, monitoring: req.monitoring };
}

function funcs() { return { alcohol_use, opioid_use, cannabis_use, stimulant_use, sedative_use }; }
module.exports = { funcs, ValidationError };