<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Middleware

Same as CARD-002 + specialty: 'trauma_surgery', 'emergency_medicine'.

**HIGH-ALERT blood gate:** 2-RN bedside check (per CBAHI blood traceability).
**MTP gate:** 2-RN witness + 2-MD sign-off within 5 min of trigger.

Idempotency: /activations, /mtp/activate, /transfer-out.