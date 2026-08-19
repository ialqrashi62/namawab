# P0-3 BCMA — User Stories

## US-BCMA-01: 5 Rights Verification
**As a** nurse
**I want to** scan patient wristband + drug barcode before administration
**So that** I ensure right patient gets right drug at right time

**Acceptance:**
- All 5 Rights verified before administration allowed
- Any failure blocks with clear reason

## US-BCMA-02: Allergy Block
**As a** nurse
**I want to** be automatically blocked when patient is allergic to scanned drug
**So that** I never administer a harmful medication

**Acceptance:**
- Allergies pulled from active allergy list
- Block returns 409 with reason code
- Override path requires reason + witness

## US-BCMA-03: High-Alert Double Verification
**As a** charge nurse
**I want to** be required as a witness for high-alert drugs (insulin, heparin, chemo)
**So that** we have a safety check for the most dangerous medications

**Acceptance:**
- System identifies high-alert drugs (SFDA + ISMP list)
- Witness must scan their own badge
- Both signatures stored in audit log

## US-BCMA-04: Override Workflow
**As a** provider
**I want to** override a BCMA block with documented reason
**So that** clinical judgment can prevail when needed

**Acceptance:**
- Override requires reason code + free-text note
- For high-alert: requires second approver
- All overrides logged in audit trail