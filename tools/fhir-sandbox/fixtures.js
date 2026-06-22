// FHIR sandbox — DUMMY fixtures (synthetic; NOT real patients, NO PHI).
// Shapes mirror NamaMedical DB rows but values are fabricated for local testing only.
'use strict';
module.exports = {
  patients: [
    { id: 9001, name_en: 'Test One', name_ar: 'تجريبي واحد', gender: 'male', dob: '1990-01-01', national_id: '0000000001', tenant_id: 1 },
    { id: 9002, name_en: 'Test Two', name_ar: 'تجريبي اثنان', gender: 'female', dob: '1985-05-05', national_id: '0000000002', tenant_id: 1 },
  ],
  encounters: [
    { id: 7001, patient_id: 9001, status: 'finished', class: 'AMB', start: '2026-06-23T09:00:00Z', end: '2026-06-23T09:30:00Z', facility_id: 1 },
  ],
  observations: [
    { id: 5001, patient_id: 9001, code: '8867-4', display: 'Heart rate', value: 72, unit: '/min', when: '2026-06-23T09:05:00Z' },
    { id: 5002, patient_id: 9002, code: '8310-5', display: 'Body temperature', value: 37.0, unit: 'Cel', when: '2026-06-23T10:05:00Z' },
  ],
  reports: [
    { id: 6001, patient_id: 9001, order_type: 'XRAY', status: 'final', when: '2026-06-23T09:20:00Z', phi_file_id: 1234 },
  ],
  medreqs: [
    { id: 4001, patient_id: 9002, medication: 'Paracetamol 500mg', requester: 'Dr Test', dosage: '1 tab q8h', status: 'active' },
  ],
  claims: [
    { id: 3001, patient_id: 9001, insurer: 'Test Insurer', total: 150.0, currency: 'SAR', item_desc: 'Consultation' },
  ],
};
