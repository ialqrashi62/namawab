// filepath: tier167_onc_782_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function staging_solid(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.tumor_type, 'tt', ['breast','lung','colon','prostate','melanoma','other','NA']);
  ensureNum(req.tumor_size_mm, 'ts'); ensureNum(req.nodes_positive, 'np');
  ensureNum(req.nodes_examined, 'ne'); ensureBool(req.metastasis, 'mt');
  ensureEnum(req.metastasis_site, 'ms', ['none','bone','lung','liver','brain','multiple','NA']);
  ensureEnum(req.tnm_stage, 'tn', ['0','I','II','III','IV','NA']);
  ensureNum(req.karnofsky_score, 'ks'); ensureStr(req.provider, 'pr');
  return { st_id: `st_${Date.now()}`, patient_id: req.patient_id, type: req.tumor_type, stage: req.tnm_stage };
}

function chemotherapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.height_cm, 'hc');
  ensureNum(req.weight_kg, 'wk'); ensureNum(req.bsa, 'bs');
  ensureStr(req.regimen, 'rg'); ensureNum(req.cycle_number, 'cn');
  ensureNum(req.dose_mg, 'ds'); ensureNum(req.cycles_planned, 'cp');
  ensureEnum(req.toxicity_grade, 'tg', ['0','1','2','3','4','NA']);
  ensureStr(req.provider, 'pr');
  return { ch_id: `ch_${Date.now()}`, patient_id: req.patient_id, regimen: req.regimen, cycle: req.cycle_number };
}

function radiation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['EBRT','brachytherapy','SRS','SBRT','IMRT','proton','NA']);
  ensureNum(req.dose_gy, 'dg'); ensureNum(req.fractions, 'fr');
  ensureNum(req.dose_per_fraction, 'df'); ensureEnum(req.target, 'tg', ['definitive','adjuvant','palliative','NA']);
  ensureNum(req.days_treated, 'dt'); ensureNum(req.toxicity_score, 'ts');
  ensureStr(req.provider, 'pr');
  return { rd_id: `rd_${Date.now()}`, patient_id: req.patient_id, type: req.type, dose: req.dose_gy };
}

function tumor_markers(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.marker, 'mk', ['CEA','CA19-9','CA125','AFP','PSA','HCG','LDH','other','NA']);
  ensureNum(req.value, 'vl'); ensureNum(req.baseline, 'bl');
  ensureNum(req.change_pct, 'cp'); ensureEnum(req.trend, 'tr', ['rising','falling','stable','NA']);
  ensureEnum(req.clinical_significance, 'cs', ['low','moderate','high','NA']);
  ensureStr(req.provider, 'pr');
  return { tm_id: `tm_${Date.now()}`, patient_id: req.patient_id, marker: req.marker, change: req.change_pct };
}

function survivorship(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.months_since_dx, 'ms');
  ensureNum(req.comorbidities, 'co'); ensureEnum(req.late_effects, 'le', ['none','cardiac','neuro','secondary_malignancy','fatigue','multiple','NA']);
  ensureNum(req.qol_score, 'qs'); ensureBool(req.surveillance_imaging, 'si');
  ensureNum(req.followup_days, 'fd'); ensureEnum(req.disposition, 'di', ['continue','escalate','palliative','survivor','NA']);
  ensureStr(req.provider, 'pr');
  return { sv_id: `sv_${Date.now()}`, patient_id: req.patient_id, qol: req.qol_score, disp: req.disposition };
}

function funcs() { return { staging_solid, chemotherapy, radiation, tumor_markers, survivorship }; }
module.exports = { funcs, ValidationError };