# طابور المرشّحات (موحّد، كل المراحل)

## CANDIDATE_READY (جاهز لبوابة تنفيذ)
- A: Vault/KMS phase 2، tenant_id indexes.
- B: D1 Mirth sandbox deploy، D2 FHIR local sandbox code، D5 Orthanc PACS sandbox، D9 monitoring dashboard.
- C: BCMA، eMAR hardening، ICU/ESI/WHO scores، drug/allergy interaction checks، clinical BI/quality/readmission/infection indicators.
- D: design system، accessibility، user manuals/training، observability/uptime/backup monitors، AI/RAG blueprint، privacy-safe AI governance.
- E: billing-to-GL، financial reports، reconciliation.
- F: client acceptance checklist، roadmap freeze، global benchmark delta، Saudi compliance delta، CBAHI/HIMSS map.

## COMPLETED_DOCS_ONLY (منجز وثائقياً هذه/سابق الموجات)
- A: restore readiness، full restore drill، incident runbook، security ops runbook، RLS drift (FORCE=150)، key rotation runbook.
- C: clinical audit completeness (audit=163).
- D: i18n (2243 tr())، operator runbooks، watchdog review، HA/DR، prompt-logging policy، model-data-boundary policy.
- F: release lock، operation handover، support runbook، risk register، owner menu.

## BLOCKED_PENDING_OWNER_APPROVAL
- A: KEK escrow actual (يلمس المفتاح)، audit-reader GRANT+deploy، tenant_id index (تنفيذ).
- C: beta R17 review/promotion (review فقط؛ لا merge).

## BLOCKED_PENDING_KEY_OR_CERTIFICATE
- A: offsite encrypted backup. B: ZATCA Phase 2 (CSID). E: ZATCA accounting linkage.

## BLOCKED_PENDING_EXTERNAL_PARTY
- B: NPHIES (D4)، LIS/RIS (D6)، insurance payer (D7). E: insurance settlement.

## BLOCKED_PENDING_ACCOUNTING_APPROVAL
- E: accounting posting enablement، journal posting.

## BLOCKED_PENDING_SAFE_TEST_DATA
- C: clinical decision support automation.

## COMPLETED (منشور/منفّذ)
- A1, A2(+تصليب), A3A, A3B, A3 at-rest (DPAPI), backup غير مراقب, audit hardening, E2E cleanup, restore drill, RLS 150, D0 key model.
