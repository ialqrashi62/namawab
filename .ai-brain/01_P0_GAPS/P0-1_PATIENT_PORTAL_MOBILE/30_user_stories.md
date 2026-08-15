# P0-1 Patient Portal — User Stories

## US-1: Nafath Identity Login
**As** a patient
**I want** to log in with Nafath (national SSO)
**So that** I can securely access my records

### AC
- [ ] Nafath OTP verification
- [ ] Optional biometric (L3)
- [ ] Session token issued
- [ ] PDPL consent gate

## US-2: Book Appointment
**As** a patient
**I want** to book a specialist appointment
**So that** I can see the doctor

### AC
- [ ] Select specialty
- [ ] Choose date + time slot
- [ ] Insurance check (Wateen)
- [ ] Cost calculation
- [ ] Confirmation via Mawid

## US-3: Telehealth Visit
**As** a patient
**I want** to attend a video consultation
**So that** I don't have to travel

### AC
- [ ] Video room URL sent before visit
- [ ] Tech check (camera, mic, internet)
- [ ] In-call chat + screen share
- [ ] Post-visit summary emailed

## US-4: View Lab Results
**As** a patient
**I want** to see my lab results
**So that** I understand my health

### AC
- [ ] Critical results: clinician call within 1 hour
- [ ] Normal results: auto-disclose after 24 hours
- [ ] AI explains in plain language
- [ ] "Consult your doctor" CTA if abnormal

## US-5: Request Refill
**As** a patient
**I want** to request a medication refill
**So that** I don't run out

### AC
- [ ] Validate refills_remaining
- [ ] Block controlled substances
- [ ] Forward to pharmacy
- [ ] Notification when ready

## US-6: Track Vitals
**As** a patient with chronic disease
**I want** to log my BP/glucose/weight
**So that** I can monitor my health

### AC
- [ ] Quick entry buttons (BP/glucose/weight)
- [ ] Range validation
- [ ] Trend chart
- [ ] Alert if severe abnormal

## US-7: Grant Caregiver Access
**As** a patient with elderly parents
**I want** to give my spouse caregiver access
**So that** they can help manage records

### AC
- [ ] Caregiver Nafath verification
- [ ] Relationship selection
- [ ] PDPL consent doc signed by both
- [ ] Expiration date
- [ ] Audit log

## US-8: Pay Bill Online
**As** a patient
**I want** to pay my medical bill online
**So that** I don't have to queue

### AC
- [ ] Display balance + insurance
- [ ] MADA/SADAD payment
- [ ] 2FA for >500 SAR
- [ ] Receipt via email

## US-9: Withdraw Consent (PDPL)
**As** a patient
**I want** to withdraw marketing consent
**So that** my data isn't used for ads

### AC
- [ ] Manage consents screen
- [ ] 2FA confirmation
- [ ] Audit log
- [ ] Effective immediately

## US-10: Export FHIR Records
**As** a patient moving to a new city
**I want** to export my records in FHIR format
**So that** my new doctor can see my history

### AC
- [ ] FHIR R4 bundle
- [ ] Includes medications, allergies, conditions, labs
- [ ] Downloadable JSON
