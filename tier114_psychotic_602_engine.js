// filepath: tier114_psychotic_602_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function schizophrenia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.panss_total, 'pt');
  ensureNum(req.positive_score, 'ps');
  ensureNum(req.negative_score, 'ns');
  ensureNum(req.cognitive_score, 'cs');
  ensureEnum(req.medication_adherence, 'ma', ['full','partial','poor','none','unknown','other']);
  ensureNum(req.hospitalizations_count, 'hc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function schizoaffective(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.subtype, 'sub', ['bipolar_type','depressive_type','other','unknown']);
  ensureNum(req.mood_episodes_count, 'mec');
  ensureNum(req.psychotic_episodes_count, 'pec');
  ensureNum(req.duration_years, 'dy');
  ensureEnum(req.treatment, 'tx', ['antipsychotic','mood_stabilizer','combination','other','unknown']);
  ensureBool(req.functioning, 'fn');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function brief_psychotic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.duration_days, 'dd');
  ensureNum(req.episode_count, 'ec');
  ensureEnum(req.trigger, 'tr', ['stress','substance','medical','unknown','other','none']);
  ensureEnum(req.outcome, 'out', ['full_recovery','partial','recurrent','chronic','other','unknown']);
  ensureBool(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function delusional(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.delusion_type, 'dt');
  ensureNum(req.duration_years, 'dy');
  ensureBool(req.behavioral_impact, 'bi');
  ensureEnum(req.treatment_response, 'tr', ['good','partial','poor','none','unknown','other']);
  ensureBool(req.psychiatric_comorbidity, 'pc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function substance_induced_psychotic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.substance, 'sub');
  ensureNum(req.days_after_last_use, 'dlu');
  ensureNum(req.duration_days, 'dur');
  ensureBool(req.resolve_with_abstinence, 'rwa');
  ensureEnum(req.long_term_outcome, 'lto', ['resolved','persistent','recurrent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { schizophrenia, schizoaffective, brief_psychotic, delusional, substance_induced_psychotic }; }
module.exports = { funcs, ValidationError };