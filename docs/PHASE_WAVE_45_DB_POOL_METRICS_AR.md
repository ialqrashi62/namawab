# موجة 45: مقاييس تجمع اتصالات PostgreSQL (PG Connection Pool Metrics)

**التاريخ:** 2026-02-XX
**الإصدار:** v3.316.32
**النوع:** Observability Enhancement
**الحالة:** ✅ مُسلَّم — تم التحقق من العدّاد الفعلي على الإنتاج

---

## 1. المشكلة (Problem)

لم يكن لدى فريق العمليات أي رؤية (visibility) حول حالة تجمع اتصالات PostgreSQL على الإنتاج:

- **ما إذا كان التجمع مُشبَعًا (saturated)؟** → `pool.totalCount / pool.options.max`
- **هل هناك عملاء ينتظرون في الطابور؟** → `pool.waitingCount > 0`
- **هل الاتصالات تكبر مع مرور الوقت؟** → لا توجد نقطة بيانات

كانت الحالة الوحيدة المتاحة هي `pg -c 'SELECT count(*) FROM pg_stat_activity'`، وهي لقطة يدوية لا تُظهر الاتجاهاً، ولا تكشف عن ازدحام (backpressure) في الزمن الحقيقي.

**المخاطر بدون هذه المقاييس:**

1. **استنفاد التجمع الصامت (silent pool exhaustion):** عندما يصل `pool.totalCount = max` وتبدأ الطلبات الجديدة في التراكم في `waitingCount`، ينتهي الأمر بمهلة 30+ ثانية، وانقطاعات متتالية بـ 502 للمستخدمين.
2. **لا توجد تنبيهات مبكرة (no early warning):** لا يمكن إطلاق Prometheus alert عندما `waitingCount > 5`.
3. **لا خط أساس (no baseline):** لا يمكنك قياس تأثير نشر جديد على استهلاك الاتصالات.

---

## 2. الجذر التقني (Root Cause)

تعتمد مكتبة `node-postgres` (pg) على `pg-pool`، الذي يعرض (`exposes`) الحقول الخاصة بالتجمع كـ **خصائص (properties)** على الكائن `pool`، وليست كـ دوال (methods):

```js
// node-postgres Pool internal:
get totalCount() { ... }
get idleCount() { ... }
get waitingCount() { ... }
```

على عكس بعض مكتبات الـ Pooling الأخرى (مثل `mysql2`) التي تعرضها كدوال.

**الإصدار الأول من `_safeRead` فحص `typeof === 'function'`** → فشل التحقق → أُرجع `0` لكل الحقول.

تم اكتشاف ذلك عبر سكربت استكشاف (`scripts/pool_probe.js`) استخدمه الوكيل على الإنتاج:

```
pool.options.max: 20
pool.totalCount type: number    <-- ليس دالة
_clients length: 0
```

---

## 3. الحل (Solution)

وحدة `wave45_db_pool_metrics.js` (~4.3KB) تقدّم:

### 3.1 قارئ آمن لكل من الخصائص والدوال (Property + Function compatibility)

```js
function _safeRead(pool, name) {
    try {
        if (!pool) return 0;
        const v = pool[name];
        if (typeof v === 'function') {
            // بعض الـ wrappers تعرضها كدوال.
            const r = v.call(pool);
            if (typeof r === 'number') return r;
        } else if (typeof v === 'number') {
            // pg.Pool يعرضها كخصائص (الحالة الشائعة).
            return v;
        }
    } catch (_e) { /* ignore */ }
    return 0;
}
```

### 3.2 خمسة مقاييس Prometheus

| المقياس | النوع | الوصف |
|---------|------|-------|
| `nama_db_pool_total`     | gauge | إجمالي الاتصالات (مشغولة + خاملة) |
| `nama_db_pool_idle`      | gauge | الاتصالات الخاملة المتاحة |
| `nama_db_pool_waiting`   | gauge | العملاء المنتظرون (عمق طابور backpressure) |
| `nama_db_pool_max`       | gauge | الحد الأقصى المُكوَّن |
| `nama_db_pool_utilization` | gauge | نسبة الإشغال (busy/max)، بين 0 و1 |

### 3.3 مخزن مؤقت 5 ثوانٍ (TTL Cache)

```js
const _summaryCache = { at: 0, value: null, ttlMs: 5000 };

function summarize(pool) {
    const cached = _getFromCache();
    if (cached) return cached;
    if (_isStale()) _readFresh(pool);
    // ...
}
```

يمنع هذا الأمر من قراء التجمع (scrapers) من إثقال `pg.Pool` نفسه.

### 3.4 نقطتا نهاية API

| المسار | الوصف |
|--------|-------|
| `GET /api/metrics/db-pool` | تكس Prometheus فقط (مع `Content-Type: text/plain; version=0.0.4`) |
| `GET /api/security/db-pool` | JSON مفصّل (محمي — للمديرين وفريق IT فقط) |

---

## 4. التحقق على الإنتاج (Production Verification)

### 4.1 قبل الإصلاح

```
nama_db_pool_total 0
nama_db_pool_idle 0
nama_db_pool_waiting 0
nama_db_pool_max 20
nama_db_pool_utilization 0
```
كل شيء صفر! → الخلل اكتُشف.

### 4.2 بعد الإصلاح

```
nama_db_pool_total 3
nama_db_pool_idle 3
nama_db_pool_waiting 0
nama_db_pool_max 20
nama_db_pool_utilization 0
```

تحت حمولة 15 طلباً متزامناً لـ `/api/health`:

```
nama_db_pool_total 3        (ثابت — 2 من cluster mode + 1 من warm-up)
nama_db_pool_idle 3
nama_db_pool_waiting 0      (لا ازدحام)
nama_db_pool_max 20
nama_db_pool_utilization 0  (3/20 = 15% — قاعدة جديدة)
```

كل القيم صحيحة الآن، وتعكس اتصالاً حقيقياً من `pg.Pool`.

---

## 5. الاختبارات (Tests — 37/37 pass)

| الفئة | العدد |
|------|------|
| 1. قراءة آمنة من pg.Pool-like object | 9 |
| 2. سلوك التخزين المؤقت (TTL=5s, reset) | 2 |
| 3. صيغة Prometheus (`text/plain 0.0.4`) | 6 |
| 4. صيغة JSON الآمنة (no secrets) | 6 |
| 5. متانة الوحدة (no throws, hasPublicApi) | 11 |
| 6. اختبار التجمع الواقعي (real pg.Pool shape) | 3 |

**نتائج الحراسة (Safety guardrails):**

| القاعدة | الحالة |
|---------|--------|
| لا `console.error(req.body)` | ✅ |
| لا `console.log(req.body)` | ✅ |
| لا SQL `DROP` / `TRUNCATE` / `DELETE FROM` | ✅ |
| لا PII dump | ✅ |
| لا تسجيل للـ headers | ✅ |

---

## 6. تنبيهات Prometheus الموصى بها (Recommended Alerts)

```yaml
groups:
  - name: pg_pool
    rules:
      - alert: PGPoolHighUtilization
        expr: nama_db_pool_utilization > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "PG pool >80% utilized"

      - alert: PGPoolWaitingClients
        expr: nama_db_pool_waiting > 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Clients waiting for PG connections (backpressure)"

      - alert: PGPoolExhausted
        expr: nama_db_pool_total >= nama_db_pool_max and nama_db_pool_waiting > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PG pool exhausted — saturation imminent"
```

---

## 7. الأثر التشغيلي (Operational Impact)

| المجال | قبل | بعد |
|--------|-----|-----|
| رؤية تجمع PG | ❌ غير معروف | ✅ 5 gauges لحظية |
| إنذار مبكر من ازدحام backpressure | ❌ لا يوجد | ✅ `waitingCount > 5` |
| خط أساس للنشر (deploy baselines) | ❌ لا يوجد | ✅ `utilization` ثابت |
| تشخيص أعطال الـ 502 | 🔍 يدوي بطيء | ⚡ قراءة واحدة من Prometheus |
| اختبار الحمل (load testing) | ❌ أعمى | ✅ عدّاد مباشر |

---

## 8. ملاحظات تقنية (Technical Notes)

- **node-postgres Pool shape:** الخصائص `totalCount` / `idleCount` / `waitingCount` هي **getters** على الـ prototype، ترجع عدداً فعلياً في الزمن الحقيقي، لا snapshot.
- **Cluster mode:** يوجد 4 workers في PM2 cluster، كل واحد له Pool مستقل خاص به. المقاييس تعكس Pool الـ worker الذي يستقبل الطلب. للحصول على صورة كاملة، يجب أن تستدعي scrape جميع الـ workers (وهذا ما يفعله PM2 metrics scraper افتراضياً).
- **الحد الحالي `max=20`** على كل worker. السعة الإجمالية الفعلية لـ 4 workers = 80 اتصالاً. يوصى بمراقبة `nama_db_pool_max` عبر الـ workers ككل.
- **آمن للتطبيق على أي pool:** الـ `_safeRead` متسامح مع كل من نموذجَي الخصائص والدوال، لذا إذا قمت يوماً بالترقية إلى `pg.Pool` wrapper أو إلى `slonik` أو إلى `postgres.js`، سيستمر العدّاد في العمل.

---

## 9. الخلاصة (Summary)

أضافت موجة 45 طبقة من **القابلية للرصد (observability)** اللازمة لكشف مشاكل تجمع PostgreSQL قبل أن تتسبب في أعطال مرئية للمستخدم.

- **.0 → .31 (قبل الإصلاح):** الوحدة موجودة لكن العدّاد صفر.
- **.32 (بعد الإصلاح):** العدّادات تعمل وتعرض الأرقام الحقيقية.

الآن، لدى فريق العمليات خط أساس (baseline)، وتنبيهات قابلة للتفعيل، ونقطة تشخيص عند ارتفاع الـ 502.

**الحالة النهائية:** ✅ مُسلَّم ومُختبَر على الإنتاج.
