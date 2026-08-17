// filepath: tier38_dermatology_ext_224_eczema_engine.js
// TIER38_DERMATOLOGY-224: Eczema
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function atopic_dermatitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.scorad, 'scorad');
  ensureNumber(req.iga, 'iga');
  ensureNumber(req.eosinophil, 'eos');
  ensureEnum(req.family_history, 'fhx', ['none','atopy','asthma','eczema','allergic_rhinitis','multiple','other']);
  ensureBool(req.flaring, 'flare');
  let status;
  if (req.iga >= 3 || req.scorad >= 40) status = 'severe_ad_systemic_consider';
  else if (req.age < 5 && req.family_history === 'multiple') status = 'infantile_atopy_review_allergy';
  else if (req.eosinophil >= 700 && req.iga >= 2) status = 'high_eosinophil_biologic_eligible';
  else if (req.iga >= 1) status = 'mild_to_moderate_topical_optimize';
  else status = 'mild_ad_topical_appropriate';
  return { status, age: req.age };
}

function eczema_severity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.scorad, 'scorad');
  ensureNumber(req.bsa_pct, 'bsa');
  ensureNumber(req.iga, 'iga');
  ensureEnum(req.sleep_disruption, 'sleep', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.classification, 'cls', ['mild','moderate','severe','unknown','other']);
  ensureEnum(req.quality_of_life, 'qol', ['not_affected','mild','moderate','severe','unknown','other']);
  let status;
  if (req.iga === 4 || req.scorad >= 50) status = 'severe_eczema_systemic_indicated';
  else if (req.classification === 'severe' && req.quality_of_life === 'severe') status = 'severe_qol_impact_biologic';
  else if (req.sleep_disruption === 'severe') status = 'sleep_severely_disrupted_review';
  else status = 'severity_classified';
  return { status, cls: req.classification };
}

function eczema_topical(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.topical, 'top', ['low_potency_steroid','mid_potency_steroid','high_potency_steroid','super_high_steroid','tacrolimus','pimecrolimus','none','other']);
  ensureEnum(req.sites, 'sites', ['face','eyelids','trunk_limbs','hands','flexural','genital','multiple','other']);
  ensureEnum(req.frequency, 'freq', ['once_daily','twice_daily','three_times_week','weekly','other']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','partial','poor','none','unknown']);
  let status;
  if (req.topical === 'super_high_steroid' && req.sites === 'face') status = 'face_steroid_caution_use_tacrolimus';
  else if (req.duration_weeks > 4 && req.response === 'poor') status = 'topical_failure_review_diagnosis';
  else if (req.response === 'excellent' && req.frequency === 'three_times_week') status = 'topical_response_taper_maintain';
  else status = 'eczema_topical_review';
  return { status, top: req.topical };
}

function eczema_systemic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.systemic, 'sys', ['dupilumab','tralokinumab','baricitinib','upadacitinib','abrocitinib','mycophenolate','azathioprine','methotrexate','cyclosporine','none','other']);
  ensureNumber(req.duration_months, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  ensureEnum(req.side_effects, 'se', ['none','conjunctivitis','injection_site','headache','rash','lab_abnormality','other']);
  ensureBool(req.prior_immunomodulator, 'prior');
  let status;
  if (req.systemic === 'dupilumab' && req.response === 'excellent') status = 'dupilumab_optimal_response';
  else if (req.side_effects === 'conjunctivitis') status = 'conjunctivitis_manage_continue';
  else if (req.response === 'poor' && req.duration_months >= 4) status = 'systemic_failure_review';
  else if (req.prior_immunomodulator === false && req.systemic === 'dupilumab') status = 'dupilumab_naive_initiate';
  else status = 'eczema_systemic_review';
  return { status, sys: req.systemic };
}

function wound_care_eczema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.infected, 'inf');
  ensureEnum(req.excoriation, 'exc', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.emollient_use, 'emo', ['none','once_daily','twice_daily','three_times_daily','other']);
  ensureBool(req.bleach_bath, 'bleach');
  ensureBool(req.antibiotic_needed, 'abx');
  let status;
  if (req.infected) status = 'infected_eczema_antibiotic_culture';
  else if (req.bleach_bath === false && req.excoriation === 'severe') status = 'bleach_bath_recommend';
  else if (req.emollient_use === 'none' || req.emollient_use === 'once_daily') status = 'emollient_optimize_twice_daily';
  else if (req.excoriation === 'severe' && req.antibiotic_needed === false) status = 'severe_excoriation_assess_secondary_infection';
  else status = 'eczema_wound_review';
  return { status, exc: req.excoriation };
}

function funcs() { return { atopic_dermatitis, eczema_severity, eczema_topical, eczema_systemic, wound_care_eczema }; }
module.exports = { funcs, ValidationError };