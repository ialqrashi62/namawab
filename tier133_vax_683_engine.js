// filepath: tier133_vax_683_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vaccine_admin(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.vaccine, 'vc');
  ensureNum(req.dose_number, 'dn');
  ensureStr(req.lot, 'lot');
  ensureEnum(req.site, 's', ['LA','RA','LT','RT']);
  return { admin_id: `vax_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine, dose: req.dose_number, lot: req.lot, site: req.site };
}
function schedule_recommend(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.recommended_vaccine, 'rv');
  ensureStr(req.due_date, 'dd');
  ensureEnum(req.priority, 'pr', ['routine','catchup','high','urgent']);
  return { patient_id: req.patient_id, recommended_vaccine: req.recommended_vaccine, due_date: req.due_date, priority: req.priority };
}
function adverse_event(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.admin_id, 'aid');
  ensureStr(req.event, 'ev');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','life_threatening']);
  ensureStr(req.outcome, 'oc');
  return { admin_id: req.admin_id, event: req.event, severity: req.severity, outcome: req.outcome };
}
function contraindication(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.vaccine, 'vc');
  ensureEnum(req.type, 'tp', ['allergy','immunocompromised','pregnancy','age','medical']);
  ensureStr(req.reason, 'rs');
  return { patient_id: req.patient_id, vaccine: req.vaccine, type: req.type, reason: req.reason };
}
function coverage_report(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.vaccine, 'vc');
  ensureNum(req.target_population, 'tp');
  ensureNum(req.vaccinated, 'v');
  ensureStr(req.period, 'p');
  const pct = (req.vaccinated / req.target_population) * 100;
  return { vaccine: req.vaccine, target: req.target_population, vaccinated: req.vaccinated, coverage_pct: pct, period: req.period };
}

function funcs() { return { vaccine_admin, schedule_recommend, adverse_event, contraindication, coverage_report }; }
module.exports = { funcs, ValidationError };
