# P0-1 Patient Portal — Chaining Patterns

## Pattern 1: Nafath Identity Verification
```
[App Launch] → [Nafath SSO]
       ↓
[National ID + Mobile OTP]
       ↓
[Biometric (optional L3)]
       ↓
[Session Token Issued]
       ↓
[PDPL Consent Gate]
```

## Pattern 2: Appointment Booking Flow
```
[User taps Book Appointment]
       ↓
[Specialty Select (cardiology/derm/etc.)]
       ↓
[Date + Time Slot Search]
       ↓
[Insurance Verification (Wateen)]
       ↓
[Cost Calculation (insurance vs self-pay)]
       ↓
[Confirmation + Insurance Pre-Auth]
       ↓
[Mawid Notification]
       ↓
[Add to Calendar]
```

## Pattern 3: Telehealth Pre-Visit
```
[User selects Video Appointment]
       ↓
[Pre-Visit Form (chief complaint)]
       ↓
[Triage: Physical exam needed?]
       ↓
[If yes: Convert to in-person]
       ↓
[If no: Confirm video + send tech check]
       ↓
[Video Room URL sent 15 min before]
       ↓
[Patient joins → Provider joins → Visit]
       ↓
[Post-visit summary emailed]
```

## Pattern 4: Lab Results Disclosure
```
[New lab result available]
       ↓
[Is critical?]
       ├─ Yes: Provider verification (phone call within 1 hour)
       └─ No: Auto-disclose after 24 hours
       ↓
[Notification sent (push + email)]
       ↓
[Patient opens Lab Results]
       ↓
[Display with explanation (AI generated)]
       ↓
[If abnormal: "Consult your doctor" CTA]
       ↓
[Audit log entry]
```

## Pattern 5: Refill Request
```
[User taps Refill]
       ↓
[Validate refills_remaining > 0]
       ↓
[Is controlled substance?]
       ├─ Yes: BLOCK + "Visit your doctor"
       └─ No: Forward to pharmacy
       ↓
[Pharmacy receives queue]
       ↓
[Pharmacist approves/rejects]
       ↓
[Patient notified]
```

## Pattern 6: Caregiver Proxy Grant
```
[Patient taps Add Caregiver]
       ↓
[Caregiver Nafath/Absher verification]
       ↓
[Relationship select (spouse/parent/child/sibling/legal_guardian)]
       ↓
[PDPL Consent Doc generated]
       ↓
[Both sign (patient + caregiver)]
       ↓
[Set expiration date]
       ↓
[Caregiver granted access]
       ↓
[Audit log]
```

## Pattern 7: Vital Tracking with Alert
```
[Self-reported vital entered]
       ↓
[Range validation]
       ├─ Normal: Save + "All good"
       ├─ Abnormal moderate: Save + "Consult if persistent"
       └─ Abnormal severe: Save + PROVIDER ALERT (page)
       ↓
[Trend chart updated]
```

## Pattern 8: Bill Payment
```
[User taps Pay Bill]
       ↓
[Display balance + insurance status]
       ↓
[Amount > 500 SAR?]
       ├─ Yes: 2FA required
       └─ No: Direct payment
       ↓
[Payment method (MADA/Apple Pay/etc.)]
       ↓
[SADAD payment processing]
       ↓
[Receipt + confirmation]
```

## Pattern 9: Consent Withdrawal (PDPL Right to Erasure)
```
[User taps Manage Consents]
       ↓
[Display current consents]
       ↓
[Select to withdraw (marketing/research/etc.)]
       ↓
[Confirm with 2FA]
       ↓
[Audit log entry]
       ↓
[Data processing halted for withdrawn type]
       ↓
[Confirmation sent to user]
```

## Pattern 10: Health Risk Self-Assessment
```
[User completes health questionnaire]
       ↓
[Score calculated: age/BMI/BP/glucose/smoking/exercise]
       ↓
[Risk level: Low/Moderate/High]
       ↓
[If High: Schedule appointment CTA]
       ↓
[If Moderate: Educational content]
       ↓
[If Low: Encouragement + reminder to re-check]
```
