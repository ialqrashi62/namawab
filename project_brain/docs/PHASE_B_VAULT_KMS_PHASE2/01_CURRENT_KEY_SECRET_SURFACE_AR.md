# Phase 2 — سطح المفاتيح/الأسرار الحالي

> 2026-06-23 | جرد للقراءة فقط، بلا طباعة أي قيمة. لا إنشاء مفاتيح.

## الحالة
| العنصر | الوضع (بلا قيم) |
|---|---|
| **KEK at-rest** | DPAPI blob `C:\Users\ice\nama_kek.dpapi` (خارج repo، ACL=ice:F، CurrentUser). الوحيد للتشفير at-rest. |
| **escrow الـKEK** | PENDING_OWNER_ACTION (أداة `ops/security/nama_kek_escrow.ps1` جاهزة، لم تُشغّل). |
| **mfa_secret** | يُشفَّر at-rest عبر envelope/DPAPI عند التفعيل (مفعّلون حالياً: 0). |
| **phi_vault** | الملفات الجديدة تُشفَّر at-rest (ملفات حالياً: 0). |
| **.env (مفاتيح/أسرار)** | فقط `NAMA_KEK_PATH` (مسار، ليس سرّاً) + `SESSION_SECRET`. لا مفاتيح تكامل. gitignored. |
| **ZATCA CSID/شهادات** | **غير موجودة** (zatca_invoices=0؛ المسار محاكاة Phase 1). |
| **NPHIES mTLS/شهادات** | **غير موجودة**. |
| **تشفير النسخ** | غير مشفّرة (يعتمد على قرار المفتاح). |
| **مخاطر كشف سرّ runtime/Docker** | لا أسرار في images/compose الـsandbox؛ Redis/postgres على 0.0.0.0 (موجودان مسبقاً، ليسا من هذا العمل). |

## الفجوة التي تعالجها المرحلة 2
- DPAPI **مربوط بالجهاز/المستخدم** ⟹ DR هشّ (يحتاج escrow) ولا يصلح لحضانة مفاتيح خاصة تنظيمية (ZATCA CSID / NPHIES) في الإنتاج.
- لا حضانة مركزية للمفاتيح/الشهادات، لا تدوير مُدار، لا تدقيق استخدام مفتاح، لا فصل بيئات للمفاتيح.

## الخلاصة
الأساس (DPAPI) يعمل للمرحلة 1، لكن التكاملات التنظيمية + متانة DR تتطلّب **حضانة مفاتيح مستقلة عن الجهاز (Vault/KMS/HSM)** — وهو موضوع التقارير 02–05.
```text
KEK_PRESENT: YES (DPAPI) | ESCROW: PENDING_OWNER | ZATCA_CERTS: NONE | NPHIES_CERTS: NONE | BACKUP_ENCRYPTION: NONE
SECRETS_PRINTED: NO | KEYS_CREATED: NO
```
