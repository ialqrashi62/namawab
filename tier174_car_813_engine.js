// filepath: tier174_car_813_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cad_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['stable','unstable','variant','NA']);
  ensureNum(req.lvef_pct, 'lv'); ensureEnum(req.stress_test, 'st', ['negative','positive','equivocal','NA']);
  ensureNum(req.med_adherence, 'ma'); ensureNum(req.bp_baseline, 'bb');
  ensureNum(req.ldl_baseline, 'lb'); ensureNum(req.symptoms, 'sx');
  ensureNum(req.followup_months, 'fm'); ensureStr(req.provider, 'pr');
  return { cf_id: `cf_${Date.now()}`, patient_id: req.patient_id, lvef: req.lvef_pct, st: req.stress_test };
}

function valve_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.valve_type, 'vt', ['AVR','MVR','TVR','repair','NA']);
  ensureNum(req.echo_grad_mmHg, 'eg'); ensureNum(req.lvef_pct, 'lv');
  ensureBool(req.anticoag, 'ac'); ensureNum(req.inr, 'in');
  ensureNum(req.symptoms, 'sx'); ensureNum(req.next_visit_months, 'nv');
  ensureStr(req.provider, 'pr');
  return { vf_id: `vf_${Date.now()}`, patient_id: req.patient_id, valve: req.valve_type, eg: req.echo_grad_mmHg };
}

function pacemaker_check(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.battery_pct, 'bp');
  ensureNum(req.lead_impedance, 'li'); ensureNum(req.pacing_pct, 'pp');
  ensureBool(req.ekg_shows_paced, 'es'); ensureBool(req.complications, 'co');
  ensureNum(req.months_post_implant, 'mi'); ensureStr(req.provider, 'pr');
  return { pc_id: `pc_${Date.now()}`, patient_id: req.patient_id, battery: req.battery_pct, mi: req.months_post_implant };
}

function icd_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.shock_count_30d, 'sc');
  ensureNum(req.battery_pct, 'bp'); ensureNum(req.lead_impedance, 'li');
  ensureEnum(req.detection, 'de', ['normal','sensitivity_low','sensitivity_high','oversensing','undersensing','NA']);
  ensureNum(req.patient_activated, 'pa'); ensureNum(req.shocks_appropriate, 'sa');
  ensureNum(req.followup_months, 'fm'); ensureStr(req.provider, 'pr');
  return { if_id: `if_${Date.now()}`, patient_id: req.patient_id, bp: req.battery_pct, sc: req.shock_count_30d };
}

function echo_followup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.lvef_pct, 'lv');
  ensureEnum(req.valve_function, 'vf', ['normal','mild_regurge','mod_regurge','severe_regurge','stenosis','NA']);
  ensureNum(req.pah_mmHg, 'ph'); ensureEnum(req.diastolic_grade, 'dg', ['I','II','III','NA']);
  ensureBool(req.mass_present, 'mp'); ensureNum(req.followup_months, 'fm');
  ensureStr(req.provider, 'pr');
  return { ef_id: `ef_${Date.now()}`, patient_id: req.patient_id, lvef: req.lvef_pct, vf: req.valve_function };
}

function funcs() { return { cad_follow, valve_fup, pacemaker_check, icd_follow, echo_followup }; }
module.exports = { funcs, ValidationError };