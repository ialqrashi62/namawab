# Phase B — جاهزية NPHIES والتأمين

> Discovery فقط. لا استدعاء NPHIES حقيقي، لا كود، لا DDL، لا أسرار.

## التأمين الداخلي (الموجود)
- **Current implementation**: CRUD داخلي فقط.
- **Existing routes**: `GET/POST /api/insurance/companies`، `GET/POST/PUT /api/insurance/claims`، `GET /api/insurance/policies` (في `server.js`).
- **Existing tables**: `insurance_companies`, `insurance_contracts`, `insurance_policies`, `insurance_claims` (كلها FORCE RLS + tenant_id ضمن الـ150).
- **الفجوة**: لا تحقّق أهلية (eligibility) ولا موافقة مسبقة (preauthorization) ولا إرسال مطالبات لطرف دافع خارجي. المطالبات تُدار يدوياً داخلياً.

## NPHIES (المنصّة الوطنية السعودية)
- **Integration**: NPHIES — Eligibility / PreAuth / Claim / Payment notice، مبنية على **FHIR R4 (KSA profiles)**.
- **Current implementation**: **لا يوجد** (0 إشارة).
- **Existing routes/files**: لا شيء؛ يُبنى فوق طبقة FHIR (التقرير 02) + الجداول التأمينية الموجودة.
- **Existing tables**: التأمينية أعلاه تصلح كأساس؛ يلزم جداول حالة NPHIES (transaction id/status/bundle) — مؤجّل.
- **Required external party**: NPHIES (CCHI / مجلس الضمان الصحي) + شركات التأمين عبر المنصّة.
- **Required credentials**: تسجيل/Onboarding مع NPHIES؛ معرّفات منشأة + بيانات اعتماد المنصّة.
- **Required certificates**: شهادة رقمية (X.509) للتوقيع/الاتصال الآمن وفق متطلبات NPHIES (mTLS).
- **Required environment variables**: `NPHIES_BASE_URL`, `NPHIES_CLIENT_*`, مسار الشهادة — **كلها خارج Git، عبر نموذج الأسرار في التقرير 06**.
- **Requires DDL**: نعم (جداول معاملات/حالات NPHIES) — مؤجّل لبوابة مخصّصة.
- **Requires code deploy**: نعم (طبقة FHIR + بناء Bundles + توقيع + عميل آمن).
- **Requires test sandbox**: نعم — **NPHIES sandbox إلزامي قبل الإنتاج** (لا يُختبر على الإنتاج).
- **Risk**: **عالٍ** (PHI + مالي + امتثال تنظيمي + شهادات).
- **Readiness status**: **NOT_STARTED — BLOCKED_ON_ONBOARDING_AND_CERTS** (يعتمد أيضاً على نموذج الأسرار/المفتاح A3).
- **Next safe action**: (ورقي فقط) تحديد متطلبات onboarding مع NPHIES + قائمة الشهادات؛ لا كود حتى يوفّر المالك حساب sandbox + شهادة + نموذج أسرار آمن.

## ملاحظة الاعتماد
NPHIES يبني على FHIR (التقرير 02) ويتطلّب تخزيناً آمناً للشهادات/الأسرار — مرتبط بقرار KMS/مفتاح A3 (التقرير 06). لذا الترتيب المنطقي: نموذج أسرار → FHIR base → NPHIES sandbox.
