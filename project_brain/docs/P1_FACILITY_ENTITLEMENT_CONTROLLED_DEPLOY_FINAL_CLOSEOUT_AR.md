# P1 نشر استحقاقات المنشأة — 03 الإغلاق النهائي (Controlled Deploy Final Closeout)

> المرحلة: `P1_FACILITY_ENTITLEMENT_CONTROLLED_PRODUCTION_DEPLOY` | التاريخ: 2026-06-20

## الحالة النهائية: **PASS**

| البند | القيمة |
| ----- | ------ |
| Final status | **PASS** |
| Production deployed | **YES** |
| Backup path | `/var/www/namaweb/server.js.bak.20260620_060249` (facility_entitlements.js جديد → rollback=حذف) |
| Files deployed | `server.js` (md5 97aa0437), `facility_entitlements.js` (md5 89a9e81c) — مطابقة للمحلي |
| Commit deployed | namaweb `9897a6a` / parent `b206272` |
| Syntax check | PASS (server.js + facility_entitlements.js) |
| PM2 restart | PASS (online) |
| Health/smoke | PASS (200 UP، 301 redirect، لا أخطاء جديدة) |
| Entitlement HTTP checks | HTTP حيّ: common=200، protected بلا جلسة=401؛ قرارات الإنفاذ عبر الكود المنشور 9/9 PASS (الإنتاج حالياً unset/permissive — 403 الحيّ يحتاج tenant مقيّد، موثّق) |
| Direct API bypass | محجوب — مسار عميق لنوع مقيّد → 403 (عبر الكود المنشور) |
| RLS P0 regression | **NONE** (patients 0→3→0 عبر الكود المنشور) |
| Rollback prepared | **YES** |
| Rollback used | **NO** |
| DDL executed | **NO** |
| Production data changed | **NO** |
| Secrets printed | **NO** |
| UTF-8 Arabic audit | **PASS** |

## المخاطر المتبقية
1. **fail-open** (خطر متبقٍ موثّق): الحارس يُمرّر عند خطأ قراءة غير متوقع، ونوع المنشأة غير المضبوط يُعامَل كـ permissive. مقبول مؤقتاً لتجنّب كسر الإنتاج، **لكنه ليس الحالة الأمنية النهائية**. التوصية:
   - بعد ضمان وجود facility_type صحيح لكل tenant → تحويل المسارات الحساسة (clinical/financial/pharmacy/inventory) إلى **fail-closed**، مع allowlist للمسارات العامة فقط.
   - **لا يُنفَّذ الآن** إلا بكود مغطّى بالاختبارات لا يكسر الإنتاج.
2. **الإنتاج unset/permissive**: لا يُلاحَظ 403 حيّ حتى يُضبط نوع منشأة مقيّد (تغيير بيانات بموافقة منفصلة) — أُثبت المنطق عبر الكود المنشور read-only.
3. الاستحقاقات في `company_settings` (key/value) لا نموذج DB مخصّص — تحسين DDL مستقبلي اختياري.
4. عند تفعيل المستأجرين متعددي الأنواع لاحقاً: التحقق الحيّ الكامل لكل نوع عبر HTTP بجلسات اختبار.

## معيار PASS — التحقق
- ✅ نُشر على الإنتاج | ✅ PM2 online | ✅ health/smoke PASS | ✅ الإنفاذ على مستوى API يعمل (مُثبت عبر الكود المنشور) | ✅ التجاوز المباشر محجوب | ✅ RLS P0 لم يتراجع | ✅ rollback جاهز ولم يُستخدم | ✅ لا DDL | ✅ لا تغيير بيانات | ✅ التقارير مكتملة | ✅ UTF-8 PASS.

## المرحلة التالية المقترحة
1. (اختياري بموافقة) ضبط نوع منشأة اختباري لمستأجر اختبار للتحقق الحيّ الكامل لـ403 — أو الانتظار لأول عميل مقيّد.
2. تحويل fail-open → fail-closed للمسارات الحساسة (مرحلة كود + اختبارات منفصلة).
3. بقية P1: محرك الترحيل المحاسبي، فصل اعتماد المختبر/الأشعة، FEFO الصيدلية، الأمن P1 (CORS/CSRF/أسرار/قفل حساب).
4. أو `P0_TENANT_ISOLATION_WAVE2B_CLASSA` بموافقة DDL منفصلة.

```
STATUS: P1_FACILITY_ENTITLEMENT_CONTROLLED_PRODUCTION_DEPLOY_COMPLETED
FINAL_STATUS: PASS
PRODUCTION_DEPLOYED: YES
ROLLBACK_PREPARED: YES ; ROLLBACK_USED: NO
DDL_EXECUTED: NO ; PRODUCTION_DATA_CHANGED: NO ; SECRETS_PRINTED: NO
RLS_P0_REGRESSION: NONE
UTF8_ARABIC_AUDIT: PASS
NEXT: fail-open→fail-closed (sensitive routes) | P1 maturity | WAVE2B (DDL approval)
```

`CONTROLLED_DEPLOY_FINAL_CLOSEOUT_COMPLETE`
