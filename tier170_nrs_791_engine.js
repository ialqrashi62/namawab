// filepath: tier170_nrs_791_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vitals(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.hr, 'hr'); ensureNum(req.rr, 'rr');
  ensureNum(req.spo2, 'sp'); ensureNum(req.temp_c, 'tc');
  ensureNum(req.pain_score, 'ps'); ensureNum(req.sedation_score, 'ss');
  ensureEnum(req.position, 'po', ['supine','sitting','standing','left_lateral','right_lateral','NA']);
  ensureStr(req.provider, 'pr');
  return { vt_id: `vt_${Date.now()}`, patient_id: req.patient_id, hr: req.hr, sbp: req.bp_systolic };
}

function handoff(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.handoff_tool, 'ht', ['SBAR','I-PASS','handoff_standard','other','NA']);
  ensureStr(req.from_nurse, 'fn'); ensureStr(req.to_nurse, 'tn');
  ensureEnum(req.shift, 'sh', ['day','evening','night','NA']);
  ensureNum(req.items_count, 'ic'); ensureNum(req.concerns_count, 'cn');
  ensureNum(req.orders_pending, 'op'); ensureBool(req.patient_stable, 'ps');
  ensureStr(req.provider, 'pr');
  return { ho_id: `ho_${Date.now()}`, patient_id: req.patient_id, tool: req.handoff_tool };
}

function wound_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.wound_type, 'wt', ['surgical','traumatic','pressure','venous','diabetic','burn','NA']);
  ensureEnum(req.stage, 'st', ['healing','granulating','epithelial','infected','dehisced','NA']);
  ensureNum(req.size_cm, 'sz'); ensureNum(req.depth_mm, 'dp');
  ensureEnum(req.exudate, 'ex', ['none','serous','serosanguinous','purulent','NA']);
  ensureBool(req.packing, 'pk'); ensureBool(req.antibiotic, 'ab');
  ensureEnum(req.dressing_change, 'dc', ['daily','twice','three','weekly','NA']);
  ensureStr(req.provider, 'pr');
  return { wc_id: `wc_${Date.now()}`, patient_id: req.patient_id, type: req.wound_type, size: req.size_cm };
}

function iv_therapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.site, 'si', ['LAC','R_ac','R_forearm','R_wrist','L_wrist','other','NA']);
  ensureNum(req.gauge, 'ga'); ensureNum(req.days_in_place, 'dp');
  ensureBool(req.patency, 'pa'); ensureBool(req.infiltration, 'in');
  ensureEnum(req.fluid_type, 'ft', ['NS','LR','D5W','D10W','albumin','other','NA']);
  ensureNum(req.rate_ml_hr, 'rt'); ensureNum(req.phlebitis_score, 'ph');
  ensureStr(req.provider, 'pr');
  return { iv_id: `iv_${Date.now()}`, patient_id: req.patient_id, site: req.site, gauge: req.gauge };
}

function med_safety(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.incident_type, 'it', ['wrong_dose','wrong_drug','wrong_patient','omission','allergy','other','NA']);
  ensureEnum(req.severity, 'sv', ['none','mild','moderate','severe','death','NA']);
  ensureStr(req.medication, 'md'); ensureStr(req.detected_by, 'de');
  ensureBool(req.patient_affected, 'pa'); ensureEnum(req.intervention, 'in', ['none','monitoring','treatment','reversal','NA']);
  ensureNum(req.harm_score, 'hs'); ensureBool(req.near_miss, 'nm');
  ensureStr(req.provider, 'pr');
  return { ms_id: `ms_${Date.now()}`, patient_id: req.patient_id, type: req.incident_type, harm: req.harm_score };
}

function funcs() { return { vitals, handoff, wound_care, iv_therapy, med_safety }; }
module.exports = { funcs, ValidationError };