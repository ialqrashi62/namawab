// filepath: tier102_surg_transplant_537_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function transplant_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.evaluation_id, 'aid');
  ensureEnum(req.organ, 'org', ['kidney','liver','heart','lung','pancreas','small_bowel','multi','other','unknown','none']);
  ensureNum(req.meld_score, 'meld');
  ensureBool(req.psychiatric_clearance, 'pc');
  ensureBool(req.cardiac_clearance, 'cc');
  ensureBool(req.infection_screen, 'is');
  ensureBool(req.drug_screen, 'ds');
  ensureNum(req.contraindications, 'cont');
  ensureEnum(req.status, 'sts', ['listed','not_listed','pending','deferred','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.evaluation_id };
}
function transplant_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.organ, 'org', ['kidney','liver','heart','lung','pancreas','small_bowel','multi','other','unknown','none']);
  ensureEnum(req.donor_type, 'dt', ['living_related','living_unrelated','deceased_dbd','deceased_dcd','other','unknown']);
  ensureNum(req.cold_ischemia_hours, 'cih');
  ensureNum(req.surgery_hours, 'sh');
  ensureNum(req.ebl_ml, 'ebl');
  ensureNum(req.complications, 'comp');
  ensureNum(req.icu_days, 'icd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function post_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.days_post_transplant, 'dpt');
  ensureNum(req.tacrolimus_level, 'tac');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.liver_function, 'lf');
  ensureNum(req.rejection_episodes, 're');
  ensureNum(req.infections_count, 'ic');
  ensureNum(req.medication_adherence, 'ma');
  ensureNum(req.graft_function, 'gf');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function donor_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureEnum(req.donor_type, 'dt', ['living_related','living_unrelated','deceased','other','unknown']);
  ensureNum(req.age, 'age');
  ensureBool(req.medical_clearance, 'mc');
  ensureBool(req.psychiatric_clearance, 'pc');
  ensureNum(req.organ_specific_tests, 'ost');
  ensureEnum(req.outcome, 'out', ['cleared','declined','pending','other','unknown']);
  ensureNum(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function immunosuppression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prescription_id, 'pid');
  ensureEnum(req.regimen, 'reg', ['tacrolimus_mmf','cyclosporine_mmf','tacrolimus_sirolimus','cyclosporine_azathioprine','other','unknown','none']);
  ensureNum(req.tacrolimus_dose, 'td');
  ensureNum(req.mmf_dose, 'md');
  ensureBool(req.steroid_use, 'su');
  ensureNum(req.infection_prophylaxis, 'ip');
  ensureNum(req.drug_levels, 'dl');
  ensureNum(req.side_effects, 'se');
  ensureStr(req.provider, 'pr');
  return { pid: req.prescription_id };
}

function funcs() { return { transplant_evaluation, transplant_surgery, post_transplant, donor_workup, immunosuppression }; }
module.exports = { funcs, ValidationError };
