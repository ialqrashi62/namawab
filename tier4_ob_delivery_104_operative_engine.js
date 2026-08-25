'use strict';
// TIER4_OB_DELIVERY-104 Operative Delivery
const CITATIONS = ['ACOG_Cesarean','RCOG_Operative_Delivery'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function cSectionIndication(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const indication = ensureEnum(input.indication || 'ftp', ['ftp','fetal_distress','malpresentation','previous_cs','maternal_request','placenta_previa','cord_prolapse','multiple_gestation'], 'indication');
  const urgency = ensureEnum(input.urgency || 'scheduled', ['scheduled','urgent','emergent','crash'], 'urgency');
  const category = (urgency === 'emergent' || urgency === 'crash') ? 'category_1_or_2_immediate_decision_to_delivery_under_30_min' : 'category_3_or_4_scheduled_or_soon';
  return { indication, urgency, category, citations: CITATIONS };
}

function vacuumExtractionEligibility(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const fully_dilated = !!input.fully_dilated;
  const station_plus_2_or_below = !!input.station_plus_2_or_below;
  const ruptured_membranes = !!input.ruptured_membranes;
  const estimated_fetal_weight = ensureNumber(input.estimated_fetal_weight || 3500, 'estimated_fetal_weight');
  const prior_cs = !!input.prior_cs;
  const eligible = fully_dilated && station_plus_2_or_below && ruptured_membranes && estimated_fetal_weight <= 4000 && !prior_cs;
  return { fully_dilated, station_plus_2_or_below, ruptured_membranes, estimated_fetal_weight, prior_cs, eligible, citations: CITATIONS };
}

module.exports = { cSectionIndication, vacuumExtractionEligibility, CITATIONS, ValidationError };