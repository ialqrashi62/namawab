// filepath: tier114_substance_use_604_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function alcohol_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.audit_score, 'as');
  ensureNum(req.drinks_per_week, 'dpw');
  ensureEnum(req.use_pattern, 'up', ['social','heavy','binge','dependent','abstinent','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['brief_intervention','detox','rehab','aa','medication','combination','other','unknown','none']);
  ensureBool(req.medications_for_addiction, 'mfa');
  ensureNum(req.days_sober, 'ds');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function opioid_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.use_severity, 'us', ['mild','moderate','severe','remission','other','unknown']);
  ensureNum(req.daily_dose_mge, 'ddm');
  ensureEnum(req.treatment, 'tx', ['methadone','buprenorphine','naltrexone','detox','abstinence','combination','other','unknown','none']);
  ensureBool(req.overdose_history, 'oh');
  ensureNum(req.days_in_treatment, 'dit');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function stimulant_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.substance, 'sub', ['cocaine','methamphetamine','other','unknown','none']);
  ensureNum(req.use_days_per_month, 'udpm');
  ensureEnum(req.route, 'rt', ['nasal','smoked','iv','oral','other','unknown']);
  ensureNum(req.days_clean, 'dc');
  ensureNum(req.craving_score, 'cs');
  ensureEnum(req.response, 'resp', ['sustained_abstinence','relapse','reducing','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cannabis_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.use_days_per_month, 'udpm');
  ensureNum(req.amount_grams_per_week, 'agpw');
  ensureBool(req.dependence_signs, 'ds');
  ensureNum(req.cudit_score, 'cs');
  ensureBool(req.cognitive_concerns, 'cc');
  ensureNum(req.motivation_to_quit, 'mtq');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function sedative_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureNum(req.daily_dose_mg, 'ddm');
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.tolerance, 'tol');
  ensureEnum(req.taper, 'tap', ['none','planned','active','completed','not_recommended','other','unknown']);
  ensureBool(req.withdrawal_symptoms, 'ws');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { alcohol_use, opioid_use, stimulant_use, cannabis_use, sedative_use }; }
module.exports = { funcs, ValidationError };