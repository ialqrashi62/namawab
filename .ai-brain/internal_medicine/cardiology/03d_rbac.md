# RBAC Matrix — Cardiology

> **Owner:** Architect
> **Date:** 2026-07-22

---

## Master Matrix

| Action | Admin | Cardio Doctor | Cardio Nurse | Sonographer | EP Doctor | Researcher | Patient |
|---|---|---|---|---|---|---|---|
| **Patient** | | | | | | | |
| View own record | ✅ | ✅ (own dept) | ✅ (own dept) | ✅ (own dept) | ✅ (own dept) | ❌ | ✅ |
| View cross-dept record | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit own record (PHI) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Echo** | | | | | | | |
| View echo | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | own only |
| Upload echo (DICOM) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sign echo | ✅ | ✅ | ❌ | ❌ (own only) | ✅ | ❌ | ❌ |
| Amend signed echo | ✅ (with audit) | ✅ (with audit) | ❌ | ❌ | ✅ (with audit) | ❌ | ❌ |
| **ECG** | | | | | | | |
| View ECG | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | own only |
| Upload ECG | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| AI-interpret ECG | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Sign ECG | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Procedures** | | | | | | | |
| Schedule procedure | ✅ | ✅ | ✅ | ❌ | ✅ (EP only) | ❌ | ❌ |
| Update procedure status | ✅ | ✅ | ❌ | ❌ | ✅ (EP only) | ❌ | ❌ |
| Sign procedure note | ✅ | ✅ | ❌ | ❌ | ✅ (EP only) | ❌ | ❌ |
| Cancel procedure | ✅ | ✅ | ✅ | ❌ | ✅ (EP only) | ❌ | ❌ |
| **Anticoagulation Clinic** | | | | | | | |
| View queue | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Document visit | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Adjust warfarin dose | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **HF GDMT** | | | | | | | |
| View HF dashboard | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | own only |
| Initiate GDMT | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Titr ate GDMT | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **CDS** | | | | | | | |
| Run CDS query | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Override CDS suggestion | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Researcher** | | | | | | | |
| Run cohort query | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ (no PHI) | ❌ |
| Export de-identified data | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (with IRB) | ❌ |
| **Admin** | | | | | | | |
| Manage users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configure AI model | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Re-embed guidelines | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Run pentest | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Enforcement

- Middleware: `requireAuth`, `requireTenantScope`, `requireRole('cardiology_doctor')`
- DB: RLS by tenant_id on every table
- Audit: every action logged with actor_id, target_id, timestamp

## Golden Access Rule

- **Owner/Admin:** absolute access
- **Cardiologist:** full clinical access within cardiology dept
- **Cardiology Nurse:** clinical support, no signing authority
- **Cross-dept access:** denied by default; requires explicit ACL grant

## ACL Overrides

- Cross-dept access (e.g., cardio-obstetrics) requires `joint_care_acl` flag
- Set by Admin per patient episode
- Logged in audit trail

---

End of RBAC matrix.
