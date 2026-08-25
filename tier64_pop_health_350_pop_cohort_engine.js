// filepath: tier64_pop_health_350_pop_cohort_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function risk_cohort_build(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cohort_name, 'cn');
  ensureStr(req.criteria, 'crit');
  ensureNum(req.size, 'size');
  ensureStr(req.refresh_date, 'rd');
  ensureStr(req.owner, 'own');
  ensureBool(req.consent, 'con');
  return { cohort: req.cohort_name };
}
function high_risk_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel_id, 'pid');
  ensureNum(req.patients_count, 'pc');
  ensureNum(req.risk_avg, 'ra');
  ensureStr(req.top_conditions, 'tc');
  ensureStr(req.assigned_navigator, 'an');
  ensureStr(req.intervention, 'int');
  return { panel: req.panel_id };
}
function care_gap_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel_id, 'pid');
  ensureNum(req.patients_count, 'pc');
  ensureNum(req.gap_count_total, 'gct');
  ensureStr(req.top_gaps, 'tg');
  ensureNum(req.closure_rate_target, 'crt');
  ensureBool(req.reviewed, 'rev');
  return { gaps: req.top_gaps };
}
function outreach_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel_id, 'pid');
  ensureNum(req.patients_count, 'pc');
  ensureEnum(req.channel_preference, 'cp', ['phone','sms','email','patient_portal','mail','in_person','mixed','phone_sms','sms_email','multi_modal']);
  ensureStr(req.language, 'lang');
  ensureEnum(req.best_time, 'bt', ['morning','afternoon','evening','weekend','anytime']);
  ensureStr(req.campaign_id, 'cid');
  return { panel: req.panel_id };
}
function disenrollment_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.panel_id, 'pid');
  ensureNum(req.patients_count, 'pc');
  ensureStr(req.reason, 'rsn');
  ensureStr(req.insurance_change, 'ic');
  ensureNum(req.reach_attempt, 'ra');
  ensureNum(req.highest_cohort_to_attempt, 'hcta');
  return { panel: req.panel_id };
}

function funcs() { return { risk_cohort_build, high_risk_panel, care_gap_panel, outreach_panel, disenrollment_panel }; }
module.exports = { funcs, ValidationError };