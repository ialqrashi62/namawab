# Phase B — جاهزية ZATCA Phase 2 (الفوترة الإلكترونية)

> Discovery فقط. لا استدعاء Fatoora حقيقي، لا كود، لا شهادات، لا أسرار.

## الوضع الحالي (محاكاة Phase 1-ish)
- **Current implementation**: `POST /api/zatca/generate` يحسب VAT (15%) ويولّد **"QR" = base64 لكائن JSON** ({seller, vat, date, total, vatAmount})، ويخزّن صفاً في `zatca_invoices` بحالة `Generated`. `GET /api/zatca/invoices` يعرضها.
- **Existing routes/files**: `server.js` (`/api/zatca/generate`, `/api/zatca/invoices`).
- **Existing tables**: `zatca_invoices` (invoice_id, invoice_number, seller_name/vat, buyer_name, totals, qr_code, submission_status). `company_settings` يحوي `company_name`/`vat_number`.
- **الفجوات مقابل Phase 2 (إلزامية للامتثال)**:
  1. **QR غير مطابق**: المطلوب **TLV (Tag-Length-Value) Base64** بالحقول الخمسة (اسم البائع، الرقم الضريبي، الطابع الزمني، الإجمالي مع الضريبة، مبلغ الضريبة) + للـPhase 2: hash + التوقيع + المفتاح العام + ختم ZATCA. الحالي JSON-base64 فقط.
  2. **فاتورة XML (UBL 2.1)**: غير موجودة.
  3. **الختم التشفيري (cryptographic stamp) + CSID**: غير موجود (يتطلب EGS onboarding، CSR، Compliance CSID ثم Production CSID عبر Fatoora API).
  4. **Clearance/Reporting API**: لا استدعاء فعلي لـZATCA.
  5. **عدّاد/سلسلة hash (PIH/ICV)**: غير موجود.

## المتطلبات للترقية
- **Required external party**: ZATCA (هيئة الزكاة والضريبة والجمارك) عبر منصّة Fatoora.
- **Required credentials**: EGS unit onboarding؛ OTP من بوابة Fatoora؛ Compliance ثم Production CSID.
- **Required certificates**: CSR → شهادة من ZATCA (PCSID)؛ مفتاح خاص يُخزَّن بأمان.
- **Required environment variables**: `ZATCA_BASE_URL`, `ZATCA_CSID_*`, مسار الشهادة/المفتاح — **خارج Git، عبر نموذج الأسرار (التقرير 06)**.
- **Requires DDL**: محتمل (أعمدة XML/UUID/PIH/hash/clearance_status على `zatca_invoices`) — مؤجّل.
- **Requires code deploy**: نعم (UBL XML builder + TLV QR + توقيع تشفيري + عميل Fatoora).
- **Requires test sandbox**: نعم — **بيئة ZATCA Compliance/Simulation إلزامية** قبل الإنتاج.
- **Risk**: **عالٍ** (مالي + تنظيمي + تشفيري؛ المفتاح الخاص حسّاس).
- **Readiness status**: **PARTIAL (محاكاة موجودة) — Phase 2 NOT_STARTED، BLOCKED_ON_CSID_AND_KEY_STORAGE**.
- **Next safe action**: (ورقي) تحديد متطلبات EGS onboarding + قائمة الحقول المطابقة لـTLV/UBL؛ لا كود حتى يوفّر المالك حساب Fatoora sandbox + نموذج تخزين آمن للمفتاح الخاص (يرتبط بقرار A3/KMS).

## اعتماد حرج
الختم التشفيري يتطلّب تخزيناً آمناً لمفتاح خاص — **نفس تبعية مفتاح A3** (التقرير 06). تخزينه نصاً على القرص = مخاطرة امتثال. لذا ZATCA Phase 2 لا يبدأ قبل حسم نموذج المفتاح.
