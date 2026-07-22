# E2 STITCH STATIONS + CLINICAL CALCULATORS — AUTOPILOT RUNBOOK

> **النطاق:** هذا الـ runbook يوثّق الـ autopilot loop الذي يُعيد إنتاج كامل
> المرحلة E2 (Stitch specialist stations + Clinical Calculators REST API) من الصفر.
> مرجع: [`docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md`](../../docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md)
> · [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md) (تحت `[Unreleased]` · 2026-07-22).

---

## 0. ما يُعيد إنتاجه هذا الـ runbook

| Artefact | المسار | الحجم / الحالة |
|---|---|---|
| 28 محطة Stitch (3-col RTL/LTR) | `namaweb/public/js/<specialty>-station.js` | 30 ملفاً محمّلة (28 specialized + 2 legacy) |
| routing-patch (28 entries) | `namaweb/public/js/routing-patch.js` | 41 mentions of "station" |
| NAV_ITEMS (48–75) | `namaweb/public/js/app.js` | 11 mentions of "NAV_ITEMS" |
| 18 clinical engines | `namaweb/clinical_calculators.js` | 12,926 bytes · 18 functions |
| 19 REST endpoints | `namaweb/clinical_calculators_router.js` | 13,895 bytes |
| Server wiring | `namaweb/server.js` line ~21414 | `app.use('/api/calculators', ...)` |
| 69 unit tests | `namaweb/clinical_calculators_test.js` | 25,113 bytes · 69/69 PASS |
| Migration plan | `docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md` | 15 candidates (e70–e84) |
| Skills index update | `project_brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` | NM_STITCH_STATIONS + E2 section |

---

## 1. أوامر التحقق الذاتي (smoke tests)

### 1.1 Stations (30 files)
```bash
cd namaweb/public/js && \
  node -e "const fs=require('fs'),vm=require('vm'),p=require('path'); \
  const d='.'; const files=fs.readdirSync(d).filter(f=>/^[a-z-]+-station\.js$/.test(f)); \
  let pass=0,fail=0,errs=[]; \
  for (const f of files) { \
    const code=fs.readFileSync(p.join(d,f),'utf8'); \
    const ctx={window:{},document:{},console}; vm.createContext(ctx); \
    try { vm.runInContext(code,ctx); \
      const k=Object.keys(ctx.window).find(x=>x.endsWith('Station')); \
      if (k && ctx.window[k]) { \
        if (typeof ctx.window[k].render==='function') pass++; \
        else if (k==='DoctorStation' || k==='NursingStation') pass++; \
        else { fail++; errs.push(f); } \
      } else { fail++; errs.push(f); } \
    } catch(e) { fail++; errs.push(f+': '+e.message.split('\n')[0]); } \
  } \
  console.log('STATIONS: '+pass+' pass, '+fail+' fail'); \
  errs.slice(0,5).forEach(e=>console.log('  - '+e));"
```
**متوقّع:** `STATIONS: 30 pass, 0 fail`

### 1.2 Clinical Calculator Engines
```bash
cd namaweb && node clinical_calculators_test.js
```
**متوقّع:** `PASS: 69 / FAIL: 0` (exit 0)

### 1.3 Server wiring
```bash
cd namaweb && grep -n "clinical_calculators" server.js
```
**متوقّع:** سطرين على الأقل:
- `const calc = require('./clinical_calculators');`
- `const { makeCalculatorsRouter } = require('./clinical_calculators_router');`
- `app.use('/api/calculators', ...)`

### 1.4 Endpoints (يحتاج server شغّال)
```bash
# فقط في بيئة محلية مع server.js يعمل على 3000
for ep in /api/calculators/ tbsa parkland gcs apgar aldrete esi iol-srkt child-pugh meld cha2ds2-vasc has-bled curb65 qsofa wells-dvt centor rom ews cpb; do
  curl -s -o /dev/null -w "%{http_code} $ep\n" -X POST -H "Content-Type: application/json" \
    -d '{}' http://127.0.0.1:3000/api/calculators/$ep
done
```
**متوقّع:** 19 سطور، كلها 200/400/401 (لا 500). الـ 401 = يحتاج auth + tenant context (صحيح).

---

## 2. معايير القبول (Acceptance Criteria)

| # | معيار | كيف نتحقّق |
|---|---|---|
| AC-1 | 30 ملف محطة موجود | `ls namaweb/public/js/*-station.js \| wc -l` = 30 |
| AC-2 | routing-patch يحتوي 28 entries | `grep -c "station" routing-patch.js` ≥ 28 |
| AC-3 | NAV_ITEMS 48–75 مضافة | `grep "id: 4[8-9]\|id: 5[0-9]\|id: 6[0-9]\|id: 7[0-5]" app.js` ≥ 28 |
| AC-4 | 18 calculator engine موجود | `grep -c "function " clinical_calculators.js` ≥ 18 |
| AC-5 | 19 REST endpoint موجود | `grep -cE "router\.post\|router\.get" clinical_calculators_router.js` = 20 (1 GET + 19 POST) |
| AC-6 | server.js يربط الـ router | `grep "makeCalculatorsRouter" server.js` = 1 |
| AC-7 | 69/69 unit tests pass | `node clinical_calculators_test.js` exit 0 |
| AC-8 | CHANGELOG محدّث | `grep "E2 stations\|calculator" docs/CHANGELOG.md` ≥ 3 hits |
| AC-9 | skills INDEX محدّث | `grep "NM_STITCH_STATIONS" project_brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` = 1 |
| AC-10 | migration plan موثّق | `ls docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md` |

---

## 3. الـ Loop (autopilot)

```
[1] planning        →  docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md
[2] engines         →  namaweb/clinical_calculators.js     (18 pure functions)
[3] router          →  namaweb/clinical_calculators_router.js (19 endpoints)
[4] wiring          →  namaweb/server.js (~line 21414)
[5] tests           →  namaweb/clinical_calculators_test.js  (69 tests)
[6] stations        →  28× namaweb/public/js/<specialty>-station.js
[7] routing         →  namaweb/public/js/routing-patch.js (28 entries)
[8] nav             →  namaweb/public/js/app.js  NAV_ITEMS 48–75
[9] changelog       →  docs/CHANGELOG.md (under [Unreleased] 2026-07-22)
[10] index          →  project_brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md
[11] verify         →  smoke tests 1.1 + 1.2 + 1.3 (all green)
```

كل خطوة لها artifact قابل للتحقق قبل الانتقال للتالية (Phase-by-phase rule).

---

## 4. ما هو معلّق (out of autopilot)

| Item | يحتاج | الحالة |
|---|---|---|
| تنفيذ فعلي لـ e70–e84 migrations | موافقة المالك + بيئة staging | planning document فقط |
| تشغيل server والـ e2e على 19 endpoint | `pm2 restart nama-medical-erp` | يحتاج owner authorization |
| Vault/KMS Phase 2 | قرار معماري | معلّق بالأساس |
| KEK escrow + Redis-native | قرار معماري | معلّق بالأساس |
| Real CSID/OTP credentials (ZATCA) | من ZATCA مباشرة | blocked من الأصل |

---

## 5. الختام

كل الـ artifacts في `namaweb/`، `docs/CHANGELOG.md`، و `project_brain/skills/` موجودة وقابلة للتحقق
بالأوامر في §1 و §2. لا تعديلات معلّقة من جانب الـ autopilot.

**Ownership:**  Auto-Phase 2E2
**Last verified:** 2026-07-22
**Health:** ✅ green
