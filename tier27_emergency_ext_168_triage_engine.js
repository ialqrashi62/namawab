// filepath: tier27_emergency_ext_168_triage_engine.js
// TIER27_EMERGENCY-168: ED triage (ESI), vitals, chief complaint
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function esi(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.dbp, 'dbp');
  ensureNumber(req.spo2, 'spo2');
  ensureNumber(req.rr, 'rr');
  ensureNumber(req.temp_c, 'temp');
  ensureNumber(req.pain_score, 'pain');
  ensureEnum(req.acuity, 'acuity', ['esi_1_resuscitation','esi_2_emergent','esi_3_urgent','esi_4_less_urgent','esi_5_non_urgent','unknown','other']);
  ensureBool(req.immediate_life_threat, 'life_threat');
  ensureBool(req.high_risk, 'high_risk');
  let status;
  if (req.spo2 < 88 || req.sbp < 90 || req.life_threat) status = 'life_threat_esi_1_immediate';
  else if (req.high_risk || req.pain_score >= 7 || req.acuity === 'esi_2_emergent') status = 'high_risk_esi_2_emergent';
  else if (req.acuity === 'esi_3_urgent') status = 'esi_3_urgent_review_within_30_min';
  else status = 'esi_assigned';
  return { status, esi: req.acuity };
}

function chief_complaint(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureEnum(req.complaint, 'complaint', ['chest_pain','dyspnea','abdominal_pain','headache','altered_mental','trauma','fever','weakness','syncope','bleeding','vomiting','diarrhea','allergic','psychiatric','obstetric','pediatric_fever','other']);
  ensureEnum(req.onset, 'onset', ['sudden','gradual','chronic','acute_on_chronic','unknown','other']);
  ensureNumber(req.duration_hours, 'duration');
  ensureBool(req.associated_trauma, 'trauma');
  ensureNumber(req.pain_score, 'pain');
  let status;
  if (req.complaint === 'chest_pain') status = 'chest_pain_workup_ecg_troponin';
  else if (req.complaint === 'stroke_like') status = 'stroke_workup_imaging_immediately';
  else if (req.complaint === 'altered_mental') status = 'altered_mental_glucose_imaging_labs';
  else if (req.associated_trauma) status = 'trauma_protocol_atls';
  else status = 'chief_complaint_documented';
  return { status, complaint: req.complaint };
}

function vitals_early_warning(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.rr, 'rr');
  ensureNumber(req.spo2, 'spo2');
  ensureNumber(req.temp_c, 'temp');
  ensureBool(req.consciousness_avpu, 'avpu');
  ensureEnum(req.ews_score, 'ews_score', ['0','1','2','3','4_5','6_7','over_7','unknown','other']);
  let status;
  if (req.ews_score === 'over_7' || req.ews_score === '6_7') status = 'high_ews_call_rapid_response';
  else if (req.ews_score === '4_5') status = 'moderate_ews_increase_monitoring';
  else if (req.hr > 130 || req.sbp < 90 || req.spo2 < 90) status = 'critical_vital_review_immediately';
  else status = 'vitals_ews_assessed';
  return { status, ews: req.ews_score };
}

function disposition(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureEnum(req.disposition, 'disposition', ['discharged','admitted_ward','admitted_icu','admitted_or','admitted_observation','transfer','ama_left','eloped','expired_in_ed','other']);
  ensureNumber(req.los_hours, 'los');
  ensureEnum(req.acuity, 'acuity', ['esi_1_resuscitation','esi_2_emergent','esi_3_urgent','esi_4_less_urgent','esi_5_non_urgent','unknown','other']);
  ensureBool(req.return_72h, 'return_72h');
  ensureBool(req.followup_arranged, 'followup');
  let status;
  if (req.disposition === 'expired_in_ed') status = 'mortality_review_documented';
  else if (req.disposition === 'ama_left' && req.acuity === 'esi_1_resuscitation') status = 'ama_high_acuity_capacity_review';
  else if (req.return_72h) status = 'return_within_72h_review_initial_assessment';
  else if (!req.followup_arranged && (req.disposition === 'discharged' || req.disposition === 'ama_left')) status = 'followup_education_required';
  else status = 'disposition_appropriate';
  return { status, d: req.disposition };
}

function chief_complaint_v2(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureEnum(req.complaint, 'complaint', ['chest_pain','dyspnea','abdominal_pain','headache','stroke_like','altered_mental','trauma','fever','weakness','syncope','bleeding','vomiting','diarrhea','allergic','psychiatric','obstetric','pediatric_fever','other']);
  ensureBool(req.focal_neuro_deficit, 'neuro_deficit');
  ensureNumber(req.glucose_mg_dl, 'glucose');
  ensureBool(req.meningismus, 'meningismus');
  let status;
  if (req.complaint === 'chest_pain') status = 'chest_pain_workup_ecg_troponin';
  else if (req.complaint === 'stroke_like' || req.focal_neuro_deficit) status = 'stroke_workup_imaging_immediately';
  else if (req.complaint === 'altered_mental') status = 'altered_mental_glucose_imaging_labs';
  else if (req.meningismus) status = 'meningismus_lp_empiric_abx';
  else if (req.glucose_mg_dl < 60) status = 'hypoglycemia_treat_reassess';
  else status = 'complaint_assessed';
  return { status, complaint: req.complaint };
}

const CITATIONS = { ESI_2024: 'ESI v4 2024', NEWS2_2024: 'NEWS2 2024', ATLS_2024: 'ATLS 10e 2024' };

function funcs() { return { esi, chief_complaint, vitals_early_warning, disposition, chief_complaint_v2 }; }
module.exports = { funcs, CITATIONS, ValidationError };