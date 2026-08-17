// filepath: tier42_psychiatry_ext_244_psychotic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function schizophrenia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.positive_symptoms, 'pos');
  ensureStr(req.negative_symptoms, 'neg');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.adherence, 'adh', ['good','partial','poor','none']);
  ensureEnum(req.functioning, 'func', ['good','moderate','poor']);
  const status = req.adherence === 'poor' || req.adherence === 'none' ? 'relapse_risk_high' : 'stable';
  return { status, adherence: req.adherence, functioning: req.functioning };
}
function schizoaffective(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mood_episode, 'mood', ['depressive','manic','mixed','none']);
  ensureStr(req.psychotic_features, 'psy');
  ensureEnum(req.monitoring, 'mon', ['weekly','biweekly','monthly','quarterly']);
  return { type: req.mood_episode, monitoring: req.monitoring };
}
function delusional_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.delusion_type, 'dt', ['persecutory','erotomanic','grandiose','somatic','jealous','mixed']);
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.insight, 'ins', ['good','limited','absent']);
  return { delusion_type: req.delusion_type, insight: req.insight };
}
function brief_psychotic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.duration_days, 'dur');
  ensureStr(req.stressor, 'stress');
  ensureStr(req.symptoms, 'sx');
  ensureEnum(req.outcome, 'out', ['full_recovery','partial_recovery','ongoing']);
  ensureEnum(req.follow_up, 'fu', ['none','1_month','3_months','6_months']);
  return { outcome: req.outcome, follow_up: req.follow_up };
}
function substance_induced_psychosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.substance, 'sub');
  ensureStr(req.urine_tox, 'tox');
  ensureEnum(req.cessation, 'ces', ['detox_program','inpatient_rehab','outpatient','self_cessation']);
  ensureStr(req.antipsychotic, 'ap');
  ensureEnum(req.reassessment, 'reas', ['1_week','2_weeks','4_weeks','6_weeks']);
  return { cessation: req.cessation, reassessment: req.reassessment };
}

function funcs() { return { schizophrenia, schizoaffective, delusional_disorder, brief_psychotic, substance_induced_psychosis }; }
module.exports = { funcs, ValidationError };