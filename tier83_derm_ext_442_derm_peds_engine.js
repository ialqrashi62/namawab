// filepath: tier83_derm_ext_442_derm_peds_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pediatric_eczema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.scorad_score, 'ss');
  ensureNum(req.bsa_pct, 'bsa');
  ensureBool(req.sleep_disturbance, 'sd');
  ensureBool(req.food_allergies, 'fa');
  ensureBool(req.family_history_atopy, 'fha');
  ensureStr(req.triggers, 'trig');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.bleach_bath_started, 'bbs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function congenital_nevi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.location, 'loc', ['head_neck','trunk','extremity','genital','other','unknown']);
  ensureEnum(req.subtype, 'sub', ['small','medium','large','giant','satellite','other','unknown']);
  ensureBool(req.dermatology_referral, 'dr');
  ensureBool(req.mri_done, 'mri');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureBool(req.excision_planned, 'ep');
  ensureEnum(req.risk, 'risk', ['low','intermediate','high','very_high','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function birthmarks(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['hemangioma','port_wine','café_au_lait','mongolian','nevus_simplex','stork_bite','nevus_flammeus','other','unknown']);
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.location, 'loc', ['face','scalp','trunk','extremity','multiple','other','unknown']);
  ensureBool(req.growth_phase, 'gp');
  ensureEnum(req.phase, 'phase', ['proliferating','involuting','involuted','unknown','other']);
  ensureStr(req.treatment, 'tx');
  ensureBool(req.laser_started, 'ls');
  ensureBool(req.beta_blocker_therapy, 'bbt');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function atopic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.scorad_score, 'ss');
  ensureBool(req.asthma, 'asth');
  ensureBool(req.allergic_rhinitis, 'ar');
  ensureBool(req.food_allergies, 'fa');
  ensureBool(req.family_history, 'fh');
  ensureStr(req.triggers, 'trig');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.bleach_bath_started, 'bbs');
  ensureBool(req.moisturizer_use, 'mu');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function papular(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.diagnosis, 'dx', ['molluscum','milia','miliaria','erythema_toxicum','pityriasis','acne_neonatorum','sebaceous_hyperplasia','molluscum_contagiosum','other','unknown']);
  ensureStr(req.distribution, 'dist');
  ensureBool(req.contagious, 'con');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.cantharidin_used, 'cu');
  ensureNum(req.healing_days, 'hd');
  ensureEnum(req.response, 'resp', ['clearing','stable','worsening','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { pediatric_eczema, congenital_nevi, birthmarks, atopic, papular }; }
module.exports = { funcs, ValidationError };