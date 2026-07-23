# 06 Implementation Plan — Plastic, Reconstructive & Burns Surgery

## 1. Phase 1 — Core (Immediate)
- Consultation and consent workflow.
- Burn assessment with TBSA and Parkland calculator.
- Wound log and dressing schedule.

## 2. Phase 2 — Advanced
- Photo timeline with PHI vault integration.
- Implant/filler tracking and expiration alerts.
- Integration with OR booking and anesthesia/PACU.

## 3. Phase 3 — Optimization
- AI-assisted wound stage prediction.
- Outcome comparison dashboards.
- Patient-reported outcome collection.

## 4. Migration
- `eXX_plastic_burns_up.sql` / `_down.sql`.

## 5. Acceptance Criteria
- TBSA calculation matches Rule of Nines / Lund-Browder.
- Consent and photo upload mandatory before aesthetic procedure.
- Implant recall alert tested end-to-end.
