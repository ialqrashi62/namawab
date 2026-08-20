// filepath: tier169_icu_787_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ventilator(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['AC','SIMV','PSV','PRVC','NIV','NA']);
  ensureNum(req.tidal_volume, 'tv'); ensureNum(req.peep, 'pp');
  ensureNum(req.fio2, 'fo'); ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.peak_pressure, 'pk'); ensureNum(req.plateau_pressure, 'pl');
  ensureNum(req.days_mech, 'dm'); ensureEnum(req.weaning_status, 'ws', ['weaning','evaluating','full_support','trached','NA']);
  ensureStr(req.provider, 'pr');
  return { vn_id: `vn_${Date.now()}`, patient_id: req.patient_id, mode: req.mode, days: req.days_mech };
}

function vital_trend(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.hr_avg, 'ha'); ensureNum(req.sbp_avg, 'sa');
  ensureNum(req.spo2_avg, 'sp'); ensureNum(req.lactate, 'la');
  ensureNum(req.urine_output_24h, 'uo'); ensureNum(req.vasopressor_count, 'vc');
  ensureNum(req.sedation_score, 'ss'); ensureNum(req.days_in_icu, 'di');
  ensureStr(req.provider, 'pr');
  return { vt_id: `vt_${Date.now()}`, patient_id: req.patient_id, hr: req.hr_avg, sbp: req.sbp_avg };
}

function code_status(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.code, 'cd', ['full','DNR','DNI','DNR_DNI','comfort','NA']);
  ensureBool(req.advance_directive, 'ad'); ensureBool(req.family_meeting_held, 'fh');
  ensureStr(req.healthcare_proxy, 'hp'); ensureStr(req.dpoa, 'dp');
  ensureBool(req.spiritual_care, 'sc'); ensureNum(req.days_in_icu, 'di');
  ensureStr(req.provider, 'pr');
  return { cs_id: `cs_${Date.now()}`, patient_id: req.patient_id, code: req.code, dpoa: req.dpoa };
}

function rounding(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.team_member, 'tm', ['attending','fellow','NP','PA','RN','NA']);
  ensureStr(req.diagnosis_summary, 'ds'); ensureNum(req.systems_reviewed, 'sr');
  ensureNum(req.new_orders_count, 'no'); ensureBool(req.family_updated, 'fu');
  ensureNum(req.rounds_time_min, 'rt'); ensureNum(req.notes_length, 'nl');
  ensureEnum(req.plan, 'pl', ['continue','deescalate','escalate','discharge','NA']);
  ensureStr(req.provider, 'pr');
  return { rd_id: `rd_${Date.now()}`, patient_id: req.patient_id, plan: req.plan, new_orders: req.new_orders_count };
}

function icu_outcome(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.icu_days, 'id');
  ensureNum(req.vent_days, 'vd'); ensureNum(req.central_lines_count, 'cl');
  ensureNum(req.hospital_days, 'hd'); ensureNum(req.complication_count, 'cc');
  ensureNum(req.mortality_risk, 'mr'); ensureEnum(req.discharge_unit, 'du', ['floor','rehab','SNF','home','hospice','morgue','NA']);
  ensureEnum(req.disposition, 'di', ['home','rehab','SNF','hospice','death','NA']);
  ensureStr(req.provider, 'pr');
  return { io_id: `io_${Date.now()}`, patient_id: req.patient_id, icu: req.icu_days, disp: req.disposition };
}

function funcs() { return { ventilator, vital_trend, code_status, rounding, icu_outcome }; }
module.exports = { funcs, ValidationError };