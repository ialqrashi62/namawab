# تقرير إغلاق Gate 8 — حزم NPHIES مطابقة لبنية KSA (بداية موجة الامتثال السعودي)
**التاريخ:** 2026-07-03  •  **الحالة:** ✅ ناجح  •  **Commit محلي:** namaweb `77e667b` على `integration/all-epics` (لا push، لا DDL، لا نشر، NPHIES يبقى مُبوّبًا/مغلقًا)

## المشكلة (من Gate 0)
`nphies_client.js` كان يُنتج حزم FHIR R4 من نوع `collection` **غير مطابقة لـNPHIES**: بلا `MessageHeader`، النوع collection لا message، مراجع نسبية، `meta.profile` غائب، وأنظمة ترميز عامة (hl7.org) بدل أنظمة KSA/ICD-10-AM/SBS.

## ما نُفّذ (TDD: RED → GREEN، دوال نقية)
بُناة جدد (29 اختبار وحدة، حتميّون عبر حقن `now`):
- `buildEligibilityMessage` / `buildPreAuthMessage` / `buildClaimMessage` تُنتج **Bundle من نوع `message`**:
  - **MessageHeader** كأول عنصر برمز حدث KSA (`eligibility-request`/`priorauth-request`/`claim-request`) + source + destination + focus.
  - كل عنصر بعنوان **`urn:uuid` fullUrl** والمراجع تُحلّ إليه (لا `Patient/42` نسبي).
  - **`meta.profile`** على كل مورد (StructureDefinition من nphies.sa).
  - أنظمة **NPHIES** لنوع المطالبة، **ICD-10-AM** للتشخيصات، **SBS** للخدمات.
  - **ترميز آمن**: تشخيص بلا ICD-10-AM أو بند بلا SBS → نص فقط، **لا كود مُختلق**.
- الدوال القديمة (collection) تبقى مُصدَّرة للتوافق الخلفي.

## التوصيل
المسارات الثلاثة المُبوّبة (eligibility/preauth/claim submit) تستخدم البُناة الجدد. **الإرسال يبقى مغلقًا (gated)** — التغيير الوحيد الملحوظ هو شكل FHIR المُولَّد/المُسجَّل (تحسين)، بلا أي تغيّر في سلوك الإرسال الحيّ.

## الأدلة والحدود الصريحة
- اختبار KSA: **29/29 PASS** • الحزمة الآمنة: **109/109 PASS** • `node --check` سليم للملفين.
- **حدّ صريح موثّق في الوحدة**: تثبيت إصدارات البروفايل الدقيقة + مجموعة امتدادات KSA الكاملة + value sets يجب مطابقتها مع **NPHIES IG الحيّ** قبل الإنتاج — هذا سقالة بنيوية حتميّة وقابلة للاختبار، **وليست شهادة مطابقة شاملة من طرف لطرف**.

## التالي — بقية موجة الامتثال
- **Gate 9:** تضمين توقيع ZATCA في UBL (XAdES/SignedProperties/C14N) — التوقيع التشفيري حقيقي في `zatca_phase2.js` لكن الـXML يحمل placeholder `UNSIGNED-NO-CSID`. (مهمة تشفير/XML أكبر — تُعالج بعناية بـTDD.)
- **Gate 10:** إغلاق دورة الإيراد charge→claim→remittance→GL (post-to-ar لا يُنشئ قيد يومية اليوم).
