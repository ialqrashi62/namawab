# الحواجز والتبعيات (موحّدة)

> لكل حاجز: ماذا يحجب · الحالة · إجراء المالك · بديل آمن · مرشّح ممكن؟

| الحاجز | يحجب | الحالة | إجراء المالك | بديل آمن الآن | مرشّح؟ |
|---|---|---|---|---|---|
| **DPAPI KEK escrow** | DR للبيانات المشفّرة | لا escrow | escrow يدوي للمفتاح في خزنة منفصلة + استثناء من النسخ | restore drill (منفّذ) + توثيق | نعم |
| **Vault/HSM/KMS (المرحلة 2)** | حضانة مفاتيح مستقلّة عن الجهاز؛ مفاتيح ZATCA/NPHIES | غير متوفّر | توفير Vault/HSM/KMS | DPAPI (المرحلة 1، منفّذ) | نعم |
| **ZATCA CSID/OTP/certs** | ZATCA Phase 2 الفعلي | لا onboarding | تسجيل EGS في Fatoora + شهادة | جاهزية ورقية | نعم |
| **NPHIES sandbox + mTLS** | NPHIES/insurance settlement | لا onboarding | تسجيل NPHIES + شهادة X.509 | جاهزية ورقية | نعم |
| **PACS/Orthanc decision** | D5 صور DICOM | قرار مفتوح | اعتماد Orthanc كـsandbox | تقييم ورقي | نعم |
| **Mirth/NextGen decision** | D1 محرّك التكامل | قرار مفتوح | موافقة تنصيب sandbox | تقييم ورقي (مكتمل) | نعم |
| **أجهزة Lab/RIS** | D6 | لا أجهزة/بروتوكول | توفير محاكي/واجهات | تصميم عبر D1+D2 | نعم |
| **endpoint payer خارجي** | D7 | = NPHIES في KSA | = NPHIES | جاهزية | نعم |
| **وجهة offsite سحابية** | نسخ مشفّرة خارجية | لا وجهة | توفير وجهة + مفتاح | نسخ محلية + drill | نعم |
| **موافقة تفعيل المحاسبة** | Phase E posting | candidate، OFF | بوابة مخصّصة صريحة | يبقى OFF | candidate فقط |
| **بيانات اختبار سريرية آمنة** | CDS/أتمتة سريرية | لا dataset آمن | توفير dummy clinical dataset | candidate + خطة | نعم |
| **Docker daemon autostart** | استقرار Redis/login | الـdaemon توقّف مرة (عولِج) | اعتماد استرداد daemon أو Redis native | watchdog (Redis-down) قائم | نعم(تحسين) |
| **R17 beta merge** | ترقية صفحات beta | محفوظة b4270c7 | موافقة مراجعة/دمج | review read-only | نعم(review) |

## الممكّنات المركزية (ترتيب الأثر)
1. **escrow الـKEK** (DR، منخفض الجهد) — أولوية فورية.
2. **قرار المفاتيح المرحلة 2 (Vault/KMS)** — يفكّ ZATCA/NPHIES/offsite.
3. **قرارات معمارية sandbox** (Mirth/Orthanc/FHIR) — تبدأ تنفيذ B.
4. **بوابة المحاسبة** — عند الحاجة التجارية فقط.
