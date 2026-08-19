// filepath: tier92_immunotherapy_486_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function allergen_immunotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureStr(req.allergen, 'al');
  ensureEnum(req.type, 'tp', ['scit','slit','oral','sublingual','other','unknown']);
  ensureNum(req.vial_concentration, 'vc');
  ensureNum(req.dose_ml, 'dm');
  ensureNum(req.weeks_to_maintenance, 'wtm');
  ensureNum(req.total_doses_administered, 'tda');
  ensureBool(req.local_reactions, 'lr');
  ensureBool(req.systemic_reactions, 'sr');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function biologic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.medication, 'med', ['dupilumab','omalizumab','mepolizumab','benralizumab','reslizumab','tepezza','rituximab','tocilizumab','secukinumab','ixekizumab','other','unknown','none']);
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.frequency_weeks, 'fw');
  ensureBool(req.induction_phase, 'ip');
  ensureNum(req.clinical_response, 'cr');
  ensureBool(req.adverse_events, 'ae');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function oral_immunotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureStr(req.food_allergen, 'fa');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.doses_administered, 'da');
  ensureBool(req.updosing_phase, 'up');
  ensureBool(req.maintenance_phase, 'mp');
  ensureNum(req.home_doses, 'hd');
  ensureNum(req.reactions_observed, 'ro');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function desensitization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.protocol_id, 'pri');
  ensureStr(req.drug, 'drug');
  ensureNum(req.steps_completed, 'sc');
  ensureNum(req.total_steps, 'ts');
  ensureBool(req.successful, 'suc');
  ensureBool(req.reaction_during, 'rd');
  ensureNum(req.final_dose_mg, 'fdm');
  ensureStr(req.provider, 'pr');
  return { pri: req.protocol_id };
}
function immunosuppression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.level_ng_ml, 'lvl');
  ensureNum(req.wbc_count, 'wbc');
  ensureNum(req.lymphocyte_count, 'lc');
  ensureNum(req.infections_per_year, 'ipy');
  ensureBool(req.prophylaxis, 'prx');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { allergen_immunotherapy, biologic_therapy, oral_immunotherapy, desensitization, immunosuppression }; }
module.exports = { funcs, ValidationError };

