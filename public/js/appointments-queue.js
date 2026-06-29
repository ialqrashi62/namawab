/**
 * public/js/appointments-queue.js
 * Safe Appointments & Patient Queue Module for Multi-Facility Platform.
 * Handles visit types, queue statuses, routing guards, and priority triage badges.
 */

window.APPOINTMENT_TYPES = {
  OPD_APPOINTMENT: { id: 'opd_app', name_en: 'OPD Appointment', name_ar: 'موعد العيادات الخارجية' },
  WALK_IN: { id: 'walk_in', name_en: 'Walk-In', name_ar: 'حضور بدون موعد' },
  ER_VISIT: { id: 'er_visit', name_en: 'ER Visit', name_ar: 'زيارة الطوارئ' },
  FOLLOW_UP: { id: 'follow_up', name_en: 'Clinical Follow-up', name_ar: 'متابعة سريرية' },
  INPATIENT_ADMISSION_REQUEST: { id: 'inpatient_adm', name_en: 'Inpatient Admission Request', name_ar: 'طلب تنويم داخلي' },
  INTERNAL_REFERRAL: { id: 'internal_ref', name_en: 'Internal Department Referral', name_ar: 'إحالة داخلية بين الأقسام' }
};

window.QUEUE_STATUSES = {
  SCHEDULED_PLACEHOLDER: { id: 'scheduled', name_en: 'Scheduled', name_ar: 'مجدول' },
  ARRIVED_PLACEHOLDER: { id: 'arrived', name_en: 'Arrived', name_ar: 'وصل للمستشفى' },
  WAITING_TRIAGE: { id: 'waiting_triage', name_en: 'Waiting Triage', name_ar: 'بانتظار الفرز' },
  WAITING_CLINIC: { id: 'waiting_clinic', name_en: 'Waiting Clinic', name_ar: 'بانتظار العيادة' },
  IN_ENCOUNTER: { id: 'in_encounter', name_en: 'In Encounter', name_ar: 'داخل المعاينة' },
  REFERRED_PLACEHOLDER: { id: 'referred', name_en: 'Referred', name_ar: 'تمت الإحالة' },
  ADMISSION_REQUESTED_PLACEHOLDER: { id: 'adm_requested', name_en: 'Admission Requested', name_ar: 'مطلوب التنويم' }
};

window.MOCK_QUEUE_DATA = [
  { queueNo: 'OPD-001', type: 'opd_app', status: 'waiting_triage', priority: 'normal', waitTimeMin: 15, deptPage: 14 },
  { queueNo: 'OPD-002', type: 'walk_in', status: 'waiting_clinic', priority: 'normal', waitTimeMin: 25, deptPage: 14 },
  { queueNo: 'ER-911', type: 'er_visit', status: 'waiting_triage', priority: 'high', waitTimeMin: 5, deptPage: 21 }
];

window.getAppointmentTypesForFacility = function(facilityType) {
  if (facilityType === 'health_unit') {
    return [window.APPOINTMENT_TYPES.OPD_APPOINTMENT, window.APPOINTMENT_TYPES.WALK_IN];
  }
  if (facilityType === 'phc' || facilityType === 'polyclinic') {
    return [window.APPOINTMENT_TYPES.OPD_APPOINTMENT, window.APPOINTMENT_TYPES.WALK_IN, window.APPOINTMENT_TYPES.FOLLOW_UP, window.APPOINTMENT_TYPES.INTERNAL_REFERRAL];
  }
  return Object.values(window.APPOINTMENT_TYPES);
};

window.canBookAppointmentPlaceholder = function(facilityType, deptPage, appointmentTypeId) {
  const allowedDepts = window.getDepartmentsByFacilityType(facilityType);
  if (allowedDepts !== null && !allowedDepts.includes(deptPage)) {
    return false;
  }

  // Prevent Inpatient Admission bookings in primary care / clinic facilities
  if (appointmentTypeId === 'inpatient_adm' && ['health_unit', 'phc', 'polyclinic'].includes(facilityType)) {
    return false;
  }

  return true;
};

window.getTriagePriorityBadges = function(priorityCode) {
  if (priorityCode === 'high') {
    return { class: 'danger', label_en: 'Urgent (Level 2)', label_ar: 'عاجل (المستوى 2)' };
  }
  return { class: 'info', label_en: 'Routine (Level 4)', label_ar: 'عادي (المستوى 4)' };
};
