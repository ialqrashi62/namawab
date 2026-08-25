// filepath: tier73_cardio_ext_385_cardio_chf_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chf_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intake_id, 'iid');
  ensureEnum(req.chf_type, 'ct', ['hfref','hfpef','hfmrEF','advanced','recovered','stable','recent_dx','post_partum','pregnancy_related','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.nyha_class, 'nc');
  ensureStr(req.etiologies, 'et');
  ensureStr(req.primary_care_physician, 'pcp');
  ensureStr(req.gdmt_initiated, 'gi');
  ensureBool(req.medication_tolerated, 'mt');
  ensureBool(req.education_provided, 'ed');
  ensureEnum(req.device_planned, 'dp', ['icd','crt_d','crt_d_crt','s_crt','none','monitor','loop_recorder','icd_crt','icd_subq','pending','other']);
  ensureNum(req.follow_up_plan, 'fup');
  return { type: req.chf_type };
}
function chf_medication_titration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chf_id, 'cid');
  ensureEnum(req.medication, 'med', ['entresto','sacubitril_valsartan','beta_bloker','mra','aldactone','spironolactone','eplerenone','sglt2','farxiga','jardiance','entresto_2','entresto_3','other']);
  ensureStr(req.current_dose, 'cd');
  ensureStr(req.target_dose, 'td');
  ensureStr(req.lab_values, 'lv');
  ensureEnum(req.titration_tolerance, 'tt', ['good','tolerated','intolerance','side_effect','orthostatic','hypotension','renal_dysfunction','hyperkalemia','contraindicated','deferred','other']);
  ensureNum(req.next_titration_due, 'ntd');
  ensureStr(req.patient_symptoms, 'ps');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_labs_due, 'nld');
  return { med: req.medication };
}
function chf_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chf_id, 'cid');
  ensureNum(req.follow_up_day, 'fud');
  ensureNum(req.weight_kg, 'wkg');
  ensureNum(req.weight_change_kg, 'wcg');
  ensureEnum(req.symptoms, 'sym', ['stable','improved','worsening','decompensating','no_change','worsening_significant','crt_indicated','hospitalization_required','mild_worsening','other']);
  ensureNum(req.nyha_class, 'nc');
  ensureEnum(req.med_changes, 'mc', ['none','entresto','beta_bloker','mra','sglt2','diuretic','metolazone','vasodilator','increase','decrease','hold','discontinue','other']);
  ensureBool(req.labs_reviewed, 'lr');
  ensureNum(req.patient_adherence_pct, 'pap');
  ensureNum(req.next_follow_up, 'nfu');
  ensureStr(req.provider, 'pr');
  return { fum: req.follow_up_day };
}
function chf_decompensation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureEnum(req.trigger, 'tr', ['medication_nonadherence','dietary_indiscretion','infection','arrhythmia','ischemia','progression','medication_change','fluid_overload','other','unknown']);
  ensureNum(req.weight_gain_kg, 'wgg');
  ensureEnum(req.dyspnea_severity, 'ds', ['mild','moderate','severe','at_rest','exertional','orthopnea','pnd','none','unknown','other']);
  ensureBool(req.edema_present, 'ep');
  ensureBool(req.hospitalized, 'hosp');
  ensureNum(req.length_of_stay_days, 'losd');
  ensureStr(req.interventions, 'int');
  ensureStr(req.plan, 'plan');
  ensureBool(req.caregiver_involvement, 'ci');
  ensureStr(req.provider, 'pr');
  return { event: req.event_id };
}
function chf_advanced_therapies(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.therapies_considered, 'tc', ['lvad','transplant','palliative','hospice','home_inotropes','none','advanced_dx','long_term_mcs','short_term_mcs','biventricular_support','other']);
  ensureEnum(req.transplant_evaluation_status, 'tes', ['not_started','in_progress','completed','listed','deferred','declined','deceased','too_well','other']);
  ensureBool(req.lvad_candidate, 'lvc');
  ensureBool(req.transplant_candidate, 'tc2');
  ensureBool(req.palliative_care_consult, 'pcc');
  ensureBool(req.advanced_directive_signed, 'ads');
  ensureBool(req.goals_of_care_documented, 'gocd');
  ensureNum(req.next_review, 'nr');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.decision_made_by, 'dmb', ['team','patient','family','multidisciplinary','urgent','scheduled','delayed','pending','other']);
  return { therapies: req.therapies_considered };
}

function funcs() { return { chf_intake, chf_medication_titration, chf_followup, chf_decompensation, chf_advanced_therapies }; }
module.exports = { funcs, ValidationError };