# Phase B D1 — تقييم Mirth / NextGen Connect (تصميم فقط)

> 2026-06-23 | تقييم معماري ورقي. لا تنصيب، لا استدعاء خارجي، لا تغيير إنتاجي.

## أين يقع Mirth
محرّك تكامل (integration engine) **معزول عن المونوليث** `namaweb/server.js`، يتوسّط بين NamaMedical والأنظمة الخارجية. يستقبل/يرسل ويحوّل الرسائل عبر "قنوات" (channels)، فلا يُحمّل التطبيق الإنتاجي منطق البروتوكولات.

## الدور لكل تكامل
| التكامل | دور Mirth |
|---|---|
| **HL7 v2** (LIS/RIS/أجهزة) | قناة MLLP listener/sender + تحويل HL7↔JSON/DB؛ إعادة محاولة وترتيب |
| **FHIR** (D2/NPHIES) | قناة HTTP(S) تبني/تستقبل FHIR Bundles + تحويل من/إلى جداول NamaMedical |
| **NPHIES** | قناة FHIR + توقيع/mTLS + تتبّع معاملات (eligibility/preauth/claim) |
| **PACS/DICOM** | غالباً عبر خدمة DICOM منفصلة (Orthanc/dcm4che)؛ Mirth ينسّق الطلبات/التقارير (MWL/ORU) لا نقل الصور نفسه |
| **ZATCA** | أقل ملاءمة (ZATCA = UBL XML + ختم تشفيري + Fatoora API)؛ يُفضّل خدمة مخصّصة، ويمكن لـMirth تنسيق التدفّق فقط |

## طوبولوجيا النشر (مقترحة للصندوق المفرد)
- خدمة Mirth منفصلة (عملية/حاوية مستقلة) على نفس الصندوق أو مضيف منفصل، تتصل بـPostgreSQL/التطبيق عبر واجهات محدّدة.
- لا تُمنح Mirth وصولاً مباشراً واسعاً لقاعدة البيانات؛ تتفاعل عبر APIs مُحكمة أو دور DB مقيّد منفصل (يحترم RLS/tenant).
- البيئات: sandbox منفصلة تماماً عن الإنتاج؛ لا PHI حقيقي في sandbox.

## نموذج الطابور/إعادة المحاولة
- قنوات Mirth توفّر persistence + retry + dead-letter مدمجة (أفضل من بناء طابور داخل المونوليث).
- ضمانات: at-least-once مع idempotency keys؛ ترتيب لكل مريض/طلب؛ حدود إعادة محاولة + تنبيه عند الفشل.

## التدقيق/المراقبة
- سجلّ رسائل Mirth + ربط بـ`audit_trail` (دون PHI في السجلّات)؛ لوحات حالة القنوات؛ تنبيهات على تراكم/فشل.

## التعامل مع الأسرار/الشهادات
- شهادات mTLS (NPHIES) ومفاتيح التوقيع تُدار عبر **نفس نموذج المفاتيح (المرحلة 2 Vault/HSM)** — لا داخل Mirth config في Git؛ Mirth يشير إليها بالمرجع.
- يتكامل مع قرار D0/المرحلة 2 (KEK/Vault).

## أنماط الفشل
- توقّف القناة ⟶ تراكم الطابور (مراقَب) ⟶ استئناف؛ فشل الطرف الخارجي ⟶ إعادة محاولة/dead-letter؛ رسالة مشوّهة ⟶ عزل + تنبيه؛ انقطاع شبكة ⟶ buffering. عزل المحرّك يمنع تأثّر التطبيق الإكلينيكي.

## التوصية
- **اعتماد محرّك تكامل معزول (Mirth/NextGen Connect أو بديل OSS مكافئ)** لكل HL7/FHIR/NPHIES بدل بنائها داخل `server.js` — يقلّل سطح الخطر على الإنتاج ويوفّر retry/تتبّع جاهزَين.
- **ZATCA Phase 2** يبقى خدمة مخصّصة (تشفير/UBL)، مع تنسيق اختياري عبر المحرّك.
- التنفيذ الفعلي = بوابة لاحقة (تنصيب sandbox أولاً، بلا PHI).

```text
FINAL_STATUS: PHASE_B_D1_MIRTH_ASSESSMENT_COMPLETED
RECOMMENDATION: adopt isolated integration engine for HL7/FHIR/NPHIES; ZATCA as dedicated service
EXTERNAL_CALLS: NO
PRODUCTION_CHANGES: NONE
```
