// filepath: tier174_hem_811_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function anemia_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.hgb, 'hg'); ensureNum(req.mcv, 'mc'); ensureNum(req.ferritin, 'fr');
  ensureBool(req.iron_replacement, 'ir'); ensureEnum(req.cause, 'cs', ['iron_deficiency','B12','folate','hemolytic','chronic','other','NA']);
  ensureEnum(req.disposition, 'di', ['continue','adjust','workup','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { af_id: `af_${Date.now()}`, patient_id: req.patient_id, hgb: req.hgb, cause: req.cause };
}

function coag_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.inr, 'in'); ensureNum(req.pt, 'pt'); ensureNum(req.ptt, 'pt2');
  ensureNum(req.warfarin_dose_mg, 'wd'); ensureBool(req.bleeding, 'bl');
  ensureBool(req.thrombosis, 'th'); ensureNum(req.days_on_warfarin, 'dw');
  ensureBool(req.diet_stable, 'ds'); ensureStr(req.provider, 'pr');
  return { cf_id: `cf_${Date.now()}`, patient_id: req.patient_id, inr: req.inr, dose: req.warfarin_dose_mg };
}

function bmt_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_post, 'dp'); ensureBool(req.engraftment, 'en');
  ensureEnum(req.gvhd_grade, 'gv', ['0','1','2','3','4','NA']);
  ensureEnum(req.immunosuppression, 'is', ['full','taper','stop','increase','NA']);
  ensureNum(req.chimerism_pct, 'ch'); ensureEnum(req.relapse_risk, 'rr', ['low','moderate','high','NA']);
  ensureNum(req.next_visit_days, 'nv'); ensureStr(req.provider, 'pr');
  return { bf_id: `bf_${Date.now()}`, patient_id: req.patient_id, days: req.days_post, gv: req.gvhd_grade };
}

function leukemia_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['AML','ALL','CML','CLL','other','NA']);
  ensureNum(req.months_since, 'ms'); ensureEnum(req.cytogenetics, 'cy', ['favorable','intermediate','adverse','NA']);
  ensureNum(req.mrd_pct, 'mr'); ensureEnum(req.treatment_line, 'tl', ['maintenance','consolidation','salvage','NA']);
  ensureEnum(req.response, 're', ['mrd_negative','mrd_positive','relapse','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { lf_id: `lf_${Date.now()}`, patient_id: req.patient_id, type: req.type, mrd: req.mrd_pct };
}

function lymphoma_fup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['HL','NHL','CLL','SLL','other','NA']);
  ensureNum(req.months_since, 'ms'); ensureEnum(req.pet_result, 'pe', ['negative','positive','equivocal','NA']);
  ensureEnum(req.stage, 'st', ['I','II','III','IV','NA']);
  ensureBool(req.surveillance_imaging, 'si'); ensureEnum(req.recurrence_score, 'rs', ['low','moderate','high','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { lyf_id: `lyf_${Date.now()}`, patient_id: req.patient_id, type: req.type, pet: req.pet_result };
}

function funcs() { return { anemia_fup, coag_fup, bmt_fup, leukemia_fup, lymphoma_fup }; }
module.exports = { funcs, ValidationError };