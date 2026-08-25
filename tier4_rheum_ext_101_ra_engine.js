'use strict';
// TIER4_RHEUM_EXT-101 Rheumatoid Arthritis
const CITATIONS = ['ACR_EULAR_RA_2010','ACR_RA_2021_Management'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function acrEularClassification(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const joint_involvement_score = ensureNumber(input.joint_involvement_score || 0, 'joint_involvement_score');
  const serology_score = ensureNumber(input.serology_score || 0, 'serology_score');
  const acute_phase_score = ensureNumber(input.acute_phase_score || 0, 'acute_phase_score');
  const duration_score = ensureNumber(input.duration_score || 0, 'duration_score');
  const total = joint_involvement_score + serology_score + acute_phase_score + duration_score;
  const classified = total >= 6;
  return { joint_involvement_score, serology_score, acute_phase_score, duration_score, total, classified, citations: CITATIONS };
}

function das28Score(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const tender_joints_28 = ensureNumber(input.tender_joints_28, 'tender_joints_28');
  const swollen_joints_28 = ensureNumber(input.swollen_joints_28, 'swollen_joints_28');
  const esr = ensureNumber(input.esr, 'esr');
  const patient_global = ensureNumber(input.patient_global, 'patient_global');
  const das28 = (0.56 * Math.sqrt(tender_joints_28)) + (0.28 * Math.sqrt(swollen_joints_28)) + (0.70 * Math.log(esr)) + (0.014 * patient_global);
  let activity = 'remission';
  if (das28 >= 5.1) activity = 'high_disease_activity';
  else if (das28 >= 3.2) activity = 'moderate_disease_activity';
  else if (das28 >= 2.6) activity = 'low_disease_activity';
  return { tender_joints_28, swollen_joints_28, esr, patient_global, das28: parseFloat(das28.toFixed(2)), activity, citations: CITATIONS };
}

module.exports = { acrEularClassification, das28Score, CITATIONS, ValidationError };