# Wave 2 — D1 Mirth/NextGen Sandbox Deployment (candidate)

> candidate فقط، loopback، لا endpoints خارجية، لا PHI، لا شهادات، لا ربط إنتاجي. (يكمّل docs/PHASE_B_D1_MIRTH_SANDBOX/01 بخطة rollback.)

## الخيارات
- **Docker compose (موصى للـsandbox)**: حاوية Mirth + تخزين مؤقت؛ حذف نظيف. تبعية Docker daemon (انظر Wave 4 للتعافي).
- **Native service**: بلا Docker؛ تثبيت/تنظيف أثقل.

## المنافذ (loopback فقط)
Admin/API + قنوات HL7 MLLP + HTTP/FHIR — كلها `127.0.0.1:<port>` تجريبي؛ **لا تعريض عام، لا firewall rule، لا port-forward**.

## Persistence
قاعدة Mirth الداخلية على وحدة sandbox منفصلة؛ تُحذف مع الـsandbox؛ لا كتابة في DB الإنتاج (schema/DB throwaway).

## القنوات (تسمية)
`SBX_HL7_ADT_IN` · `SBX_HL7_ORU_IN` · `SBX_FHIR_HTTP` · `SBX_DLQ` (dead-letter). بادئة `SBX_` تميّز الـsandbox.

## queue/retry/dead-letter
at-least-once + idempotency key لكل رسالة؛ ترتيب لكل مريض/طلب؛ حدّ إعادة محاولة → dead-letter `SBX_DLQ` + تنبيه.

## نموذج التدقيق
سجلّ Mirth (بلا PHI في الـsandbox — dummy)؛ في الإنتاج لاحقاً ربط بـ`audit_trail` (action/module بلا حمولة PHI).

## نموذج الأسرار (بالمرجع)
لا أسرار/شهادات في الـsandbox أو في Git؛ أي mTLS/توقيع لاحق عبر نموذج المفاتيح (D0 / المرحلة 2 Vault/HSM) بالمرجع.

## أنماط الفشل
توقّف قناة → تراكم مراقَب → استئناف؛ فشل طرف → retry/DLQ؛ رسالة مشوّهة → عزل+تنبيه؛ عزل المحرّك يحمي التطبيق الإكلينيكي.

## خطة rollback
sandbox مؤقت: `docker compose down -v` (يحذف الحاوية+الأحجام) أو إلغاء تثبيت الخدمة Native + حذف وحدة التخزين؛ لا أثر على الإنتاج (لم يُربط)؛ لا DB إنتاج مَمسوس.

```text
D1_MIRTH_STATUS: SANDBOX_DEPLOYMENT_CANDIDATE_READY
EXTERNAL_CALLS: NO | REAL_PHI_USED: NO | PUBLIC_EXPOSURE: NO
NEXT_GATE: APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT
```
