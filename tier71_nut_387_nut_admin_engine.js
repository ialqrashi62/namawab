// filepath: tier71_nut_387_nut_admin_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tpn_compounding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.compounding_id, 'cid');
  ensureNum(req.patient_weight_kg, 'pwk');
  ensureNum(req.volume_ml, 'vol');
  ensureEnum(req.base_solution, 'bs', ['standard_aa_g','standard_adult','standard_pediatric','standard_chw','standard_geriatric','standard_neonate','custom_aa_g','custom_chw','custom_adult','other']);
  ensureNum(req.amino_acids_g, 'aag');
  ensureNum(req.dextrose_g, 'dg');
  ensureNum(req.lipid_ml, 'lm');
  ensureStr(req.additives, 'add');
  ensureStr(req.compounder, 'comp');
  ensureEnum(req.sterility_check, 'sc', ['pass','fail','pending','in_progress','not_required','other']);
  ensureNum(req.ph_check, 'phc');
  return { cid: req.compounding_id };
}
function formula_room(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.formula_id, 'fid');
  ensureEnum(req.formula_type, 'ft', ['pediatric','neonatal','standard_term','specialty','calorie_module','fortified_human_milk','pre_term','tpn','other']);
  ensureNum(req.volume_ml, 'vol');
  ensureNum(req.concentration_kcal_oz, 'cko');
  ensureStr(req.preparation_date, 'pd');
  ensureStr(req.expiration_date, 'ed');
  ensureStr(req.prepared_by, 'pb');
  ensureBool(req.qc_doc_complete, 'qdc');
  ensureStr(req.dispensing_unit, 'du');
  return { fid: req.formula_id };
}
function diet_office_orders(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureEnum(req.diet_type, 'dt', ['regular','cardiac','diabetic','renal','low_residue','low_fat','low_sodium','pureed','liquid','soft','bland','low_fiber','high_fiber','high_protein','ketogenic','peg','soft_mechanical','pureed_moist','vegetarian','vegan','kosher','halal','other']);
  ensureEnum(req.texture, 'texture', ['regular','soft','mechanical_soft','pureed','liquid','blenderized','thin','nectar','honey','pudding','spoon_thick','fork_mashable','other']);
  ensureEnum(req.fluid_consistency, 'fc', ['thin','nectar_thick','honey_thick','pudding_thick','spoon_thick','regular','thickened','other']);
  ensureStr(req.special_instructions, 'si');
  ensureStr(req.notes, 'notes');
  ensureStr(req.entered_by, 'eb');
  ensureStr(req.effective_date, 'ed');
  ensureNum(req.review_due, 'rd');
  return { oid: req.order_id };
}
function food_service_isolation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.isolation_type, 'it', ['neutropenic','cdiff','contact','enteric','droplet','airborne','strict','mrsa','mdro','covid','reverse','protective','other']);
  ensureEnum(req.food_safety_check, 'fsc', ['passed','failed','pending','in_progress','certified','other']);
  ensureBool(req.no_raw_fruits, 'nrf');
  ensureBool(req.well_cooked_meats, 'wcm');
  ensureBool(req.pasteurized_juice, 'pj');
  ensureStr(req.restricted_foods, 'rf');
  ensureBool(req.staff_educated, 'se');
  ensureBool(req.monitoring_log_clean, 'mlc');
  ensureStr(req.rd_name, 'rd');
  return { iso: req.isolation_type };
}
function catering_therapeutic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.meal_id, 'mid');
  ensureEnum(req.diet, 'diet', ['regular','cardiac','diabetic','renal','low_residue','low_fat','low_sodium','pureed','liquid','soft','bland','low_fiber','high_fiber','high_protein','ketogenic','peg','vegetarian','vegan','kosher','halal','other']);
  ensureNum(req.calories, 'cal');
  ensureNum(req.carbohydrate_g, 'cg');
  ensureNum(req.protein_g, 'pg');
  ensureNum(req.fat_g, 'fg');
  ensureNum(req.sodium_mg, 'sm');
  ensureStr(req.served_at, 'sa');
  ensureBool(req.patient_acceptable, 'pa');
  ensureEnum(req.kitchen_safety_check, 'ksc', ['pass','fail','pending','in_progress','n_a','other']);
  ensureStr(req.recommendation, 'rec');
  return { meal: req.meal_id };
}

function funcs() { return { tpn_compounding, formula_room, diet_office_orders, food_service_isolation, catering_therapeutic }; }
module.exports = { funcs, ValidationError };