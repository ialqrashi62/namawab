# Phase B D5 — Orthanc PACS Sandbox — إغلاق

> 2026-06-23 | نُفِّذ محاكي DICOM محلي (7/7، dummy metadata فقط) + جُهّز Orthanc compose candidate. لا صور حقيقية/PHI/شبكة/ربط إنتاجي/محاسبة.

## الحقول
```text
FINAL_STATUS: PHASE_B_D5_ORTHANC_PACS_SANDBOX_COMPLETED_OR_CANDIDATE_READY
ORTHANC_SANDBOX_STATUS: LOCAL_DICOM_SIMULATOR_EXECUTED (7/7); REAL_ORTHANC=CANDIDATE_PENDING_OWNER_EXTERNAL_IMAGE_PULL
DEPLOYMENT_MODE: local-offline simulator now; docker-compose.candidate.yml for gated real run (loopback-only)
REAL_ORTHANC_RUN: NO
PUBLIC_EXPOSURE: NO
EXTERNAL_CALLS: NO_OR_BLOCKED_PENDING_OWNER_IMAGE_PULL
REAL_PHI_USED: NO
REAL_DICOM_USED: NO
DUMMY_DICOM_USED: YES (metadata only, no pixel bytes)
DB_READS: NO
DB_WRITES: NO
PRODUCTION_WIRING: NO
NGINX_EXPOSURE: NO
CODE_DEPLOYED: NO (sandbox tooling; not wired to server.js / no PM2)
PM2_RESTARTED: NO
HEALTH_STATUS: local 200, domain 200
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
PHI_COMMITTED: NO
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_HAPI_FHIR_LOCAL_OR_VAULT_KMS_PHASE2
```

## الخلاصة
- **منفّذ آمناً**: محاكي PACS/DICOM محلي (STOW/WADO + tripwires PHI/شبكة + نموذج المسار المحمي A3A + تنظيف) = 7/7، dummy metadata فقط.
- **candidate (موافقة مالك)**: Orthanc الفعلي عبر `docker-compose.candidate.yml` (image pull خارجي؛ loopback فقط؛ التطبيق يبقى الواجهة الوحيدة خلف A3A/تشفير at-rest).
- لا صور/PHI حقيقية، لا ربط إنتاجي/nginx/DB/محاسبة؛ R17 سليمة؛ health 5/5 + domain 200.

تم تنفيذ أو تجهيز Orthanc PACS sandbox محلي دون صور حقيقية أو PHI أو ربط إنتاجي
