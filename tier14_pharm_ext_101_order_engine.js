// filepath: tier14_pharm_ext_101_order_engine.js
// TIER14_PHARM_EXT-101: Medication order (prescribe, dispense, administer)
'use strict';

const CITATIONS = ['WHO_2024','FDA_PRESCRIPTION_2024','ASHP_GUIDELINES_2024','SFBFC_SAUDI'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pharm_prescribe(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureEnum(req.route, 'route', ['PO','IV','IM','SC','SL','PR','PO_per_ng','Topical','Inhaled','Ophthalmic','Otic','Nasal','Transdermal','Other']);
  ensureEnum(req.frequency, 'frequency', ['QD','BID','TID','QID','Q4H','Q6H','Q8H','Q12H','PRN','QHS','QAM','QPM','Continuous','Other']);
  ensureNumber(req.duration_days, 'duration_days');
  ensureEnum(req.priority, 'priority', ['STAT','Urgent','Routine','PRN','Discharge']);
  ensureBool(req.allergy_checked, 'allergy_checked');
  ensureBool(req.drug_interaction_checked, 'drug_interaction_checked');

  let status;
  if (!req.allergy_checked) status = 'allergy_check_required_blocking';
  else if (!req.drug_interaction_checked) status = 'interaction_check_required';
  else if (req.dose_mg <= 0) status = 'invalid_dose';
  else if (req.route === 'IV' && req.frequency === 'PRN') status = 'iv_prn_unusual_review';
  else if (req.duration_days > 365) status = 'over_1y_review_protocol';
  else status = 'prescribed';
  return { status, med: req.medication_id, dose: req.dose_mg, route: req.route };
}

function pharm_dispense(req) {
  ensureStr(req.order_id, 'order_id');
  ensureStr(req.pharmacy_id, 'pharmacy_id');
  ensureEnum(req.dispense_type, 'dispense_type', ['Initial','Refill','Partial','Emergency','Discharge','Stock','Compounded','Unit_dose','Multi_dose']);
  ensureNumber(req.quantity_dispensed, 'quantity_dispensed');
  ensureEnum(req.unit, 'unit', ['Tablet','Capsule','mL','mg','g','Vial','Ampule','Patch','Dose','Syringe','Bag','Tube','Suppository','Drop','Spoon','Pump','Other']);
  ensureNumber(req.days_supply, 'days_supply');
  ensureBool(req.patient_counseled, 'patient_counseled');
  ensureBool(req.controlled_substance_logged, 'controlled_substance_logged');

  let status;
  if (!req.patient_counseled) status = 'patient_counseling_required';
  else if (req.days_supply > 90 && req.dispense_type === 'Refill') status = 'days_supply_high_review';
  else if (req.quantity_dispensed <= 0) status = 'invalid_quantity';
  else if (!req.controlled_substance_logged && req.medication_class?.includes('controlled')) status = 'controlled_log_required';
  else status = 'dispensed';
  return { status, quantity: req.quantity_dispensed, type: req.dispense_type };
}

function pharm_administer(req) {
  ensureStr(req.order_id, 'order_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.route_given, 'route_given', ['PO','IV','IM','SC','SL','PR','Topical','Inhaled','Ophthalmic','Otic','Nasal','Transdermal','Other','Refused','Held','NotED_given']);
  ensureNumber(req.dose_given, 'dose_given');
  ensureStr(req.given_by, 'given_by');
  ensureEnum(req.verification, 'verification', ['Patient_ID_Band','Two_identifier','Barcode_BCMA','Witness_present','Patient_self_report','Verbal','None','Other']);
  ensureBool(req.patient_refused, 'patient_refused');
  ensureBool(req.reaction_observed, 'reaction_observed');

  let status;
  if (req.patient_refused) status = 'patient_refused_documented';
  else if (req.verification === 'None') status = 'verification_required_blocking_bcma';
  else if (req.verification === 'Witness_present' && req.medication_class?.includes('high_alert')) status = 'high_alert_requires_two_RNs';
  else if (req.reaction_observed) status = 'reaction_documented_review';
  else if (req.route_given === 'Refused') status = 'not_administered';
  else status = 'administered';
  return { status, dose: req.dose_given, route: req.route_given };
}

function pharm_refill(req) {
  ensureStr(req.order_id, 'order_id');
  ensureNumber(req.refills_requested, 'refills_requested');
  ensureNumber(req.refills_remaining, 'refills_remaining');
  ensureEnum(req.request_source, 'request_source', ['Patient','Pharmacy','Provider','Auto','IVR','App','Other']);
  ensureBool(req.last_fill_within_30d, 'last_fill_within_30d');
  ensureBool(req.lab_review_required, 'lab_review_required');
  ensureBool(req.lab_review_current, 'lab_review_current');

  let status;
  if (req.refills_remaining <= 0) status = 'no_refills_remaining_provider_review';
  else if (req.refills_requested > req.refills_remaining) status = 'over_requested_cap_to_remaining';
  else if (req.lab_review_required && !req.lab_review_current) status = 'lab_review_overdue_review_drug_level';
  else if (!req.last_fill_within_30d) status = 'last_fill_old_review_adherence';
  else status = 'refill_authorized';
  return { status, requested: req.refills_requested, remaining: req.refills_remaining };
}

function pharm_discontinue(req) {
  ensureStr(req.order_id, 'order_id');
  ensureEnum(req.discontinue_reason, 'discontinue_reason', ['Completed','Allergy','Side_effect','No_response','Patient_request','Provider_decision','Duplicate','Drug_interaction','Inappropriate','Cost','Formulary_change','Other']);
  ensureStr(req.discontinued_by, 'discontinued_by');
  ensureBool(req.taper_required, 'taper_required');
  ensureBool(req.alternative_ordered, 'alternative_ordered');

  let status;
  if (req.discontinue_reason === 'Allergy' && !req.alternative_ordered) status = 'allergy_discontinue_alternative_recommended';
  else if (req.taper_required && !req.taper_instructions_documented) status = 'taper_required_instructions_documented';
  else if (req.discontinue_reason === 'Duplicate' && !req.alternative_ordered) status = 'duplicate_no_alternative_documented';
  else status = 'discontinued';
  return { status, reason: req.discontinue_reason };
}

function funcs() { return { pharm_prescribe, pharm_dispense, pharm_administer, pharm_refill, pharm_discontinue }; }
module.exports = { funcs, CITATIONS, ValidationError };