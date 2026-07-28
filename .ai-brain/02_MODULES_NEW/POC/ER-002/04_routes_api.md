<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Express Routes


amaweb/routes/trauma.js:
- POST /activations (idempotent on encounter+tier)
- POST /primary-survey (fail-closed)
- POST /secondary-survey
- POST /ais-coding (MD-cosign if AIS>3)
- GET /iss-score/:encounterId
- GET /triss/:encounterId
- POST /mtp/activate (idempotent, 2-RN verify)
- POST /mtp/:id/terminate
- POST /transfusion/log
- POST /operative-log
- POST /transfer-out (idempotent, capability_gap required)
- POST /transfer-in
- GET /registry/export (NTDB)
- POST /pi/case
- POST /pi/case/:id/close-loop
- GET /performance/dashboard
- POST /tbi/severity
- POST /hemorrhage/pathway

All: authenticate + requireTenantScope + requireRole('trauma_surgery'|'emergency_medicine') + validateBody.