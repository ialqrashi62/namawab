// filepath: tier72_er_392_er_dispos_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ed_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.disposition_type, 'dt', ['discharge','admit','transfer','observe','ama','expired','elopement','against_advice','home_with_services','transfer_to_higher_level','step_down','other']);
  ensureEnum(req.discharge_status, 'ds', ['home','home_with_services','home_with_caregiver','home_with_home_health','work','school','shelter','street','snf','rehab','group_home','other','hospice_home','unknown']);
  ensureBool(req.pain_controlled, 'pc');
  ensureBool(req.ambulation_adequate, 'aa');
  ensureBool(req.tolerating_oral, 'to');
  ensureBool(req.instructions_understand, 'iu');
  ensureNum(req.follow_up_due, 'fud');
  ensureBool(req.prescriptions_given, 'pg');
  ensureBool(req.ride_home_arranged, 'rha');
  ensureStr(req.discharge_provider, 'dp');
  ensureStr(req.disposition_time, 'dt2');
  return { dt: req.disposition_type };
}
function ed_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.admission_status, 'as', ['admit','clearly_admit','borderline_admit','choice_admit','other','pending']);
  ensureEnum(req.admission_unit, 'au', ['med_surg_floor','telemetry','micu','sicu','nicu','picu','ldrp','obs_unit','cdu','psych_unit','trauma_bay','rehab','ltac','other']);
  ensureBool(req.inpatient_bed_assigned, 'iba');
  ensureBool(req.h_p_completed, 'hpc');
  ensureStr(req.primary_team, 'pt');
  ensureStr(req.consults_ordered, 'cor');
  ensureBool(req.nursing_handoff_complete, 'nhc');
  ensureBool(req.medications_reconciled, 'mr');
  ensureStr(req.discharge_time, 'dt');
  ensureStr(req.admission_provider, 'ap');
  return { as: req.admission_status };
}
function ed_transfer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transfer_id, 'tid');
  ensureStr(req.transfer_to_hospital, 'tth');
  ensureEnum(req.transfer_reason, 'tr', ['higher_level_care','specialty_consult','capacity','specialty_not_available','patient_request','insurance','other','mhs_pediatric','mhs_trauma','mhs_neuro']);
  ensureEnum(req.transfer_mode, 'tm', ['als_ambulance','bls_ambulance','helicopter','fixed_wing','private_vehicle','critical_care_transport','other']);
  ensureBool(req.records_sent, 'rs');
  ensureBool(req.medications_completed, 'mc');
  ensureBool(req.family_notified, 'fn');
  ensureBool(req.consent_for_transfer, 'ctf');
  ensureStr(req.receiving_provider, 'rp');
  ensureNum(req.estimated_arrival_min, 'eam');
  ensureStr(req.transfer_documented_by, 'tdb');
  return { tid: req.transfer_id };
}
function ed_observation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.observation_status, 'os', ['observation','extended_observation','pending_admission','pending_discharge','observation_continue','observation_end','observation_to_admit','observation_to_discharge','observation_to_transfer','observation_other']);
  ensureEnum(req.observation_unit, 'ou', ['ed_obs_5','ed_obs_3','ed_obs_4','ed_obs_1','ed_obs_2','cdu','observation_step_down','extended_obs','short_stay_unit','other']);
  ensureStr(req.observation_plan, 'op');
  ensureNum(req.observation_plan_duration_hours, 'opdh');
  ensureStr(req.observation_diagnosis, 'odx');
  ensureBool(req.discharge_likely, 'dl');
  ensureBool(req.medications_administered, 'ma');
  ensureEnum(req.monitoring, 'mon', ['q4h_vitals','q6h_vitals','q8h_vitals','continuous_telemetry','continuous_spo2','intermittent','n_a','other']);
  ensureStr(req.observation_provider, 'op2');
  ensureNum(req.review_due, 'rd');
  return { os: req.observation_status };
}
function ed_left_ama(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ama_status, 'as', ['left_against_medical_advice','left_without_being_seen','left_before_disposition','left_before_treatment','eloped','other']);
  ensureEnum(req.decision_capacity, 'dc', ['present','absent','fluctuating','uncertain','deferred','unknown']);
  ensureBool(req.ama_discussion_documented, 'add');
  ensureBool(req.risks_benefits_explained, 'rbe');
  ensureBool(req.witness_present, 'wp');
  ensureBool(req.ama_form_signed, 'afs');
  ensureBool(req.risk_medically_incapacitating_event, 'rmie');
  ensureBool(req.follow_up_plan_disclosed, 'fupd');
  ensureNum(req.primary_care_follow_up, 'pcf');
  ensureBool(req.documentation_complete, 'dc2');
  ensureStr(req.provider, 'pr');
  return { as: req.ama_status };
}

function funcs() { return { ed_discharge, ed_admission, ed_transfer, ed_observation, ed_left_ama }; }
module.exports = { funcs, ValidationError };