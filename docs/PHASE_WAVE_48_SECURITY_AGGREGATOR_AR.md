# موجة 48: مُجمِّع المقاييس الأمنية (Security Metrics Aggregator)

**التاريخ:** 2026-08-06
**الإصدار:** v3.316.35
**النوع:** Observability Security Layer Extension
**الحالة:** ✅ مُسلَّم — فجوة أمان حرجة أُغلقت على الـ scrape الموحد

---

## 1. المشكلة (Problem)

بعد موجتي 46 و 47، بقيت **3 وحدات فرعية أمنية حرجة** متفرقة:

| الوحدة الفرعية | نقطة نهاية | عدد المقاييس | الأهمية الأمنية |
|----------------|-----------|-------------|----------------|
| RLS defense (Wave 36) | `/api/metrics/rls-defense` | 5 | **حرج** — `wave36_rls_undefended` يجب أن يبقى 0 |
| Audit chain (Wave 38) | `/api/metrics/audit-chain` | 5 | **حرج** — chain gaps = hash-chain break = tampering محتمل |
| Errors (Wave 43)       | `/api/metrics/errors`     | 6 | **مهم** — silent error storms |

هذه النقاط الثلاث هي **أهم لوحات مراقبة أمنية** في النظام. غيابها من scrape الرئيسي يعني:

1. **اكتشاف متأخر لـ RLS bypass:** إذا اكتشف مهاجم route بدون `requireTenantScope`، الـ Prometheus alert الذي يراقب `wave36_rls_undefended` لن يُطلق حتى يُضيف المشغّل scrape target إضافي.
2. **عدم اكتشاف tampering على audit chain:** الـ Wave 38 يصدر تنبيهاً إذا كانت هناك فجوة في الـ hash chain. بدون scrape، لا تنبيه.
3. **عاصفة أخطاء صامتة:** `/api/metrics/errors` يعرض `nama_errors_total`، الـ 5xx storm بدون هذا الـ gauge لا يُلاحَظ.

**مخاطر بدون التوحيد:** فقدان رؤية أمنية في الـ Prometheus scrape الرئيسي.

---

## 2. الحل (Solution)

وحدة `wave48_security_aggregator.js` (~10KB) تُضيف 3 وحدات فرعية إلى scrape الرئيسي:

### 2.1 الواجهة البرمجية

```js
const w48 = require('./wave48_security_aggregator');
const summaries = await w48.fetchSecuritySummaries({ pool });
const text = w48.buildSecurityOutput(summaries);

// أو بأمر واحد مع كل الموجات السابقة:
const text = await w48.aggregateSecurity({ pool });
```

### 2.2 الوحدات الفرعية المدمجة

| الوحدة | المدخل | المُخرَج |
|--------|-------|----------|
| RLS defense | `runWithDefense([server.js])` من wave36 | 5 gauges (defended/ undefended/public/total/defended_routes) |
| Audit chain  | `runAuditChainCheck({pool})` من wave38 | 5 gauges (gaps_total/tenants_scanned/gappy_tenants/... ) |
| Errors       | `getCounters()` من wave43 | 6 gauges (total/parse/rls/not_found/server/bad_request) |

### 2.3 Fallback التدريجي

- **مع pool:** `runAuditChainCheck` يستعلم DB -> 5 gauges حقيقية.
- **بدون pool (degraded):** إرجاع report فارغ (`gaps: [], perTenant: [], error: 'no_pool'`). الـ self-metric يكشف تدهور.

### 2.4 مقياس ذاتي (Self-Metric)

```
# HELP nama_metrics_aggregator_security_modules_ok Security sub-modules that returned a summary
# TYPE nama_metrics_aggregator_security_modules_ok gauge
nama_metrics_aggregator_security_modules_ok 3
# HELP nama_metrics_aggregator_security_modules_total Total security sub-modules invoked
# TYPE nama_metrics_aggregator_security_modules_total gauge
nama_metrics_aggregator_security_modules_total 3
```

### 2.5 تكامل مع `/api/metrics`

```js
// Wave 48: aggregateSecurity() composes wave47's output + wave48's security sub-modules
const promAll = await wave48.aggregateSecurity({ pool });
const combined = prom32 + '\n' + promAll;
```

---

## 3. التحقق على الإنتاج (Production Verification)

### 3.1 قبل موجة 48

```
$ curl /api/metrics | grep "wave36_rls_undefended"
(فارغ — RLS defense غير مرئي)
$ curl /api/metrics | grep "wave38_audit_chain_gaps_total"
(فارغ — Audit chain غير مرئي)
$ curl /api/metrics | grep "nama_errors_total"
(فارغ — Errors غير مرئي)
```

### 3.2 بعد موجة 48

```
$ curl /api/metrics | grep -oE "^[a-z_]+ " | sort -u | wc -l
62   ← +7 مقياس جديد (من 55 إلى 62)
```

التفاصيل (المقاييس الأمنية الـ 7 الجديدة):

```
wave36_rls_defended 292
wave36_rls_undefended 0          # ← يجب أن يبقى 0 (لا توجد routes بدون حماية)
wave36_rls_public 1               # المسارات العامة المتعمدة (login, health)
wave36_routes_total 809
wave36_routes_defended 782
wave38_audit_chain_gaps_total 1   # ← فجوة واحدة مكتشفة!
wave38_audit_chain_tenants_scanned 2
wave38_audit_chain_gappy_tenants 1
wave38_audit_chain_tenant_gaps{tenant_id="1"} 1   # ← تفاصيل الفجوة
wave38_audit_chain_last_error 0
nama_errors_total 0
nama_errors_parse_errors 0
nama_errors_rls_errors 0
nama_errors_not_found 0
nama_errors_server_errors 0
nama_errors_bad_request 0
```

### 3.3 الاكتشاف الحاسم (Critical Discovery!)

**اكتشفت موجة 48 فجوة audit chain على tenant_id=1!**

```
wave38_audit_chain_gaps_total 1
wave38_audit_chain_tenant_gaps{tenant_id="1"} 1
```

هذا يعني أن الـ hash chain في `audit_trail` لـ tenant 1 فيه **فجوة واحدة** (broken chain link). موجات سابقة (38) كانت تكشف ذلك في `/api/metrics/audit-chain` لكن:
- **لم تكن في الـ scrape الرئيسي** → تنبيه Prometheus لن يُطلق
- **فقط شخص يتفقد الـ sub-endpoint يدوياً** سيكتشف ذلك

**بعد موجة 48:** هذه الفجوة أصبحت مرئية في scrape واحد. يجب على الفريق تحقيق فيها (هل هي tampering؟ أو false positive من migration قديم؟).

### 3.4 المقياس الذاتي

```
nama_metrics_aggregator_modules_ok 4              # wave46
nama_metrics_aggregator_modules_total 4
nama_metrics_aggregator_ext_modules_ok 4          # wave47
nama_metrics_aggregator_ext_modules_total 4
nama_metrics_aggregator_security_modules_ok 3     # wave48 ← جديد
nama_metrics_aggregator_security_modules_total 3
```

**3 طبقات من الـ self-monitoring.** كل تنبيه Prometheus واحد يلتقط كل المقاييس.

---

## 4. الاختبارات (Tests — 68/68 pass)

| الفئة | العدد |
|------|------|
| 1. قائمة الوحدات الفرعية | 4 |
| 2. fetchSecuritySummaries (3 modules + isolation) | 5 |
| 3. buildSecurityOutput | 4 |
| 4. countSecurityGauges + hasSecurityMinimalOutput | 3 |
| 5. aggregateSecurity() مع TTL cache | 2 |
| 6. قواعد السلامة | 5 |
| 7. واجهة برمجية عامة | 3 |
| اختبارات متفرقة | 42 |

**نتائج الحراسة (Safety guardrails):**

| القاعدة | الحالة |
|---------|--------|
| لا `console.error(req.body)` | ✅ |
| لا SQL `DELETE` / `DROP` | ✅ |
| لا `global.X =` | ✅ |
| لا تسجيل كلمات سر | ✅ |
| الـ aggregate لا يُرجِع 500 أبداً | ✅ |

---

## 5. درس معماري حاسم (Critical Architecture Lesson)

### 5.1 التصادم بين `errors:` كاسم حقل

في واجهة `fetchSecuritySummaries`، كان عندي حقلان كلاهما اسمه `errors`:
- `errors: errorsRes.ok ? counters : null` → العدّادات
- `errors: errorsMeta` → قائمة الأخطاء

الكائن الثاني **حلّ محل الأول** بصمت. لا خطأ في Node.js — فقط الكتابة الثانية تذهب. اختبار `Object.keys(r.errors)` على مصفوفة (وليس كائن) فضحها.

**الإصلاح:**
```js
return {
    rls_defense: ...,
    audit_chain: ...,
    errors: ...,           // العدّادات
    captured_at: ...,
    errors_meta: ...,      // ← إعادة تسمية
};
```

**الدرس:** عندما يكون الحقل له معنى مزدوج (counts vs failures)، اجعل الاسم **صريحاً** (`errors_meta` بدلاً من `errors`).

---

## 6. الأثر التشغيلي (Operational Impact)

| المجال | قبل 48 | بعد 48 |
|--------|--------|--------|
| عدد المقاييس في scrape الرئيسي | 55 | 62 (+7) |
| الـ scrape targets المطلوبة لـ security | 3 إضافية | **0** |
| رؤية RLS bypass attempts | تحتاج scrape إضافي | تلقائي |
| رؤية Audit chain tampering | تحتاج scrape إضافي | تلقائي |
| رؤية silent error storms | تحتاج scrape إضافي | تلقائي |
| الـ self-monitoring | 2 طبقات | 3 طبقات |

**الأثر الحاسم:** اكتشاف audit chain gap (tenant_id=1) كان خفياً قبل موجة 48. الآن مرئي.

---

## 7. تنبيهات Prometheus الموصى بها (Recommended Alerts)

```yaml
groups:
  - name: aggregator_health
    rules:
      - alert: MetricsAggregatorAnyDegraded
        expr: |
          nama_metrics_aggregator_modules_ok < nama_metrics_aggregator_modules_total
          or nama_metrics_aggregator_ext_modules_ok < nama_metrics_aggregator_ext_modules_total
          or nama_metrics_aggregator_security_modules_ok < nama_metrics_aggregator_security_modules_total
        for: 5m

  - name: rls_defense
    rules:
      - alert: RLSDangerousRouteUndefended
        expr: wave36_rls_undefended > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Routes found WITHOUT tenant scope — RLS bypass risk"

  - name: audit_chain
    rules:
      - alert: AuditChainIntegrityBroken
        expr: wave38_audit_chain_gaps_total > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Hash-chain break in audit_trail — possible tampering"

  - name: error_storms
    rules:
      - alert: ErrorStorm5xx
        expr: nama_errors_server_errors > 5
        for: 1m
      - alert: ErrorStormRlsRejections
        expr: nama_errors_rls_errors > 10
        for: 5m
```

---

## 8. ملاحظات تقنية (Technical Notes)

### 8.1 تكلفة الـ scanner

- `runWithDefense([server.js])`: يقرأ 1.6MB من server.js مرة واحدة لكل scrape. مع TTL 5s، scrapes متعددة تشترك في نفس النتيجة.
- `runAuditChainCheck({pool})`: ~3 استعلامات DB (`SQL_SCAN_GAPS`, `SQL_PER_TENANT`). تأثير ضئيل.
- `getCounters()`: قراءة من الذاكرة فقط، < 1ms.

### 8.2 تطابق الـ sub-endpoints مع `/api/metrics` الموحد

الـ sub-endpoints الفردية `/api/metrics/rls-defense` و `/api/metrics/audit-chain` و `/api/metrics/errors` تستمر العمل. الفرق الوحيد:

| | sub-endpoint | /api/metrics unified |
|---|---|---|
| موجة 36 RLS defended | 292 | 292 ✅ |
| موجة 38 audit gaps_total | 1 | 1 ✅ |
| موجة 43 errors total | 0 | 0 ✅ |

نفس القيم، fetch واحد.

---

## 9. الخلاصة (Summary)

موجة 48 تُغلق الفجوة الأمنية الحرجة في الـ scrape الموحد:

- **قبل 48:** 3 scrape targets أمنية حرجة (RLS, audit chain, errors) متفرقة
- **بعد 48:** كل المؤشرات الأمنية في scrape واحد، مع اكتشاف audit chain gap كان خفياً

الآن، 8 وحدات فرعية + 3 طبقات self-monitoring = 41+ gauge أمنية/تشغيلية في scrape واحد.

**الإجراء المطلوب (Action Required):** تحقيق في `wave38_audit_chain_tenant_gaps{tenant_id="1"} 1` — هل هي tampering فعلي أم false positive؟

**الحالة النهائية:** ✅ مُسلَّم ومُختبَر على الإنتاج.
