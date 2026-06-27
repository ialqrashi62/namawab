# ZATCA / NPHIES — الحدود عبر Vault (بلا CSR/OTP/شهادات حقيقية)

> readiness فقط. مهارات: NM_ZATCA_PHASE2, NM_NPHIES. ممنوع: توليد CSR حقيقي، OTP، شهادة حقيقية، اتصال ZATCA/NPHIES.

## ZATCA Phase 2 (عبر Vault PKI/transit)
- المفتاح الخاص لـCSID يُولَّد/يُحفظ في Vault (`pki-zatca/` أو `transit`)؛ **التوقيع sign-in-place** — المفتاح لا يُصدَّر للتطبيق.
- CSR/OTP: يُنفَّذان عند التنفيذ المعتمد فقط (بوابة + onboarding Fatoora)؛ OTP يُدخله المالك في إجراء محكوم، لا يُطبع/يُلتزَم.
- محجوب على: Vault مُشغّل + Fatoora sandbox + موافقة. **لا اتصال ZATCA في هذه البوابة.**

## NPHIES (عبر Vault PKI)
- شهادة mTLS ومفتاحها الخاص في Vault (`pki-nphies/`)؛ mTLS handshake عبر sign-in-place/وكيل يقرأ من Vault.
- محجوب على: onboarding NPHIES + شهادة X.509 + Vault مُشغّل + sandbox. **لا اتصال NPHIES في هذه البوابة.**

## ضوابط مشتركة
sandbox/prod منفصلان (mounts/policies)؛ تدقيق كل توقيع/استخدام؛ تدوير + تجديد مجدول؛ break-glass؛ لا مفتاح خاص/شهادة في git/.env/سجلّات.
```text
ZATCA_PHASE2: BLOCKED_PENDING_KEY_INFRASTRUCTURE + Fatoora onboarding | CSR_GENERATED: NO | OTP_USED: NO | ZATCA_CALLS: NO
NPHIES: BLOCKED_PENDING_KEY_INFRASTRUCTURE + NPHIES onboarding | REAL_CERT_USED: NO | NPHIES_CALLS: NO
```
