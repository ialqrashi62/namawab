/**
 * public/js/clinical-results.js
 * Safe Clinical Results & Documentation Module for Multi-Facility Platform.
 * Manages clinical results, diagnostic reports, and SOAP notes.
 */

window.RESULT_TYPES = {
  LAB_RESULT: { id: 'lab', name_en: 'Laboratory Result', name_ar: 'نتائج المختبر' },
  RADIOLOGY_RESULT: { id: 'radiology', name_en: 'Radiology Report', name_ar: 'تقارير الأشعة' },
  PROCEDURE_NOTE: { id: 'procedure', name_en: 'Procedure Note', name_ar: 'ملاحظة الإجراء الطبي' },
  CONSULTATION_RESPONSE: { id: 'consultation', name_en: 'Consultation Response', name_ar: 'رد الاستشارة الطبية' },
  CLINICAL_NOTE: { id: 'note', name_en: 'Clinical Note', name_ar: 'الملاحظة السريرية' }
};

window.MOCK_RESULTS = {
  lab: [
    { code: 'CBC', name_en: 'Complete Blood Count', value: 'Hb: 14.2 g/dL (Normal)', status: 'Reviewed', abnormal: false },
    { code: 'LFT', name_en: 'Liver Function Test', value: 'ALT: 85 U/L (High)', status: 'Needs Review', abnormal: true }
  ],
  radiology: [
    { code: 'CXR', name_en: 'Chest X-Ray', value: 'Clear lung fields. No cardiomegaly.', status: 'Needs Review', abnormal: false },
    { code: 'CT_ABD', name_en: 'CT Abdomen', value: 'Mild splenomegaly noted.', status: 'Needs Review', abnormal: true }
  ],
  procedure: [
    { code: 'SUT1', name_en: 'Laceration Suture', value: '3 sutures applied to left forearm. Clean wound.', status: 'Draft', abnormal: false }
  ],
  consultation: [
    { code: 'CARD_CONS', name_en: 'Cardiology Consultation', value: 'Recommend ambulatory blood pressure monitoring.', status: 'Needs Review', abnormal: false }
  ]
};

window.getResultsForEncounter = function(facilityType, encounterTypeId) {
  // Returns allowed result types for the facility
  if (facilityType === 'health_unit') {
    return [window.RESULT_TYPES.LAB_RESULT, window.RESULT_TYPES.CLINICAL_NOTE];
  }
  if (facilityType === 'phc' || facilityType === 'polyclinic') {
    return [window.RESULT_TYPES.LAB_RESULT, window.RESULT_TYPES.RADIOLOGY_RESULT, window.RESULT_TYPES.CLINICAL_NOTE];
  }
  return Object.values(window.RESULT_TYPES);
};

window.getAbnormalResultWarnings = function(resultTypeCode, itemCode) {
  const warnings = [];
  const items = window.MOCK_RESULTS[resultTypeCode] || [];
  const result = items.find(x => x.code === itemCode);
  
  if (result && result.abnormal) {
    warnings.push({
      type: 'abnormal',
      text_en: 'Abnormal Finding: Immediate physician review and clinical correlation required.',
      text_ar: 'نتيجة غير طبيعية: تتطلب مراجعة فورية من الطبيب المعالج وتقييم الحالة سريرياً.'
    });
  }
  return warnings;
};

window.canAcknowledgeResult = function(facilityType, deptPage, resultTypeCode) {
  // Check if department has access
  const allowedDepts = window.getDepartmentsByFacilityType(facilityType);
  if (allowedDepts !== null && !allowedDepts.includes(deptPage)) {
    return false;
  }
  return true;
};
