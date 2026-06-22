# Phase 2 — جاهزية حضانة شهادات ZATCA / NPHIES (readiness فقط)

> تصميم جاهزية فقط. **ممنوع**: توليد CSR حقيقي، استخدام OTP، شهادة حقيقية، اتصال ZATCA/NPHIES.

## ZATCA Phase 2 — دورة حياة CSID/المفتاح الخاص
- **التوليد**: زوج مفاتيح + CSR للوحدة (EGS) ⟹ Compliance CSID ⟹ Production CSID عبر Fatoora. **المفتاح الخاص يُولَّد/يُحفظ داخل Vault PKI أو HSM** (لا يغادر الحدّ الآمن).
- **التوقيع**: ختم الفاتورة (XAdES) يتم بـsign-in-place داخل Vault/HSM ⟹ التطبيق يرسل البيانات ويستلم التوقيع، لا يرى المفتاح.
- **CSR/OTP boundaries**: OTP من بوابة Fatoora يُدخله المالك في إجراء محكوم؛ لا يُطبع/يُلتزَم؛ CSR يُولّد عند التنفيذ المعتمد فقط (ليس الآن).
- **التجديد/التدوير**: مراقبة انتهاء CSID + تجديد مجدول عبر Vault/HSM.

## NPHIES — دورة حياة mTLS/الشهادة
- **الحضانة**: شهادة العميل + مفتاحها الخاص في Vault/HSM؛ mTLS handshake عبر sign-in-place أو وكيل TLS يقرأ من المخزن.
- **التجديد**: مراقبة انتهاء + تجديد عبر CA المعتمدة.
- **الفصل**: شهادات sandbox منفصلة تماماً عن production (مخازن/مسارات مختلفة).

## ضوابط عامة (لكليهما)
- sandbox/prod منفصلان (مخزن مفاتيح + endpoints مختلفة).
- تدقيق كل استخدام مفتاح/توقيع (من، متى، أي مورد) بلا PHI.
- secret rotation مجدول + break-glass موثّق.
- لا مفتاح خاص/شهادة في Git/.env/سجلّات.

## الحالة (محجوب على البنية + الطرف الخارجي)
```text
ZATCA_PHASE2_CERT_READINESS: DESIGNED (BLOCKED_PENDING_KEY_INFRASTRUCTURE + Fatoora onboarding)
NPHIES_MTLS_READINESS: DESIGNED (BLOCKED_PENDING_KEY_INFRASTRUCTURE + NPHIES onboarding)
CSR_GENERATED: NO | OTP_USED: NO | REAL_CERT_USED: NO | ZATCA_CALLS: NO | NPHIES_CALLS: NO
```
كلاهما يعتمد على اختيار مزوّد Phase 2 (Vault/HSM) — لا يبدأ التنفيذ قبله + onboarding الطرف الخارجي.
