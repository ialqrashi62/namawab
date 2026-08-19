// filepath: tier164_int_770_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acupuncture(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.indication, 'in', ['chronic_pain','migraine','nausea','insomnia','anxiety','smoking','NA']);
  ensureNum(req.sessions, 'sn'); ensureNum(req.minutes_per_session, 'mp');
  ensureEnum(req.method, 'mt', ['manual','electroacupuncture','auricular','scalp','combination','NA']);
  ensureNum(req.pain_baseline, 'pb'); ensureNum(req.pain_after, 'pa');
  ensureBool(req.adverse, 'ad'); ensureNum(req.benefit_score, 'bs');
  ensureEnum(req.frequency, 'fq', ['weekly','biweekly','triweekly','monthly','NA']);
  ensureStr(req.provider, 'pr');
  return { ac_id: `ac_${Date.now()}`, patient_id: req.patient_id, indication: req.indication, sessions: req.sessions };
}

function herbal_med(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.herb, 'hb', ['turmeric','ginger','ginkgo','st_johns','echinacea','milk_thistle','other','NA']);
  ensureNum(req.dose_mg, 'ds'); ensureEnum(req.form, 'fm', ['tea','tincture','capsule','powder','extract','NA']);
  ensureNum(req.duration_days, 'du'); ensureBool(req.drug_interaction, 'di');
  ensureEnum(req.indication, 'ind', ['general_wellness','inflammation','sleep','anxiety','cognitive','nausea','NA']);
  ensureBool(req.adverse, 'ad'); ensureEnum(req.disposition, 'dp', ['continue','discontinue','escalate','NA']);
  ensureStr(req.provider, 'pr');
  return { hm_id: `hm_${Date.now()}`, patient_id: req.patient_id, herb: req.herb, dose: req.dose_mg };
}

function mind_body(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.technique, 'tn', ['meditation','yoga','tai_chi','breathwork','hypnosis','biofeedback','NA']);
  ensureNum(req.sessions, 'sn'); ensureNum(req.minutes_per_day, 'mp');
  ensureEnum(req.indication, 'in', ['stress','anxiety','depression','insomnia','pain','chronic','NA']);
  ensureNum(req.score_baseline, 'sb'); ensureNum(req.score_after, 'sa');
  ensureNum(req.improvement_pct, 'ip'); ensureEnum(req.disposition, 'di', ['continue','discontinue','NA']);
  ensureStr(req.provider, 'pr');
  return { mb_id: `mb_${Date.now()}`, patient_id: req.patient_id, technique: req.technique, sessions: req.sessions };
}

function nutrition_int(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bmi, 'bm');
  ensureEnum(req.diet_type, 'dt', ['mediterranean','vegan','vegetarian','keto','paleo','gluten_free','low_fodmap','NA']);
  ensureNum(req.calorie_target, 'ct'); ensureNum(req.protein_g, 'pg');
  ensureEnum(req.indication, 'in', ['general_health','weight_loss','diabetes','hypertension','ibs','NA']);
  ensureNum(req.weight_change_kg, 'wc'); ensureNum(req.food_diary_days, 'fd');
  ensureBool(req.vitamin_d, 'vd'); ensureStr(req.provider, 'pr');
  return { nu_id: `nu_${Date.now()}`, patient_id: req.patient_id, diet: req.diet_type, weight: req.weight_change_kg };
}

function functional_med(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.matrix, 'mx', ['detoxification','immune','hormone','mitochondria','gut','inflammatory','NA']);
  ensureNum(req.diagnostic_tests, 'dt'); ensureNum(req.supplements_count, 'sc');
  ensureEnum(req.lifestyle, 'ls', ['diet','exercise','sleep','stress','multiple','NA']);
  ensureNum(req.followup_days, 'fd'); ensureBool(req.improvement, 'im');
  ensureNum(req.symptom_score, 'ss'); ensureEnum(req.disposition, 'di', ['continue','modify','discontinue','NA']);
  ensureStr(req.provider, 'pr');
  return { fm_id: `fm_${Date.now()}`, patient_id: req.patient_id, matrix: req.matrix, supplements: req.supplements_count };
}

function funcs() { return { acupuncture, herbal_med, mind_body, nutrition_int, functional_med }; }
module.exports = { funcs, ValidationError };