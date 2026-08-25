'use strict';
// TIER5_INTEG_EXT-101: CDS Hooks - decision support integration
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['HL7_CDS_Hooks_2_0', 'WHO_Digital_Health_2023'];

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

function hook_patient_view(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.context, 'context'); // in_clinic | inpatient | emergency
  ensureBool(req.allergies_present, 'allergies_present');
  ensureBool(req.problem_list_non_empty, 'problem_list_non_empty');
  ensureBool(req.medications_count_high, 'medications_count_high');
  ensureNumber(req.labs_count, 'labs_count');

  const cards = [];
  if (!req.allergies_present && req.context !== 'emergency') cards.push({ summary: 'No allergies documented', indicator: 'info', detail: 'Please confirm allergy status with patient', source: { label: 'Allergy Guard' } });
  if (!req.problem_list_non_empty) cards.push({ summary: 'Problem list is empty', indicator: 'warning', detail: 'Consider documenting active conditions', source: { label: 'Problem List Helper' } });
  if (req.medications_count_high) cards.push({ summary: 'Patient is on many medications', indicator: 'warning', detail: 'Consider medication review for polypharmacy', source: { label: 'Polypharmacy Alert' } });
  if (req.labs_count > 100) cards.push({ summary: 'Heavy lab utilization', indicator: 'info', detail: 'Consider appropriate test ordering', source: { label: 'Lab Stewardship' } });
  return {
    cards,
    cards_count: cards.length,
    service_id: 'nama.cds.patient.view',
    citations: CITATIONS,
  };
}

function hook_order_sign(req) {
  ensureStr(req.order_type, 'order_type'); // medication | lab | imaging | procedure
  ensureStr(req.medication_name, 'medication_name');
  ensureBool(req.allergy_to_med, 'allergy_to_med');
  ensureBool(req.duplicate_therapy, 'duplicate_therapy');
  ensureNumber(req.lab_cost_usd, 'lab_cost_usd');

  const cards = [];
  if (req.allergy_to_med) cards.push({ summary: 'Allergy to prescribed medication', indicator: 'critical', detail: 'Re-check allergy list before signing', source: { label: 'Allergy Cross-Check' } });
  if (req.duplicate_therapy) cards.push({ summary: 'Possible therapeutic duplication', indicator: 'warning', detail: 'Patient is already on similar class', source: { label: 'Duplicate Therapy Detector' } });
  if (req.order_type === 'lab' && req.lab_cost_usd > 500) cards.push({ summary: 'High-cost test ordered', indicator: 'info', detail: 'Consider cost-effective alternative', source: { label: 'Lab Cost Hint' } });
  return {
    cards,
    override: { allowed: req.allergy_to_med ? true : false, reason: req.allergy_to_med ? 'Please document reason for override' : null },
    service_id: 'nama.cds.order.sign',
    citations: CITATIONS,
  };
}

function hook_medication_prescribe(req) {
  ensureStr(req.medication, 'medication');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.age, 'age');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.other_qt_prolonging, 'other_qt_prolonging');

  const cards = [];
  if (req.egfr < 30) cards.push({ summary: 'Severe renal impairment', indicator: 'warning', detail: 'Adjust dose or avoid medication', source: { label: 'Renal Dose Advisor' } });
  if (req.pregnant) cards.push({ summary: 'Pregnancy alert', indicator: 'critical', detail: 'Check teratogenicity before signing', source: { label: 'Pregnancy Alert' } });
  if (req.other_qt_prolonging) cards.push({ summary: 'Concurrent QT-prolonging medication', indicator: 'warning', detail: 'Monitor ECG', source: { label: 'QT Alert' } });
  return {
    cards,
    suggested_dose: req.egfr < 30 ? `${Math.max(0, Math.round(req.dose_mg * 0.25))}mg_q12h_or_24h` : `${req.dose_mg}mg_per_label`,
    service_id: 'nama.cds.medication.prescribe',
    citations: CITATIONS,
  };
}

module.exports = { hook_patient_view, hook_order_sign, hook_medication_prescribe, CITATIONS, ValidationError };