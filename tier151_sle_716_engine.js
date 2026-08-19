// filepath: tier151_sle_716_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function polysom(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.tst_min, 'ts');
  ensureNum(req.sleep_efficiency_pct, 'se');
  ensureNum(req.n1_pct, 'n1');
  ensureNum(req.n2_pct, 'n2');
  ensureNum(req.n3_pct, 'n3');
  ensureNum(req.rem_pct, 'rp');
  ensureNum(req.rem_latency_min, 'rl');
  ensureNum(req.ahi, 'ah');
  ensureNum(req.odi, 'od');
  ensureNum(req.min_sao2, 'ms');
  ensureNum(req.arousal_index, 'ai');
  ensureNum(req.plmd_index, 'pl');
  ensureStr(req.provider, 'pr');
  return { ps_id: `psg_${Date.now()}`, patient_id: req.patient_id, ahi: req.ahi };
}
function pap_titration(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.cpap_cm_h2o, 'cp');
  ensureNum(req.bipap_ipap, 'ip');
  ensureNum(req.bipap_epap, 'ep');
  ensureNum(req.min_pressure, 'mn');
  ensureNum(req.max_pressure, 'mx');
  ensureEnum(req.mode, 'mo', ['CPAP','BiPAP','APAP','ASV','AVAPS','other','NA']);
  ensureNum(req.final_ahi, 'fa');
  ensureNum(req.leak_l_min, 'lk');
  ensureNum(req.usage_hr_per_night, 'ug');
  ensureEnum(req.mask_fit, 'mf', ['good','moderate','poor','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { pt_id: `ptt_${Date.now()}`, patient_id: req.patient_id, mode: req.mode };
}
function mslt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.nap_count, 'nc');
  ensureNum(req.mean_sleep_latency_min, 'ms');
  ensureNum(req.sleep_onset_rem_periods, 'so');
  ensureEnum(req.diagnosis, 'dx', ['normal','narcolepsy_type_1','narcolepsy_type_2','idiopathic_hypersomnia','insufficient_sleep','uncertain','NA','unknown']);
  ensureNum(req.rem_latency_min, 'rl');
  ensureNum(req.tst_min, 'ts');
  ensureStr(req.provider, 'pr');
  return { ms_id: `msl_${Date.now()}`, patient_id: req.patient_id, mean_latency: req.mean_sleep_latency_min };
}
function insomnia_cbt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.isi_score, 'is');
  ensureNum(req.sleep_diary_days, 'sd');
  ensureNum(req.avg_sleep_time_min, 'as');
  ensureNum(req.avg_wake_time_min, 'aw');
  ensureNum(req.sleep_efficiency_pct, 'se');
  ensureNum(req.stimulus_control_weeks, 'sc');
  ensureBool(req.sleep_restriction, 'sr');
  ensureBool(req.cognitive_restructuring, 'cr');
  ensureBool(req.sleep_hygiene, 'sh');
  ensureBool(req.medication_tapered, 'mt');
  ensureStr(req.provider, 'pr');
  return { ic_id: `icb_${Date.now()}`, patient_id: req.patient_id, isi: req.isi_score };
}
function parasomnia(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['night_terror','sleepwalking','REM_behavior','confusional_arousal','sleep_talking','enuresis','bruxism','sleep_paralysis','exploding_head','nightmare','other','NA','unknown']);
  ensureNum(req.frequency_per_week, 'fw');
  ensureEnum(req.stage, 'st', ['NREM','REM','both','NA','unknown']);
  ensureBool(req.violent_episodes, 'vi');
  ensureBool(req.self_injury, 'si');
  ensureNum(req.prevalence_age_onset, 'ao');
  ensureEnum(req.treatment, 'tr', ['none','melatonin','clonazepam','pramipexole','benzodiazepine','antidepressant','safety_measures','behavioral','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ps_id: `prs_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}

function funcs() { return { polysom, pap_titration, mslt, insomnia_cbt, parasomnia }; }
module.exports = { funcs, ValidationError };