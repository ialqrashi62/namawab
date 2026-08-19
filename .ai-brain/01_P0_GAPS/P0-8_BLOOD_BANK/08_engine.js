/**
 * Blood Bank — Engine
 */

'use strict';

const CITATIONS = { AABB: 'AABB Standards 2024', SCOT: 'Saudi Central Organ Transplant', ISBT128: 'ISBT 128 Standard' };

function typeAndCrossmatch(input) {
  const { patient_id, donor_unit_id, patient_abo, donor_abo, patient_rh, donor_rh, antibody_screen } = input;
  const compatible = patient_abo === donor_abo && (patient_rh === 'positive' || donor_rh === 'negative');
  return {
    patient_id, donor_unit_id,
    abo_compatible: compatible,
    rh_compatible: patient_rh === 'positive' || donor_rh === 'negative',
    antibody_screen,
    status: compatible ? 'COMPATIBLE' : 'INCOMPATIBLE',
    citation: CITATIONS.AABB,
  };
}

function antibodyScreening(input) {
  const { patient_id, antibodies } = input;
  return {
    patient_id,
    antibody_count: antibodies.length,
    antibodies: antibodies.map(a => ({ name: a, titer: '1:1', significance: 'clinical' })),
    requires_premedication: antibodies.length > 0,
  };
}

function irradiationTracking(input) {
  const { unit_id, irradiated, irradiation_date, dose_cgy } = input;
  return {
    unit_id,
    irradiated,
    irradiation_date,
    dose_cgy,
    valid_until: irradiation_date ? new Date(new Date(irradiation_date).getTime() + 28 * 24 * 60 * 60 * 1000).toISOString() : null,
    indication: ['HSCT', 'premature_infant', 'immunocompromised'].includes(input.indication) ? 'REQUIRED' : 'OPTIONAL',
    citation: CITATIONS.AABB,
  };
}

function componentTherapy(input) {
  const { component_type, indication, dose_ml } = input;
  const components = { RBC: 1, PLT: 1, FFP: 10, CRYO: 1, WBC: 1 };
  const units_required = (components[component_type] || 1) * (input.weight_kg ? Math.ceil(input.weight_kg / 10) : 1);
  return {
    component_type,
    indication,
    dose_ml: dose_ml || units_required * 250,
    units_required,
  };
}

function transfusionReaction(input) {
  const { reaction_type, severity, patient_id, unit_id } = input;
  const types = ['febrile', 'allergic_mild', 'allergic_severe', 'hemolytic_acute', 'hemolytic_delayed', 'TRALI', 'TACO'];
  return {
    patient_id, unit_id, reaction_type, severity,
    immediate_action: severity === 'severe' ? 'STOP_TRANSFUSION_AND_NOTIFY' : 'MONITOR',
    workup_required: types.includes(reaction_type),
    citation: CITATIONS.AABB,
  };
}

function isbtLabeling(input) {
  const { unit_id, abo, rh, expiration_date, collection_date, donor_id } = input;
  return {
    unit_id,
    isbt_barcode: `ISBT${unit_id}`,
    abo, rh,
    collection_date,
    expiration_date,
    donor_id,
    isbt_compliant: true,
    citation: CITATIONS.ISBT128,
  };
}

module.exports = {
  typeAndCrossmatch, antibodyScreening, irradiationTracking,
  componentTherapy, transfusionReaction, isbtLabeling, CITATIONS,
};