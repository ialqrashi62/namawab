<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — ICD-10 / AIS / SNOMED Map

## Top 10 Conditions

| # | Condition | ICD-10 | AIS |
|---|-----------|--------|-----|
| 1 | Polytrauma | T07 / S39.91 | 3-4 |
| 2 | Severe TBI | S06.0-9 | 4-5 |
| 3 | Penetrating | S31/S21/S11 | 3-5 |
| 4 | Blunt abdominal | S36.x | 3-4 |
| 5 | Thoracic | S27.x | 3-4 |
| 6 | Pelvic | S32.8/S32.81 | 4-5 |
| 7 | Long-bone | S72/S82/S92 | 2-3 |
| 8 | Spinal cord | S14.1/S24.1 | 4-5 |
| 9 | Burns | T30/T31 | 2-3 |
| 10 | Pediatric | T07 | 2-4 |

## Top 20 Procedures (CPT)

| Procedure | CPT |
|-----------|-----|
| ATLS survey | E/M |
| Endotracheal intubation | 31500 |
| Needle decompression | 32554 |
| Chest tube | 32551 |
| Resuscitative thoracotomy | 32160 |
| ED thoracotomy | 33025 |
| FAST | 93308 |
| DPL | 49080 |
| REBOA | 34900 |
| MTP | 36430 ×units |
| Damage control lap | 49002 |
| External fixation | 20690 |
| ICP monitor | 61107 |
| Craniotomy | 61312, 61322 |
| Fasciotomy | 27892, 27496, 25020 |
| Vascular shunt | 35231 |
| Amputation | 27880-27888 |
| Splinting | 29065-29584 |
| Inter-facility transfer | 99289 + A0999 |
| Surgical airway (cricothyroidotomy) | 31603 |

## AIS 2015 Severity Scale
1 = Minor · 2 = Moderate · 3 = Serious · 4 = Severe · 5 = Critical · 6 = Maximal (untreatable)

## ISS Calculation
Sum of squares of 3 highest AIS in different body regions. Max = 75.

## TRISS (Champion 1995)
- Blunt: b0=-1.2470, b1=0.9544(age≥55), b2=-0.0768(iss), b3=-1.9052(rts)
- Penetrating: b0=-0.6029, b1=0.6278(age≥55), b2=-0.1037(iss), b3=-1.7436(rts)

---
*Section 22 of ER-002. CMO voice. L1 DRAFT.*