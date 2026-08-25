// filepath: tier167_drm_781_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function derm_exam(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.body_area, 'ba', ['face','scalp','trunk','arm','leg','hand','foot','multiple','NA']);
  ensureEnum(req.lesion_type, 'lt', ['macule','papule','plaque','nodule','vesicle','pustule','tumor','other','NA']);
  ensureNum(req.count, 'cn'); ensureNum(req.size_mm, 'sz');
  ensureEnum(req.color, 'co', ['normal','hypopigmented','hyperpigmented','erythematous','violaceous','other','NA']);
  ensureEnum(req.distribution, 'di', ['localized','regional','generalized','photodistributed','NA']);
  ensureEnum(req.disposition, 'di2', ['benign','follow_up','biopsy','treatment','NA']);
  ensureStr(req.provider, 'pr');
  return { dx_id: `dx_${Date.now()}`, patient_id: req.patient_id, type: req.lesion_type, size: req.size_mm };
}

function biopsy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['shave','punch','excisional','incisional','NA']);
  ensureNum(req.site, 'si'); ensureNum(req.size_mm, 'sz');
  ensureEnum(req.indication, 'in', ['suspicious','cosmetic','diagnostic','therapeutic','NA']);
  ensureNum(req.suture_count, 'sc'); ensureBool(req.complication, 'co');
  ensureEnum(req.pathology, 'pa', ['benign','malignant','atypical','pending','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { bp_id: `bp_${Date.now()}`, patient_id: req.patient_id, type: req.type, path: req.pathology };
}

function mohs(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.tumor_type, 'tt', ['BCC','SCC','melanoma','other','NA']);
  ensureNum(req.size_mm, 'sz'); ensureEnum(req.location, 'lo', ['face','ear','nose','lip','other','NA']);
  ensureNum(req.stages, 'st'); ensureBool(req.clear_margins, 'cm');
  ensureEnum(req.reconstruction, 'rc', ['primary','flap','graft','secondary','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { mo_id: `mo_${Date.now()}`, patient_id: req.patient_id, type: req.tumor_type, stages: req.stages };
}

function skin_cancer_screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.fitzpatrick, 'fp', ['I','II','III','IV','V','VI','NA']);
  ensureNum(req.mole_count, 'mc'); ensureEnum(req.suspicious_count, 'sc', ['none','1','2','3','4+','NA']);
  ensureEnum(req.family_history, 'fh', ['none','one','multiple','NA']);
  ensureBool(req.dermoscopy_used, 'du'); ensureNum(req.images_taken, 'it');
  ensureEnum(req.disposition, 'di', ['normal','follow_up','biopsy','urgent_refer','NA']);
  ensureStr(req.provider, 'pr');
  return { sc_id: `sc_${Date.now()}`, patient_id: req.patient_id, fitz: req.fitzpatrick, susp: req.suspicious_count };
}

function dermatitis_mgmt(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['atopic','contact','seborrheic','dyshidrotic','nummular','stasis','NA']);
  ensureNum(req.scorad_baseline, 'sb'); ensureNum(req.scorad_current, 'sc');
  ensureBool(req.patch_test_done, 'pt'); ensureBool(req.topical_treatment, 'tt');
  ensureEnum(req.systemic_tx, 'st', ['none','steroid','biologic','JAK','combination','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { dm_id: `dm_${Date.now()}`, patient_id: req.patient_id, type: req.type, imp: req.improvement_pct };
}

function funcs() { return { derm_exam, biopsy, mohs, skin_cancer_screening, dermatitis_mgmt }; }
module.exports = { funcs, ValidationError };