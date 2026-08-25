// filepath: tier172_gyn_804_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cervical_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.pap_result, 'pr', ['normal','ASCUS','LSIL','HSIL','AGC','NA']);
  ensureBool(req.hpv_positive, 'hp'); ensureNum(req.hpv_types, 'ht');
  ensureEnum(req.vaccination, 'va', ['none','partial','complete','NA']);
  ensureEnum(req.disposition, 'di', ['continue','colposcopy','repeat','vaccinate','NA']);
  ensureNum(req.next_screen_months, 'ns'); ensureStr(req.provider, 'pr');
  return { cs_id: `cs_${Date.now()}`, patient_id: req.patient_id, pap: req.pap_result, disp: req.disposition };
}

function ovarian_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.ca125, 'c1');
  ensureNum(req.he4, 'h4'); ensureNum(req.roma_score, 'rs');
  ensureBool(req.family_history, 'fh'); ensureBool(req.brca_positive, 'bp');
  ensureEnum(req.imaging, 'im', ['normal','simple_cyst','complex_cyst','solid','ascites','NA']);
  ensureEnum(req.disposition, 'di', ['continue','monitor','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { os_id: `os_${Date.now()}`, patient_id: req.patient_id, ca: req.ca125, disp: req.disposition };
}

function endometrial_biopsy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bleeding_days, 'bd');
  ensureNum(req.endometrial_mm, 'em'); ensureEnum(req.pathology, 'pa', ['benign','atrophic','proliferative','hyperplasia_simple','hyperplasia_complex','cancer','NA']);
  ensureBool(req.sufficient_sample, 'ss'); ensureNum(req.specimen_weight_mg, 'sw');
  ensureEnum(req.complication, 'co', ['none','perforation','bleeding','infection','NA']);
  ensureStr(req.provider, 'pr');
  return { eb_id: `eb_${Date.now()}`, patient_id: req.patient_id, path: req.pathology, em: req.endometrial_mm };
}

function hysterectomy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.approach, 'ap', ['open','laparoscopic','vaginal','robotic','NA']);
  ensureEnum(req.type, 'ty', ['total','radical','subtotal','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.complication, 'co'); ensureNum(req.hospital_days, 'hd');
  ensureNum(req.pathology_count, 'pc'); ensureEnum(req.disposition, 'di', ['home','extended','NA']);
  ensureStr(req.provider, 'pr');
  return { hy_id: `hy_${Date.now()}`, patient_id: req.patient_id, approach: req.approach, type: req.type };
}

function oophorectomy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['cancer','risk_reduction','cyst','torsion','other','NA']);
  ensureNum(req.ovaries_removed, 'or'); ensureNum(req.tubes_removed, 'tr');
  ensureEnum(req.approach, 'ap', ['laparoscopic','open','vaginal','NA']);
  ensureNum(req.duration_min, 'du'); ensureEnum(req.pathology, 'pa', ['benign','malignant','normal','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.disposition, 'di', ['home','extended','NA']);
  ensureStr(req.provider, 'pr');
  return { oo_id: `oo_${Date.now()}`, patient_id: req.patient_id, ind: req.indication, path: req.pathology };
}

function funcs() { return { cervical_screen, ovarian_screen, endometrial_biopsy, hysterectomy, oophorectomy }; }
module.exports = { funcs, ValidationError };