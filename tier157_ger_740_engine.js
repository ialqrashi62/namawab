// filepath: tier157_ger_740_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cga(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.frailty, 'fr', ['robust','pre_frail','mild_frail','moderate_frail','severe_frail','NA','unknown']);
  ensureNum(req.fried_score, 'fs');
  ensureNum(req.sppb_score, 'ss');
  ensureNum(req.adl_score, 'as');
  ensureNum(req.iadl_score, 'is');
  ensureNum(req.mmse_score, 'ms');
  ensureNum(req.moca_score, 'mo');
  ensureNum(req.gds_score, 'gs');
  ensureNum(req.mini_nutritional_assessment, 'mn');
  ensureNum(req.falls_30d, 'fa');
  ensureNum(req.polypharmacy, 'pp');
  ensureStr(req.provider, 'pr');
  return { cg_id: `cga_${Date.now()}`, patient_id: req.patient_id, frailty: req.frailty };
}
function cognitive(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.diagnosis, 'dx', ['normal','MCI','mild_dementia','moderate_dementia','severe_dementia','pseudodementia','delirium','NA','unknown']);
  ensureNum(req.mmse, 'mm');
  ensureNum(req.moca, 'mc');
  ensureNum(req.cdr, 'cd');
  ensureNum(req.fast_stage, 'fa');
  ensureBool(req.behavioral_symptoms, 'bs');
  ensureEnum(req.behavioral_type, 'bt', ['none','agitation','aggression','apathy','depression','hallucination','delusion','wandering','sleep_disturbance','other','combination']);
  ensureBool(req.safety_concern, 'sc');
  ensureBool(req.driving_assessment, 'da');
  ensureStr(req.provider, 'pr');
  return { co_id: `cog_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}
function falls_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.falls_30d, 'f3');
  ensureNum(req.falls_90d, 'f9');
  ensureNum(req.injurious_falls_30d, 'if');
  ensureNum(req.tug_sec, 'tu');
  ensureNum(req.tinetti_score, 'ti');
  ensureNum(req.berg_balance, 'bb');
  ensureEnum(req.timed_up_go, 'tg', ['low_risk','moderate_risk','high_risk','unable','NA']);
  ensureBool(req.home_safety_eval, 'hs');
  ensureBool(req.assistive_device, 'ad');
  ensureEnum(req.device_type, 'dt', ['none','cane','walker','wheeled_walker','wheelchair','crutches','other','NA']);
  ensureNum(req.vitamin_d_ng_ml, 'vd');
  ensureStr(req.provider, 'pr');
  return { fa_id: `far_${Date.now()}`, patient_id: req.patient_id };
}
function deprescribing(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.medication_count, 'mc');
  ensureNum(req.beers_medications, 'bm');
  ensureNum(req.stopp_medications, 'sm');
  ensureNum(req.start_medication_count, 'st');
  ensureNum(req.estimated_gfr, 'eg');
  ensureEnum(req.adverse_drug_event, 'ad', ['none','fall','confusion','GI_bleed','renal_injury','hypotension','hyperkalemia','hypoglycemia','bleeding','other']);
  ensureBool(req.taper_done, 'td');
  ensureNum(req.taper_weeks, 'tw');
  ensureNum(req.medications_removed, 'mr');
  ensureNum(req.qaly_gained, 'qg');
  ensureStr(req.provider, 'pr');
  return { dp_id: `dpc_${Date.now()}`, patient_id: req.patient_id, removed: req.medications_removed };
}
function advance_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.code_status, 'cs', ['full_code','DNR','DNI','DNR_DNI','comfort_only','limited','other','NA']);
  ensureBool(req.advance_directive, 'ad');
  ensureBool(req.healthcare_proxy, 'hp');
  ensureBool(req.polst, 'po');
  ensureBool(req.living_will, 'lw');
  ensureNum(req.discussion_count, 'dc');
  ensureBool(req.family_meeting, 'fm');
  ensureEnum(req.dpoa, 'dp', ['none','spouse','child','sibling','friend','attorney','court','other','NA']);
  ensureBool(req.spiritual_care, 'sc');
  ensureNum(req.hospice_referral, 'hr');
  ensureStr(req.provider, 'pr');
  return { ac_id: `acp_${Date.now()}`, patient_id: req.patient_id, code: req.code_status };
}

function funcs() { return { cga, cognitive, falls_assess, deprescribing, advance_care }; }
module.exports = { funcs, ValidationError };