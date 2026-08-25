// filepath: tier164_hum_767_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function refugee_health(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.country_origin, 'co', ['Syria','Afghanistan','Ukraine','Sudan','Venezuela','Myanmar','other','NA']);
  ensureNum(req.displacement_months, 'dm'); ensureBool(req.completed_screening, 'cs');
  ensureNum(req.immunizations_count, 'ic'); ensureBool(req.tb_screening, 'ts');
  ensureBool(req.mental_health_screen, 'mh'); ensureNum(req.chronic_disease_count, 'cd');
  ensureEnum(req.accommodation, 'ac', ['camp','host','apartment','family','unhoused','NA']);
  ensureEnum(req.disposition, 'di', ['intake','primary_care','specialist','urgent','NA']);
  ensureStr(req.provider, 'pr');
  return { rh_id: `rh_${Date.now()}`, patient_id: req.patient_id, origin: req.country_origin, disp: req.disposition };
}

function displaced_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.displacement_type, 'dt', ['conflict','natural_disaster','economic','climate','other','NA']);
  ensureNum(req.time_since_displacement_days, 'td'); ensureNum(req.family_count, 'fc');
  ensureEnum(req.acute_need, 'an', ['shelter','food','water','medical','multiple','NA']);
  ensureNum(req.chronic_disease_count, 'cd'); ensureBool(req.medication_access, 'ma');
  ensureEnum(req.chronic_care, 'cc', ['sustained','interrupted','no_access','NA']);
  ensureEnum(req.disposition, 'di', ['ongoing','refer','discharge','NA']);
  ensureStr(req.provider, 'pr');
  return { dc_id: `dc_${Date.now()}`, patient_id: req.patient_id, type: req.displacement_type, care: req.chronic_care };
}

function low_resource_intervention(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.intervention, 'in', ['task_shifting','mhealth','community_health_worker','telehealth','point_of_care','NA']);
  ensureNum(req.cost_per_unit, 'cu'); ensureNum(req.units_delivered, 'ud');
  ensureNum(req.train_hours, 'th'); ensureEnum(req.setting, 'se', ['rural','urban','peri_urban','remote','NA']);
  ensureBool(req.sustainability, 'su'); ensureNum(req.outcome_pct, 'op');
  ensureEnum(req.disposition, 'di', ['scale','maintain','pivot','end','NA']);
  ensureStr(req.provider, 'pr');
  return { lr_id: `lr_${Date.now()}`, patient_id: req.patient_id, intervention: req.intervention, outcome: req.outcome_pct };
}

function vector_control(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.vector, 've', ['mosquito','tick','sandfly','tsetse','flea','triatomine','other','NA']);
  ensureEnum(req.disease, 'ds', ['malaria','dengue','leishmaniasis','chagas','Lyme','other','NA']);
  ensureNum(req.intervention_coverage_pct, 'ic'); ensureNum(req.cases_pre, 'cp');
  ensureNum(req.cases_post, 'cp2'); ensureNum(req.case_reduction_pct, 'cr');
  ensureEnum(req.method, 'mt', ['IRS','ITN','larviciding','environmental','combination','NA']);
  ensureNum(req.cost_per_unit, 'cu'); ensureStr(req.provider, 'pr');
  return { vc_id: `vc_${Date.now()}`, patient_id: req.patient_id, vector: req.vector, reduction: req.case_reduction_pct };
}

function community_screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.screening_type, 'st', ['TB','HIV','diabetes','hypertension','malaria','malnutrition','NA']);
  ensureNum(req.target_count, 'tc'); ensureNum(req.screened_count, 'sc');
  ensureBool(req.community_engaged, 'ce'); ensureNum(req.positive_count, 'pc');
  ensureNum(req.treatment_initiated, 'ti'); ensureEnum(req.setting, 'se', ['village','school','workplace','health_facility','NA']);
  ensureNum(req.cost_per_screen, 'cs'); ensureStr(req.provider, 'pr');
  return { cs_id: `cs_${Date.now()}`, patient_id: req.patient_id, type: req.screening_type, screened: req.screened_count };
}

function funcs() { return { refugee_health, displaced_care, low_resource_intervention, vector_control, community_screening }; }
module.exports = { funcs, ValidationError };