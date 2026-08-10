/**
 * route_schemas_test.js — pure unit tests for ./route_schemas via ./validation (no DB).
 * Verifies the schemas accept real valid payloads and reject malformed ones, and that they are
 * NON-BREAKING (a minimal/partial body still passes). Run: node route_schemas_test.js
 */
'use strict';
const { validate, ValidationError } = require('./validation');
const S = require('./route_schemas');

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) pass++; else { fail++; console.error('  FAIL:', n); } };
const accepts = (n, schema, body) => { try { validate(body, schema); ok(n, true); } catch (e) { ok(n + ' (' + e.message + ')', false); } };
const rejects = (n, schema, body) => { try { validate(body, schema); ok(n + ' (should reject)', false); } catch (e) { ok(n, e instanceof ValidationError); } };

// invoiceCreate — valid full + partial + empty (non-breaking)
accepts('invoice full', S.invoiceCreate, { patient_id: 12, patient_name: 'Ahmad', description: 'CBC', service_type: 'lab', payment_method: 'cash', discount_reason: 'loyalty' });
accepts('invoice partial', S.invoiceCreate, { patient_name: 'Walk-in' });
accepts('invoice empty (non-breaking)', S.invoiceCreate, {});
rejects('invoice bad patient_id', S.invoiceCreate, { patient_id: 'abc' });
rejects('invoice patient_id zero', S.invoiceCreate, { patient_id: 0 });
rejects('invoice over-long name', S.invoiceCreate, { patient_name: 'x'.repeat(201) });

// journalCreate — entry_date required + valid; source_type enum
accepts('journal valid', S.journalCreate, { entry_date: '2026-06-30', description: 'd', reference: 'JV-1', source_type: 'MANUAL' });
accepts('journal minimal', S.journalCreate, { entry_date: '2026-06-30' });
rejects('journal missing date', S.journalCreate, { description: 'no date' });
rejects('journal bad date', S.journalCreate, { entry_date: 'yesterday' });
rejects('journal bad source_type', S.journalCreate, { entry_date: '2026-06-30', source_type: 'HACK' });

// invoiceRefund — reason optional
accepts('refund with reason', S.invoiceRefund, { reason: 'duplicate charge' });
accepts('refund empty', S.invoiceRefund, {});
rejects('refund over-long reason', S.invoiceRefund, { reason: 'x'.repeat(501) });

// patientCreate — lenient national_id (non-Saudi), phone validated, gender enum
accepts('patient saudi id', S.patientCreate, { name_ar: 'سارة', national_id: '1234567890', phone: '+966501234567', gender: 'Female' });
accepts('patient passport id (non-Saudi)', S.patientCreate, { name_en: 'John', national_id: 'P1234567', gender: 'Male' });
accepts('patient minimal', S.patientCreate, {});
rejects('patient bad phone', S.patientCreate, { phone: 'abc' });
rejects('patient bad gender', S.patientCreate, { gender: 'unknown-x' });
rejects('patient over-long national_id', S.patientCreate, { national_id: 'x'.repeat(31) });

console.log(`route_schemas_test: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
