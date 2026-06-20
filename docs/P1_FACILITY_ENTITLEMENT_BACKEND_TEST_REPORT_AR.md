# P1 إنفاذ استحقاقات المنشأة — 04 تقرير الاختبارات (Test Report)

> التاريخ: 2026-06-20 | الملف: `namaweb/cross_tenant_facility_entitlement_test.js` — **40/40 PASS**.
> المنهج: فحص ثابت لربط الحارس في `server.js` + محاكاة قرار الحارس بنفس منطق الـ middleware (`pathToModule`→`isModuleEntitled`) + اختبار التجاوز المباشر + عدم تراجع P0. (التحقق الحيّ عبر HTTP يُجرى ضمن النشر المحكوم لاحقاً.)

## 1. فحص الربط الثابت (server.js)
| Test | Expected | Status |
| ---- | -------- | ------ |
| يستورد facility_entitlements | موجود | ✅ |
| global middleware يستخدم pathToModule(req.path) | موجود | ✅ |
| يعيد 403 عند عدم الاستحقاق | موجود | ✅ |
| يعيد 422 عند نوع غير معروف | موجود | ✅ |
| getFacilityType (DB+cache) | موجود | ✅ |
| invalidateFacilityTypeCache على تحديث الإعدادات | موجود | ✅ |
| يستثني auth/health | موجود | ✅ |

## 2. مصفوفة قرارات الحارس

| Test | Facility Type | API/Module | Expected | Actual | Status |
| ---- | ------------- | ---------- | -------- | ------ | ------ |
| المدينة الطبية كامل | medical_city | /api/icu (icu) | 200 | 200 | ✅ |
| المدينة الطبية بنك دم | medical_city | /api/blood-bank (blood_bank) | 200 | 200 | ✅ |
| المستشفى الكبير تنويم | large_hospital | /api/admissions (inpatient) | 200 | 200 | ✅ |
| مركز صحي ← تنويم | health_center | /api/admissions (inpatient) | 403 | 403 | ✅ |
| مركز صحي ← عمليات | health_center | /api/surgeries (surgery) | 403 | 403 | ✅ |
| مركز صحي ← ICU | health_center | /api/icu (icu) | 403 | 403 | ✅ |
| مركز صحي ← مرضى | health_center | /api/patients (patients) | 200 | 200 | ✅ |
| PHC ← طوارئ | primary_healthcare_center | /api/emergency (emergency) | 403 | 403 | ✅ |
| صيدلية فقط ← EMR | pharmacy_only | /api/medical/records (emr) | 403 | 403 | ✅ |
| صيدلية فقط ← تنويم | pharmacy_only | /api/admissions (inpatient) | 403 | 403 | ✅ |
| صيدلية فقط ← مختبر | pharmacy_only | /api/lab (lab) | 403 | 403 | ✅ |
| صيدلية فقط ← أشعة | pharmacy_only | /api/radiology (radiology) | 403 | 403 | ✅ |
| صيدلية فقط ← صيدلية | pharmacy_only | /api/pharmacy (pharmacy) | 200 | 200 | ✅ |
| مختبر فقط ← صيدلية | laboratory_only | /api/pharmacy (pharmacy) | 403 | 403 | ✅ |
| مختبر فقط ← EMR | laboratory_only | /api/medical (emr) | 403 | 403 | ✅ |
| مختبر فقط ← تنويم | laboratory_only | /api/admissions (inpatient) | 403 | 403 | ✅ |
| مختبر فقط ← مختبر | laboratory_only | /api/lab (lab) | 200 | 200 | ✅ |
| أشعة فقط ← صيدلية | radiology_only | /api/pharmacy (pharmacy) | 403 | 403 | ✅ |
| أشعة فقط ← مختبر | radiology_only | /api/lab (lab) | 403 | 403 | ✅ |
| أشعة فقط ← EMR | radiology_only | /api/medical (emr) | 403 | 403 | ✅ |
| أشعة فقط ← أشعة | radiology_only | /api/radiology (radiology) | 200 | 200 | ✅ |
| common دائماً | pharmacy_only | /api/dashboard (common) | 200 | 200 | ✅ |
| common دائماً | laboratory_only | /api/settings (common) | 200 | 200 | ✅ |
| نوع غير معروف | totally_made_up | /api/patients | 422 | 422 | ✅ |
| غير مضبوط (توافق) | "" | /api/icu | 200 | 200 | ✅ |
| null (توافق) | null | /api/admissions | 200 | 200 | ✅ |
| auth مستثنى | pharmacy_only | /api/auth/login | 200 | 200 | ✅ |
| health مستثنى | pharmacy_only | /api/health | 200 | 200 | ✅ |

## 3. تجاوز الرابط المباشر (direct API bypass)
| Test | Expected | Actual | Status |
| ---- | -------- | ------ | ------ |
| pharmacy_only → /api/icu/monitoring/5 مباشرة | 403 | 403 | ✅ |
| radiology_only → /api/lab/orders/123 مباشرة | 403 | 403 | ✅ |
| health_center → /api/surgeries/9/anesthesia (عميق) | 403 | 403 | ✅ |

> الحارس عالمي على `req.path` → لا يمكن تجاوزه بمعرفة الرابط المباشر؛ القرار مستقل عن طريقة الوصول.

## 4. بدون سياق مستأجر
- بلا tenant → 200 (يُترك لطبقة `requireAuth`/`requireTenantScope`؛ لا يكسر login/المرجعيات). ✅

## 5. عدم تراجع P0 (RLS binding)
- `cross_tenant_app_tenant_binding_test.js` → **9/9 PASS** ضمن الانحدار.
- الانحدار الكامل: **20/20 حزمة exit 0** + `node --check` OK.

`TEST_REPORT_COMPLETE — 40/40 + REGRESSION 20/20 PASS`
