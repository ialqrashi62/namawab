# NM_ORTHANC_PACS_SKILL

**الغرض**: PACS/DICOM (Orthanc) محلي. **التفعيل**: بوابات PACS/Orthanc/D5.

## الحالة: محاكي محلي مُثبت (7/7)، Orthanc الفعلي مُتحقَّق loopback
- `tools/orthanc-sandbox/dicom_sim.js` (7/7): STOW dummy metadata، tripwire يرفض المعرّفات غير التركيبية (incl. 10-digit) + pixel bytes، نموذج المسار المحمي A3A، tripwire شبكي، تنظيف.
- Orthanc الفعلي: `/system` 200 (API v30)، unauth→401، loopback `8042/4242`، image cached، teardown.

## القواعد
dummy DICOM metadata فقط (لا بايتات صور حقيقية، لا .dcm حقيقي في git). الصور تبقى خلف A3A (`/api/phi-files/:id` + تشفير at-rest)؛ Orthanc لا يُعرَّض للمتصفّح (التطبيق يجلب داخلياً loopback). لا PHI/تعريض عام.

## حقول الإغلاق
`ORTHANC_STATUS · DUMMY_DICOM_USED(YES) · REAL_DICOM_USED(NO) · PUBLIC_EXPOSURE(NO) · A3A_MODEL_RESPECTED`.
