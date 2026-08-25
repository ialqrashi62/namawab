// filepath: tier5_psych_ext_105_ptsd_engine.js
// TIER5_PSYCH_EXT-105: Trauma/PTSD (CPT, PE, EMDR, crisis, dissociative, comorbid)
'use strict';

const CITATIONS = [
  'VA_DOD_PTSD_2023',
  'Resick_CPT_2017',
  'Foa_Prolonged_Exposure_2020',
  'EMDR_Shapiro_2017',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function ptsd_severity(req) {
  ensureNumber(req.pcl5_total, 'pcl5_total');
  ensureNumber(req.weeks_since_index_event, 'weeks_since_index_event');
  ensureStr(req.index_event_type, 'index_event_type');
  ensureEnum(req.index_event_type, 'index_event_type', ['combat','rape','accident','bereavement','disaster','childhood']);
  ensureBool(req.single_or_repeated, 'single_or_repeated');

  let severity;
  if (req.pcl5_total >= 50) severity = 'severe_ptsd';
  else if (req.pcl5_total >= 33) severity = 'moderate_ptsd';
  else severity = 'sub_threshold';

  if (req.index_event_type === 'childhood' || req.single_or_repeated) severity = 'complex_ptsd_consider';

  let primary_treatment;
  if (req.weeks_since_index_event <= 4) primary_treatment = 'watchful_waiting_brief_trauma_informed_care';
  else primary_treatment = 'trauma_focused_psychotherapy_cpt_pe_or_emdr_firstline';

  return { pcl5_total: req.pcl5_total, severity, index_event_type: req.index_event_type, primary_treatment, citation: CITATIONS[0] };
}

function cpt_protocol(req) {
  ensureNumber(req.sessions_attended, 'sessions_attended');
  ensureNumber(req.cpt_sessions_target, 'cpt_sessions_target');
  ensureBool(req.told_my_story_done, 'told_my_story_done');
  ensureBool(req.assigned_readings, 'assigned_readings');
  ensureBool(req.assigned_writings, 'assigned_writings');

  if (req.told_my_story_done) {
    const compliance_pct = (req.sessions_attended / Math.max(1, req.cpt_sessions_target)) * 100;
    return {
      phase: 'phase_3_integration',
      session_progress: `${req.sessions_attended}/${req.cpt_sessions_target}`,
      compliance_pct: Math.round(compliance_pct * 10) / 10,
      advice: ['create_meant_to_be_meaning_pieces','identify_core_belief_distortions','add_to_practice_session_with_buddy'],
      citation: CITATIONS[1],
    };
  }
  if (req.assigned_writings) {
    return { phase: 'phase_2_2_assigning_writings', session_progress: req.sessions_attended, advice: ['complete_1st_2nd_reading_to_dr_in_session_writings','complete_3rd_4th_writings','view_memorial_done'] };
  }
  if (req.assigned_readings) {
    return { phase: 'phase_2_1_assigning_readings', session_progress: req.sessions_attended, advice: ['read_1st_2nd_reading_to_dr_in_session','complete_3rd_4th_readings','view_memorial_assignments_overview'] };
  }
  return { phase: 'phase_1_psychoeducation_and_staying_still', session_progress: req.sessions_attended, advice: ['begin_psychoeducation','create_stepping_into_stillness'] };
}

function prolonged_exposure(req) {
  ensureNumber(req.imaginal_session_min, 'imaginal_session_min');
  ensureNumber(req.in_vivo_count, 'in_vivo_count');
  ensureNumber(req.days_unattended, 'days_unattended');
  ensureStr(req.sud_score_change, 'sud_score_change'); // rising_or_falling|stable|increasing_then_falling
  ensureEnum(req.sud_score_change, 'sud_score_change', ['rising_or_falling','stable','increasing_then_falling','unknown']);

  let signal;
  if (req.days_unattended < 8 && req.sud_score_change === 'increasing_then_falling') signal = 'on_track_typical_curve';
  else if (req.days_unattended >= 8 && req.sud_score_change === 'stable') signal = 'review_sud_trend_add_dual_attention_and_recheck';
  else if (req.sud_score_change === 'rising_or_falling') signal = 'possible_emotional_processing_review_with_therapist';
  else signal = 'continue_with_curriculum_check_after_8_sessions';

  return {
    imaginal_session_min: req.imaginal_session_min,
    in_vivo_count: req.in_vivo_count,
    days_unattended: req.days_unattended,
    sud_curve_signal: signal,
    citation: CITATIONS[2],
  };
}

function crisis_response(req) {
  ensureNumber(req.pcl5_total, 'pcl5_total');
  ensureBool(req.dissociation_present, 'dissociation_present');
  ensureBool(req.active_suicidal_ideation, 'active_suicidal_ideation');
  ensureBool(req.flashbacks_present, 'flashbacks_present');
  ensureNumber(req.substance_use, 'substance_use'); // 0..3

  let priority;
  if (req.active_suicidal_ideation) priority = 'P0_suicide_risk_immediate_psych_consult';
  else if (req.substance_use >= 2 || req.dissociation_present) priority = 'P1_urgent_ptsd_mh_clinic_within_48_hours';
  else if (req.flashbacks_present) priority = 'P2_within_2_weeks';
  else priority = 'P3_routine';
  return { priority, dissociation_present: req.dissociation_present, flashbacks_present: req.flashbacks_present, citation: CITATIONS[3] };
}

function dissociative_screening(req) {
  ensureNumber(req.d_score, 'd_score');
  ensureNumber(req.amplitude_scale_total, 'amplitude_scale_total');
  ensureBool(req.loss_of_time_unexplained, 'loss_of_time_unexplained');

  let score;
  if (req.loss_of_time_unexplained) score = 60;
  else score = Math.min(60, req.d_score * 0.6 + req.amplitude_scale_total * 0.4);

  let category;
  if (score >= 35) category = 'high_dissociation_refer_eval_for_did_or_ddnos';
  else if (score >= 20) category = 'moderate_dissociation_phase_oriented_treatment';
  else category = 'low_dissociation_trauma_focused_therapy_sufficient';

  return { score: Math.round(score * 10) / 10, category, citation: CITATIONS[3] };
}

function funcs() {
  return { ptsd_severity, cpt_protocol, prolonged_exposure, crisis_response, dissociative_screening };
}

module.exports = { funcs, CITATIONS, ValidationError };
