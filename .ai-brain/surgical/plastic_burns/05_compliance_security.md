# 05 Compliance & Security — Plastic, Reconstructive & Burns Surgery

## 1. Compliance
- CBAHI surgical safety and consent requirements.
- Saudi PDPL for patient photos and aesthetic data.
- SFDA regulations for implants and fillers.

## 2. Security
- `requireRole('plastic_surgeon')` / `requireRole('burn_specialist')`, `requireTenantScope`.
- Photos stored in PHI vault with access logging.
- Implant serials encrypted at rest.

## 3. Audit
- Hash-chained audit for consent, photos, implant insertion, and wound logs.

## 4. Safety Gates
- Consent + photography before aesthetic procedure.
- Burn resuscitation order set for TBSA > 15%.
- Implant recall alert if manufacturer notice received.

## 5. Data Retention
- Photos retained per institutional policy; audit logs 7+ years.
