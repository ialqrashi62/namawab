// filepath: tier114_mood_601_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mdd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.phq_9_score, 'ps');
  ensureNum(req.duration_weeks, 'dw');
  ensureBool(req.suicidal_ideation, 'si');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','moderately_severe','severe','other','unknown']);
  ensureBool(req.previous_treatment, 'pt');
  ensureNum(req.episodes_count, 'ec');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function bipolar(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.episode_type, 'et', ['manic','hypomanic','depressive','mixed','other','unknown']);
  ensureNum(req.young_score, 'ys');
  ensureNum(req.duration_days, 'dd');
  ensureEnum(req.mood_stabilizer, 'ms', ['lithium','valproate','lamotrigine','carbamazepine','none','other','unknown']);
  ensureNum(req.mood_episodes_per_year, 'mep');
  ensureBool(req.medication_adherent, 'ma');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function dysthymia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.duration_years, 'dy');
  ensureNum(req.ham_d_score, 'hd');
  ensureEnum(req.workup, 'wu', ['initiated','completed','pending','other','unknown']);
  ensureBool(req.trialed_meds, 'tm');
  ensureNum(req.daily_functioning, 'df');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function seasonal_affective(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.winter_severity, 'ws');
  ensureNum(req.summer_improvement, 'si');
  ensureEnum(req.pattern, 'pt', ['fall_winter','spring_summer','other','unknown']);
  ensureBool(req.light_treatment, 'lt');
  ensureEnum(req.response, 'resp', ['good','partial','none','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function mixed_features(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.mde_count, 'mc');
  ensureBool(req.manic_features, 'mf');
  ensureNum(req.symptom_count, 'sc');
  ensureEnum(req.treatment, 'tx', ['ssri','snri','maoi','mood_stabilizer','atypical_antipsychotic','combination','other','unknown']);
  ensureBool(req.side_effects, 'se');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { mdd, bipolar, dysthymia, seasonal_affective, mixed_features }; }
module.exports = { funcs, ValidationError };