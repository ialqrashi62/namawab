'use strict';
// TIER5_INTEG_EXT-105: Care Plan generation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['Care_Plan_2020', 'AHRQ_Chronic_Care'];

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

function generate(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.diagnosis, 'diagnosis');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.heart_failure, 'heart_failure');
  ensureBool(req.copd, 'copd');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.pregnant, 'pregnant');

  const goals = [];
  const interventions = [];
  const follow_ups = [];
  if (req.diabetes) {
    goals.push({ id: 'g1', description: 'Maintain HbA1c below 7%' });
    interventions.push({ id: 'i1', description: 'Continue metformin, consider SGLT2 if CV risk' });
    follow_ups.push({ id: 'f1', description: 'HbA1c every 3-6 months', due_months: 3 });
  }
  if (req.heart_failure) {
    goals.push({ id: 'g2', description: 'Maintain euvolemia and improve LVEF' });
    interventions.push({ id: 'i2', description: 'Quadruple therapy: ARNI, beta-blocker, MRA, SGLT2' });
    follow_ups.push({ id: 'f2', description: 'Echo q3 months', due_months: 3 });
  }
  if (req.copd) {
    goals.push({ id: 'g3', description: 'Reduce exacerbations' });
    interventions.push({ id: 'i3', description: 'LABA/LAMA inhaler, smoking cessation' });
    follow_ups.push({ id: 'f3', description: 'PFT q12 months', due_months: 12 });
  }
  if (req.smoker) interventions.push({ id: 'i4', description: 'Smoking cessation counseling, NRT or varenicline' });
  if (req.pregnant) {
    interventions.push({ id: 'i5', description: 'Avoid teratogenic medications' });
    follow_ups.push({ id: 'f5', description: 'Antenatal visits monthly', due_months: 1 });
  }
  return {
    care_plan: {
      patient_age: req.age,
      goals,
      interventions,
      follow_ups,
    },
    citations: CITATIONS,
  };
}

function revise(req) {
  ensureStr(req.reason, 'reason'); // acute_event | new_diagnosis | worsening_condition | patient_request | side_effect
  ensureStr(req.modified_goal, 'modified_goal');
  ensureBool(req.shared_decision, 'shared_decision');

  return {
    revised_goal: req.modified_goal,
    revision_reason: req.reason,
    patient_involvement: req.shared_decision ? 'documented_patient_preferences' : 'clinician_initiated',
    requires_review: req.shared_decision ? false : true,
    citations: CITATIONS,
  };
}

module.exports = { generate, revise, CITATIONS, ValidationError };