// filepath: tier100_obgyn_gyn_onc_524_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ovarian_cyst(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cyst_size_cm, 'cs');
  ensureEnum(req.cyst_type, 'ct', ['simple','hemorrhagic','endometrioma','dermoid','complex','malignant_suspicious','other','unknown']);
  ensureNum(req.ca125, 'ca');
  ensureEnum(req.rims_wall, 'rw', ['thin','thick','papillary','solid','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['observation','medical','surgical','referral','other','unknown']);
  ensureBool(req.menopausal_status, 'ms');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cervical_cancer_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureEnum(req.pap_result, 'pr', ['negative','ascus','lsil','hsil','agc','ais','cancer','inadequate','other','unknown']);
  ensureEnum(req.hpv_status, 'hpv', ['positive','negative','pending','not_done','other','unknown']);
  ensureEnum(req.colposcopy_needed, 'cn', ['yes','no','pending','other','unknown']);
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function endometrial_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.endometrial_thickness, 'et');
  ensureEnum(req.biopsy_result, 'br', ['benign','hyperplasia','cancer','inadequate','pending','other','unknown']);
  ensureNum(req.stage, 'st');
  ensureEnum(req.grade, 'gr', ['1','2','3','unknown','other','none']);
  ensureEnum(req.treatment, 'tx', ['surgery','radiation','chemo','combination','hormone','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ovarian_cancer_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.figo_stage, 'fs', ['1','2','3','4','unknown','other','none']);
  ensureNum(req.tumor_size, 'ts');
  ensureNum(req.ca125_level, 'ca');
  ensureNum(req.ascites, 'asc');
  ensureNum(req.lymph_nodes_involved, 'lni');
  ensureNum(req.metastases, 'mets');
  ensureEnum(req.treatment, 'tx', ['surgery','chemo','radiation','targeted','combination','palliative','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function gyn_chemotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureEnum(req.regimen, 'reg', ['carbo_taxol','carbo_doxo','cisplatin','topotecan','gemcitabine','bevacizumab','olaparib','other','unknown','none']);
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.dose_reduction_pct, 'drp');
  ensureNum(req.toxicity_grade, 'tg');
  ensureNum(req.response, 'resp');
  ensureNum(req.cycles_planned, 'cp');
  ensureNum(req.cycles_completed, 'cc');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}

function funcs() { return { ovarian_cyst, cervical_cancer_screening, endometrial_cancer, ovarian_cancer_staging, gyn_chemotherapy }; }
module.exports = { funcs, ValidationError };
