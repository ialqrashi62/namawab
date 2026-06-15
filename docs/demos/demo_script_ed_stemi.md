# Demo — ED + Cardiology STEMI Fast-Track (15 min)

> Showcases: AI-assisted triage, ECG AI, Code STEMI cross-team activation, audit trail.

## Audience
- Hospital CMO/CIO/Quality Director.
- Cardiology + ED leadership.

## Setup (5 min before demo)
- Browser tabs: ED Live Board, ED Triage, ECG Reader, Cardio Dashboard, Audit Log.
- Demo data: `seeders/cardiology_seed.sql` + `seeders/ed_seed.sql` loaded.
- Login as: `nurse_em01`, `dr_em01`, `dr_cardio01`.

## Script

### 0. Opening (1 min)
> "Today I'll show how NamaMedical reduces door-to-balloon time below 90 minutes
> using AI-assisted ECG and one-click cross-team activation, with full audit."

### 1. ED Live Board (2 min)
- Show TV-mode ED board: capacity 78%, CTAS distribution, active codes.
- Explain SSE real-time updates.
- Highlight: PHI redacted (last name initial only) per PDPL.

### 2. New Patient Arrival (2 min)
- Walk-in: 65yo male, chest pain.
- Quick registration → MRN assigned.
- Triage form: vitals BP 90/60, HR 122, SpO2 91, pain 8/10.
- **AI suggests CTAS 1** with confidence 0.91.
- Nurse confirms; resus bed auto-assigned; physician paged.

### 3. ECG with AI (3 min)
- ED nurse uploads ECG via mobile capture.
- AI label: **STEMI Anterior, conf 0.94** within 5 seconds.
- Banner appears on ED dashboard + cardiology on-call notified.
- Show side-by-side: AI annotation overlay + machine interpretation.

### 4. Code STEMI Activation (2 min)
- ED physician taps **"Activate Code STEMI"**.
- System creates `cardio_cath_cases` row "incoming"; pages cath team via SMS+push.
- Door-to-balloon timer starts (countdown 90:00).
- All actions logged in hash-chained audit.

### 5. Cath Lab Acceptance (2 min)
- Switch to cardio fellow account.
- Pop-up: "Incoming STEMI — Patient P-90001". Accept.
- Add expected access (radial-r). Cath lab prep instructions auto-displayed.

### 6. Audit Trail (2 min)
- Open Audit Explorer.
- Show: triage submitted → AI inferred → code activated → pagers fired → cath accepted.
- Each row hash-linked; tamper-evident.
- Click hash → verify chain integrity.

### 7. Q&A close (1 min)
- "What's possible: 30%+ reduction in D2B per published cardio CoE."
- "What's protected: PDPL data residency, advisory-only AI, human override always."

## Backup demos if time permits
- Show CDS rule: try ordering meropenem → blocked → ID approval flow.
- Show order set: "Apply STEMI bundle" → all standard items pre-populated.
- Show offline mode: capture ECG with disconnected network → auto-sync on reconnect.

## What NOT to do
- Don't claim AI diagnoses; always say "AI assists, clinician decides."
- Don't show real PHI; demo data only.
- Don't promise specific D2B numbers without RCT data; cite published CoE benchmarks instead.
