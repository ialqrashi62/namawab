# سجل المراحل بعد تفعيل RLS Runtime Enforcement (Master Phase Register)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_RLS_RUNTIME_ENFORCEMENT_RESELECT` | التاريخ: 2026-06-21.
> **حالة مُتحقَّق منها أرضياً**: التطبيق يتصل فعلاً كـ `nama_medical_app` (rolsuper=false، rolbypassrls=false)، RLS مُنفَّذ. LIVE_COMMIT الفعلي = **namaweb 039a7d7** (جلسة موازية تقدّمت بعد 10ded01)، parent aa502c4.

| Group | Domain | Current Status (مُتحقَّق) | Live? | Risk | Next |
| --- | --- | --- | :--: | :--: | --- |
| A | RLS runtime enforcement | **مُفعَّل فعلاً** — app=nama_medical_app، 120 FORCE / 121 policy، عزل مُثبَت على بيانات حقيقية | YES | مُغلق (P0 محلول) | مراقبة |
| B | Authenticated workflow UAT | **هذه المرحلة** — route auth 401 + عزل RLS تحت الدور (patients/invoices/audit) PASS | YES | P0 | إغلاق UAT |
| C | PHI / audit_trail governance | سياسة audit_trail (write-always/read-isolated/append-only) LIVE + logAudit stamping LIVE (شوهد +1 صف tenant1) | YES | منخفض | super-admin cross-tenant read عبر دور/VIEW (حوكمة) |
| D | Billing / invoice / receipt | invoices معزولة تحت الدور (tenant1=3)، أعمدة DDL موجودة، حُرّاس refund/partial/cancel منشورة | YES | متوسط | تحقق تدفّقات مصادقة لاحقاً |
| E | Accounting posting engine | flag OFF، journal=0، builders + runEventWithPosting جاهزة (fail-closed) | No | متوسط | `APPROVE_ENABLE_POSTING` لاحقاً (ليس الآن) |
| F | Pharmacy / inventory / FEFO | لم يُراجع تحت الدور؛ FEFO audit مؤجّل | ? | P4 | audit |
| G | Lab / radiology approvals | فصل الموافقات audit مؤجّل | ? | P4 | audit |
| H | Clinical (blood bank/nursing/ICU/eMAR/discharge) | blood-bank stamping LIVE؛ باقي المسارات تحت الدور تحتاج UAT مصادق موسّع | جزئي | P2 | UAT موسّع |
| I | Security hardening (CSRF/lockout/rate limiter/uploads) | rate limiter موجود خلف flag (OFF افتراضياً)؛ CSRF/lockout فجوة | جزئي | P5 | plan |
| J | Performance / operations | pm2 online مستقر، Redis hybrid store (جلسة موازية)، health 200 | YES | منخفض | مراقبة |
| K | Stitch / UI | BLOCKED_PENDING_MCP_AND_KEY | No | P6 | لا تبدأ |
| L | Git / governance / UTF-8 | متزامن؛ جلستان تشاركان المستودع (R17)؛ FF-only؛ .gitmodules غير مُسجَّل | YES | منخفض | حوكمة |

## ملاحظة حوكمة (جلسة موازية)
المستودع يُحدَّث من جلسة أخرى (commits aa502c4 parent / 039a7d7 namaweb: switch + stabilization + redis hybrid + /api/health + tailwind). يجب التحقق من الحالة قبل أي فعل، والدفع FF-only بلا force.

`MASTER_PHASE_REGISTER_COMPLETE`
