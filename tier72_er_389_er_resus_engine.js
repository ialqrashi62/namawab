// filepath: tier72_er_389_er_resus_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function code_blue_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.activation_time, 'at');
  ensureStr(req.location, 'loc');
  ensureBool(req.patient_collapsed, 'pc');
  ensureStr(req.responder, 'resp');
  ensureBool(req.cpr_initiated, 'ci');
  ensureEnum(req.rhythm_check, 'rc', ['vfib','pulseless_vt','asystole','pea','sinus','sinus_rhythm','afib','bradycardia','tachycardia','pulse_present','electrical_activity','ros','other']);
  ensureNum(req.shock_count, 'sc');
  ensureNum(req.epinephrine_doses, 'ed');
  ensureBool(req.rosc_achieved, 'ra');
  ensureStr(req.documented_by, 'db');
  return { at: req.activation_time };
}
function code_stemi_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.symptom_onset_min, 'som');
  ensureStr(req.ecg_st_changes, 'esc');
  ensureStr(req.first_medical_contact, 'fmc');
  ensureBool(req.cardiology_consulted, 'cc');
  ensureBool(req.cath_lab_activated, 'cla');
  ensureNum(req.door_to_balloon_min, 'dtbm');
  ensureStr(req.l_r_artery_stenosis, 'lras');
  ensureBool(req.stent_placed, 'sp');
  ensureNum(req.door_to_door_min, 'dtdm');
  ensureStr(req.documented_by, 'db');
  return { som: req.symptom_onset_min };
}
function code_stroke_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.last_known_well_min, 'lkwm');
  ensureNum(req.gcs, 'gcs');
  ensureNum(req.nihss_score, 'ns');
  ensureBool(req.ct_head_done, 'chd');
  ensureBool(req.no_hemorrhage, 'nh');
  ensureBool(req.tpa_considered, 'tpc');
  ensureBool(req.tpa_administered, 'tpa');
  ensureNum(req.door_to_needle_min, 'dtnm');
  ensureBool(req.stroke_team_activated, 'sta');
  ensureStr(req.documented_by, 'db');
  ensureStr(req.specialty, 'spec');
  return { ns: req.nihss_score };
}
function trauma_team_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mechanism, 'mech');
  ensureStr(req.significant_injury_signs, 'sis');
  ensureNum(req.gcs, 'gcs');
  ensureNum(req.sbp, 'sbp');
  ensureEnum(req.trauma_level, 'tl', ['level_1','level_2','level_3','level_4','level_5','alert','alert_2','alert_3','prealert','other']);
  ensureBool(req.team_responded, 'tr');
  ensureStr(req.resuscitation_bay, 'rb');
  ensureBool(req.massive_transfusion, 'mt');
  ensureStr(req.documented_by, 'db');
  ensureStr(req.activation_time, 'at');
  return { mech: req.mechanism };
}
function mass_casualty_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mci_event_id, 'mei');
  ensureEnum(req.triage_level, 'tl', ['red','yellow','green','black','expectant','triage_pending','triage_admin','other']);
  ensureStr(req.injury_type, 'it');
  ensureNum(req.patient_count_in_event, 'pcie');
  ensureStr(req.resources_requested, 'rr');
  ensureEnum(req.hospital_response, 'hr', ['partial','full','mobilizing','stand_down','staff_recalled','closed_inbound','diverting','inbound','other']);
  ensureEnum(req.mci_drill_or_real, 'dor', ['drill','real','tabletop','functional_drill','no_response','unknown','other']);
  ensureBool(req.incident_command_active, 'ica');
  ensureBool(req.documentation_complete, 'dc');
  return { mei: req.mci_event_id };
}

function funcs() { return { code_blue_activation, code_stemi_activation, code_stroke_activation, trauma_team_activation, mass_casualty_activation }; }
module.exports = { funcs, ValidationError };