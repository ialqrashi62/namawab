# P1 نشر استحقاقات المنشأة — 02 التحقق (Controlled Deploy Verification)

> التاريخ: 2026-06-20 | على الإنتاج (alfaisal-erp.com). بلا تغيير بيانات/DDL.

## Gate 1-2: النسخ الاحتياطي والرفع
| البند | القيمة |
| ----- | ------ |
| نسخة احتياطية | `/var/www/namaweb/server.js.bak.20260620_060249` (md5 قبل `2e447462…`) |
| facility_entitlements.js | جديد (لم يكن موجوداً) — rollback = حذفه |
| الملفات المرفوعة | server.js + facility_entitlements.js (scp) |
| md5 بعد على الإنتاج | server.js=`97aa0437…` ✓ مطابق ، facility_entitlements.js=`89a9e81c…` ✓ مطابق |

## Gate 3: فحص الصياغة
- `node --check server.js` → OK ؛ `node --check facility_entitlements.js` → OK.

## Gate 4: إعادة التشغيل والصحة
| البند | النتيجة |
| ----- | ------- |
| PM2 | online (~16-105mb) |
| `/api/health` (HTTPS) | 200 — `{"status":"UP"}` |
| HTTP→HTTPS | 301 |
| أخطاء runtime جديدة | لا يوجد |

## Gate 5: التحقق من الإنفاذ
### 5أ — HTTP حيّ (بلا تغيير بيانات)
| الطلب | النتيجة | الدلالة |
| ----- | ------- | ------- |
| `/api/health` (common) | 200 | مشترك مسموح ✓ |
| `/api/patients` (بلا جلسة) | 401 | طبقة المصادقة سليمة |
| `/api/icu/patients` (بلا جلسة، محاولة تجاوز) | 401 | الحارس يُمرّر بلا سياق ثم المصادقة تمنع |
| `POST /api/auth/login` (بلا بيانات) | 401 | مسار auth سليم (مستثنى) |

### 5ب — نوع المنشأة الحالي على الإنتاج
`facility_type` = **غير مضبوط (unset)** → الحارس يُعامله كـ permissive (الكل مسموح). لذلك **لا يمكن ملاحظة 403 عبر HTTP دون ضبط نوع منشأة مقيّد** — وهو تغيير بيانات إنتاج **لم يُنفَّذ** (التزام القواعد). موثّق صراحةً.

### 5ج — قرارات الحارس عبر الكود المنشور (read-only على الإنتاج) — 9/9 PASS
يُثبت أن `facility_entitlements.js` المنشور + منطق الحارس ينتج النتائج الصحيحة:
| نوع المنشأة | المسار | متوقع | فعلي |
| ----------- | ------ | ----- | ---- |
| pharmacy_only | /api/lab/orders | 403 | 403 ✓ |
| pharmacy_only | /api/pharmacy/drugs | 200 | 200 ✓ |
| radiology_only | /api/lab/orders | 403 | 403 ✓ |
| health_center | /api/icu/patients | 403 | 403 ✓ |
| health_center | /api/surgeries/9/anesthesia (مسار عميق = تجاوز مباشر) | 403 | 403 ✓ |
| medical_city | /api/icu/patients | 200 | 200 ✓ |
| totally_unknown | /api/patients | 422 | 422 ✓ |
| (unset) | /api/icu/patients | 200 | 200 ✓ |
| pharmacy_only | /api/health | 200 | 200 ✓ |

> **التجاوز المباشر**: المسار العميق `/api/surgeries/9/anesthesia` لنوع health_center → 403، مما يؤكد أن الحارس يقرّر على `req.path` مستقلاً عن طريقة الوصول.

## Gate 6: عدم تراجع P0 والتشغيل
| البند | النتيجة |
| ----- | ------- |
| RLS P0 عبر الكود المنشور (app user) | patients: no-context=0 / tenant1=3 / tenant999=0 → **INTACT** ✓ |
| Redis | PONG، مفاتيح الجلسات = 79 (لا تراجع MemoryStore) |
| login | POST بلا بيانات → 401 (سليم) |
| app.tenant_id binding / pool.query / pool.connect | سليم (لا تغيير على طبقة الربط) |

## الخلاصة
الإنفاذ منشور وفعّال على الإنتاج. التحقق الحيّ المباشر لـ 403 يحتاج tenant بنوع مقيّد (الإنتاج حالياً unset/permissive)؛ أُثبت منطق الإنفاذ عبر الكود المنشور read-only + التجاوز المباشر، دون تغيير بيانات. لا تراجع في P0.

`CONTROLLED_DEPLOY_VERIFICATION_COMPLETE`
