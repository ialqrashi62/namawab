// filepath: tier159_hos_747_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bed(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.ward, 'wd', ['ER','OR','PACU','ICU','CCU','NICU','PICU','SDU','ward_med','ward_surg','ward_obs','psy','rehab','L&D','postpartum','other']);
  ensureNum(req.bed_number, 'bn');
  ensureEnum(req.status, 'st', ['clean','occupied','pending_discharge','dirty','maintenance','reserved','isolation','NA']);
  ensureNum(req.los_hours, 'lh');
  ensureEnum(req.isolation, 'is', ['none','contact','droplet','airborne','protective','reverse','NA']);
  ensureNum(req.acuity_score, 'as');
  ensureEnum(req.admit_source, 'as2', ['ER','OR','transfer','direct','clinic','other','NA']);
  ensureEnum(req.discharge_planning, 'dp', ['none','initiated','in_progress','barrier','ready','NA']);
  ensureStr(req.attending, 'at');
  ensureStr(req.provider, 'pr');
  return { bd_id: `bed_${Date.now()}`, patient_id: req.patient_id, ward: req.ward };
}
function staffing(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.staff_id, 'si');
  ensureEnum(req.role, 'ro', ['RN','LPN','CNA','MD','DO','PA','NP','RT','PT','OT','SLP','pharmacist','tech','sitter','charge','other']);
  ensureNum(req.hours_worked, 'hw');
  ensureNum(req.hours_overtime, 'ho');
  ensureNum(req.patients_assigned, 'pa');
  ensureNum(req.acuity_avg, 'aa');
  ensureBool(req.break_taken, 'bt');
  ensureBool(req.lunch_taken, 'lt');
  ensureNum(req.turnover_count, 'tc');
  ensureNum(req.admissions_count, 'ac');
  ensureNum(req.discharges_count, 'dc');
  ensureBool(req.incident_reported, 'ir');
  ensureStr(req.provider, 'pr');
  return { st_id: `stf_${Date.now()}`, staff_id: req.staff_id, role: req.role };
}
function incident(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.incident_id, 'ii');
  ensureEnum(req.type, 'tp', ['medication_error','patient_fall','pressure_injury','HAI','wrong_site','retained_object','transfusion','specimen','lab_error','delay_in_care','communication','security','workplace_violence','equipment','other','NA']);
  ensureEnum(req.severity, 'sv', ['near_miss','no_harm','mild','moderate','severe','death','NA']);
  ensureEnum(req.location, 'lc', ['ER','OR','ICU','ward','clinic','home','other','NA']);
  ensureStr(req.reporter, 'rp');
  ensureBool(req.witness, 'wi');
  ensureBool(req.root_cause_analysis, 'rc');
  ensureBool(req.corrective_action, 'ca');
  ensureBool(req.reportable_to_state, 'rs');
  ensureNum(req.followup_days, 'fu');
  ensureStr(req.provider, 'pr');
  return { in_id: `inc_${Date.now()}`, incident_id: req.incident_id, type: req.type };
}
function quality_metric(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureNum(req.month, 'mo');
  ensureNum(req.year, 'yr');
  ensureEnum(req.metric, 'mt', ['readmission_30d','mortality_30d','HAI_rate','fall_rate','pressure_injury_rate','medication_error_rate','CLABSI','CAUTI','VAP','SSI','hand_hygiene','patient_satisfaction','door_to_provider_minutes','door_to_balloon_minutes','AMI_mortality','stroke_mortality','NA','other']);
  ensureNum(req.numerator, 'nu');
  ensureNum(req.denominator, 'de');
  ensureNum(req.rate, 'ra');
  ensureNum(req.benchmark, 'be');
  ensureNum(req.benchmark_pct_diff, 'bd');
  ensureEnum(req.analysis, 'an', ['better','similar','worse','no_benchmark','NA']);
  ensureBool(req.action_plan, 'ap');
  ensureStr(req.provider, 'pr');
  return { qm_id: `qme_${Date.now()}`, metric: req.metric };
}
function risk_mgmt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.risk_id, 'ri');
  ensureEnum(req.category, 'ct', ['clinical','operational','financial','regulatory','legal','reputational','technology','other','NA']);
  ensureEnum(req.severity, 'sv', ['low','moderate','high','critical','NA']);
  ensureNum(req.likelihood, 'li');
  ensureNum(req.impact_score, 'is');
  ensureNum(req.inherent_risk, 'ir');
  ensureNum(req.residual_risk, 'rr');
  ensureEnum(req.response, 'rp', ['avoid','transfer','mitigate','accept','exploit','NA']);
  ensureBool(req.mitigation_plan, 'mp');
  ensureNum(req.review_days, 'rd');
  ensureStr(req.provider, 'pr');
  return { rm_id: `rmg_${Date.now()}`, risk_id: req.risk_id, category: req.category };
}

function funcs() { return { bed, staffing, incident, quality_metric, risk_mgmt }; }
module.exports = { funcs, ValidationError };