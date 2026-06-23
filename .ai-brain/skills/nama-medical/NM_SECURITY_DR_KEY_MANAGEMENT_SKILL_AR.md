# NM_SECURITY_DR_KEY_MANAGEMENT_SKILL

**الغرض**: إدارة المفاتيح/الأسرار/التشفير at-rest/DR. **التفعيل**: أي بوابة تمسّ مفاتيح/escrow/Vault/KMS/نسخ مشفّرة/تشفير.

## الحالة الحالية
- A3 at-rest: **منشور (DPAPI)** — `crypto_envelope.js` (AES-256-GCM) + KEK محمي DPAPI في `~/nama_kek.dpapi` (خارج repo، ACL ice:F، CurrentUser). يشفّر `mfa_secret` + ملفات `phi_vault` الجديدة؛ graceful + legacy passthrough.
- **KEK escrow = PENDING_OWNER_ACTION**: أداة `ops/security/nama_kek_escrow.ps1` (owner-run، AES-CBC+HMAC/PBKDF2، passphrase SecureString). الوكيل لا يشغّلها (لا يلمس KEK الخام).
- Vault/KMS المرحلة 2 = CANDIDATE (docs/PHASE_B_VAULT_KMS_PHASE2): Hybrid، DPAPI→Vault on-prem (عام) + Vault-PKI/HSM (مفاتيح تنظيمية)، re-wrap بلا إعادة تشفير.

## القواعد
لا طباعة/التزام KEK/DEK/DPAPI blob/passphrase؛ المفاتيح خارج git؛ الـescrow output gitignored (`nama_kek_escrow*.enc`)؛ DPAPI machine/user-bound ⟹ DR يحتاج escrow؛ rehearsal على dummy قبل أي re-wrap إنتاجي؛ restore drill دوري؛ break-glass = escrow + موافقة مزدوجة.

## ممنوع
إنشاء/تشغيل re-wrap إنتاجي بلا Vault/KMS متوفّر + موافقة؛ ALTER عشوائي على prod؛ تخزين مفتاح خاص تنظيمي بـDPAPI للإنتاج.

## التصنيفات
`COMPLETED · PENDING_OWNER_ACTION · CANDIDATE_READY · BLOCKED_PENDING_KEY_INFRASTRUCTURE · BLOCKED_PENDING_OWNER_APPROVAL`.

## حقول الإغلاق
`KEY_MODEL · KEK_PROVIDER · KEYS_CREATED(NO unless provisioning) · KEY_PRINTED(NO) · DPAPI_BLOB_COMMITTED(NO) · BACKUP_CREATED · REHEARSAL_STATUS · RESTORE_IMPLICATIONS · NEXT`.
