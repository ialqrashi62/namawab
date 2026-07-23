# CARD-001 — Middleware Chain

## Layered Security
```js
// 1. requireAuth
// 2. requireTenantScope
// 3. requireRole
// 4. validateBody (FAIL-CLOSED)
// 5. highAlertGuard (anticoag, inotrope, IV antiarrhythmic)
// 6. idempotencyGuard (for PCI booking)
// 7. auditMiddleware
```

## Cardiology Roles
- `attending_cardiologist` — full access
- `fellow_cardiology` — limited
- `resident` — limited
- `ccu_nurse` — vitals, medications, monitoring
- `cath_lab_nurse` — cath lab support
- `echo_tech` — echo only
- `ekg_tech` — EKG
- `pharmacist` — medication review
- `admin` — read-only

## High-Alert Meds (Cardiology)
- IV inotropes (dobutamine, milrinone, dopamine, norepinephrine)
- IV antiarrhythmics (amiodarone, lidocaine)
- IV vasodilators (nitroglycerin, nitroprusside)
- Anticoagulants (heparin, LMWH, warfarin, DOAC)
- Antiplatelets (aspirin, clopidogrel, ticagrelor, prasugrel)
- Digoxin (narrow therapeutic window)
- IV beta-blocker (esmolol)
- Adenosine (rapid admin)
- Insulin (DM management)
- K+ concentrate (electrolyte)

## STEMI Protocol
- **Door-to-ECG:** <10 min
- **Door-to-troponin:** <30 min
- **Door-to-needle (fibrinolysis):** <30 min
- **Door-to-balloon (PCI):** <90 min (or <60 min if transferred)
- **Critical alert:** Auto-page interventional cardiologist on STEMI

## Door-to-Balloon Tracking
```js
async function trackDoorToBalloon(encounterId) {
  const arrival = new Date();
  const ekgTime = await getEcgTime(encounterId);
  const cathActivationTime = await getCathActivationTime(encounterId);
  const balloonTime = await getBalloonTime(encounterId);
  return {
    door_to_ekg: ekgTime - arrival,
    door_to_activation: cathActivationTime - arrival,
    door_to_balloon: balloonTime - arrival,
    within_target: (balloonTime - arrival) < 90 * 60 * 1000
  };
}
```

## Critical Findings
- STEMI (ST elevation in 2+ contiguous leads)
- Complete heart block
- Sustained VT
- New AF
- Hyperkalemia pattern
- Pericardial effusion with tamponade

## Tenant Isolation
- Per AGENTS.md §2.2
- All cardiology data: tenant-scoped
- Pre-hospital ECG: tenant + EMS system

## Idempotency
- PCI booking (cannot double-book)
- Cardioversion order
- Pacemaker/ICD implant
- High-alert medication start

## Audit
- Every ECG (timestamp + interpretation)
- Every troponin
- Every procedure
- Every medication
- Every device check
- Door-to-balloon time tracking
