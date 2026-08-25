// filepath: tier162_pub_759_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function epidemiology(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.population_size, 'ps'); ensureNum(req.cases, 'cs');
  ensureNum(req.time_period_days, 'tp'); ensureNum(req.incidence_100k, 'in');
  ensureEnum(req.disease, 'ds', ['COVID','flu','TB','HIV','malaria','measles','cholera','other','NA']);
  ensureEnum(req.setting, 'se', ['urban','rural','mixed','closed','NA']);
  ensureNum(req.r0, 'r0'); ensureNum(req.case_fatality_pct, 'cf');
  ensureBool(req.ongoing_outbreak, 'ob'); ensureStr(req.provider, 'pr');
  return { ep_id: `ep_${Date.now()}`, patient_id: req.patient_id, disease: req.disease, incidence: req.incidence_100k };
}

function outbreak(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.pathogen, 'pa', ['bacterial','viral','parasitic','fungal','prion','unknown','NA']);
  ensureNum(req.index_cases, 'ic'); ensureEnum(req.transmission, 'tr', ['airborne','droplet','contact','vector','food_water','blood','other','NA']);
  ensureNum(req.reproduction_number, 'rn'); ensureNum(req.serial_interval_days, 'si');
  ensureBool(req.contact_tracing, 'ct'); ensureNum(req.contacts_identified, 'ci');
  ensureBool(req.isolation_in_place, 'ip'); ensureEnum(req.control_measure, 'cm', ['vaccination','isolation','quarantine','vector','WASH','combination','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ob_id: `ob_${Date.now()}`, patient_id: req.patient_id, pathogen: req.pathogen, rn: req.reproduction_number };
}

function screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.screening_program, 'sp', ['mammogram','pap','colonoscopy','low_dose_CT','a1c','lipid','depression','other','NA']);
  ensureNum(req.eligible_count, 'ec'); ensureNum(req.screened_count, 'sc');
  ensureNum(req.positive_count, 'pc'); ensureNum(req.confirmed_count, 'cn');
  ensureEnum(req.coverage_pct, 'cv', ['<25','25-50','50-75','75-90','>90','NA']);
  ensureEnum(req.frequency, 'fq', ['annual','biennial','triennial','5_year','10_year','one_time','NA']);
  ensureBool(req.followup_complete, 'fc'); ensureStr(req.provider, 'pr');
  return { sr_id: `sr_${Date.now()}`, patient_id: req.patient_id, program: req.screening_program, coverage_pct: req.coverage_pct };
}

function contact_tracing(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.index_case_id, 'ic'); ensureEnum(req.disease, 'ds', ['TB','COVID','HIV','measles','meningitis','STD','other','NA']);
  ensureNum(req.contacts_count, 'cc'); ensureNum(req.contacts_traced_pct, 'ct');
  ensureNum(req.contacts_tested_pct, 'cp'); ensureNum(req.secondary_cases, 'sx');
  ensureEnum(req.setting, 'se', ['household','work','school','healthcare','social','other','NA']);
  ensureNum(req.trace_duration_days, 'td'); ensureBool(req.complete, 'cp2');
  ensureStr(req.provider, 'pr');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, contacts: req.contacts_count, traced_pct: req.contacts_traced_pct };
}

function health_equity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.stratifier, 'st', ['race','ethnicity','income','education','geography','disability','language','insurance','NA']);
  ensureNum(req.disparity_index, 'di'); ensureEnum(req.disparity_type, 'dt', ['access','outcome','quality','experience','NA']);
  ensureNum(req.reference_group_rate, 'rg'); ensureNum(req.target_group_rate, 'tg');
  ensureNum(req.absolute_gap, 'ag'); ensureNum(req.relative_gap, 'rl');
  ensureBool(req.target_met, 'tm'); ensureEnum(req.action, 'ac', ['outreach','navigation','insurance_expansion','language_services','social_determinants','combination','NA']);
  ensureStr(req.provider, 'pr');
  return { he_id: `he_${Date.now()}`, patient_id: req.patient_id, type: req.disparity_type, group: req.stratifier };
}

function funcs() { return { epidemiology, outbreak, screening, contact_tracing, health_equity }; }
module.exports = { funcs, ValidationError };