/**
 * public/js/clinical-pharmacy.js
 * Safe Clinical Pharmacy & FEFO Inventory Module for Multi-Facility Platform.
 * Handles medication safety review, batch expiry preview, and controlled substance alerts.
 */

window.PHARMACY_REVIEW_STATUSES = {
  DRAFT_ORDER: { id: 'draft', name_en: 'Draft Order', name_ar: 'طلب مسودة' },
  NEEDS_PHARMACIST_REVIEW: { id: 'review', name_en: 'Needs Pharmacist Review', name_ar: 'بحاجة لمراجعة الصيدلي' },
  SAFETY_WARNING: { id: 'warning', name_en: 'Safety Warning Triggered', name_ar: 'تنبيه سلامة مفعل' },
  READY_FOR_PREVIEW: { id: 'preview', name_en: 'Ready for Preview', name_ar: 'جاهز للمعاينة' },
  DISPENSE_DISABLED: { id: 'disabled', name_en: 'Dispense Blocked', name_ar: 'الصرف محظور' }
};

window.MOCK_MEDICATION_BATCHES = {
  'PARA500': [
    { batchCode: 'B-PR-982', expiryDate: '2026-08-30', quantity: 120, fefoRank: 1 },
    { batchCode: 'B-PR-441', expiryDate: '2027-02-15', quantity: 350, fefoRank: 2 }
  ],
  'AMO500': [
    { batchCode: 'B-AM-103', expiryDate: '2026-07-15', quantity: 80, fefoRank: 1 },
    { batchCode: 'B-AM-552', expiryDate: '2026-12-01', quantity: 200, fefoRank: 2 }
  ]
};

window.getFefoBatchPreview = function(medicationCode) {
  const batches = window.MOCK_MEDICATION_BATCHES[medicationCode] || [];
  // Sort by expiry date (FEFO: First Expired, First Out)
  return [...batches].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
};

window.getMedicationSafetyWarnings = function(medicationCode) {
  const warnings = [];
  if (medicationCode === 'AMO500') {
    warnings.push({
      type: 'allergy',
      text_en: 'Allergy Warning: Penicillin class drug. Cross-sensitivity risk.',
      text_ar: 'تنبيه حساسية: دواء من فئة البنسلين. خطر الحساسية المتقاطعة.'
    });
  }
  return warnings;
};

window.getControlledMedicationWarnings = function(medicationCode) {
  const warnings = [];
  if (medicationCode === 'MORPHINE' || medicationCode === 'FENTANYL') {
    warnings.push({
      type: 'controlled',
      text_en: 'Controlled Substance: Requires double-signature and narcotic prescription registration.',
      text_ar: 'مادة خاضعة للرقابة: تتطلب توقيعاً مزدوجاً وتسجيلاً في سجل الوصفات المخدرة.'
    });
  }
  return warnings;
};

window.canPreviewDispense = function(facilityType, deptPage, medicationCode) {
  const allowedDepts = window.getDepartmentsByFacilityType(facilityType);
  if (allowedDepts !== null && !allowedDepts.includes(deptPage)) {
    return false;
  }
  return true;
};

window.canFinalizeDispense = function(facilityType, deptPage, medicationCode) {
  // Always blocked in this simulation phase
  return false;
};
