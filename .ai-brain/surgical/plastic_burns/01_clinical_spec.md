# 01 Clinical Spec — Plastic, Reconstructive & Burns Surgery

## 1. Clinical Domain & Scope
- **Focus**: Aesthetic and reconstructive procedures, burn care, wound management, microsurgery, and hand surgery.
- **Key Workflows**:
  - Pre-op aesthetic consultation and consent.
  - Burn assessment (TBSA, depth) and fluid resuscitation.
  - Wound debridement, grafting, flap tracking.
  - Implant and filler tracking for aesthetic procedures.
  - Post-op photography and outcome documentation.

## 2. Patient Journey
1. Consultation → 2. Photography/consent → 3. Procedure planning → 4. Surgery → 5. Post-op care → 6. Follow-up/photography.

## 3. Clinical Decision Support
- Auto-calculate TBSA (Rule of Nines / Lund-Browder).
- Parkland formula for burn resuscitation.
- Wound healing stage tracking.
- Implant/filler safety limits and expiration alerts.

## 4. Integration Points
- OR booking and safety checklist.
- Anesthesia and PACU.
- Pathology for biopsy/graft samples.
- Billing and contracts for aesthetic packages.

## 5. Safety Gates
- Consent + photography before aesthetic procedures.
- Burn resuscitation order set for TBSA > 15%.
- Implant serial tracking and recall alerts.
