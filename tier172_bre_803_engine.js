// filepath: tier172_bre_803_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function breast_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.impression, 'im', ['BI-RADS_1','BI-RADS_2','BI-RADS_3','BI-RADS_4','BI-RADS_5','BI-RADS_6','NA']);
  ensureNum(req.mass_mm, 'mm'); ensureBool(req.calcification, 'ca');
  ensureBool(req.family_history, 'fh'); ensureEnum(req.density, 'de', ['almost_fat','scattered','heterogeneous','dense','NA']);
  ensureEnum(req.recommendation, 're', ['continue','short_fu','biopsy','MRI','refer','NA']);
  ensureNum(req.next_screening_months, 'ns'); ensureStr(req.provider, 'pr');
  return { bs_id: `bs_${Date.now()}`, patient_id: req.patient_id, imp: req.impression, rec: req.recommendation };
}

function breast_dx(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.biopsy_type, 'bt', ['FNA','core','excisional','NA']);
  ensureEnum(req.pathology, 'pa', ['benign','atypical','DCIS','IDC','ILC','mixed','NA']);
  ensureNum(req.tumor_size_mm, 'ts'); ensureNum(req.nodes_positive, 'np');
  ensureNum(req.nodes_examined, 'ne'); ensureEnum(req.receptors, 're', ['ER_pos','ER_neg','PR_pos','PR_neg','HER2_pos','HER2_neg','NA']);
  ensureNum(req.ki67_pct, 'k6'); ensureEnum(req.grade, 'gr', ['I','II','III','NA']);
  ensureStr(req.provider, 'pr');
  return { bd_id: `bd_${Date.now()}`, patient_id: req.patient_id, path: req.pathology, grade: req.grade };
}

function breast_surgery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['lumpectomy','mastectomy','SLNB','ALND','reconstruction','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.nodes_removed, 'nr'); ensureNum(req.margins_mm, 'mg');
  ensureBool(req.skin_sparing, 'ss'); ensureEnum(req.reconstruction, 'rc', ['none','implant','flap','autologous','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.complication, 'co', ['none','bleeding','infection','seroma','other','NA']);
  ensureStr(req.provider, 'pr');
  return { bs_id: `bs_${Date.now()}`, patient_id: req.patient_id, type: req.type, margin: req.margins_mm };
}

function breast_recon(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.method, 'mt', ['implant','DIEP','TRAM','latissimus','other','NA']);
  ensureNum(req.stages, 'st'); ensureNum(req.duration_total_hr, 'dt');
  ensureBool(req.complication, 'co'); ensureNum(req.implant_size, 'is');
  ensureNum(req.satisfaction_score, 'ss'); ensureNum(req.recovery_months, 'rm');
  ensureStr(req.provider, 'pr');
  return { br_id: `br_${Date.now()}`, patient_id: req.patient_id, method: req.method, sat: req.satisfaction_score };
}

function breast_survivorship(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_since_dx, 'ms'); ensureNum(req.lifestyle_score, 'ls');
  ensureBool(req.exercise, 'ex'); ensureNum(req.bmi, 'bm');
  ensureEnum(req.endocrine_therapy, 'et', ['none','tamoxifen','AI','other','NA']);
  ensureNum(req.adherence_pct, 'ad'); ensureNum(req.recurrence_risk_pct, 'rr');
  ensureEnum(req.disposition, 'di', ['continue','monitor','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { bs_id: `bs_${Date.now()}`, patient_id: req.patient_id, months: req.months_since_dx, disp: req.disposition };
}

function funcs() { return { breast_screen, breast_dx, breast_surgery, breast_recon, breast_survivorship }; }
module.exports = { funcs, ValidationError };