# مصفوفة الحواجز (Blocking Dependencies)

> 2026-06-23 | لكل حاجز: ماذا يحجب / الحالة / إجراء المالك / بديل آمن / هل يمكن المضي بمرشّح؟

| الحاجز | يحجب | الحالة الحالية | إجراء المالك المطلوب | بديل آمن الآن | مرشّح ممكن؟ |
|---|---|---|---|---|---|
| **KMS/Vault/HSM** | A3 المرحلة 2، مفاتيح ZATCA/NPHIES الإنتاجية | غير متوفّر (single-box on-prem) | توفير Vault/HSM محلي أو حساب KMS | DPAPI (منفّذ للمرحلة 1) | نعم(تصميم المرحلة 2) |
| **DPAPI KEK escrow** | تعافي الكوارث (DR) للبيانات المشفّرة | لا escrow بعد (DPAPI مربوط بـice@هذا الجهاز) | إنشاء نسخة استرداد آمنة للـKEK + استثناؤها من النسخ | توثيق readiness + تنبيه | نعم(وثيقة جاهزة) |
| **ZATCA certs/CSID/OTP** | ZATCA Phase 2 الفعلي | لا onboarding/شهادة | تسجيل EGS في Fatoora + شهادة | readiness ورقي فقط | نعم(readiness) |
| **NPHIES sandbox creds** | NPHIES eligibility/preauth/claim | لا onboarding/شهادة | تسجيل NPHIES + شهادة X.509 | readiness ورقي | نعم(readiness) |
| **FHIR sandbox** | D2 إثبات المفهوم | غير منصوب | (لا شيء — محلي) قرار البدء فقط | HAPI FHIR محلي بلا PHI | نعم(candidate) |
| **PACS/Orthanc decision** | D5 صور DICOM | قرار معماري مفتوح | الموافقة على Orthanc كـsandbox | تقييم ورقي | نعم(candidate) |
| **Mirth/NextGen decision** | D1 محرّك التكامل | قرار معماري مفتوح | الموافقة على التقييم | تقييم ورقي | نعم(candidate) |
| **أجهزة Lab/RIS** | D6 تكامل الأجهزة | لا أجهزة/بروتوكول محدّد | توفير محاكي/بروتوكول المحلّلات | تصميم عبر D1+D2 | نعم(تصميم) |
| **موافقة تفعيل المحاسبة** | Phase E posting | candidate مُجرّب 63/63، OFF | بوابة مخصّصة صريحة | لا (تبقى OFF) | candidate فقط |
| **endpoint شركة تأمين خارجي** | D7 تسوية مالية | في KSA = NPHIES | = NPHIES | readiness | نعم(= NPHIES) |
| **وجهة نسخ سحابية/offsite** | النسخ المشفّرة خارج الموقع | لا وجهة | توفير وجهة + مفتاح | نسخ محلية + restore drill (منفّذ) | نعم(تصميم) |

## الخلاصة
- **الممكّن المركزي** = قرار المفاتيح/الشهادات (KMS/Vault للمرحلة 2 + escrow الـKEK) — يفكّ ZATCA/NPHIES/offsite.
- كل البنود المحجوبة لها **مرشّح ورقي/تصميمي آمن** يمكن إعداده الآن دون كسر أي حاجز.
- المحاسبة تبقى OFF حتى بوابة مخصّصة.
