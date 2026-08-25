// filepath: tier14_pharm_ext_105_inventory_engine.js
// TIER14_PHARM_EXT-105: Pharmacy inventory (stock, par levels, expiration, recall)
'use strict';

const CITATIONS = ['ASHP_INVENTORY_2024','FDA_DSCSA_2023','SFDA_TRACEABILITY_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function stock_receive(req) {
  ensureStr(req.lot_id, 'lot_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureNumber(req.quantity_received, 'quantity_received');
  ensureStr(req.manufacturer, 'manufacturer');
  ensureStr(req.expiration_date, 'expiration_date');
  ensureStr(req.ndc, 'ndc');
  ensureNumber(req.days_to_expiration, 'days_to_expiration');
  ensureBool(req.refrigerated_storage, 'refrigerated_storage');
  ensureBool(req.chain_of_custody_verified, 'chain_of_custody_verified');

  let status;
  if (!req.chain_of_custody_verified) status = 'chain_of_custody_required_blocking_dscsa';
  else if (req.days_to_expiration < 90) status = 'short_dated_review_donation_or_return';
  else if (req.days_to_expiration < 180) status = 'near_expiration_review_allocation';
  else if (!req.ndc) status = 'ndc_required_for_receipt';
  else status = 'received_in_stock';
  return { status, lot: req.lot_id, qty: req.quantity_received };
}

function par_level_check(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureNumber(req.current_stock, 'current_stock');
  ensureNumber(req.min_par, 'min_par');
  ensureNumber(req.max_par, 'max_par');
  ensureNumber(req.burn_rate_per_day, 'burn_rate_per_day');
  ensureNumber(req.lead_time_days, 'lead_time_days');
  ensureEnum(req.class_name, 'class_name', ['critical','essential','important','routine','obsolete','other']);

  const safety_stock = req.burn_rate_per_day * req.lead_time_days;
  const reorder_point = req.min_par + safety_stock;
  let status;
  if (req.current_stock <= 0) status = 'stockout_emergency_order';
  else if (req.current_stock < reorder_point) status = 'below_reorder_point_order_now';
  else if (req.current_stock >= req.max_par) status = 'overstocked_excess_review';
  else if (req.burn_rate_per_day === 0 && req.class_name === 'critical') status = 'critical_no_burn_stale_inventory_review';
  else status = 'within_par_levels';
  return { status, reorder_point: Math.round(reorder_point) };
}

function expiration_check(req) {
  ensureStr(req.lot_id, 'lot_id');
  ensureNumber(req.days_to_expiration, 'days_to_expiration');
  ensureNumber(req.quantity_remaining, 'quantity_remaining');
  ensureEnum(req.storage_condition, 'storage_condition', ['room_temp','refrigerated','frozen','controlled','returned','quarantine','other']);
  ensureBool(req.already_recalled, 'already_recalled');
  ensureBool(req.already_extended, 'already_extended');

  let status;
  if (req.already_recalled) status = 'recalled_quarantine_destroy';
  else if (req.days_to_expiration < 0) status = 'expired_destroy_or_return';
  else if (req.days_to_expiration < 30) status = 'expires_within_30d_urgent_use';
  else if (req.days_to_expiration < 90) status = 'expires_within_90d_priority_use';
  else if (req.days_to_expiration < 180) status = 'expires_within_180d_normal_use';
  else if (req.storage_condition === 'returned') status = 'returned_review_credit_or_restock';
  else if (req.storage_condition === 'quarantine') status = 'quarantine_hold_pending_test';
  else status = 'valid_use_normal';
  return { status, days: req.days_to_expiration };
}

function recall_check(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureStr(req.lot_id, 'lot_id');
  ensureEnum(req.recall_class, 'recall_class', ['class_i_dangerous','class_ii_temp_problem','class_iii_labeling','no_recall','resolved','other']);
  ensureNumber(req.lots_affected_count, 'lots_affected_count');
  ensureNumber(req.units_in_stock_affected, 'units_in_stock_affected');
  ensureNumber(req.units_administered_30d, 'units_administered_30d');
  ensureNumber(req.days_since_recall, 'days_since_recall');

  let status;
  if (req.recall_class === 'class_i_dangerous' && req.units_in_stock_affected > 0) status = 'class_i_recall_immediate_quarantine';
  else if (req.recall_class === 'class_i_dangerous' && req.units_administered_30d > 0) status = 'class_i_patient_notification_required';
  else if (req.recall_class === 'class_ii_temp_problem' && req.units_in_stock_affected > 0) status = 'class_ii_quarantine_or_return';
  else if (req.recall_class === 'class_iii_labeling') status = 'class_iii_labeling_review_no_action';
  else if (req.recall_class === 'no_recall') status = 'no_recall_current';
  else if (req.recall_class === 'resolved') status = 'recall_resolved_archived';
  else status = 'recall_status_pending';
  return { status, recall: req.recall_class };
}

function narcotic_inventory(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureNumber(req.schedule_class, 'schedule_class');
  ensureNumber(req.units_counted, 'units_counted');
  ensureNumber(req.units_expected, 'units_expected');
  ensureBool(req.two_person_count, 'two_person_count');
  ensureNumber(req.days_since_last_count, 'days_since_last_count');
  ensureEnum(req.storage, 'storage', ['safe_dual_lock','cabinet_locked','room_storage','dispensing_machine','other']);

  let status;
  const variance = req.units_counted - req.units_expected;
  if (req.schedule_class < 2) status = 'controlled_substance_requires_schedule_2_or_higher';
  else if (!req.two_person_count) status = 'two_person_count_required_for_controlled';
  else if (req.storage === 'room_storage') status = 'secure_storage_required_for_controlled';
  else if (Math.abs(variance) > req.units_expected * 0.05) status = 'variance_over_5_pct_investigate_diversion';
  else if (req.days_since_last_count > 30) status = 'monthly_count_overdue';
  else status = 'narcotic_count_reconciled';
  return { status, variance };
}

function funcs() { return { stock_receive, par_level_check, expiration_check, recall_check, narcotic_inventory }; }
module.exports = { funcs, CITATIONS, ValidationError };