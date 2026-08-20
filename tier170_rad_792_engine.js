// filepath: tier170_rad_792_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function xray_read(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['chest','abdomen','skull','spine','pelvis','extremity','NA']);
  ensureEnum(req.finding, 'fi', ['normal','pneumonia','effusion','fracture','mass','other','NA']);
  ensureNum(req.impression_confidence, 'ic'); ensureBool(req.followup_recommended, 'fr');
  ensureBool(req.critical_finding, 'cf'); ensureEnum(req.disposition, 'di', ['discharge','follow_up','further_imaging','treatment','NA']);
  ensureStr(req.provider, 'pr');
  return { xr_id: `xr_${Date.now()}`, patient_id: req.patient_id, finding: req.finding, body: req.body_part };
}

function ct_read(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['head','chest','abdomen','pelvis','spine','extremity','NA']);
  ensureBool(req.contrast, 'co'); ensureNum(req.dose_msv, 'ds');
  ensureEnum(req.finding, 'fi', ['normal','stroke','hemorrhage','mass','abscess','fracture','other','NA']);
  ensureBool(req.critical_finding, 'cf'); ensureEnum(req.disposition, 'di', ['discharge','follow_up','treatment','NA']);
  ensureStr(req.provider, 'pr');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, finding: req.finding, dose: req.dose_msv };
}

function mri_read(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['brain','spine','joint','abdomen','pelvis','other','NA']);
  ensureEnum(req.sequence, 'sq', ['T1','T2','FLAIR','DWI','contrast','other','NA']);
  ensureEnum(req.finding, 'fi', ['normal','lesion','edema','mass','stroke','demyelination','other','NA']);
  ensureBool(req.critical_finding, 'cf'); ensureEnum(req.disposition, 'di', ['discharge','follow_up','treatment','NA']);
  ensureStr(req.provider, 'pr');
  return { mr_id: `mr_${Date.now()}`, patient_id: req.patient_id, finding: req.finding, body: req.body_part };
}

function ultrasound_read(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.body_part, 'bp', ['abdomen','pelvis','vascular','echo','FAST','renal','OB','NA']);
  ensureEnum(req.finding, 'fi', ['normal','mass','fluid','stenosis','gallstones','other','NA']);
  ensureNum(req.image_count, 'ic'); ensureBool(req.doppler_used, 'du');
  ensureEnum(req.disposition, 'di', ['discharge','follow_up','treatment','further_imaging','NA']);
  ensureStr(req.provider, 'pr');
  return { us_id: `us_${Date.now()}`, patient_id: req.patient_id, finding: req.finding };
}

function intervention(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['biopsy','drainage','angio','embolization','thrombolysis','other','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.sedation_min, 'sm');
  ensureNum(req.contrast_ml, 'cc'); ensureBool(req.complication, 'co');
  ensureEnum(req.pathology, 'pa', ['benign','malignant','atypical','pending','NA']);
  ensureEnum(req.disposition, 'di', ['discharge','recovery','floor','ICU','NA']);
  ensureStr(req.provider, 'pr');
  return { in_id: `in_${Date.now()}`, patient_id: req.patient_id, type: req.type, path: req.pathology };
}

function funcs() { return { xray_read, ct_read, mri_read, ultrasound_read, intervention }; }
module.exports = { funcs, ValidationError };