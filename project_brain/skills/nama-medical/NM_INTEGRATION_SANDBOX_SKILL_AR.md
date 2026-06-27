# NM_INTEGRATION_SANDBOX_SKILL

**الغرض**: قواعد تشغيل أي sandbox تكامل محلي (HAPI/Mirth/Orthanc/…). **التفعيل**: أي بوابة sandbox/container.

## القواعد الثابتة
```text
loopback-only (127.0.0.1، تأكيد عبر `docker port`؛ لا 0.0.0.0)
dummy-data-only · NO_REAL_PHI · NO_PUBLIC_EXPOSURE · NO_NGINX_EXPOSURE
NO_PM2_PRODUCTION_PROCESS · NO_PRODUCTION_WIRING (غير موصول بـserver.js)
NO_EXTERNAL_HEALTHCARE_CALLS (NPHIES/ZATCA/PACS/LIS/RIS/payer)
container image pull = بموافقة المالك فقط (سحب الصورة = استدعاء خارجي)
teardown بعد الاختبار (stop+rm)؛ واحدة في كل مرة لحماية موارد صندوق الإنتاج
network tripwire في أي script محلي؛ artifacts مؤقتة في tmp تُنظّف
```

## النمط
1. Gate 0 baseline + docker متاح + لا containers sandbox سابقة.
2. Gate loopback safety (تأكيد الربط 127.0.0.1).
3. pull (إن مُوافق) → run loopback → validate → teardown → regression (المحاكيات + health).
4. الإنتاج يبقى 200 طوال الوقت (تحقّق بعد كل start).

## المحاكيات المحلية المثبتة (بلا شبكة، بلا PHI)
`tools/fhir-sandbox/` (D2، 10/10) · `tools/mirth-sandbox/channel_sim.js` (D1، 7/7) + `channel_relay.js` (→HAPI) · `tools/orthanc-sandbox/dicom_sim.js` (D5، 7/7).

## الصور المُخزَّنة (cache، للتشغيل المعتمد)
`hapiproject/hapi` · `nextgenhealthcare/connect` · `jodogne/orthanc-plugins`.

## حقول الإغلاق
`CONTAINER_STATUS(STARTED_THEN_TORN_DOWN) · LOOPBACK_ONLY(YES) · IMAGE_PULL · PUBLIC_EXPOSURE(NO) · REAL_PHI_USED(NO) · TEARDOWN_STATUS(CLEAN) · regression(D2/D1/D5)`.
