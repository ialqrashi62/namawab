// filepath: tier163_mar_765_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function seasickness(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.sea_state, 'ss', ['calm','light','moderate','rough','very_rough','NA']);
  ensureNum(req.duration_hr, 'dh'); ensureNum(req.severity, 'sv');
  ensureEnum(req.symptoms, 'sx', ['nausea','vomiting','vertigo','headache','fatigue','combination','NA']);
  ensureEnum(req.medication, 'md', ['none','meclizine','dimenhydrinate','scopolamine','ginger','combination','NA']);
  ensureBool(req.iv_fluids, 'iv'); ensureBool(req.dehydrated, 'dh2');
  ensureStr(req.provider, 'pr');
  return { ss_id: `ss_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, med: req.medication };
}

function hypothermia(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.water_temp_c, 'wt');
  ensureNum(req.immersion_min, 'im'); ensureNum(req.core_temp_c, 'ct');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','profound','NA']);
  ensureBool(req.cardiac_arrest, 'ca'); ensureEnum(req.treatment, 'tr', ['passive_rewarming','active_external','active_internal','ECMO','NA']);
  ensureNum(req.warming_time_min, 'wt2'); ensureEnum(req.outcome, 'ot', ['recovered','partial','no_change','death','NA']);
  ensureStr(req.provider, 'pr');
  return { ht_id: `ht_${Date.now()}`, patient_id: req.patient_id, core_temp: req.core_temp_c, outcome: req.outcome };
}

function drowning(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.water_type, 'wt', ['salt','fresh','chlorine','NA']);
  ensureNum(req.submersion_min, 'sm'); ensureBool(req.cpr_done, 'cd');
  ensureNum(req.cpr_min, 'cm'); ensureNum(req.spo2_first, 'sf');
  ensureNum(req.gcs_first, 'gf'); ensureBool(req.intubation, 'it');
  ensureEnum(req.outcome, 'ot', ['survived','survived_with_neuro_injury','death','NA']);
  ensureNum(req.icu_days, 'id'); ensureStr(req.provider, 'pr');
  return { dr_id: `dr_${Date.now()}`, patient_id: req.patient_id, submersion: req.submersion_min, outcome: req.outcome };
}

function envenomation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.organism, 'og', ['jellyfish','mosquito','snake','spider','scorpion','stingray','other','NA']);
  ensureNum(req.contact_min, 'cm'); ensureNum(req.envenomation_score, 'es');
  ensureBool(req.antivenom, 'av'); ensureEnum(req.treatment, 'tr', ['hot_water','ice','antivenom','topical','combination','NA']);
  ensureEnum(req.symptom, 'sy', ['localized_pain','systemic','anaphylaxis','paralysis','none','NA']);
  ensureEnum(req.progression, 'pr', ['localized','spreading','systemic','NA']);
  ensureEnum(req.outcome, 'ot', ['healed','partial','no_change','death','NA']);
  ensureStr(req.provider, 'pr');
  return { ev_id: `ev_${Date.now()}`, patient_id: req.patient_id, organism: req.organism, outcome: req.outcome };
}

function dive_emergency(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.depth_m, 'dm');
  ensureEnum(req.ascent_type, 'at', ['normal','rapid','emergency','panic','NA']);
  ensureEnum(req.symptom, 'sy', ['paralysis','consciousness','vertigo','joint','rash','NA']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','NA']);
  ensureBool(req.recompression, 'rc'); ensureNum(req.time_to_chamber_min, 'tc');
  ensureEnum(req.outcome, 'ot', ['full_recovery','partial','no_change','death','NA']);
  ensureBool(req.intubation, 'it'); ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, outcome: req.outcome };
}

function funcs() { return { seasickness, hypothermia, drowning, envenomation, dive_emergency }; }
module.exports = { funcs, ValidationError };