// filepath: tier163_div_764_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dive_fitness(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.dive_cert, 'dc', ['OW','AOW','rescue','divemaster','instructor','NA']);
  ensureNum(req.max_depth_m, 'md'); ensureNum(req.total_dives, 'td');
  ensureBool(req.medical_clearance, 'mc'); ensureEnum(req.pulmonary_function, 'pf', ['normal','mild_restrict','moderate_restrict','severe','NA']);
  ensureBool(req.cardiac_clearance, 'cc'); ensureBool(req.ent_clearance, 'ec');
  ensureEnum(req.neurologic, 'nr', ['normal','abnormal','NA']);
  ensureEnum(req.fitness, 'ft', ['medically_fit','medically_unfit','conditional','NA']);
  ensureStr(req.provider, 'pr');
  return { df_id: `df_${Date.now()}`, patient_id: req.patient_id, fitness: req.fitness };
}

function decompression_sick2(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.depth_max_m, 'dm'); ensureNum(req.bottom_time_min, 'bt');
  ensureNum(req.ascent_rate_m_min, 'ar'); ensureNum(req.surface_interval_min, 'si');
  ensureEnum(req.symptom, 'sy', ['joint','neurologic','inner_ear','pulmonary','other','NA']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','NA']);
  ensureBool(req.treatment_given, 'tg'); ensureEnum(req.recompression_table, 'rt', ['USN_5','USN_6','USN_6ext','Comex_30','NA']);
  ensureEnum(req.outcome, 'ot', ['full_recovery','partial','no_change','death','NA']);
  ensureNum(req.time_to_treat_min, 'tt'); ensureStr(req.provider, 'pr');
  return { dc_id: `dc_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, outcome: req.outcome };
}

function gas_toxicity2(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gas_type, 'gt', ['CO','CO2','O2','nitrogen','hydrogen_sulfide','other','NA']);
  ensureNum(req.exposure_ppm, 'ep'); ensureNum(req.exposure_duration_min, 'ed');
  ensureBool(req.symptoms, 'sx'); ensureNum(req.carboxyhemoglobin_pct, 'cp');
  ensureEnum(req.treatment, 'tr', ['none','100_pct_oxygen','hyperbaric','supportive','NA']);
  ensureNum(req.duration_min, 'du'); ensureEnum(req.outcome, 'ot', ['recovered','partial','no_change','death','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { gt_id: `gt_${Date.now()}`, patient_id: req.patient_id, gas: req.gas_type, outcome: req.outcome };
}

function barotrauma2(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lo', ['middle_ear','inner_ear','sinus','lung','GI','NA']);
  ensureNum(req.depth_at_injury_m, 'di'); ensureNum(req.ascent_rate_m_min, 'ar');
  ensureNum(req.pain_score, 'ps'); ensureBool(req.perforation, 'pr');
  ensureEnum(req.treatment, 'tr', ['conservative','decongestant','analgesic','surgery','NA']);
  ensureEnum(req.complication, 'co', ['none','perforation','infection','neurologic','NA']);
  ensureNum(req.hearing_change_dB, 'hc'); ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { bt_id: `bt_${Date.now()}`, patient_id: req.patient_id, location: req.location };
}

function hyperbaric_treat(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.depth_ft, 'df'); ensureNum(req.gas_mix, 'gm');
  ensureNum(req.duration_min, 'du'); ensureNum(req.session_count, 'sc');
  ensureEnum(req.indication, 'in', ['DCS','AGE','CO_poison','wound','radiation','infection','NA']);
  ensureBool(req.improvement, 'im'); ensureBool(req.oxygen_toxicity, 'ot');
  ensureEnum(req.complication, 'co', ['none','barotrauma','oxygen_toxicity','seizure','NA']);
  ensureEnum(req.tolerated, 'tl', ['well','moderate','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { ht_id: `ht_${Date.now()}`, patient_id: req.patient_id, indication: req.indication, session: req.session_count };
}

function funcs() { return { dive_fitness, decompression_sick2, gas_toxicity2, barotrauma2, hyperbaric_treat }; }
module.exports = { funcs, ValidationError };