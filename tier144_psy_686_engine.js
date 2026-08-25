// filepath: tier144_psy_686_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ect(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['bilateral','unilateral','bifrontal','right_unilateral','ultra_brief','brief_pulse','standard','maintenance']);
  ensureNum(req.session_number, 'sn');
  ensureNum(req.energy_mc, 'em');
  ensureNum(req.seizure_duration_sec, 'sd');
  ensureNum(req.pretreatment_egg, 'pe');
  ensureNum(req.pretreatment_mabp, 'pm');
  ensureStr(req.medication, 'md');
  ensureStr(req.provider, 'pr');
  return { ect_id: `ect_${Date.now()}`, patient_id: req.patient_id, session: req.session_number, energy: req.energy_mc };
}
function tms(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.protocol, 'pr', ['high_frequency_left','low_frequency_right','theta_burst','deep_TMS','Stanford_Smart_acc','other']);
  ensureNum(req.intensity_pct, 'ip');
  ensureNum(req.frequency_hz, 'fz');
  ensureNum(req.session_duration_min, 'sd');
  ensureNum(req.session_number, 'sn');
  ensureEnum(req.indication, 'in', ['MDD','TRD','OCD','PTSD','anxiety','smoking_cessation','movement','other']);
  ensureStr(req.provider, 'pr');
  return { tm_id: `tms_${Date.now()}`, patient_id: req.patient_id, protocol: req.protocol, intensity: req.intensity_pct };
}
function ketamine(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.dose_mg_kg, 'ds');
  ensureEnum(req.route, 'rt', ['IV','IM','IN','PO','SC']);
  ensureNum(req.session_duration_min, 'sd');
  ensureEnum(req.indication, 'in', ['depression','TRD','PTSD','anxiety','OCD','chronic_pain','suicidal_ideation','other']);
  ensureBool(req.dissociative, 'di');
  ensureStr(req.provider, 'pr');
  return { ke_id: `ket_${Date.now()}`, patient_id: req.patient_id, indication: req.indication, dose: req.dose_mg_kg };
}
function monitoring(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.phq9_score, 'p9');
  ensureNum(req.gad7_score, 'g7');
  ensureNum(req.ymrs_score, 'ym');
  ensureNum(req.bprs_score, 'bp');
  ensureNum(req.aims_score, 'ai');
  ensureNum(req.cgi_severity, 'cg');
  ensureEnum(req.adherence, 'ad', ['excellent','good','fair','poor','nonadherent']);
  ensureStr(req.provider, 'pr');
  return { mn_id: `mon_${Date.now()}`, patient_id: req.patient_id, phq9: req.phq9_score, ad: req.adherence };
}
function community(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.program, 'pg', ['ACT_team','crisis_team','diversion','supported_employment','supported_ed','group_home','day_treatment','peer_support','intensive_case_mgmt','partial_hospital','other']);
  ensureNum(req.visits_per_week, 'vw');
  ensureNum(req.duration_months, 'dm');
  ensureNum(req.outcome_score, 'os');
  ensureBool(req.hospitalization, 'ho');
  ensureNum(req.days_hospitalized, 'dh');
  ensureStr(req.provider, 'pr');
  return { co_id: `cmt_${Date.now()}`, patient_id: req.patient_id, program: req.program, visits: req.visits_per_week };
}

function funcs() { return { ect, tms, ketamine, monitoring, community }; }
module.exports = { funcs, ValidationError };
