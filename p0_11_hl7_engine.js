/**
 * P0-11 HIS Interoperability Engine
 */
'use strict';

const CITATIONS = { HL7: 'HL7 v2.7', FHIR: 'FHIR R4' };

function parseHL7v2(message) {
  const segments = (message || '').split('\r').filter(s => s.trim()).map(seg => ({ type: seg.split('|')[0], fields: seg.split('|').slice(1) }));
  return { segment_count: segments.length, message_type: segments[0]?.fields?.[0], segments };
}

function buildHL7ADT(input) {
  const { patient_id, name } = input;
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const msg = [
    `MSH|^~\\&|NamaMedical|KFSH|EMR|HOSPITAL|${ts}||ADT^A01|MSG-${Date.now()}|P|2.7`,
    `EVN|A01|${ts}`,
    `PID|1||${patient_id}^^MRN||${name || ''}^^`,
    `PV1|1|I|2000^201^01`,
  ].join('\r');
  return { message: msg, message_type: 'ADT' };
}

function buildHL7ORU(input) {
  const { patient_id, test_code, value } = input;
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const msg = [
    `MSH|^~\\&|NamaMedical|LAB|EMR|HOSPITAL|${ts}||ORU^R01|MSG-${Date.now()}|P|2.7`,
    `PID|1||${patient_id}^^MRN`,
    `OBR|1|ORD-${Date.now()}||${test_code}|||${ts}`,
    `OBX|1|NM|${test_code}||${value}|||N|||F`,
  ].join('\r');
  return { message: msg, message_type: 'ORU' };
}

function dicomCStore(input) {
  const { sop_class_uid } = input;
  return { sop_class_uid: sop_class_uid || '1.2.840.10008.5.1.4.1.1.7', sop_instance_uid: `1.2.840.${Date.now()}`, transfer_syntax: '1.2.840.10008.1.2.1' };
}

function eligibilityCheck(input) {
  const { member_id, payer_id } = input;
  return { eligibility_id: `ELG-${Date.now()}`, member_id, payer_id, status: 'active', coverage: 'comprehensive' };
}

function claimSubmissionX12(input) {
  const { claim_id, total_amount } = input;
  return { x12_837_id: `837-${Date.now()}`, claim_id, total_amount, status: 'submitted' };
}

module.exports = { parseHL7v2, buildHL7ADT, buildHL7ORU, dicomCStore, eligibilityCheck, claimSubmissionX12, CITATIONS };