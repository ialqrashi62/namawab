# NM_NPHIES_SKILL

**الغرض**: تكامل NPHIES (أهلية/موافقة/مطالبات، FHIR KSA). **التفعيل**: بوابات NPHIES/التأمين الخارجي.

## الحالة: غير موجود؛ readiness/BLOCKED
- التأمين الحالي = CRUD داخلي (insurance_companies/contracts/policies/claims، FORCE RLS). لا أهلية/preauth/إرسال خارجي.
- المطلوب: طبقة FHIR (مبنية على D2) + KSA profiles + Bundles (Eligibility/PreAuth/Claim) + mTLS + onboarding NPHIES + جداول حالة المعاملات.

## القواعد + الحدود
شهادة X.509/mTLS في Vault/HSM. **ممنوع**: شهادة حقيقية، اتصال NPHIES، PHI حقيقي — بلا موافقة + sandbox. محجوب على: onboarding الطرف الخارجي + المرحلة 2 للمفاتيح + FHIR base. مخاطرة عالية (PHI + مالي + تنظيمي).

## حقول الإغلاق
`NPHIES_STATUS(readiness/BLOCKED) · REAL_CERT_USED(NO) · NPHIES_CALLS(NO) · REAL_PHI_USED(NO)`.
