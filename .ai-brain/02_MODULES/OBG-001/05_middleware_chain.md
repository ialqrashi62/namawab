# OBG-001 — Middleware Chain

## Layered Security
```js
// 1. requireAuth
// 2. requireTenantScope
// 3. requireRole
// 4. validateBody
// 5. idempotencyGuard (for delivery, surgery orders)
// 6. auditMiddleware (for consent, deliveries, PPH, perinatal events)
```

## OBG-Specific Roles
- `obstetrician` — full access
- `gynecologist` — full access (gyn only)
- `maternal_fetal_medicine` — high-risk pregnancies
- `midwife` — prenatal, L&D, postpartum
- `l_and_d_nurse` — L&D specific
- `postpartum_nurse` — postpartum
- `sonographer` — ultrasound
- `reproductive_endocrinologist` — IVF, infertility
- `gyn_oncologist` — gyn-onc surgery
- `admin` — read-only

## Special Consent
- **Adolescent pregnancy:** guardian consent + minor assent
- **Sterilization:** mandatory waiting period + consent
- **Termination:** regulated (KSA: only for maternal life/fetal lethal)
- **IVF:** extensive consent (embryos, gametes, disposition)
- **C-section on request:** documentation + counseling

## Audit
- Every delivery logged (date, time, mode, complications, outcomes)
- Every PPH tracked
- Every perinatal mortality → root cause analysis
- Sentinel events (maternal death, fetal death) → immediate notification

## Data Sensitivity
- Pregnancy data: PDPL special category
- HIV, hepatitis, syphilis: encrypted + access-restricted
- IVF data: extremely restricted
- Adolescent: highest protection

## Idempotency
- Delivery record (cannot duplicate)
- Medication (high-alert)
- Lab order

## Tenant Isolation
- OBG records stay in same tenant
- Cross-tenant transfer requires explicit authorization
- Pregnancy data: never cross-tenant without consent
