# موجة 47 — Aggregator Extension — STATE

**النتيجة:** ✅ مُسلَّم — 4 وحدات فرعية أُخرى مرئية الآن
**الإصدار:** v3.316.34
**التاريخ:** 2026-08-06

---

## الملفات المُسلَّمة (Shipped Artifacts)

| الملف | الحجم | الوصف |
|------|-----|------|
| `namaweb/wave47_aggregator_extension.js` | 9688 bytes | الوحدة الرئيسية |
| `namaweb/wave47_aggregator_extension_test.js` | 10 KB | 58 اختبار |
| `namaweb/server.js` | 2 surgical edits | require + /api/metrics uses aggregateAll + /api/security/metrics-summary updated |
| `docs/PHASE_WAVE_47_AGGREGATOR_EXTENSION_AR.md` | 9 sections | تقرير الإغلاق |
| `CHANGELOG.md` | Wave 47 entry | before Wave 46 |

---

## الأثر (Impact)

| المؤشر | قبل 47 | بعد 47 |
|--------|--------|--------|
| عدد المقاييس في `/api/metrics` | 41 | **54** (+13) |
| الـ scrape targets المطلوبة | 9+ | **1** |
| مقياس ذاتي للاكتشاف المبكر | 1 (wave46) | **2** (wave46 + wave47) |
| تطابق DR drill بين sub-endpoint و unified | ❌ | ✅ |

---

## الوحدات الإضافية المدمجة (4 new sub-modules)

| الوحدة | المصدر | عدد المقاييس |
|--------|--------|-------------|
| Backup activation | wave34 | 4 gauges (cron, env, sandbox_db, backup_script) |
| Logrotate | wave35 | 4 gauges (wave30_config, pm2_config, logrotate_parses, logrotate_dir) |
| DR drill | wave41 | 5 gauges (last_success, patients_restored, restore_errors, benign_errors, age_hours) |
| Process lifecycle | wave42 | 5+ gauges (unhandled, uncaught, sigterm, sigint, graceful_shutdowns) |

---

## الدروس الرئيسية (Key Lessons)

### 1. الـ defaults يجب أن تطابق الإنتاج

```js
// قبل:
wave41.summarize({})          // يفترض /var/log/dr-restore.log → لا يعمل على الإنتاج

// بعد:
const DEFAULT_DR_DRILL_LOG = '/var/backups/nama-medical/dr-restore.log';
wave41.summarize({ logPath: DEFAULT_DR_DRILL_LOG });
```

### 2. `deps.exec` يقلل زمن الاختبار

```js
// بدون mock: 6 ثوانٍ لكل اختبار validateActivation
// مع mock: < 100ms
const fakeExec = (host, cmd) => ({ code: 0, stdout: 'mock', stderr: '' });
fetchExtendedSummaries({ exec: fakeExec });
```

### 3. الـ sub-endpoints تبقى تعمل (backward compat)

`/api/metrics/dr-drill` يستمر العمل — Grafana configs لا تنكسر.

---

## الواجهة البرمجية (Public API)

```js
const w47 = require('./wave47_aggregator_extension');

// الطريقة الكاملة:
const summaries = await w47.fetchExtendedSummaries({});
const text = w47.buildExtendedOutput(summaries);

// الطريقة المختصرة (تدمج wave46 + wave47):
const text = await w47.aggregateAll({ pool });

// التشخيص:
w47.listExtendedSubModules()       // → ['backup', 'logrotate', 'dr_drill', 'process']
w47.countExtendedGauges(text)       // → number
w47.hasExtendedMinimalOutput(text)  // → boolean
w47.reset()                        // → يمسح الـ TTL cache
```

---

## المقاييس الذاتية (Self-Metrics)

| Gauge | الوصف |
|-------|-------|
| `nama_metrics_aggregator_ext_modules_ok` | كم وحدة فرعية موسعة نجحت |
| `nama_metrics_aggregator_ext_modules_total` | كم وحدة حاولنا استدعاءها (4) |

**تنبيهان موصى بهما:**
```yaml
- alert: MetricsAggregatorDegraded
  expr: nama_metrics_aggregator_modules_ok < nama_metrics_aggregator_modules_total
- alert: MetricsAggregatorExtendedDegraded
  expr: nama_metrics_aggregator_ext_modules_ok < nama_metrics_aggregator_ext_modules_total
```

---

## خطوات لاحقة (Next Steps)

1. ⏸ انتظر cmd من المستخدم لاتخاذ الموجة التالية
2. 🔍 الموجة 48: تحقق من sub-modules أُخرى (`/api/metrics/sessions`، `/api/metrics/rls-defense`، `/api/metrics/audit-chain` — هل هذه مُدمجة بالفعل في wave32 أم لا؟)
