/**
 * HIS Interoperability — Engine
 */

'use strict';

const CITATIONS = { HL7: 'HL7 v2.7', FHIR: 'FHIR R4', IHE: 'IHE PCD' };

function parseHL7v2(message) {
  const segments = message.split('\r').filter(s => s.trim()).map(seg => {
    const fields = seg.split('|');
    return { type: fields[0], fields: fields.slice(1) };
  });
  return { segment_count: segments.length, message_type: segments[0]?.fields?.[0], segments };
}

function buildHL7ADT(input) {
  const { patient_id, name, dob, gender, event_type, facility } = input;
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const segments = [
    `MSH|^~\\&|NamaMedical|${facility || 'KFSH'}|EPIC|HOSPITAL|${ts}||ADT^${event_type || 'A01'}|MSG-${Date.now()}|P|2.7`,
    `EVN|${event_type || 'A01'}|${ts}`,
    `PID|1||${patient_id}^^MRN||${name || ''}^${''}^${''}||${dob || ''}|${gender || ''}`,
    `PV1|1|I|2000^201^01||||${input.provider_id || 'PROVIDER'}`,
  ];
  return { message: segments.join('\r'), message_type: 'ADT', citation: CITATIONS.HL7 };
}

function buildHL7ORU(input) {
  const { patient_id, order_id, test_code, value, unit, reference_range, abnormal_flag } = input;
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const segments = [
    `MSH|^~\\&|NamaMedical|LAB|EMR|HOSPITAL|${ts}||ORU^R01|MSG-${Date.now()}|P|2.7`,
    `PID|1||${patient_id}^^MRN`,
    `OBR|1|${order_id}||${test_code}|||${ts}`,
    `OBX|1|NM|${test_code}||${value}|${unit || ''}|${reference_range || ''}|${abnormal_flag || 'N'}|||F`,
  ];
  return { message: segments.join('\r'), message_type: 'ORU', citation: CITATIONS.HL7 };
}

function dicomCStore(input) {
  const { sop_class_uid, sop_instance_uid, study_uid, series_uid, instance_number } = input;
  return {
    sop_class_uid: sop_class_uid || '1.2.840.10008.5.1.4.1.1.7',
    sop_instance_uid: sop_instance_uid || `1.2.840.${Date.now()}`,
    study_uid: study_uid || `1.2.840.${Date.now()}`,
    series_uid: series_uid || `1.2.840.${Date.now()}`,
    instance_number: instance_number || 1,
    transfer_syntax: '1.2.840.10008.1.2.1',
    citation: CITATIONS.IHE,
  };
}

function eligibilityCheck(input) {
  const { member_id, payer_id, service_date } = input;
  return {
    eligibility_id: `ELG-${Date.now()}`,
    member_id, payer_id, service_date,
    status: 'active',
    coverage: 'comprehensive',
    copay_pct: 20,
    deductible_remaining: 500,
    citation: CITATIONS.FHIR,
  };
}

function claimSubmissionX12(input) {
  const { claim_id, patient_id, payer_id, total_amount, diagnosis_codes } = input;
  return {
    x12_837: `ISA*00*          *00*          *ZZ*SUBMITTERID    *ZZ*RECEIVERID     *${new Date().toISOString().slice(0, 10).replace(/-/g, '')}*00501*000000001*0*P*:~GS*HC*SUBMITTER*RECEIVER*${new Date().toISOString().slice(0, 10).replace(/-/g, '')}*0001*1*X*005010X222A1~ST*837*0001*005010X222A1~BHT*0019*00*${claim_id}*${new Date().toISOString().slice(0, 10).replace(/-/g, '')}*CH*NM~NM1*41*2*SUBMITTER*****46*SUBMITTERID~PER*IC*JANE DOE*TE*1234567890~NM1*40*2*RECEIVER*****46*RECEIVERID~HL*1**20*1~NM1*85*2*BILLING SERVICE*****XX*1234567890~N3*123 STREET~N4*CITY*ST*ZIP~REF*EI*123456789~HL*2*1*22*0~SBR*P*18*******CI~NM1*IL*1*PATIENT*FIRST*A***MI*${patient_id}~N3*PATIENT ADDRESS~N4*CITY*ST*ZIP~DMG*D8*19800101*M~NM1*PR*2*PAYER*****PI*${payer_id}~CLM*${claim_id}*${total_amount}***11:B:1*Y*A*Y*Y~HI*ABK:${(diagnosis_codes || ['Z00'])[0]}~LX*1~SV1*HC:99213*${total_amount}*UN*1***1~DTP*472*D8*${service_date || new Date().toISOString().slice(0, 10).replace(/-/g, '')}~SE*23*0001~GE*1*1~IEA*1*000000001~`.slice(0, 1000),
    status: 'submitted',
  };
}

module.exports = {
  parseHL7v2, buildHL7ADT, buildHL7ORU, dicomCStore,
  eligibilityCheck, claimSubmissionX12, CITATIONS,
};