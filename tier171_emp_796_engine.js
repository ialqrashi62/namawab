// filepath: tier171_emp_796_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hrm_dashboard(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.headcount, 'hc'); ensureNum(req.open_positions, 'op');
  ensureNum(req.turnover_pct, 'tp'); ensureNum(req.avg_tenure_yrs, 'at');
  ensureNum(req.satisfaction_score, 'ss'); ensureEnum(req.unit, 'un', ['ICU','ER','med_surg','OR','radiology','pharmacy','lab','other','NA']);
  ensureNum(req.overtime_hours, 'oh'); ensureNum(req.absenteeism_pct, 'ab');
  ensureStr(req.provider, 'pr');
  return { hd_id: `hd_${Date.now()}`, patient_id: req.patient_id, unit: req.unit, hc: req.headcount };
}

function recruitment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.position, 'po'); ensureEnum(req.role, 'rl', ['RN','MD','PA','NP','tech','admin','other','NA']);
  ensureNum(req.applicants, 'ap'); ensureNum(req.interviews, 'in');
  ensureNum(req.offers, 'of'); ensureNum(req.days_to_fill, 'df');
  ensureEnum(req.source, 'sr', ['internal','referral','agency','indeed','NA']);
  ensureNum(req.cost_per_hire, 'cp'); ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, patient_id: req.patient_id, role: req.role, days: req.days_to_fill };
}

function training(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.module_name, 'mn'); ensureNum(req.duration_hr, 'du');
  ensureNum(req.attendees, 'at'); ensureNum(req.passes_pct, 'pp');
  ensureEnum(req.method, 'mt', ['online','classroom','simulation','hands_on','NA']);
  ensureBool(req.ceu_credit, 'cc'); ensureNum(req.satisfaction, 'sa');
  ensureStr(req.provider, 'pr');
  return { tn_id: `tn_${Date.now()}`, patient_id: req.patient_id, mod: req.module_name, pass: req.passes_pct };
}

function performance(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.employee_id, 'ei'); ensureEnum(req.period, 'pr', ['quarterly','semi','annual','probation','NA']);
  ensureNum(req.score_overall, 'so'); ensureNum(req.goals_met, 'gm');
  ensureNum(req.goals_total, 'gt'); ensureEnum(req.rating, 'rt', ['exceeds','meets','partial','below','NA']);
  ensureBool(req.pip, 'pp'); ensureEnum(req.disposition, 'di', ['continue','promote','develop','term','NA']);
  ensureStr(req.provider, 'pr');
  return { pf_id: `pf_${Date.now()}`, patient_id: req.patient_id, ei: req.employee_id, rt: req.rating };
}

function compensation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.role, 'ro'); ensureNum(req.base_salary, 'bs');
  ensureNum(req.hours_per_week, 'hw'); ensureNum(req.bonus, 'bo');
  ensureEnum(req.benefits_tier, 'bt', ['I','II','III','IV','NA']);
  ensureNum(req.cmo_incentive, 'ci'); ensureNum(req.satisfaction, 'sa');
  ensureEnum(req.disposition, 'di', ['continue','adjust','negotiate','NA']);
  ensureStr(req.provider, 'pr');
  return { cp_id: `cp_${Date.now()}`, patient_id: req.patient_id, role: req.role, sal: req.base_salary };
}

function funcs() { return { hrm_dashboard, recruitment, training, performance, compensation }; }
module.exports = { funcs, ValidationError };