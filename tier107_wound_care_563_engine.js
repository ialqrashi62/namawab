// filepath: tier107_wound_care_563_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function wound_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.wound_type, 'wt', ['surgical','traumatic','pressure','venous','arterial','diabetic','other','unknown']);
  ensureNum(req.length_cm, 'lc');
  ensureNum(req.width_cm, 'wc');
  ensureNum(req.depth_cm, 'dc');
  ensureEnum(req.stage, 'st', ['I','II','III','IV','unstageable','deep_tissue','closed','other','unknown','none']);
  ensureEnum(req.exudate, 'ex', ['none','serous','sanguineous','serosanguineous','purulent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function dressing_change(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.change_id, 'cid');
  ensureStr(req.wound_id, 'wid');
  ensureEnum(req.dressing_type, 'dt', ['gauze','hydrocolloid','foam','film','alginate','transparent','other','unknown']);
  ensureEnum(req.change_frequency, 'cf', ['daily','every_2_days','every_3_days','weekly','as_needed','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { cid: req.change_id };
}
function pressure_injury(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.injury_id, 'iid');
  ensureStr(req.location, 'loc');
  ensureEnum(req.stage, 'st', ['I','II','III','IV','unstageable','deep_tissue','other','unknown']);
  ensureNum(req.length_cm, 'lc');
  ensureNum(req.width_cm, 'wc');
  ensureEnum(req.treatment, 'tx', ['debridement','dressing','offloading','surgery','antibiotics','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { iid: req.injury_id };
}
function ostomy_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.care_id, 'cid');
  ensureEnum(req.ostomy_type, 'ot', ['colostomy','ileostomy','urostomy','jejunostomy','other','unknown']);
  ensureNum(req.output_volume_ml, 'ovm');
  ensureEnum(req.skin_condition, 'skc', ['intact','denuded','rash','ulcerated','other','unknown']);
  ensureBool(req.appliance_change, 'ac');
  ensureBool(req.education_provided, 'ep');
  ensureStr(req.provider, 'pr');
  return { cid: req.care_id };
}
function wound_healing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.granulation_pct, 'gp');
  ensureNum(req.epithelialization_pct, 'ep');
  ensureNum(req.infection_signs, 'is');
  ensureEnum(req.healing_rate, 'hr', ['excellent','adequate','slow','stalled','deteriorating','other','unknown']);
  ensureNum(req.weeks_to_heal, 'wth');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { wound_assessment, dressing_change, pressure_injury, ostomy_care, wound_healing }; }
module.exports = { funcs, ValidationError };