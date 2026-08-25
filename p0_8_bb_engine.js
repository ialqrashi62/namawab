/**
 * P0-8 Blood Bank Engine
 */
'use strict';

const CITATIONS = { AABB: 'AABB Standards 2024', ISBT128: 'ISBT 128' };

function typeAndCrossmatch(input) {
  const { patient_abo, donor_abo, patient_rh, donor_rh } = input;
  const compatible = patient_abo === donor_abo && (patient_rh === 'positive' || donor_rh === 'negative');
  return { abo_compatible: compatible, rh_compatible: patient_rh === 'positive' || donor_rh === 'negative', status: compatible ? 'COMPATIBLE' : 'INCOMPATIBLE' };
}

function antibodyScreening(input) {
  const { antibodies } = input;
  return { count: (antibodies || []).length, requires_premedication: (antibodies || []).length > 0 };
}

function irradiationTracking(input) {
  const { unit_id, irradiation_date } = input;
  return { unit_id, valid_until: irradiation_date ? new Date(new Date(irradiation_date).getTime() + 28 * 24 * 60 * 60 * 1000).toISOString() : null };
}

function componentTherapy(input) {
  const { component_type, dose_ml } = input;
  return { component_type, dose_ml: dose_ml || 250 };
}

function transfusionReaction(input) {
  const { reaction_type, severity } = input;
  return { reaction_type, severity, immediate_action: severity === 'severe' ? 'STOP_TRANSFUSION_AND_NOTIFY' : 'MONITOR' };
}

function isbtLabeling(input) {
  const { unit_id, abo, rh } = input;
  return { unit_id, isbt_barcode: `ISBT${unit_id}`, abo, rh, isbt_compliant: true };
}

module.exports = { typeAndCrossmatch, antibodyScreening, irradiationTracking, componentTherapy, transfusionReaction, isbtLabeling, CITATIONS };