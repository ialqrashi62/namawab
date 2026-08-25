// filepath: tier173_mus_808_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function fracture_assess(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.bone, 'bo', ['tibia','femur','humerus','radius','ulna','pelvis','spine','other','NA']);
  ensureEnum(req.type, 'ty', ['spiral','oblique','transverse','comminuted','greenstick','NA']);
  ensureEnum(req.ao_class, 'ao', ['A1','A2','A3','B1','B2','B3','C1','C2','C3','NA']);
  ensureNum(req.displacement_pct, 'dp'); ensureBool(req.neurovascular, 'nv');
  ensureEnum(req.mechanism, 'me', ['MVC','fall','sport','violence','other','NA']);
  ensureEnum(req.plan, 'pl', ['cast','ORIF','IM_nail','external_fix','brace','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { fa_id: `fa_${Date.now()}`, patient_id: req.patient_id, bone: req.bone, plan: req.plan };
}

function cast_management(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.location, 'lo', ['forearm','humerus','tibia','femur','other','NA']);
  ensureEnum(req.material, 'mt', ['plaster','fiberglass','synthetic','NA']);
  ensureNum(req.weeks_in_place, 'wp'); ensureEnum(req.skin_status, 'ss', ['intact','red','breakdown','rash','NA']);
  ensureBool(req.pressure_sores, 'ps'); ensureBool(req.edema, 'ed');
  ensureBool(req.neurovascular_ok, 'nv'); ensureEnum(req.plan, 'pl', ['continue','remove','replace','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { cm_id: `cm_${Date.now()}`, patient_id: req.patient_id, loc: req.location, plan: req.plan };
}

function amputation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.level, 'lv', ['BKA','AKA','AE','BE','transhumeral','transradial','NA']);
  ensureEnum(req.indication, 'in', ['trauma','PAD','diabetes','tumor','infection','other','NA']);
  ensureEnum(req.laterality, 'lt', ['left','right','NA']);
  ensureNum(req.healing_days, 'hd'); ensureBool(req.prosthetic_ready, 'pr');
  ensureNum(req.rehab_weeks, 'rw'); ensureEnum(req.disposition, 'di', ['home','rehab','LTC','NA']);
  ensureStr(req.provider, 'pr');
  return { am_id: `am_${Date.now()}`, patient_id: req.patient_id, lv: req.level, disp: req.disposition };
}

function external_fixation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.location, 'lo', ['tibia','femur','pelvis','forearm','other','NA']);
  ensureNum(req.pin_count, 'pc'); ensureNum(req.weeks_in_place, 'wp');
  ensureBool(req.infection, 'in'); ensureNum(req.healing_score, 'hs');
  ensureEnum(req.plan, 'pl', ['continue','remove','adjust','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ef_id: `ef_${Date.now()}`, patient_id: req.patient_id, pin: req.pin_count, plan: req.plan };
}

function bone_biopsy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.location, 'lo', ['femur','tibia','pelvis','spine','humerus','other','NA']);
  ensureEnum(req.approach, 'ap', ['core','incisional','needle','NA']);
  ensureNum(req.size_mm, 'sz'); ensureEnum(req.pathology, 'pa', ['benign','malignant','infectious','normal','NA']);
  ensureBool(req.sufficient, 'su'); ensureEnum(req.complication, 'co', ['none','fracture','bleeding','infection','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { bb_id: `bb_${Date.now()}`, patient_id: req.patient_id, path: req.pathology, sz: req.size_mm };
}

function car_accident(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.side, 'si', ['left','right','bilateral','NA']);
  ensureEnum(req.injury_type, 'it', ['fracture','dislocation','soft_tissue','head','multiple','NA']);
  ensureEnum(req.ao_class, 'ao', ['A','B','C','NA']);
  ensureEnum(req.fixation, 'fi', ['ORIF','cast','brace','none','NA']);
  ensureNum(req.followup_months, 'fu'); ensureEnum(req.disposition, 'di', ['continue','monitor','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { ca_id: `ca_${Date.now()}`, patient_id: req.patient_id, it: req.injury_type, fi: req.fixation };
}

function funcs() { return { fracture_assess, cast_management, amputation, external_fixation, bone_biopsy, car_accident }; }
module.exports = { funcs, ValidationError };