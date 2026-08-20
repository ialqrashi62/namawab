// filepath: tier166_cul_775_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cultural_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.language_pref, 'lp', ['English','Arabic','French','Urdu','Spanish','Hindi','Other','NA']);
  ensureEnum(req.religion, 'rl', ['Muslim','Christian','Jewish','Hindu','Buddhist','None','Other','NA']);
  ensureBool(req.family_present, 'fp'); ensureEnum(req.decision_style, 'ds', ['individual','family','community','NA']);
  ensureBool(req.gender_pref_match, 'gp'); ensureBool(req.cultural_needs_met, 'cn');
  ensureEnum(req.barrier_type, 'bt', ['language','gender','religious','dietary','other','none','NA']);
  ensureNum(req.satisfaction, 'st'); ensureStr(req.provider, 'pr');
  return { ca_id: `ca_${Date.now()}`, patient_id: req.patient_id, lang: req.language_pref, sat: req.satisfaction };
}

function interpreter_use(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.interpreter_type, 'it', ['in_person','video','phone','family','staff','none','NA']);
  ensureNum(req.duration_min, 'du'); ensureEnum(req.source_lang, 'sl', ['English','Arabic','French','Urdu','Spanish','Other','NA']);
  ensureEnum(req.target_lang, 'tl', ['English','Arabic','French','Urdu','Spanish','Other','NA']);
  ensureBool(req.medical_terms_checked, 'mc'); ensureNum(req.accuracy_score, 'as');
  ensureNum(req.satisfaction, 'sa'); ensureEnum(req.modality, 'mo', ['scheduled','urgent','follow_up','NA']);
  ensureEnum(req.disposition, 'di', ['continue','escalate','no_need','NA']);
  ensureStr(req.provider, 'pr');
  return { iu_id: `iu_${Date.now()}`, patient_id: req.patient_id, type: req.interpreter_type, acc: req.accuracy_score };
}

function religious_considerations(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.religion, 're', ['Muslim','Christian','Jewish','Hindu','Buddhist','Sikh','Other','None','NA']);
  ensureBool(req.dietary_observance, 'do'); ensureBool(req.fasting, 'ft');
  ensureBool(req.prayer_schedule, 'ps'); ensureBool(req.blood_products_ok, 'bp');
  ensureBool(req.end_of_life_counsel, 'el'); ensureEnum(req.modesty_preference, 'mp', ['high','moderate','low','none','NA']);
  ensureBool(req.care_plan_accommodated, 'cp'); ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, patient_id: req.patient_id, religion: req.religion, accommodated: req.care_plan_accommodated };
}

function community_health_worker(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.chw_visits_30d, 'cv', ['0','1-2','3-5','6-10','>10','NA']);
  ensureNum(req.followup_adherence, 'fa'); ensureBool(req.medication_reconcile, 'mr');
  ensureBool(req.health_education, 'he'); ensureEnum(req.social_needs, 'sn', ['food','shelter','safety','language','multiple','none','NA']);
  ensureNum(req.referrals_made, 'rm'); ensureEnum(req.chw_setting, 'cs', ['home','clinic','community','phone','NA']);
  ensureNum(req.satisfaction_score, 'ss'); ensureStr(req.provider, 'pr');
  return { cw_id: `cw_${Date.now()}`, patient_id: req.patient_id, visits: req.chw_visits_30d, sat: req.satisfaction_score };
}

function patient_navigator(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.appointments_scheduled, 'as'); ensureNum(req.no_shows_30d, 'ns');
  ensureBool(req.barriers_resolved, 'br'); ensureEnum(req.barrier_type, 'bt', ['transport','language','insurance','disability','social','multiple','none','NA']);
  ensureNum(req.cost_savings, 'cs'); ensureNum(req.days_to_first_appt, 'df');
  ensureEnum(req.disposition, 'di', ['engaged','passive','declined','NA']);
  ensureNum(req.contact_count, 'cc'); ensureStr(req.provider, 'pr');
  return { pn_id: `pn_${Date.now()}`, patient_id: req.patient_id, appt: req.appointments_scheduled, disp: req.disposition };
}

function funcs() { return { cultural_assessment, interpreter_use, religious_considerations, community_health_worker, patient_navigator }; }
module.exports = { funcs, ValidationError };