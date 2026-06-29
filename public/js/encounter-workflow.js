/**
 * public/js/encounter-workflow.js
 * Safe Encounter Workflow Module for Multi-Facility Platform.
 * Contains encounter types, journey steps, and access validation rules.
 */

window.ENCOUNTER_TYPES = {
  OPD: { id: 'opd', name_en: 'Outpatient Department', name_ar: 'العيادات الخارجية' },
  INPATIENT: { id: 'inpatient', name_en: 'Inpatient Admission', name_ar: 'التنويم الداخلي' },
  ER_OBSERVATION: { id: 'er_obs', name_en: 'ER Observation', name_ar: 'ملاحظة الطوارئ' },
  DAY_CASE: { id: 'day_case', name_en: 'Day Case Surgery', name_ar: 'جراحة اليوم الواحد' }
};

window.getEncounterTypesForFacility = function(facilityType) {
  if (facilityType === 'health_unit') {
    return [window.ENCOUNTER_TYPES.OPD];
  }
  if (facilityType === 'phc' || facilityType === 'polyclinic') {
    return [window.ENCOUNTER_TYPES.OPD];
  }
  // General Hospital and Medical City allow all
  return Object.values(window.ENCOUNTER_TYPES);
};

window.canOpenEncounterForDepartment = function(facilityType, deptPage, encounterTypeId) {
  // Check if department itself is allowed in the facility
  const allowedDepts = window.getDepartmentsByFacilityType(facilityType);
  if (allowedDepts !== null && !allowedDepts.includes(deptPage)) {
    return false;
  }

  // Hospital-only inpatient rule
  if (encounterTypeId === 'inpatient') {
    if (['health_unit', 'phc', 'polyclinic'].includes(facilityType)) {
      return false;
    }
  }
  return true;
};

window.getEncounterJourneySteps = function(encounterTypeId) {
  if (encounterTypeId === 'inpatient') {
    return [
      { step: 1, name_en: 'Admission Request', name_ar: 'طلب التنويم' },
      { step: 2, name_en: 'Bed Assignment', name_ar: 'تخصيص السرير' },
      { step: 3, name_en: 'Nursing Assessment', name_ar: 'التقييم التمريضي' },
      { step: 4, name_en: 'Physician Rounds', name_ar: 'المرور الطبي اليومي' },
      { step: 5, name_en: 'Discharge Planning', name_ar: 'خطة الخروج' }
    ];
  }
  // Default OPD Journey
  return [
    { step: 1, name_en: 'Registration / Triage', name_ar: 'التسجيل والفرز' },
    { step: 2, name_en: 'Nursing Vitals', name_ar: 'العلامات الحيوية' },
    { step: 3, name_en: 'Doctor Consultation', name_ar: 'معاينة الطبيب' },
    { step: 4, name_en: 'Prescription / Referrals', name_ar: 'الوصفة الطبية والإحالة' }
  ];
};

window.getEncounterWorkspaceCards = function(encounterTypeId) {
  return [
    { id: 'overview', name_en: 'Encounter Overview', name_ar: 'نظرة عامة على الزيارة' },
    { id: 'triage', name_en: 'Nursing Assessment & Vitals', name_ar: 'التقييم التمريضي والعلامات الحيوية' },
    { id: 'assessment', name_en: 'Clinical Assessment & SOAP', name_ar: 'التقييم الطبي والمعاينة السريرية' },
    { id: 'orders', name_en: 'Orders (Labs/Radiology/Meds)', name_ar: 'الطلبات (المختبر/الأشعة/الأدوية)' },
    { id: 'discharge', name_en: 'Discharge Summary / Follow-up', name_ar: 'ملخص الخروج والمتابعة' }
  ];
};
