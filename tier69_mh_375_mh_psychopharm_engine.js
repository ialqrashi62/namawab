// filepath: tier69_mh_375_mh_psychopharm_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psychopharm_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.dx, 'dx', ['mdd_mild','mdd_moderate','mdd_severe','gad','ocd','ptsd','bipolar_1','bipolar_2','schizophrenia','schizoaffective','psychosis_nos','panic','social_anxiety','borderline_pd','eating_disorder','addiction','insomnia','adhd','other']);
  ensureStr(req.med, 'med');
  ensureStr(req.start_date, 'sd');
  ensureBool(req.washout_needed, 'wn');
  ensureNum(req.washout_period_days, 'wpd');
  ensureStr(req.titration_schedule, 'ts');
  ensureBool(req.allergy_reviewed, 'ar');
  ensureBool(req.consent_obtained, 'co');
  ensureStr(req.prescriber, 'pr');
  return { med: req.med };
}
function psychopharm_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['med_management','brief_med','annual_psych','refill','tele_med','quick_check','bridge_visit','urgent_med','intake','other']);
  ensureNum(req.phq9_score, 'p9');
  ensureNum(req.phq9_change, 'p9c');
  ensureStr(req.side_effects, 'se');
  ensureBool(req.med_change, 'mc');
  ensureBool(req.dose_change, 'dc');
  ensureStr(req.labs_required, 'lr');
  ensureNum(req.follow_up, 'fu');
  ensureStr(req.prescriber, 'pr');
  return { visit: req.visit_type };
}
function side_effect_monitor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.med, 'med');
  ensureStr(req.side_effects_reported, 'ser');
  ensureNum(req.weight_change_kg, 'wcg');
  ensureNum(req.fasting_glucose, 'fg');
  ensureEnum(req.lipids, 'lip', ['within_normal','mild_elevation','high_trig','high_chol','low_hdl','severe_dyslipidemia','pending','unknown']);
  ensureBool(req.akathisia, 'ak');
  ensureBool(req.td_observed, 'td');
  ensureEnum(req.action, 'act', ['dose_reduction','discontinue','switch','monitor','order_labs','refer_specialist','continue','add_med','hold','other']);
  ensureBool(req.provider_acknowledged, 'pa');
  return { med: req.med };
}
function med_adherence_counsel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.adherence_pct, 'ap');
  ensureStr(req.barriers, 'bar');
  ensureStr(req.strategy, 'str');
  ensureBool(req.family_support, 'fs');
  ensureBool(req.provider_reviewed, 'pr');
  ensureNum(req.next_counseling, 'nc');
  ensureStr(req.refill_date, 'rd');
  ensureNum(req.barriers_addressed, 'ba');
  return { adherence: req.adherence_pct };
}
function clozapine_clozaril(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.med, 'med');
  ensureNum(req.anc_value, 'av');
  ensureStr(req.anc_date, 'ad');
  ensureBool(req.wbc_reviewed, 'wbc');
  ensureBool(req.glucose_reviewed, 'gl');
  ensureBool(req.lipids_reviewed, 'li');
  ensureBool(req.registered_rems, 'rr');
  ensureEnum(req.regimen, 'reg', ['once_daily','twice_daily','three_times_daily','four_times_daily','loading_then_maintenance','one_time','titration','stable','maintenance','other']);
  ensureEnum(req.titration_phase, 'tp', ['initiation','titration','stable','maintenance','stable_6_months','rechallenge','other']);
  ensureNum(req.next_labs, 'nl');
  return { anc: req.anc_value };
}

function funcs() { return { psychopharm_initial, psychopharm_followup, side_effect_monitor, med_adherence_counsel, clozapine_clozaril }; }
module.exports = { funcs, ValidationError };