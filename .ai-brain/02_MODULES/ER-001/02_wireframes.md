---
module_id: ER-001
section: 05_ux_ui
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Wireframes (Screen Flow)

## 1. ER Board (Main Screen)

**Layout:** E (Timeline)

**Components:**
- Top bar (logo, ER board title, stats, user menu)
- Left sidebar (search, filter, sort, encounter list)
- Center (active encounter timeline)
- Right sidebar (patient summary, vitals, red flags, AI suggestions)

**Interactions:**
- Click encounter → expand in center
- Click "Admit" / "Discharge" / "Transfer" / "AMA" → disposition modal
- Real-time updates via WebSocket (every 30s)
- Sound on red flag detection

## 2. Triage Modal

**Layout:** C (Wizard)

**Steps:**
1. Chief complaint (free text or select from list)
2. HPI (optional, 500 char max)
3. Vitals (auto-populated from device if available)
4. Pain score (0-10 slider)
5. PMH (multi-select from patient history)
6. Allergies (multi-select, mandatory check)
7. Medications (multi-select)
8. Submit → AI classification + red flag detection

**Output:**
- ESI level (1-5) with color badge
- Red flags (if any) with action required
- Recommended action (resus bay, acute bed, fast track, etc.)
- Workup suggestions (labs, imaging, ECG)
- Time-to-provider target

**Override:**
- RN can override with mandatory reason
- Supervisor co-sign required for category 1-2 override

## 3. Encounter Detail (Expanded)

**Layout:** A (3-col clinical workspace)

**Components:**
- Left: Triage data, chief complaint, HPI
- Center: Timeline (vitals, meds, procedures, results, notes)
- Right: Active orders, pending results, red flags, AI suggestions, disposition panel

**Timeline events:**
- Arrival, Triage, Vitals, Procedures, Meds, Labs, Imaging, Notes, Consults, Disposition

**Click on event:** expand with full details

## 4. Code Activation Modal

**Layout:** G (Forms, urgent)

**Fields:**
- Code type (dropdown: blue, stemi, stroke, trauma, sepsis, mass_casualty)
- Activation reason (free text, 500 char)
- Confirm checkbox (acknowledges team page + chart update)

**Actions:**
- Activate (one-click) → page team + update chart
- Cancel

**Visual:** Large red button, prominent

## 5. Medication Administration

**Layout:** G (Forms)

**Steps:**
1. Search drug (autocomplete)
2. Dose (auto-calculated weight-based for peds)
3. Route (PO, IV, IM, SC, etc.)
4. Indication (free text or select)
5. 5-rights check (visual confirmation of: right patient, right drug, right dose, right route, right time)
6. Allergy check (auto-validated)
7. Drug interaction check (auto-validated)
8. Renal dose adjustment (if applicable)
9. Pregnancy check (if applicable, female 12-55)
10. Submit → record + audit

**Safety:**
- Allergy conflict → BLOCK (no override)
- Critical drug interaction → BLOCK
- Renal dose → recommend adjustment (override with reason)
- Pregnancy + teratogen → BLOCK

## 6. Critical Lab Callback

**Trigger:** Lab result is critical value

**Modal:** Persistent, requires acknowledgment
- Lab name, value, unit, reference range
- Time of result
- Acknowledge button (MD only)
- 30-minute SLA (escalation to charge nurse if not ack'd)

## 7. Disposition Modal

**Layout:** C (Wizard)

**Steps:**
1. Disposition type (admit / discharge / transfer / AMA / deceased / obs)
2. Destination (dropdown for admit, transfer)
3. Receiving provider (for transfer)
4. Discharge instructions (if discharge) — template + free text
5. Follow-up (if discharge) — provider, timeframe
6. AMA witness (if AMA) — required
7. Confirm + sign

**Validation:**
- Discharge requires instructions
- AMA requires witness
- Admit requires bed assignment

## 8. Settings (Provider)

**Layout:** G (Forms)

- Notification preferences
- Default ESI override (rare)
- Default order sets
- Theme (8 themes)
- Language (AR/EN)
- Compact/detailed view

## 9. Reports (Charge Nurse)

**Layout:** B (Dashboard)

KPIs:
- Active encounters by ESI
- Average wait time
- LWBS rate
- Door-to-provider time
- Door-to-balloon (STEMI)
- Door-to-needle (tPA)
- Sepsis bundle compliance
- Critical callback acknowledgment rate

Charts:
- Hourly volume
- ESI distribution
- Disposition breakdown
- Top chief complaints
- Code activations

## 10. Audit Log (CQO)

**Layout:** B (Dashboard, restricted)

- All actions on encounters in tenant
- Filterable by user, action, date
- Searchable by patient, encounter
- Exportable (CSV, PDF)
- Hash chain verification status

---
*Section 05.b of ER-001. Owner: PM + UX. L4 validated.*
