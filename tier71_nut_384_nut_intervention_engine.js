// filepath: tier71_nut_384_nut_intervention_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nutrition_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.session_type, 'st', ['individual','group','family','couples','telehealth','phone','video','in_person','class','workshop']);
  ensureStr(req.topics_covered, 'tc');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.patient_engagement, 'pe', ['high','moderate','low','minimal','disengaged','excellent','good','active','passive','dropped','other']);
  ensureBool(req.understanding_verified, 'uv');
  ensureStr(req.goal_setting, 'gs');
  ensureNum(req.follow_up_due, 'fud');
  ensureStr(req.rd_name, 'rd');
  ensureBool(req.documentation_complete, 'dc');
  return { session: req.session_type };
}
function medical_nutrition_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dx, 'dx');
  ensureNum(req.kcal_target, 'kt');
  ensureNum(req.protein_target_g, 'ptg');
  ensureNum(req.carb_target_g, 'ctg');
  ensureNum(req.fat_target_g, 'ftg');
  ensureStr(req.meal_plan, 'mp');
  ensureStr(req.monitoring, 'mon');
  ensureStr(req.rd_name, 'rd');
  ensureNum(req.reassessment, 'ra');
  return { dx: req.dx };
}
function supplement_recommendation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.supplement_type, 'st', ['oral_nutrition_supplement','protein_powder','vitamins_minerals','fluid_thickener','calorie_module','modular_protein','fish_oil','probiotic','fiber','other']);
  ensureStr(req.product_name, 'pn');
  ensureNum(req.dose_ml, 'dm');
  ensureEnum(req.frequency, 'freq', ['daily','twice_daily','three_times_daily','four_times_daily','as_needed','with_meals','between_meals','before_bed','before_workout','after_workout','other']);
  ensureNum(req.duration_days, 'dd');
  ensureStr(req.indication, 'ind');
  ensureStr(req.monitoring_parameters, 'mp');
  ensureStr(req.rd_name, 'rd');
  return { supplement: req.product_name };
}
function enteral_feeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.feeding_type, 'ft', ['nasoenteric','naso_gastric','gastrostomy','jejunostomy','peg','pej','gastrostomy_jejunal','g_j','gastrojejunal','ng_tube','nd_tube','other']);
  ensureStr(req.formula, 'form');
  ensureNum(req.rate_ml_hr, 'rmh');
  ensureNum(req.total_volume_ml, 'tvm');
  ensureBool(req.residual_check_q4h, 'rcq');
  ensureNum(req.residual_threshold_ml, 'rtm');
  ensureNum(req.flushes_ml, 'fm');
  ensureEnum(req.flush_frequency, 'ff', ['q4h','q6h','q8h','q12h','continuous','before_feeds','after_feeds','per_shift','prn','other']);
  ensureBool(req.tube_placement_verified, 'tpv');
  return { formula: req.formula };
}
function parenteral_nutrition(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.pn_type, 'pt', ['tpn_central','tpn_peripheral','ppn','central_line','peripheral_line','tri_lumen','picc','other']);
  ensureNum(req.volume_ml, 'vol');
  ensureNum(req.amino_acids_pct, 'aap');
  ensureNum(req.dextrose_pct, 'dp');
  ensureNum(req.lipid_pct, 'lp');
  ensureStr(req.additives, 'add');
  ensureNum(req.caloric_target_kcal, 'ctk');
  ensureBool(req.catheter_care_performed, 'ccp');
  ensureStr(req.rd_name, 'rd');
  ensureNum(req.lab_due, 'ld');
  return { type: req.pn_type };
}

function funcs() { return { nutrition_counseling, medical_nutrition_therapy, supplement_recommendation, enteral_feeding, parenteral_nutrition }; }
module.exports = { funcs, ValidationError };