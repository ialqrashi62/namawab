/**
 * public/js/clinical-billing.js
 * Safe Clinical Billing & Claims Module for Multi-Facility Platform.
 * Handles charge capture preview, insurance eligibility checklist, and NPHIES readiness validations.
 */

window.BILLING_STATUSES = {
  CHARGE_PREVIEW: { id: 'charge_prev', name_en: 'Charge Preview', name_ar: 'معاينة الرسوم' },
  DOCUMENTATION_MISSING: { id: 'doc_missing', name_en: 'Documentation Missing', name_ar: 'التوثيق ناقص' },
  ELIGIBILITY_PREVIEW: { id: 'elig_prev', name_en: 'Eligibility Preview', name_ar: 'معاينة الأهلية' },
  CLAIM_DRAFT: { id: 'claim_draft', name_en: 'Claim Draft', name_ar: 'مسودة المطالبة' },
  REVIEW_REQUIRED: { id: 'review_req', name_en: 'Review Required', name_ar: 'بحاجة لمراجعة' },
  SUBMISSION_DISABLED: { id: 'sub_disabled', name_en: 'Submission Disabled', name_ar: 'الإرسال معطل' }
};

window.MOCK_PAYERS = [
  { id: 'Tawuniya', name_en: 'Tawuniya Insurance', name_ar: 'التعاونية للتأمين' },
  { id: 'Bupa', name_en: 'Bupa Arabia', name_ar: 'بوبا العربية' },
  { id: 'Medgulf', name_en: 'Medgulf', name_ar: 'ميدغلف' }
];

window.MOCK_CHARGE_ITEMS = {
  consultation: { code: 'CONS_01', name_en: 'Consultation Fee', name_ar: 'رسوم المعاينة', price: 150 },
  cbc: { code: 'CBC', name_en: 'Complete Blood Count', name_ar: 'صورة دم كاملة', price: 100 },
  cxr: { code: 'CXR', name_en: 'Chest X-Ray', name_ar: 'أشعة سينية للصدر', price: 120 }
};

window.getChargeCapturePreview = function(encounterTypeId, itemsList = []) {
  const charges = [window.MOCK_CHARGE_ITEMS.consultation];
  itemsList.forEach(itemCode => {
    const item = Object.values(window.MOCK_CHARGE_ITEMS).find(x => x.code === itemCode);
    if (item) charges.push(item);
  });
  return charges;
};

window.getEligibilityPreview = function(payerId) {
  return {
    payerId: payerId,
    status: 'active',
    copayPercent: 10,
    maxLimit: 5000,
    warnings: []
  };
};

window.getClaimDraftPreview = function(encounterTypeId, charges = []) {
  const total = charges.reduce((sum, item) => sum + item.price, 0);
  return {
    status: 'Claim Draft Created',
    totalAmount: total,
    nphiesReady: false,
    warnings: ['Validation Warning: Simulated environment. Submission is disabled.']
  };
};

window.getMissingDocumentationWarnings = function(encounterTypeId, noteWritten) {
  const warnings = [];
  if (!noteWritten) {
    warnings.push({
      type: 'missing_soap',
      text_en: 'Missing Documentation: SOAP clinical note is required before billing.',
      text_ar: 'التوثيق ناقص: يجب كتابة الملاحظة الطبية SOAP قبل الفوترة.'
    });
  }
  return warnings;
};

window.getClaimValidationWarnings = function(charges) {
  const warnings = [];
  if (charges.length === 0) {
    warnings.push({
      type: 'no_charges',
      text_en: 'No billable charges captured for this encounter.',
      text_ar: 'لا توجد رسوم قابلة للفوترة لهذه الزيارة.'
    });
  }
  return warnings;
};

window.canCreateFinalInvoice = function(facilityType, deptPage) {
  return false;
};

window.canPostFinancialEntry = function(facilityType, deptPage) {
  return false;
};

window.canSubmitNphiesClaim = function(facilityType, deptPage) {
  return false;
};
