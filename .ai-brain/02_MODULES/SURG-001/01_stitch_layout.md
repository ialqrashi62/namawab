# SURG-001 — Stitch UI Layout

## Layout C — OR Booking for Surgical Ward

```
+--------------------------------------------------+
| [☰] NamaMedical | Tenant: KFSH | Dr. Hassan    |
+--------------------------------------------------+
| OR Schedule - Today                              |
+--------------------------------------------------+
| 08:00 - 09:30 | OR 1 | Lap Cholecystectomy      |
| Patient: Ali M. | ASA 2 | Anesthesia: General   |
| Surgeon: Dr. Hassan | Anesthetist: Dr. Khalid   |
| Pre-op: ✓ consent, ✓ site mark, ✓ antibiotic    |
+--------------------------------------------------+
| 10:00 - 12:00 | OR 2 | Inguinal Hernia Repair    |
| Patient: Omar A. | ASA 1 | Local + sedation      |
| Surgeon: Dr. Hassan | Anesthetist: Dr. Noura    |
+--------------------------------------------------+
| 13:00 - 15:00 | OR 3 | Appendectomy              |
| Patient: Sara K. | ASA 2 | Lap                   |
| Emergency | Surgeon: Dr. Hassan                  |
+--------------------------------------------------+
```

## Components
- `<ORSchedule>` (timeline view)
- `<ProcedureCard>` (patient, procedure, time, surgeon)
- `<PreOpChecklist>` (consent, site mark, antibiotic, NPO)
- `<IntraOpForm>` (anesthesia, EBL, time-out)
- `<PostOpForm>` (disposition, plan)
- `<ComplicationForm>` (Clavien-Dindo)
