# Vault Provider — قرار الاعتماد: HashiCorp Vault (on-prem)

> 2026-06-23 | readiness فقط. لا مفاتيح/شهادات حقيقية. مهارات مفعّلة: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_ZATCA_PHASE2, NM_NPHIES, NM_GOVERNANCE_CLOSEOUT.

## القرار
**PROVIDER_SELECTED: HASHICORP_VAULT_ON_PREM** كمزوّد مفاتيح/أسرار للمرحلة 2.

## المبرّر (مقابل البدائل — راجع docs/PHASE_B_VAULT_KMS_PHASE2/02)
- **on-prem بلا تبعية سحابة**: يبقى داخل الموقع/المملكة — مناسب لإقامة البيانات والامتثال السعودي، وللنشر single-box/on-prem الحالي بلا اشتراط اتصال خارجي دائم.
- **حضانة المفاتيح الخاصة**: `transit` (تشفير/توقيع كخدمة، المفتاح لا يُصدَّر) + `pki` (إصدار/حضانة شهادات mTLS) — يغطّي ZATCA CSID (sign-in-place) وNPHIES mTLS مستقبلاً (عبر بوابات منفصلة).
- **re-wrap بلا إعادة تشفير**: يخدم نموذج envelope الحالي (`crypto_envelope.js`) — تبديل مزوّد KEK من DPAPI إلى Vault دون لمس بيانات مشفّرة.
- **تدوير + تدقيق غنيان** (audit devices) + سياسات وصول دقيقة.
- بديل عتادي للمفاتيح الأقوى = **on-prem HSM** (Provider C) يبقى خياراً للمفاتيح التنظيمية إن توفّر عتاد؛ Vault PKI كافٍ كبداية.

## الدور في بنية الطبقتين (NM_SECURITY_DR_KEY_MANAGEMENT)
- Layer 1: envelope (AES-256-GCM، DEKs) — موجود.
- Layer 2 Provider B = **Vault transit** (KEK wrap/unwrap) للعام at-rest (mfa_secret/PHI/backups).
- Provider C = **Vault PKI / HSM** للمفاتيح الخاصة التنظيمية (ZATCA/NPHIES).

## الحدود (هذه البوابة)
readiness/candidate فقط: لا تثبيت/تشغيل Vault فعلي، لا init/unseal، لا مفاتيح/شهادات حقيقية، لا اتصال ZATCA/NPHIES، لا تغيير إنتاجي.
```text
PROVIDER_SELECTED: HASHICORP_VAULT_ON_PREM
REAL_KEYS_CREATED: NO | REAL_CERTIFICATES_USED: NO | PRIVATE_KEYS_HANDLED: NO
```
