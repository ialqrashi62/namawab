// filepath: tier158_men_745_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.age_menarche, 'am');
  ensureNum(req.age_menopause, 'am2');
  ensureNum(req.years_post_menopause, 'yp');
  ensureNum(req.years_amenorrhea, 'ya');
  ensureEnum(req.menopause_stage, 'ms', ['reproductive','late_reproductive','early_menopausal_transition','late_menopausal_transition','post_menopause_early','post_menopause_late','post_menopause','surgical','induced','premature','NA','unknown']);
  ensureNum(req.fsh, 'fs');
  ensureNum(req.estradiol, 'es');
  ensureNum(req.amh, 'am');
  ensureBool(req.hot_flashes, 'hf');
  ensureNum(req.menopause_rating_scale, 'mr');
  ensureStr(req.provider, 'pr');
  return { as_id: `men_${Date.now()}`, patient_id: req.patient_id, stage: req.menopause_stage };
}
function hot_flashes(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.episodes_24h, 'e2');
  ensureNum(req.severity, 'sv');
  ensureNum(req.night_sweats_count, 'ns');
  ensureNum(req.sleep_disruption_pct, 'sd');
  ensureBool(req.affect_quality_life, 'aq');
  ensureEnum(req.triggers, 'tr', ['none','stress','caffeine','alcohol','spicy_food','heat','other','combination','NA']);
  ensureEnum(req.therapy, 'th', ['none','HRT_estrogen','HRT_combined','SSRI','SNRI','gabapentin','clonidine','oxybutynin','fesoterodine','CBT','lifestyle','other','combination','NA']);
  ensureNum(req.days_since_start, 'ds');
  ensureStr(req.provider, 'pr');
  return { hf_id: `hfm_${Date.now()}`, patient_id: req.patient_id, episodes: req.episodes_24h };
}
function hormone_therapy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['estrogen_only','combined_EP','combined_EV','tibolone','SERM','bazedoxifene','topical','patch','gel','spray','NA','other']);
  ensureNum(req.estradiol_dose_mcg, 'ed');
  ensureNum(req.progesterone_dose_mg, 'pd');
  ensureNum(req.duration_months, 'du');
  ensureEnum(req.route, 'rt', ['oral','transdermal_patch','gel','cream','vaginal','injection','NA','other']);
  ensureNum(req.bleeding_pattern, 'bp');
  ensureNum(req.mammogram_count, 'mc');
  ensureNum(req.dexa_score, 'ds');
  ensureNum(req.bp, 'bp2');
  ensureEnum(req.indications, 'in', ['vasomotor','GSM','bone','premature_menopause','surgical','NA','other']);
  ensureNum(req.contraindications_count, 'cc');
  ensureStr(req.provider, 'pr');
  return { ht_id: `hrp_${Date.now()}`, patient_id: req.patient_id };
}
function bone_health(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.years_menopause, 'ym');
  ensureNum(req.bmd_lumbar_t, 'bl');
  ensureNum(req.bmd_hip_t, 'bh');
  ensureNum(req.bmd_femur_t, 'bf');
  ensureNum(req.frax_10yr_major, 'fm');
  ensureNum(req.frax_10yr_hip, 'fh');
  ensureNum(req.vitamin_d_25oh, 'vd');
  ensureNum(req.calcium_intake_mg, 'ca');
  ensureEnum(req.treatment, 'tr', ['none','calcium','vitamin_D','bisphosphonate','denosumab','teriparatide','romosozumab','raloxifene','HRT','combination','NA']);
  ensureNum(req.dexa_followup_years, 'df');
  ensureStr(req.provider, 'pr');
  return { bh_id: `bmh_${Date.now()}`, patient_id: req.patient_id };
}
function gsm(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.years_menopause, 'ym');
  ensureEnum(req.symptoms, 'sy', ['dryness','dyspareunia','itching','burning','urgency','frequency','recurrent_uti','vaginal_atrophy','NA','combination','other']);
  ensureNum(req.severity, 'sv');
  ensureNum(req.vhi_score, 'vh');
  ensureEnum(req.treatment, 'tr', ['none','moisturizer','lubricant','vaginal_estrogen','vaginal_DHEA','vaginal_T','oral_ospemifene','laser','pelvic_floor_physio','combination','NA','other']);
  ensureNum(req.improvement_pct, 'ip');
  ensureBool(req.uti_recurrence, 'ur');
  ensureStr(req.provider, 'pr');
  return { gs_id: `gsm_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { assess, hot_flashes, hormone_therapy, bone_health, gsm }; }
module.exports = { funcs, ValidationError };