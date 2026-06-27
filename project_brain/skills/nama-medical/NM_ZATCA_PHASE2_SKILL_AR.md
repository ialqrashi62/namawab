# NM_ZATCA_PHASE2_SKILL

**الغرض**: الفوترة الإلكترونية ZATCA Phase 2. **التفعيل**: بوابات ZATCA.

## الحالة: محاكاة Phase 1 فقط؛ Phase 2 = readiness/BLOCKED
- الحالي: `/api/zatca/generate` يولّد base64-JSON كـ"QR" (ليس مطابقاً)، `zatca_invoices` (0 صف).
- المطلوب لـPhase 2: TLV Base64 QR (5 حقول + hash + توقيع + مفتاح عام + ختم) · فاتورة UBL 2.1 XML · CSID (EGS onboarding + CSR + OTP من Fatoora → Compliance ثم Production CSID) · clearance/reporting API · PIH/ICV.

## القواعد + الحدود
المفتاح الخاص/CSID في **Vault-PKI/HSM** (sign-in-place)، لا DPAPI للإنتاج. **ممنوع**: توليد CSR حقيقي، OTP، شهادة حقيقية، اتصال ZATCA — بلا موافقة. sandbox/prod منفصلان. محجوب على المرحلة 2 للمفاتيح + Fatoora sandbox.

## حقول الإغلاق
`ZATCA_PHASE2_STATUS(readiness/BLOCKED) · CSR_GENERATED(NO) · OTP_USED(NO) · REAL_CERT_USED(NO) · ZATCA_CALLS(NO)`.
