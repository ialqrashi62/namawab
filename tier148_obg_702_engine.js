// filepath: tier148_obg_702_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function prenatal(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ga_weeks, 'gw');
  ensureNum(req.ga_days, 'gd');
  ensureNum(req.fetal_hr, 'fh');
  ensureNum(req.fundal_height_cm, 'fh2');
  ensureNum(req.efw_grams, 'ef');
  ensureEnum(req.amnio, 'am', ['intact','ruptured_PROM','ruptured_PPROM','uncertain','NA']);
  ensureNum(req.af_index, 'af');
  ensureNum(req.bishop_score, 'bs');
  ensureStr(req.provider, 'pr');
  return { pn_id: `prn_${Date.now()}`, patient_id: req.patient_id, ga: req.ga_weeks };
}
function labor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.stage, 'st', ['latent_1st','active_1st','2nd','3rd','4th','unknown']);
  ensureNum(req.cervical_dilation_cm, 'cd');
  ensureNum(req.effacement_pct, 'ef');
  ensureNum(req.station, 'st2');
  ensureNum(req.contractions_per_10min, 'co');
  ensureEnum(req.fetal_monitor, 'fm', ['category_I','category_II','category_III','intermittent','Doppler','other','NA']);
  ensureNum(req.duration_hr, 'du');
  ensureEnum(req.analgesia, 'an', ['none','IV_opioid','epidural','spinal','combined_spinal_epidural','nitrous','pudendal','local','other']);
  ensureStr(req.provider, 'pr');
  return { lb_id: `lbr_${Date.now()}`, patient_id: req.patient_id, stage: req.stage, dilation: req.cervical_dilation_cm };
}
function delivery(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['spontaneous_vaginal','operative_vaginal_vacuum','operative_vaginal_forceps','scheduled_c_section','urgent_c_section','emergent_c_section','VBAC','trial_of_labor','other']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.apgar_1, 'ap1');
  ensureNum(req.apgar_5, 'ap5');
  ensureNum(req.weight_grams, 'wt');
  ensureEnum(req.sex, 'sx', ['M','F','ambiguous','unknown']);
  ensureBool(req.complications, 'cp');
  ensureStr(req.complications_text, 'ct');
  ensureNum(req.length_of_labor_hr, 'll');
  ensureStr(req.provider, 'pr');
  return { dy_id: `dlv_${Date.now()}`, patient_id: req.patient_id, mode: req.mode, weight: req.weight_grams };
}
function pp_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.pp_day, 'pd', ['day_0','day_1','day_2','day_3','day_4','day_5','week_1','week_2','week_6','week_12','other']);
  ensureNum(req.lochia_amount, 'lo');
  ensureEnum(req.lochia_color, 'lc', ['rubra','serosa','alba','foul','none','NA']);
  ensureNum(req.fundal_height_cm, 'fh');
  ensureEnum(req.episiotomy, 'ep', ['none','1st_deg','2nd_deg','3rd_deg','4th_deg','midline','mediolateral','NA']);
  ensureBool(req.breastfeeding, 'bf');
  ensureEnum(req.mood, 'md', ['normal','baby_blues','PPD_suspected','PPD_diagnosed','puerperal_psychosis','anxiety','other','NA']);
  ensureEnum(req.contraception, 'co', ['none','condom','IUD','pill','patch','ring','implant','DMPA','tubal','partner_vasectomy','LAM','other']);
  ensureStr(req.provider, 'pr');
  return { pc_id: `ppc_${Date.now()}`, patient_id: req.patient_id, day: req.pp_day };
}
function gyn_proc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['hysteroscopy','hysterectomy','myomectomy','oophorectomy','cystectomy','endometrial_ablation','LEEP','cold_knife_cone','colposcopy','biopsy','polypectomy','IUD_insert','IUD_remove','Nexplanon','Essure','tubal_ligation','d&C','laparoscopy','laparotomy','sling','other']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_min, 'du');
  ensureEnum(req.complications, 'cp', ['none','bleeding','infection','injury','conversion','other']);
  ensureBool(req.pathology_sent, 'ps');
  ensureStr(req.finding, 'fi');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { gp_id: `gyn_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}

function funcs() { return { prenatal, labor, delivery, pp_care, gyn_proc }; }
module.exports = { funcs, ValidationError };