// filepath: tier162_occ_761_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function work_fitness(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.occupation, 'oc', ['construction','office','healthcare','transport','agriculture','mining','firefighter','other','NA']);
  ensureNum(req.years_experience, 'ye'); ensureBool(req.workplace_injury_30d, 'wi');
  ensureEnum(req.fitness_assessment, 'fa', ['fit','fit_with_restrictions','unfit','pending','NA']);
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.hr, 'hr');
  ensureEnum(req.vision_assessment, 'va', ['normal','corrected','uncorrected','NA']);
  ensureEnum(req.hearing_assessment, 'ha', ['normal','mild_loss','moderate_loss','severe_loss','NA']);
  ensureEnum(req.disposition, 'di', ['return','modify','refer','disable','NA']);
  ensureStr(req.provider, 'pr');
  return { wf_id: `wf_${Date.now()}`, patient_id: req.patient_id, fitness: req.fitness_assessment };
}

function exposure_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.exposure, 'ex', ['chemical','biological','radiation','noise','dust','ergonomic','psychosocial','other','NA']);
  ensureNum(req.exposure_years, 'ey'); ensureNum(req.exposure_intensity, 'ei');
  ensureBool(req.ppe_used, 'pu'); ensureEnum(req.ppe_type, 'pt', ['respirator','gloves','goggles','hearing','full','multiple','NA']);
  ensureNum(req.biological_monitoring, 'bm'); ensureBool(req.outcome_measured, 'om');
  ensureEnum(req.outcome, 'ot', ['no_effect','subclinical','clinical','NA']);
  ensureBool(req.workup_complete, 'wc'); ensureStr(req.provider, 'pr');
  return { ee_id: `ee_${Date.now()}`, patient_id: req.patient_id, exposure: req.exposure, outcome: req.outcome };
}

function ergonomics(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.job_type, 'jt', ['sitting','standing','lifting','repetitive','vibration','computer','NA']);
  ensureNum(req.hours_per_day, 'hp'); ensureNum(req.symptom_score, 'ss');
  ensureEnum(req.body_part, 'bp', ['lower_back','neck','shoulder','wrist','knee','multiple','NA']);
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high','NA']);
  ensureBool(req.workstation_assessed, 'wa'); ensureEnum(req.intervention, 'in', ['adjustment','equipment','PT','rotation','combination','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { er_id: `er_${Date.now()}`, patient_id: req.patient_id, body: req.body_part, risk: req.risk_level };
}

function respirator_fit(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.respirator_type, 'rt', ['N95','half_face','full_face','PAPR','SCBA','other','NA']);
  ensureNum(req.fit_factor, 'ff'); ensureEnum(req.qualitative_pass, 'qp', ['pass','fail','unclear','NA']);
  ensureNum(req.quantitative_pass, 'qp2'); ensureEnum(req.size, 'sz', ['small','medium','large','xl','NA']);
  ensureEnum(req.method, 'mt', ['qualitative','quantitative','CNC','porta_count','other','NA']);
  ensureNum(req.last_fit_test_days, 'lf'); ensureBool(req.retest_due, 'rd');
  ensureEnum(req.disposition, 'di', ['fit','recheck','alternate','NA']);
  ensureStr(req.provider, 'pr');
  return { rf_id: `rf_${Date.now()}`, patient_id: req.patient_id, respirator: req.respirator_type, ff: req.fit_factor };
}

function return_to_work(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_off, 'do'); ensureNum(req.injury_date, 'id');
  ensureEnum(req.injury_type, 'it', ['musculoskeletal','mental_health','surgery','chronic','injury','other','NA']);
  ensureNum(req.fitness_pct, 'fp'); ensureEnum(req.job_demands, 'jd', ['sedentary','light','medium','heavy','very_heavy','NA']);
  ensureBool(req.workplace_accommodation, 'wa'); ensureEnum(req.accommodation, 'ac', ['modified_hours','modified_duties','gradual','equipment','combination','NA']);
  ensureNum(req.followup_days, 'fd'); ensureEnum(req.disposition, 'di', ['full','modified','not_yet','unable','NA']);
  ensureStr(req.provider, 'pr');
  return { rw_id: `rw_${Date.now()}`, patient_id: req.patient_id, days: req.days_off, fitness: req.fitness_pct };
}

function funcs() { return { work_fitness, exposure_eval, ergonomics, respirator_fit, return_to_work }; }
module.exports = { funcs, ValidationError };