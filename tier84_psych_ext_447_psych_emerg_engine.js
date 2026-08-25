// filepath: tier84_psych_ext_447_psych_emerg_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function suicidal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.c_ssrs_score, 'css');
  ensureBool(req.si_present, 'sip');
  ensureBool(req.plan_present, 'plp');
  ensureBool(req.means_access, 'mac');
  ensureBool(req.intent_present, 'inp');
  ensureEnum(req.prior_attempts, 'pa', ['none','one','multiple','unknown']);
  ensureNum(req.protective_factors, 'pf');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','imminent','unknown']);
  ensureEnum(req.disposition, 'disp', ['outpatient_referral','partial_hospitalization','inpatient','safety_plan_discharge','emergency_observation','other']);
  ensureStr(req.safety_plan_components, 'spc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function psych_emerg_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.presentation, 'pres', ['agitation','psychosis','suicidal','homicidal','substance_withdrawal','acute_stress','other','unknown']);
  ensureBool(req.violence_risk, 'vr');
  ensureBool(req.violence_history, 'vh');
  ensureBool(req.psychosis_present, 'pp');
  ensureEnum(req.orientation, 'ori', ['oriented','confused','unknown']);
  ensureEnum(req.danger_to_self, 'dts', ['none','passive','active','imminent','unknown']);
  ensureEnum(req.danger_to_others, 'dto', ['none','passive','active','imminent','unknown']);
  ensureEnum(req.disposition, 'disp', ['discharge','voluntary_admission','involuntary_admission','observation','transfer','referral','other']);
  ensureBool(req.toxicology_done, 'td');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function restraint(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 't', ['physical','chemical','seclusion','combination','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.consent_obtained, 'co');
  ensureBool(req.physician_ordered, 'po');
  ensureEnum(req.indication, 'ind', ['agitation','violence','self_harm','refused_meds','other','unknown']);
  ensureNum(req.reassessment_min, 'rm');
  ensureEnum(req.complications, 'comp', ['none','injury','aspiration','cardiac','death','other','unknown']);
  ensureBool(req.debriefed, 'db');
  ensureNum(req.release_time, 'rt');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function psychosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.diagnosis, 'dx', ['schizophrenia','schizoaffective','schizophreniform','brief_psychotic','delusional','substance_induced','psychotic_depression','bipolar_psychotic','unknown','other']);
  ensureNum(req.duration_weeks, 'dur');
  ensureStr(req.symptoms, 'sym');
  ensureBool(req.brief_psychotic_resolution, 'bpr');
  ensureBool(req.first_psychotic_episode, 'fpe');
  ensureBool(req.hospitalized, 'hosp');
  ensureEnum(req.treatment, 'tx', ['antipsychotic_oral','antipsychotic_depot','combination','observation','referral','other','unknown']);
  ensureNum(req.cgascore, 'cgs');
  ensureBool(req.family_education, 'fe');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function crisis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.crisis_type, 'ct', ['suicidal','homicidal','psychotic','acute_trauma','relationship','financial','disaster','other','unknown']);
  ensureNum(req.crisis_score, 'cs');
  ensureBool(req.safety_plan_complete, 'spc');
  ensureBool(req.crisis_line_provided, 'clp');
  ensureNum(req.follow_up_hours, 'fuh');
  ensureEnum(req.disposition, 'disp', ['discharge_with_plan','urgent_followup','emergency_observation','inpatient','referral','other']);
  ensureBool(req.family_contacted, 'fc');
  ensureBool(req.means_restriction, 'mr');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { suicidal, psych_emerg_eval, restraint, psychosis, crisis }; }
module.exports = { funcs, ValidationError };