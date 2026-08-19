// filepath: tier83_derm_ext_441_derm_cosmetic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function botox(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['cosmetic_glabella','cosmetic_crows','cosmetic_forehead','cosmetic_other','hyperhidrosis','migraine','tmd','strabismus','spasticity','other']);
  ensureNum(req.units, 'units');
  ensureNum(req.sites_count, 'sc');
  ensureBool(req.pre_treatment_photo, 'ptp');
  ensureStr(req.treatment_zone, 'tz');
  ensureEnum(req.complications, 'comp', ['none','bruising','ptosis','asymmetry','headache','dry_eye','dysphagia','other','unknown']);
  ensureNum(req.treatment_time_min, 'ttm');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureBool(req.insurance_covered, 'ic');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function chemical_peel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.peel_type, 'pt', ['glycolic','salicylic','lactic','tca_light','tca_medium','tca_deep','phenol','mandelic','combination','other']);
  ensureEnum(req.depth, 'depth', ['very_light','light','medium','deep','unknown']);
  ensureNum(req.layers, 'lay');
  ensureStr(req.skin_indication, 'si');
  ensureNum(req.healing_days, 'hd');
  ensureBool(req.sunscreen_prescribed, 'sp');
  ensureBool(req.post_peel_infection, 'ppi');
  ensureEnum(req.outcome, 'out', ['excellent','good','fair','poor','unknown','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function laser(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.laser_type, 'lt', ['ipl','alexandrite','diode','nd_yag','ruby','erbium','co2','fractional_co2','pulsed_dye','thulium','other']);
  ensureEnum(req.indication, 'ind', ['hair_removal','pigmentation','vascular','resurfacing','tattoo','scar','acne','other','unknown']);
  ensureNum(req.fluence_j_cm2, 'fjc');
  ensureNum(req.spot_size_mm, 'ss');
  ensureStr(req.treatment_area, 'ta');
  ensureNum(req.sessions, 'ses');
  ensureEnum(req.complications, 'comp', ['none','erythema','blistering','scarring','hyper_pigmentation','hypo_pigmentation','infection','other']);
  ensureBool(req.eye_protection_used, 'epu');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function fillers(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.filler_type, 'ft', ['ha','calcium_hydroxy','plla','pmma','fat','other','unknown']);
  ensureEnum(req.indication, 'ind', ['nasolabial','lips','cheeks','under_eye','chin','jaw','temples','hand','scar','other']);
  ensureNum(req.volume_ml, 'vol');
  ensureNum(req.cannula_used, 'can');
  ensureStr(req.treatment_zone, 'tz');
  ensureEnum(req.complications, 'comp', ['none','bruising','swelling','asymmetry','lumpiness','vascular_occlusion','granuloma','tindl','other']);
  ensureBool(req.reversal_agent_available, 'raa');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function micro_needling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.needle_depth_mm, 'nd');
  ensureBool(req.radiofrequency_added, 'rf');
  ensureBool(req.prp_added, 'prp');
  ensureStr(req.indication, 'ind');
  ensureNum(req.sessions_recommended, 'srec');
  ensureNum(req.sessions_completed, 'scomp');
  ensureNum(req.healing_days, 'hd');
  ensureEnum(req.outcome, 'out', ['excellent','good','fair','poor','unknown','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureBool(req.sunscreen_prescribed, 'sp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { botox, chemical_peel, laser, fillers, micro_needling }; }
module.exports = { funcs, ValidationError };