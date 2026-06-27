# Phase B — HAPI FHIR Transaction Ingest — التصميم

> 2026-06-23 | إدخال transaction Bundle كامل إلى HAPI FHIR محلي (loopback)، dummy فقط، بلا PHI/ربط إنتاجي/استدعاء خارجي.

## النمط (canonical HAPI transaction)
- **urn:uuid fullUrls + POST + إعادة كتابة المراجع داخل الـBundle**: كل مورد يأخذ `urn:uuid` ثابتاً (حتمي، بلا عشوائية)؛ تُعاد كتابة كل المراجع (`subject`/`patient`/`managingOrganization`/`serviceProvider`) من `Type/id` النسبي إلى الـurn:uuid؛ HAPI يحلّ المراجع ذرّياً ويُسند ids للخادم.
- يحلّ مشكلة الكتابة المفردة السابقة (400 referential integrity): المعاملة الذرّية تُنشئ كل الموارد المترابطة معاً.

## الملفات (sandbox، غير مربوطة بالإنتاج)
- `tools/fhir-sandbox/transaction_bundle.js` — `buildTransactionBundle(fx)`: يبني Bundle type=transaction من fixtures dummy + Organizations (tenant-1/facility-1) + إعادة كتابة المراجع + إسقاط client id (POST create).
- `tools/fhir-sandbox/hapi_transaction_test.js` — يرسل الـBundle إلى HAPI loopback (`HAPI_BASE`، يرفض أي مضيف غير 127.0.0.1/localhost)، يتحقّق من transaction-response + 2xx لكل إدخال + read-back + تكامل المراجع.

## الموارد (10 إدخالات)
Organization×2 (tenant/facility) · Patient×2 · Encounter · Observation×2 · DiagnosticReport · MedicationRequest · Claim. كل المراجع تُحلّ داخل الـBundle؛ معرّفات تركيبية؛ لا PHI؛ صورة التقرير = مرجع محمي `/api/phi-files/:id` (لا بايتات).

## ضوابط
loopback فقط؛ dummy فقط؛ لا PHI/شهادات/طرف خارجي؛ لا DB إنتاج؛ لا ربط route/nginx/PM2؛ تفكيك الحاوية بعد الاختبار.
