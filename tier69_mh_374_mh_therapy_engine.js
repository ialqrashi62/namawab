// filepath: tier69_mh_374_mh_therapy_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function individual_therapy_progress(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.session_number, 'sn');
  ensureEnum(req.modality, 'mod', ['cbt','dbt','act','emdr','psychodynamic','interpersonal','supportive','somatic_experiencing','metacognitive','schema','horticultural','narrative','interpersonal_psychotherapy','other']);
  ensureBool(req.homework_completed, 'hw');
  ensureStr(req.session_focus, 'sf');
  ensureStr(req.progress_note, 'pn');
  ensureBool(req.risk_assessed, 'ra');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','imminent','chronic_mild','remission']);
  ensureNum(req.next_session, 'ns');
  return { session: req.session_number };
}
function group_therapy_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.group_id, 'gid');
  ensureStr(req.session_topic, 'st');
  ensureNum(req.attendance, 'att');
  ensureEnum(req.participation, 'par', ['high','moderate','low','absent','passive','observational','active','not_present','new_to_group','disengaged']);
  ensureEnum(req.group_cohesion, 'gc', ['strong','adequate','developing','weak','disrupted','unknown']);
  ensureBool(req.homework_reviewed, 'hr');
  ensureBool(req.member_support_offered, 'mso');
  ensureStr(req.leader, 'lead');
  ensureNum(req.next_session, 'ns');
  return { group: req.group_id };
}
function family_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.session_number, 'sn');
  ensureStr(req.participants, 'parts');
  ensureEnum(req.modality, 'mod', ['structural_family','strategic_family','bowen','systemic','narrative_family','cbt_family','functional_family','other']);
  ensureStr(req.conflicts_addressed, 'ca');
  ensureStr(req.homework, 'hw');
  ensureEnum(req.progress, 'prog', ['excellent','moderate','minimal','no_change','worsening','regressing','stalled','discharged','ongoing','closed']);
  ensureNum(req.next_session, 'ns');
  ensureStr(req.therapist, 'th');
  return { progress: req.progress };
}
function floor_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.unit, 'unit');
  ensureNum(req.group_size, 'gs');
  ensureEnum(req.session_type, 'st', ['process','psychoeducation','skills','morning_goal','community_meeting','rap','relaxation','other']);
  ensureNum(req.safety_incidents, 'si');
  ensureEnum(req.engagement, 'eng', ['active','passive','withdrawn','disruptive','asleep','absent','selective','minimal','high','moderate','low']);
  ensureBool(req.discharge_planning, 'dp');
  ensureStr(req.therapist, 'th');
  ensureBool(req.documentation_complete, 'dc');
  return { unit: req.unit };
}
function tele_psych_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.platform, 'plat', ['doxy','simplepractice','zoom_healthcare','institutional_platform','teladoc','vidyo','facetime','teams','other']);
  ensureNum(req.session_min, 'sm');
  ensureNum(req.phq9_score, 'p9');
  ensureStr(req.medication_side_effects, 'mse');
  ensureBool(req.suicidal_ideation, 'si');
  ensureBool(req.medication_change, 'mc');
  ensureNum(req.next_session, 'ns');
  ensureBool(req.platform_issues, 'pi');
  return { p9: req.phq9_score };
}

function funcs() { return { individual_therapy_progress, group_therapy_session, family_therapy, floor_therapy, tele_psych_followup }; }
module.exports = { funcs, ValidationError };