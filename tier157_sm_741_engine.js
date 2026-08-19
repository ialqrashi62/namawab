// filepath: tier157_sm_741_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pre_participation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.sport, 'sp', ['soccer','basketball','football','baseball','volleyball','tennis','hockey','lacrosse','cricket','rugby','running','cycling','swimming','gymnastics','wrestling','boxing','martial_arts','skiing','snowboarding','golf','rowing','crew','triathlon','marathon','ultramarathon','esports','other','NA']);
  ensureEnum(req.level, 'lv', ['recreational','club','high_school','college','professional','olympic','masters','NA','unknown']);
  ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.hr, 'hr');
  ensureNum(req.hgb, 'hg');
  ensureEnum(req.heart_murmur, 'hm', ['none','innocent','pathologic','unknown','NA']);
  ensureBool(req.cardiac_history, 'ch');
  ensureBool(req.musculoskeletal_history, 'mh');
  ensureNum(req.cleared_weeks, 'cw');
  ensureEnum(req.clearance, 'cl', ['cleared','cleared_with_restrictions','deferred','not_cleared','referred','NA']);
  ensureStr(req.provider, 'pr');
  return { pp_id: `spr_${Date.now()}`, patient_id: req.patient_id, sport: req.sport };
}
function concussion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.scid5_score, 'ss');
  ensureNum(req.bess_score, 'bs');
  ensureNum(req.voms_score, 'vs');
  ensureEnum(req.tier, 'ti', ['1_physiological','2_cognitive','3_vestibular','4_oculomotor','5_cervical','6_anaerobic','7_sport_specific','NA','unknown']);
  ensureNum(req.days_since_injury, 'di');
  ensureNum(req.symptoms_count, 'sc');
  ensureEnum(req.return_to_play, 'rp', ['no_contact','limited_contact','full_contact','cleared','not_cleared','hold','NA']);
  ensureNum(req.rtp_days, 'rt');
  ensureBool(req.history_concussion, 'hc');
  ensureNum(req.prior_concussions, 'pc');
  ensureBool(req.imaging_done, 'id');
  ensureEnum(req.imaging_findings, 'if', ['normal','hemorrhage','contusion','fracture','edema','other','NA','not_done']);
  ensureStr(req.provider, 'pr');
  return { cn_id: `cnc_${Date.now()}`, patient_id: req.patient_id, tier: req.tier };
}
function acl_rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.graft_type, 'gt', ['BTB','quad','hamstring','peroneus','allograft_BTB','allograft_hamstring','allograft_tibialis','synthetic','other','NA']);
  ensureNum(req.weeks_post_op, 'wp');
  ensureNum(req.knee_extension_deg, 'ke');
  ensureNum(req.knee_flexion_deg, 'kf');
  ensureNum(req.quad_strength_pct, 'qs');
  ensureNum(req.hamstring_strength_pct, 'hs');
  ensureNum(req.y_balance_r, 'yb');
  ensureNum(req.ikdc_score, 'ik');
  ensureNum(req.lysolm_score, 'ly');
  ensureEnum(req.run_phase, 'ru', ['not_started','treadmill','antalgic','normal','cutting','pivoting','unrestricted','NA']);
  ensureEnum(req.criteria, 'cr', ['passing','not_passing','partial','NA']);
  ensureStr(req.provider, 'pr');
  return { ar_id: `acl_${Date.now()}`, patient_id: req.patient_id, week: req.weeks_post_op };
}
function throwing(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.discipline, 'di', ['baseball_pitcher','baseball_catcher','quarterback','javelin','discus','shot_put','tennis_serve','volleyball_spike','waterpolo','cricket_bowler','softball_pitcher','other','NA']);
  ensureNum(req.velocity_mph, 'vm');
  ensureNum(req.pitch_count, 'pc');
  ensureNum(req.games_played, 'gp');
  ensureNum(req.rest_days, 'rd');
  ensureEnum(req.arm_pain, 'ap', ['none','mild','moderate','severe','NA']);
  ensureEnum(req.rom_pain, 'rp', ['none','posterior','anterior','medial','lateral','diffuse','NA']);
  ensureNum(req.ucla_score, 'us');
  ensureEnum(req.kerlan_jobe, 'kj', ['negative','positive','NA','unknown']);
  ensureBool(req.need_mri, 'nm');
  ensureStr(req.provider, 'pr');
  return { th_id: `thr_${Date.now()}`, patient_id: req.patient_id, velocity: req.velocity_mph };
}
function recovery(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.week, 'wk');
  ensureNum(req.resting_hr, 'rh');
  ensureNum(req.hrv, 'hv');
  ensureNum(req.sleep_hours, 'sh');
  ensureNum(req.soreness, 'so');
  ensureNum(req.fatigue, 'fa');
  ensureNum(req.mood, 'mo');
  ensureNum(req.stress, 'st');
  ensureNum(req.training_load, 'tl');
  ensureNum(req.acwr, 'aw');
  ensureEnum(req.recommendation, 'rc', ['full_session','reduce_intensity','active_recovery','rest','rest_day','NA','unknown']);
  ensureBool(req.acwr_danger, 'ad');
  ensureStr(req.provider, 'pr');
  return { re_id: `rec_${Date.now()}`, patient_id: req.patient_id, week: req.week };
}

function funcs() { return { pre_participation, concussion, acl_rehab, throwing, recovery }; }
module.exports = { funcs, ValidationError };