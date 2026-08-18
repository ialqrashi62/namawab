// filepath: tier67_surg_periop_366_surg_complications_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function intraop_complication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.complication_type, 'ct', ['bleeding','organ_injury','vessel_injury','nerve_injury','cardiac_arrest','anaphylaxis','malignant_hyperthermia','hypothermia','equipment_failure','retained_object','wrong_site','other']);
  ensureEnum(req.severity, 'sev', ['minor','moderate','major','life_threatening','fatal']);
  ensureStr(req.intervention, 'int');
  ensureNum(req.ebl_total_ml, 'etm');
  ensureBool(req.anesthesia_change, 'ac');
  ensureBool(req.case_terminated_early, 'cte');
  ensureStr(req.documented_by, 'db');
  return { complication: req.complication_type };
}
function postop_complication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.complication_type, 'ct', ['wound_infection','bleeding','dvt','pe','ileus','bowel_obstruction','anastomotic_leak','suture_failure','pneumonia','uti','sepsis','cardiac_event','other']);
  ensureEnum(req.severity, 'sev', ['minor','moderate','major','life_threatening','fatal']);
  ensureNum(req.post_op_day, 'pod');
  ensureStr(req.intervention, 'int');
  ensureBool(req.culture_taken, 'ct');
  ensureBool(req.readmit_required, 'rr');
  ensureNum(req.clavien_dindo, 'cd');
  return { complication: req.complication_type };
}
function readmission_30d(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.readmit_date, 'rd');
  ensureNum(req.days_to_readmit, 'dtr');
  ensureEnum(req.reason, 'rsn', ['surgical_site_infection','bleeding','bowel_obstruction','cardiac_event','pneumonia','sepsis','wound_dehiscence','dvt_pe','fever','other','pain_control','ileus']);
  ensureEnum(req.severity, 'sev', ['minor','moderate','major','life_threatening','fatal']);
  ensureNum(req.length_of_stay_days, 'losd');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.outcome, 'out', ['discharged_home','discharged_home_with_services','snf','rehab','expired','hospice','other','hospice_home']);
  return { reason: req.reason };
}
function reoperation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.reoperation_id, 'ri');
  ensureStr(req.original_case_id, 'oci');
  ensureNum(req.days_to_reop, 'dtr');
  ensureEnum(req.reason, 'rsn', ['hemorrhage','infection','anastomotic_leak','wound_dehiscence','foreign_body_retained','bowel_obstruction','organ_failure','other','broken_implant','failed_closure']);
  ensureStr(req.procedure_cpt, 'pcpt');
  ensureBool(req.urgent, 'urg');
  ensureEnum(req.outcome, 'out', ['successful','unsuccessful','complicated','partially_successful','pending','ongoing','fatal']);
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','organ_failure','cardiac_arrest','reintubation','other']);
  return { reason: req.reason };
}
function ssi_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.ssi_type, 'st', ['superficial','deep','organ_space','superficial_incision','deep_incision','organ_space_other','none','pending']);
  ensureNum(req.detected_day, 'dd');
  ensureStr(req.culture, 'cult');
  ensureEnum(req.treatment, 'tx', ['antibiotics_wound_open','antibiotics_only','iv_antibiotics','wound_packing','drain','surgical_debridement','conservative','other']);
  ensureBool(req.readmit, 'rr');
  ensureBool(req.cdc_defined, 'cdc');
  ensureBool(req.reported_to_nhsn, 'r2n');
  return { ssi: req.ssi_type };
}

function funcs() { return { intraop_complication, postop_complication, readmission_30d, reoperation, ssi_tracking }; }
module.exports = { funcs, ValidationError };