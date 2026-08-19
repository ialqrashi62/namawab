// filepath: tier155_pmr_734_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_post_stroke, 'dp');
  ensureNum(req.nihss, 'nh');
  ensureNum(req.fugl_meyer_score, 'fm');
  ensureNum(req.modified_rankin, 'mr');
  ensureNum(req.barthel_index, 'bi');
  ensureEnum(req.side, 'si', ['left','right','bilateral','NA','unknown']);
  ensureEnum(req.location, 'lc', ['MCA','ACA','PCA','lacunar','brainstem','cerebellum','SAH','hemorrhagic','NA','unknown']);
  ensureBool(req.dysphagia, 'dy');
  ensureBool(req.aphasia, 'ap');
  ensureBool(req.hemineglect, 'hn');
  ensureNum(req.pt_sessions, 'ps');
  ensureNum(req.ot_sessions, 'os');
  ensureNum(req.st_sessions, 'ss');
  ensureStr(req.provider, 'pr');
  return { sr_id: `srk_${Date.now()}`, patient_id: req.patient_id, fma: req.fugl_meyer_score };
}
function tbi_rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','penetrating','anoxic','NA','unknown']);
  ensureNum(req.gcs_initial, 'gi');
  ensureNum(req.ptsd_days, 'pt');
  ensureNum(req.ranchos_scale, 'rs');
  ensureNum(req.drs_score, 'dr');
  ensureNum(req.tbi_length_days, 'tl');
  ensureBool(req.pcoma, 'pc');
  ensureBool(req.agitation, 'ag');
  ensureNum(req.cog_fim, 'cf');
  ensureNum(req.motor_fim, 'mf');
  ensureNum(req.mobility_index, 'mi');
  ensureEnum(req.disposition, 'dp', ['acute_rehab','subacute','SNF','outpatient','home','transfer','NA']);
  ensureStr(req.provider, 'pr');
  return { tb_id: `trb_${Date.now()}`, patient_id: req.patient_id, ranchos: req.ranchos_scale };
}
function amputation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.level, 'lv', ['toe','transmetatarsal','Syme','below_knee_BK','knee_disarticulation','above_knee_AK','hip_disarticulation','transpelvic','partial_foot','partial_hand','wrist_disarticulation','below_elbow_BE','above_elbow_AE','shoulder_disarticulation','forequarter','NA']);
  ensureEnum(req.cause, 'ca', ['diabetes','PVD','trauma','tumor','congenital','infection','other','NA']);
  ensureNum(req.healing_weeks, 'hw');
  ensureBool(req.prosthesis_fitted, 'pf');
  ensureEnum(req.prosthesis_type, 'pt', ['cosmetic','mechanical','myoelectric','bionic','microprocessor','none','NA']);
  ensureNum(req.gait_training_weeks, 'gt');
  ensureBool(req.phantom_pain, 'pp');
  ensureBool(req.stump_issues, 'si');
  ensureNum(req.k_level, 'kl');
  ensureNum(req.mobility_score, 'ms');
  ensureNum(req.assistive_devices, 'ad');
  ensureStr(req.provider, 'pr');
  return { am_id: `amp_${Date.now()}`, patient_id: req.patient_id, level: req.level };
}
function wheelchair(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['manual','power','tilt_in_space','standing','sport','scooter','NA']);
  ensureBool(req.custom_seat, 'cs');
  ensureBool(req.cushion, 'cu');
  ensureEnum(req.cushion_type, 'ct', ['foam','gel','air','honeycomb','combination','none','NA']);
  ensureNum(req.fim_score, 'fm');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.usage, 'us', ['full_time','part_time','occasional','NA']);
  ensureNum(req.pressure_sore_count, 'ps');
  ensureEnum(req.skin_condition, 'sk', ['intact','redness','breakdown','NA','unknown']);
  ensureNum(req.wheelchair_skills_score, 'ws');
  ensureNum(req.adl_score, 'ad');
  ensureStr(req.provider, 'pr');
  return { wc_id: `whl_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function community_reentry(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.weeks_in_rehab, 'wr');
  ensureBool(req.return_home, 'rh');
  ensureNum(req.discharge_destination, 'dd');
  ensureBool(req.employment_return, 'em');
  ensureNum(req.community_mobility_km, 'cm');
  ensureNum(req.ciq_score, 'cq');
  ensureNum(req.life_satisfaction, 'ls');
  ensureNum(req.social_participation, 'sp');
  ensureBool(req.driver_eval_done, 'de');
  ensureBool(req.modified_home, 'mh');
  ensureNum(req.caregiver_burden, 'cb');
  ensureEnum(req.funding, 'fu', ['private','Medicare','Medicaid','worker_comp','auto','other','NA']);
  ensureStr(req.provider, 'pr');
  return { cr_id: `cre_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { stroke_rehab, tbi_rehab, amputation, wheelchair, community_reentry }; }
module.exports = { funcs, ValidationError };