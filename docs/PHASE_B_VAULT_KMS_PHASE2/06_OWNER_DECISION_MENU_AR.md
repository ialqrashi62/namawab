# Phase 2 — قائمة قرار المالك

> اختر مزوّداً ثم بوابة rehearsal. لا تنفيذ حقيقي بلا بنية Vault/KMS + موافقة.

## اختيار المزوّد (واحد)
```text
APPROVE_VAULT_KMS_PROVIDER_HASHICORP_VAULT     ← موصى للـon-prem السعودي (بلا تبعية سحابة)
APPROVE_VAULT_KMS_PROVIDER_AZURE_KEY_VAULT
APPROVE_VAULT_KMS_PROVIDER_AWS_KMS
APPROVE_VAULT_KMS_PROVIDER_GCP_KMS
APPROVE_VAULT_KMS_PROVIDER_ON_PREM_HSM          ← الأقوى لحضانة المفاتيح الخاصة التنظيمية
```

## التنفيذ التدريجي (بعد اختيار المزوّد)
```text
APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY    ← rehearsal على dummy/throwaway أولاً (آمن)
APPROVE_ZATCA_PHASE2_CSR_READINESS_ONLY         ← جاهزية CSR (بلا توليد حقيقي/OTP/اتصال)
APPROVE_NPHIES_MTLS_READINESS_ONLY              ← جاهزية mTLS (بلا شهادة حقيقية/اتصال)
```

## التوصية
1. **`APPROVE_VAULT_KMS_PROVIDER_HASHICORP_VAULT`** (on-prem، يبقى داخل الموقع) — للعام at-rest، أو **`..._ON_PREM_HSM`** للمفاتيح الخاصة التنظيمية إن توفّر عتاد.
2. ثم **`APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY`** (rehearsal بلا إنتاج).
3. التنظيمي (ZATCA/NPHIES) بعد المزوّد + onboarding الطرف الخارجي + شهادات.

## ملاحظة
لا شيء من هذا ينفّذ مفاتيح/شهادات حقيقية في هذه البوابة؛ كلها readiness/candidate. KEK escrow (DR) يبقى إجراء مالك مستقل وموصى أولاً.
