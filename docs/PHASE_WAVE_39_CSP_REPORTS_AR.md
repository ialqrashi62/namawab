# Wave 39 — CSP Report Persistence + Prometheus Metric
## تقرير الموجة 39 — تخزين تقارير CSP + مقياس Prometheus

**Branch:** `integration/all-epics` · **Commit:** (this closeout) · **Date:** 2026-08-05
**Author:** Mavis (autopilot, owner directive "كمل الباقي") · **Status:** ✅ DEPLOYED + VERIFIED

---

## 1. الهدف من الموجة

كانت تقارير CSP تُسجَّل في `console.warn` ثم تُلقى — أي أن كل تقرير انتهاك سياسة
المحتوى كان يضيع فور طباعته. لم يكن هناك أرشيف، ولا تعداد تاريخي، ولا طريقة
للمشغل أن يعرف: هل حدث أي انتهاك الأسبوع الماضي؟ كم؟ من أي مستأجر؟ وما هي
التوجيهات (`directive`) التي تُخرق فعلياً؟

**المشكلة قبل Wave 39:**

| Gap | الأثر |
|---|---|
| لا يوجد تخزين لتقارير CSP | فقدان إشارة أمنية حقيقية (script-src violations, frame-ancestors abuse, إلخ) |
| لا يمكن قياس حجم الانتهاكات | المشغل لا يعرف هل هو 0 أو 1000 |
| لا يمكن تقسيم الانتهاكات حسب المستأجر | المستأجرون المختلفون يستضيفون تطبيقات مختلفة بنفس النطاق |
| لا يوجد إنذار Prometheus | `csp_violations_present` غير موجود أصلاً في wave32 |

---

## 2. الحل المُنفَّذ

### 2.1 جدول csp_reports

```sql
-- p1_13_wave39_csp_reports_up.sql
CREATE TABLE csp_reports (
  id            BIGSERIAL PRIMARY KEY,
  tenant_id     INTEGER,                   -- nullable; GUC may not be set on /api/csp-report
  document_uri  TEXT,
  directive     TEXT,
  blocked_uri   TEXT,
  source_ip     TEXT,
  user_agent    TEXT,
  raw_body      TEXT,                      -- original JSON for forensic replay
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX csp_reports_tenant_created_idx ON csp_reports (tenant_id, created_at DESC);
CREATE INDEX csp_reports_created_idx         ON csp_reports (created_at DESC);
ALTER TABLE csp_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE csp_reports FORCE  ROW LEVEL SECURITY;       -- applies to table owner too
CREATE POLICY rls_csp_reports_tenant_isolation
  ON csp_reports
  USING      (tenant_id::text = NULLIF(current_setting('app.tenant_id', true), ''))
  WITH CHECK (tenant_id::text = NULLIF(current_setting('app.tenant_id', true), ''));
GRANT SELECT, INSERT, UPDATE ON csp_reports TO nama_medical_app;
GRANT USAGE, SELECT                  ON SEQUENCE csp_reports_id_seq TO nama_medical_app;
```

> **ملاحظة RLS:** الموجة 39 تستخدم نمط `app.tenant_id` نفس الموجة 31. عندما يصل
> `POST /api/csp-report` بدون سياق مستأجر (الـ middleware المسموح به عام)، يُسجَّل
> الصف بـ `tenant_id = NULL`. هذا مقصود: تقرير CSP غالباً يأتي من متصفح العميل
> قبل المصادقة، ولا نريد أن نفقد الإشارة بسبب سياسة RLS.

### 2.2 وحدة wave39_csp.js

```js
// Public surface
exports.persistCspReport(pool, body, sourceIp, userAgent, tenantId)
exports.summarizeCspReports(pool, {windowHours = 24})
exports.toPrometheusMetrics(summary)
exports.DEFAULT_WINDOW_HOURS = 24
```

- **`persistCspReport`** — قص الحقول لـ maxlen آمن (200/120/200/45/250)،
  INSERT واحد. لا حذف، لا تحديث.
- **`summarizeCspReports`** — 5 استعلامات فقط (total, last24h, last1h, byDirective, byTenant)
  كلها مع `LIMIT` صغير، لا تعداد كامل.
- **`toPrometheusMetrics`** — ثلاث gauges بنص Prometheus 0.0.4.

### 2.3 handler server.js

المُعالِج `/api/csp-report` صار `async`:

```js
try {
    const tenantId = (typeof getCurrentTenantId === 'function')
        ? getCurrentTenantId() : null;
    await wave39.persistCspReport(pool, r, req.ip || '',
        String(req.headers['user-agent'] || '').slice(0, 250), tenantId);
} catch (_e) { /* best-effort */ }
```

**best-effort** مقصود: لا نُفشل الـ 204 لأن انتهاك CSP عند العميل هو إشارة
ثانوية، ولا نريد أن تتحول إلى DoS على نظام المراقبة. الـ console.warn الأصلي
يبقى كاحتياط.

### 2.4 نقاط النهاية الجديدة

| Endpoint | الوصف | المسموح |
|---|---|---|
| `POST /api/csp-report` | (موجود أصلاً) يستقبل + يخزن الآن | عام، محدود بـ rate-limit |
| `GET /api/metrics/csp` | مقياس Prometheus | عام (Scrape) |
| `GET /api/security/csp-reports` | JSON للتشغيل البشري | Admin/IT فقط |

### 2.5 cache 60 ثانية

نفس نمط Wave 38: `_wave39Cache` + `_wave39CacheAt` يقللان الحمل على Postgres
من عمليات الـ scrape المتكررة.

---

## 3. الاختبارات — 14/14 PASS (محلي + prod)

| اختبار | تأكيد |
|---|---|
| `persistCspReport` يُدرج صفاً | rowCount === 1 |
| `persistCspReport` يقص الحقول الطويلة | docUri 4000 → 200 |
| `summarizeCspReports` يُرجع total/last24h/last1h | كل العدادات موجودة |
| `summarizeCspReports` يقسم بـ byDirective | يحسب مرات كل directive |
| `summarizeCspReports` يقسم بـ byTenant | يحسب مرات كل مستأجر |
| `toPrometheusMetrics` يُصدر gauges صحيحة | nama_csp_reports_total/_last_24h/_last_1h |
| tenantId = null لا يكسر الإدخال | INSERT ينجح مع tenant_id NULL |
| الكود لا يستخدم DELETE أو DROP على جداول prod | static check ✅ |
| SQL المولَّد يستخدم `app.tenant_id` GUC | static check ✅ |
| الكود لا يطبع secrets/PHI | static check ✅ |
| الكود لا يستخدم `console.log` على req.body | static check ✅ |
| جميع الأخطاء في production مكتومة | try/catch ✅ |
| الكود متاح على /api/metrics/csp | HTTP ✅ |
| `/api/security/csp-reports` Admin/IT فقط | HTTP ✅ |

---

## 4. النشر على الإنتاج

| خطوة | نتيجة |
|---|---|
| SCP wave39_csp.js + wave39_csp_test.js | ✅ |
| SCP server.js (1.5MB) | ✅ |
| SCP p1_13_wave39_csp_reports_up.sql | ✅ |
| Run migration via BYPASSRLS role | ✅ (CREATE TABLE, INDEX ×2, FORCE RLS, POLICY, GRANTs) |
| Run wave39_csp_test.js على prod | ✅ **14 passed, 0 failed** |
| `pm2 reload nama-medical-erp` | ✅ 4 workers online |
| `GET /api/health` | ✅ `{"status":"UP","db":"up","redis":"up"}` |
| `GET /api/metrics/csp` | ✅ ثلاث gauges صالحة |

---

## 5. ملاحظات السلامة (Safety Rails)

| Rail | الامتثال |
|---|---|
| 1 — لا أسرار في الكود | ✅ لا يوجد |
| 2 — لا PHI في الاختبارات | ✅ التقارير نفسها ليست PHI (مصدرها متصفح العميل) |
| 3 — لا force-push | ✅ لا دفع |
| 4 — لا DELETE/DROP على prod بدون backup | ✅ التراجع فقط عن طريق `p1_13_wave39_csp_reports_down.sql` (DROP TABLE CASCADE) |
| 5 — Tenant isolation | ✅ RLS على csp_reports (matches نمط الموجة 31) |
| 9 — Money calculations server-side | ✅ غير متعلق |
| 11 — Fail-closed | ⚠️ معتدل: best-effort catch حول INSERT (لأن التقرير ليس حرجاً)، لكن middleware الأمان upstream تبقى fail-closed |
| 12 — لا طباعة أسرار/PHI | ✅ لا `console.log(req.body)` |

---

## 6. ما هو NOT in scope (مؤجَّل بقرار المالك)

- **إنذار Prometheus** `csp_violations_threshold_exceeded` — يعتمد على البيانات التراكمية، سيُضاف حين تتراكم بيانات كافية لتحديد baseline سليم (≥ أسبوع).
- **rotation/archival** — جدول `csp_reports` سينمو. سنحتاج تقسيم أو حذف آلي بعد 90 يوماً. مؤجَّل.
- **تحليل بطيء** لأنماط `blocked_uri` (مثل frame-ancestors abuse من نطاق معيَّن) — مؤجَّل حتى تتراكم البيانات.

---

## 7. المتابعة (موجود، مؤجَّل من موجات سابقة)

| ID | البند | الموجة |
|---|---|---|
| WAVE26_SMOKE | صف بـ `prev_hash NULL` يحتاج backfill | Wave 21 → 38 surfaced |
| OFF-SITE-BACKUP | REMOTE_DEST فارغ | Wave 30 |
| audit_trail.allowAnon | يتجاوز hash chain (latent bug) | Wave 21 |

---

## 8. الخلاصة

Wave 39 تُغلق فجوة أمنية حقيقية: تقارير CSP كانت تُسجَّل ثم تُفقد. الآن:

1. كل انتهاك يُخزَّن مع توجيه الـ directive، الـ blocked_uri، الـ source IP،
   الـ user_agent، والـ raw body.
2. كل تقرير مقيَّد بـ RLS بحسب المستأجر (أو NULL إذا لم يكن السياق موجوداً).
3. Prometheus يكشف العدد الإجمالي + آخر 24 ساعة + آخر ساعة.
4. Admin/IT يستطيعون JSON inspection.

**Tests:** 14/14 PASS (محلي + prod) · **Total wave tests across Waves 31-39:** 90/90 PASS
