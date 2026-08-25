// filepath: tier62_spec_care_ext_344_sp_pall_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function palliative_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reason, 'reason');
  ensureEnum(req.symptom_burden, 'sb', ['low','moderate','high','very_high','end_stage']);
  ensureEnum(req.prognosis, 'prog', ['days_to_weeks','weeks_to_months','months_to_year','years','uncertain']);
  ensureStr(req.goals, 'goals');
  ensureStr(req.support_system, 'ss');
  ensureStr(req.referral_source, 'rs');
  ensureBool(req.needs_hospice_eval, 'nhe');
  return { reason: req.reason };
}
function advance_directive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ad_type, 'at', ['living_will','durable_power_attorney','healthcare_proxy','dnr','dnr_with_dnar','most','polst','five_wishes']);
  ensureBool(req.completed, 'comp');
  ensureBool(req.durable_power_assigned, 'dpa');
  ensureStr(req.healthcare_proxy, 'hcp');
  ensureStr(req.witness, 'wit');
  ensureBool(req.copy_in_ehr, 'cie');
  ensureBool(req.reviewed_at_admission, 'raa');
  return { ad: req.ad_type };
}
function goals_of_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.discussion_type, 'dt', ['serious_illness','code_status','goals_of_care','family_meeting','advanced_care_planning','surrogate_decision_making']);
  ensureStr(req.patient_values, 'pv');
  ensureEnum(req.resuscitation_status, 'rstat', ['full_code','dnr_in_place','dnr_with_dnar','limited','comfort_only','to_be_determined']);
  ensureEnum(req.trial_period, 'tp', ['time_limited_trial','open_ended','limited_intervention','no_trial','n_a']);
  ensureBool(req.family_aligned, 'fa');
  ensureNum(req['follow_up'], 'fu');
  return { disc: req.discussion_type };
}
function comfort_care_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.symptom, 'sym', ['pain','dyspnea','nausea','agitation','anxiety','delirium','cough','secretions','seizures','constipation']);
  ensureStr(req.intervention, 'int');
  ensureNum(req.dose_mg, 'dose');
  ensureEnum(req.frequency, 'freq', ['q1h','q2h','q4h','q4h_prn','q6h','q6h_prn','q8h','q8h_prn','q12h','q12h_prn','prn','continuous','stat']);
  ensureStr(req.non_pharm, 'np');
  ensureBool(req.effectiveness_reviewed, 'er');
  ensureBool(req.nurse_acknowledged, 'na');
  return { symptom: req.symptom };
}
function end_of_life(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.phase, 'phase', ['deteriorating','actively_dying','imminent_death','death_declared','bereavement']);
  ensureStr(req.comfort_measures, 'cm');
  ensureBool(req.family_present, 'fp');
  ensureStr(req.spiritual_care, 'sc');
  ensureStr(req.legacy_work, 'lw');
  ensureBool(req.bereavement_follow_up, 'bfu');
  return { phase: req.phase };
}

function funcs() { return { palliative_intake, advance_directive, goals_of_care, comfort_care_order, end_of_life }; }
module.exports = { funcs, ValidationError };