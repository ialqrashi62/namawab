// filepath: tier62_spec_care_ext_347_sp_mat_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function maternity_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gravida, 'grav');
  ensureNum(req.para, 'par');
  ensureNum(req.ga_weeks, 'gaw');
  ensureStr(req.edd_calc, 'edd');
  ensureStr(req.blood_type, 'bt');
  ensureStr(req.antibody_screen, 'screen');
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.plan, 'plan');
  return { ga: req.ga_weeks };
}
function prenatal_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ga_weeks, 'gaw');
  ensureStr(req.bp, 'bp');
  ensureNum(req.weight_kg, 'wt');
  ensureNum(req.fhr, 'fhr');
  ensureNum(req.fundal_height, 'fh');
  ensureStr(req.edema, 'ed');
  ensureStr(req.urine_protein, 'up');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.next_visit, 'nv');
  return { ga: req.ga_weeks };
}
function postnatal_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.days_postpartum, 'dpp');
  ensureEnum(req.delivery_method, 'dm', ['vaginal','vacuum_assisted','forceps','c_section','vbac','water_birth']);
  ensureEnum(req.perineum_healing, 'ph', ['normal','delayed','infected','laceration_repair_holding','painful','tear']);
  ensureStr(req.lochia, 'loch');
  ensureEnum(req.breastfeeding, 'bf', ['successful','in_progress','formula_supplemented','formula_only','declined','weaning']);
  ensureNum(req.mood_screen, 'ms');
  ensureStr(req.plan, 'plan');
  return { pp: req.days_postpartum };
}
function lactation_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.feeding_method, 'fmet', ['breast','breast_plus_formula','formula','expressed_milk','donor_milk','mixed']);
  ensureEnum(req.latch_quality, 'lq', ['poor','fair','good','excellent','unable_to_assess']);
  ensureEnum(req.milk_supply, 'ms', ['oversupply','adequate','low','insufficient','relactation','discontinued']);
  ensureEnum(req.nipple_pain, 'np', ['none','mild','moderate','severe','bleeding','infection']);
  ensureEnum(req.baby_weight_gain, 'bwg', ['appropriate','adequate','inadequate','excessive','not_assessed']);
  ensureStr(req.plan, 'plan');
  ensureBool(req['follow_up_2w'], 'fu2');
  return { feed: req.feeding_method };
}
function high_risk_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.condition, 'cond');
  ensureNum(req.ga_dx_weeks, 'gadx');
  ensureStr(req.glucose_target, 'gt');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.fetal_growth, 'fg');
  ensureStr(req.monitoring_plan, 'mp');
  ensureStr(req.delivery_planning, 'dp');
  return { condition: req.condition };
}

function funcs() { return { maternity_intake, prenatal_visit, postnatal_visit, lactation_consult, high_risk_pregnancy }; }
module.exports = { funcs, ValidationError };