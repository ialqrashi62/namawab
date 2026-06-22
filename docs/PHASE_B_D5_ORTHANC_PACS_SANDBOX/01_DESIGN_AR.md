# Phase B D5 — Orthanc PACS Sandbox — التصميم

> 2026-06-23 | PACS محلي معزول. **dummy DICOM metadata فقط، لا بايتات صور، لا PHI، لا شبكة، لا ربط إنتاجي/nginx/PM2.** Orthanc الفعلي = candidate (سحب الصورة = خارجي).

## وضع التنفيذ
- **Orthanc الفعلي**: `tools/orthanc-sandbox/docker-compose.candidate.yml` — **غير مُشغَّل** (image pull خارجي). منافذ loopback فقط (`127.0.0.1:8042` REST/DICOMweb، `4242` C-STORE)، تخزين مؤقت، تراجع `down -v`.
- **منفّذ الآن (آمن)**: `tools/orthanc-sandbox/dicom_sim.js` — محاكي DICOM محلي، metadata تركيبية فقط، tripwires لـPHI/الشبكة، تنظيف تخزين. 7/7 PASS.

## الطوبولوجيا (عند التشغيل الفعلي لاحقاً)
```
[modality/dummy] --C-STORE/STOW (loopback)--> [Orthanc sbx :8042/:4242 loopback]
[namaweb app] --(loopback، داخلي)--> Orthanc (WADO)   ← التطبيق فقط
[browser] --(/api/phi-files/:id محمي A3A)--> [namaweb app]   ← لا وصول مباشر لـOrthanc
```

## عزل التخزين
تخزين Orthanc على حجم sandbox منفصل (Docker volume)؛ لا يكتب في `phi_vault` الإنتاجي ولا DB. في المحاكي: مجلد tmp يُنظّف.

## ضوابط مخاطر PHI
- dummy metadata فقط؛ **لا بايتات صور**؛ PatientID تركيبي 9000–9999.
- tripwire يرفض أي PatientID خارج النطاق التركيبي (يشمل أرقام الهوية الحقيقية ذات 10 خانات) وأي pixel bytes وأي علامة `REAL_PHI`.
- لا تعريض منافذ عامة (loopback فقط).

## علاقة التنزيل المحمي (A3A/A3)
العميل لا يصل Orthanc مباشرةً. الصور تبقى خلف `GET /api/phi-files/:id` (auth+RLS+tenant+content-type pinning+**تشفير at-rest DPAPI**)؛ التطبيق يجلب من Orthanc داخلياً على loopback. فيحافظ على كل ضوابط A3A/A3.

## خطة rollback
المحاكي: لا حالة دائمة (tmp يُنظّف). Orthanc الفعلي: `docker compose -f docker-compose.candidate.yml down -v`. لا أثر إنتاجي.

## نموذج التدقيق ومسار التكامل المستقبلي
أحداث التخزين/الاسترجاع تُدقَّق (بلا PHI)؛ التكامل لاحقاً عبر محرّك D1 (Mirth) + تقارير D2 (DiagnosticReport.presentedForm → المسار المحمي). الأجهزة الحقيقية/PACS الخارجي = بوابة لاحقة بعد توفّرها.
