// filepath: tier37_neurology_ext_220_ms_engine.js
// TIER37_NEUROLOGY-220: Multiple sclerosis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ms_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.mri_lesion_count, 'mri_count');
  ensureEnum(req.oligoclonal_bands, 'ocb', ['positive','negative','pending','not_done','other']);
  ensureBool(req.evoked_potentials_abnormal, 'ep');
  ensureEnum(req.diagnosis, 'dx', ['cis','rrms','spms','ppms','prms','radiologically_isolated','other']);
  ensureNumber(req.duration_months, 'dur');
  let status;
  if (req.diagnosis === 'rrms' && req.mri_lesion_count >= 9 && req.oligoclonal_bands === 'positive') status = 'ms_2017_mcdonald_criteria_met';
  else if (req.diagnosis === 'cis' && req.mri_lesion_count >= 2) status = 'cis_high_risk_progression_start_dmt';
  else if (req.diagnosis === 'ppms') status = 'ppms_consider_ocrelizumab';
  else if (req.evoked_potentials_abnormal && req.mri_lesion_count >= 5) status = 'dissemination_space_time_review';
  else status = 'ms_diagnosis_review';
  return { status, dx: req.diagnosis };
}

function ms_disease_modifying(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.dmts, 'dmt', ['interferon_beta','glatiramer','dimethyl_fumarate','fingolimod','ocrelizumab','natalizumab','alemtuzumab','cladribine','teriflunomide','none','other']);
  ensureNumber(req.relapse_rate_baseline, 'rr_b');
  ensureNumber(req.relapse_rate_treatment, 'rr_t');
  ensureBool(req.monitoring_complete, 'mon');
  ensureBool(req.jc_virus_negative, 'jcv');
  let status;
  if (req.dmts === 'natalizumab' && !req.jc_virus_negative) status = 'natalizumab_jcv_positive_pml_risk';
  else if (req.relapse_rate_treatment >= req.relapse_rate_baseline) status = 'dmt_failure_consider_switch';
  else if (req.relapse_rate_treatment < req.relapse_rate_baseline) status = 'dmt_response_favorable';
  else if (!req.monitoring_complete) status = 'dmt_monitoring_required';
  else status = 'dmt_review_appropriate';
  return { status, d: req.dmts };
}

function ms_relapse(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.relapse_severity, 'sev', ['mild','moderate','severe','very_severe','other']);
  ensureEnum(req.symptoms, 'sym', ['optic_neuritis','sensory','motor','cerebellar','brainstem','sphincter','multiple','other']);
  ensureEnum(req.steroid_treatment, 'steroid', ['iv_methylprednisolone','oral_prednisone','none','other']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown']);
  ensureBool(req.rehabilitation, 'rehab');
  let status;
  if (req.relapse_severity === 'very_severe' && req.steroid_treatment === 'none') status = 'severe_relapse_iv_steroids_immediate';
  else if (req.symptoms === 'optic_neuritis' && req.steroid_treatment === 'oral_prednisone') status = 'optic_neuritis_iv_steroid_preferred';
  else if (req.rehabilitation === false && req.relapse_severity === 'severe') status = 'severe_relapse_rehab_indicated';
  else if (req.response === 'improving') status = 'ms_relapse_improving';
  else status = 'ms_relapse_review';
  return { status, s: req.symptoms };
}

function ms_progression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.edss_baseline, 'edss_b');
  ensureNumber(req.edss_current, 'edss_c');
  ensureEnum(req.disease_course, 'course', ['rrms','spms','ppms','prms','other']);
  ensureNumber(req.progression_years, 'yrs');
  ensureBool(req.mri_burden_high, 'mri');
  let status;
  if (req.disease_course === 'spms' && req.edss_current >= 6) status = 'spms_progression_no_relapse_rehab_focus';
  else if (req.disease_course === 'ppms' && req.edss_current >= 5) status = 'ppms_progression_independence_lost';
  else if (req.progression_years >= 10 && req.mri_burden_high) status = 'long_standing_high_burden_review_pmt';
  else if (req.edss_current < req.edss_baseline) status = 'edss_improved_review_measurement';
  else status = 'ms_progression_review';
  return { status, c: req.disease_course };
}

function ms_symptom_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.symptom, 'sym', ['spasticity','fatigue','pain','bladder','bowel','cognitive','depression','sleep','multiple','other']);
  ensureEnum(req.treatment, 'rx', ['baclofen','tizanidine','gabapentin','amantadine','modafinil','amitriptyline','oxybutynin','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','partial','poor','none','unknown']);
  ensureEnum(req.fatigue_management, 'fat', ['amantadine','modafinil','exercise','cognitive','none','other']);
  ensureBool(req.cognition_reviewed, 'cog');
  let status;
  if (req.response === 'poor' && req.treatment !== 'none') status = 'symptom_treatment_failure_review';
  else if (req.symptom === 'spasticity' && req.treatment === 'baclofen' && req.response === 'good') status = 'spasticity_baclofen_responding';
  else if (!req.cognition_reviewed) status = 'cognition_review_required_ms';
  else if (req.response === 'good' || req.response === 'excellent') status = 'ms_symptom_responding';
  else status = 'ms_symptom_review';
  return { status, s: req.symptom };
}

function funcs() { return { ms_diagnosis, ms_disease_modifying, ms_relapse, ms_progression, ms_symptom_management }; }
module.exports = { funcs, ValidationError };