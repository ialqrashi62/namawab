# HashiCorp Vault Provider — Readiness Gate — إغلاق

> 2026-06-23 | اعتُمد HashiCorp Vault on-prem كمزوّد مفاتيح المرحلة 2 (readiness/candidate). لا مفاتيح/شهادات حقيقية، لا اتصال ZATCA/NPHIES، لا تغيير إنتاجي.

## ما أُنجز (docs/candidate فقط)
- **01** قرار المزوّد: HashiCorp Vault on-prem + المبرّر + الدور في بنية الطبقتين.
- **02** deployment candidate (sandbox dev loopback؛ production = raft/TLS/unseal/audit) + `tools/vault-sandbox/docker-compose.candidate.yml` (لم يُشغَّل).
- **03** secret paths + policies (transit `nama-kek`، pki-zatca/pki-nphies، kv integration؛ least-privilege؛ sandbox/prod منفصلان).
- **04** خطة re-wrap rehearsal (dummy؛ dual-read؛ rollback؛ نقاط موافقة).
- **05** حدود ZATCA/NPHIES (sign-in-place؛ بلا CSR/OTP/شهادات/اتصال).

## الحقول
```text
FINAL_STATUS: HASHICORP_VAULT_PROVIDER_GATE_COMPLETED_OR_BLOCKED
PROVIDER_SELECTED: HASHICORP_VAULT_ON_PREM
VAULT_DEPLOYMENT: CANDIDATE_READY (not run; image not pulled this gate)
REAL_KEYS_CREATED: NO
REAL_CERTIFICATES_USED: NO
PRIVATE_KEYS_HANDLED: NO
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS_COUNT: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY
```

## المتبقّي (بوابات لاحقة)
1. تشغيل Vault sandbox (image pull) → rehearsal re-wrap (dummy).
2. re-wrap الإنتاج + نافذة صيانة + drill → إبطال DPAPI v1.
3. ZATCA Ph2 / NPHIES بعد Vault مُشغّل + onboarding + شهادات.
4. KEK escrow (DR) يبقى إجراء مالك مستقل موصى أولاً.

تم اعتماد HashiCorp Vault كمرشّح مزوّد مفاتيح المرحلة 2 دون إنشاء مفاتيح أو استخدام شهادات أو ربط تنظيمي
