// filepath: tier171_phr_797_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function med_reconciliation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.meds_count, 'mc'); ensureNum(req.discrepancies, 'ds');
  ensureNum(req.omitted_count, 'oc'); ensureNum(req.added_count, 'ac');
  ensureNum(req.changed_count, 'cc'); ensureBool(req.allergy_checked, 'al');
  ensureBool(req.duplicates_resolved, 'dr'); ensureNum(req.reconciliation_min, 'rm');
  ensureStr(req.provider, 'pr');
  return { mr_id: `mr_${Date.now()}`, patient_id: req.patient_id, meds: req.meds_count, disc: req.discrepancies };
}

function high_alert(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug_name, 'dn'); ensureEnum(req.class, 'cl', ['anticoag','insulin','opioid','chemo','epidural','NA']);
  ensureNum(req.dose_mg, 'ds'); ensureNum(req.blood_sugar, 'bs');
  ensureEnum(req.indication, 'in', ['acute','chronic','procedure','NA']);
  ensureBool(req.independent_double_check, 'id'); ensureEnum(req.disposition, 'di', ['given','held','reduced','NA']);
  ensureStr(req.provider, 'pr');
  return { ha_id: `ha_${Date.now()}`, patient_id: req.patient_id, drug: req.drug_name, ds: req.disposition };
}

function renal_dosing(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug, 'dr'); ensureNum(req.egfr, 'eg');
  ensureNum(req.crcl, 'cr'); ensureNum(req.standard_dose, 'sd');
  ensureNum(req.adjusted_dose, 'ad'); ensureEnum(req.adjustment, 'aj', ['none','reduce','increase','interval','NA']);
  ensureBool(req.level_check, 'lc'); ensureEnum(req.disposition, 'di', ['continue','adjust','hold','NA']);
  ensureStr(req.provider, 'pr');
  return { rd_id: `rd_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, egfr: req.egfr };
}

function look_alike(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.incident, 'in', ['wrong_drug','wrong_dose','wrong_route','other','NA']);
  ensureEnum(req.severity, 'sv', ['none','mild','moderate','severe','death','NA']);
  ensureBool(req.catch_pre_admin, 'cp'); ensureEnum(req.contributing, 'co', ['sound','packaging','label','none','multiple','NA']);
  ensureBool(req.system_change, 'sc'); ensureNum(req.training_hours, 'th');
  ensureEnum(req.disposition, 'di', ['continue','education','process_change','NA']);
  ensureStr(req.provider, 'pr');
  return { la_id: `la_${Date.now()}`, patient_id: req.patient_id, incident: req.incident, sv: req.severity };
}

function controlled_substance(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.schedule, 'sc', ['II','III','IV','V','NA']);
  ensureStr(req.drug_name, 'dn'); ensureNum(req.dose_mg, 'ds');
  ensureNum(req.witness_count, 'wc'); ensureBool(req.waste_documented, 'wd');
  ensureEnum(req.route, 'ro', ['PO','IV','IM','SC','PR','transdermal','NA']);
  ensureNum(req.quantity_admin, 'qa'); ensureNum(req.quantity_wasted, 'qw');
  ensureStr(req.provider, 'pr');
  return { cs_id: `cs_${Date.now()}`, patient_id: req.patient_id, drug: req.drug_name, sch: req.schedule };
}

function funcs() { return { med_reconciliation, high_alert, renal_dosing, look_alike, controlled_substance }; }
module.exports = { funcs, ValidationError };