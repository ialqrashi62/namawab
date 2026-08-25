// filepath: tier175_ski_818_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function derm_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.body_area, 'ba', ['face','scalp','trunk','arm','leg','hand','foot','multiple','NA']);
  ensureEnum(req.lesion_type, 'lt', ['macule','papule','plaque','nodule','vesicle','pustule','tumor','other','NA']);
  ensureNum(req.count, 'cn'); ensureNum(req.size_mm, 'sz');
  ensureEnum(req.color, 'co', ['normal','hypopigmented','hyperpigmented','erythematous','violaceous','other','NA']);
  ensureEnum(req.distribution, 'di', ['localized','regional','generalized','photodistributed','NA']);
  ensureNum(req.followup_months, 'fu'); ensureBool(req.biopsy_planned, 'bp');
  ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, patient_id: req.patient_id, area: req.body_area, type: req.lesion_type };
}

function skin_biopsy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['shave','punch','excisional','NA']);
  ensureNum(req.size_mm, 'sz'); ensureEnum(req.pathology, 'pa', ['benign','BCC','SCC','melanoma','other','NA']);
  ensureEnum(req.margin_status, 'ms', ['clear','involved','close','NA']);
  ensureNum(req.healing_days, 'hd'); ensureEnum(req.complication, 'co', ['none','infection','bleeding','NA']);
  ensureStr(req.provider, 'pr');
  return { sb_id: `sb_${Date.now()}`, patient_id: req.patient_id, type: req.type, path: req.pathology };
}

function excision(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['simple','wide_local','Mohs','NA']);
  ensureEnum(req.location, 'lo', ['face','trunk','arm','leg','back','other','NA']);
  ensureNum(req.size_mm, 'sz'); ensureEnum(req.closure, 'cl', ['primary','flap','graft','secondary','NA']);
  ensureNum(req.margin_mm, 'mg'); ensureEnum(req.complication, 'co', ['none','infection','dehiscence','bleeding','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ex_id: `ex_${Date.now()}`, patient_id: req.patient_id, type: req.type, sz: req.size_mm };
}

function cryotherapy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.indication, 'in', ['wart','actinic_keratosis','molluscum','other','NA']);
  ensureEnum(req.location, 'lo', ['hand','foot','face','trunk','arm','leg','NA']);
  ensureNum(req.freeze_time_sec, 'ft'); ensureNum(req.lesions_count, 'lc');
  ensureEnum(req.response, 're', ['partial','complete','none','NA']);
  ensureNum(req.blister_score, 'bs'); ensureNum(req.followup_weeks, 'fw');
  ensureStr(req.provider, 'pr');
  return { cr_id: `cr_${Date.now()}`, patient_id: req.patient_id, ind: req.indication, lc: req.lesions_count };
}

function patch_test(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.condition, 'co', ['eczema','contact_dermatitis','urticaria','other','NA']);
  ensureNum(req.allergens_count, 'ac'); ensureNum(req.positive_count, 'pc');
  ensureStr(req.allergens_positive, 'ap'); ensureNum(req.relevance_score, 'rs');
  ensureNum(req.reading_days, 'rd'); ensureBool(req.late_read, 'lr');
  ensureStr(req.provider, 'pr');
  return { pt_id: `pt_${Date.now()}`, patient_id: req.patient_id, pc: req.positive_count, ap: req.allergens_positive };
}

function funcs() { return { derm_eval, skin_biopsy, excision, cryotherapy, patch_test }; }
module.exports = { funcs, ValidationError };