// filepath: tier69_mh_373_mh_assess_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mh_initial_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.referral_source, 'rs', ['pcp','psychiatrist','self','family','school','work','court','crisis_team','emergency','hospital','pediatrician','therapist','clergy','self_referred','insurance','other']);
  ensureStr(req.presenting, 'pres');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.severity_self_report, 'sev', ['mild','moderate','severe','very_severe','minimal','mild_to_moderate','moderate_to_severe','extremely_severe','unknown']);
  ensureBool(req.history_thc, 'ht');
  ensureStr(req.med_history, 'mh');
  ensureStr(req.support_system, 'ss');
  ensureEnum(req.language, 'lang', ['english','arabic','french','urdu','hindi','spanish','other']);
  return { intake: req.patient_id };
}
function mh_diagnostic_interview(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.interview_type, 'it', ['scid_5','mini','digs','sidp','kiddie_scid','wadd','cdi','phq','none','structured','semi_structured','unstructured','other']);
  ensureStr(req.axis_i, 'a1');
  ensureStr(req.axis_ii, 'a2');
  ensureStr(req.axis_iii, 'a3');
  ensureStr(req.axis_iv, 'a4');
  ensureNum(req.axis_v, 'a5');
  ensureStr(req.interviewer, 'inv');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.patient_consent, 'pc');
  return { interview: req.interview_type };
}
function mh_risk_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.screen_type, 'st', ['phq_9','phq_2','gad_7','pss','audit_c','dast','c_ssrs','columbia','beck_hopelessness','sbnst','phq_4','other']);
  ensureNum(req.score, 'score');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','moderately_severe','severe','very_severe','other','inconclusive']);
  ensureBool(req.suicidal_ideation, 'si');
  ensureBool(req.plan_intent, 'pi');
  ensureBool(req.means_access, 'ma');
  ensureStr(req.protective_factors, 'pf');
  ensureBool(req.follow_up_required, 'fur');
  return { screen: req.screen_type };
}
function mh_safety_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureBool(req.warning_signs_recognized, 'wsr');
  ensureStr(req.coping_strategies_listed, 'csl');
  ensureBool(req.support_contacts_listed, 'scl');
  ensureBool(req.professional_numbers_listed, 'pnl');
  ensureBool(req.means_restricted, 'mr');
  ensureBool(req.plan_documented, 'pd');
  ensureBool(req.patient_signed, 'ps');
  return { plan: req.plan_id };
}
function mh_functional_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.assessment_type, 'at', ['whodas','gaf','sst','skillstraining','sma','fast','work_quality','other']);
  ensureNum(req.score, 'score');
  ensureStr(req.domains, 'dom');
  ensureEnum(req.functional_level, 'fl', ['excellent','good','moderate','moderately_severe','severe','very_severe','unknown']);
  ensureNum(req.work_function, 'wf');
  ensureNum(req.social_function, 'sf');
  ensureBool(req.interpreter_used, 'iu');
  ensureStr(req.plan, 'plan');
  return { assessment: req.assessment_type };
}

function funcs() { return { mh_initial_intake, mh_diagnostic_interview, mh_risk_screen, mh_safety_plan, mh_functional_assessment }; }
module.exports = { funcs, ValidationError };