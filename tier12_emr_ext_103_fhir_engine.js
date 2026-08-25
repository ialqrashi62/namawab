// filepath: tier12_emr_ext_103_fhir_engine.js
// TIER12_EMR_EXT-103: FHIR R4 resource mapping & validation
'use strict';

const CITATIONS = ['HL7_FHIR_R4_2024','USCDI_V3_2024','SMART_FHIR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function fhir_patient_map(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.family_name, 'family_name');
  ensureStr(req.given_name, 'given_name');
  ensureNumber(req.birth_date_unix, 'birth_date_unix');
  ensureEnum(req.gender, 'gender', ['male','female','other','unknown','unspecified','non_binary','transgender']);
  ensureStr(req.identifier_system, 'identifier_system');
  ensureStr(req.identifier_value, 'identifier_value');

  let fhir_status;
  if (req.gender === 'unknown') fhir_status = 'gender_unknown_allowed_for_privacy';
  else if (!req.identifier_system || !req.identifier_value) fhir_status = 'identifier_required_for_patient';
  else fhir_status = 'fhir_patient_resource_mappable';
  return { fhir_status, resource: 'Patient', fhir_id: 'Patient/' + req.identifier_value };
}

function fhir_observation_map(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.code, 'code', ['8867-4','8480-6','8310-5','59408-5','718-7','2339-0','20564-1','6298-4','4548-4','1742-6','1920-8','718-7','785-6','10839-9','8302-2','9279-1','29463-7','8302-2']);
  ensureNumber(req.value, 'value');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.status, 'status', ['registered','preliminary','final','amended','corrected','cancelled','entered_in_error']);
  ensureEnum(req.category, 'category', ['vital_signs','laboratory','social_history','survey','exam','therapy','other']);

  let obs_status;
  if (req.status === 'cancelled' || req.status === 'entered_in_error') obs_status = 'observation_in_error_no_clinical_use';
  else if (req.status === 'final') obs_status = 'fhir_observation_final_mappable';
  else if (req.status === 'amended') obs_status = 'amended_observation_with_history';
  else obs_status = 'observation_mappable_to_fhir';
  return { obs_status, code: req.code, fhir_resource: 'Observation' };
}

function fhir_medication_map(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_code, 'medication_code');
  ensureEnum(req.code_system, 'code_system', ['rxnorm','snomed_ct','ndc','atc','local_formulary']);
  ensureNumber(req.dose_value, 'dose_value');
  ensureStr(req.dose_unit, 'dose_unit');
  ensureEnum(req.intent, 'intent', ['proposal','plan','order','original_order','reflex_order','filler_order','instance_order']);
  ensureNumber(req.dispense_quantity, 'dispense_quantity');

  let med_status;
  if (req.intent === 'proposal' && req.dispense_quantity > 0) med_status = 'proposal_should_not_have_dispense';
  else if (!req.medication_code || req.medication_code === 'unknown') med_status = 'medication_code_required';
  else if (req.code_system === 'local_formulary' && req.intent === 'order') med_status = 'local_formulary_for_orders_use_rxnorm_or_snomed';
  else med_status = 'medication_request_mappable';
  return { med_status, intent: req.intent, code_system: req.code_system };
}

function fhir_encounter_map(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.encounter_class, 'encounter_class', ['inpatient','outpatient','emergency','ambulatory','home_health','virtual','day_surgery','observation','rehab','long_term_care','skilled_nursing','field','other']);
  ensureEnum(req.status, 'status', ['planned','arrived','in_progress','onleave','finished','cancelled','unknown','entered_in_error']);
  ensureNumber(req.length_days, 'length_days');
  ensureStr(req.facility_id, 'facility_id');

  let enc_status;
  if (req.status === 'finished' && req.length_days > 365) enc_status = 'encounter_over_1_year_review';
  else if (req.encounter_class === 'virtual' && req.facility_id !== 'virtual_clinic') enc_status = 'virtual_encounter_facility_check';
  else if (req.status === 'finished') enc_status = 'fhir_encounter_closed_mappable';
  else enc_status = 'encounter_mappable_to_fhir';
  return { enc_status, encounter_class: req.encounter_class, status: req.status };
}

function fhir_bundle(req) {
  ensureStr(req.bundle_id, 'bundle_id');
  ensureEnum(req.bundle_type, 'bundle_type', ['document','message','transaction','transaction_response','batch','batch_response','history','searchset','collection']);
  ensureNumber(req.resource_count, 'resource_count');
  ensureNumber(req.references_count, 'references_count');
  ensureNumber(req.unresolved_references, 'unresolved_references');
  ensureEnum(req.validation_severity, 'validation_severity', ['none','information','warning','error','fatal']);

  let bundle_status;
  if (req.validation_severity === 'fatal') bundle_status = 'fatal_validation_review_immediately';
  else if (req.unresolved_references > 0) bundle_status = 'unresolved_references_'+req.unresolved_references;
  else if (req.validation_severity === 'error') bundle_status = 'validation_errors_review';
  else if (req.bundle_type === 'transaction' && req.resource_count > 100) bundle_status = 'transaction_too_large_split';
  else bundle_status = 'bundle_valid_for_transmission';
  return { bundle_status, bundle_type: req.bundle_type };
}

function funcs() { return { fhir_patient_map, fhir_observation_map, fhir_medication_map, fhir_encounter_map, fhir_bundle }; }
module.exports = { funcs, CITATIONS, ValidationError };