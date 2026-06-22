# Wave 3 — D5 Orthanc PACS Sandbox (candidate)

> تصميم candidate فقط. dummy DICOM، لا صور حقيقية، لا PHI، لا تعريض عام، لا ربط مسار إنتاجي.

## الطوبولوجيا
Orthanc محلي (Docker مؤقت) على loopback؛ DICOMweb (WADO-RS/STOW-RS) + C-STORE تجريبي محلي فقط. لا اتصال بأجهزة/PACS خارجي.

## عزل التخزين
تخزين Orthanc على وحدة sandbox منفصلة؛ لا يكتب في `phi_vault` الإنتاجي ولا DB الإنتاج. dummy DICOM فقط (مولّدة تجريبياً).

## ضوابط مخاطر PHI
- لا صور أشعة حقيقية؛ dummy DICOM (بدون هويات حقيقية).
- لا تعريض منافذ خارجية؛ loopback فقط.
- في الإنتاج لاحقاً: الصور تبقى خلف المسار المحمي A3A — **لا** تُخدَّم Orthanc مباشرةً للمتصفّح؛ التطبيق يتوسّط (auth+RLS+tenant) ويجلب من Orthanc داخلياً، فيحافظ على ضوابط A3A + التشفير at-rest.

## العلاقة بالتنزيل المحمي
`GET /api/phi-files/:id` (A3A) يبقى نقطة الوصول الوحيدة للعميل؛ Orthanc (إن اعتُمد) مصدر تخزين داخلي خلفه، لا بديل عنه.

## خطة اختبار dummy DICOM
رفع dummy DICOM عبر STOW-RS محلي → استرجاع WADO-RS → التحقّق من العزل (لا تسرب، لا منفذ عام) → حذف.

## خطة rollback
`docker compose down -v` (حذف Orthanc + أحجامه)؛ لا أثر إنتاجي (غير مربوط)؛ `phi_vault`/DB الإنتاج غير مَمسوسة.

```text
D5_ORTHANC_STATUS: SANDBOX_DESIGN_CANDIDATE_READY
REAL_PHI_USED: NO | DUMMY_DICOM_ONLY: YES | PUBLIC_EXPOSURE: NO | PRODUCTION_WIRING: NO
NEXT_GATE: APPROVE_PHASE_B_D5_ORTHANC_PACS_SANDBOX
```
