// tier314_emu_1495_engine.js — Epilepsy Monitoring Unit (EMU)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function t314_e1_seizure_event_log(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['focal_aware','focal_impaired','focal_bilateral','generalized_absence','generalized_tonic_clonic','unknown']);
  ensureNum(req.duration_sec, 'du'); ensureEnum(req.lateralizing_signs, 'lz', ['none','left','right','bilateral','NA']);
  if (req.duration_sec > 300) return { event_id: `sz_${Date.now()}`, status: 'STATUS_EPILEPTICUS_PROTOCOL', benzodiazepine_now: true };
  return { event_id: `sz_${Date.now()}`, type: req.type, duration_sec: req.duration_sec, lateralizing_signs: req.lateralizing_signs, logged_at: new Date().toISOString() };
}

function t314_e2_emu_admission_plan(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.goal, 'gl', ['localization','syndrome_classify','med_taper_only']); ensureBool(req.surgery_candidate_workup, 'sx');
  const days = req.goal === 'localization' ? 5 : 3;
  return { planned_stay_days: days, video_eeg_continuous: true, med_taper: req.goal !== 'med_taper_only' ? 'cautious_AED_reduction_day2' : 'per_protocol', safety: 'bed_seizure_pads_o2_nursing_1:1_during_events' };
}

function t314_e3_localization_summary(req) {
  ensureStr(req.tenant_id, 'tid');
  if (!Array.isArray(req.events) || req.events.length === 0) throw new ValidationError('events[] required', 'events');
  const lat = req.events.map(e => e.lateralizing_signs).filter(x => x && x !== 'none' && x !== 'NA' && x !== 'bilateral');
  const counts = lat.reduce((a, x) => (a[x] = (a[x] || 0) + 1, a), {});
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { events_total: req.events.length, lateralized_events: lat.length,
    dominant_onset_side: dominant ? dominant[0] : 'non_lateralized',
    concordance_pct: Math.round(lat.length / req.events.length * 100),
    suggestion: dominant ? `evaluate_${dominant[0]}_onset_further_(MRI_PET_SPECT)` : 'correlate_with_eeg_mdt' };
}

function t314_e4_medication_taper_log(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid'); ensureStr(req.aed_name, 'aed');
  ensureNum(req.dose_pct_remaining, 'dp'); ensureBool.req_check = undefined;
  if (req.dose_pct_remaining < 0 || req.dose_pct_remaining > 100) throw new ValidationError('dose pct must be 0-100', 'dp');
  return { aed: req.aed_name, dose_pct_remaining: req.dose_pct_remaining, caution: req.dose_pct_remaining <= 25 ? 'high_rescue_risk_watch' : 'continue_taper' };
}

function t314_e5_disposition_after_emu(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.outcome, 'oc', ['surgery_candidate','vns_candidate','med_change_only','non_epileptic_events','inconclusive']);
  const map = { surgery_candidate:'refer_epilepsy_surgery_MDT', vns_candidate:'refer_neuromodulation',
    med_change_only:'outpatient_neuro_followup', non_epileptic_events:'refer_psychogenic_protocol', inconclusive:'readmit_with_longer_monitoring' };
  return { outcome: req.outcome, next_step: map[req.outcome] };
}

function funcs() { return { t314_e1_seizure_event_log, t314_e2_emu_admission_plan, t314_e3_localization_summary, t314_e4_medication_taper_log, t314_e5_disposition_after_emu }; }
module.exports = { funcs, ValidationError };
