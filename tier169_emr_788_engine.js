// filepath: tier169_emr_788_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_admission(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.admission_type, 'at', ['elective','urgent','emergent','trauma','transfer','NA']);
  ensureEnum(req.diagnosis, 'dx', ['chest_pain','stroke','sepsis','fall','other','NA']);
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.hr, 'hr');
  ensureEnum(req.unit, 'un', ['ICU','CCU','stroke_unit','med_surg','obs','NA']);
  ensureNum(req.length_of_stay_days, 'ls'); ensureEnum(req.discharge_disposition, 'dd', ['home','rehab','SNF','hospice','death','AMA','NA']);
  ensureStr(req.provider, 'pr');
  return { pa_id: `pa_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, unit: req.unit };
}

function nursing_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.hr, 'hr'); ensureNum(req.rr, 'rr');
  ensureNum(req.spo2, 'sp'); ensureNum(req.temp_c, 'tc');
  ensureNum(req.pain_score, 'ps'); ensureEnum(req.fall_risk, 'fr', ['low','moderate','high','NA']);
  ensureNum(req.braden_score, 'bs2'); ensureEnum(req.shift, 'sh', ['day','evening','night','NA']);
  ensureStr(req.provider, 'pr');
  return { na_id: `na_${Date.now()}`, patient_id: req.patient_id, fall: req.fall_risk, braden: req.braden_score };
}

function med_admin(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug_name, 'dn'); ensureNum(req.dose_mg, 'ds');
  ensureEnum(req.route, 'ro', ['PO','IV','IM','SC','PR','Inh','NA']);
  ensureNum(req.scheduled_time, 'st'); ensureNum(req.actual_time, 'at');
  ensureBool(req.barcode_scanned, 'bs'); ensureBool(req.patient_id_verified, 'pi');
  ensureEnum(req.outcome, 'ot', ['given','refused','held','NA']);
  ensureStr(req.provider, 'pr');
  return { ma_id: `ma_${Date.now()}`, patient_id: req.patient_id, drug: req.drug_name, ot: req.outcome };
}

function care_plan(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.problem, 'pr', ['pain','dyspnea','fall','skin_breakdown','nutrition','NA']);
  ensureStr(req.goal, 'go'); ensureEnum(req.intervention, 'in', ['medication','monitoring','mobility','education','NA']);
  ensureNum(req.target_date, 'td'); ensureBool(req.met, 'me');
  ensureEnum(req.status, 'st', ['active','met','revised','discontinued','NA']);
  ensureStr(req.provider, 'pr');
  return { cp_id: `cp_${Date.now()}`, patient_id: req.patient_id, problem: req.problem, status: req.status };
}

function discharge_summary(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.length_of_stay, 'ls'); ensureEnum(req.diagnosis, 'dx', ['pneumonia','CHF','MI','stroke','other','NA']);
  ensureNum(req.procedures_count, 'pc'); ensureNum(req.medications_count, 'mc');
  ensureEnum(req.disposition, 'di', ['home','home_health','rehab','SNF','hospice','NA']);
  ensureNum(req.followup_days, 'fd'); ensureBool(req.readmitted_30d, 'rd');
  ensureStr(req.provider, 'pr');
  return { ds_id: `ds_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, disp: req.disposition };
}

function funcs() { return { patient_admission, nursing_assessment, med_admin, care_plan, discharge_summary }; }
module.exports = { funcs, ValidationError };