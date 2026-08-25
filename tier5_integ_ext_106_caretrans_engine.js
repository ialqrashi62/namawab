'use strict';
// TIER5_INTEG_EXT-106: Care Transitions - handoff + transfer + discharge planning
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['I_Pass_the_Baton', 'Joint_Commission_Transition_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function ipass_handoff(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.location, 'location'); // ER | floor | ICU | OR
  ensureStr(req.situation, 'situation');
  ensureStr(req.background, 'background');
  ensureStr(req.assessment, 'assessment');
  ensureStr(req.recommendation, 'recommendation');
  ensureStr(req.synthesis, 'synthesis');

  return {
    handoff: {
      I: { patient_id: req.patient_id, location: req.location },
      S: req.situation,
      B: req.background,
      A: req.assessment,
      R: req.recommendation,
      S_synthesis: req.synthesis,
      read_back_required: true,
    },
    completion_checklist: ['patient_id_verified', 'allergies_reviewed', 'code_status_reviewed', 'medications_reviewed', 'pending_results_reviewed'],
    citations: CITATIONS,
  };
}

function transfer_summary(req) {
  ensureStr(req.discharge_diagnosis, 'discharge_diagnosis');
  ensureStr(req.facility_to, 'facility_to');
  ensureBool(req.medications_reconciled, 'medications_reconciled');
  ensureBool(req.follow_up_appointment, 'follow_up_appointment');
  ensureBool(req.pending_results, 'pending_results');
  ensureStr(req.diet_restrictions, 'diet_restrictions');
  ensureStr(req.activity_restrictions, 'activity_restrictions');

  const complete = req.medications_reconciled && req.follow_up_appointment && !req.pending_results;
  const transitions_of_care_checklist = {
    med_rec: req.medications_reconciled,
    follow_up: req.follow_up_appointment,
    pending_results_handled: !req.pending_results,
    diet: req.diet_restrictions ? 'documented' : 'missing',
    activity: req.activity_restrictions ? 'documented' : 'missing',
    receiving_facility: req.facility_to,
  };
  return {
    summary: {
      discharge_diagnosis: req.discharge_diagnosis,
      facility_to: req.facility_to,
      transitions_of_care_checklist,
      complete,
    },
    citations: CITATIONS,
  };
}

module.exports = { ipass_handoff, transfer_summary, CITATIONS, ValidationError };