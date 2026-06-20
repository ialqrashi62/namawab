# P1 fail-closed — الإغلاق النهائي (Final Closeout — Seeded & Deployed)

> المرحلة: `P1_FACILITY_TYPE_PRODUCTION_SEED_AND_FAIL_CLOSED_DEPLOY` | التاريخ: 2026-06-20
> (يحدّث الإغلاق السابق الذي كان DEPLOY_PENDING → الآن منشور ومُتحقَّق.)

## الحالة النهائية: **PASS**

| البند | القيمة |
| ----- | ------ |
| Final status | **PASS** |
| production facility_type before | **UNSET** (لا صف) |
| production facility_type after | **large_hospital** (معروف في السجل = `'*'`) |
| tenant/company affected | tenant id=1 فقط (Nama Medical Default Tenant) |
| data changed | **YES — محدود حصراً بـ `facility_type`** (مفتاح واحد، رفّع صفوف company_settings 8→9) |
| DDL executed | **NO** |
| files deployed | `server.js` (d7e74eeb), `facility_entitlements.js` (dc9b4f6d) — fail-closed، مطابقة للمحلي |
| backup paths | بيانات: قيمة UNSET (rollback=DELETE)؛ ملفات: `*.bak.20260620_062407` |
| rollback prepared | **YES** (DELETE المفتاح + استعادة الملفات + pm2 restart) |
| rollback used | **NO** |
| node check | PASS (server.js + facility_entitlements.js) |
| PM2 | online |
| health/smoke | PASS (200 UP، 301 redirect، login 401، protected-no-session 401) |
| entitlement verification | لا كسر: 12/12 مسار حساس مسموح لـ large_hospital؛ fail-closed فعّال (missing/read-error→403، unknown→422، تجاوز→403) |
| RLS P0 regression | **NONE** (0→3→0) |
| Redis/session | ACTIVE (PONG، 88 مفتاح) |
| secrets printed | **NO** |
| UTF-8 audit | **PASS** |
| git | namaweb 3e1c0cd (منشور) / parent (هذا الالتزام) — pushed بلا force |

## المخاطر المتبقية
1. **تحقق 403 الحيّ لمستأجر مقيّد غير متاح** دون إنشاء/تحويل مستأجر مقيّد (تغيير بيانات إضافي رفضته القواعد). أُثبت المنطق عبر الكود المنشور + الاختبارات الآلية. عند أول عميل مقيّد فعلي → تحقق حيّ كامل.
2. **تمييز نوع التقرير الدقيق** داخل موديول `reports` الموحّد (مالي/سريري/مخزون) تحسين مستقبلي.
3. أي مسار `/api/` جديد يجب تصنيفه في `SEGMENT_TO_MODULE` وإلا يُحجب (default-deny مقصود) — يُراعى عند إضافة موديولات.
4. الاستحقاقات في `company_settings` (key/value) لا نموذج DB مخصّص — تحسين DDL اختياري لاحقاً.

## معيار PASS — التحقق
- ✅ facility_type مضبوط بقيمة معروفة (large_hospital) | ✅ fail-closed منشور على الإنتاج | ✅ health/auth لا ينكسر | ✅ المستأجر الأساسي يعمل بكامل موديولاته | ✅ المسارات الحساسة fail-closed عند missing/unknown/read-error | ✅ RLS P0 لا يتراجع | ✅ rollback جاهز ولم يُستخدم | ✅ لا DDL | ✅ تغيير بيانات محدود وموثّق | ✅ التقارير مكتملة | ✅ UTF-8 PASS.

```
STATUS: P1_FACILITY_TYPE_PRODUCTION_SEED_AND_FAIL_CLOSED_DEPLOY_COMPLETED
FINAL_STATUS: PASS
FACILITY_TYPE_BEFORE: unset ; FACILITY_TYPE_AFTER: large_hospital ; TENANT_AFFECTED: 1
DATA_CHANGED: YES (facility_type only) ; DDL_EXECUTED: NO
PRODUCTION_DEPLOYED: YES ; ROLLBACK_PREPARED: YES ; ROLLBACK_USED: NO
SENSITIVE_FAIL_CLOSED: YES ; NO_BREAKAGE: 12/12 sensitive allowed (large_hospital)
RLS_P0_REGRESSION: NONE ; REDIS: ACTIVE (88 keys)
SECRETS_PRINTED: NO ; UTF8_ARABIC_AUDIT: PASS
GIT: namaweb 3e1c0cd + parent pushed (no force)
NEXT: P1 maturity (accounting posting / lab-rad approval / FEFO / security P1) | WAVE2B (DDL approval) | live restricted-tenant 403 at first restricted client
```

`FINAL_CLOSEOUT_COMPLETE — P1 FACILITY ENTITLEMENT SEEDED + FAIL-CLOSED DEPLOYED`
