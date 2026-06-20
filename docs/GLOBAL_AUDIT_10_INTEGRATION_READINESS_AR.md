# التدقيق العالمي 10 — جاهزية التكاملات (Integration Readiness)

> التاريخ: 2026-06-20 | الحالة لكل تكامل: NOT_PRESENT (غير موجود) / STUB (هيكل/محلي) / IMPLEMENTED (فعلي).

---

## جدول جاهزية التكاملات

| التكامل | الحالة | الدليل | الأولوية |
| ------- | ------ | ------ | -------- |
| **SMS / WhatsApp / Unifonic / Twilio** | NOT_PRESENT | لا حزم ولا مسارات | P1 (تذكير المواعيد) |
| **Email / SMTP / Nodemailer** | NOT_PRESENT | لا حزمة ولا إعداد | P2 |
| **بوابة دفع (Mada/Stripe/Tap/HyperPay/Moyasar)** | NOT_PRESENT | `payment_method` نصي فقط | P1 (تحصيل رقمي) |
| **ZATCA (الفوترة الإلكترونية)** | STUB | `zatca/generate` يولّد QR محلي base64؛ لا توقيع/تقديم API؛ `zatca_response` لا يُملأ | P1 (إلزام سعودي) |
| **التأمين / TPA (مطالبات)** | STUB | `insurance/claims` سجلات داخلية؛ `waseel_status` لا يُملأ؛ لا EDI | P1 |
| **NPHIES / Nafis / HESN / MOH / Seha / Wasfaty** | NOT_PRESENT | صفر إشارات في الكود | P1 (السوق السعودي) |
| **LIS (أجهزة المختبر / HL7 / ASTM)** | NOT_PRESENT | إدخال نتائج يدوي | P1 |
| **PACS / DICOM / RIS (الأشعة)** | STUB | رفع ملفات (jpg/dcm) بلا parsing/عارض/شبكة DICOM | P1 |
| **HL7 v2 / FHIR APIs** | NOT_PRESENT | لا توليد/تحليل رسائل | P1 (تكامل مؤسسي) |
| **Webhooks / API خارجي للشركاء** | INFRASTRUCTURE_ONLY | جدول `integration_settings` موجود لكن بلا مسارات | P2 |
| **API Keys / OAuth للشركاء** | NOT_PRESENT | لا OAuth/مفاتيح API | P2 |
| **IdP / SSO (SAML/OIDC) / MFA** | NOT_PRESENT | جلسات داخلية فقط | P2 (مؤسسي) |

---

## التحليل

النظام **شبه مغلق (self-contained)** — كل البيانات تُدخل وتُدار يدوياً داخلياً. لا توجد قنوات تكامل خارجية فعّالة. هذا مقبول لعيادة مستقلة، لكنه:
- يعزل النظام عن **المنظومة الصحية الوطنية السعودية** (NPHIES/Wasfaty) — حاجز سوقي.
- يمنع **الأتمتة** (نتائج مختبر/صور أشعة تلقائية) — تكلفة تشغيلية أعلى وأخطاء إدخال.
- يحدّ من **التحصيل الرقمي** (لا بوابة دفع، لا تقديم مطالبات).
- يعيق **التكامل المؤسسي** (لا HL7/FHIR/API شركاء).

`integration_settings` يكشف **نية تصميمية** للتكامل لم تُفعّل بعد — أساس جيد للبناء عليه.

---

## أولويات التكامل المقترحة (للسوق السعودي)

**المرحلة الأولى (P1 — تمكين تجاري)**:
1. **تذكير SMS** للمواعيد (Unifonic/Twilio) — أثر فوري على no-show.
2. **بوابة دفع** (Mada/Moyasar/Tap) — تحصيل رقمي.
3. **ZATCA Phase 2** فعلي (توقيع + تقديم) — إلزام نظامي.

**المرحلة الثانية (P1 — منظومة صحية)**:
4. **NPHIES** للتأمين والمطالبات.
5. **HL7/FHIR** API للتبادل المؤسسي.
6. **LIS + PACS/DICOM** فعلي للمختبر والأشعة.

**المرحلة الثالثة (P2 — مؤسسي)**:
7. Webhooks + API شركاء + OAuth.
8. SSO (SAML/OIDC) + MFA.

---

## القرار

`INTEGRATION_READINESS: LOW` — لا تكاملات خارجية فعّالة؛ ZATCA والتأمين stubs محلية. توجد بنية نية (`integration_settings`) للبناء عليها. هذه أكبر فجوة تفصل النظام عن **الجاهزية العالمية والسوق المؤسسي السعودي**.

`INTEGRATION_READINESS_AUDIT_COMPLETE`
