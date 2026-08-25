// filepath: tier152_pgu_719_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function well_visit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.height_cm, 'hc');
  ensureNum(req.head_circumference_cm, 'hcc');
  ensureNum(req.bmi, 'bm');
  ensureEnum(req.feeding, 'fe', ['breast','formula','mixed','solid','cow_milk','other','NA']);
  ensureNum(req.meals_per_day, 'md');
  ensureNum(req.sleep_hours, 'sl');
  ensureEnum(req.development, 'dv', ['normal','regression','delayed_motor','delayed_language','delayed_cognitive','autism_suspected','other','NA','unknown']);
  ensureBool(req.vaccines_updated, 'vu');
  ensureStr(req.provider, 'pr');
  return { wv_id: `wvt_${Date.now()}`, patient_id: req.patient_id, age: req.age_months };
}
function developmental(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.gross_motor_age_eq, 'gm');
  ensureNum(req.fine_motor_age_eq, 'fm');
  ensureNum(req.language_age_eq, 'ln');
  ensureNum(req.social_age_eq, 'sc');
  ensureEnum(req.screening, 'sc2', ['normal','MCHAT_concern','ASQ_concern','ref_for_eval','reassured','NA','unknown']);
  ensureBool(req.referred_EI, 'ei');
  ensureBool(req.referred_specialist, 'rs');
  ensureEnum(req.diagnosis, 'dx', ['normal','CP','ASD','developmental_delay','global_delay','motor_delay','language_delay','learning_disability','intellectual_disability','other','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { dv_id: `dvp_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function immunizations(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.vaccine, 'va', ['HepB','Rotavirus','DTaP','Hib','PCV13','IPV','MMR','Varicella','HepA','MenACWY','MenB','HPV','influenza','Tdap','HPV9','COVID','RSV','BCG','OPV','JE','yellow_fever','typhoid','rabies','cholera','plague','tick_borne','other']);
  ensureNum(req.dose_number, 'dn');
  ensureNum(req.dose_date_age, 'da');
  ensureEnum(req.site, 'si', ['IM_left_thigh','IM_right_thiah','IM_left_arm','IM_right_arm','SC_left_arm','SC_right_arm','SC_left_thigh','SC_right_thigh','PO','ID','IN','other','NA']);
  ensureBool(req.reaction, 'rx');
  ensureEnum(req.reaction_type, 'rt', ['none','local','fever','rash','anaphylaxis','other']);
  ensureBool(req.contraindication, 'ci');
  ensureStr(req.provider, 'pr');
  return { im_id: `imz_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine, dose: req.dose_number };
}
function new_born(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_hours, 'ah');
  ensureNum(req.birth_weight_grams, 'bw');
  ensureNum(req.gestational_age_weeks, 'gw');
  ensureEnum(req.apgar_1, 'a1', ['0','1','2','3','4','5','6','7','8','9','10']);
  ensureEnum(req.apgar_5, 'a5', ['0','1','2','3','4','5','6','7','8','9','10']);
  ensureEnum(req.cord_ph, 'cp', ['<7.0','7.0-7.1','7.15-7.25','>7.25','unknown']);
  ensureNum(req.first_temp_c, 'ft');
  ensureBool(req.breastfeeding_init, 'bf');
  ensureNum(req.meconium_passed_hr, 'mp');
  ensureBool(req.urine_passed_24h, 'ur');
  ensureStr(req.provider, 'pr');
  return { nb_id: `nbo_${Date.now()}`, patient_id: req.patient_id };
}
function adolescent(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.tanner_stage, 'ts', ['I','II','III','IV','V','NA','unknown']);
  ensureBool(req.substance_use_screen, 'su');
  ensureBool(req.depression_screen, 'ds');
  ensureEnum(req.phq9_score, 'ph', ['none_0_4','mild_5_9','moderate_10_14','mod_severe_15_19','severe_20_27','NA','unknown']);
  ensureBool(req.contraception_discussed, 'cd');
  ensureBool(req.sexual_activity_screen, 'sa');
  ensureNum(req.bmi, 'bm');
  ensureEnum(req.risk_assessment, 'ra', ['low','moderate','high','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { ad_id: `ads_${Date.now()}`, patient_id: req.patient_id, age: req.age_years };
}

function funcs() { return { well_visit, developmental, immunizations, new_born, adolescent }; }
module.exports = { funcs, ValidationError };