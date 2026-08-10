/**
 * public/js/clinical-orders.js
 * Safe Clinical Orders Module for Multi-Facility Platform.
 * Manages clinical order types, catalog lookups, and safety warnings.
 */

window.ORDER_TYPES = {
  LAB: { id: 'lab', name_en: 'Laboratory Order', name_ar: 'طلب مختبر' },
  RADIOLOGY: { id: 'radiology', name_en: 'Radiology Order', name_ar: 'طلب أشعة' },
  MEDICATION: { id: 'medication', name_en: 'Medication Order', name_ar: 'وصفة دواء' },
  PROCEDURE: { id: 'procedure', name_en: 'Procedure Order', name_ar: 'طلب إجراء طبي' },
  CONSULTATION: { id: 'consultation', name_en: 'Consultation Order', name_ar: 'طلب استشارة طبية' }
};

window.MOCK_ORDER_CATALOG = {
  lab: [
    { code: 'CBC', name_en: 'Complete Blood Count', name_ar: 'صورة دم كاملة', risk: 'low' },
    { code: 'LFT', name_en: 'Liver Function Test', name_ar: 'وظائف الكبد', risk: 'low' },
    { code: 'BG', name_en: 'Blood Grouping', name_ar: 'تحديد فصيلة الدم', risk: 'low' }
  ],
  radiology: [
    { code: 'CXR', name_en: 'Chest X-Ray', name_ar: 'أشعة سينية للصدر', risk: 'low' },
    { code: 'MRI_BRAIN', name_en: 'Brain MRI', name_ar: 'رنين مغناطيسي للمخ', risk: 'medium' },
    { code: 'CT_ABD', name_en: 'CT Abdomen', name_ar: 'أشعة مقطعية للبطن', risk: 'medium' }
  ],
  medication: [
    { code: 'PARA500', name_en: 'Paracetamol 500mg', name_ar: 'باراسيتامول 500 ملغ', risk: 'low' },
    { code: 'AMO500', name_en: 'Amoxicillin 500mg', name_ar: 'أموكسيسيلين 500 ملغ', risk: 'medium' }
  ],
  procedure: [
    { code: 'SUT1', name_en: 'Laceration Suture', name_ar: 'خياطة جرح', risk: 'medium' },
    { code: 'LP', name_en: 'Lumbar Puncture', name_ar: 'بزل قطني', risk: 'high' }
  ],
  consultation: [
    { code: 'CARD_CONS', name_en: 'Cardiology Consultation', name_ar: 'استشارة أمراض قلب', risk: 'low' },
    { code: 'NEUR_CONS', name_en: 'Neurology Consultation', name_ar: 'استشارة أمراض مخ وأعصاب', risk: 'low' }
  ]
};

window.getOrderTypesForEncounter = function(facilityType, encounterTypeId) {
  if (facilityType === 'health_unit') {
    return [window.ORDER_TYPES.LAB, window.ORDER_TYPES.CONSULTATION];
  }
  if (facilityType === 'phc') {
    return [window.ORDER_TYPES.LAB, window.ORDER_TYPES.RADIOLOGY, window.ORDER_TYPES.CONSULTATION];
  }
  // General Hospital and Medical City allow all
  return Object.values(window.ORDER_TYPES);
};

window.canCreateOrderDraft = function(facilityType, deptPage, orderTypeId) {
  // Check if department is allowed
  const allowedDepts = window.getDepartmentsByFacilityType(facilityType);
  if (allowedDepts !== null && !allowedDepts.includes(deptPage)) {
    return false;
  }

  // Health Unit restricts advanced orders
  if (facilityType === 'health_unit' && ['radiology', 'procedure', 'medication'].includes(orderTypeId)) {
    return false;
  }

  // PHC restricts advanced procedures
  if (facilityType === 'phc' && orderTypeId === 'procedure') {
    return false;
  }

  return true;
};

window.getOrderSafetyWarnings = function(orderTypeCode, itemCode) {
  const warnings = [];
  if (orderTypeCode === 'medication') {
    warnings.push({
      type: 'allergy',
      text_en: 'Simulated Allergy Check: Please verify patient allergies before prescribing.',
      text_ar: 'فحص حساسية محاكى: يرجى التحقق من حساسية المريض قبل وصف الدواء.'
    });
  }
  
  // High risk procedures require consent
  const catalog = window.MOCK_ORDER_CATALOG[orderTypeCode] || [];
  const item = catalog.find(x => x.code === itemCode);
  if (item && item.risk === 'high') {
    warnings.push({
      type: 'consent',
      text_en: 'High-Risk Procedure: Signed Patient Consent Form is required.',
      text_ar: 'إجراء طبي ذو خطورة عالية: يتطلب توقيع نموذج موافقة المريض.'
    });
  }

  return warnings;
};
