# P3-CF Ship Report

**Version:** v3.44.0
**Modules:** 3 (pcc_billing, pcc_scheduling, pcc_telemed)
**Tests:** +72 (30 unit + 42 integ) → **4839 total**
**Audit:** 213 PASS (was 210)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_billing | /api/v1/pcc-billing/{list,call/:fn,record} | Billing, Charge, Insurance, Discount, Payment, Refund, Statement, Denial, Reclaim, Tax |
| pcc_scheduling | /api/v1/pcc-scheduling/{list,call/:fn,record} | Schedule, Slot, Waitlist, Reminder, Booking, Cancel, Reschedule, Capacity, Resource, Template |
| pcc_telemed | /api/v1/pcc-telemed/{list,call/:fn,record} | Visit, Consent, Connection, Prescribe, Charting, Triage, Reimburse, Platform, FollowUp, Audit |

## Server

- `pcc/server.js` v3.44.0, 215 modules wired
- 3 endpoints verified via `Invoke-WebRequest` → JSON 200 OK

## Audit

- 213/213 PASS
- All 12 safety rails honored

## Next: P3-CG candidates

`pcc_pharmacy`, `pcc_dialysis`, `pcc_oncology_ext`
