# طابور المرشّحات — مصنّف بالحالة

> 2026-06-23 | تصنيف كل البنود حسب الجاهزية. لا تنفيذ إنتاجي هنا.

## Completed (منجز ومُتحقَّق)
- A1 EMR Lock/Signature (backend + UI) · A2 MFA opt-in (+تصليب أمان) · A3A PHI File Guard · A3B freeze lifted · **A3 at-rest encryption (DPAPI)** · backup غير مراقب · audit hardening · E2E accounts cleanup · Phase B Discovery · D0 secrets/key model · **restore drill معزول (هذه الجلسة)**.

## Ready now (آمن للتنفيذ الآن — بلا أسرار/شهادات/طرف خارجي/PHI/محاسبة)
- A3 DPAPI KEK escrow/readiness (وثيقة + تنبيه).
- security incident response runbook (وثيقة).
- HA/DR + operator runbooks + user manuals (وثائق).
- observability/alerts candidate (تصميم؛ يوجد watchdog/health أصلاً).
- D1 Mirth/NextGen assessment (وثيقة قرار معماري).
- D2 FHIR sandbox محلي بلا PHI (candidate + إثبات mapping؛ التنصيب لاحق ببوابة).
- Phase C beta pages (R17) verification **read-only** (مراجعة بلا merge).
- tenant_id index candidate (آمن، CREATE INDEX CONCURRENTLY — قابل للتنفيذ ببوابة).

## Candidate only (ورقي/تصميمي الآن، تنفيذ ببوابة لاحقة)
- D5 PACS/Orthanc sandbox · D8 integration monitoring/queue/retry · Phase C: ICU/ESI/WHO/CDS/BI candidates · Phase D: design system/i18n/accessibility/AI-RAG blueprint · Phase E: revenue/billing readiness.

## Blocked by key/certificate
- A3 Vault/KMS المرحلة 2 · نسخ مشفّرة offsite · ZATCA Phase 2 (CSID) · NPHIES (mTLS).

## Blocked by external party
- ZATCA (Fatoora onboarding) · NPHIES · D6 LIS/RIS أجهزة · D7 insurance payer · وجهة offsite سحابية.

## Blocked by owner approval
- audit-reader GRANT+deploy · tenant_id index (تنفيذ) · كل بوابات candidate أعلاه عند الانتقال للتنفيذ.

## Blocked by accounting OFF (سياسة)
- Phase E accounting posting enablement (candidate مُجرّب 63/63؛ بوابة مخصّصة صريحة فقط) · ZATCA accounting link · insurance settlement.

## Blocked by real-PHI restriction
- أي اختبار تكامل يتطلّب PHI حقيقي (NPHIES/LIS/RIS/PACS الإنتاجي) — يُستكشف بـsandbox/dummy فقط حتى الإنتاج المعتمد.
