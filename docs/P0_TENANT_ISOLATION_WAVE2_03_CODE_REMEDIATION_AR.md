# P0 الموجة 2 — 03 معالجة الكود (Code Remediation)

> التاريخ: 2026-06-20 | الملف: `namaweb/server.js`.

## ما نُفّذ — Class B (14 مساراً، code-only، آمن للنشر)

لكل مسار: `requireTenantScope` + `getRequestTenantContext` + فلتر `tenant_id` للقراءة + ختم `tenant_id`/`facility_id` للإدراج + تحقق ملكية للتعديل + منع IDOR.

| الموديول | المسارات |
| -------- | -------- |
| الطب عن بعد | GET/POST/PUT `/api/telemedicine/sessions` |
| علم الأمراض | GET/POST/PUT `/api/pathology/cases` |
| الخدمة الاجتماعية | GET/POST/PUT `/api/social-work/cases` |
| خدمة الوفيات | GET/POST/PUT `/api/mortuary/cases` |
| ZATCA | GET `/api/zatca/invoices` + POST `/api/zatca/generate` (يتحقق من تبعية الفاتورة `i.tenant_id`) |

## ما لم يُمسّ عمداً (سلامة النشر)

- **blood_bank/approvals/package_sessions (Class A)**: لم تُعدَّل مساراتها في `server.js` لأن أعمدة `tenant_id` غير موجودة على الإنتاج؛ إضافة الفلتر تكسرها. تُعالَج كوداً في Wave 2b بالتزامن مع DDL المُعتمَد.
- **`db_postgres.js` لم يُعدَّل في هذه الموجة** — لا حاجة (Class B أعمدته موجودة)، ما يبقي النشر = ملف `server.js` فقط (أدنى مخاطرة).

## سلامة الإنتاج الحالي

النمط الشرطي `if (tenantId)` + وجود الأعمدة على الإنتاج يضمن عمل المسارات بعد النشر دون كسر. `requireTenantScope` يعيد 403 في الإنتاج بلا سياق.

`WAVE2_CODE_REMEDIATION_COMPLETE (Class B)`
