// filepath: tier86_card_ext_457_card_arrhythmia_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function afib_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.afib_type, 'at', ['paroxysmal','persistent','longstanding_persistent','permanent','new_onset','unknown','other']);
  ensureNum(req.cha2ds2_vasc, 'cha');
  ensureNum(req.has_bled, 'has');
  ensureBool(req.anticoag_started, 'acs');
  ensureEnum(req.anticoagulant, 'ac', ['warfarin','apixaban','rivaroxaban','dabigatran','edoxaban','none','other','unknown']);
  ensureNum(req.hr_at_diagnosis, 'hrd');
  ensureNum(req.lv_ef, 'lve');
  ensureNum(req.la_size, 'las');
  ensureBool(req.referral_ep, 'refep');
  ensureEnum(req.rhythm_strategy, 'rs', ['rate_control','rhythm_control','both','observation','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function afib_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.rate_control_med, 'rcm', ['beta_blocker','calcium_blocker','digoxin','amiodarone','sotalol','other','none','unknown']);
  ensureNum(req.target_hr_rest, 'thr');
  ensureBool(req.in_therapeutic_range, 'itr');
  ensureNum(req.inr, 'inr');
  ensureBool(req.adherence, 'adh');
  ensureEnum(req.thromboembolism_events, 'te', ['none','stroke','systemic_embolism','tia','other','unknown']);
  ensureBool(req.stable, 'st');
  ensureBool(req.referral_ep, 'refep');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function anticoag_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureBool(req.on_warfarin, 'owf');
  ensureNum(req.inr, 'inr');
  ensureNum(req.target_inr_low, 'til');
  ensureNum(req.target_inr_high, 'tih');
  ensureNum(req.time_in_therapeutic_range, 'tit');
  ensureBool(req.doac, 'doac');
  ensureNum(req.creatinine_clearance, 'crcl');
  ensureBool(req.dose_reduced, 'drs');
  ensureBool(req.bleeding_events, 'ble');
  ensureEnum(req.complications, 'comp', ['none','minor_bleed','major_bleed','thrombosis','stroke','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function vt_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.vt_type, 'vt', ['sustained','non_sustained','polymorphic','monomorphic','torsades','unknown','other']);
  ensureBool(req.stable, 'st');
  ensureBool(req.storm, 'storm');
  ensureNum(req.lv_ef, 'lve');
  ensureNum(req.qt_interval, 'qti');
  ensureBool(req.structural_heart, 'sh');
  ensureBool(req.icd_in_situ, 'icd');
  ensureBool(req.icd_proposed, 'icdp');
  ensureEnum(req.treatment, 'tx', ['observation','ablation','icd','antiarrhythmic','combination','referral','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function device_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.device_type, 'dt', ['single_chamber_icd','dual_chamber_icd','crt_d','crt_d_dai','loop_recorder','pacemaker','leadless_pacemaker','other']);
  ensureBool(req.battery_adequate, 'ba');
  ensureNum(req.battery_years_remaining, 'byr');
  ensureNum(req.lead_impedance, 'li');
  ensureNum(req.pacing_threshold, 'pt');
  ensureNum(req.episode_count, 'ec');
  ensureBool(req.shock_therapy_delivered, 'std');
  ensureBool(req.alert_reviewed, 'ar');
  ensureEnum(req.action, 'act', ['none','program_change','reposition','replacement','refer','admission','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { afib_initial, afib_followup, anticoag_clinic, vt_eval, device_check }; }
module.exports = { funcs, ValidationError };