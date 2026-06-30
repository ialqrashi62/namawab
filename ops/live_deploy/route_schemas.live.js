/**
 * route_schemas.js — LIVE-SAFE validation schemas for high-value financial/clinical routes (GATE3-H1).
 *
 * Adapted to the LIVE integration/all-epics server.js by reading each route's ACTUAL req.body usage.
 * Strictly NON-BREAKING: every field a route currently accepts flows through untouched (validateBody
 * only writes cleaned values to req.validated and never mutates req.body). We enforce TYPE + LENGTH and
 * leave money to ./billing_integrity and journal balance to ./finance_engine, exactly as the live
 * handlers already do.
 *
 * Deliberately conservative vs. the local remediation copy:
 *   - journal.entry_date is OPTIONAL here (the live route defaults it to today when absent).
 *   - patient gender/phone are bounded STRINGS, not enum/regex (live data may use Arabic gender values
 *     and varied phone formats we must not reject). national_id stays a lenient bounded string.
 */
'use strict';

// POST /api/invoices — live body: patient_id?, patient_name?, description?, service_type?,
// payment_method?, discount_reason?  (total/discount validated by billing_integrity.parseMoney)
const invoiceCreate = {
    patient_id:      { type: 'id',  required: false },
    patient_name:    { type: 'str', required: false, max: 200 },
    description:     { type: 'str', required: false, max: 1000 },
    service_type:    { type: 'str', required: false, max: 100 },
    payment_method:  { type: 'str', required: false, max: 40 },
    discount_reason: { type: 'str', required: false, max: 500 }
};

// POST /api/finance/journal — live body: entry_date?, description?, reference?, source_type?, lines[]
// (entry_date is OPTIONAL: live handler uses `entry_date || today`. lines balance via finance_engine.)
const journalCreate = {
    entry_date:  { type: 'dateStr', required: false },
    description: { type: 'str', required: false, max: 1000 },
    reference:   { type: 'str', required: false, max: 200 },
    source_type: { type: 'enumOf', allowed: ['MANUAL', 'INVOICE', 'SYSTEM'], required: false }
};

// POST /api/invoices/:id/refund — live body: amount (validated by billing_integrity), reason?
const invoiceRefund = {
    reason: { type: 'str', required: false, max: 500 }
};

// POST /api/patients — live body has ~20 fields; we bound only the free-text/PHI strings by TYPE+LENGTH.
// gender/phone are bounded strings (NOT enum/regex) to avoid rejecting valid Arabic/format values.
const patientCreate = {
    name_ar:                  { type: 'str', required: false, max: 200 },
    name_en:                  { type: 'str', required: false, max: 200 },
    national_id:              { type: 'str', required: false, max: 30 },
    nationality:              { type: 'str', required: false, max: 100 },
    gender:                   { type: 'str', required: false, max: 20 },
    phone:                    { type: 'str', required: false, max: 30 },
    department:               { type: 'str', required: false, max: 120 },
    payment_method:           { type: 'str', required: false, max: 40 },
    dob:                      { type: 'str', required: false, max: 30 },
    dob_hijri:                { type: 'str', required: false, max: 30 },
    blood_type:               { type: 'str', required: false, max: 10 },
    emergency_contact_name:   { type: 'str', required: false, max: 200 },
    emergency_contact_phone:  { type: 'str', required: false, max: 30 },
    insurance_company:        { type: 'str', required: false, max: 200 },
    insurance_policy_number:  { type: 'str', required: false, max: 100 },
    insurance_class:          { type: 'str', required: false, max: 100 }
    // free-text clinical fields (allergies, chronic_diseases, address) intentionally NOT bounded here
    // to avoid any chance of rejecting long legitimate clinical text; they pass through untouched.
};

module.exports = { invoiceCreate, journalCreate, invoiceRefund, patientCreate };
