---
module_id: ER-001
section: 01_clinical_spec
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Sub-Department Catalog

## Sub-Units within Emergency Department

| ID | Sub-Unit | Layout | Staff | Capacity | Notes |
|----|----------|--------|-------|----------|-------|
| **ER-TRIAGE** | Triage Area | B (dashboard) | Triage RN | 4-6 stations | First point of contact |
| **ER-RESUS** | Resuscitation Bays | E (timeline) | MD + senior RN + RT | 2-4 bays | ESI 1 + codes |
| **ER-ACUTE** | Acute Care Zone | E (timeline) | MD + RN | 8-16 beds | ESI 2-3 |
| **ER-FAST** | Fast Track | A (3-col) | NP/PA + RN | 4-8 beds | ESI 4-5, lower acuity |
| **ER-PEDS** | Pediatric ED | A (3-col) | Peds-trained MD + RN | 4-6 beds | <18 years |
| **ER-PSYCH** | Psych Holding | H (queue) | RN + sitter | 2-4 beds | Suicidal/homicidal |
| **ER-TRAUMA** | Trauma Bay | E (timeline) | Trauma surgery + MD + RT | 1-2 bays | ATLS setup |
| **ER-OBS** | Observation Unit (ED-OU) | E (timeline) | Hospitalist + RN | 4-12 beds | <24h stays |
| **ER-TRIAGE-FAST** | Super Track | A (3-col) | NP/PA | 2-4 bays | ESI 5 only |
| **ER-PROCEDURE** | Procedure Suite | A (3-col) | MD + RN | 2-3 rooms | Lacerations, I&D, LP |
| **ER-IMAGING** | ED Imaging | F (imaging) | RT + rad tech | CT, US, X-ray | STAT reads |
| **ER-LAB** | POC Lab | G (forms) | Lab tech | i-STAT, ABG, glucose | TAT <15 min |
| **ER-DISPO** | Discharge Lounge | H (queue) | RN + social worker | 6-12 chairs | Awaiting ride, education |
| **ER-DECONTAM** | Decontamination | (isolated) | Hazmat-trained staff | Outdoor shower + indoor | Chemical/radiological |
| **ER-FORENSIC** | Forensic Suite | (secured) | SANE-trained RN + MD | 1-2 rooms | Sexual assault, abuse |

## Sub-Unit Workflow Connections

```
[ER-TRIAGE] -> ESI 1-2 -> [ER-RESUS]
              ESI 1-2 -> [ER-TRAUMA] (if trauma mechanism)
              ESI 1-2 -> [ER-PEDS] (if <18)
              ESI 2-3 -> [ER-ACUTE]
              ESI 4-5 -> [ER-FAST] or [ER-TRIAGE-FAST]
              Psych crisis -> [ER-PSYCH]

[ER-RESUS] -> stabilize -> [ER-ACUTE] (downgrade) OR OR/ICU (admit)
[ER-TRAUMA] -> OR/ICU/IR (admit) OR [ER-ACUTE] (downgrade)
[ER-ACUTE] -> [ER-OBS] OR [ER-DISPO] (admit/discharge)
[ER-PEDS] -> admit to peds ward OR [ER-DISPO]
[ER-PSYCH] -> psych ward (involuntary) OR [ER-DISPO] (voluntary)
[ER-FAST] -> [ER-DISPO] (most cases)
[ER-OBS] -> admit (if not improved) OR [ER-DISPO] (if improved)
```

## Sub-Unit Staffing Models

### ER-TRIAGE
- **Day (07-19):** 1 triage RN + 1 triage tech (vitals, registration)
- **Night (19-07):** 1 triage RN (multi-task)
- **Surge:** add 2nd triage RN if waiting >5 patients

### ER-RESUS
- **Always:** 1 MD (ED attending or senior resident) + 2 senior RNs
- **During code:** +1 RT, +1 pharmacist on standby
- **Surge:** add ED tech for compressions, additional RN for meds

### ER-ACUTE
- **Day:** 1 MD per 6 beds + 1 RN per 3 beds + 1 tech per 8 beds
- **Night:** 1 MD per 8 beds + 1 RN per 4 beds
- **Surge:** float pool RN, hospitalist cross-coverage

### ER-PEDS
- **Day:** 1 Peds ED MD + 1 Peds-trained RN per 4 beds
- **Night:** 1 Peds ED MD (or adult ED with Peds competency) + 1 RN

### ER-PSYCH
- **Always:** 1:1 sitter (RN or psych tech) per patient
- **MD:** psych resident or ED MD with tele-psych backup

### ER-TRAUMA
- **On activation:** Trauma surgery attending + ED MD + 2 trauma-trained RNs + 1 RT + 1 OR team on standby

## Sub-Unit Equipment Standards

### ER-RESUS
- Defibrillator/monitor (with pacing, cardioversion, 12-lead)
- Airway: laryngoscopes (Mac + Miller), video laryngoscope, bougie, supraglottic airways, surgical airway kit
- Breathing: BVM (adult/peds), oxygen, suction, chest tube tray, needle decompression kit
- Circulation: IO drill, central line kit, arterial line kit, fluids warmer, rapid infuser, Belmont or equivalent
- Drugs: ACLS cart + push-dose pressors + reversal agents
- Bed: trauma stretcher with full access (C-spine capable)

### ER-TRAUMA
- All resus equipment +
- Warmer (forced-air, fluids)
- Massive transfusion protocol (MTP) cooler
- FAST ultrasound
- Portable X-ray
- CT scanner (adjacent)
- Hybrid OR (institution-dependent)

### ER-PEDS
- Broselow tape or equivalent (color-coded by length/weight)
- Pediatric airway cart (Miller blades, uncuffed ETTs 2.5-6.0, supraglottic)
- Pediatric fluids (NS bolus 20 mL/kg)
- Pediatric meds (weight-based, pre-calculated)
- Child life specialist toys/distraction tools
- Family zone (separate from critical care area)

## Sub-Unit Metrics

| Sub-Unit | Key Metric | Target |
|----------|-----------|--------|
| ER-TRIAGE | Triage-to-provider time | <10/30/60 min by ESI |
| ER-RESUS | Time to first intervention | <3 min for codes |
| ER-ACUTE | Bed turnaround time | <15 min |
| ER-FAST | Door-in-door-out time | <90 min |
| ER-PEDS | Peds-specific LOS | <3h median |
| ER-PSYCH | Psych boarding time | <24h (regulatory) |
| ER-TRAUMA | Time to CT/OR | <30 min for unstable |
| ER-OBS | Conversion to admission | <30% |
| ER-DISPO | Discharge education completion | 100% |

---
*Section 01.b of ER-001. Owner: CMO + SA.*
